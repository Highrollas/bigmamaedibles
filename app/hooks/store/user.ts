'use client'

import { getQueryString } from "@/app/Helper";
import APIClient from "@/app/services/apiClient";
import { filterQuery, UserObj, ReqResp } from "@/Interface"
import { create } from "zustand"

export type userObj = UserObj & { totalOrdersAmount: number, totalOrdersCount: number, isGuest: boolean }

interface UsersStore {
      filterQuery: filterQuery;
      users: userObj[];
      init: () => void;
      fetchUsers: () => void;
      saveUserEdit: (user: userObj) => void;
      saveUsers: (users: userObj[]) => void;
      setFilterQuery: (filterQuery: filterQuery) => void;
      pushUser: (user: userObj) => void;
      loading: boolean;
      error: string;
}

let isInitiated = false;

const useUsersStore = create<UsersStore>((set, get) => ({

      filterQuery: { page: 1, itemsPerPage: 25, sortByBalance: false },

      loading: true,

      error: "",

      users: [],

      init: () => {
            if (!isInitiated) {
                  isInitiated = true;
                  get().fetchUsers();
            }
      },

      fetchUsers: async () => {

            const filterQueryString = getQueryString(get().filterQuery);
            set({ loading: true });
            const resp = await new APIClient<ReqResp & { users: userObj[] }>('/admin/users' + filterQueryString).get();

            if (resp && resp.status == "success") {
                  set({ users: resp.users, loading: false });
            } else {
                  set({ users: [], loading: false, error: resp.message });
            }
      },

      pushUser: (user) => set({ users: [user, ...get().users] }),

      saveUserEdit: (user) => set((store) => ({
            users: store.users.map((p) =>
                  p._id === user._id ? { ...user } : p
            ),
      })),

      saveUsers: (users) => set({ users, loading: false }),

      setFilterQuery: (filterQuery) => set({ filterQuery })

}));

export default useUsersStore;

