'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

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

type Addr = {
  name?: string | null;
  line1?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  pan?: string | null;
  gstin?: string | null;
  cin?: string | null;
} | null;

type Invoice = {
  id: string;
  invoice_no: string;
  invoice_date: string;
  invoice_type: 'tax_invoice' | 'bill_of_supply' | 'cash_memo';
  place_of_supply: string | null;
  place_of_delivery: string | null;
  order_no?: string | null;
  order_date?: string | null;
  billing_address: Addr;
  shipping_address: Addr;
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
  const [scale, setScale] = useState(1);
  const [previewing, setPreviewing] = useState(false); // 👈 two-step logic
  const sheetRef = useRef<HTMLDivElement | null>(null);

  // Load invoice
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

  // Auto-fit to a single A4 page.
  useEffect(() => {
    function fit() {
      const node = sheetRef.current;
      if (!node) return;

      node.style.setProperty('--fit-scale', '1');

      const pxPerMm = 3.7795275591;
      const targetW = 190 * pxPerMm;  // content width
      const targetH = 277 * pxPerMm;  // content height inside margins

      node.style.width = `${targetW}px`;

      const naturalW = node.scrollWidth;
      const naturalH = node.scrollHeight;

      const sW = targetW / naturalW;
      const sH = targetH / naturalH;
      const s = Math.min(1, sW, sH);

      node.style.setProperty('--fit-scale', String(s));
      node.style.height = `${targetH}px`;
      node.style.overflow = 'hidden';
      setScale(s);
    }

    const id = setTimeout(fit, 50);
    window.addEventListener('resize', fit);
    return () => { clearTimeout(id); window.removeEventListener('resize', fit); };
  }, [inv]);

  // After printing, exit preview automatically
  useEffect(() => {
    const after = () => setPreviewing(false);
    window.addEventListener('afterprint', after);
    return () => window.removeEventListener('afterprint', after);
  }, []);

  // Keyboard: Ctrl/Cmd+P triggers real print if preview is on
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!previewing) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        window.print();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [previewing]);

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
          <img src={inv.qr_override_image_url} alt="QR" className="h-24 w-24 object-contain mx-auto" />
          {inv.qr_note && <div className="text-[9px] mt-0.5">{inv.qr_note}</div>}
        </div>
      );
    }
    if (mode === 'upi' && inv.qr_override_upi_vpa) {
      const amount = inv.qr_amount_lock ? `&am=${inv.qr_amount_lock}` : '';
      const url = `upi://pay?pa=${encodeURIComponent(inv.qr_override_upi_vpa)}${amount}`;
      return (
        <div className="text-[10px]">
          <div className="font-medium">UPI: {inv.qr_override_upi_vpa}</div>
          <div><a className="underline" href={url}>Open in UPI app</a></div>
          {inv.qr_note && <div className="mt-0.5">{inv.qr_note}</div>}
        </div>
      );
    }
    if (mode === 'url' && inv.qr_override_url) {
      return (
        <div className="text-[10px]">
          <a className="underline" href={inv.qr_override_url} target="_blank" rel="noreferrer">
            Payment Link
          </a>
          {inv.qr_note && <div className="mt-0.5">{inv.qr_note}</div>}
        </div>
      );
    }
    return null;
  })();

  return (
    <div className={`print-root min-h-screen ${previewing ? 'preview-on' : ''} bg-neutral-50 print:bg-white`}>
      {/* Page + print rules */}
      <style>{`
        /* Same visuals in preview and in print */
        .sheet {
          width: 190mm;
          transform-origin: top left;
          transform: scale(var(--fit-scale, 1));
          background: #ffffff !important;
          color: #0a0a0a !important;
        }
        .sheet * {
          background: inherit !important;
          color: inherit !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        /* Remove outer frame ONLY in preview/print to avoid "black border" */
        .preview-on .sheet,
        @media print { .sheet { box-shadow: none !important; border: 0 !important; outline: 0 !important; } }

        /* Page setup */
        @media print {
          @page { size: A4; margin: 10mm; }
          .no-print { display: none !important; }
          html, body { background: #ffffff !important; }
        }

        /* Preview mimics print: hide UI, white background */
        .preview-on .no-print { display: none !important; }
        .preview-on { background: #ffffff !important; }
      `}</style>

      {/* Top controls (one button, two-step behaviour) */}
      <div className="no-print max-w-4xl mx-auto mb-3 flex items-center justify-between">
        <div className="text-sm text-neutral-600">
          {previewing
            ? 'Preview: this is exactly how it will print (A4, 10mm margins).'
            : (scale < 1
                ? `Fitted to ${Math.round(scale * 100)}% — will print as a single A4 page`
                : 'Fits on one A4 page at 100%')}
        </div>
        <button
          onClick={() => {
            if (!previewing) setPreviewing(true);
            else window.print();
          }}
          className="h-9 px-3 rounded-md bg-black text-white hover:opacity-90"
        >
          {previewing ? 'Print / Save as PDF' : 'Preview'}
        </button>
      </div>

      {/* A4 sheet */}
      <div className="max-w-4xl mx-auto">
        <div ref={sheetRef} className="sheet mx-auto rounded-xl border border-neutral-200 shadow-xl overflow-hidden">
          {/* ======= Your invoice content (unchanged visuals) ======= */}

          {/* Header */}
          <div className="p-4 pb-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/PNG copy copy.png"
                  alt="Muga World"
                  className="h-10 w-10 rounded-full ring-2 ring-[#D7A444]"
                />
                <div>
                  <div className="text-[16px] font-semibold tracking-wide">Mugaworld Private Limited</div>
                  <div className="text-[10px]">
                    ABC Road, Guwahati, Assam • GSTIN: XXABCDE1234F1Z5 • CIN: U12345AS2024PTC000000
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #D7A444 0%, #E03631 100%)', color: '#0E0E0E' }}
                >
                  {(inv.invoice_type === 'bill_of_supply' ? 'Bill of Supply'
                    : inv.invoice_type === 'cash_memo' ? 'Cash Memo' : 'Tax Invoice')}
                  {' '} (Original for Recipient)
                </div>
                <div className="text-[10px] mt-1">
                  Invoice No: <span className="font-medium">{inv.invoice_no}</span>
                </div>
                <div className="text-[10px]">
                  Invoice Date: <span className="font-medium">{inv.invoice_date}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Meta blocks */}
          <div className="px-4 pt-2">
            <div className="grid grid-cols-12 gap-3">
              {/* Sold By */}
              <div className="col-span-6 border rounded-lg p-2.5">
                <div className="text-[11px] font-semibold mb-1">Sold By</div>
                <div className="text-[11px] leading-tight">
                  Mugaworld Private Limited<br />ABC Road, Guwahati, Assam
                </div>
                <div className="mt-1 grid grid-cols-3 gap-1 text-[10px]">
                  <div>PAN: <span className="font-medium">XXXXXXXXXX</span></div>
                  <div>GSTIN: <span className="font-medium">XXABCDE1234F1Z5</span></div>
                  <div>CIN: <span className="font-medium">U12345AS2024PTC000000</span></div>
                </div>
              </div>

              {/* Buyer Addresses */}
              <div className="col-span-6 border rounded-lg p-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[11px] font-semibold mb-1">Billing Address</div>
                    <div className="text-[11px] leading-tight">
                      {inv.billing_address?.name && <div className="font-medium">{inv.billing_address.name}</div>}
                      {inv.billing_address?.line1 && <div className="truncate">{inv.billing_address.line1}</div>}
                      {(inv.billing_address?.city || inv.billing_address?.state || inv.billing_address?.pincode) && (
                        <div className="truncate">
                          {inv.billing_address?.city}{inv.billing_address?.city && inv.billing_address?.state ? ', ' : ''}{inv.billing_address?.state} {inv.billing_address?.pincode}
                        </div>
                      )}
                    </div>
                    {(inv.billing_address?.pan || inv.billing_address?.gstin || inv.billing_address?.cin) && (
                      <div className="text-[10px] mt-0.5 space-y-0.5">
                        {inv.billing_address?.pan && <div>PAN: {inv.billing_address.pan}</div>}
                        {inv.billing_address?.gstin && <div>GSTIN: {inv.billing_address.gstin}</div>}
                        {inv.billing_address?.cin && <div>CIN: {inv.billing_address.cin}</div>}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold mb-1">Shipping Address</div>
                    <div className="text-[11px] leading-tight">
                      {inv.shipping_address?.name && <div className="font-medium">{inv.shipping_address.name}</div>}
                      {inv.shipping_address?.line1 && <div className="truncate">{inv.shipping_address.line1}</div>}
                      {(inv.shipping_address?.city || inv.shipping_address?.state || inv.shipping_address?.pincode) && (
                        <div className="truncate">
                          {inv.shipping_address?.city}{inv.shipping_address?.city && inv.shipping_address?.state ? ', ' : ''}{inv.shipping_address?.state} {inv.shipping_address?.pincode}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order / Places */}
              <div className="col-span-6 border rounded-lg p-2.5 text-[11px]">
                <div className="grid grid-cols-2 gap-1.5">
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
                <div className="col-span-6 border rounded-lg p-2.5">
                  <div className="text-[11px] font-semibold mb-1">Payment</div>
                  {qrBlock}
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="px-4 mt-3">
            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-[10.5px]">
                <thead>
                  <tr className="text-left">
                    <th className="p-2 border-b">S/N</th>
                    <th className="p-2 border-b">Description</th>
                    <th className="p-2 border-b text-right">Unit</th>
                    <th className="p-2 border-b text-right">Qty</th>
                    <th className="p-2 border-b text-right">Net</th>
                    <th className="p-2 border-b text-right">Tax %</th>
                    <th className="p-2 border-b">Type</th>
                    <th className="p-2 border-b text-right">Tax</th>
                    <th className="p-2 border-b text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {inv.invoice_items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-2 border-t align-top">{idx + 1}</td>
                      <td className="p-2 border-t align-top">
                        <div className="font-medium truncate">{it.description}</div>
                        {it.hsn_sac && <div className="text-[9px] mt-0.5">HSN/SAC: {it.hsn_sac}</div>}
                      </td>
                      <td className="p-2 border-t text-right align-top">₹ {it.unit_price.toFixed(2)}</td>
                      <td className="p-2 border-t text-right align-top">{it.quantity}</td>
                      <td className="p-2 border-t text-right align-top">₹ {it.net_amount.toFixed(2)}</td>
                      <td className="p-2 border-t text-right align-top">{it.tax_rate}%</td>
                      <td className="p-2 border-t align-top uppercase">{it.tax_type.replace('_',' + ').toUpperCase()}</td>
                      <td className="p-2 border-t text-right align-top">₹ {it.tax_amount.toFixed(2)}</td>
                      <td className="p-2 border-t text-right align-top">₹ {it.line_total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals + Words + Signature */}
          <div className="px-4 mt-3 mb-4">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-7 text-[10.5px]">
                <div className="border rounded-lg p-2.5">
                  <div className="text-[11px] font-semibold mb-1">Amount in Words</div>
                  <div className="italic leading-tight">{amountWords}</div>
                </div>

                <div className="border rounded-lg p-2 mt-2 text-[9.5px]">
                  <div className="font-semibold mb-0.5">Terms &amp; Notes</div>
                  <ul className="list-disc ml-4 leading-tight">
                    <li>Goods once sold will not be taken back.</li>
                    <li>Subject to Guwahati jurisdiction.</li>
                    <li>Computer generated invoice; no physical signature required.</li>
                  </ul>
                </div>
              </div>

              <div className="col-span-5">
                <div className="border rounded-lg p-2.5 text-[11px] space-y-1">
                  <div className="flex justify-between"><span>Subtotal</span><span>₹ {inv.subtotal.toFixed(2)}</span></div>
                  {inv.discount_amount ? <div className="flex justify-between"><span>Discount</span><span>- ₹ {inv.discount_amount.toFixed(2)}</span></div> : null}
                  {inv.shipping_amount ? <div className="flex justify-between"><span>Shipping</span><span>₹ {inv.shipping_amount.toFixed(2)}</span></div> : null}
                  {inv.tax_cgst ? <div className="flex justify-between"><span>CGST</span><span>₹ {inv.tax_cgst.toFixed(2)}</span></div> : null}
                  {inv.tax_sgst ? <div className="flex justify-between"><span>SGST</span><span>₹ {inv.tax_sgst.toFixed(2)}</span></div> : null}
                  {inv.tax_igst ? <div className="flex justify-between"><span>IGST</span><span>₹ {inv.tax_igst.toFixed(2)}</span></div> : null}
                  <div className="border-t pt-2 mt-1 flex justify-between text-[12px] font-semibold">
                    <span>Total Value (in numbers)</span>
                    <span>₹ {inv.grand_total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border rounded-lg p-2 mt-2 text-[11px]">
                  <div className="font-semibold">For Mugaworld Private Limited</div>
                  <div className="h-12" />
                  <div className="text-right">Authorised Signatory</div>
                </div>
              </div>
            </div>
          </div>

          {/* Screen-only footer (hidden in preview & print) */}
          <div className="no-print px-4 pb-3 text-[9.5px] text-neutral-600">
            <div className="flex justify-between">
              <div>Preview scale: {Math.round(scale * 100)}%</div>
              <div>Page 1 of 1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
