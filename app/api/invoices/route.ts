// app/api/invoices/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { next10 } from '@/lib/invoicing/counter';
import { getIssuerApp } from '@/lib/invoicing/roles-app';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET() {
  return new NextResponse('invoices API alive', { status: 200 });
}

export async function POST(req: NextRequest) {
  const { supabase, issuer } = await getIssuerApp();
  if (!issuer) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json().catch(() => ({} as any));
  const items = Array.isArray(body.items) ? body.items : [];

  const invDate = body.invoice_date ? new Date(body.invoice_date) : new Date();
  const invoice_no = await next10(supabase as any, 'invoice', invDate);

  let subtotal = 0, tax_cgst = 0, tax_sgst = 0, tax_igst = 0;

  const computedItems = items.map((l: any) => {
    const discount = Number(l.line_discount || 0);
    const net = Number(l.unit_price) * Number(l.quantity) - discount;
    const taxAmt = (Number(l.tax_rate) / 100) * net;
    if (l.tax_type === 'cgst_sgst') { tax_cgst += taxAmt / 2; tax_sgst += taxAmt / 2; }
    else if (l.tax_type === 'igst') { tax_igst += taxAmt; }
    subtotal += net;
    return {
      description: l.description,
      hsn_sac: l.hsn_sac || null,
      unit_price: Number(l.unit_price),
      quantity: Number(l.quantity),
      line_discount: discount || 0,
      net_amount: Number(net.toFixed(2)),
      tax_rate: Number(l.tax_rate),
      tax_type: l.tax_type,
      tax_amount: Number(taxAmt.toFixed(2)),
      line_total: Number((net + taxAmt).toFixed(2))
    };
  });

  const discount_amount = Number(body.discount_amount || 0);
  const shipping_amount = Number(body.shipping_amount || 0);
  const totalTax = tax_cgst + tax_sgst + tax_igst;
  const grand_total = Number((subtotal - discount_amount + shipping_amount + totalTax).toFixed(2));

  const payload = {
    invoice_type: body.invoice_type || 'tax_invoice',
    order_no: body.order_no || null,
    order_date: body.order_date || null,
    invoice_no,
    invoice_date: invDate.toISOString().slice(0,10),
    place_of_supply: body.place_of_supply,
    place_of_delivery: body.place_of_delivery || null,
    reverse_charge: !!body.reverse_charge,
    billing_address: body.billing_address || null,
    shipping_address: body.shipping_address || null,
    subtotal: Number(subtotal.toFixed(2)),
    discount_amount,
    shipping_amount,
    tax_cgst: Number(tax_cgst.toFixed(2)),
    tax_sgst: Number(tax_sgst.toFixed(2)),
    tax_igst: Number(tax_igst.toFixed(2)),
    grand_total,
    amount_in_words: body.amount_in_words || null,
    qr_override_mode: body.qr_override_mode || 'inherit',
    qr_override_image_url: body.qr_override_image_url || null,
    qr_override_upi_vpa: body.qr_override_upi_vpa || null,
    qr_override_url: body.qr_override_url || null,
    qr_amount_lock: body.qr_amount_lock || null,
    qr_note: body.qr_note || null,
    status: body.status || 'issued',
    created_by_admin_id: issuer.id
  };

  const { data: inv, error: invErr } = await (supabase as any)
    .from('invoices')
    .insert(payload)
    .select('id')
    .single();

  if (invErr) return NextResponse.json({ error: invErr.message }, { status: 400 });

  if (computedItems.length) {
    const rows = computedItems.map((ci: any) => ({ ...ci, invoice_id: inv.id }));
    const { error: itemsErr } = await (supabase as any).from('invoice_items').insert(rows);
    if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 400 });
  }

  return NextResponse.json({ id: inv.id, invoice_no }, { status: 200 });
}
