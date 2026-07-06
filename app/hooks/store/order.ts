'use client'

import { getQueryString } from "@/app/Helper";
import APIClient from "@/app/services/apiClient";
import { filterQuery, OrderObj, ReqResp } from "@/Interface"
import { create } from "zustand"

interface OrderStore {
      orders: OrderObj[];
      init: () => void;
      fetchOrders: () => void;
      saveOrderEdit: (product: OrderObj) => void;
      saveOrders: (orders: OrderObj[]) => void;
      pushOrder: (order: OrderObj) => void;
      filterQuery: filterQuery;
      setFilterQuery: (filterQuery: filterQuery) => void;
      loading: boolean;
      error: string;
}

let isInitiated = false;

const useOrdersStore = create<OrderStore>((set, get) => ({

      loading: true,

      initiated: false,

      filterQuery: { page: 1, itemsPerPage: 25 },

      error: "",

      orders: [],

      init: () => {
            if (!isInitiated) {
                  isInitiated = true;
                  get().fetchOrders();
            }
      },

      fetchOrders: async () => {

            const filterQueryString = getQueryString(get().filterQuery);
            set({ loading: true });
            const resp = await new APIClient<ReqResp & { orders: OrderObj[] }>('/admin/orders' + filterQueryString).get();

            if (resp && resp.status == "success") {
                  set({ orders: resp.orders, loading: false });
            } else {
                  set({ orders: [], loading: false, error: resp.message });
            }
      },

      saveOrderEdit: (order) => set((store) => ({
            orders: store.orders.map((p) =>
                  p._id === order._id ? { ...order } : p
            ),
      })),

      saveOrders: (orders) => set({ orders, loading: false }),

      pushOrder: (order) => set({ orders: [order, ...get().orders] }),

      setFilterQuery: (filterQuery) => set({ filterQuery })

}));

export default useOrdersStore;

