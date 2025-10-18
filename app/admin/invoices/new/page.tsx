'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function NewInvoicePage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    place_of_supply: 'Assam',
    billing_line1: '',
    billing_city: '',
    billing_state: '',
    billing_pincode: '',
    item_desc: '',
    item_price: 0,
    item_qty: 1,
    item_tax_rate: 18,
    item_tax_type: 'cgst_sgst' as 'cgst_sgst' | 'igst'
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true); setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in');

      const payload = {
        invoice_type: 'tax_invoice',
        invoice_date: new Date().toISOString().slice(0,10),
        place_of_supply: form.place_of_supply,
        billing_address: {
          line1: form.billing_line1,
          city: form.billing_city,
          state: form.billing_state,
          pincode: form.billing_pincode
        },
        items: [{
          description: form.item_desc,
          unit_price: Number(form.item_price),
          quantity: Number(form.item_qty),
          tax_rate: Number(form.item_tax_rate),
          tax_type: form.item_tax_type,
          hsn_sac: '9983'
        }]
      };

      const res = await fetch('/api/invoices', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text);
      const { id } = JSON.parse(text);
      router.push(`/admin/invoices/${id}`);
    } catch (e:any) {
      setError(e?.message || 'Failed to create invoice');
    } finally { setBusy(false); }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card>
        <CardHeader><CardTitle>Create Invoice</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Place of Supply</Label>
              <Input value={form.place_of_supply} onChange={e=>setForm(f=>({...f, place_of_supply:e.target.value}))} />
            </div>
            <div><Label>Billing Line 1</Label>
              <Input value={form.billing_line1} onChange={e=>setForm(f=>({...f, billing_line1:e.target.value}))} />
            </div>
            <div><Label>Billing City</Label>
              <Input value={form.billing_city} onChange={e=>setForm(f=>({...f, billing_city:e.target.value}))} />
            </div>
            <div><Label>Billing State</Label>
              <Input value={form.billing_state} onChange={e=>setForm(f=>({...f, billing_state:e.target.value}))} />
            </div>
            <div><Label>Billing Pincode</Label>
              <Input value={form.billing_pincode} onChange={e=>setForm(f=>({...f, billing_pincode:e.target.value}))} />
            </div>
          </div>

          <div className="border-t pt-4 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Label>Item Description</Label>
                <Input value={form.item_desc} onChange={e=>setForm(f=>({...f, item_desc:e.target.value}))} />
              </div>
              <div><Label>Unit Price</Label>
                <Input type="number" value={form.item_price} onChange={e=>setForm(f=>({...f, item_price:Number(e.target.value)}))} />
              </div>
              <div><Label>Qty</Label>
                <Input type="number" value={form.item_qty} onChange={e=>setForm(f=>({...f, item_qty:Number(e.target.value)}))} />
              </div>
              <div><Label>Tax %</Label>
                <Input type="number" value={form.item_tax_rate} onChange={e=>setForm(f=>({...f, item_tax_rate:Number(e.target.value)}))} />
              </div>
              <div><Label>Tax Type</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3"
                  value={form.item_tax_type}
                  onChange={e=>setForm(f=>({...f, item_tax_type:e.target.value as any}))}
                >
                  <option value="cgst_sgst">CGST+SGST</option>
                  <option value="igst">IGST</option>
                </select>
              </div>
            </div>
          </div>

          {/* Header */}
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
    style={{ background: 'linear-gradient(90deg, #D7A444 0%, #E03631 100%)', color: '#0E0E0E' }}
    title="Live grand total"
  >
    <span className="opacity-80">Total</span>
    <span className="font-semibold">₹ {totals.grand.toFixed(2)}</span>
  </div>
</div>


          <Button onClick={submit} disabled={busy}>{busy ? 'Creating…' : 'Create Invoice'}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
