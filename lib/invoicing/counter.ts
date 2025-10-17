// lib/invoicing/counter.ts

const b36 = (n: number) => n.toString(36).toUpperCase();
const pad = (s: string, len: number) => s.padStart(len, '0');

/**
 * Build a 10-char code: [I/O][F][Y][M][D][SSSS], resets per FY (Apr 1).
 * Works with any Supabase client that exposes .from() and .rpc().
 */
export async function next10(
  supabase: { from: Function; rpc: Function },
  scopePrefix: 'invoice' | 'order',
  when: Date
) {
  const m = when.getMonth();  // 0..11
  const y = when.getFullYear();
  const fyStartYear = m >= 3 ? y : y - 1;   // FY starts Apr (index 3)
  const fyEndYear = fyStartYear + 1;

  const scope = `${scopePrefix}_FY${fyStartYear}_${String(fyEndYear).slice(-2)}`;

  // Ensure a row exists for this FY scope; ignore unique conflicts.
  const { error: upsertErr } = await (supabase as any)
    .from('counters')
    .upsert(
      { scope, prefix: scopePrefix === 'invoice' ? 'INV' : 'ORD' },
      { onConflict: 'scope' }
    );
  if (upsertErr) throw upsertErr;

  // Increment atomically via RPC. Functions returning TABLE often come back as arrays.
  const { data, error } = await (supabase as any)
    .rpc('increment_counter', { p_scope: scope });

  if (error) throw error;

  // Handle both array and object shapes; bigint may arrive as string.
  const rawNext =
    Array.isArray(data) ? (data[0]?.next ?? null) :
    (data && typeof data === 'object') ? (data as any).next ?? null :
    null;

  if (rawNext == null) throw new Error('Counter increment failed: no next value');

  const nextNum =
    typeof rawNext === 'number' ? rawNext :
    typeof rawNext === 'string' ? parseInt(rawNext, 10) :
    NaN;

  if (!Number.isFinite(nextNum)) {
    throw new Error('Counter increment failed: invalid next value');
  }

  // Compose the 10-char code
  const IorO = scopePrefix === 'invoice' ? 'I' : 'O';
  const F = String(fyEndYear).slice(-1);      // FY end year last digit
  const Y = String(fyStartYear).slice(-1);    // FY start year last digit
  const M = b36(m + 1);                       // 1..C
  const D = b36(when.getDate());              // 1..Z
  const S = pad(b36(nextNum), 4);             // base36 seq (padded)

  return `${IorO}${F}${Y}${M}${D}${S}`;
}

