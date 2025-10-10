/*
  # Create cart and products tables for MUGA WORLD e-commerce

  ## Description
  This migration creates the products catalog and shopping cart tables to enable
  e-commerce functionality in MUGA WORLD. Users can browse products and add items
  to their cart for checkout.

  ## New Tables

  ### 1. `products`
  Product catalog table storing all available items
  - `id` (uuid, primary key) - Unique product identifier
  - `name` (text, required) - Product name/title
  - `description` (text, optional) - Detailed product description
  - `price` (numeric, required) - Product price in rupees
  - `image_url` (text, optional) - Product image URL
  - `category` (text, optional) - Product category (e.g., 'silk', 'handicraft')
  - `stock` (integer, required) - Available stock quantity
  - `is_active` (boolean, required) - Whether product is available for sale
  - `created_at` (timestamptz) - Product creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `cart_items`
  Shopping cart table storing user cart items
  - `id` (uuid, primary key) - Unique cart item identifier
  - `user_id` (uuid, required) - Links to auth.users.id
  - `product_id` (uuid, required) - Links to products.id
  - `quantity` (integer, required) - Quantity of product in cart
  - `created_at` (timestamptz) - When item was added to cart
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security

  ### Products Table RLS
  1. Enable RLS on products table
  2. Policy: Anyone (authenticated or not) can view active products
  3. Policy: Only admin users can insert/update/delete products (future feature)

  ### Cart Items Table RLS
  1. Enable RLS on cart_items table
  2. Policy: Users can view only their own cart items
  3. Policy: Users can insert items to their own cart
  4. Policy: Users can update only their own cart items
  5. Policy: Users can delete only their own cart items

  ## Indexes
  - Index on products.category for faster filtering
  - Index on products.is_active for faster active product queries
  - Index on cart_items.user_id for faster user cart lookups
  - Index on cart_items.product_id for product analytics

  ## Important Notes
  - Products are publicly viewable to allow browsing without login
  - Cart items are strictly user-isolated via RLS policies
  - Stock management should be handled in application logic during checkout
  - The cart persists across sessions for logged-in users
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  image_url text,
  category text,
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, product_id)
);

-- Create indexes for products
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Create indexes for cart_items
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- Enable Row Level Security on products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security on cart_items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Products RLS Policies: Anyone can view active products
CREATE POLICY "Anyone can view active products"
  ON products
  FOR SELECT
  USING (is_active = true);

-- Cart Items RLS Policies: Users can view their own cart items
CREATE POLICY "Users can view own cart items"
  ON cart_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Cart Items RLS Policies: Users can insert to their own cart
CREATE POLICY "Users can insert own cart items"
  ON cart_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Cart Items RLS Policies: Users can update their own cart items
CREATE POLICY "Users can update own cart items"
  ON cart_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Cart Items RLS Policies: Users can delete their own cart items
CREATE POLICY "Users can delete own cart items"
  ON cart_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_cart_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on products changes
DROP TRIGGER IF EXISTS update_products_updated_at_trigger ON products;
CREATE TRIGGER update_products_updated_at_trigger
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_products_updated_at();

-- Trigger to update updated_at on cart_items changes
DROP TRIGGER IF EXISTS update_cart_items_updated_at_trigger ON cart_items;
CREATE TRIGGER update_cart_items_updated_at_trigger
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_cart_items_updated_at();

-- Insert sample products for testing
INSERT INTO products (name, description, price, image_url, category, stock, is_active) VALUES
  (
    'Traditional Muga Silk Saree',
    'Exquisite handwoven Muga silk saree from Assam. Known for its natural golden sheen and durability.',
    12500.00,
    'https://images.pexels.com/photos/3310691/pexels-photo-3310691.jpeg?auto=compress&cs=tinysrgb&w=400',
    'silk',
    15,
    true
  ),
  (
    'Bamboo Handicraft Lamp',
    'Beautiful handcrafted bamboo lamp showcasing traditional Assamese artistry.',
    1250.00,
    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=400',
    'handicraft',
    30,
    true
  ),
  (
    'Assamese Gamosa',
    'Traditional Assamese cotton towel with intricate red border designs.',
    450.00,
    'https://images.pexels.com/photos/6069104/pexels-photo-6069104.jpeg?auto=compress&cs=tinysrgb&w=400',
    'textile',
    50,
    true
  ),
  (
    'Terracotta Jewelry Set',
    'Handmade terracotta jewelry set featuring traditional designs.',
    850.00,
    'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=400',
    'jewelry',
    25,
    true
  )
ON CONFLICT DO NOTHING;
