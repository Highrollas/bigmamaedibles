'use client';

import APIClient from '@/app/services/apiClient';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Summary { _id: string; credits: number; debits: number; net: number; count: number; }
interface Entry { _id: string; username?: string; email: string; amount: number; balanceAfter: number; reason: string; orderId?: string; createdAt: string; pendingAccount: boolean; }
interface Response { status: string; message?: string; summary: Summary[]; transactions: Entry[]; total: number; }
const money = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
const typeLabels: Record<string, string> = {
      Referral: 'Referral Balance',
      'Out of Stock': 'Out Of Stock Balance',
      Refund: 'Manual Refund / Adjustment',
      Underpayment: 'Manual Refund / Adjustment',
      Order: 'Balance Used On Order',
};

export default function AdminBalances() {
      const [dates, setDates] = useState({ dateStart: '', dateEnd: '' });
      const [query, setQuery] = useState('');
      const [page, setPage] = useState(1);
      const [version, setVersion] = useState(0);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState('');
      const [data, setData] = useState<Response | null>(null);

      useEffect(() => {
            let active = true;
            new APIClient<Response>(`admin/balances?page=${page}&${query}`).get().then(response => {
                  if (!active) return;
                  if (response.status === 'success') setData(response);
                  else setError(response.message || 'Unable To Load Balances');
                  setLoading(false);
            });
            return () => { active = false; };
      }, [page, version, query]);

      const reload = () => { setLoading(true); setError(''); setVersion(value => value + 1); };
      const totals = (data?.summary || []).reduce((sum, row) => ({ credits: sum.credits + row.credits, debits: sum.debits + row.debits, net: sum.net + row.net }), { credits: 0, debits: 0, net: 0 });
      const categoryTotal = (reason: string, field: 'credits' | 'debits') => (data?.summary || []).filter(row => row._id === reason || (reason === 'Refund' && row._id === 'Underpayment')).reduce((sum, row) => sum + row[field], 0);
      const cards = [
            { label: 'Referral Balances Given', value: categoryTotal('Referral', 'credits') },
            { label: 'Out Of Stock Balances Given', value: categoryTotal('Out of Stock', 'credits') },
            { label: 'Manual Refunds Added', value: categoryTotal('Refund', 'credits') },
            { label: 'Manual Balance Removed', value: categoryTotal('Refund', 'debits') },
            { label: 'Total Balance Given', value: totals.credits },
      ];

      return <main className="min-h-screen bg-[#e21893] p-4 text-black sm:p-8">
            <h1 className="mb-8 text-2xl font-bold! text-white">Balance Overview</h1>
            <form className="mb-6 flex flex-wrap items-end gap-3" onSubmit={event => {
                  event.preventDefault();
                  setLoading(true); setError(''); setPage(1);
                  setQuery(new URLSearchParams(dates).toString());
                  setVersion(value => value + 1);
            }}>
                  <label className="flex flex-col gap-1 text-sm text-white">
                        From
                        <input type="date" value={dates.dateStart} max={dates.dateEnd || undefined} onChange={event => setDates({ ...dates, dateStart: event.target.value })} className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm text-black" />
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-white">
                        To
                        <input type="date" value={dates.dateEnd} min={dates.dateStart || undefined} onChange={event => setDates({ ...dates, dateEnd: event.target.value })} className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm text-black" />
                  </label>
                  <button type="submit" className="btn bg-white! text-[#e21893]!">Apply</button>
                  <button type="button" className="btn bg-white! text-[#e21893]!" onClick={() => {
                        setDates({ dateStart: '', dateEnd: '' }); setQuery(''); setPage(1); reload();
                  }}>Reset</button>
            </form>
            {error && <div role="alert" className="mb-5 rounded bg-white p-4"><p className="text-red-600">{error}</p><button type="button" onClick={reload} className="btn mt-3">Retry</button></div>}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {cards.map(card => <div key={card.label} className="min-h-[104px] rounded-lg border border-neutral-200 bg-white px-7 py-5">
                        <div className="text-sm font-bold!">{card.label}</div>
                        <div className="mt-1 text-2xl font-bold!">{loading ? '...' : money.format(card.value)}</div>
                  </div>)}
            </div>
            <div className="mt-10 overflow-x-auto rounded-[5px] bg-white">
                  <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-neutral-100 text-neutral-500"><tr>{['Date', 'User', 'Type', 'Order', 'Previous', 'Change', 'New Balance'].map(label => <th key={label} className="px-5 py-4 font-bold!">{label}</th>)}</tr></thead>
                        <tbody>{!loading && data?.transactions.map(entry => <tr key={entry._id} className="border-b border-neutral-100 last:border-0">
                              <td className="px-5 py-4">{new Date(entry.createdAt).toLocaleString('en-GB', { timeZone: 'Europe/London' })}</td>
                              <td className="px-5 py-4">{entry.email}</td>
                              <td className="px-5 py-4">{typeLabels[entry.reason] || entry.reason}</td>
                              <td className="px-5 py-4">{entry.orderId || '-'}</td>
                              <td className="px-5 py-4">{money.format(entry.balanceAfter - entry.amount)}</td>
                              <td className={`px-5 py-4 font-bold! ${entry.amount > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{entry.amount > 0 ? '+' : ''}{money.format(entry.amount)}</td>
                              <td className="px-5 py-4">{money.format(entry.balanceAfter)}</td>
                        </tr>)}</tbody>
                  </table>
                  {loading ? <p role="status" className="py-8 text-center text-neutral-500">Loading Balances...</p> : !data?.transactions.length && !error && <p className="py-8 text-center text-neutral-500">No Balance Transactions</p>}
            </div>
            {!!data && data.total > 25 && <div className="mt-5 flex items-center justify-between text-sm text-white"><button type="button" title="Previous page" aria-label="Previous page" disabled={loading || page === 1} className="btn border-2! border-white! p-3!" onClick={() => { setLoading(true); setError(''); setPage(value => value - 1); }}><ChevronLeft size={18} /></button><span>Page {page} of {Math.ceil(data.total / 25)}</span><button type="button" title="Next page" aria-label="Next page" disabled={loading || page * 25 >= data.total} className="btn border-2! border-white! p-3!" onClick={() => { setLoading(true); setError(''); setPage(value => value + 1); }}><ChevronRight size={18} /></button></div>}
      </main>;
}
