'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type InvoiceRow = {
  id: string;
  invoice_no: string;
  invoice_date: string;
  place_of_supply: string | null;
  grand_total: number | null;
  status: string | null;
};

export default function InvoicesIndex() {
  const [rows, setRows] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('id, invoice_no, invoice_date, place_of_supply, grand_total, status')
        .order('invoice_date', { ascending: false })
        .limit(50);
      if (!mounted) return;
      if (error) setErr(error.message);
      else setRows(data || []);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-6">Loading…</div>;
  if (err) return <div className="p-6 text-red-600">Error: {err}</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Invoices</h1>
        <Link href="/admin/invoices/new" className="inline-flex h-10 px-4 items-center rounded-md bg-black text-white hover:opacity-90">
          New Invoice
        </Link>
      </div>

      <div className="overflow-x-auto border rounded-md">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/40">
            <tr className="text-left">
              <th className="p-3">Invoice #</th>
              <th className="p-3">Date</th>
              <th className="p-3">Place of Supply</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-3 font-medium">{r.invoice_no}</td>
                <td className="p-3">{r.invoice_date}</td>
                <td className="p-3">{r.place_of_supply ?? '-'}</td>
                <td className="p-3 text-right">₹ {r.grand_total?.toFixed(2) ?? '0.00'}</td>
                <td className="p-3">{r.status ?? 'issued'}</td>
                <td className="p-3">
                  <Link className="underline" href={`/admin/invoices/${r.id}`}>View</Link>{' '}
                  <span className="mx-1">|</span>
                  <Link className="underline" href={`/admin/invoices/${r.id}/print`} target="_blank">Print</Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td className="p-6 text-center text-gray-500" colSpan={6}>No invoices yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
