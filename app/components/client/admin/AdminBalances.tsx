'use client';

import APIClient from '@/app/services/apiClient';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Summary { _id: string; credits: number; debits: number; net: number; count: number; }
interface Entry { _id: string; username?: string; email: string; amount: number; balanceAfter: number; reason: string; orderId?: string; createdAt: string; pendingAccount: boolean; }
interface Response { status: string; message?: string; summary: Summary[]; transactions: Entry[]; total: number; }
const money = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
const reasons = ['Referral', 'Out of Stock', 'Refund', 'Order', 'Underpayment'];
const inputClass = 'rounded border border-neutral-300 bg-white px-3 py-2 text-sm text-black';

export default function AdminBalances() {
      const [filters, setFilters] = useState({ reason: '', direction: '', dateStart: '', dateEnd: '' });
      const [query, setQuery] = useState('');
      const [page, setPage] = useState(1);
      const [version, setVersion] = useState(0);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState('');
      const [data, setData] = useState<Response | null>(null);

      useEffect(() => {
            let active = true;
            new APIClient<Response>(`admin/balances?${query}&page=${page}`).get().then(response => {
                  if (!active) return;
                  if (response.status === 'success') setData(response);
                  else setError(response.message || 'Unable To Load Balances');
                  setLoading(false);
            });
            return () => { active = false; };
      }, [query, page, version]);

      const reload = () => { setLoading(true); setError(''); setVersion(value => value + 1); };
      const totals = (data?.summary || []).reduce((sum, row) => ({ credits: sum.credits + row.credits, debits: sum.debits + row.debits, net: sum.net + row.net }), { credits: 0, debits: 0, net: 0 });

      return <main className="min-h-screen bg-white p-4 text-black sm:p-8">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-5">
                  <h1 className="text-2xl font-bold">Balances</h1>
                  <button type="button" title="Refresh balances" aria-label="Refresh balances" onClick={reload} className="btn h-10 w-10 p-0! [zoom:1]!"><RefreshCw size={18} /></button>
            </div>
            <form className="my-6 flex flex-wrap items-end gap-3" onSubmit={event => {
                  event.preventDefault();
                  setLoading(true); setError(''); setPage(1); setQuery(new URLSearchParams(filters).toString()); setVersion(value => value + 1);
            }}>
                  <label className="flex flex-col gap-1 text-sm">From<input type="date" className={inputClass} value={filters.dateStart} onChange={event => setFilters({ ...filters, dateStart: event.target.value })} /></label>
                  <label className="flex flex-col gap-1 text-sm">To<input type="date" className={inputClass} value={filters.dateEnd} onChange={event => setFilters({ ...filters, dateEnd: event.target.value })} /></label>
                  <label className="flex flex-col gap-1 text-sm">Type<select className={inputClass} value={filters.reason} onChange={event => setFilters({ ...filters, reason: event.target.value })}><option value="">All Types</option>{reasons.map(reason => <option key={reason}>{reason}</option>)}</select></label>
                  <label className="flex flex-col gap-1 text-sm">Movement<select className={inputClass} value={filters.direction} onChange={event => setFilters({ ...filters, direction: event.target.value })}><option value="">All Movements</option><option value="credit">Credits</option><option value="debit">Debits</option></select></label>
                  <button type="submit" className="btn">Apply</button>
            </form>
            {error && <p role="alert" className="mb-5 text-red-600">{error}</p>}
            <div className="grid grid-cols-1 gap-5 border-y border-neutral-200 py-5 sm:grid-cols-3">
                  {[['Total Credited', totals.credits], ['Total Debited', totals.debits], ['Net Movement', totals.net]].map(([label, value]) => <div key={label}><div className="text-sm text-neutral-500">{label}</div><div className="mt-1 text-2xl font-bold">{loading ? '...' : money.format(Number(value))}</div></div>)}
            </div>
            <h2 className="mb-3 mt-7 text-lg font-bold">Balance Types</h2>
            <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b bg-neutral-50"><tr><th className="p-3">Type</th><th className="p-3 text-right">Credited</th><th className="p-3 text-right">Debited</th><th className="p-3 text-right">Net</th></tr></thead><tbody>{reasons.map(reason => {
                  const row = data?.summary.find(value => value._id === reason);
                  return <tr key={reason} className="border-b border-neutral-100"><td className="p-3">{reason === 'Out of Stock' ? 'Out-of-Stock Cancellations' : reason === 'Refund' ? 'Refunds / Admin Adjustments' : reason}</td><td className="p-3 text-right text-green-700">{money.format(row?.credits || 0)}</td><td className="p-3 text-right text-red-600">{money.format(row?.debits || 0)}</td><td className="p-3 text-right">{money.format(row?.net || 0)}</td></tr>;
            })}</tbody></table></div>
            <h2 className="mb-3 mt-8 text-lg font-bold">Transactions</h2>
            {loading ? <p role="status" className="py-6">Loading Balances...</p> : <div className="overflow-x-auto"><table className="w-full whitespace-nowrap text-left text-sm"><thead className="border-b bg-neutral-50"><tr>{['Date', 'Customer', 'Type', 'Order', 'Amount', 'Balance After'].map(label => <th key={label} className="p-3">{label}</th>)}</tr></thead><tbody>{data?.transactions.map(entry => <tr key={entry._id} className="border-b border-neutral-100"><td className="p-3">{new Date(entry.createdAt).toLocaleString('en-GB', { timeZone: 'Europe/London' })}</td><td className="p-3">{entry.username ? `@${entry.username}` : entry.email}{entry.pendingAccount && <span className="ml-2 text-xs text-neutral-500">Pending Account</span>}</td><td className="p-3">{entry.reason}</td><td className="p-3">{entry.orderId || '-'}</td><td className={`p-3 font-bold ${entry.amount > 0 ? 'text-green-700' : 'text-red-600'}`}>{entry.amount > 0 ? '+' : ''}{money.format(entry.amount)}</td><td className="p-3">{money.format(entry.balanceAfter)}</td></tr>)}</tbody></table>{!data?.transactions.length && !error && <p className="py-8 text-center text-neutral-500">No Balance Transactions</p>}</div>}
            {!!data && data.total > 25 && <div className="mt-5 flex items-center justify-between text-sm"><button type="button" title="Previous page" aria-label="Previous page" disabled={loading || page === 1} className="btn p-3!" onClick={() => { setLoading(true); setPage(value => value - 1); }}><ChevronLeft size={18} /></button><span>Page {page} of {Math.ceil(data.total / 25)}</span><button type="button" title="Next page" aria-label="Next page" disabled={loading || page * 25 >= data.total} className="btn p-3!" onClick={() => { setLoading(true); setPage(value => value + 1); }}><ChevronRight size={18} /></button></div>}
      </main>;
}
