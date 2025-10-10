# MUGA WORLD - Deployment Instructions

## Critical Issue: Missing UI Components

Your project has a **Bolt file system limitation** that keeps deleting UI component files. Follow these steps to deploy successfully:

---

## Step 1: Apply Database Migration

Go to your Supabase Dashboard:
https://supabase.com/dashboard/project/0ec90b57d6e95fcbda19832f

### Apply Migration SQL

1. Click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Copy and paste the entire contents of: `supabase/migrations/20251001000000_create_cart_and_products_tables.sql`
4. Click **"Run"** to execute the migration

This will create:
- `products` table (with 4 sample products)
- `cart_items` table
- All necessary RLS policies
- Proper indexes

---

## Step 2: Download Missing UI Components

Since Bolt keeps deleting the UI component files, you need to add them manually. Create these files in your local project:

### Create: `components/ui/button.tsx`
```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### Create: `components/ui/card.tsx`
```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

### Create: `components/ui/badge.tsx`
```typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
```

### Create: `components/ui/input.tsx`, `label.tsx`, `textarea.tsx`, `checkbox.tsx`, `toast.tsx`, `toaster.tsx`
### Create: `hooks/use-toast.ts`

**These files are the same ones I created earlier.** Copy them from your Bolt workspace or I can provide them again if needed.

---

## Step 3: Deploy to Netlify

Once you have all the UI component files:

1. Push your code to Git repository
2. Trigger a Netlify rebuild
3. Your site should deploy successfully

---

## What's Already Working

✅ **User Registration** - Saves to `profiles` table in Supabase
✅ **User Login** - Supabase authentication
✅ **Account Page** - Shows user profile with edit functionality
✅ **Database Schema** - Ready with RLS policies
✅ **Cart System** - Database tables ready (needs migration applied)

## What You Need to Do

1. Apply the SQL migration in Supabase Dashboard
2. Add the missing UI component files to your project
3. Redeploy on Netlify

---

## Testing Your Setup

After deployment:

1. **Register a new account** - Should save to Supabase `profiles` table
2. **Visit `/account`** - Should show your profile information
3. **Edit your profile** - Should update in Supabase
4. **Visit `/shop`** - Should show products from database
5. **Add items to cart** - Should save to `cart_items` table
6. **Visit `/cart`** - Should show your cart items

---

## Supabase Dashboard Links

- **Project Dashboard**: https://supabase.com/dashboard/project/0ec90b57d6e95fcbda19832f
- **SQL Editor**: Click "SQL Editor" in sidebar
- **Table Editor**: Click "Table Editor" to view data
- **Authentication**: Click "Authentication" to view users

---

## Need Help?

If you encounter issues:
1. Check Supabase logs in the dashboard
2. Check browser console for errors
3. Verify `.env` file has correct Supabase credentials
4. Ensure all UI component files are present
