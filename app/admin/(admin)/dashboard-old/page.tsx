/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import useStatsStore from '@/app/hooks/store/stats';
import { CURRENCY_SYMBOL, STATS_START_DATE_ISO, WEEKLY_EXPENSES } from '@/constants';
import { startOfToday, startOfMonth, addDays, set } from 'date-fns';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type FilterType = "daily" | "weekly" | "monthly" | "alltime" | "custom";

const statsStartDate = new Date(STATS_START_DATE_ISO);

const isBeforeStatsStart = (date: Date | "all") => date !== "all" && date < statsStartDate;

const buildDashboardUrl = (path: string, type: FilterType, dateStart: Date | "all", dateEnd: Date | "all") => {
      const params = new URLSearchParams({
            filterType: type,
            dateStart: dateStart === "all" ? "all" : dateStart.toISOString(),
            dateEnd: dateEnd === "all" ? "all" : dateEnd.toISOString(),
      });

      return `${path}?${params.toString()}`;
};

const AdminDashboardPage = () => {

      const { stats, loading, filterQuery, setFilterQuery, fetchStats } = useStatsStore();
      const router = useRouter();
      const [filterLoaded, setFilterLoaded] = useState(false);
      const [filterType, setFilterType] = useState<FilterType>("monthly");
      const [netProfit, setNetProfit] = useState<number>(0);

      const applyHistoricalFilter = (type: FilterType, dateStart: Date | "all", dateEnd: Date | "all") => {
            if (dateStart !== "all" && !isBeforeStatsStart(dateStart)) {
                  router.push(buildDashboardUrl('/admin/dashboard', type, dateStart, dateEnd));
                  return;
            }

            setFilterQuery({
                  dateStart: dateStart === "all" ? "all" as any : dateStart.toISOString() as any,
                  dateEnd: dateEnd === "all" ? "all" as any : dateEnd.toISOString() as any,
                  month: undefined,
                  startFromReset: undefined
            });
            setFilterLoaded(true);
            fetchStats().then((_stats) => {
                  setNetProfit(_stats.totalProfit - (WEEKLY_EXPENSES + parseFloat(_stats.orderPackagingCost) + parseFloat(_stats.productPackagingCost)));
                  setFilterType(type);
            });
      };

      const quickFilters = [
            {
                  label: 'Today',
                  onClick: () => {
                        applyHistoricalFilter("daily", startOfToday(), new Date());
                  },
            },
            {
                  label: 'This Week',
                  onClick: () => {

                        const now = new Date();
                        // Step 1: Find last Friday 4pm
                        let lastFriday4pm = set(now, { hours: 16, minutes: 0, seconds: 0, milliseconds: 0 });

                        // Go back until it's Friday
                        while (lastFriday4pm.getDay() !== 5 || lastFriday4pm > now) {
                              lastFriday4pm = addDays(lastFriday4pm, -1);
                        }

                        // Step 2: Calculate next Friday 4pm
                        const nextFriday4pm = addDays(lastFriday4pm, 7);

                        applyHistoricalFilter("weekly", lastFriday4pm, nextFriday4pm);
                  },
            },
            {
                  label: 'Last Week',
                  onClick: () => {
                        const now = new Date();

                        // Step 1: Find last Friday 4pm (same as in "This Week")
                        let lastFriday4pm = set(now, { hours: 16, minutes: 0, seconds: 0, milliseconds: 0 });

                        // Walk backwards until it's a Friday before "now"
                        while (lastFriday4pm.getDay() !== 5 || lastFriday4pm > now) {
                              lastFriday4pm = addDays(lastFriday4pm, -1);
                        }

                        // Step 2: From that, go back 7 days → "previous Friday 4pm"
                        const prevFriday4pm = addDays(lastFriday4pm, -7);

                        applyHistoricalFilter("weekly", prevFriday4pm, lastFriday4pm);
                  },
            },
            {
                  label: 'This Month',
                  onClick: () => {
                        applyHistoricalFilter("monthly", startOfMonth(new Date()), new Date());
                  },
            },
            {
                  label: 'All Time',
                  onClick: () => {
                        applyHistoricalFilter("alltime", "all", "all");
                  },
            },
      ];

      const handleApplyFilter = () => {
            const dateStart = filterQuery.dateStart && filterQuery.dateStart !== "all"
                  ? new Date(filterQuery.dateStart)
                  : "all";
            const dateEnd = filterQuery.dateEnd && filterQuery.dateEnd !== "all"
                  ? new Date(filterQuery.dateEnd)
                  : "all";

            applyHistoricalFilter("custom", dateStart, dateEnd);
      };

      useEffect(() => {
            const searchParams = new URLSearchParams(window.location.search);
            const queryDateStart = searchParams.get("dateStart");
            const queryDateEnd = searchParams.get("dateEnd");
            const queryFilterType = searchParams.get("filterType") as FilterType | null;

            if (!queryDateStart || !queryDateEnd) return;

            const dateStart = queryDateStart === "all" ? "all" : new Date(queryDateStart);
            const dateEnd = queryDateEnd === "all" ? "all" : new Date(queryDateEnd);

            if (dateStart !== "all" && !isBeforeStatsStart(dateStart)) {
                  router.replace(buildDashboardUrl('/admin/dashboard', queryFilterType || 'custom', dateStart, dateEnd));
                  return;
            }

            setFilterQuery({
                  dateStart: queryDateStart as any,
                  dateEnd: queryDateEnd as any,
                  month: undefined,
                  startFromReset: undefined
            });
            setFilterLoaded(true);
            fetchStats().then((_stats) => {
                  setNetProfit(_stats.totalProfit - (WEEKLY_EXPENSES + parseFloat(_stats.orderPackagingCost) + parseFloat(_stats.productPackagingCost)));
                  setFilterType(queryFilterType || "custom");
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return (

            <div className="p-6 font-bold!">

                  <h2 className="text-2xl font-bold mb-6 text-white">📊 Site Statistics</h2>

                  <div className="flex flex-wrap gap-4 mb-6 items-end">

                        {/* Custom date range */}
                        <div className="w-[50%] sm:w-[20%]">
                              <label className="block text-sm mb-1">Date Start:</label>
                              <input
                                    type="datetime-local"
                                    className="input input-bordered w-full"
                                    onChange={(e) => setFilterQuery({ dateStart: new Date(new Date(e.target.value).toUTCString()).toISOString(), startFromReset: undefined })}
                              />
                        </div>
                        <div className="w-[50%] sm:w-[20%]">
                              <label className="block text-sm mb-1">Date End:</label>
                              <input
                                    type="datetime-local"
                                    className="input input-bordered w-full"
                                    onChange={(e) => setFilterQuery({ dateEnd: new Date(new Date(e.target.value).toUTCString()).toISOString(), startFromReset: undefined })}
                              />
                        </div>

                        <button
                              className="btn mt-6"
                              onClick={handleApplyFilter}
                        >
                              Apply Filter
                              {loading && <span className="loading loading-spinner w-5 h-5 border-[#e21893]"></span>}
                        </button>

                        {/* Quick filter buttons */}
                        <div className="flex gap-2 flex-wrap">
                              {quickFilters.map((qf) => (
                                    <button
                                          key={qf.label}
                                          className="btn mt-6"
                                          onClick={qf.onClick}
                                    >
                                          {qf.label}
                                    </button>
                              ))}
                        </div>

                  </div>

                  <div className="flex flex-wrap gap-6 items-end justify-start">

                        <div className='w-[100%]'><strong className='text-white'>Finances</strong></div>

                        {/* Revenue */}
                        <div className="stats bg-base-200 shadow border border-base-300 w-[90%] sm:w-[30%]">
                              <div className="stat">
                                    <div className="stat-title text-black">Revenue</div>
                                    <div className="stat-value text-black">{CURRENCY_SYMBOL}{Number(stats?.totalRevenue.toFixed(2)).toLocaleString()}</div>
                                    <div className="stat-desc text-black">💵 Gross amount</div>
                              </div>
                        </div>

                        {/* Profit */}
                        <div className="stats bg-base-200 shadow border border-base-300 w-[90%] sm:w-[30%]">
                              <div className="stat">
                                    <div className="stat-title text-black">Profit</div>
                                    <div className="stat-value text-success">{CURRENCY_SYMBOL}{Number(stats?.totalProfit.toFixed(2)).toLocaleString()}</div>
                                    <div className="stat-desc text-black">💼 Net after cost</div>
                              </div>
                        </div>

                        <div className="stats bg-base-200 shadow border border-base-300 w-[90%] sm:w-[30%]">
                              <div className="stat">
                                    <div className="stat-title text-black">Expenses</div>
                                    <div className="stat-value text-danger">{CURRENCY_SYMBOL}{WEEKLY_EXPENSES.toLocaleString()}</div>
                                    <div className="stat-desc text-black">👱‍♂️ Weekly Expenses Friday-Friday</div>
                              </div>
                        </div>

                        {filterType === "weekly" && <>

                              <div className='w-[100%]'><strong className='text-white'>Week Finance Summary</strong></div>


                              {/* Net Profit */}
                              < div className="stats bg-base-200 shadow border border-base-300 w-[90%] sm:w-[30%]">
                                    <div className="stat">
                                          <div className="stat-title text-black">Net Profit</div>
                                          <div className="stat-value text-black">{CURRENCY_SYMBOL}{Number(netProfit.toFixed(2)).toLocaleString()}</div>
                                          <div className="stat-desc text-black">💵 Profit - Expenses</div>
                                    </div>
                              </div>

                              {/* Profit */}
                              <div className="stats bg-base-200 shadow border border-base-300 w-[90%] sm:w-[30%]">
                                    <div className="stat">
                                          <div className="stat-title text-black">Savings</div>
                                          <div className="stat-value text-success">{CURRENCY_SYMBOL}{Number((netProfit / 2).toFixed(2)).toLocaleString()}</div>
                                          <div className="stat-desc text-black">🗃️ Weekly Save</div>
                                    </div>
                              </div>

                              <div className="stats bg-base-200 shadow border border-base-300 w-[90%] sm:w-[30%]">
                                    <div className="stat">
                                          <div className="stat-title text-black">Reinvestment</div>
                                          <div className="stat-value text-danger">{CURRENCY_SYMBOL}{Number((netProfit / 2).toFixed(2)).toLocaleString()}</div>
                                          <div className="stat-desc text-black">💹 Amount Put Back Into Business</div>
                                    </div>
                              </div>

                        </>
                        }

                        <div className='w-[100%]'><strong className='text-white'>Statistics</strong></div>

                        {/* Orders */}
                        <div className="stats bg-base-200 shadow border border-base-300 w-[90%] sm:w-[30%]">
                              <div className="stat">
                                    <div className="stat-title text-black">
                                          {(filterLoaded && (filterQuery.dateStart || filterQuery.dateEnd))
                                                ? `Orders (${filterQuery.dateStart ? new Date(filterQuery.dateStart!).toLocaleString() : ''} - ${filterQuery.dateEnd ? new Date(filterQuery.dateEnd!).toLocaleString() : ''})`
                                                : 'Orders'}
                                    </div>
                                    <div className="stat-value text-[purple]">{stats?.totalOrders}</div>
                                    <div className="stat-desc text-black">🗓️ All processed orders</div>
                              </div>
                        </div>


                        {/* New Users */}
                        <div className="stats bg-base-200 shadow border border-base-300 w-[90%] sm:w-[30%]">
                              <div className="stat">
                                    <div className="stat-title text-black">New Customers</div>
                                    <div className="stat-value text-info">{stats?.newUsers}</div>
                                    <div className="stat-desc text-black">👤 First-time orderers</div>
                              </div>
                        </div>

                        <div className="stats bg-base-200 shadow border border-base-300 w-[90%] sm:w-[30%]">
                              <div className="stat">
                                    <div className="stat-title text-black">Return Cutsomers</div>
                                    <div className="stat-value text-info">{stats?.usersWithMultipleOrders}</div>
                                    <div className="stat-desc text-black">👱‍♂️ customers who have bought more than once</div>
                              </div>
                        </div>

                        <div className='w-[100%]'><strong className='text-white'>Packaging</strong></div>


                        <div className="stats bg-base-200 shadow border border-base-300 w-[90%] sm:w-[30%]">
                              <div className="stat">
                                    <div className="stat-title text-black">Order Packaging Cost</div>
                                    <div className="stat-value text-info">{CURRENCY_SYMBOL}{stats?.orderPackagingCost}</div>
                                    <div className="stat-desc text-black">📦 Cost of order packaging</div>
                              </div>
                        </div>

                        <div className="stats bg-base-200 shadow border border-base-300 w-[90%] sm:w-[30%]">
                              <div className="stat">
                                    <div className="stat-title text-black">Product Packaging Cost</div>
                                    <div className="stat-value text-info">{CURRENCY_SYMBOL}{stats?.productPackagingCost}</div>
                                    <div className="stat-desc text-black">📦 Cost of product packaging</div>
                              </div>
                        </div>

                  </div>

            </div >
      );
};

export default AdminDashboardPage;
