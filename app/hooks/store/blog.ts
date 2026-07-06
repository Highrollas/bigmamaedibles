'use client'

import { getQueryString } from "@/app/Helper";
import APIClient from "@/app/services/apiClient";
import { filterQuery, BlogObj, ReqResp } from "@/Interface"
import { create } from "zustand"

interface BlogsStore {
      filterQuery: filterQuery;
      blogs: BlogObj[];
      init: () => void;
      fetchBlogs: () => void;
      saveBlogEdit: (blog: BlogObj) => void;
      saveBlogs: (blogs: BlogObj[]) => void;
      setFilterQuery: (filterQuery: filterQuery) => void;
      pushBlog: (blog: BlogObj) => void;
      loading: boolean;
      error: string;
}

let isInitiated = false;

const useBlogsStore = create<BlogsStore>((set, get) => ({

      filterQuery: { page: 1, itemsPerPage: 25 },

      loading: true,

      error: "",

      blogs: [],

      init: () => {
            if (!isInitiated) {
                  isInitiated = true;
                  get().fetchBlogs();
            }
      },

      fetchBlogs: async () => {

            const filterQueryString = getQueryString(get().filterQuery);
            set({ loading: true });
            const resp = await new APIClient<ReqResp & { posts: BlogObj[] }>('/admin/blogs' + filterQueryString).get();

            if (resp && resp.status == "success") {
                  set({ blogs: resp.posts, loading: false });
            } else {
                  set({ blogs: [], loading: false, error: resp.message });
            }
      },

      pushBlog: (blog) => set({ blogs: [blog, ...get().blogs] }),

      saveBlogEdit: (blog) => set((store) => ({
            blogs: store.blogs.map((p) =>
                  p._id === blog._id ? { ...blog } : p
            ),
      })),

      saveBlogs: (blogs) => set({ blogs, loading: false }),

      setFilterQuery: (filterQuery) => set({ filterQuery })

}));

export default useBlogsStore;

