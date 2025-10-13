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

      const p: Profile = prof ?? {
        id: user.id,
        email: user.email ?? null,
        full_name: null,
        avatar_url: null,
      };

      setProfile(p);
      setFullName(p.full_name ?? '');
      setAvatarUrl(p.avatar_url ?? null);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSave = async () => {
    if (!profile) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName || null,
        avatar_url: avatarUrl || null,
      })
      .eq('id', profile.id);

    setSaving(false);

    if (error) {
      toast({
        title: 'Could not save profile',
        description: error.message,
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
      const path = `${profile.id}/avatar.${ext}`;

      // Upload (upsert into avatars bucket)
      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true });

      if (upErr) throw upErr;

      // Get a public URL (works because we made the bucket public-read)
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      setAvatarUrl(data.publicUrl);

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
            disabled={uploading}
          />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onRemoveAvatar}
              disabled={uploading}
            >
              Remove
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Recommended: square image, &lt; 5MB.
          </p>
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
          />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={profile.email ?? ''} disabled />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={onSave} disabled={saving}>
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
