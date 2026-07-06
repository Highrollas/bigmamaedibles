'use client'

import { getQueryString } from "@/app/Helper";
import APIClient from "@/app/services/apiClient";
import { filterQuery, PostObj, ReqResp } from "@/Interface"
import { create } from "zustand"

interface PostsStore {
      filterQuery: filterQuery;
      posts: PostObj[];
      init: () => void;
      fetchPosts: () => void;
      savePostEdit: (post: PostObj) => void;
      savePosts: (posts: PostObj[]) => void;
      setFilterQuery: (filterQuery: filterQuery) => void;
      pushPost: (post: PostObj) => void;
      loading: boolean;
      error: string;
}

let isInitiated = false;

const usePostsStore = create<PostsStore>((set, get) => ({

      filterQuery: { page: 1, itemsPerPage: 25 },

      loading: true,

      error: "",

      posts: [],

      init: () => {
            if (!isInitiated) {
                  isInitiated = true;
                  get().fetchPosts();
            }
      },

      fetchPosts: async () => {

            const filterQueryString = getQueryString(get().filterQuery);
            set({ loading: true });
            const resp = await new APIClient<ReqResp & { posts: PostObj[] }>('/admin/posts' + filterQueryString).get();

            if (resp && resp.status == "success") {
                  set({ posts: resp.posts, loading: false });
            } else {
                  set({ posts: [], loading: false, error: resp.message });
            }
      },

      pushPost: (post) => set({ posts: [post, ...get().posts] }),

      savePostEdit: (post) => set((store) => ({
            posts: store.posts.map((p) =>
                  p._id === post._id ? { ...post } : p
            ),
      })),

      savePosts: (posts) => set({ posts, loading: false }),

      setFilterQuery: (filterQuery) => set({ filterQuery })

}));

export default usePostsStore;

