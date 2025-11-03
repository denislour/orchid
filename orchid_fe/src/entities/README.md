# 🚀 Dynamic CRUD Framework

A comprehensive, type-safe, and highly configurable CRUD framework for Astro applications that enables rapid development of entity management interfaces.

## ✨ Features

### 🎯 **Zero-Code Configuration**
- **Entity-driven**: Define entities once, get full CRUD automatically
- **Type-safe**: Full TypeScript support with strict typing
- **Hot-swappable**: Change configurations without code changes

### 🛠️ **Complete CRUD Operations**
- ✅ **List** - Paginated, sortable, filterable data tables
- ✅ **Create** - Dynamic forms with validation
- ✅ **Read** - Individual entity views
- ✅ **Update** - Edit single entities
- ✅ **Delete** - Single/bulk delete with confirmation
- ✅ **Bulk Edit** - Update multiple entities at once
- ✅ **Import** - CSV/Excel/JSON file import with field mapping
- ✅ **Export** - Export data in multiple formats
- ✅ **Search** - Advanced search with custom filters

### 🎨 **Rich UI Components**
- **Responsive Design**: Mobile-first, responsive layout
- **Dark Mode**: Built-in dark theme support
- **Accessibility**: WCAG 2.1 compliant
- **Customizable**: Override any component with custom implementations

### 🔒 **Security & Permissions**
- **Role-based**: Granular permission system
- **Validation**: Client and server-side validation
- **CSRF Protection**: Built-in security measures

## 📁 Project Structure

```
src/
├── entities/                    # Entity configurations
│   ├── types.ts               # Core type definitions
│   ├── users.config.ts        # User entity configuration
│   ├── products.config.ts     # Product entity configuration
│   └── index.ts               # Entity registry
├── components/crud/           # CRUD UI components
│   ├── CrudPage.astro         # Main page component
│   ├── CrudForm.astro         # Create/Edit forms
│   ├── CrudImport.astro       # Import functionality
│   └── CrudActions.astro      # Action buttons
├── services/crud/             # Business logic
│   └── crud.service.ts        # Generic CRUD service
└── modules/
    └── CrudGeneric.astro      # Generic CRUD entry point
```

## 🚀 Quick Start

### 1. Define Your Entity

Create a configuration file in `src/entities/`:

```typescript
// src/entities/customers.config.ts
import type { EntityConfig } from './types';

export const customersConfig: EntityConfig = {
  // Basic info
  type: 'customers',
  name: 'customer',
  displayName: 'Customer',
  pluralName: 'Customers',
  route: '/customers',
  
  // Table columns
  columns: [
    { key: 'id', label: 'ID', type: 'number', sortable: true },
    { key: 'name', label: 'Name', type: 'text', sortable: true, searchable: true },
    { key: 'email', label: 'Email', type: 'text', sortable: true, searchable: true },
    { key: 'status', label: 'Status', type: 'badge', sortable: true }
  ],
  
  // Form fields
  fields: [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'status', label: 'Status', type: 'select', required: true, 
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ]
    }
  ],
  
  // Actions
  actions: [
    { type: 'create', label: 'Add Customer', variant: 'primary' },
    { type: 'edit', label: 'Edit' },
    { type: 'delete', label: 'Delete', variant: 'danger', 
      confirmation: { title: 'Delete Customer', message: 'Are you sure?' }
    },
    { type: 'bulk-delete', label: 'Delete Selected', variant: 'danger' }
  ],
  
  // Search configuration
  search: {
    enabled: true,
    placeholder: 'Search customers by name or email...',
    fields: ['name', 'email']
  },
  
  // Pagination
  pagination: {
    enabled: true,
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50]
  }
};
```

### 2. Register Your Entity

Add to `src/entities/index.ts`:

```typescript
import { customersConfig } from './customers.config';

export const entityRegistry = {
  users: () => import('./users.config').then(m => m.usersConfig),
  products: () => import('./products.config').then(m => m.productsConfig),
  customers: () => import('./customers.config').then(m => m.customersConfig), // Add this
};
```

### 3. Update API Types

Add to `src/types/api.ts`:

```typescript
export type Endpoint = 'products' | 'users' | 'customers'; // Add 'customers'
```

### 4. Create Page

```typescript
// src/pages/customers.astro
---
import CrudGeneric from '@/modules/CrudGeneric.astro';
import Layout from '@/layouts/Layout.astro';

<Layout title="Customers - Admin Dashboard">
  <CrudGeneric entityType="customers" />
</Layout>
```

### 5. Add API Endpoints

Update `src/pages/api/[...entity].ts`:

```typescript
import * as customerService from '@/services/customers';

export const endpointsToOperations = {
  products: operations.getProducts,
  users: operations.getUsers,
  customers: customerService.getCustomers, // Add this
};
```

That's it! You now have a full CRUD interface for customers!

## 🎛️ Advanced Configuration

### Custom Field Types

```typescript
fields: [
  {
    name: 'avatar',
    label: 'Profile Picture',
    type: 'file',
    validation: { message: 'Please upload a valid image file' }
  },
  {
    name: 'preferences',
    label: 'Preferences',
    type: 'checkbox',
    options: [
      { label: 'Email Notifications', value: 'email' },
      { label: 'SMS Notifications', value: 'sms' }
    ]
  }
]
```

### Custom Column Formatters

```typescript
columns: [
  {
    key: 'status',
    label: 'Status',
    type: 'badge',
    badgeVariant: (value) => {
      switch (value) {
        case 'active': return 'success';
        case 'pending': return 'warning';
        default: return 'secondary';
      }
    }
  },
  {
    key: 'price',
    label: 'Price',
    type: 'number',
    formatter: (value) => `$${parseFloat(value).toFixed(2)}`
  }
]
```

### Import/Export Configuration

```typescript
import: {
  enabled: true,
  allowedFormats: ['csv', 'xlsx'],
  templateUrl: '/templates/customers-import-template.csv',
  mapping: {
    'Full Name': 'name',
    'Email Address': 'email',
    'Status': 'status'
  },
  validation: {
    requiredFields: ['name', 'email'],
    uniqueFields: ['email']
  }
}
```

### Custom Components Override

```typescript
customComponents: {
  rowRenderer: (customer, index) => <CustomCustomerRow customer={customer} />,
  actionsRenderer: (customer) => <CustomCustomerActions customer={customer} />,
  formRenderer: (customer, mode) => <CustomCustomerForm customer={customer} mode={mode} />
}
```

## 🔧 Service Integration

### Custom Service Methods

```typescript
// src/services/customers.ts
import { CrudService } from '@/services/crud/crud.service';
import { customersConfig } from '@/entities';

class CustomerService extends CrudService {
  constructor() {
    super(customersConfig);
  }
  
  // Custom business logic
  async getActiveCustomers() {
    return this.list({ filters: { status: 'active' } });
  }
  
  async sendWelcomeEmail(customerId: string) {
    // Custom implementation
  }
}

export const customerService = new CustomerService();
```

## 🎨 Theming & Styling

The framework uses Tailwind CSS classes and supports:

- **Dark Mode**: Automatic dark/light theme switching
- **Custom Colors**: Override primary colors via CSS variables
- **Responsive**: Mobile-first responsive design
- **Component Variants**: Different button styles and sizes

## 📊 Performance Features

- **Lazy Loading**: Entity configurations loaded on demand
- **Pagination**: Efficient data loading with server-side pagination
- **Virtual Scrolling**: For large datasets (optional)
- **Caching**: Built-in response caching
- **Optimistic Updates**: Instant UI updates with rollback on error

## 🔒 Security Best Practices

- **Input Validation**: Client and server-side validation
- **CSRF Protection**: Built-in CSRF token handling
- **XSS Prevention**: Safe HTML rendering
- **Rate Limiting**: Built-in request throttling
- **Permission Checks**: Role-based access control

## 🧪 Testing

The framework includes utilities for testing:

```typescript
import { createCrudService } from '@/services/crud/crud.service';
import { customersConfig } from '@/entities';

describe('Customer CRUD', () => {
  const service = createCrudService(customersConfig);
  
  test('should create customer', async () => {
    const customer = await service.create({
      name: 'John Doe',
      email: 'john@example.com',
      status: 'active'
    });
    
    expect(customer.id).toBeDefined();
    expect(customer.name).toBe('John Doe');
  });
});
```

## 🚀 Deployment

### Environment Variables

```bash
# .env
API_URL=https://your-api.com
DEFAULT_PAGE_SIZE=20
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_EXPORT_FORMATS=csv,xlsx,json
```

### Docker Support

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- 📧 Email: support@yourcompany.com
- 💬 Discord: [Join our Discord](https://discord.gg/your-server)
- 📖 Documentation: [Full Documentation](https://docs.your-framework.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)

---

## 🎯 Next Steps

1. **Try the Demo**: Check out the live demo at [demo.your-framework.com](https://demo.your-framework.com)
2. **Read the Guide**: Complete [getting started guide](https://docs.your-framework.com/getting-started)
3. **Join Community**: Connect with other developers using the framework
4. **Build Something**: Create your first CRUD interface in minutes!

Happy coding! 🚀