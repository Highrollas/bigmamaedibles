'use client';

import useAdminSessionStore from '@/app/hooks/auth/admin';
import { CategoryObj } from '@/Interface';
import { XIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface FilterQuery {
      nameSearch?: string;
      category?: string;
      dateStart?: Date | string;
      dateEnd?: Date | string;
      page: number;
      itemsPerPage: number;
      orderStatus?: string;
      voucherType?: string;
      sortByBalance?: boolean;
}

interface FilterBarProps {
      filterQuery: FilterQuery;
      setFilterQuery: (query: FilterQuery) => void;
      onApply: () => void;
      defaultFilter?: FilterQuery;
      categories?: CategoryObj[];
      showDateFilter?: boolean;
      showOrderStatus?: boolean;
      showVoucherType?: boolean;
      showSortByBalance?: boolean;
      showSearch?: boolean;
}

const FilterBar = ({
      filterQuery,
      setFilterQuery,
      onApply,
      categories,
      showDateFilter = false,
      showOrderStatus = false,
      showVoucherType = false,
      showSortByBalance = false,
      showSearch = true,
      defaultFilter = {
            nameSearch: '',
            category: '',
            page: 1,
            itemsPerPage: 25,
      },
}: FilterBarProps) => {

      const [nameSearch, setNameSearch] = useState(filterQuery.nameSearch || '');
      const [category, setCategory] = useState(filterQuery.category || '');
      const [dateStart, setDateStart] = useState('');
      const [dateEnd, setDateEnd] = useState('');
      const [hasFilter, setHasFilter] = useState(false);
      const [orderStatus, setOrderStatus] = useState(filterQuery.orderStatus || '');
      const [voucherType, setVoucherType] = useState(filterQuery.voucherType || '');
      const [sortByBalance, setSortByBalance] = useState(filterQuery.sortByBalance || false);

      const { admin } = useAdminSessionStore();


      useEffect(() => {
            setNameSearch(filterQuery.nameSearch || '');
            setCategory(filterQuery.category || '');
            setOrderStatus(filterQuery.orderStatus || '');
            setSortByBalance(filterQuery.sortByBalance || false);
            setVoucherType(filterQuery.voucherType || showVoucherType ? 'voucher' : '');
            if (filterQuery.dateStart) setDateStart(new Date(filterQuery.dateStart).toUTCString());
            if (filterQuery.dateEnd) setDateEnd(new Date(filterQuery.dateEnd).toUTCString());
      }, [filterQuery, showVoucherType]);

      const applyFilters = () => {

            const updated: FilterQuery = {
                  ...filterQuery,
                  nameSearch: nameSearch.trim(),
                  page: 1,
                  itemsPerPage: filterQuery.itemsPerPage,
            };

            if (categories && categories.length > 0) updated.category = category;
            if (showDateFilter && dateStart && dateEnd) {
                  updated.dateStart = new Date(dateStart);
                  updated.dateEnd = new Date(dateEnd);
            }

            if (sortByBalance) updated.sortByBalance = true;

            if (orderStatus) updated.orderStatus = orderStatus;
            if (voucherType) updated.voucherType = voucherType;

            setFilterQuery(updated);
            onApply();
            setHasFilter(true);
      };

      const resetFilters = () => {
            setNameSearch(defaultFilter.nameSearch || '');
            setCategory(defaultFilter.category || '');
            setDateStart('');
            setDateEnd('');
            setFilterQuery(defaultFilter);
            onApply();
            setHasFilter(false);
            setOrderStatus('');
            setVoucherType('voucher');

      };

      return (

            <div className="flex flex-wrap gap-2 items-center mb-5 px-3 mt-5">

                  {showSearch &&
                        <div className="w-[31%] sm:w-[15%]">
                              <input
                                    type="text"
                                    placeholder="Search"
                                    className="input input-bordered input-sm w-full"
                                    value={nameSearch}
                                    onChange={(e) => setNameSearch(e.target.value)}
                              />
                        </div>
                  }

                  {categories &&
                        <div className="w-[31%] sm:w-[15%]">
                              <select
                                    className="select select-bordered select-sm w-full"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                              >
                                    <option value="">All</option>
                                    {categories.map((c, i) => (
                                          <option key={i} value={c.name}>
                                                {c.name}
                                          </option>
                                    ))}
                              </select>
                        </div>
                  }

                  {showDateFilter &&
                        <>
                              <div className="w-[31%] sm:w-[10%]">
                                    <input
                                          type="date"
                                          className="input input-bordered input-sm w-full"
                                          value={dateStart}
                                          onChange={(e) => {
                                                setDateStart(new Date(e.target.value).toUTCString());
                                          }}
                                    />
                              </div>
                              <div className="w-[31%] sm:w-[10%]">
                                    <input
                                          type="date"
                                          className="input input-bordered input-sm w-full"
                                          value={dateEnd}
                                          onChange={(e) => setDateEnd(new Date(e.target.value).toUTCString())}
                                    />
                              </div>
                        </>
                  }

                  {showOrderStatus &&
                        <>
                              <div className="w-[31%] sm:w-[10%]">
                                    <select
                                          className="select select-bordered select-sm w-full"
                                          value={orderStatus}
                                          onChange={(e) => setOrderStatus(e.target.value)}
                                    >
                                          {admin?.accessLevel != "D" && <option value="all">All</option>}
                                          <option value="on-hold">Preparing</option>
                                          {admin?.accessLevel != "D" && <option value="processing">Shipped</option>}
                                          {admin?.accessLevel != "D" && <option value="completed">Delivered</option>}
                                          {admin?.accessLevel != "D" && <option value="pending">Pending</option>}
                                          {admin?.accessLevel != "D" && <option value="cancelled">Cancelled</option>}
                                    </select>
                              </div>
                        </>
                  }

                  {showVoucherType &&
                        <>
                              <div className="w-[31%] sm:w-[10%]">
                                    <select
                                          className="select select-bordered select-sm w-full"
                                          value={voucherType}
                                          onChange={(e) => setVoucherType(e.target.value)}
                                    >
                                          <option value="all">All</option>
                                          <option value="voucher">Voucher</option>
                                          <option value="referral">User</option>
                                    </select>
                              </div>
                        </>
                  }

                  {showSortByBalance &&
                        <div className="w-[31%] sm:w-[fit-content] px-2 flex items-center">
                              <label className="label">
                                    <input type="checkbox" checked={sortByBalance} className="checkbox"
                                          onClick={() => setSortByBalance(!sortByBalance)} />
                                    <span className='text-black text-[80%]'> Balance Sort</span>
                              </label>
                        </div>
                  }

                  {hasFilter && (
                        <div className="w-[31%] sm:w-[fit-content]">
                              <div className="w-[fit-content] cursor-pointer">
                                    <div className="flex text-[80%] gap-1" onClick={resetFilters}>
                                          Clear Filter <XIcon size={18} />
                                    </div>
                              </div>
                        </div>
                  )}

                  <div className="w-[31%] sm:w-[10%]">
                        <button className="btn w-full" style={{ zoom: '0.7' }} onClick={applyFilters}>
                              Apply
                        </button>
                  </div>

                  <div className="w-[31%] sm:w-[10%] sm:ml-auto">
                        <select
                              className="select select-bordered select-sm w-full"
                              value={filterQuery.page}
                              onChange={(e) => {
                                    setFilterQuery({ ...filterQuery, page: Number(e.target.value) });
                                    onApply();
                              }}
                        >
                              {Array.from({ length: 50 }, (_, i) => i + 1).map((p) => (
                                    <option key={p} value={p}>
                                          Page {p}
                                    </option>
                              ))}
                        </select>
                  </div>

                  <div className="w-[31%] sm:w-[10%]">
                        <select
                              className="select select-bordered select-sm w-full"
                              value={filterQuery.itemsPerPage}
                              onChange={(e) => {
                                    setFilterQuery({ ...filterQuery, itemsPerPage: Number(e.target.value), page: 1 });
                                    onApply();
                              }}
                        >
                              {[10, 25, 50, 100].map((num) => (
                                    <option key={num} value={num}>
                                          {num} per page
                                    </option>
                              ))}
                        </select>
                  </div>
            </div>
      );
};

export default FilterBar;


