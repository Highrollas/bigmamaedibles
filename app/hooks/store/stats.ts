/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { create } from 'zustand'
import { getQueryString } from "@/app/Helper";
import APIClient from "@/app/services/apiClient";
import { AdminStats, filterQuery, ReqResp } from "@/Interface";
import { startOfMonth } from 'date-fns';

interface StatsStore {
      stats: AdminStats | null;
      loading: boolean;
      error: string;
      filterQuery: filterQuery;
      init: () => void;
      setFilterQuery: (query: Partial<StatsStore['filterQuery']>) => void;
      fetchStats: () => Promise<AdminStats>;
}

let isInitiated = false;

const useStatsStore = create<StatsStore>((set, get) => ({
      stats: null,
      loading: false,
      error: "",
      filterQuery: {
            dateStart: startOfMonth(new Date()).toISOString() as any,
            dateEnd: new Date().toISOString() as any,
            itemsPerPage: 0, page: 0
      },

      setFilterQuery: (query) => {
            set(state => ({
                  filterQuery: { ...state.filterQuery, ...query }
            }));
      },


      init: () => {
            if (!isInitiated) {
                  isInitiated = true;
                  get().fetchStats();
            }
      },

      fetchStats: async () => {
            set({ loading: true });
            const queryString = getQueryString(get().filterQuery);
            const resp = await new APIClient<ReqResp & { stats: AdminStats }>('admin/stats' + queryString).get();
            if (resp.status === 'success') {
                  set({ stats: resp.stats, loading: false });
            } else {
                  set({ stats: null, loading: false, error: resp.message });
            }

            return resp.stats;
      }
}));

export default useStatsStore;

