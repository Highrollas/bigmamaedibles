/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendFirstErrorMessage } from "@/app/Helper";
import { getAdminFromSession, getUserFromSession } from "@/app/Helper/server";
import { BillingObj, UserObj } from "@/Interface";
import { userUpdateSchema } from "@/schema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";;
import User from "@/models/User";
import { sendEmail } from "@/libs/emailService";
import { z } from "zod";

export const updateUser = async (req: NextRequest) => {

      try {

            if (!await getUserFromSession()) {
                  return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
            }

            const result = userUpdateSchema.safeParse(await req.json());

            if (!result.success) {
                  return NextResponse.json({
                        status: "failed",
                        message: sendFirstErrorMessage(result)
                  }, { status: 400 });
            }

            const userObj = await getUserFromSession();

            if (!userObj) {
                  return NextResponse.json({
                        status: "failed",
                        message: "session doesn't exist"
                  });
            }

            const r = result.data;
            const updateData = {} as UserObj;

            if (r.email) {

                  updateData.email = r.email;
                  await sendEmail({
                        to: userObj.email,
                        from: "account",
                        subject: "🚨 IMPORTANT- Email Changed",
                        template: "email-change",
                        data: {
                              newEmail: r.email,
                              oldEmail: userObj.email
                        }
                  })

            }

            if (r.avatar) updateData.avatar = r.avatar;
            if (r.billingObj) updateData.billingObj = r.billingObj as BillingObj[];

            if (r.password && r.currentPassword) {

                  const isMatch = bcrypt.compareSync(r.currentPassword, userObj.password!);
                  if (!isMatch) {
                        return NextResponse.json({
                              status: "failed",
                              message: "Current Password Is Incorrect"
                        }, { status: 403 });
                  }

                  const hashedPassword = bcrypt.hashSync(r.password, Number(process.env.SALT_ROUNDS));
                  updateData.password = hashedPassword;

                  await sendEmail({
                        to: userObj.email,
                        from: "account",
                        subject: "🚨 IMPORTANT- Password Changed",
                        template: "password-change",
                        data: {}
                  })
            }

            // Perform update with updateData
            await User.updateOne({ _id: userObj._id }, { $set: updateData });

            return NextResponse.json({
                  status: "success",
                  message: "User Updated Successfully"
            });

      } catch (error) {
            console.error("error @updateUser", error);
            return NextResponse.json({
                  status: "failed",
                  message: "Server Error: Kindly Try Again Later"
            });
      }
};

export const adminFetchUsers = async (req: NextRequest) => {
      try {

            if (!await getAdminFromSession()) {
                  return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
            }

            const searchParams = req.nextUrl.searchParams;

            const query: {
                  page: number;
                  itemsPerPage: number;
                  nameSearch?: string;
                  sortByBalance?: boolean;
            } = {
                  page: parseInt(searchParams.get('page') || '1', 10),
                  itemsPerPage: parseInt(searchParams.get('itemsPerPage') || '20', 10),
                  nameSearch: searchParams.get('nameSearch')?.toLowerCase().trim() || '',
                  sortByBalance: searchParams.get('sortByBalance') === 'true',
            };

            // Build filter for registered users
            const filter: Record<string, any> = {};

            if (query.nameSearch) {
                  const searchTerms = query.nameSearch.split(/\s+/).filter(Boolean); // Split by spaces
                  const searchConditions = [];

                  if (searchTerms.length === 1) {
                        // Single term - search in username, firstName, lastName, email
                        const regex = { $regex: searchTerms[0], $options: 'i' };
                        searchConditions.push(
                              { username: regex },
                              { firstName: regex },
                              { lastName: regex },
                              { email: regex }
                        );
                  } else {
                        // Multiple terms - match first name and last name
                        const [first, ...rest] = searchTerms;
                        const last = rest.join(' ');

                        searchConditions.push(
                              {
                                    $and: [
                                          { firstName: { $regex: first, $options: 'i' } },
                                          { lastName: { $regex: last, $options: 'i' } }
                                    ]
                              }
                        );
                  }

                  filter.$or = searchConditions;
            }

            // Fetch registered users with sorting
            const registeredUsers = await User
                  .find(filter)
                  .sort(query.sortByBalance ? { balance: -1 } : { createdAt: -1 })
                  .lean<UserObj[]>();

            // Map users to response format
            const allUsers = registeredUsers.map(user => ({
                  _id: user._id,
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  username: user.username,
                  avatar: user.avatar,
                  status: user.status,
                  balance: user.balance,
                  isGuest: false,
                  totalOrdersAmount: 0,
                  totalOrdersCount: 0
            }));

            // Apply pagination
            const page = query.page;
            const limit = query.itemsPerPage;
            const start = (page - 1) * limit;
            const paginated = allUsers.slice(start, start + limit);

            return NextResponse.json({
                  status: "success",
                  users: paginated,
                  totalCount: allUsers.length
            });

      } catch (error) {
            console.error("Error in adminFetchUsers", error);
            return NextResponse.json({
                  status: "failed",
                  message: "Server Error",
            }, { status: 500 });
      }
};


export const deleteUser = async (req: NextRequest) => {

      if (!await getAdminFromSession()) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }

      try {
            const searchParams = req.nextUrl.searchParams;
            const _id = searchParams.get('id');

            if (!_id) {
                  return NextResponse.json({
                        status: 'failed',
                        message: 'User ID is required for deletion.'
                  }, { status: 400 });
            }

            const existingUser = await User.findById(_id);

            if (!existingUser) {
                  return NextResponse.json({
                        status: 'failed',
                        message: 'User not found.'
                  }, { status: 404 });
            }

            await User.findByIdAndDelete(_id);

            return NextResponse.json({
                  status: 'success',
                  message: 'User deleted successfully.'
            });

      } catch (error) {
            console.error("Error in deleteUser:", error);
            return NextResponse.json({
                  status: 'failed',
                  message: 'Server error while deleting user.'
            }, { status: 500 });
      }
};


export const toggleUserStatus = async (req: NextRequest) => {
      try {

            if (!await getAdminFromSession()) {
                  return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
            }


            const schema = z.object({ _id: z.string().trim().min(10), status: z.enum(['disabled', 'active']) })
            const result = schema.safeParse(await req.json());

            if (!result.success) {
                  return NextResponse.json({
                        status: "failed",
                        message: sendFirstErrorMessage(result)
                  }, { status: 400 });
            }

            const { _id, status } = result.data;

            const user = await User.findById(_id);

            if (!user) {
                  return NextResponse.json({
                        status: 'failed',
                        message: 'User not found.'
                  }, { status: 404 });
            }

            const newStatus = status === 'disabled' ? 'disabled' : 'active';

            await User.updateOne({ _id }, { status: newStatus });

            return NextResponse.json({
                  status: 'success',
                  message: `User status updated to "${newStatus}".`
            });

      } catch (error) {
            console.error('Error in toggleUserStatus:', error);
            return NextResponse.json({
                  status: 'failed',
                  message: 'Server error while updating user status.'
            });
      }
};


export const setUserBalance = async (req: NextRequest) => {

      try {

            if (!await getAdminFromSession()) {
                  return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
            }

            const schema = z.object({ _id: z.string().trim().min(10), balance: z.number().min(0) })
            const result = schema.safeParse(await req.json());

            if (!result.success) {
                  return NextResponse.json({
                        status: "failed",
                        message: sendFirstErrorMessage(result)
                  }, { status: 400 });
            }

            const { _id, balance } = result.data;

            const user = await User.findById(_id);

            if (!user) {
                  return NextResponse.json({
                        status: 'failed',
                        message: 'User not found.'
                  }, { status: 404 });
            }

            await User.updateOne({ _id }, { balance: String(balance) });


            return NextResponse.json({
                  status: 'success',
                  message: `User balanced updated to "${balance}".`
            });

      } catch (error) {
            console.error('Error in toggleUserStatus:', error);
            return NextResponse.json({
                  status: 'failed',
                  message: 'Server error while updating user status.'
            });
      }
};

