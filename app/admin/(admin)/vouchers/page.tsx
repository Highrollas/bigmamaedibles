'use client'

import AdminVouchersList from '@/app/components/client/admin/VouchersList'
import React, { useState } from 'react'
import { ReqResp, VoucherObj } from '@/Interface'
import useAlertStore from '@/app/hooks/store/alert'
import APIClient from '@/app/services/apiClient'
import useVouchersStore from '@/app/hooks/store/voucher'
import AlertMessage2 from '@/app/components/client/AlertMessage2'

const AdminVoucherPage = () => {

      const generateVoucherCode = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            const makeChunk = () =>
                  Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

            return `HR-${makeChunk()}-${makeChunk()}-${makeChunk()}`;
      }

      const [newVoucher, setNewVoucher] = useState<Partial<VoucherObj>>({
            code: '',
            cartDiscount: 0,
            discountType: 'fixedAmount',
            useageLimit: 1,
            usageLimitPerUser: 1,
            status: 'active',
            voucherType: 'voucher',
      });

      const [loading, setLoading] = useState(false);

      const pushVoucher = useVouchersStore(v => v.pushVoucher);

      const { setMessage2 } = useAlertStore()

      const handleCreateVoucher = async () => {

            setLoading(true);

            const resp = await new APIClient<ReqResp & { voucher: VoucherObj }>('admin/vouchers').post(newVoucher)
            if (resp.status === 'success') {
                  setMessage2('Voucher Created Successfully');
                  pushVoucher(resp.voucher);
            } else {
                  setMessage2(resp.message || 'Error creating voucher', 'error');
            }

            setLoading(false);
      }

      return (
            <div className="w-[98%] mx-auto mt-4">
                  <div className="my-3 flex justify-between items-center">
                        <strong className="text-white text-2xl ms-3">Vouchers</strong>
                        <button
                              onClick={() =>
                                    (document.getElementById('create_voucher_modal') as HTMLDialogElement)?.showModal()
                              }
                              className="btn"
                        >
                              Add Voucher
                        </button>
                  </div>

                  <AdminVouchersList />

                  {/* Create Voucher Modal */}
                  <dialog id="create_voucher_modal" className="modal">
                        <div className="modal-box">

                              <AlertMessage2 />

                              <h3 className="font-bold text-lg mb-4">Create Voucher</h3>

                              <div className="form-control">
                                    <label className="label">Voucher Code</label>
                                    <input
                                          type="text"
                                          className="input input-bordered ms-3"
                                          value={newVoucher.code}
                                          onChange={(e) => setNewVoucher({ ...newVoucher, code: e.target.value })}
                                    />
                                    <div
                                          className="mt-2 w-fit text-[12px] text-blue-700 underline"
                                          onClick={() => setNewVoucher({ ...newVoucher, code: generateVoucherCode() })}
                                    >
                                          Generate Random Voucher Code
                                    </div>
                              </div>

                              <div className="form-control mt-3">
                                    <label className="label">Discount Value</label>
                                    <input
                                          type="number"
                                          className="input input-bordered ms-3"
                                          value={newVoucher.cartDiscount}
                                          onChange={(e) =>
                                                setNewVoucher({ ...newVoucher, cartDiscount: parseFloat(e.target.value) })
                                          }
                                    />
                              </div>

                              <div className="form-control mt-3">
                                    <label className="label">Discount Type</label>
                                    <select
                                          className="select select-bordered ms-3"
                                          value={newVoucher.discountType}
                                          onChange={(e) =>
                                                setNewVoucher({
                                                      ...newVoucher,
                                                      discountType: e.target.value as 'fixedAmount' | 'discount',
                                                })
                                          }
                                    >
                                          <option value="fixedAmount">Fixed Amount</option>
                                          <option value="discount">Percentage</option>
                                    </select>
                              </div>

                              <div className="form-control mt-3">
                                    <label className="label">Total Usage Limit</label>
                                    <input
                                          type="number"
                                          className="input input-bordered ms-3"
                                          value={newVoucher.useageLimit}
                                          onChange={(e) =>
                                                setNewVoucher({ ...newVoucher, useageLimit: parseInt(e.target.value) })
                                          }
                                    />
                              </div>

                              <div className="form-control mt-3">
                                    <label className="label">Limit Per User</label>
                                    <input
                                          type="number"
                                          className="input input-bordered ms-3"
                                          value={newVoucher.usageLimitPerUser}
                                          onChange={(e) =>
                                                setNewVoucher({ ...newVoucher, usageLimitPerUser: parseInt(e.target.value) })
                                          }
                                    />
                              </div>

                              <div className="form-control mt-3">
                                    <label className="label">Status</label>
                                    <select
                                          className="select select-bordered ms-3"
                                          value={newVoucher.status}
                                          onChange={(e) =>
                                                setNewVoucher({ ...newVoucher, status: e.target.value as 'active' | 'inactive' })
                                          }
                                    >
                                          <option value="active">Active</option>
                                          <option value="inactive">Inactive</option>
                                    </select>
                              </div>

                              <div className="modal-action w-full mt-8">
                                    <form method="dialog" className="flex gap-2 justify-between w-full">
                                          <button className="btn btn-ghost">Close</button>
                                          <button type="button" className="btn btn-primary" onClick={handleCreateVoucher}>
                                                Save
                                                {loading && <span className='loading loading-spinner'></span>}
                                          </button>
                                    </form>
                              </div>
                        </div>
                  </dialog>
            </div>
      )
}

export default AdminVoucherPage

