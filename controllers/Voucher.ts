/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import Voucher from '@/models/Voucher';
import { flattenErrorMessage, sendFirstErrorMessage } from '@/app/Helper';
import { getAdminFromSession, getAuthFromToken, getUserFromSession } from '@/app/Helper/server';
import { IVoucher, OrderObj } from '@/Interface';
import { z } from 'zod';
import { CreateVoucherSchema, VoucherUpdateSchema } from '@/schema';
import Order from '@/models/Order';

export const adminFetchVouchers = async (req: NextRequest) => {

      if (!await getAdminFromSession()) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }

      const searchParams = req.nextUrl.searchParams;
      const nameSearch = searchParams.get('nameSearch');
      const voucherType = searchParams.get('voucherType');

      const filter: Record<string, any> = {};

      if (nameSearch) {
            filter.code = { $regex: nameSearch, $options: 'i' };
      }

      if (voucherType && voucherType != "all") {
            const voucherType = searchParams.get('voucherType');
            filter.voucherType = voucherType;
      }

      if (!voucherType) {
            filter.voucherType = "voucher";
      }

      const vouchers = await Voucher.find(filter).sort({ createdAt: -1 }).lean<IVoucher[]>();

      return NextResponse.json({ status: 'success', vouchers });
};

// Fetch user voucher
export const fetchVoucherSingle = async (req: NextRequest) => {
      try {
            const body = await req.json();
            const schema = z.object({ coupon: z.string().trim().min(3, "Invalid Coupon Code") });
            const result = schema.safeParse(body);

            if (!result.success) {
                  return NextResponse.json(
                        { status: "failed", message: flattenErrorMessage(result) },
                        { status: 400 }
                  );
            }

            const authUser = await getAuthFromToken();
            if (!authUser) {
                  return NextResponse.json(
                        { status: "AuthFailed", message: "Auth Error" },
                        { status: 401 }
                  );
            }

            const user = await getUserFromSession();

            const { coupon } = result.data;
            const couponExist = await Voucher.findOne({
                  code: new RegExp(`^${coupon}$`, "i"),
            }).lean<IVoucher>();

            if (!couponExist) {
                  return NextResponse.json(
                        { status: "failed", message: "Provided Voucher Not Found" },
                        { status: 404 }
                  );
            }


            // ✅ Ensure only rightful user can use referral coupon
            if (couponExist.voucherType === "referral") {
                  if (user?.referralCoupon !== couponExist.code) {
                        return NextResponse.json({
                              status: "failed",
                              message: "Opps: You Are Not Allowed To Use This Voucher",
                        });
                  }
            }

            if (couponExist.usageCount >= couponExist.useageLimit) {
                  return NextResponse.json({
                        status: "failed",
                        message: "This Voucher Has Reached Its Usage Limit",
                  });
            }

            if (couponExist.restrictedUsersIds.includes(authUser._gid)) {
                  return NextResponse.json({
                        status: "failed",
                        message: "Opps: You Are Not Allowed To Use This Voucher",
                  });
            }

            const timesUsed = couponExist.usageUserIds.filter((i) => i === authUser._gid);
            if (timesUsed.length >= couponExist.usageLimitPerUser) {
                  return NextResponse.json({
                        status: "failed",
                        message: "Opps: You Have Reached The Usage Limit For This Voucher",
                  });
            }

            const previousReferralOrder = await Order.findOne({
                  $and: [
                        { $or: [{ _gid: authUser._gid }, { "billingObj.email": user?.email }] },
                        { "coupons.voucherType": "referral" },
                        { status: { $ne: "cancelled" } }, // ignore cancelled orders only
                  ],
            }).lean<OrderObj>();

            if (previousReferralOrder && couponExist.voucherType === "referral") {
                  // If the previous order is still pending
                  if (previousReferralOrder.status === "pending") {
                        return NextResponse.json({
                              status: "failed",
                              message: "You Have A Pending Order Using A Referral Coupon",
                        });
                  }

                  // If it's completed or any other non-cancelled status
                  if (previousReferralOrder.status === "completed" || previousReferralOrder.status === "on-hold") {
                        return NextResponse.json({
                              status: "failed",
                              message: "You Have Already Used A Referral Coupon Before",
                        });
                  }
            }

            return NextResponse.json({
                  status: "success",
                  voucher: {
                        _id: couponExist._id,
                        code: couponExist.code,
                        cartDiscount: couponExist.cartDiscount,
                        discountType: couponExist.discountType,
                        voucherType: couponExist.voucherType,
                  },
            });

      } catch (err) {
            console.error("error @fetchVoucherSingle", err);
            return NextResponse.json(
                  { status: "failed", message: "Internal Server Error" },
                  { status: 500 }
            );
      }
};


export const deleteVoucher = async (req: NextRequest) => {

      if (!await getAdminFromSession()) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }

      const searchParams = req.nextUrl.searchParams;
      const _id = searchParams.get('id');

      if (!_id) {
            return NextResponse.json({ status: 'failed', message: 'Voucher ID is required.' }, { status: 400 });
      }

      const existing = await Voucher.findById(_id);
      if (!existing) {
            return NextResponse.json({ status: 'failed', message: 'Voucher not found.' }, { status: 404 });
      }

      await Voucher.findByIdAndDelete(_id);
      return NextResponse.json({ status: 'success', message: 'Voucher deleted successfully.' });
};


export const updateVoucher = async (req: NextRequest) => {

      if (!await getAdminFromSession()) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }


      const result = VoucherUpdateSchema.safeParse(await req.json());

      if (!result.success) {
            return NextResponse.json({ status: 'failed', message: sendFirstErrorMessage(result) }, { status: 400 });
      }

      const voucherData = result.data;
      const existing = await Voucher.findById(voucherData._id);
      if (!existing) {
            return NextResponse.json({ status: 'failed', message: 'Voucher not found.' }, { status: 404 });
      }

      const updated = await Voucher.findByIdAndUpdate(voucherData._id, voucherData, { new: true, runValidators: true });
      return NextResponse.json({ status: 'success', voucher: updated?.toJSON() });
};

export const createVoucher = async (req: NextRequest) => {
      try {

            if (!await getAdminFromSession()) {
                  return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
            }

            const result = CreateVoucherSchema.safeParse(await req.json());

            if (!result.success) {
                  return NextResponse.json({
                        status: 'failed',
                        message: sendFirstErrorMessage(result),
                  }, { status: 400 });
            }

            const data = result.data;

            const exists = await Voucher.findOne({ code: new RegExp(`^${data.code}$`, "i") });
            if (exists) {
                  return NextResponse.json({
                        status: 'failed',
                        message: 'A voucher with this code already exists.',
                  }, { status: 409 });
            }

            const newVoucher = {
                  ...data,
                  code: data.code.toUpperCase(),
                  usageCount: 0,
                  voucherType: 'voucher',
                  restrictedUsersIds: [],
                  usageUserIds: [],
            };

            const created = await Voucher.create(newVoucher);

            return NextResponse.json({
                  status: 'success',
                  voucher: created.toJSON(),
            });

      } catch (err) {
            console.error('Error creating voucher:', err);
            return NextResponse.json({
                  status: 'failed',
                  message: 'Internal Server Error',
            }, { status: 500 });
      }
};
