/*
  # Admin System with Role-Based Access Control

  1. New Tables
    - `admin_roles`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Role name (super_admin, admin, cashier, etc.)
      - `description` (text)
      - `created_at` (timestamp)

    - `admin_permissions`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Permission name (manage_admins, edit_services, edit_products, etc.)
      - `description` (text)
      - `resource` (text) - What resource this permission applies to
      - `created_at` (timestamp)

    - `role_permissions`
      - `role_id` (uuid, foreign key to admin_roles)
      - `permission_id` (uuid, foreign key to admin_permissions)
      - Junction table for many-to-many relationship

    - `admins`
      - `id` (uuid, primary key, foreign key to auth.users)
      - `email` (text, unique)
      - `role_id` (uuid, foreign key to admin_roles)
      - `full_name` (text)
      - `is_active` (boolean)
      - `created_by` (uuid, foreign key to admins) - Who created this admin
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Super admins can do everything
    - Admins can only view their own profile and perform actions based on their permissions
    - Regular users cannot access admin tables
*/

-- Create admin_roles table
CREATE TABLE IF NOT EXISTS admin_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- Create admin_permissions table
CREATE TABLE IF NOT EXISTS admin_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  resource text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id uuid REFERENCES admin_roles(id) ON DELETE CASCADE,
  permission_id uuid REFERENCES admin_permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role_id uuid REFERENCES admin_roles(id) NOT NULL,
  full_name text NOT NULL,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES admins(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Insert default roles
INSERT INTO admin_roles (name, description) VALUES
  ('super_admin', 'Full system access - can manage all admins and settings'),
  ('admin', 'Can manage services and products'),
  ('cashier', 'Can view and process orders only')
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO admin_permissions (name, description, resource) VALUES
  ('manage_admins', 'Create, edit, and delete admin users', 'admins'),
  ('manage_roles', 'Create and edit roles and permissions', 'roles'),
  ('edit_services', 'Create, edit, and delete services', 'services'),
  ('view_services', 'View services', 'services'),
  ('edit_products', 'Create, edit, and delete products', 'products'),
  ('view_products', 'View products', 'products'),
  ('manage_orders', 'View and process orders', 'orders'),
  ('view_orders', 'View orders only', 'orders'),
  ('view_analytics', 'View analytics and reports', 'analytics')
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to super_admin role (all permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM admin_roles WHERE name = 'super_admin'),
  id
FROM admin_permissions
ON CONFLICT DO NOTHING;

-- Assign permissions to admin role (services and products)
INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM admin_roles WHERE name = 'admin'),
  id
FROM admin_permissions
WHERE name IN ('edit_services', 'view_services', 'edit_products', 'view_products', 'view_orders', 'view_analytics')
ON CONFLICT DO NOTHING;

-- Assign permissions to cashier role (orders only)
INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM admin_roles WHERE name = 'cashier'),
  id
FROM admin_permissions
WHERE name IN ('manage_orders', 'view_orders', 'view_products')
ON CONFLICT DO NOTHING;

-- RLS Policies for admin_roles
CREATE POLICY "Admins can view all roles"
  ON admin_roles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

CREATE POLICY "Super admins can manage roles"
  ON admin_roles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      JOIN admin_roles ON admins.role_id = admin_roles.id
      WHERE admins.id = auth.uid()
      AND admin_roles.name = 'super_admin'
      AND admins.is_active = true
    )
  );

-- RLS Policies for admin_permissions
CREATE POLICY "Admins can view all permissions"
  ON admin_permissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

CREATE POLICY "Super admins can manage permissions"
  ON admin_permissions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      JOIN admin_roles ON admins.role_id = admin_roles.id
      WHERE admins.id = auth.uid()
      AND admin_roles.name = 'super_admin'
      AND admins.is_active = true
    )
  );

-- RLS Policies for role_permissions
CREATE POLICY "Admins can view role permissions"
  ON role_permissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

CREATE POLICY "Super admins can manage role permissions"
  ON role_permissions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      JOIN admin_roles ON admins.role_id = admin_roles.id
      WHERE admins.id = auth.uid()
      AND admin_roles.name = 'super_admin'
      AND admins.is_active = true
    )
  );

-- RLS Policies for admins table
CREATE POLICY "Admins can view their own profile"
  ON admins FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Super admins can view all admins"
  ON admins FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins AS self
      JOIN admin_roles ON self.role_id = admin_roles.id
      WHERE self.id = auth.uid()
      AND admin_roles.name = 'super_admin'
      AND self.is_active = true
    )
  );

CREATE POLICY "Super admins can create admins"
  ON admins FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins AS self
      JOIN admin_roles ON self.role_id = admin_roles.id
      WHERE self.id = auth.uid()
      AND admin_roles.name = 'super_admin'
      AND self.is_active = true
    )
  );

CREATE POLICY "Super admins can update admins"
  ON admins FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins AS self
      JOIN admin_roles ON self.role_id = admin_roles.id
      WHERE self.id = auth.uid()
      AND admin_roles.name = 'super_admin'
      AND self.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins AS self
      JOIN admin_roles ON self.role_id = admin_roles.id
      WHERE self.id = auth.uid()
      AND admin_roles.name = 'super_admin'
      AND self.is_active = true
    )
  );

CREATE POLICY "Super admins can delete admins"
  ON admins FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins AS self
      JOIN admin_roles ON self.role_id = admin_roles.id
      WHERE self.id = auth.uid()
      AND admin_roles.name = 'super_admin'
      AND self.is_active = true
    )
  );

-- Create function to check admin permissions
CREATE OR REPLACE FUNCTION check_admin_permission(permission_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM admins
    JOIN role_permissions ON admins.role_id = role_permissions.role_id
    JOIN admin_permissions ON role_permissions.permission_id = admin_permissions.id
    WHERE admins.id = auth.uid()
    AND admin_permissions.name = permission_name
    AND admins.is_active = true
  );
END;
$$;

-- Create function to get admin with role and permissions
CREATE OR REPLACE FUNCTION get_admin_profile()
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  role_name text,
  role_description text,
  permissions jsonb,
  is_active boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.email,
    a.full_name,
    ar.name AS role_name,
    ar.description AS role_description,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'name', ap.name,
          'description', ap.description,
          'resource', ap.resource
        )
      ) FILTER (WHERE ap.id IS NOT NULL),
      '[]'::jsonb
    ) AS permissions,
    a.is_active
  FROM admins a
  JOIN admin_roles ar ON a.role_id = ar.id
  LEFT JOIN role_permissions rp ON ar.id = rp.role_id
  LEFT JOIN admin_permissions ap ON rp.permission_id = ap.id
  WHERE a.id = auth.uid()
  GROUP BY a.id, a.email, a.full_name, ar.name, ar.description, a.is_active;
END;
$$;
