'use client'

import APIClient from "@/app/services/apiClient";
import { CategoryObj, ReqResp } from "@/Interface"
import { create } from "zustand"

interface CategoryStore {
      categories: CategoryObj[];
      init: () => void;
      fetchCategories: () => void;
      saveCategoryEdit: (product: CategoryObj) => void;
      saveCategories: (categories: CategoryObj[]) => void;
      pushCategory: (category: CategoryObj) => void;
      loading: boolean;
      error: string;
}

let isInitiated = false;

const useCategoriesStore = create<CategoryStore>((set, get) => ({

      loading: true,

      initiated: false,

      error: "",

      categories: [],

      init: () => {
            if (!isInitiated) {
                  isInitiated = true;
                  get().fetchCategories();
            }
      },

      fetchCategories: async () => {

            set({ loading: true });
            const resp = await new APIClient<ReqResp & { categories: CategoryObj[] }>('/admin/categories').get();

            if (resp && resp.status == "success") {
                  set({ categories: resp.categories, loading: false });
            } else {
                  set({ categories: [], loading: false, error: resp.message });
            }
      },

      saveCategoryEdit: (product) => set((store) => ({
            categories: store.categories.map((p) =>
                  p._id === product._id ? { ...product } : p
            ),
      })),

      saveCategories: (categories) => set({ categories, loading: false }),

      pushCategory: (category) => set({ categories: [category, ...get().categories] }),

}));

export default useCategoriesStore;

