/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAdminFromSession, getUserFromSession, payOrderCommission, reduceOrderItemsStock, refundOrderCommission, rollbackOrderUsedParams } from "@/app/Helper/server";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";
import { filterQuery, OrderObj } from '@/Interface';
import { sendFirstErrorMessage } from "@/app/Helper";
import { OrderUpdateSchema } from "@/schema";
import { sendEmail } from "@/libs/emailService";
import { TEMPLATE_MAP } from "@/constants";

export const fetchUserOrders = async () => {

      try {

            const user = await getUserFromSession();
            if (!user) {
                  return NextResponse.json({
                        status: "failed",
                        message: "Auth Error"
                  }, { status: 401 });
            }

            const orders = await Order.find({
                  $and: [
                        {
                              $or: [
                                    { 'billingObj.email': user.email }
                              ]
                        },
                        { status: { $in: ['on-hold', 'cancelled', 'processing', 'completed'] } }
                  ]
            })
                  .sort({ createdAt: -1 })
                  .lean()
                  .limit(20);

            return NextResponse.json({
                  status: "success",
                  orders
            });

      } catch (error) {
            console.error("Error @fetchUserOrders", error);
            return NextResponse.json({
                  status: "failed",
                  message: "Internal server error"
            }, { status: 500 });
      }
};

export const adminFetchOrders = async (request: NextRequest) => {
      const admin = await getAdminFromSession();

      if (!admin) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
      }

      const searchParams = request.nextUrl.searchParams;

      const query: filterQuery = {
            page: parseInt(searchParams.get("page") || "1", 10),
            itemsPerPage: parseInt(searchParams.get("itemsPerPage") || "20", 10),
            nameSearch: searchParams.get("nameSearch") || undefined,
            orderStatus: searchParams.get("orderStatus") || undefined,
            dateStart: searchParams.get("dateStart")
                  ? new Date(searchParams.get("dateStart")!)
                  : undefined,
            dateEnd: searchParams.get("dateEnd")
                  ? new Date(searchParams.get("dateEnd")!)
                  : undefined,
      };

      // --- Base Filter ---
      const filter: Record<string, any> = {
            status: { $in: ["on-hold", "cancelled", "completed", "pending", "processing"] },
      };

      // --- Name Search ---
      if (query.nameSearch && query.nameSearch !== "") {
            const regex = { $regex: query.nameSearch, $options: "i" };
            filter["$or"] = [
                  { orderId: regex },
                  { "billingObj.addressObj.postcode": regex },
                  { "billingObj.firstName": regex },
                  { "billingObj.lastName": regex },
                  { "billingObj.email": regex },
                  {
                        $expr: {
                              $regexMatch: {
                                    input: { $concat: ["$billingObj.firstName", " ", "$billingObj.lastName"] },
                                    regex: query.nameSearch,
                                    options: "i",
                              },
                        },
                  },
            ];
      }

      // --- Date Range ---
      if (query.dateStart && query.dateEnd) {
            filter.createdAt = { $gte: query.dateStart, $lte: query.dateEnd };
      }

      // --- Status Logic ---
      const status = query.orderStatus || "all";

      // Apply status filter normally (for specific statuses)
      if (status !== "all" && status !== "") {
            filter.status = status;
      }

      // --- Access-Level Logic ---
      if (status === "cancelled") {
            // ✅ Cancelled filter: for non-AA, include patched too
            if (admin.accessLevel !== "AA" && admin.accessLevel !== "D") {
                  delete filter.status;
                  filter.$or = [{ status: "cancelled" }, { isPatched: true }];
            }
      }
      else if (status === "all") {
            // ✅ For "all", exclude cancelled for everyone
            filter.status = { $ne: "cancelled" };

            // 🚫 For non-AA, also hide patched
            if (admin.accessLevel !== "AA" && admin.accessLevel !== "D") {
                  filter.isPatched = { $ne: true };
            }
      }
      else {
            // 🚫 For non-AA and specific statuses, hide patched
            if (admin.accessLevel !== "AA" && admin.accessLevel !== "D") {
                  filter.isPatched = { $ne: true };
            }
      }

      // --- Pagination ---
      const page = query.page;
      const limit = query.itemsPerPage;
      const skip = (page - 1) * limit;

      // --- Aggregation ---
      const pipeline = [
            { $match: filter },
            { $sort: { orderFilled: -1, createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },

            {
                  $lookup: {
                        from: "orders",
                        let: { email: "$billingObj.email" },
                        pipeline: [
                              { $match: { $expr: { $eq: ["$billingObj.email", "$$email"] } } },
                              { $sort: { createdAt: 1 } },
                              { $limit: 1 },
                              { $project: { _id: 0, firstOrderDate: "$createdAt" } },
                        ],
                        as: "firstOrder",
                  },
            },
            {
                  $addFields: {
                        isFirstTime: {
                              $cond: [
                                    {
                                          $and: [
                                                { $ne: ["$status", "cancelled"] },
                                                { $ne: ["$status", "pending"] },
                                                {
                                                      $eq: [
                                                            { $arrayElemAt: ["$firstOrder.firstOrderDate", 0] },
                                                            "$createdAt"
                                                      ]
                                                }
                                          ]
                                    },
                                    true,
                                    false
                              ]
                        }
                  }
            }
      ];

      // --- Fetch Orders ---
      const orders = await Order.aggregate(pipeline as any);

      // --- Post Processing ---
      let processedOrders = orders;

      // Mask patched orders for non-AA admins
      if (admin.accessLevel !== "AA" && admin.accessLevel !== "D") {
            processedOrders = orders.map((order) => {
                  if (order.isPatched) {
                        const updated = { ...order, status: "cancelled" };
                        delete updated.isPatched;
                        return updated;
                  }
                  return order;
            });
      }

      // --- Response ---
      return NextResponse.json({ status: "success", orders: processedOrders });
};


export const updateOrder = async (req: NextRequest) => {

      if (!await getAdminFromSession()) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }

      try {
            const body = await req.json();
            const result = OrderUpdateSchema.safeParse(body);

            if (!result.success) {
                  return NextResponse.json({
                        status: "failed",
                        message: sendFirstErrorMessage(result),
                  },
                        { status: 400 }
                  );
            }

            const { _id, billingObj, status, createdAt } = result.data;

            const existingOrder = await Order.findById(_id).lean<OrderObj>();
            if (!existingOrder) {
                  return NextResponse.json(
                        {
                              status: "failed",
                              message: "Order not found.",
                        },
                        { status: 404 }
                  );
            }

            const updated = await Order.findByIdAndUpdate(
                  _id, { $set: { billingObj, createdAt: new Date(createdAt) } },
                  { new: true, runValidators: true }
            ).lean<OrderObj>();

            await setOrderStatus({ orderId: updated!.orderId, status });

            const updatedOrder = await Order.findById(_id).lean<OrderObj>();

            return NextResponse.json({
                  status: "success",
                  message: "Order updated successfully.",
                  order: updatedOrder,
            });

      } catch (error) {
            console.error("Error @updateOrder", error);
            return NextResponse.json(
                  {
                        status: "failed",
                        message: "Internal server error",
                  },
                  { status: 500 }
            );
      }
};

export const setOrderStatus = async ({ orderId, status, isPatched = false }: { orderId: string; status: string, isPatched?: boolean }) => {

      try {

            const existingOrder = await Order.findOne({ orderId }).lean<OrderObj>();
            if (!existingOrder) {
                  return true
            }

            const currentStatus = existingOrder.status;
            if (currentStatus === status) {
                  return true;
            }

            const updateObj: Record<string, unknown> = { status, updatedAt: new Date() };
            if (isPatched) updateObj.isPatched = true;

            if (status.toLocaleLowerCase() === "on-hold") {
                  updateObj.orderFilled = new Date();
            }

            const updated = await Order.findOneAndUpdate(
                  { orderId },
                  { $set: updateObj },
                  { new: true, runValidators: true }
            ).lean<OrderObj>();

            if (status.toLocaleLowerCase() === "on-hold") {
                  reduceOrderItemsStock(existingOrder);
                  if (currentStatus === "pending" || currentStatus === "cancelled") {
                        payOrderCommission(existingOrder);

                        //dhl logic here
                  }
            }

            if (status.toLocaleLowerCase() === "cancelled") {
                  rollbackOrderUsedParams(existingOrder);
                  if (currentStatus === "on-hold") {
                        refundOrderCommission(existingOrder);
                  }

                  // Check if user has another successful order on the same day
                  const orderDate = new Date(updated!.createdAt);
                  const dayStart = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate(), 0, 0, 0, 0);
                  const dayEnd = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate(), 23, 59, 59, 999);

                  const hasPaidOrder = await Order.findOne({
                        'billingObj.email': updated!.billingObj.email,
                        status: { $in: ['completed', 'on-hold', 'processing'] },
                        _id: { $ne: updated!._id },
                        createdAt: { $gte: dayStart, $lte: dayEnd }
                  }).lean();

                  if (hasPaidOrder) {
                        // Skip email notification if user has another successful order today
                        return { success: true, order: updated };
                  }
            }

            const emailConfig = TEMPLATE_MAP[status.toLowerCase()];

            if (emailConfig && updated) {
                  sendEmail({
                        to: updated.billingObj.email,
                        from: "order",
                        subject: emailConfig.subject,
                        template: emailConfig.template,
                        data: {
                              checkoutObj: updated,
                        },
                  });
            }

            return { success: true, order: updated };

      } catch (error) {
            console.warn("error settings order data", error);
            return { success: false };
      }
};

export const deleteOrder = async (req: NextRequest) => {

      if (!await getAdminFromSession()) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }

      const searchParams = req.nextUrl.searchParams;
      const _id = searchParams.get('id');

      if (!_id) {
            return NextResponse.json({
                  status: 'failed',
                  message: 'Order ID is required for deletion.'
            }, { status: 400 });
      }

      const existing = await Order.findById(_id);

      if (!existing) {
            return NextResponse.json({
                  status: 'failed',
                  message: 'Order not found.'
            }, { status: 404 });
      }

      await Order.findByIdAndDelete(_id);

      return NextResponse.json({
            status: 'success'
      });
};


export const cancelLateOrder = async () => {

      const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);

      const lateOrders = await Order.find({
            status: 'pending',
            createdAt: { $lt: threeHoursAgo }
      }).lean<OrderObj[]>();

      for (const order of lateOrders) {

            await setOrderStatus({ orderId: order.orderId, status: 'cancelled' });
      }

      return true;
};

export const autoDeliverShippedOrders = async () => {

      const ninetySixHoursAgo = new Date(Date.now() - 96 * 60 * 60 * 1000);

      const shippedOrders = await Order.find({
            status: 'processing',
            updatedAt: { $lte: ninetySixHoursAgo }
      })
            .select('orderId')
            .lean<OrderObj[]>();

      for (const order of shippedOrders) {
            await setOrderStatus({ orderId: order.orderId, status: 'completed' });
      }

      return true;
};


export const bulkUpdateOrderStatus = async (req: NextRequest) => {


      try {

            if (!await getAdminFromSession()) {
                  return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
            }

            const body = await req.json();

            const ids: string[] = body.ids;
            const status: string = body.status;

            if (!Array.isArray(ids) || !status) {
                  return NextResponse.json({
                        status: "failed",
                        message: "Invalid payload",
                  }, { status: 400 });
            }

            const orders = await Order.find({ _id: { $in: ids } }).lean<OrderObj[]>();

            for (const order of orders) {

                  setOrderStatus({ orderId: order.orderId, status });

            }

            return NextResponse.json({
                  status: "success",
                  message: "Order statuses updated successfully",
            });

      } catch (err: any) {
            console.error("bulkUpdateOrderStatus error:", err.message);
            return NextResponse.json({
                  status: "failed",
                  message: "Internal server error",
            }, { status: 500 });
      }
};

export const sendTrustPilotMessage = async () => {

      try {

            const now = new Date();
            const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

            // get year/month/date of that day
            const y = threeDaysAgo.getUTCFullYear();
            const m = threeDaysAgo.getUTCMonth();
            const d = threeDaysAgo.getUTCDate();

            const startOfDay = new Date(Date.UTC(y, m, d, 0, 0, 0, 0));
            const endOfDay = new Date(Date.UTC(y, m, d, 23, 59, 59, 999));

            // fetch orders delivered exactly 3 days ago
            const orders = await Order.find({
                  status: "completed",
                  updatedAt: { $gte: startOfDay.toISOString(), $lte: endOfDay.toISOString() }
            })
                  .select("billingObj.email billingObj.firstName billingObj.lastName")
                  .lean();

            // collect customers as array of objects
            // e.g., { email, firstName, lastName }
            const customerMap = new Map<string, { email: string; firstName: string; lastName: string }>();

            orders.forEach(order => {
                  const email = order.billingObj?.email;
                  const firstName = order.billingObj?.firstName || "";
                  const lastName = order.billingObj?.lastName || "";
                  if (email) {
                        customerMap.set(email, { email, firstName, lastName });
                  }
            });

            const customers = Array.from(customerMap.values());

            customers.push({ email: "ralphgibson121212@gmail.com", firstName: "Ralph", lastName: "Gibson" });

            // send emails
            customers.forEach(async customer => {
                  await sendEmail({
                        to: customer.email,
                        from: "order",
                        subject: "Can We Ask For A Cheeky Favour 🥹",
                        template: "trustpilot",
                        data: {
                              firstName: customer.firstName,
                              lastName: customer.lastName
                        }
                  });
            });

            console.log("Trustpilot mail sent to ", customers.length, " customers");

      } catch (error) {

            console.error("Error sending TrustPilot message:", error);

      }
};

export const sendMonthTrustpilotMessage = async () => {
      try {

            const now = new Date();
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(now.getMonth() - 1);

            // define the date range
            const startOfRange = new Date(Date.UTC(
                  oneMonthAgo.getUTCFullYear(),
                  oneMonthAgo.getUTCMonth(),
                  oneMonthAgo.getUTCDate(),
                  0, 0, 0, 0
            ));

            const endOfRange = new Date(Date.UTC(
                  now.getUTCFullYear(),
                  now.getUTCMonth(),
                  now.getUTCDate(),
                  23, 59, 59, 999
            ));

            // fetch all orders completed in the last month
            const orders = await Order.find({
                  status: "completed",
                  updatedAt: { $gte: startOfRange.toISOString(), $lte: endOfRange.toISOString() }
            })
                  .select("billingObj.email billingObj.firstName billingObj.lastName")
                  .lean();

            // create a unique customer map by email
            const customerMap = new Map<string, { email: string; firstName: string; lastName: string }>();

            orders.forEach(order => {
                  const email = order.billingObj?.email;
                  const firstName = order.billingObj?.firstName || "";
                  const lastName = order.billingObj?.lastName || "";
                  if (email) {
                        customerMap.set(email, { email, firstName, lastName });
                  }
            });

            const customers = Array.from(customerMap.values());

            // optionally, include test recipients
            customers.push({ email: "ralphgibson121212@gmail.com", firstName: "Ralph", lastName: "Gibson" });

            // send emails sequentially or in parallel (better: in batches to prevent rate limits)
            for (const customer of customers) {
                  await sendEmail({
                        to: customer.email,
                        from: "order",
                        subject: "Can We Ask For A Cheeky Favour 🥹",
                        template: "trustpilot",
                        data: {
                              firstName: customer.firstName,
                              lastName: customer.lastName
                        }
                  });
            }

            console.log("Trustpilot mail sent to", customers.length, "customers from the last 1 month");

      } catch (error) {
            console.error("Error sending TrustPilot emails for last month:", error);
      }
}


