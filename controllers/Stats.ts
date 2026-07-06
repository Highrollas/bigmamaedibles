import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/Order";
import Products from "@/models/Products";
import { startOfMonth } from "date-fns";
import { OrderObj, ProductObj } from "@/Interface";
import { getAdminFromSession } from "@/app/Helper/server";
import { FREE_DELIVERY_MIN_AMOUNT, POST_OFFICE_PARCEL_COST, STATS_START_DATE_ISO } from "@/constants";

export const getAdminDashboardStats = async (req: NextRequest) => {

      const admin = await getAdminFromSession();

      if (!admin) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }

      try {
            const searchParams = req.nextUrl.searchParams;
            const dateStartStr = searchParams.get("dateStart");
            const dateEndStr = searchParams.get("dateEnd");
            const shouldStartFromReset = searchParams.get("startFromReset") === "true";

            let dateStart: Date | null = null;
            let dateEnd: Date | null = null;
            let dateFilter: Record<string, unknown> | undefined;
            const statsStartDate = new Date(STATS_START_DATE_ISO);
            const clampToStatsStart = (date: Date) => date < statsStartDate ? statsStartDate : date;

            if (dateStartStr === "all" && dateEndStr === "all") {
                  // All-time → no date filter
                  if (shouldStartFromReset) {
                        dateStart = statsStartDate;
                        dateEnd = new Date();
                        dateFilter = { $gte: dateStart, $lte: dateEnd };
                  } else {
                        dateFilter = undefined;
                  }
            } else if (dateStartStr && dateEndStr) {
                  // Both provided
                  dateStart = shouldStartFromReset ? clampToStatsStart(new Date(dateStartStr)) : new Date(dateStartStr);
                  dateEnd = new Date(dateEndStr);
                  dateFilter = { $gte: dateStart, $lte: dateEnd };
            } else {
                  // Default: first of month to now
                  dateStart = shouldStartFromReset ? clampToStatsStart(startOfMonth(new Date())) : startOfMonth(new Date());
                  dateEnd = new Date();
                  dateFilter = { $gte: dateStart, $lte: dateEnd };
                  console.log("No date range provided, using default: ", dateStart, " to ", dateEnd);
            }

            // Build query
            const query: Record<string, unknown> = {
                  status: { $in: ["completed", "processing", "on-hold"] }
            };

            if (admin.accessLevel != "AA") {
                  query.isPatched = { $ne: true };
            }

            if (dateFilter) {
                  query.orderFilled = dateFilter;
            }

            // Fetch orders in selected period
            const ordersInRange = await Order.find(query).lean<OrderObj[]>();

            // 🧠 Collect all unique product IDs needed
            const productIds = [
                  ...getAllProductIds(ordersInRange)
            ];
            const uniqueProductIds = Array.from(new Set(productIds));

            // Fetch products once
            const products = await Products.find({ _id: { $in: uniqueProductIds } })
                  .lean<ProductObj[]>()
                  .select("_id costPrice");
            const productMap = new Map(products.map(p => [p._id.toString(), p]));

            // Compute stats
            const periodStats = calcTotals(ordersInRange, productMap);

            let orderPackagingCost = 0;
            let productPackagingCost = 0;

            for (const order of ordersInRange) {
                  let productCount = 0;

                  for (const item of order.cartItems) {
                        if (item.productType === "Bundles" && item.bundleVariation?.selectFields?.length) {
                              productCount += item.bundleVariation.selectFields.length * item.cartQty;
                        } else if (item.productType === "CheekyDeals" && item.cheekyVariation?.length) {
                              for (const varItem of item.cheekyVariation) {
                                    productCount += varItem.selectFields.length * item.cartQty;
                              }
                        } else {
                              productCount += item.cartQty;
                        }
                  }

                  orderPackagingCost += 0.40;
                  productPackagingCost += productCount * 0.12;
            }

            // Prior orders before selected period → to detect new users
            const allPrevOrders = dateStart
                  ? await Order.find({
                        orderFilled: shouldStartFromReset
                              ? { $gte: statsStartDate, $lt: dateStart }
                              : { $lt: dateStart }
                  }).lean().select("billingObj.email")
                  : [];
            const prevEmails = new Set<string>(allPrevOrders.map(o => o.billingObj?.email));

            const newUsersCount = [...periodStats.uniqueEmails].filter(email => !prevEmails.has(email)).length;

            // ✅ Count users who ordered more than once (all time)
            const emailOrderCount = new Map<string, number>();
            for (const order of ordersInRange) {
                  const email = order.billingObj?.email;
                  if (!email) continue;
                  emailOrderCount.set(email, (emailOrderCount.get(email) || 0) + 1);
            }

            const emailsWithMoreThanOneOrder = Array.from(emailOrderCount.entries())
                  .filter(([, count]) => count > 1)
                  .map(([email]) => email);

            return NextResponse.json({
                  status: "success",
                  stats: {
                        totalOrders: periodStats.totalOrders,
                        totalRevenue: periodStats.totalRevenue,
                        costOfProducts: periodStats.costOfProducts,
                        netProfit: periodStats.netProfit,
                        totalProfit: periodStats.netProfit,
                        postOfficeFromRevenue: periodStats.postOfficeFromRevenue,
                        postOfficeFromProfit: periodStats.postOfficeFromProfit,
                        postOfficeTotal: periodStats.postOfficeTotal,
                        newUsers: newUsersCount,
                        usersWithMultipleOrders: emailsWithMoreThanOneOrder.length || 0,
                        orderPackagingCost: orderPackagingCost.toFixed(2),
                        productPackagingCost: productPackagingCost.toFixed(2)
                  }
            });

      } catch (error) {
            console.error("Error @getAdminDashboardStats", error);
            return NextResponse.json(
                  { status: "failed", message: "Unable to fetch stats" },
                  { status: 500 }
            );
      }
};

// 🧩 Gather all product IDs needed from orders
const getAllProductIds = (orders: OrderObj[]): string[] => {
      const ids = new Set<string>();
      for (const order of orders) {
            for (const item of order.cartItems) {
                  if (item.productType === "Bundles" && item.bundleVariation?.selectFields) {
                        item.bundleVariation.selectFields.forEach(f => ids.add(f.productId));
                  } else if (item.productType === "CheekyDeals" && item.cheekyVariation?.length) {
                        item.cheekyVariation.forEach(v =>
                              v.selectFields.forEach(f => ids.add(f.productId))
                        );
                  } else if (item.productObj?._id) {
                        ids.add(item.productObj._id.toString());
                  }
            }
      }
      return Array.from(ids);
};

// 🧮 Pure function: compute totals
const calcTotals = (
      orders: OrderObj[],
      productMap: Map<string, ProductObj>
) => {
      let totalOrders = 0;
      let totalRevenue = 0;
      let costOfProducts = 0;
      let postOfficeFromRevenue = 0;
      let postOfficeFromProfit = 0;
      const uniqueEmails = new Set<string>();

      for (const order of orders) {
            const amountTotal = parseFloat(order.amountTotal || "0");
            const productSubtotal = parseFloat(order.amountSubTotal || order.amountTotal || "0");
            // const useBalance = parseFloat(order.useBalance || "0");
            let totalCost = 0;

            for (const item of order.cartItems) {
                  let itemCost = 0;

                  if (item.productType === "Bundles" && item.bundleVariation?.selectFields?.length) {
                        for (const f of item.bundleVariation.selectFields) {
                              const p = productMap.get(f.productId);
                              if (p) itemCost += parseFloat(p.costPrice || "0");
                        }
                        itemCost *= item.cartQty;
                  } else if (item.productType === "CheekyDeals" && item.cheekyVariation?.length) {
                        for (const varItem of item.cheekyVariation) {
                              for (const f of varItem.selectFields) {
                                    const p = productMap.get(f.productId);
                                    if (p) itemCost += parseFloat(p.costPrice || "0");
                              }
                        }
                        itemCost *= item.cartQty;
                  } else {
                        const p = productMap.get(item.productObj._id.toString());
                        if (p) itemCost = parseFloat(p.costPrice || "0") * item.cartQty;
                  }

                  totalCost += itemCost;
            }

            totalOrders++;
            totalRevenue += amountTotal;
            costOfProducts += totalCost;

            if (productSubtotal < FREE_DELIVERY_MIN_AMOUNT) {
                  postOfficeFromRevenue += POST_OFFICE_PARCEL_COST;
            } else {
                  postOfficeFromProfit += POST_OFFICE_PARCEL_COST;
            }

            if (order.billingObj?.email) uniqueEmails.add(order.billingObj.email);
      }

      const netProfit = totalRevenue - costOfProducts;
      const postOfficeTotal = postOfficeFromRevenue + postOfficeFromProfit;

      return {
            totalOrders,
            totalRevenue,
            costOfProducts,
            netProfit,
            postOfficeFromRevenue,
            postOfficeFromProfit,
            postOfficeTotal,
            uniqueEmails
      };
};
