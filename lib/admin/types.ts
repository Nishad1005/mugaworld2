export interface AdminRole {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface AdminPermission {
  id: string;
  name: string;
  description: string;
  resource: string;
  created_at: string;
}

export interface Admin {
  id: string;
  email: string;
  full_name: string;
  role_id: string;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  role?: AdminRole;
  permissions?: AdminPermission[];
}

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string;
  role_name: string;
  role_description: string;
  permissions: AdminPermission[];
  is_active: boolean;
}

export type PermissionName =
  | 'manage_admins'
  | 'manage_roles'
  | 'edit_services'
  | 'view_services'
  | 'edit_products'
  | 'view_products'
  | 'manage_orders'
  | 'view_orders'
  | 'view_analytics'
  | 'manage_invoices'      
  | 'view_invoices'; 
