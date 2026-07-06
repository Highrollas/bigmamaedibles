'use client'
import APIClient from '@/app/services/apiClient';
import { AdminObj } from '@/Interface';
import { create } from 'zustand';
import { redirect } from 'next/navigation';
import { produce } from 'immer';


interface SessionState {
      admin: AdminObj | null;
      loading: boolean;
      initAdminSession: () => Promise<void>;
      clearSession: () => void;
      setAdminSession: (admin: AdminObj) => void;
      setAdminObj: (updater: (prev: AdminObj) => void) => void;
}

interface ResponseObj {
      status: string;
      admin: AdminObj
}

const useAdminSessionStore = create<SessionState>((set) => ({

      admin: null,
      loading: true,

      initAdminSession: async () => {

            if (typeof window !== "undefined") {

                  //check if a admin object exist in localstorage
                  if (localStorage.getItem("admin")) {
                        // validate the admin
                        const resp = await new APIClient<ResponseObj>('admin/auth/session').get();
                        if (resp && resp.status == "success") {
                              set({ admin: resp.admin, loading: false });
                        } else {
                              redirect("/admin/auth/login");
                        }

                  } else {

                        if (!window.location.pathname.includes("auth")) {
                              redirect("/admin/auth/login");
                        }

                  }
            }

      },

      setAdminSession: (admin) => {
            set({ admin, loading: false });
            localStorage.setItem("admin", JSON.stringify(admin));
      },

      setAdminObj: (updater) => {
            set((state) => ({ admin: produce(state.admin, updater) }));
      },

      clearSession: () => {
            set({ admin: null, loading: false });
      },
}));

export default useAdminSessionStore;

