import { createClient } from '@/lib/supabase/server';
import type { AdminProfile, PermissionName } from './types';

export async function getAdminProfile(): Promise<AdminProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_admin_profile').single();

  if (error || !data) {
    return null;
  }

  return data as AdminProfile;
}

export async function checkPermission(permission: PermissionName): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('check_admin_permission', {
    permission_name: permission,
  });

  if (error) {
    return false;
  }

  return data === true;
}

export async function requirePermission(permission: PermissionName): Promise<void> {
  const hasPermission = await checkPermission(permission);

  if (!hasPermission) {
    throw new Error(`Permission denied: ${permission}`);
  }
}

export async function isAdmin(): Promise<boolean> {
  const profile = await getAdminProfile();
  return profile !== null && profile.is_active;
}

export async function isSuperAdmin(): Promise<boolean> {
  const profile = await getAdminProfile();
  return profile !== null && profile.is_active && profile.role_name === 'super_admin';
}
