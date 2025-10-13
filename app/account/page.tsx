'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

export default function AccountPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [profileExists, setProfileExists] = useState<boolean>(true); // NEW: track if row exists

  // Load current user + profile
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/login?next=/account');
        return;
      }

      // Fetch profile (RLS: user can select their own)
      const { data: prof, error } = await supabase
        .from('profiles')
        .select('id,email,full_name,avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        toast({
          title: 'Failed to load profile',
          description: error.message,
          variant: 'destructive',
        });
      }

      // If missing, DO NOT fabricate a row (your table has NOT NULLs)
      if (!prof) {
        setProfileExists(false);
        setProfile({
          id: user.id,
          email: user.email ?? null,
          full_name: null,
          avatar_url: null,
        });
        setFullName('');
        setAvatarUrl(null);
      } else {
        setProfileExists(true);
        setProfile(prof as Profile);
        setFullName(prof.full_name ?? '');
        setAvatarUrl(prof.avatar_url ?? null);
      }

      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSave = async () => {
    if (!profile) return;

    if (!profileExists) {
      // Prevent hidden failures when the row is missing
      toast({
        title: 'Profile not found',
        description:
          'Your profile record does not exist yet. Please ask an admin to create your profile row (including required fields like account_type) before you can save.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    // Ask Supabase to return the updated row; if no row, data will be null
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName || null,
        avatar_url: avatarUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id)
      .select('id')
      .maybeSingle();

    setSaving(false);

    if (error) {
      toast({
        title: 'Could not save profile',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    if (!data) {
      toast({
        title: 'Profile row missing',
        description:
          'No profile row was updated. Ask an admin to create your profile record first.',
        variant: 'destructive',
      });
      return;
    }

    toast({ title: 'Profile updated' });
    // ensure header menu refreshes
    router.refresh();
  };

  const onUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    if (!profileExists) {
      toast({
        title: 'Profile not found',
        description:
          'Please ask an admin to create your profile record before uploading an avatar.',
        variant: 'destructive',
      });
      return;
    }

    const MAX_MB = 5;
    if (file.size > MAX_MB * 1024 * 1024) {
      toast({
        title: 'Image too large',
        description: `Please choose an image under ${MAX_MB}MB.`,
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const ext = (file.name.split('.').pop() || 'png').toLowerCase();
      // IMPORTANT: path must start with <uid>/ to satisfy your storage RLS
      const path = `${profile.id}/avatar.${ext}`;

      // Upload (upsert into avatars bucket)
      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true });

      if (upErr) throw upErr;

      // Get a public URL (bucket is public-read)
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      const bust = `?t=${Date.now()}`; // cache-bust so it refreshes immediately
      setAvatarUrl((data.publicUrl ?? '') + bust);

      toast({ title: 'Avatar updated' });
    } catch (err: any) {
      toast({
        title: 'Failed to upload',
        description: err?.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const onRemoveAvatar = async () => {
    setAvatarUrl(null);
    toast({ title: 'Avatar removed (save to apply)' });
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-6" />
        <div className="h-24 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-4" />
        <div className="h-10 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">My Account</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Update your personal information and avatar.
        </p>
      </div>

      {/* Avatar section */}
      <div className="flex items-center gap-6">
        <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-xs text-gray-500">
              No avatar
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="avatar">Change avatar</Label>
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={onUploadAvatar}
            disabled={uploading || !profileExists}
          />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onRemoveAvatar}
              disabled={uploading || !profileExists}
            >
              Remove
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Recommended: square image, &lt; 5MB.
          </p>
          {!profileExists && (
            <p className="text-xs text-red-500">
              Your profile record is missing. Ask an admin to create it before uploading an avatar.
            </p>
          )}
        </div>
      </div>

      {/* Name + Email */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full name</Label>
          <Input
            id="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            disabled={!profileExists}
          />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={profile.email ?? ''} disabled />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={onSave} disabled={saving || !profileExists}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.refresh()}
          disabled={saving || uploading}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}

