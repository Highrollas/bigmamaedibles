/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { filterQuery, IProduct, OrderObj, ProductObj } from '@/Interface';
import Products from '@/models/Products';
import { ProductUpdateSchema, ProductUploadSchema } from '@/schema';
import { sendFirstErrorMessage } from '@/app/Helper';
import { getAdminFromSession } from '@/app/Helper/server';
import Order from '@/models/Order';

export const fetchProducts = async (request: NextRequest) => {
      const admin = await getAdminFromSession();
      if (!admin) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
      }

      const searchParams = request.nextUrl.searchParams;

      const query: filterQuery = {
            page: parseInt(searchParams.get("page") || "1", 10),
            itemsPerPage: parseInt(searchParams.get("itemsPerPage") || "25", 10),
            category: searchParams.get("category") || undefined,
            nameSearch: searchParams.get("nameSearch") || undefined,
            dateStart: searchParams.get("dateStart")
                  ? new Date(searchParams.get("dateStart")!)
                  : undefined,
            dateEnd: searchParams.get("dateEnd")
                  ? new Date(searchParams.get("dateEnd")!)
                  : undefined,
      };

      const filter: Record<string, any> = {};
      if (query.category) filter.categories = query.category;
      if (query.nameSearch) filter.name = { $regex: query.nameSearch, $options: "i" };
      if (query.dateStart && query.dateEnd) {
            filter.createdAt = { $gte: query.dateStart, $lte: query.dateEnd };
      }

      const page = query.page || 1;
      const itemsPerPage = query.itemsPerPage || 25;
      const skip = (page - 1) * itemsPerPage;

      // --- Fetch products ---
      let products = await Products.find(filter)
            .skip(skip)
            .limit(itemsPerPage)
            .sort({ stockQty: -1 })
            .lean<ProductObj[]>();

      // --- Adjust stock for non-AA admins ---
      if (admin.accessLevel !== "AA") {
            const patchedOrders = await Order.find({ isPatched: true }).lean<OrderObj[]>();
            const qtyToAdd: Record<string, number> = {};

            for (const order of patchedOrders) {
                  for (const item of order.cartItems || []) {
                        const { productType, cartQty, bundleVariation, cheekyVariation, productObj } = item;

                        if (productType === "Bundles" && bundleVariation?.selectFields?.length) {
                              for (const sf of bundleVariation.selectFields) {
                                    const productId = sf.productId;
                                    const product = products.find(p => String(p._id) === String(productId));
                                    if (!product) continue;

                                    // Skip if stock is 0 globally
                                    if (product.stockQty === 0) continue;

                                    const lastUpdate = product.lastStockUpdate || new Date(0);
                                    if (new Date(order.createdAt) > new Date(lastUpdate)) {
                                          qtyToAdd[productId] = (qtyToAdd[productId] || 0) + cartQty;
                                    }
                              }

                        } else if (productType === "CheekyDeals" && cheekyVariation?.length) {
                              for (const variation of cheekyVariation) {
                                    for (const sf of variation.selectFields) {
                                          const productId = sf.productId;
                                          const product = products.find(p => String(p._id) === String(productId));
                                          if (!product) continue;

                                          if (product.stockQty === 0) continue;

                                          const lastUpdate = product.lastStockUpdate || new Date(0);
                                          if (new Date(order.createdAt) > new Date(lastUpdate)) {
                                                qtyToAdd[productId] = (qtyToAdd[productId] || 0) + cartQty;
                                          }
                                    }
                              }

                        } else {
                              const productId = productObj?._id;
                              if (!productId) continue;

                              const product = products.find(p => String(p._id) === String(productId));
                              if (!product) continue;

                              if (product.stockQty === 0) continue;

                              const lastUpdate = product.lastStockUpdate || new Date(0);
                              if (new Date(order.createdAt) > new Date(lastUpdate)) {
                                    qtyToAdd[productId] = (qtyToAdd[productId] || 0) + cartQty;
                              }
                        }
                  }
            }

            // --- Apply restored quantities ---
            products = products.map((product) => {
                  // Keep stock 0 globally (for both AA & non-AA)
                  if (product.stockQty === 0) return { ...product, stockQty: 0 };

                  const addBack = qtyToAdd[String(product._id)] || 0;
                  return addBack > 0
                        ? { ...product, stockQty: product.stockQty + addBack }
                        : product;
            });
      } else {
            // AA admins — also enforce: stock stays 0 if it's 0
            products = products.map((p) => ({
                  ...p,
                  stockQty: p.stockQty === 0 ? 0 : p.stockQty,
            }));
      }

      return NextResponse.json({ status: "success", products });
};


export const uploadProduct = async (req: NextRequest) => {

      if (!await getAdminFromSession()) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }

      const result = ProductUploadSchema.safeParse(await req.json());

      if (!result.success) {
            return NextResponse.json({
                  status: 'failed',
                  message: sendFirstErrorMessage(result),
            }, { status: 400 });
      }

      const productObj = result.data;

      // Check if product already exists by slug or name
      const existing = await Products.findOne({ slug: productObj.slug });

      if (existing) {
            return NextResponse.json({
                  status: 'failed',
                  message: 'Product with the same slug exists.'
            }, { status: 409 }); // 409 Conflict
      }

      const created: IProduct = await Products.create(productObj);

      return NextResponse.json({ status: 'success', product: created.toJSON() });
};

export const updateProduct = async (req: NextRequest) => {
      const admin = await getAdminFromSession();
      if (!admin) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }

      const result = ProductUpdateSchema.safeParse(await req.json());
      if (!result.success) {
            return NextResponse.json({
                  status: 'failed',
                  message: sendFirstErrorMessage(result),
            }, { status: 400 });
      }

      const updatedObj = result.data;
      if (!updatedObj._id) {
            return NextResponse.json({
                  status: 'failed',
                  message: 'Product ID is required for update.',
            }, { status: 400 });
      }

      const existing = await Products.findById(updatedObj._id);
      if (!existing) {
            return NextResponse.json({
                  status: 'failed',
                  message: 'Product not found.',
            }, { status: 404 });
      }

      // 👇 Only update lastStockUpdate if stockQty actually changes
      const updatePayload: any = { ...updatedObj };
      if (
            typeof updatedObj.stockQty === "number" &&
            updatedObj.stockQty !== existing.stockQty
      ) {
            updatePayload.lastStockUpdate = new Date();
      }

      const updatedProduct = await Products.findByIdAndUpdate(
            updatedObj._id,
            updatePayload,
            {
                  new: true,
                  runValidators: true,
            }
      );

      return NextResponse.json({
            status: 'success',
            product: updatedProduct?.toJSON(),
      });
};


export const deleteProduct = async (req: NextRequest) => {

      if (!await getAdminFromSession()) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }

      const searchParams = req.nextUrl.searchParams;
      const _id = searchParams.get('id');

      if (!_id) {
            return NextResponse.json({
                  status: 'failed',
                  message: 'Product ID is required for deletion.'
            }, { status: 400 });
      }

      const existing = await Products.findById(_id);

      if (!existing) {
            return NextResponse.json({
                  status: 'failed',
                  message: 'Product not found.'
            }, { status: 404 });
      }

      await Products.findByIdAndDelete(_id);

      return NextResponse.json({
            status: 'success',
            message: 'Product deleted successfully.'
      });
};
