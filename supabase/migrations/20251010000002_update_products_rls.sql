/*
  # Update Products Table RLS Policies

  1. Changes
    - Add RLS policies for admin management of products
    - Allow admins with edit_products permission to manage products
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view all products" ON products;
DROP POLICY IF EXISTS "Admins with permission can insert products" ON products;
DROP POLICY IF EXISTS "Admins with permission can update products" ON products;
DROP POLICY IF EXISTS "Admins with permission can delete products" ON products;

-- Admins can view all products
CREATE POLICY "Admins can view all products"
  ON products FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

-- Admins with edit_products permission can insert products
CREATE POLICY "Admins with permission can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (check_admin_permission('edit_products'));

-- Admins with edit_products permission can update products
CREATE POLICY "Admins with permission can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (check_admin_permission('edit_products'))
  WITH CHECK (check_admin_permission('edit_products'));

-- Admins with edit_products permission can delete products
CREATE POLICY "Admins with permission can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (check_admin_permission('edit_products'));
