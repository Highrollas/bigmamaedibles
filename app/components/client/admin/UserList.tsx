'use client'

import useUsersStore, { userObj } from '@/app/hooks/store/user'
import FilterComponent from './FilterComponent'
import { CURRENCY_SYMBOL } from '@/constants';
import { Ban, Trash, X } from 'lucide-react';
import useAlertStore from '@/app/hooks/store/alert';
import { ReqResp } from '@/Interface';
import APIClient from '@/app/services/apiClient';
import { useState } from 'react';

const AdminUserList = () => {


      const { users, filterQuery, setFilterQuery, fetchUsers, loading, saveUsers, saveUserEdit } = useUsersStore();
      const { setModalMessage } = useAlertStore();
      const [balance, setBalance] = useState(0);
      const [selectedUser, setSelectedUser] = useState<userObj | null>(null);

      const handleUserDelete = async (user: userObj) => {
            const confirmDelete = await setModalMessage(`Are you sure you want to delete user ?`, 'dialog');

            if (confirmDelete) {
                  const resp = await new APIClient<ReqResp>('admin/users?id=' + user._id).delete();
                  if (resp.status === 'success') {
                        setModalMessage('User deleted');
                        saveUsers(users.filter(v => v._id !== user._id));
                  } else {
                        setModalMessage(resp.message);
                  }
            }
      }

      const handleUserBan = async (user: userObj) => {

            const confirmDelete = await setModalMessage(
                  `Are you sure you want to ban user ?`,
                  'dialog'
            );
            if (confirmDelete) {
                  const resp = await new APIClient<ReqResp>('admin/users').put({ status: "disabled", _id: user._id });
                  if (resp.status === 'success') {
                        setModalMessage('User Blocked');
                        saveUserEdit({ ...user, status: "disabled" });
                  } else {
                        setModalMessage(resp.message);
                  }
            }
      }

      const unBanUser = async (user: userObj) => {

            const confirmDelete = await setModalMessage(
                  `Are you sure you want to unban user ?`,
                  'dialog'
            );
            if (confirmDelete) {
                  const resp = await new APIClient<ReqResp>('admin/users?id=' + user._id + '&status=active').put({ status: "active", _id: user._id });
                  if (resp.status === 'success') {
                        setModalMessage('User Activated');
                        saveUserEdit({ ...user, status: "active" });
                  } else {
                        setModalMessage(resp.message);
                  }
            }
      }

      const setUserBalance = async (user: userObj) => {

            const resp = await new APIClient<ReqResp>('admin/users/balance-action').put({ balance, _id: user._id });
            if (resp.status === 'success') {
                  setModalMessage('User balance successfully changed');
                  saveUserEdit({ ...user, balance: String(balance) });
            } else {
                  setModalMessage(resp.message);
            }

      }



      return (
            <div>
                  <div className="overflow-x-auto bg-white rounded max-w-[95vw] sm:w-[100%] mx-auto mb-6 sm:mb-12">

                        {/* Filters */}

                        <FilterComponent
                              filterQuery={filterQuery}
                              setFilterQuery={setFilterQuery}
                              showSortByBalance={true}
                              onApply={fetchUsers}
                        />

                        {loading &&
                              < div className='flex justify-center items-center h-[100px] w-full mx-auto'>
                                    <span className="loading loading-spinner w-5 h-5 brand-border"></span>
                              </div>
                        }

                        {(!loading && users.length === 0) &&
                              <div className='text-center w-full my-12'>Users Not Found For Selected Query</div>
                        }


                        {(!loading && users.length > 0) &&

                              <table className="table" style={{ zoom: ".75" }}>

                                    <thead>
                                          <tr>
                                                <th>
                                                      <label>
                                                            <input type="checkbox" className="checkbox" />
                                                      </label>
                                                </th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Username</th>
                                                <th>Status</th>
                                                <th>Balance</th>
                                                <th>Action</th>

                                          </tr>
                                    </thead>

                                    <tbody>

                                          {users.map((user, i) =>
                                                <tr key={i}>
                                                      <th>
                                                            <label>
                                                                  <input type="checkbox" className="checkbox" />
                                                            </label>
                                                      </th>
                                                      <td>{user.firstName} {user.lastName}</td>
                                                      <td>{user.email}</td>
                                                      <td>{user.isGuest ? "Guest" : user.username}</td>
                                                      <td>{user.status}</td>
                                                      <td>{CURRENCY_SYMBOL}{user.balance ?? 0}</td>
                                                      <td>
                                                            <button disabled={user.isGuest} className='btn'
                                                                  onClick={() => handleUserDelete(user)}>
                                                                  <Trash />
                                                            </button>
                                                            <button disabled={user.isGuest} className='btn mx-2'
                                                                  onClick={() => user.status == "active" ? handleUserBan(user) : unBanUser(user)}>
                                                                  {user.status == "active" ? "Ban" : "Unban"} <Ban />
                                                            </button>

                                                            <button disabled={user.isGuest} className='btn'
                                                                  onClick={() => setSelectedUser(user)}>
                                                                  Change Balance
                                                            </button>
                                                      </td>
                                                </tr>
                                          )}

                                    </tbody>

                                    <tfoot>
                                          <tr>
                                                <th>
                                                      <label>
                                                            <input type="checkbox" className="checkbox" />
                                                      </label>
                                                </th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Username</th>
                                                <th>Status</th>
                                                <th>Balance</th>
                                                <th>Action</th>
                                          </tr>
                                    </tfoot>
                              </table>
                        }

                        {/* Modal */}
                        {selectedUser && (
                              <dialog id="order_modal" className="modal modal-open">
                                    <div className="modal-box bg-white text-black max-w-2xl w-full relative">
                                          <h3 className="font-bold text-lg mb-4">Set User Balance</h3>

                                          <div className="space-y-4 text-sm">
                                                <label className="block">
                                                      New Balance:
                                                      <input
                                                            type="number"
                                                            className="input input-bordered w-full mt-2"
                                                            value={balance}
                                                            onChange={(e) => setBalance(Number(e.target.value))}
                                                      />
                                                </label>
                                                <div className="flex justify-end gap-2">
                                                      <button
                                                            className="btn"
                                                            onClick={() => {
                                                                  setUserBalance(selectedUser);
                                                                  setSelectedUser(null);
                                                            }}
                                                      >
                                                            Save
                                                      </button>
                                                      <button
                                                            className="btn btn-outline"
                                                            onClick={() => setSelectedUser(null)}
                                                      >
                                                            Cancel <X />
                                                      </button>
                                                </div>
                                          </div>

                                          <button className="btn absolute right-2 top-2" onClick={() => setSelectedUser(null)}>
                                                <X />
                                          </button>
                                    </div>
                              </dialog>
                        )}
                  </div>
            </div>

      )
}

export default AdminUserList


