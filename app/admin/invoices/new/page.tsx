'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from '@/lib/supabase/client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/* ----------------------- Schemas ----------------------- */
const LineSchema = z.object({
  description: z.string().min(1, 'Required'),
  hsn_sac: z.string().optional().nullable(),
  unit_price: z.coerce.number().min(0, '>= 0'),
  quantity: z.coerce.number().min(1, '>= 1'),
  line_discount: z.coerce.number().min(0).default(0).optional(),
  tax_rate: z.coerce.number().min(0).max(99.99),
  tax_type: z.enum(['cgst_sgst', 'igst']),
});

const FormSchema = z.object({
  invoice_type: z.enum(['tax_invoice', 'bill_of_supply', 'cash_memo']).default('tax_invoice'),
  invoice_date: z.string().min(1, 'Required'),
  order_no: z.string().optional().nullable(),
  order_date: z.string().optional().nullable(),
  place_of_supply: z.string().min(1, 'Required'),
  place_of_delivery: z.string().optional().nullable(),
  billing: z.object({
    line1: z.string().min(1, 'Required'),
    city: z.string().min(1, 'Required'),
    state: z.string().min(1, 'Required'),
    pincode: z.string().min(1, 'Required'),
    pan: z.string().optional().nullable(),
    gstin: z.string().optional().nullable(),
    cin: z.string().optional().nullable(),
  }),
  shipping: z.object({
    line1: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
    pincode: z.string().optional().nullable(),
  }),
  items: z.array(LineSchema).min(1, 'Add at least one line item'),
  discount_amount: z.coerce.number().min(0).default(0).optional(),
  shipping_amount: z.coerce.number().min(0).default(0).optional(),
  reverse_charge: z.coerce.boolean().default(false),
  qr_override_mode: z.enum(['inherit', 'image', 'upi', 'url']).default('inherit'),
  qr_override_image_url: z.string().url().optional().nullable(),
  qr_override_upi_vpa: z.string().optional().nullable(),
  qr_override_url: z.string().url().optional().nullable(),
  qr_amount_lock: z.coerce.number().min(0).optional().nullable(),
  qr_note: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof FormSchema>;

/* ----------------------- Page ----------------------- */
export default function NewInvoicePage() {
  const router = useRouter();
  const supabase = createClient();

  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      invoice_type: 'tax_invoice',
      invoice_date: today,
      place_of_supply: 'Assam',
      billing: { line1: '', city: '', state: '', pincode: '' },
      shipping: { line1: '', city: '', state: '', pincode: '' },
      items: [
        {
          description: '',
          hsn_sac: '',
          unit_price: 0,
          quantity: 1,
          line_discount: 0,
          tax_rate: 18,
          tax_type: 'cgst_sgst',
        },
      ],
      discount_amount: 0,
      shipping_amount: 0,
      reverse_charge: false,
      qr_override_mode: 'inherit',
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  // Live totals
  const totals = useMemo(() => {
    const v = watch();
    let subtotal = 0,
      cgst = 0,
      sgst = 0,
      igst = 0;
    for (const l of v.items || []) {
      const net = Number(l.unit_price) * Number(l.quantity) - Number(l.line_discount || 0);
      const taxAmt = (Number(l.tax_rate) / 100) * net;
      subtotal += net;
      if (l.tax_type === 'cgst_sgst') {
        cgst += taxAmt / 2;
        sgst += taxAmt / 2;
      } else {
        igst += taxAmt;
      }
    }
    const discount = Number(v.discount_amount || 0);
    const shipping = Number(v.shipping_amount || 0);
    const grand = subtotal - discount + shipping + cgst + sgst + igst;
    return {
      subtotal: +subtotal.toFixed(2),
      cgst: +cgst.toFixed(2),
      sgst: +sgst.toFixed(2),
      igst: +igst.toFixed(2),
      grand: +grand.toFixed(2),
    };
  }, [watch]);

  async function onSubmit(values: FormValues) {
    setErr(null);
    setBusy(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in');

      const payload = {
        invoice_type: values.invoice_type,
        invoice_date: values.invoice_date,
        order_no: values.order_no || null,
        order_date: values.order_date || null,
        place_of_supply: values.place_of_supply,
        place_of_delivery: values.place_of_delivery || null,
        reverse_charge: !!values.reverse_charge,
        billing_address: {
          line1: values.billing.line1,
          city: values.billing.city,
          state: values.billing.state,
          pincode: values.billing.pincode,
          pan: values.billing.pan || null,
          gstin: values.billing.gstin || null,
          cin: values.billing.cin || null,
        },
        shipping_address: {
          line1: values.shipping.line1 || null,
          city: values.shipping.city || null,
          state: values.shipping.state || null,
          pincode: values.shipping.pincode || null,
        },
        items: values.items.map((l) => ({
          description: l.description,
          hsn_sac: l.hsn_sac || null,
          unit_price: Number(l.unit_price),
          quantity: Number(l.quantity),
          line_discount: Number(l.line_discount || 0),
          tax_rate: Number(l.tax_rate),
          tax_type: l.tax_type,
        })),
        discount_amount: Number(values.discount_amount || 0),
        shipping_amount: Number(values.shipping_amount || 0),
        qr_override_mode: values.qr_override_mode,
        qr_override_image_url: values.qr_override_image_url || null,
        qr_override_upi_vpa: values.qr_override_upi_vpa || null,
        qr_override_url: values.qr_override_url || null,
        qr_amount_lock: values.qr_amount_lock ?? null,
        qr_note: values.qr_note || null,
      };

      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const t = await res.text();
      if (!res.ok) throw new Error(t);
      const { id } = JSON.parse(t);
      router.push(`/admin/invoices/${id}/print`);
    } catch (e: any) {
      setErr(e?.message || 'Failed to create invoice');
    } finally {
      setBusy(false);
    }
  }

  /* ----------------------- Render ----------------------- */
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* ======= BRAND HEADER ======= */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/PNG copy copy.png"
            alt="Muga World"
            className="h-10 w-10 rounded-full ring-2 ring-brand-gold"
          />
          <div>
            <div className="text-lg font-semibold tracking-wide">Create Invoice</div>
            <div className="text-xs text-muted-foreground">
              Mugaworld • Tax Invoice / Bill of Supply / Cash Memo
            </div>
          </div>
        </div>
        <div
          className="hidden md:flex items-center gap-2 text-sm px-3 py-1.5 rounded-full"
          style={{
            background: 'linear-gradient(90deg, #D7A444 0%, #E03631 100%)',
            color: '#0E0E0E',
          }}
          title="Live grand total"
        >
          <span className="opacity-80">Total</span>
          <span className="font-semibold">₹ {totals.grand.toFixed(2)}</span>
        </div>
      </div>
      {/* ======= /BRAND HEADER ======= */}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Invoice Meta */}
        <Card className="brand-card">
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label>Invoice Type</Label>
              <select
                {...register('invoice_type')}
                className="w-full h-10 rounded-md border border-input bg-background px-3"
              >
                <option value="tax_invoice">Tax Invoice</option>
                <option value="bill_of_supply">Bill of Supply</option>
                <option value="cash_memo">Cash Memo</option>
              </select>
            </div>
            <div>
              <Label>Invoice Date</Label>
              <Input type="date" {...register('invoice_date')} />
              {errors.invoice_date && (
                <p className="text-xs text-red-600">{errors.invoice_date.message}</p>
              )}
            </div>
            <div>
              <Label>Reverse Charge</Label>
              <select
                {...register('reverse_charge')}
                className="w-full h-10 rounded-md border border-input bg-background px-3"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>

            <div>
              <Label>Order No</Label>
              <Input placeholder="(optional)" {...register('order_no')} />
            </div>
            <div>
              <Label>Order Date</Label>
              <Input type="date" placeholder="(optional)" {...register('order_date')} />
            </div>
            <div>
              <Label>Place of Supply</Label>
              <Input {...register('place_of_supply')} />
              {errors.place_of_supply && (
                <p className="text-xs text-red-600">{errors.place_of_supply.message}</p>
              )}
            </div>
            <div>
              <Label>Place of Delivery</Label>
              <Input placeholder="(optional)" {...register('place_of_delivery')} />
            </div>
          </CardContent>
        </Card>

        {/* Parties */}
        <Card className="brand-card">
          <CardHeader>
            <CardTitle>Parties</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="text-sm font-medium">Billing Address</div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label>Address Line 1</Label>
                  <Input {...register('billing.line1')} />
                  {errors.billing?.line1 && (
                    <p className="text-xs text-red-600">{errors.billing.line1.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>City</Label>
                    <Input {...register('billing.city')} />
                    {errors.billing?.city && (
                      <p className="text-xs text-red-600">{errors.billing.city.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input {...register('billing.state')} />
                    {errors.billing?.state && (
                      <p className="text-xs text-red-600">{errors.billing.state.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>Pincode</Label>
                    <Input {...register('billing.pincode')} />
                    {errors.billing?.pincode && (
                      <p className="text-xs text-red-600">{errors.billing.pincode.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>PAN</Label>
                    <Input placeholder="(optional)" {...register('billing.pan')} />
                  </div>
                  <div>
                    <Label>GSTIN</Label>
                    <Input placeholder="(optional)" {...register('billing.gstin')} />
                  </div>
                  <div>
                    <Label>CIN</Label>
                    <Input placeholder="(optional)" {...register('billing.cin')} />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Shipping Address</div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label>Address Line 1</Label>
                  <Input placeholder="(optional)" {...register('shipping.line1')} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>City</Label>
                    <Input placeholder="(optional)" {...register('shipping.city')} />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input placeholder="(optional)" {...register('shipping.state')} />
                  </div>
                  <div>
                    <Label>Pincode</Label>
                    <Input placeholder="(optional)" {...register('shipping.pincode')} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Line items */}
        <Card className="brand-card">
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {fields.map((field, idx) => {
              const prefix = `items.${idx}` as const;
              return (
                <div
                  key={field.id}
                  className="grid md:grid-cols-12 gap-3 items-end border rounded-md p-3"
                >
                  <div className="md:col-span-3">
                    <Label>Description</Label>
                    <Input
                      placeholder="e.g., Design Service"
                      {...register(`${prefix}.description`)}
                    />
                    {errors.items?.[idx]?.description && (
                      <p className="text-xs text-red-600">
                        {errors.items?.[idx]?.description?.message}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <Label>HSN/SAC</Label>
                    <Input placeholder="(optional)" {...register(`${prefix}.hsn_sac`)} />
                  </div>
                  <div>
                    <Label>Unit Price</Label>
                    <Input type="number" step="0.01" {...register(`${prefix}.unit_price`)} />
                    {errors.items?.[idx]?.unit_price && (
                      <p className="text-xs text-red-600">
                        {errors.items?.[idx]?.unit_price?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Qty</Label>
                    <Input type="number" step="1" {...register(`${prefix}.quantity`)} />
                    {errors.items?.[idx]?.quantity && (
                      <p className="text-xs text-red-600">
                        {errors.items?.[idx]?.quantity?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Discount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      {...register(`${prefix}.line_discount`)}
                    />
                  </div>
                  <div>
                    <Label>Tax %</Label>
                    <Input type="number" step="0.01" {...register(`${prefix}.tax_rate`)} />
                    {errors.items?.[idx]?.tax_rate && (
                      <p className="text-xs text-red-600">
                        {errors.items?.[idx]?.tax_rate?.message}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <Label>Tax Type</Label>
                    <select
                      {...register(`${prefix}.tax_type`)}
                      className="w-full h-10 rounded-md border border-input bg-background px-3"
                    >
                      <option value="cgst_sgst">CGST+SGST</option>
                      <option value="igst">IGST</option>
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={() => remove(idx)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  description: '',
                  hsn_sac: '',
                  unit_price: 0,
                  quantity: 1,
                  line_discount: 0,
                  tax_rate: 18,
                  tax_type: 'cgst_sgst',
                })
              }
            >
              + Add Item
            </Button>
          </CardContent>
        </Card>

        {/* Totals + Payment/QR */}
        <Card className="brand-card">
          <CardHeader>
            <CardTitle>Totals &amp; Payment</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Discount (₹)</Label>
                  <Input type="number" step="0.01" {...register('discount_amount')} />
                </div>
                <div>
                  <Label>Shipping (₹)</Label>
                  <Input type="number" step="0.01" {...register('shipping_amount')} />
                </div>
              </div>
              <div className="mt-2 border rounded-md p-3 text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹ {totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.cgst ? (
                  <div className="flex justify-between">
                    <span>CGST</span>
                    <span>₹ {totals.cgst.toFixed(2)}</span>
                  </div>
                ) : null}
                {totals.sgst ? (
                  <div className="flex justify-between">
                    <span>SGST</span>
                    <span>₹ {totals.sgst.toFixed(2)}</span>
                  </div>
                ) : null}
                {totals.igst ? (
                  <div className="flex justify-between">
                    <span>IGST</span>
                    <span>₹ {totals.igst.toFixed(2)}</span>
                  </div>
                ) : null}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Grand Total</span>
                  <span>₹ {totals.grand.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label>QR / Payment Mode</Label>
                <select
                  {...register('qr_override_mode')}
                  className="w-full h-10 rounded-md border border-input bg-background px-3"
                >
                  <option value="inherit">None (hide)</option>
                  <option value="image">Image URL</option>
                  <option value="upi">UPI VPA</option>
                  <option value="url">Payment URL</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>QR Image URL</Label>
                  <Input placeholder="https://..." {...register('qr_override_image_url')} />
                </div>
                <div>
                  <Label>UPI VPA</Label>
                  <Input placeholder="name@bank" {...register('qr_override_upi_vpa')} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Payment URL</Label>
                  <Input placeholder="https://..." {...register('qr_override_url')} />
                </div>
                <div>
                  <Label>Lock Amount (₹)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="(optional)"
                    {...register('qr_amount_lock')}
                  />
                </div>
              </div>

              <div>
                <Label>Note (shown under QR)</Label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="(optional)"
                  {...register('qr_note')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Errors & Submit */}
        {err && <div className="text-sm text-red-600">{err}</div>}
        <div className="flex gap-3">
          <Button
            className="bg-brand-ink text-white hover:opacity-90 border border-brand-gold shadow-brand"
            type="submit"
            disabled={busy}
          >
            {busy ? 'Creating…' : 'Create Invoice'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border border-brand-gold text-brand-ink hover:bg-brand-sand/40"
            onClick={() => router.push('/admin/invoices')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
