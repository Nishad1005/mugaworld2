# Admin System Setup Guide

This application includes a comprehensive role-based admin system with the following features:

## Features

- **Super Admin**: Full system access, can manage all admins and settings
- **Admin**: Can manage services and products
- **Cashier**: Can view and process orders
- Custom role-based permissions system
- Secure authentication with Supabase
- Protected admin routes

## Setup Instructions

### 1. Apply Database Migrations

The following migrations need to be applied to your Supabase database:

1. `20251010000000_create_admin_system.sql` - Creates admin roles, permissions, and user tables
2. `20251010000001_create_services_table.sql` - Creates services table with admin RLS policies
3. `20251010000002_update_products_rls.sql` - Updates products table with admin RLS policies

These migrations create:
- Admin roles (super_admin, admin, cashier)
- Admin permissions system
- RLS policies for secure data access
- Helper functions for permission checks

### 2. Create Your First Super Admin

After applying the migrations, you need to create your first super admin user:

1. Create a user account through Supabase Auth (either through the Supabase Dashboard or using the signup endpoint)

2. Insert the admin record into the database:

```sql
-- Replace 'USER_ID_FROM_AUTH' with the actual UUID from auth.users
-- Replace 'SUPER_ADMIN_ROLE_ID' with the UUID from admin_roles where name = 'super_admin'

INSERT INTO admins (id, email, role_id, full_name, is_active)
VALUES (
  'USER_ID_FROM_AUTH',
  'admin@example.com',
  (SELECT id FROM admin_roles WHERE name = 'super_admin'),
  'Super Admin Name',
  true
);
```

Or use this simpler approach:

```sql
-- Get the super_admin role ID first
SELECT id FROM admin_roles WHERE name = 'super_admin';

-- Then insert the admin (replace the values)
INSERT INTO admins (id, email, role_id, full_name, is_active)
VALUES (
  'your-user-id-here',
  'admin@example.com',
  'super-admin-role-id-here',
  'Your Name',
  true
);
```

### 3. Access the Admin Portal

Once your super admin is created, you can access the admin portal at:

```
https://your-domain.com/admin/login
```

Use the email and password you created in Supabase Auth to log in.

## Admin System Structure

### Routes

- `/admin/login` - Admin login page
- `/admin/dashboard` - Main admin dashboard
- `/admin/users` - Manage admin users (Super Admin only)
- `/admin/services` - Manage services (Admin role required)
- `/admin/products` - Manage shop products (Admin role required)

### Roles and Permissions

#### Super Admin
- Manage admin users (create, edit, delete admins)
- Manage roles and permissions
- Full access to all features
- Cannot be deactivated by themselves

#### Admin
- Edit services
- View services
- Edit products
- View products
- View orders
- View analytics

#### Cashier
- Manage orders (view and process)
- View orders
- View products

### Creating Additional Admins

Once logged in as a super admin:

1. Navigate to "Manage Admins" from the dashboard
2. Click "Add Admin"
3. Fill in the admin details:
   - Email
   - Password
   - Full Name
   - Role (select from available roles)
4. Click "Create"

The new admin will be able to log in immediately with their credentials.

### Managing Services

Admins with the "edit_services" permission can:

1. Navigate to "Manage Services" from the dashboard
2. Add new services with:
   - Title
   - Description
   - Price
   - Duration
   - Category
   - Image URL (use Pexels images)
   - Active status
3. Edit existing services
4. Toggle service active status
5. Delete services

### Managing Products

Admins with the "edit_products" permission can:

1. Navigate to "Manage Products" from the dashboard
2. Add new products with:
   - Product Name
   - Description
   - Price
   - Stock Quantity
   - Category
   - Image URL (use Pexels images)
   - In Stock status
3. Edit existing products
4. Toggle product stock status
5. Delete products

## Security Features

- **Row Level Security (RLS)**: All admin tables use RLS policies
- **Permission Checks**: Server-side permission validation on all admin routes
- **Secure Authentication**: Supabase Auth with JWT tokens
- **Protected Routes**: Automatic redirects for unauthorized access
- **Activity Tracking**: Track which admin created other admins

## Database Functions

### `check_admin_permission(permission_name text)`
Checks if the current authenticated user has a specific permission.

```sql
SELECT check_admin_permission('edit_services');
```

### `get_admin_profile()`
Returns the current admin's profile with role and permissions.

```sql
SELECT * FROM get_admin_profile();
```

## Customizing Roles and Permissions

To add new roles or permissions:

1. Insert into `admin_roles` table:
```sql
INSERT INTO admin_roles (name, description)
VALUES ('new_role', 'Description of the role');
```

2. Insert into `admin_permissions` table:
```sql
INSERT INTO admin_permissions (name, description, resource)
VALUES ('new_permission', 'Description', 'resource_name');
```

3. Link role to permissions in `role_permissions`:
```sql
INSERT INTO role_permissions (role_id, permission_id)
VALUES (
  (SELECT id FROM admin_roles WHERE name = 'new_role'),
  (SELECT id FROM admin_permissions WHERE name = 'new_permission')
);
```

## Troubleshooting

### Cannot log in to admin portal
- Verify the user exists in `auth.users`
- Verify the user exists in `admins` table with `is_active = true`
- Check that the role_id matches a valid role in `admin_roles`

### Permission denied errors
- Check the admin's role has the required permission in `role_permissions`
- Verify RLS policies are correctly applied
- Check that `is_active = true` for the admin

### Cannot create admins
- Ensure you're logged in as a super admin
- Check that the `manage_admins` permission is assigned to your role
- Verify the Supabase service role key is configured (for creating auth users)

## Best Practices

1. **Never share super admin credentials** - Create separate admin accounts for each user
2. **Use least privilege** - Assign the minimum role necessary for each admin
3. **Regular audits** - Review admin accounts and deactivate unused accounts
4. **Strong passwords** - Enforce minimum 8 characters for admin passwords
5. **Monitor activity** - Track who creates and modifies admins and content

## Support

For issues or questions about the admin system, please contact your system administrator.
