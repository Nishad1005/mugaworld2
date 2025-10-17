// app/api/invoices/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { assertInvoiceIssuer } from '../../invoices/_auth';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const issuer = await assertInvoiceIssuer();
  if (!issuer) return new NextResponse('Forbidden', { status: 403 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('invoices')
    .select('*, invoice_items(*)')
    .eq('id', params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const issuer = await assertInvoiceIssuer();
  if (!issuer) return new NextResponse('Forbidden', { status: 403 });

  const body = await req.json();
  delete (body as any).invoice_no; // avoid edits after issue

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('invoices')
    .update(body)
    .eq('id', params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
