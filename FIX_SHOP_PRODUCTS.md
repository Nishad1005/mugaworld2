# Fix Shop Products Not Loading

## Problem
The shop page cannot fetch products because the Row Level Security (RLS) policies only allow authenticated admins to view products. Public users (not logged in) cannot see any products.

## Solution
Add a public read policy to the `products` table that allows anyone to view active products.

## How to Fix

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `fdksonnwxyxnagjjrmfl`
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Paste this SQL:

```sql
-- Add public read access for active products
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (is_active = true);
```

6. Click **Run** or press `Ctrl+Enter`
7. You should see: "Success. No rows returned"

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref fdksonnwxyxnagjjrmfl

# Create and apply migration
supabase migration new add_public_products_access

# Add the SQL above to the generated migration file
# Then apply it
supabase db push
```

## Verify the Fix

After applying the policy, go to your shop page and refresh. Products should now load for everyone!

## What This Does

- **Before**: Only authenticated admins could view products
- **After**: Anyone can view products where `is_active = true`
- Admins still have full CRUD permissions
- Inactive products remain hidden from public view

## Current RLS Policies on Products Table

After the fix, you should have these policies:

1. `Public can view active products` - Anyone can SELECT active products
2. `Admins can view all products` - Admins can SELECT all products
3. `Admins with permission can insert products` - Admin INSERT permission
4. `Admins with permission can update products` - Admin UPDATE permission
5. `Admins with permission can delete products` - Admin DELETE permission
