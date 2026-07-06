'use client'

import { getQueryString } from "@/app/Helper";
import APIClient from "@/app/services/apiClient";
import { filterQuery, VoucherObj, ReqResp } from "@/Interface"
import { create } from "zustand"

interface VouchersStore {
      filterQuery: filterQuery;
      vouchers: VoucherObj[];
      init: () => void;
      fetchVouchers: () => void;
      saveVoucherEdit: (voucher: VoucherObj) => void;
      saveVouchers: (vouchers: VoucherObj[]) => void;
      setFilterQuery: (filterQuery: filterQuery) => void;
      pushVoucher: (voucher: VoucherObj) => void;
      loading: boolean;
      error: string;
}

let isInitiated = false;

const useVouchersStore = create<VouchersStore>((set, get) => ({

      filterQuery: { page: 1, itemsPerPage: 25 },

      loading: true,

      error: "",

      vouchers: [],

      init: () => {
            if (!isInitiated) {
                  isInitiated = true;
                  get().fetchVouchers();
            }
      },

      fetchVouchers: async () => {

            const filterQueryString = getQueryString(get().filterQuery);
            set({ loading: true });
            const resp = await new APIClient<ReqResp & { vouchers: VoucherObj[] }>('/admin/vouchers' + filterQueryString).get();

            if (resp && resp.status == "success") {
                  set({ vouchers: resp.vouchers, loading: false });
            } else {
                  set({ vouchers: [], loading: false, error: resp.message });
            }
      },

      pushVoucher: (voucher) => set({ vouchers: [voucher, ...get().vouchers] }),

      saveVoucherEdit: (voucher) => set((store) => ({
            vouchers: store.vouchers.map((p) =>
                  p._id === voucher._id ? { ...voucher } : p
            ),
      })),

      saveVouchers: (vouchers) => set({ vouchers, loading: false }),

      setFilterQuery: (filterQuery) => set({ filterQuery })

}));

export default useVouchersStore;

