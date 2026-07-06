'use client'
import APIClient from '@/app/services/apiClient';
import { UserObj } from '@/Interface';
import { create } from 'zustand';
import { generateRandomString, signToken } from '@/app/Helper';
import { redirect } from 'next/navigation';
import { produce } from 'immer';

interface GuestObj {
      _id: string;
}

interface SessionState {
      user: UserObj | null;
      guest: GuestObj | null;
      loading: boolean;
      initSession: (forceInitGuest?: boolean) => Promise<void>;
      clearSession: () => void;
      setUserSession: (user: UserObj) => void;
      setUserObj: (updater: (prev: UserObj) => void) => void;
}

interface ResponseObj {
      status: string;
      user: UserObj
}

const useSessionStore = create<SessionState>((set, get) => ({

      user: null,
      guest: null,
      loading: true,

      initSession: async (forceInitGuest = false) => {

            if (typeof window !== "undefined") {

                  //check if a user object exist in localstorage
                  if (localStorage.getItem("user") && !forceInitGuest) {
                        // validate the user
                        const resp = await new APIClient<ResponseObj>('/auth/session').get();
                        if (resp && resp.status == "success") {
                              get().setUserSession(resp.user);
                        } else {
                              const guest = JSON.parse(localStorage.getItem("guest") || '{}');
                              set({ user: null, guest, loading: false });
                        }

                  } else if (localStorage.getItem("guest_user") && !forceInitGuest) {
                        //set state to guest
                        const guest = JSON.parse(localStorage.getItem("guest") || '{}');
                        set({ user: null, guest, loading: false });

                  } else {

                        //create guest session
                        const token = await signToken({
                              data: { guestId: generateRandomString(10) },
                              secret: String(process.env.NEXT_PUBLIC_GUEST_SECRET),
                              expiry: '55s'
                        });

                        if (token) {

                              const resp = await new APIClient<ResponseObj>('/auth/guest').post({ token: token })
                              if (resp && resp.status == "success") {
                                    set({ user: null, guest: resp.user, loading: false });
                                    localStorage.setItem("guest_user", JSON.stringify(resp.user))
                              } else {
                                    set({ loading: false });
                                    redirect('/error')
                              }

                        } else {
                              set({ loading: false });
                              redirect('/error')
                        }

                  }
            }

      },

      setUserSession: (user) => {
            set({ user, guest: null, loading: false });
            localStorage.setItem("user", JSON.stringify(user));
      },

      setUserObj: (updater) => {
            set((state) => ({ user: produce(state.user, updater) }));
      },

      clearSession: () => {
            set({ user: null, guest: null, loading: false });
      },
}));

export default useSessionStore;

