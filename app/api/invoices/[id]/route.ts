// app/api/invoices/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getIssuerApp } from '@/lib/invoicing/roles-app';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { supabase, issuer } = await getIssuerApp();
  if (!issuer) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { data, error } = await (supabase as any)
    .from('invoices')
    .select('*, invoice_items(*)')
    .eq('id', params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data, { status: 200 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { supabase, issuer } = await getIssuerApp();
  if (!issuer) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json().catch(() => ({} as any));
  delete (body as any).invoice_no;

  const { data, error } = await (supabase as any)
    .from('invoices')
    .update(body)
    .eq('id', params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 200 });
}
