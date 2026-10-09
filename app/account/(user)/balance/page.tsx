"use client";

import useSessionStore from "@/app/hooks/auth/user";
import APIClient from "@/app/services/apiClient";
import { BalanceHistoryEntry } from "@/Interface";
import {
      ChevronDown,
      ChevronLeft,
      ChevronUp,
      LoaderCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BalanceResponse {
      status: string;
      message?: string;
      balance: string;
      history: BalanceHistoryEntry[];
      total: number;
}

const currency = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 2,
});
const dateFormat = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
});

export default function BalancePage() {
      const { user } = useSessionStore();
      const [type, setType] = useState<"received" | "spent">("received");
      const [page, setPage] = useState(1);
      const [balance, setBalance] = useState<string | null>(null);
      const [history, setHistory] = useState<BalanceHistoryEntry[]>([]);
      const [total, setTotal] = useState(0);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState("");
      const [expanded, setExpanded] = useState<string | null>(null);
      const [reload, setReload] = useState(0);

      useEffect(() => {
            if (!user?._id) return;
            let active = true;
            new APIClient<BalanceResponse>(`user/balance?type=${type}&page=${page}`)
                  .get()
                  .then((response) => {
                        if (!active) return;
                        if (response.status === "success") {
                              setBalance(response.balance);
                              setHistory(response.history);
                              setTotal(response.total);
                        } else {
                              setError(response.message || "Unable To Load Balance History");
                        }
                        setLoading(false);
                  });
            return () => {
                  active = false;
            };
      }, [user?._id, type, page, reload]);

      const changeType = (next: "received" | "spent") => {
            if (next === type) return;
            setLoading(true);
            setError("");
            setType(next);
            setPage(1);
            setExpanded(null);
      };

      const changePage = (next: number) => {
            setLoading(true);
            setError("");
            setExpanded(null);
            setPage(next);
      };

      if (!user) return null;
      const received = type === "received";
      const colour = received ? "#08c943" : "#f11621";

      return (
            <main className="mx-auto w-[90%] pb-28">
                  <div className="mt-10 flex">
                        <Link
                              href="/"
                              aria-label="Back to home"
                              className="btn bg-[#e21893] text-white px-3! py-1!"
                        >
                              <ChevronLeft size={20} color="white" />
                        </Link>
                  </div>

                  <div className="mt-7 flex overflow-hidden rounded-lg border-[3.5px] border-[#e21893] sm:min-h-[100px]">
                        <div className="flex w-[18%] shrink-0 items-center justify-center bg-[#e21893] p-2">
                              <Image
                                    src="/assets/images/avaters/nightmare.png"
                                    alt=""
                                    width={100}
                                    height={100}
                                    className="h-10 w-auto object-contain sm:h-20"
                              />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-2 px-3 py-3 font-bold! text-[#e21893] sm:px-6">
                              <h1 className="text-base font-bold! sm:text-xl">Current Balance</h1>
                              <span className="break-all text-xl sm:text-3xl">
                                    {currency.format(Number(balance ?? user.balance) || 0)}
                              </span>
                        </div>
                  </div>

                  <div
                        role="tablist"
                        aria-label="Balance history"
                        className="mx-auto my-10 flex max-w-sm justify-center gap-6 sm:my-12 sm:gap-10"
                  >
                        {(["received", "spent"] as const).map((tab) => {
                              const selected = type === tab;
                              const tabColour = tab === "received" ? "#08c943" : "#f11621";
                              return (
                                    <button
                                          key={tab}
                                          type="button"
                                          role="tab"
                                          id={`balance-tab-${tab}`}
                                          aria-selected={selected}
                                          aria-controls="balance-history"
                                          onClick={() => changeType(tab)}
                                          className="h-12 min-w-0! w-[35%] rounded-lg border-[3px]! border-solid! p-0! text-sm font-bold! [zoom:1]!"
                                          style={{
                                                backgroundColor: selected ? tabColour : "white",
                                                color: selected ? "white" : tabColour,
                                                borderColor: tabColour,
                                          }}
                                    >
                                          {tab === "received" ? "Received" : "Spent"}
                                    </button>
                              );
                        })}
                  </div>

                  <section
                        id="balance-history"
                        role="tabpanel"
                        aria-labelledby={`balance-tab-${type}`}
                        aria-busy={loading}
                        style={{ color: colour }}
                  >
                        <div className="grid grid-cols-[1fr_1.15fr_1.15fr_1fr_20px] items-center gap-1 px-2 text-center text-[11px] font-bold! sm:px-4 sm:text-base">
                              <span>{received ? "From" : "To"}</span>
                              <span>Date</span>
                              <span>Reason</span>
                              <span>Amount</span>
                              <span />
                        </div>
                        {loading ? (
                              <div role="status" className="flex justify-center py-10">
                                    <LoaderCircle
                                          aria-label="Loading balance history"
                                          className="animate-spin"
                                    />
                              </div>
                        ) : error ? (
                              <div role="alert" className="py-8 text-center text-sm text-red-600">
                                    <p>{error}</p>
                                    <button
                                          type="button"
                                          onClick={() => {
                                                setLoading(true);
                                                setError("");
                                                setReload((value) => value + 1);
                                          }}
                                          className="btn mt-4"
                                    >
                                          Retry
                                    </button>
                              </div>
                        ) : history.length === 0 ? (
                              <p className="py-10 text-center text-sm text-[#e21893]">
                                    No {received ? "Received" : "Spent"} Balance History Yet
                              </p>
                        ) : (
                              history.map((entry) => (
                                    <div
                                          key={entry._id}
                                          className="mt-4 overflow-hidden rounded-[5px] border-2"
                                          style={{ borderColor: colour }}
                                    >
                                          <button
                                                type="button"
                                                aria-expanded={expanded === entry._id}
                                                aria-controls={`balance-entry-${entry._id}`}
                                                onClick={() =>
                                                      setExpanded(expanded === entry._id ? null : entry._id)
                                                }
                                                className="grid min-h-14 w-full grid-cols-[1fr_1.15fr_1.15fr_1fr_20px] items-center gap-1 bg-white! px-2! py-3! text-center text-[11px] font-bold! [zoom:1]! sm:px-4! sm:text-sm"
                                                style={{ color: colour }}
                                          >
                                                <span
                                                      className="min-w-0 break-words"
                                                      style={{
                                                            color: !received && entry.orderId ? "#2563eb" : colour,
                                                      }}
                                                >
                                                      {entry.counterparty}
                                                </span>
                                                <span>{dateFormat.format(new Date(entry.createdAt))}</span>
                                                <span
                                                      className="min-w-0 break-words rounded-[5px] px-1 py-1 text-[10px] text-white sm:text-xs"
                                                      style={{ backgroundColor: colour }}
                                                >
                                                      {entry.reason}
                                                </span>
                                                <span className="min-w-0 break-words">
                                                      {entry.amount > 0 ? "+" : "-"}
                                                      {currency.format(Math.abs(entry.amount))}
                                                </span>
                                                {expanded === entry._id ? (
                                                      <ChevronUp size={18} />
                                                ) : (
                                                      <ChevronDown size={18} />
                                                )}
                                          </button>
                                          {expanded === entry._id && (
                                                <div
                                                      id={`balance-entry-${entry._id}`}
                                                      className="border-t px-4 py-4 text-sm text-black"
                                                      style={{ borderColor: colour }}
                                                >
                                                      <dl className="grid grid-cols-2 gap-2">
                                                            <dt>Reason</dt>
                                                            <dd className="text-right">{entry.reason}</dd>
                                                            <dt>Balance After</dt>
                                                            <dd className="text-right">
                                                                  {currency.format(entry.balanceAfter)}
                                                            </dd>
                                                            {entry.orderId && (
                                                                  <>
                                                                        <dt>Order ID</dt>
                                                                        <dd className="break-words text-right">
                                                                              {entry.orderId}
                                                                        </dd>
                                                                  </>
                                                            )}
                                                      </dl>
                                                </div>
                                          )}
                                    </div>
                              ))
                        )}
                        {!loading && !error && total > 20 && (
                              <div className="mt-6 flex items-center justify-between text-sm text-black">
                                    <button
                                          type="button"
                                          className="btn px-3!"
                                          disabled={page === 1}
                                          onClick={() => changePage(page - 1)}
                                    >
                                          Previous
                                    </button>
                                    <span>
                                          Page {page} of {Math.ceil(total / 20)}
                                    </span>
                                    <button
                                          type="button"
                                          className="btn px-3!"
                                          disabled={page * 20 >= total}
                                          onClick={() => changePage(page + 1)}
                                    >
                                          Next
                                    </button>
                              </div>
                        )}
                  </section>
            </main>
      );
}
