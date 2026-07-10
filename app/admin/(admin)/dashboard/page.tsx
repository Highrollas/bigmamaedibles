/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import useStatsStore from '@/app/hooks/store/stats';
import { CURRENCY_SYMBOL, MONTHLY_EXPENSES, STATS_START_DATE_ISO, WEEKLY_EXPENSES } from '@/constants';
import { addDays, set, startOfMonth, startOfToday } from 'date-fns';
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

const formatCurrency = (value?: number | string) => {
      const amount = typeof value === "string" ? parseFloat(value || "0") : value || 0;
      return CURRENCY_SYMBOL + Number(amount.toFixed(2)).toLocaleString();
};

const getFridayRange = (offsetWeeks = 0) => {
      const now = new Date();
      let friday4pm = set(now, { hours: 16, minutes: 0, seconds: 0, milliseconds: 0 });

      while (friday4pm.getDay() !== 5 || friday4pm > now) {
            friday4pm = addDays(friday4pm, -1);
      }

      const dateStart = addDays(friday4pm, offsetWeeks * 7);
      const dateEnd = addDays(dateStart, 7);

      return { dateStart, dateEnd };
};

const StatCard = ({
      title,
      value,
      desc,
      valueClass = "text-black",
}: {
      title: string;
      value: string | number | undefined;
      desc: string;
      valueClass?: string;
}) => (
      <div className="stats bg-base-200 shadow border border-base-300 w-[90%] sm:w-[30%]">
            <div className="stat">
                  <div className="stat-title text-black">{title}</div>
                  <div className={`stat-value ${valueClass}`}>{value}</div>
                  <div className="stat-desc text-black">{desc}</div>
            </div>
      </div>
);

const AdminDashboardPage = () => {

      const { stats, loading, filterQuery, setFilterQuery, fetchStats } = useStatsStore();
      const router = useRouter();
      const [filterLoaded, setFilterLoaded] = useState(true);
      const [filterType, setFilterType] = useState<FilterType>("weekly");

      const orderPackagingCost = parseFloat(stats?.orderPackagingCost || "0");
      const productPackagingCost = parseFloat(stats?.productPackagingCost || "0");
      const expenses = filterType === "weekly"
            ? WEEKLY_EXPENSES
            : filterType === "monthly"
                  ? MONTHLY_EXPENSES
                  : 0;

      const finalProfit = (stats?.netProfit || stats?.totalProfit || 0)
            - expenses
            - (stats?.postOfficeTotal || 0)
            - orderPackagingCost
            - productPackagingCost;

      const dateLabel = filterLoaded && filterQuery.dateStart && filterQuery.dateEnd
            ? filterQuery.dateStart === "all" || filterQuery.dateEnd === "all"
                  ? "All Time"
                  : `${new Date(filterQuery.dateStart).toLocaleString()} - ${new Date(filterQuery.dateEnd).toLocaleString()}`
            : "Current Month";

      const applyQuickFilter = (type: FilterType, dateStart: Date | "all", dateEnd: Date | "all") => {
            const useOldDashboard = isBeforeStatsStart(dateStart);

            if (useOldDashboard) {
                  router.push(buildDashboardUrl('/admin/dashboard-old', type, dateStart, dateEnd));
                  return;
            }

            setFilterQuery({
                  dateStart: dateStart === "all" ? "all" as any : dateStart.toISOString() as any,
                  dateEnd: dateEnd === "all" ? "all" as any : dateEnd.toISOString() as any,
                  month: undefined,
                  startFromReset: useOldDashboard ? undefined : "true"
            });
            setFilterLoaded(true);
            setFilterType(type);
            fetchStats();
      };

      const handleApplyFilter = () => {
            const dateStart = filterQuery.dateStart && filterQuery.dateStart !== "all"
                  ? new Date(filterQuery.dateStart)
                  : "all";
            const useOldDashboard = isBeforeStatsStart(dateStart);

            if (useOldDashboard) {
                  router.push(buildDashboardUrl(
                        '/admin/dashboard-old',
                        'custom',
                        dateStart,
                        filterQuery.dateEnd && filterQuery.dateEnd !== "all" ? new Date(filterQuery.dateEnd) : "all"
                  ));
                  return;
            }

            setFilterQuery({
                  startFromReset: useOldDashboard ? undefined : "true"
            });
            setFilterLoaded(true);
            setFilterType('custom');
            fetchStats();
      };

      const quickFilters = [
            {
                  label: 'Today',
                  onClick: () => applyQuickFilter("daily", startOfToday(), new Date()),
            },
            {
                  label: 'This Week',
                  onClick: () => {
                        const { dateStart, dateEnd } = getFridayRange();
                        applyQuickFilter("weekly", dateStart, dateEnd);
                  },
            },
            {
                  label: 'Last Week',
                  onClick: () => {
                        const { dateStart, dateEnd } = getFridayRange(-1);
                        applyQuickFilter("weekly", dateStart, dateEnd);
                  },
            },
            {
                  label: 'This Month',
                  onClick: () => applyQuickFilter("monthly", startOfMonth(new Date()), new Date()),
            },
            {
                  label: 'All Time',
                  onClick: () => applyQuickFilter("alltime", "all", "all"),
            },
      ];

      useEffect(() => {
            const searchParams = new URLSearchParams(window.location.search);
            const queryDateStart = searchParams.get("dateStart");
            const queryDateEnd = searchParams.get("dateEnd");
            const queryFilterType = searchParams.get("filterType") as FilterType | null;

            if (queryDateStart && queryDateEnd) {
                  const dateStart = queryDateStart === "all" ? "all" : new Date(queryDateStart);
                  const dateEnd = queryDateEnd === "all" ? "all" : new Date(queryDateEnd);

                  if (isBeforeStatsStart(dateStart)) {
                        router.replace(buildDashboardUrl('/admin/dashboard-old', queryFilterType || 'custom', dateStart, dateEnd));
                        return;
                  }

                  setFilterQuery({
                        dateStart: queryDateStart as any,
                        dateEnd: queryDateEnd as any,
                        month: undefined,
                        startFromReset: "true"
                  });
                  setFilterLoaded(true);
                  setFilterType(queryFilterType || "custom");
                  fetchStats();
                  return;
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return (

            <div className="p-6 font-bold!">

                  <h2 className="text-2xl font-bold mb-6 text-white">Site Statistics</h2>

                  <div className="flex flex-wrap gap-4 mb-6 items-end">

                        <div className="w-[50%] sm:w-[20%]">
                              <label className="block text-sm mb-1 text-white">Date Start:</label>
                              <input
                                    type="datetime-local"
                                    className="input input-bordered w-full"
                                    onChange={(e) => setFilterQuery({ dateStart: new Date(new Date(e.target.value).toUTCString()).toISOString() })}
                              />
                        </div>
                        <div className="w-[50%] sm:w-[20%]">
                              <label className="block text-sm mb-1 text-white">Date End:</label>
                              <input
                                    type="datetime-local"
                                    className="input input-bordered w-full"
                                    onChange={(e) => setFilterQuery({ dateEnd: new Date(new Date(e.target.value).toUTCString()).toISOString() })}
                              />
                        </div>

                        <button
                              className="btn mt-6"
                              onClick={handleApplyFilter}
                        >
                              Apply Filter
                              {loading && <span className="loading loading-spinner w-5 h-5 border-[#e21893]"></span>}
                        </button>

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

                        <StatCard
                              title={`Orders (${dateLabel})`}
                              value={stats?.totalOrders || 0}
                              desc="All processed orders"
                              valueClass="text-[purple]"
                        />

                        <StatCard
                              title="Revenue"
                              value={formatCurrency(stats?.totalRevenue)}
                              desc="Gross amount received"
                        />

                        <StatCard
                              title="Cost Of Products"
                              value={formatCurrency(stats?.costOfProducts)}
                              desc="Actual product costs only"
                              valueClass="text-info"
                        />

                        <StatCard
                              title="Net Profit"
                              value={formatCurrency(stats?.netProfit || stats?.totalProfit)}
                              desc="Revenue minus cost of products"
                              valueClass="text-success"
                        />

                        <StatCard
                              title="Expenses"
                              value={formatCurrency(expenses)}
                              desc={filterType === "weekly" ? "Weekly expenses" : filterType === "monthly" ? "Monthly expenses" : "No fixed expense applied"}
                              valueClass="text-error"
                        />

                        <StatCard
                              title="Post Office From Revenue"
                              value={formatCurrency(stats?.postOfficeFromRevenue)}
                              desc="Orders under GBP 100"
                              valueClass="text-success"
                        />

                        <StatCard
                              title="Post Office From Profit"
                              value={formatCurrency(stats?.postOfficeFromProfit)}
                              desc="Free delivery orders GBP 100 or more"
                              valueClass="text-error"
                        />

                        <StatCard
                              title="Post Office Total"
                              value={formatCurrency(stats?.postOfficeTotal)}
                              desc="All parcels at GBP 5.70 each"
                              valueClass="text-info"
                        />

                        <StatCard
                              title="Order Packaging"
                              value={formatCurrency(stats?.orderPackagingCost)}
                              desc="Cost of order packaging"
                              valueClass="text-info"
                        />

                        <StatCard
                              title="Product Packaging"
                              value={formatCurrency(stats?.productPackagingCost)}
                              desc="Cost of product packaging"
                              valueClass="text-info"
                        />

                        <StatCard
                              title="Profit"
                              value={formatCurrency(finalProfit)}
                              desc="Net profit minus expenses, postage and packaging"
                              valueClass={finalProfit >= 0 ? "text-success" : "text-error"}
                        />

                        {filterType === "weekly" && <>
                              <div className='w-[100%]'><strong className='text-white'>Week Finance Summary</strong></div>

                              <StatCard
                                    title="Savings"
                                    value={formatCurrency(finalProfit / 2)}
                                    desc="Weekly save"
                                    valueClass="text-success"
                              />

                              <StatCard
                                    title="Reinvestment"
                                    value={formatCurrency(finalProfit / 2)}
                                    desc="Amount put back into business"
                                    valueClass="text-error"
                              />
                        </>}

                        <div className='w-[100%]'><strong className='text-white'>Statistics</strong></div>

                        <StatCard
                              title="New Customers"
                              value={stats?.newUsers || 0}
                              desc="First-time orderers"
                              valueClass="text-info"
                        />

                        <StatCard
                              title="Return Customers"
                              value={stats?.usersWithMultipleOrders || 0}
                              desc="Customers who bought more than once in this period"
                              valueClass="text-info"
                        />

                  </div>

            </div >
      );
};

export default AdminDashboardPage;

