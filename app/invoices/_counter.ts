// app/api/invoices/_counter.ts
import { createClient } from '@/lib/supabase/server';

const b36 = (n: number) => n.toString(36).toUpperCase();
const pad = (s: string, len: number) => s.padStart(len, '0');

/** Build 10-char code: [I/O][F][Y][M][D][SSSS], FY resets on Apr 1 */
export async function next10(scopePrefix: 'invoice'|'order', when: Date) {
  const supabase = await createClient();

  const m = when.getMonth();  // 0..11
  const y = when.getFullYear();
  const fyStartYear = m >= 3 ? y : y - 1;  // Apr (3) .. Mar (2)
  const fyEndYear   = fyStartYear + 1;

  const scope = `${scopePrefix}_FY${fyStartYear}_${String(fyEndYear).slice(-2)}`;

  // ensure counter row
  await supabase.from('counters').upsert(
    { scope, prefix: scopePrefix === 'invoice' ? 'INV' : 'ORD' },
    { onConflict: 'scope' }
  );

  // atomic increment (function added in Step 2)
  const { data, error } = await supabase
    .rpc('increment_counter', { p_scope: scope })
    .single<{ next: number }>();
  if (error) throw error;

  const IorO = scopePrefix === 'invoice' ? 'I' : 'O';
  const F = String(fyEndYear).slice(-1);
  const Y = String(fyStartYear).slice(-1);
  const M = b36(m + 1);               // 1..C
  const D = b36(when.getDate());      // 1..Z
  const S = pad(b36(data.next), 4);   // base36 seq
  return `${IorO}${F}${Y}${M}${D}${S}`; // 10 chars
}
