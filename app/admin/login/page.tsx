'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams(); // may be undefined at build type-check, so guard below
  const supabase = createClient();

  // Pre-check: if already signed in AND is active admin -> go to dashboard
  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data: admin, error } = await supabase
            .from('admins')
            .select('id,is_active')
            .eq('id', user.id)
            .maybeSingle();

          if (!error && admin?.is_active) {
            router.replace('/admin/dashboard');
            return;
          }
        }
      } catch {
        // ignore precheck errors; fall through to login form
      }

      // Read error from query string **safely** in CSR/SSR
      let qpErr: string | null = null;
      if (typeof window !== 'undefined') {
        qpErr = new URLSearchParams(window.location.search).get('err');
      } else if (searchParams && typeof (searchParams as any).get === 'function') {
        // type guard to satisfy TS when building
        qpErr = (searchParams as any).get('err') ?? null;
      }

      if (qpErr === 'no_admin_access') {
        setErrMsg('You do not have admin access');
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrMsg(null);
    setSubmitting(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error('Authentication failed');

      const { data: admin, error: adminError } = await supabase
        .from('admins')
        .select('id,is_active')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (adminError || !admin?.is_active) {
        // not an admin -> sign out and show message
        await supabase.auth.signOut();
        throw new Error('You do not have admin access');
      }

      router.replace('/admin/dashboard'); // success
    } catch (err: any) {
      setErrMsg(err?.message || 'Failed to sign in');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="h-10 w-40 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
              <Shield className="h-8 w-8 text-amber-600 dark:text-amber-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
          <CardDescription>Sign in to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {errMsg && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
                <AlertCircle className="h-4 w-4" />
                {errMsg}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>
        </CardContent>


