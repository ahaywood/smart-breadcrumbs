# Smart Breadcrumbs

A smart but simple breadcrumb component that automatically generates breadcrumb navigation from your URL structure while allowing you to customize specific routes as needed.

## Features

- **Zero-ish Configuration**: Works out-of-the-box for most routes
- **Database Integration**: Automatically fetches resource names from your database
- **Minimal Overrides**: Only configure exceptions, not every route
- **Clean URLs**: Converts `kebab-case` segments to `Title Case`
- **Async Support**: Handles database lookups seamlessly

## How It Works

The component follows a simple priority system:

1. **Check Overrides**: If a specific path has a custom title, use it
2. **Database Lookup**: If the segment follows a resource pattern (e.g., `/companies/slug`), fetch the real name
3. **Format Fallback**: Convert the raw segment to readable format

## Basic Usage

```tsx
// @/pages/Layout.tsx
import { Breadcrumbs } from '@/components/Breadcrumbs';

const Layout = ({ children, requestInfo }: LayoutProps) => {
  return (
    <div style={{ padding: "20px", background: "yellow" }}>
      <Breadcrumbs currentUrl={requestInfo?.request.url ?? ""} />
      {children}
    </div>
  );
};

export { Layout };
```

## Examples

### Automatic Behavior
```
URL: /companies/apple-inc/products/iphone
Breadcrumbs: Home / Companies / Apple Inc. / Products / iPhone 15 Pro
```

The component automatically:
- Recognizes `/companies/apple-inc` and looks up the company name
- Recognizes `/products/iphone` and looks up the product name
- Formats regular segments like "products" → "Products"

### With Overrides
```tsx
// In Breadcrumbs.tsx
const overrides: Record<string, string> = {
  '/admin/investment-vehicles': 'Investment Vehicles',
  '/research-documents': 'Research Documents',
};
```

```
URL: /admin/investment-vehicles
Breadcrumbs: Home / Admin / Investment Vehicles
```

## Adding New Resource Types

To support additional resource types, add a new condition in the component:

```tsx
if (prevSegment === 'users') {
  const user = await db.user.findUnique({ where: { id: segment } });
  if (user?.name) {
    title = user.name;
  }
}
```

This will automatically handle URLs like `/users/123` by showing the user's actual name instead of "123".

## Configuration

### Database Models
The component expects your Prisma models to have either a `name` or `title` field:

```prisma
model Company {
  id   String @id @default(cuid())
  slug String @unique
  name String  // Used for breadcrumb titles
}

model Product {
  id   String @id @default(cuid())
  name String  // Used for breadcrumb titles
}
```

### Supported Patterns
Currently supports these URL patterns out of the box:
- `/companies/:slug` - Looks up company by slug
- `/products/:id` - Looks up product by ID

### Overrides
Add entries to the `overrides` object for paths that need custom titles:

```tsx
const overrides: Record<string, string> = {
  '/admin/cache': 'Cache Management',
  '/api/docs': 'API Documentation',
  '/settings/billing': 'Billing Settings',
};
```

## Requirements

- **RedwoodSDK**
- **Prisma**: For database lookups, but could easily be modified for a different ORM, like Drizzle
- **Database**: Models with `name` or `title` fields

## Performance Notes

- Database lookups are only performed for recognized resource patterns
- No caching is implemented by default (can be added if needed)
- Each breadcrumb segment may trigger a database query

## Extending

### Adding Caching
If you need better performance, you can add caching:

```tsx
const cache = new Map<string, string>();

// Before database lookup
const cacheKey = `company:${segment}`;
if (cache.has(cacheKey)) {
  title = cache.get(cacheKey)!;
} else {
  // ... database lookup
  cache.set(cacheKey, title);
}
```

## Why This Approach?

**Convention over Configuration**: 90% of breadcrumbs follow predictable patterns. Rather than configuring every single route, this component uses intelligent conventions and only requires configuration for edge cases.

**Maintainable**: Adding new pages doesn't require updating breadcrumb configuration. Only special cases need attention.

**Database-Aware**: Shows meaningful names like "Apple Inc." instead of technical slugs like "apple-inc".