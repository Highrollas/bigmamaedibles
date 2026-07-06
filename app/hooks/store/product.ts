'use client'

import { getQueryString } from "@/app/Helper";
import APIClient from "@/app/services/apiClient";
import { filterQuery, ProductObj, ReqResp } from "@/Interface"
import { create } from "zustand"

interface ProductsStore {
      filterQuery: filterQuery;
      products: ProductObj[];
      init: () => void;
      fetchProducts: () => void;
      saveProductEdit: (product: ProductObj) => void;
      saveProducts: (products: ProductObj[]) => void;
      setFilterQuery: (filterQuery: filterQuery) => void;
      pushProduct: (product: ProductObj) => void;
      loading: boolean;
      error: string;
}

let isInitiated = false;

const useProductsStore = create<ProductsStore>((set, get) => ({

      filterQuery: { page: 1, itemsPerPage: 25 },

      loading: true,

      error: "",

      products: [],

      init: () => {
            if (!isInitiated) {
                  isInitiated = true;
                  get().fetchProducts();
            }
      },

      fetchProducts: async () => {

            const filterQueryString = getQueryString(get().filterQuery);
            set({ loading: true });
            const resp = await new APIClient<ReqResp & { products: ProductObj[] }>('/admin/products' + filterQueryString).get();

            if (resp && resp.status == "success") {
                  set({ products: resp.products, loading: false });
            } else {
                  set({ products: [], loading: false, error: resp.message });
            }
      },

      pushProduct: (product) => set({ products: [product, ...get().products] }),

      saveProductEdit: (product) => set((store) => ({
            products: store.products.map((p) =>
                  p._id === product._id ? { ...product } : p
            ),
      })),

      saveProducts: (products) => set({ products, loading: false }),

      setFilterQuery: (filterQuery) => set({ filterQuery })

}));

export default useProductsStore;

