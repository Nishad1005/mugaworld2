'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LogOut, User, Shield, ChevronDown } from 'lucide-react';

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

export default function UserMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!mounted) return;

      if (!user) {
        setProfile(null);
        setIsSuperAdmin(false);
        setLoading(false);
        return;
      }

      const { data: prof } = await supabase
        .from('profiles')
        .select('id,email,full_name,avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      setProfile(prof ?? { id: user.id, email: user.email ?? null, full_name: null, avatar_url: null });

      // check admin (by id, works with RLS)
      const { data: admin } = await supabase
        .from('admins')
        .select('id,is_active')
        .eq('id', user.id)
        .maybeSingle();

      setIsSuperAdmin(!!admin?.is_active);
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!mounted) return;
      if (!session?.user) {
        setProfile(null);
        setIsSuperAdmin(false);
      }
      router.refresh();
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
    // re-run on route change to close menu
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Close on outside click / Escape
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120); // small delay prevents flicker
  };

  const initials = useMemo(() => {
    const display = profile?.full_name || profile?.email || '';
    return display.slice(0, 2).toUpperCase() || '?';
  }, [profile]);

  const onLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    router.push('/');
    router.refresh();
  };

  // Skeleton
  if (loading) {
    return <div className="h-9 w-28 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />;
  }

  // Logged out
  if (!profile) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold text-sm"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  // Logged in
  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
    >
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt="Avatar"
            className="h-7 w-7 rounded-full object-cover"
          />
        ) : (
          <div className="h-7 w-7 rounded-full bg-amber-500 text-gray-900 grid place-items-center text-xs font-extrabold">
            {initials}
          </div>
        )}
        <div className="hidden sm:flex flex-col items-start leading-tight">
          <span className="text-xs text-gray-700 dark:text-gray-300">
            {profile.full_name || profile.email}
          </span>
          {isSuperAdmin && (
            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Shield className="h-3 w-3" /> Super Admin
            </span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      <div
        role="menu"
        className={`absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-md transition
        ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
        onMouseEnter={openNow}
        onMouseLeave={closeSoon}
      >
        {isSuperAdmin && (
          <>
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <Shield className="h-4 w-4" /> Admin Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              Manage Products
            </Link>
          </>
        )}
        <Link
          href="/account"
          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
          role="menuitem"
          onClick={() => setOpen(false)}
        >
          <User className="h-4 w-4" /> My Account
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
          role="menuitem"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </div>
  );
}

