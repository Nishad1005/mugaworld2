'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

// --- Amount in words (Indian system) basic helper ---
function toIndianWords(n: number): string {
  if (!Number.isFinite(n)) return '';
  const units = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tens  = ['','', 'Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  function two(num:number){ if(num<20) return units[num]; const t=Math.floor(num/10), u=num%10; return (tens[t] + (u? ' ' + units[u]:'')); }
  function three(num:number){ const h=Math.floor(num/100), r=num%100; return (h? units[h] + ' Hundred' + (r?' and ':''):'') + (r? two(r):''); }
  const num = Math.round(n); // round to rupees
  if (num === 0) return 'Zero Rupees';
  const parts:number[] = [];
  let x=num;
  // Indian groups: Crore, Lakh, Thousand, Hundred, rest
  const crore = Math.floor(x/10000000); if (crore){ parts.push(crore); x%=10000000; }
  const lakh  = Math.floor(x/100000);  if (lakh){ parts.push(lakh);  x%=100000; }
  const thou  = Math.floor(x/1000);    if (thou){ parts.push(thou);  x%=1000; }
  const hund  = Math.floor(x/100);     if (hund){ parts.push(hund);  x%=100; }
  const rest  = x;
  const words:string[] = [];
  let idx=0;
  if (crore) { words.push(three(crore) + ' Crore'); idx++; }
  if (lakh)  { words.push(three(lakh)  + ' Lakh');  idx++; }
  if (thou)  { words.push(three(thou)  + ' Thousand'); idx++; }
  if (hund)  { words.push(units[hund]  + ' Hundred'); idx++; }
  if (rest)  { words.push(rest<100 && (crore || lakh || thou || hund) ? 'and ' + two(rest) : two(rest)); }
  return (words.join(' ').replace(/\s+/g,' ').trim() + ' Rupees');
}

type Item = {
  description: string;
  hsn_sac: string | null;
  unit_price: number;
  quantity: number;
  line_discount: number | null;
  net_amount: number;
  tax_rate: number;
  tax_type: 'cgst_sgst' | 'igst';
  tax_amount: number;
  line_total: number;
};

type Invoice = {
  id: string;
  invoice_no: string;
  invoice_date: string;
  invoice_type: 'tax_invoice' | 'bill_of_supply' | 'cash_memo';
  place_of_supply: string | null;
  place_of_delivery: string | null;
  billing_address: any | null;
  shipping_address: any | null;
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

  const titleRight = (() => {
    switch (inv.invoice_type) {
      case 'bill_of_supply': return 'Bill of Supply';
      case 'cash_memo': return 'Cash Memo';
      default: return 'Tax Invoice';
    }
  })() + ' (Original for Recipient)';

  // QR block (optional)
  const qrBlock = (() => {
    const mode = inv.qr_override_mode || 'inherit';
    if (mode === 'image' && inv.qr_override_image_url) {
      return (
        <div className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={inv.qr_override_image_url} alt="QR" className="h-32 w-32 object-contain mx-auto" />
          {inv.qr_note && <div className="text-xs mt-1">{inv.qr_note}</div>}
        </div>
      );
    }
    if (mode === 'upi' && inv.qr_override_upi_vpa) {
      const amount = inv.qr_amount_lock ? `&am=${inv.qr_amount_lock}` : '';
      const url = `upi://pay?pa=${encodeURIComponent(inv.qr_override_upi_vpa)}${amount}`;
      return (
        <div className="text-xs">
          <div className="font-medium">UPI: {inv.qr_override_upi_vpa}</div>
          <div><a className="underline" href={url}>Open UPI App</a></div>
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
    <div className="p-6 print:p-0">
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          .no-print { display: none !important; }
          body { background: #fff !important; }
        }
      `}</style>

      <div className="no-print mb-4 flex justify-end">
        <button onClick={() => window.print()} className="h-10 px-4 rounded-md bg-black text-white hover:opacity-90">
          Print
        </button>
      </div>

      <div className="mx-auto max-w-4xl bg-white text-black p-6 border rounded-md">
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            {/* Replace src with your logo path if you have one */}
            {/* <Image src="/logo.png" width={48} height={48} alt="Logo" /> */}
            <div className="text-lg font-semibold">Mugaworld Private Limited</div>
          </div>
          <div className="text-right text-sm">
            <div className="font-bold">{titleRight}</div>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="border rounded p-3">
            <div className="font-semibold mb-1">Sold By</div>
            {/* Replace with your fixed seller address or pull from settings table */}
            <div>Mugaworld Private Limited</div>
            <div>ABC Road, Guwahati, Assam</div>
            {/* PAN/GST/CIN (seller) — remove lines you don’t use */}
            <div className="mt-2 space-y-0.5 text-sm">
              <div>PAN: <span>XXXXXXXXXX</span></div>
              <div>GSTIN: <span>XXABCDE1234F1Z5</span></div>
              <div>CIN: <span>U12345AS2024PTC000000</span></div>
            </div>
          </div>

          <div className="border rounded p-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="font-semibold mb-1">Billing Address</div>
                {inv.billing_address?.line1 && <div>{inv.billing_address.line1}</div>}
                {inv.billing_address?.city && <div>{inv.billing_address.city}</div>}
                {inv.billing_address?.state && <div>{inv.billing_address.state}</div>}
                {inv.billing_address?.pincode && <div>{inv.billing_address.pincode}</div>}
                {/* Optional customer PAN/GST/CIN if provided */}
                {inv.billing_address?.pan && <div className="text-sm mt-1">PAN: {inv.billing_address.pan}</div>}
                {inv.billing_address?.gstin && <div className="text-sm">GSTIN: {inv.billing_address.gstin}</div>}
                {inv.billing_address?.cin && <div className="text-sm">CIN: {inv.billing_address.cin}</div>}
              </div>
              <div>
                <div className="font-semibold mb-1">Shipping Address</div>
                {inv.shipping_address?.line1 && <div>{inv.shipping_address.line1}</div>}
                {inv.shipping_address?.city && <div>{inv.shipping_address.city}</div>}
                {inv.shipping_address?.state && <div>{inv.shipping_address.state}</div>}
                {inv.shipping_address?.pincode && <div>{inv.shipping_address.pincode}</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Numbers & Dates */}
        <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
          <div className="border rounded p-3 space-y-1">
            <div>Place of Supply: <span className="font-medium">{inv.place_of_supply ?? '-'}</span></div>
            {inv.place_of_delivery && <div>Place of Delivery: <span className="font-medium">{inv.place_of_delivery}</span></div>}
          </div>
          <div className="border rounded p-3 space-y-1">
            <div>Order No: <span className="font-medium">{inv.order_no ?? '-'}</span></div>
            <div>Order Date: <span className="font-medium">{inv.order_date ?? '-'}</span></div>
          </div>
          <div className="border rounded p-3 space-y-1">
            <div>Invoice No: <span className="font-medium">{inv.invoice_no}</span></div>
            <div>Invoice Date: <span className="font-medium">{inv.invoice_date}</span></div>
          </div>
          {qrBlock && (
            <div className="border rounded p-3">{qrBlock}</div>
          )}
        </div>

        {/* Table */}
        <div className="mt-4">
          <table className="w-full text-xs border">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 border">S/N</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border text-right">Unit Price</th>
                <th className="p-2 border text-right">Qty</th>
                <th className="p-2 border text-right">Net</th>
                <th className="p-2 border text-right">Tax %</th>
                <th className="p-2 border">Tax Type</th>
                <th className="p-2 border text-right">Tax Amt</th>
                <th className="p-2 border text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {inv.invoice_items.map((it, idx) => (
                <tr key={idx}>
                  <td className="p-2 border">{idx + 1}</td>
                  <td className="p-2 border">
                    <div>{it.description}</div>
                    {it.hsn_sac && <div className="text-[10px] text-gray-600">HSN/SAC: {it.hsn_sac}</div>}
                  </td>
                  <td className="p-2 border text-right">₹ {it.unit_price.toFixed(2)}</td>
                  <td className="p-2 border text-right">{it.quantity}</td>
                  <td className="p-2 border text-right">₹ {it.net_amount.toFixed(2)}</td>
                  <td className="p-2 border text-right">{it.tax_rate}%</td>
                  <td className="p-2 border">{it.tax_type.toUpperCase()}</td>
                  <td className="p-2 border text-right">₹ {it.tax_amount.toFixed(2)}</td>
                  <td className="p-2 border text-right">₹ {it.line_total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div />
          <div className="border rounded p-3 space-y-1">
            <div className="flex justify-between"><span>Subtotal</span><span>₹ {inv.subtotal.toFixed(2)}</span></div>
            {inv.discount_amount ? <div className="flex justify-between"><span>Discount</span><span>- ₹ {inv.discount_amount.toFixed(2)}</span></div> : null}
            {inv.shipping_amount ? <div className="flex justify-between"><span>Shipping</span><span>₹ {inv.shipping_amount.toFixed(2)}</span></div> : null}
            {inv.tax_cgst ? <div className="flex justify-between"><span>CGST</span><span>₹ {inv.tax_cgst.toFixed(2)}</span></div> : null}
            {inv.tax_sgst ? <div className="flex justify-between"><span>SGST</span><span>₹ {inv.tax_sgst.toFixed(2)}</span></div> : null}
            {inv.tax_igst ? <div className="flex justify-between"><span>IGST</span><span>₹ {inv.tax_igst.toFixed(2)}</span></div> : null}
            <div className="border-t pt-2 flex justify-between font-semibold text-base">
              <span>Total Value (in numbers)</span>
              <span>₹ {inv.grand_total.toFixed(2)}</span>
            </div>
            <div className="text-xs mt-1">In words: <span className="italic">{amountWords}</span></div>
          </div>
        </div>

        {/* Signature block */}
        <div className="mt-8">
          <div className="font-semibold">For Mugaworld Private Limited</div>
          <div className="h-16" />
          <div className="text-sm">Authorized Signatory</div>
        </div>
      </div>
    </div>
  );
}
