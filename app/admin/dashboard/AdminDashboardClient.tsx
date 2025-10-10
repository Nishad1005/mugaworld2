'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, ShoppingBag, Settings, LogOut, Package } from 'lucide-react';
import type { AdminProfile } from '@/lib/admin/types';

interface AdminDashboardClientProps {
  profile: AdminProfile;
}

export default function AdminDashboardClient({ profile }: AdminDashboardClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const hasPermission = (permissionName: string) => {
    return profile.permissions.some((p) => p.name === permissionName);
  };

  const quickActions = [
    {
      title: 'Manage Admins',
      description: 'Create and manage admin users',
      icon: Users,
      href: '/admin/users',
      permission: 'manage_admins',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Manage Services',
      description: 'Edit services and offerings',
      icon: Settings,
      href: '/admin/services',
      permission: 'edit_services',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Manage Products',
      description: 'Edit shop products',
      icon: ShoppingBag,
      href: '/admin/products',
      permission: 'edit_products',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Orders',
      description: 'View and manage orders',
      icon: Package,
      href: '/admin/orders',
      permission: 'view_orders',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-100 dark:bg-amber-900/20',
    },
  ];

  const availableActions = quickActions.filter((action) => hasPermission(action.permission));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950">
      <div className="border-b bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-amber-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Welcome back, {profile.full_name}</CardTitle>
                <CardDescription className="mt-2">
                  {profile.role_description}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-sm">
                {profile.role_name.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Email:</span> {profile.email}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {profile.permissions.map((permission) => (
                  <Badge key={permission.name} variant="secondary" className="text-xs">
                    {permission.description}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {availableActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card
                  key={action.title}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(action.href)}
                >
                  <CardHeader>
                    <div className={`p-3 rounded-full ${action.bgColor} w-fit mb-3`}>
                      <Icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {availableActions.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-600 dark:text-gray-400">
                  No actions available for your role. Contact a super admin for more permissions.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
