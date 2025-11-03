import type { Endpoint } from '@/types/api';

// Base entity interface
export interface BaseEntity {
  id: number | string;
}

// Column configuration for table display
export interface ColumnConfig {
  key: keyof any;
  label: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'badge' | 'avatar' | 'image';
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
  formatter?: (value: any, row: any) => string | JSX.Element;
  badgeVariant?: (value: any) => 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'secondary';
}

// Form field configuration for create/edit
export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'date' | 'file' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: any }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  defaultValue?: any;
  disabled?: boolean;
  multiple?: boolean;
}

// Action configuration for buttons
export interface ActionConfig {
  type: 'create' | 'edit' | 'delete' | 'view' | 'bulk-edit' | 'bulk-delete' | 'import' | 'export';
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  permission?: string;
  confirmation?: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
  };
}

// Import configuration
export interface ImportConfig {
  enabled: boolean;
  allowedFormats: ('csv' | 'xlsx' | 'json')[];
  templateUrl?: string;
  mapping?: Record<string, string>; // column mapping from file to entity fields
  validation?: {
    requiredFields: string[];
    uniqueFields: string[];
  };
}

// Export configuration
export interface ExportConfig {
  enabled: boolean;
  formats: ('csv' | 'xlsx' | 'json')[];
  defaultFields?: string[];
  allowCustomFields?: boolean;
}

// Search/Filter configuration
export interface SearchConfig {
  enabled: boolean;
  placeholder: string;
  fields: string[]; // fields to search in
  filters?: Array<{
    name: string;
    label: string;
    type: 'select' | 'date-range' | 'checkbox';
    options?: Array<{ label: string; value: any }>;
  }>;
}

// Pagination configuration
export interface PaginationConfig {
  enabled: boolean;
  defaultPageSize: number;
  pageSizeOptions: number[];
  showSizeChanger?: boolean;
}

// Main entity configuration
export interface EntityConfig<T extends BaseEntity = BaseEntity> {
  // Basic info
  type: Endpoint;
  name: string;
  displayName: string;
  pluralName: string;
  route: string;
  
  // UI Configuration
  breadcrumb: {
    label: string;
    path?: string;
  }[];
  
  // Table configuration
  columns: ColumnConfig[];
  defaultSort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  
  // Form configuration
  fields: FieldConfig[];
  
  // Actions
  actions: ActionConfig[];
  
  // Features
  search: SearchConfig;
  pagination: PaginationConfig;
  import?: ImportConfig;
  export?: ExportConfig;
  
  // Custom components
  customComponents?: {
    // Override default components if needed
    rowRenderer?: (entity: T, index: number) => JSX.Element;
    actionsRenderer?: (entity: T) => JSX.Element;
    formRenderer?: (entity: T, mode: 'create' | 'edit') => JSX.Element;
  };
  
  // Permissions
  permissions?: {
    create?: string[];
    read?: string[];
    update?: string[];
    delete?: string[];
    bulk?: string[];
  };
  
  // API endpoints override
  endpoints?: {
    list?: string;
    create?: string;
    update?: string;
    delete?: string;
    bulk?: string;
  };
}

// Generic CRUD operations
export interface CrudOperations {
  list: (params?: any) => Promise<{ data: any[]; total: number; page: number; limit: number }>;
  create: (data: any) => Promise<any>;
  update: (id: any, data: any) => Promise<any>;
  delete: (id: any) => Promise<void>;
  bulkDelete: (ids: any[]) => Promise<void>;
  bulkUpdate: (ids: any[], data: any) => Promise<any[]>;
  import: (file: File, mapping?: Record<string, string>) => Promise<any>;
  export: (format: string, fields?: string[], filters?: any) => Promise<Blob>;
}

// Form state and validation
export interface FormState {
  data: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Table state
export interface TableState {
  selectedRows: any[];
  currentPage: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filters: Record<string, any>;
  searchQuery?: string;
  loading: boolean;
}

// Modal state
export interface ModalState {
  create: boolean;
  edit: boolean;
  delete: boolean;
  bulk: boolean;
  import: boolean;
  export: boolean;
  data?: any;
}

// Event types
export interface CrudEvents {
  onEntityCreate: (entity: any) => void;
  onEntityUpdate: (entity: any) => void;
  onEntityDelete: (id: any) => void;
  onBulkAction: (action: string, entities: any[]) => void;
  onImport: (result: any) => void;
  onExport: (data: any) => void;
  onError: (error: Error, context: string) => void;
}

// Theme configuration
export interface ThemeConfig {
  colors?: {
    primary?: string;
    secondary?: string;
    success?: string;
    danger?: string;
    warning?: string;
    info?: string;
  };
  sizes?: {
    sm?: string;
    md?: string;
    lg?: string;
  };
  variants?: {
    outlined?: boolean;
    filled?: boolean;
    minimal?: boolean;
  };
}
