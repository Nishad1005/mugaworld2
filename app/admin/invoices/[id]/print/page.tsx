'use client';

import { useEffect, useMemo, useState } from 'react';

/* ---------- Amount in words (Indian) ---------- */
function toIndianWords(n: number): string {
  if (!Number.isFinite(n)) return '';
  const units = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tens  = ['','', 'Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  const two = (num:number) => num < 20 ? units[num] : (tens[Math.floor(num/10)] + (num%10 ? ' ' + units[num%10] : ''));
  const three = (num:number) => {
    const h = Math.floor(num/100), r = num%100;
    return (h ? units[h] + ' Hundred' + (r ? ' and ' : '') : '') + (r ? two(r) : '');
  };
  const num = Math.round(n);
  if (num === 0) return 'Zero Rupees';
  let x = num;
  const crore = Math.floor(x/10000000); x%=10000000;
  const lakh  = Math.floor(x/100000);  x%=100000;
  const thou  = Math.floor(x/1000);    x%=1000;
  const hund  = Math.floor(x/100);     x%=100;
  const rest  = x;
  const parts:string[] = [];
  if (crore) parts.push(three(crore) + ' Crore');
  if (lakh)  parts.push(three(lakh)  + ' Lakh');
  if (thou)  parts.push(three(thou)  + ' Thousand');
  if (hund)  parts.push(units[hund]  + ' Hundred');
  if (rest)  parts.push((crore||lakh||thou||hund) && rest<100 ? 'and ' + two(rest) : two(rest));
  return parts.join(' ').replace(/\s+/g,' ').trim() + ' Rupees';
}

/* ---------- Types (align with your API) ---------- */
type Item = {
  description: string;
  hsn_sac: string | null;
  unit_price: number;
  quantity: number;
  net_amount: number;
  tax_rate: number;
  tax_type: 'cgst_sgst' | 'igst';
  tax_amount: number;
  line_total: number;
};

type Invoice = {
  id: string;
  invoice_no: string;
  invoice_date: string; // yyyy-mm-dd or ISO
  invoice_type: 'tax_invoice' | 'bill_of_supply' | 'cash_memo';
  place_of_supply: string | null;
  place_of_delivery: string | null;

  order_no?: string | null;
  order_date?: string | null;

  billing_address: {
    line1?: string | null;
    city?: string | null;
    state?: string | null;
    pincode?: string | null;
    pan?: string | null;
    gstin?: string | null;
    cin?: string | null;
    name?: string | null;
  } | null;

  shipping_address: {
    line1?: string | null;
    city?: string | null;
    state?: string | null;
    pincode?: string | null;
    name?: string | null;
  } | null;

  subtotal: number;
  discount_amount: number | null;
  shipping_amount: number | null;
  tax_cgst: number | null;
  tax_sgst: number | null;
  tax_igst: number | null;
  grand_total: number;

  amount_in_words: string | null;

  qr_override_mode: 'inherit' | 'image' | 'upi' | 'url' | null;
  qr_override_image_url: string | null;
  qr_override_upi_vpa: string | null;
  qr_override_url: string | null;
  qr_amount_lock: number | null;
  qr_note: string | null;

  status: string | null;
  invoice_items: Item[];
};

export default function PrintPage({ params }: { params: { id: string } }) {
  const [inv, setInv] = useState<Invoice | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch(`/api/invoices/${params.id}`, { cache: 'no-store' });
        const t = await r.text();
        if (!r.ok) throw new Error(t);
        const data = JSON.parse(t);
        if (mounted) setInv(data);
      } catch (e:any) {
        if (mounted) setErr(e?.message || 'Failed to load invoice');
      }
    })();
    return () => { mounted = false; };
  }, [params.id]);

  const amountWords = useMemo(() => {
    if (!inv) return '';
    return inv.amount_in_words || toIndianWords(inv.grand_total);
  }, [inv]);

  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!inv) return <div className="p-6">Loading…</div>;

  const titleRight =
    (inv.invoice_type === 'bill_of_supply' ? 'Bill of Supply'
      : inv.invoice_type === 'cash_memo' ? 'Cash Memo' : 'Tax Invoice') +
    ' (Original for Recipient)';

  /* ---------- QR block (optional) ---------- */
  const qrBlock = (() => {
    const mode = inv.qr_override_mode || 'inherit';
    if (mode === 'image' && inv.qr_override_image_url) {
      return (
        <div className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={inv.qr_override_image_url} alt="QR" className="h-28 w-28 object-contain mx-auto" />
          {inv.qr_note && <div className="text-[10px] mt-1">{inv.qr_note}</div>}
        </div>
      );
    }
    if (mode === 'upi' && inv.qr_override_upi_vpa) {
      const amount = inv.qr_amount_lock ? `&am=${inv.qr_amount_lock}` : '';
      const url = `upi://pay?pa=${encodeURIComponent(inv.qr_override_upi_vpa)}${amount}`;
      return (
        <div className="text-xs">
          <div className="font-medium">UPI: {inv.qr_override_upi_vpa}</div>
          <div><a className="underline" href={url}>Open in UPI app</a></div>
          {inv.qr_note && <div className="mt-1">{inv.qr_note}</div>}
        </div>
      );
    }
    if (mode === 'url' && inv.qr_override_url) {
      return (
        <div className="text-xs">
          <a className="underline" href={inv.qr_override_url} target="_blank" rel="noreferrer">
            Payment Link
          </a>
          {inv.qr_note && <div className="mt-1">{inv.qr_note}</div>}
        </div>
      );
    }
    return null;
  })();

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 print:bg-white min-h-screen py-6 print:py-0">
      {/* Print CSS */}
      <style>{`
        @media print {
          @page { size: A4; margin: 10mm 10mm 12mm 10mm; }
          .no-print { display: none !important; }
          .page { box-shadow: none !important; border: 0 !important; }
          body { background: #fff !important; }
          .avoid-break { break-inside: avoid; page-break-inside: avoid; }
          .tbl thead tr { break-inside: avoid; page-break-inside: avoid; }
          .footer-note { position: fixed; bottom: 8mm; left: 10mm; right: 10mm; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto page bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 print:text-black shadow-xl rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        {/* Top control bar (hidden in print) */}
        <div className="no-print flex justify-end gap-2 p-3 border-b dark:border-neutral-700">
          <button onClick={() => window.print()} className="h-9 px-3 rounded-md bg-black text-white hover:opacity-90">
            Print
          </button>
        </div>

        {/* Header */}
        <div className="p-6 pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/PNG copy copy.png" alt="Muga World" className="h-11 w-11 rounded-full ring-2 ring-[#D7A444]" />
              <div>
                <div className="text-[18px] font-semibold tracking-wide">Mugaworld Private Limited</div>
                {/* Replace with company settings when available */}
                <div className="text-[11px] text-neutral-700 dark:text-neutral-300">
                  ABC Road, Guwahati, Assam • GSTIN: XXABCDE1234F1Z5 • CIN: U12345AS2024PTC000000
                </div>
              </div>
            </div>
            <div className="text-right">
              <div
                className="inline-flex items-center text-[12px] font-semibold px-3 py-1 rounded-full"
                style={{ background: 'linear-gradient(90deg, #D7A444 0%, #E03631 100%)', color: '#0E0E0E' }}
              >
                {titleRight}
              </div>
              <div className="text-[11px] text-neutral-700 dark:text-neutral-300 mt-1">
                Invoice No: <span className="font-medium text-neutral-800 dark:text-neutral-100">{inv.invoice_no}</span>
              </div>
              <div className="text-[11px] text-neutral-700 dark:text-neutral-300">
                Invoice Date: <span className="font-medium text-neutral-800 dark:text-neutral-100">{inv.invoice_date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Meta blocks */}
        <div className="px-6 pt-2">
          <div className="grid grid-cols-12 gap-4">
            {/* Sold By */}
            <div className="col-span-6 border rounded-lg p-3 avoid-break bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
              <div className="text-[12px] font-semibold mb-1">Sold By</div>
              <div className="text-[12px] leading-[1.15]">
                Mugaworld Private Limited<br />ABC Road, Guwahati, Assam
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
                <div>PAN: <span className="font-medium">XXXXXXXXXX</span></div>
                <div>GSTIN: <span className="font-medium">XXABCDE1234F1Z5</span></div>
                <div>CIN: <span className="font-medium">U12345AS2024PTC000000</span></div>
              </div>
            </div>

            {/* Buyer Addresses */}
            <div className="col-span-6 border rounded-lg p-3 avoid-break bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[12px] font-semibold mb-1">Billing Address</div>
                  <div className="text-[12px] leading-[1.15]">
                    {inv.billing_address?.name && <div className="font-medium">{inv.billing_address.name}</div>}
                    {inv.billing_address?.line1 && <div>{inv.billing_address.line1}</div>}
                    {(inv.billing_address?.city || inv.billing_address?.state || inv.billing_address?.pincode) && (
                      <div>
                        {inv.billing_address?.city}{inv.billing_address?.city && inv.billing_address?.state ? ', ' : ''}{inv.billing_address?.state} {inv.billing_address?.pincode}
                      </div>
                    )}
                  </div>
                  {(inv.billing_address?.pan || inv.billing_address?.gstin || inv.billing_address?.cin) && (
                    <div className="text-[11px] mt-1 space-y-0.5">
                      {inv.billing_address?.pan && <div>PAN: {inv.billing_address.pan}</div>}
                      {inv.billing_address?.gstin && <div>GSTIN: {inv.billing_address.gstin}</div>}
                      {inv.billing_address?.cin && <div>CIN: {inv.billing_address.cin}</div>}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-[12px] font-semibold mb-1">Shipping Address</div>
                  <div className="text-[12px] leading-[1.15]">
                    {inv.shipping_address?.name && <div className="font-medium">{inv.shipping_address.name}</div>}
                    {inv.shipping_address?.line1 && <div>{inv.shipping_address.line1}</div>}
                    {(inv.shipping_address?.city || inv.shipping_address?.state || inv.shipping_address?.pincode) && (
                      <div>
                        {inv.shipping_address?.city}{inv.shipping_address?.city && inv.shipping_address?.state ? ', ' : ''}{inv.shipping_address?.state} {inv.shipping_address?.pincode}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order / Places */}
            <div className="col-span-6 border rounded-lg p-3 text-[12px] avoid-break bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
              <div className="grid grid-cols-2 gap-2">
                <div>Order No: <span className="font-medium">{inv.order_no ?? '—'}</span></div>
                <div>Order Date: <span className="font-medium">{inv.order_date ?? '—'}</span></div>
                <div>Place of Supply: <span className="font-medium">{inv.place_of_supply ?? '—'}</span></div>
                {inv.place_of_delivery && (
                  <div>Place of Delivery: <span className="font-medium">{inv.place_of_delivery}</span></div>
                )}
              </div>
            </div>

            {/* QR (optional) */}
            {qrBlock && (
              <div className="col-span-6 border rounded-lg p-3 avoid-break bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                <div className="text-[12px] font-semibold mb-1">Payment</div>
                {qrBlock}
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="px-6 mt-4">
          <div className="border rounded-xl overflow-hidden dark:border-neutral-700">
            <table className="w-full tbl text-[11.5px] text-neutral-900 dark:text-neutral-100">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60">
                <tr className="text-left">
                  <th className="p-2.5 border-b dark:border-neutral-700">S/N</th>
                  <th className="p-2.5 border-b dark:border-neutral-700">Description</th>
                  <th className="p-2.5 border-b text-right dark:border-neutral-700">Unit Price</th>
                  <th className="p-2.5 border-b text-right dark:border-neutral-700">Qty</th>
                  <th className="p-2.5 border-b text-right dark:border-neutral-700">Net</th>
                  <th className="p-2.5 border-b text-right dark:border-neutral-700">Tax %</th>
                  <th className="p-2.5 border-b dark:border-neutral-700">Tax Type</th>
                  <th className="p-2.5 border-b text-right dark:border-neutral-700">Tax Amt</th>
                  <th className="p-2.5 border-b text-right dark:border-neutral-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {inv.invoice_items.map((it, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2
                      ? 'bg-white dark:bg-neutral-900'
                      : 'bg-neutral-50/60 dark:bg-neutral-800/40'}
                  >
                    <td className="p-2.5 border-t dark:border-neutral-700 align-top">{idx + 1}</td>
                    <td className="p-2.5 border-t dark:border-neutral-700 align-top">
                      <div className="font-medium">{it.description}</div>
                      {it.hsn_sac && <div className="text-[10px] text-neutral-500 dark:text-neutral-300 mt-0.5">HSN/SAC: {it.hsn_sac}</div>}
                    </td>
                    <td className="p-2.5 border-t dark:border-neutral-700 text-right align-top">₹ {it.unit_price.toFixed(2)}</td>
                    <td className="p-2.5 border-t dark:border-neutral-700 text-right align-top">{it.quantity}</td>
                    <td className="p-2.5 border-t dark:border-neutral-700 text-right align-top">₹ {it.net_amount.toFixed(2)}</td>
                    <td className="p-2.5 border-t dark:border-neutral-700 text-right align-top">{it.tax_rate}%</td>
                    <td className="p-2.5 border-t dark:border-neutral-700 align-top uppercase">{it.tax_type.replace('_',' + ').toUpperCase()}</td>
                    <td className="p-2.5 border-t dark:border-neutral-700 text-right align-top">₹ {it.tax_amount.toFixed(2)}</td>
                    <td className="p-2.5 border-t dark:border-neutral-700 text-right align-top">₹ {it.line_total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals + Words + Signature */}
        <div className="px-6 mt-4 mb-6">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-7 text-[11.5px]">
              <div className="border rounded-lg p-3 avoid-break bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                <div className="text-[12px] font-semibold mb-1">Amount in Words</div>
                <div className="italic">{amountWords}</div>
              </div>

              {/* Terms (optional) */}
              <div className="border rounded-lg p-3 mt-3 text-[10.5px] text-neutral-700 dark:text-neutral-300 avoid-break bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                <div className="font-semibold mb-1">Terms &amp; Notes</div>
                <ul className="list-disc ml-4 space-y-0.5">
                  <li>Goods once sold will not be taken back.</li>
                  <li>Subject to Guwahati jurisdiction.</li>
                  <li>This is a computer generated invoice and does not require a physical signature.</li>
                </ul>
              </div>
            </div>

            <div className="col-span-5">
              <div className="border rounded-lg p-3 text-[12px] space-y-1 avoid-break bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                <div className="flex justify-between"><span>Subtotal</span><span>₹ {inv.subtotal.toFixed(2)}</span></div>
                {inv.discount_amount ? <div className="flex justify-between"><span>Discount</span><span>- ₹ {inv.discount_amount.toFixed(2)}</span></div> : null}
                {inv.shipping_amount ? <div className="flex justify-between"><span>Shipping</span><span>₹ {inv.shipping_amount.toFixed(2)}</span></div> : null}
                {inv.tax_cgst ? <div className="flex justify-between"><span>CGST</span><span>₹ {inv.tax_cgst.toFixed(2)}</span></div> : null}
                {inv.tax_sgst ? <div className="flex justify-between"><span>SGST</span><span>₹ {inv.tax_sgst.toFixed(2)}</span></div> : null}
                {inv.tax_igst ? <div className="flex justify-between"><span>IGST</span><span>₹ {inv.tax_igst.toFixed(2)}</span></div> : null}
                <div className="border-t dark:border-neutral-700 pt-2 mt-1 flex justify-between text-[13px] font-semibold">
                  <span>Total Value (in numbers)</span>
                  <span>₹ {inv.grand_total.toFixed(2)}</span>
                </div>
              </div>

              {/* Signature */}
              <div className="border rounded-lg p-3 mt-3 text-[12px] avoid-break bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                <div className="font-semibold">For Mugaworld Private Limited</div>
                <div className="h-14" />
                <div className="text-right text-[12px]">Authorised Signatory</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-4 text-[10px] text-neutral-500 dark:text-neutral-400 footer-note">
          <div className="flex justify-between">
            <div>Printed on {new Date().toLocaleString()}</div>
            <div>Page 1 of 1</div>
          </div>
        </div>
      </div>
    </div>
  );
}

