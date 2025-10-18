import { notFound } from 'next/navigation';

async function getInvoice(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/api/invoices/${id}`, {
    cache: 'no-store',
    // When rendering on Netlify, relative fetch may not carry cookies.
    // If this page needs auth session, consider moving to client or use server Supabase directly.
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function InvoiceDetail({ params }: { params: { id: string } }) {
  const data = await getInvoice(params.id);
  if (!data) return notFound();

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Invoice {data.invoice_no}</h1>
        <a
          href={`/admin/invoices/${params.id}/print`}
          className="inline-flex items-center h-10 px-4 rounded-md bg-black text-white hover:opacity-90"
        >
          Print
        </a>
      </div>

      <pre className="bg-muted p-4 rounded overflow-auto text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
