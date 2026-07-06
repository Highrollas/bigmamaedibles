'use client';

import { useState } from 'react';
import useAlertStore from '@/app/hooks/store/alert';
import APIClient from '@/app/services/apiClient';
import { VoucherObj, ReqResp } from '@/Interface';
import { Trash, Pencil } from 'lucide-react';
import useVouchersStore from '@/app/hooks/store/voucher';
import FilterComponent from './FilterComponent';

const AdminVouchersList = () => {

      const { vouchers, saveVoucherEdit, saveVouchers, filterQuery, setFilterQuery, fetchVouchers, loading } = useVouchersStore();
      const [selectedVoucher, setSelectedVoucher] = useState<VoucherObj | null>(null);
      const [editData, setEditData] = useState<VoucherObj>({} as VoucherObj);
      const { setModalMessage } = useAlertStore();
      const [editLoading, setEditLoading] = useState(false);

      const openEditModal = (voucher: VoucherObj) => {
            setSelectedVoucher(voucher);
            setEditData(voucher);
            (document.getElementById('edit_voucher_modal') as HTMLDialogElement).showModal();
      };

      const handleEditSave = async () => {

            if (!selectedVoucher) return;

            setEditLoading(true);

            const resp = await new APIClient<ReqResp & { voucher: VoucherObj }>(
                  'admin/vouchers?id=' + selectedVoucher._id
            ).put({ ...editData });

            if (resp.status === 'success') {
                  setModalMessage('Voucher updated successfully');
                  saveVoucherEdit(resp.voucher);
                  (document.getElementById('edit_voucher_modal') as HTMLDialogElement).close();
            } else {
                  setModalMessage(resp.message);
            }

            setEditLoading(false);
      };

      const handleDelete = async (voucher: VoucherObj) => {
            const confirmDelete = await setModalMessage(
                  `Are you sure you want to delete voucher ${voucher.code}?`,
                  'dialog'
            );
            if (confirmDelete) {
                  const resp = await new APIClient<ReqResp>('admin/vouchers?id=' + voucher._id).delete();
                  if (resp.status === 'success') {
                        setModalMessage('Voucher deleted');
                        saveVouchers(vouchers.filter(v => v._id !== voucher._id));
                  } else {
                        setModalMessage(resp.message);
                  }
            }
      };

      return (
            <div className="overflow-x-auto bg-white rounded max-w-[95vw] sm:w-full mx-auto mb-6 sm:mb-12">
                  <h2 className="text-lg font-bold px-4 py-3">Vouchers</h2>

                  {/* Filters */}

                  <FilterComponent
                        filterQuery={filterQuery}
                        setFilterQuery={setFilterQuery}
                        onApply={fetchVouchers}
                        showDateFilter={false}
                        showVoucherType={true}

                  />

                  {loading &&
                        < div className='flex justify-center items-center h-[100px] w-full mx-auto'>
                              <span className="loading loading-spinner w-5 h-5 brand-border"></span>
                        </div>
                  }


                  <table className="table w-full" style={{ zoom: ".75" }}>
                        <thead>
                              <tr>
                                    <th>Code</th>
                                    <th>Discount</th>
                                    <th>Usage Count</th>
                                    <th>Limit Per User</th>
                                    <th>Type</th>
                                    <th>Action</th>
                              </tr>
                        </thead>
                        <tbody>
                              {vouchers.map((voucher) => (
                                    <tr key={voucher._id}>
                                          <td className="font-semibold">{voucher.code}</td>
                                          <td>
                                                {voucher.discountType === 'fixedAmount' ? '£' : '%'}{voucher.cartDiscount}
                                          </td>
                                          <td>
                                                {voucher.usageCount} / {voucher.useageLimit}
                                          </td>
                                          <td>
                                                {voucher.usageLimitPerUser}
                                          </td>
                                          <td>{voucher.discountType === 'fixedAmount' ? 'Fixed' : 'Percent'}</td>
                                          <td className="flex gap-2">
                                                <button className="btn btn-ghost btn-xs" onClick={() => openEditModal(voucher)}>
                                                      <Pencil size={16} />
                                                </button>
                                                <button disabled={voucher.voucherType === 'referral'} className="btn btn-ghost btn-xs ms-2" onClick={() => handleDelete(voucher)}>
                                                      <Trash size={16} />
                                                </button>
                                          </td>
                                    </tr>
                              ))}
                        </tbody>
                  </table>

                  {/* Edit Voucher Modal */}
                  <dialog id="edit_voucher_modal" className="modal">
                        <div className="modal-box">
                              <h3 className="font-bold text-lg mb-4">Edit Voucher</h3>

                              {
                                    editData &&
                                    <>
                                          {/* Code */}
                                          <div className="form-control">
                                                <label className="label">Voucher Code</label>
                                                <input
                                                      type="text"
                                                      className="input input-bordered ms-3"
                                                      value={editData.code}
                                                      onChange={(e) => setEditData({ ...editData, code: e.target.value })}
                                                />
                                          </div>

                                          {/* Discount Value */}
                                          <div className="form-control mt-3">
                                                <label className="label">Discount Value</label>
                                                <input
                                                      type="number"
                                                      className="input input-bordered ms-3"
                                                      value={editData.cartDiscount}
                                                      onChange={(e) =>
                                                            setEditData({ ...editData, cartDiscount: parseFloat(e.target.value) })
                                                      }
                                                />
                                          </div>

                                          {/* Discount Type */}
                                          <div className="form-control mt-3">
                                                <label className="label">Discount Type</label>
                                                <select
                                                      className="select select-bordered ms-3"
                                                      value={editData.discountType}
                                                      onChange={(e) =>
                                                            setEditData({
                                                                  ...editData,
                                                                  discountType: e.target.value as 'fixedAmount' | 'discount',
                                                            })
                                                      }
                                                >
                                                      <option value="fixedAmount">Fixed Amount</option>
                                                      <option value="discount">Percentage</option>
                                                </select>
                                          </div>

                                          {/* Useage Limit (Total usage cap) */}
                                          <div className="form-control mt-3">
                                                <label className="label">Total Usage Limit</label>
                                                <input
                                                      type="number"
                                                      className="input input-bordered ms-3"
                                                      value={editData.useageLimit}
                                                      onChange={(e) =>
                                                            setEditData({ ...editData, useageLimit: parseInt(e.target.value) })
                                                      }
                                                />
                                          </div>

                                          {/* Usage Limit Per User */}
                                          <div className="form-control mt-3">
                                                <label className="label">Limit Per User</label>
                                                <input
                                                      type="number"
                                                      className="input input-bordered ms-3"
                                                      value={editData.usageLimitPerUser}
                                                      onChange={(e) =>
                                                            setEditData({ ...editData, usageLimitPerUser: parseInt(e.target.value) })
                                                      }
                                                />
                                          </div>

                                          {/* Status */}
                                          <div className="form-control mt-3">
                                                <label className="label">Status</label>
                                                <select
                                                      className="select select-bordered ms-3"
                                                      value={editData.status}
                                                      onChange={(e) =>
                                                            setEditData({ ...editData, status: e.target.value as 'active' | 'inactive' })
                                                      }
                                                >
                                                      <option value="active">Active</option>
                                                      <option value="inactive">Inactive</option>
                                                </select>
                                          </div>

                                    </>
                              }

                              {/* Footer */}
                              <div className="modal-action w-full mt-8">
                                    <form method="dialog" className="flex gap-2 w-full justify-between">
                                          <button className="btn btn-ghost btn-xs">Cancel</button>
                                          <button
                                                type="button"
                                                className="btn btn-ghost btn-xs"
                                                onClick={handleEditSave}
                                          >
                                                Save
                                                {editLoading && <span className='loading loading-spinner'></span>}
                                          </button>
                                    </form>
                              </div>
                        </div>
                  </dialog>
            </div>
      );
};

export default AdminVouchersList;

