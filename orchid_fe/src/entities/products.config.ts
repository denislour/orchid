import type { Product } from '@/types/entities';
import type {
	EntityConfig,
	FieldConfig,
	ColumnConfig,
	ActionConfig,
} from './types';

export const productsConfig: EntityConfig<Product> = {
	// Basic info
	type: 'products',
	name: 'product',
	displayName: 'Product',
	pluralName: 'Products',
	route: '/products',

	// UI Configuration
	breadcrumb: [
		{ label: 'Home', path: '/dashboard' },
		{ label: 'E-commerce', path: '/products' },
		{ label: 'Products' },
	],

	// Table configuration
	columns: [
		{
			key: 'id',
			label: 'ID',
			type: 'number',
			sortable: true,
			width: '80px',
		},
		{
			key: 'name',
			label: 'Product Name',
			type: 'text',
			sortable: true,
			searchable: true,
		},
		{
			key: 'category',
			label: 'Category',
			type: 'text',
			sortable: true,
			searchable: true,
		},
		{
			key: 'technology',
			label: 'Technology',
			type: 'badge',
			sortable: true,
			searchable: true,
			badgeVariant: (value) => {
				switch (value?.toLowerCase()) {
					case 'react':
					case 'vue':
					case 'angular':
						return 'primary';
					case 'node':
					case 'python':
					case 'java':
						return 'success';
					case 'docker':
					case 'kubernetes':
						return 'info';
					default:
						return 'secondary';
				}
			},
		},
		{
			key: 'price',
			label: 'Price',
			type: 'number',
			sortable: true,
			formatter: (value) => `$${parseFloat(value).toFixed(2)}`,
		},
		{
			key: 'discount',
			label: 'Discount',
			type: 'number',
			sortable: true,
			formatter: (value) => (value ? `${value}%` : '-'),
		},
		{
			key: 'description',
			label: 'Description',
			type: 'text',
			searchable: true,
			formatter: (value) =>
				value?.length > 50 ? `${value.substring(0, 50)}...` : value,
		},
	],

	defaultSort: {
		field: 'name',
		direction: 'asc',
	},

	// Form configuration
	fields: [
		{
			name: 'name',
			label: 'Product Name',
			type: 'text',
			required: true,
			placeholder: 'Enter product name',
			validation: {
				min: 3,
				max: 200,
				message: 'Product name must be between 3 and 200 characters',
			},
		},
		{
			name: 'category',
			label: 'Category',
			type: 'select',
			required: true,
			options: [
				{ label: 'Electronics', value: 'Electronics' },
				{ label: 'Software', value: 'Software' },
				{ label: 'Hardware', value: 'Hardware' },
				{ label: 'Services', value: 'Services' },
				{ label: 'Education', value: 'Education' },
				{ label: 'Books', value: 'Books' },
				{ label: 'Clothing', value: 'Clothing' },
				{ label: 'Food', value: 'Food' },
				{ label: 'Other', value: 'Other' },
			],
		},
		{
			name: 'technology',
			label: 'Technology Stack',
			type: 'select',
			required: true,
			options: [
				{ label: 'React', value: 'React' },
				{ label: 'Vue.js', value: 'Vue.js' },
				{ label: 'Angular', value: 'Angular' },
				{ label: 'Node.js', value: 'Node.js' },
				{ label: 'Python', value: 'Python' },
				{ label: 'Java', value: 'Java' },
				{ label: 'Docker', value: 'Docker' },
				{ label: 'Kubernetes', value: 'Kubernetes' },
				{ label: 'AWS', value: 'AWS' },
				{ label: 'MongoDB', value: 'MongoDB' },
				{ label: 'PostgreSQL', value: 'PostgreSQL' },
				{ label: 'Other', value: 'Other' },
			],
		},
		{
			name: 'price',
			label: 'Price',
			type: 'number',
			required: true,
			placeholder: '0.00',
			validation: {
				min: 0,
				max: 999999.99,
				message: 'Price must be between 0 and 999999.99',
			},
		},
		{
			name: 'discount',
			label: 'Discount (%)',
			type: 'number',
			placeholder: '0',
			defaultValue: 0,
			validation: {
				min: 0,
				max: 100,
				message: 'Discount must be between 0 and 100',
			},
		},
		{
			name: 'description',
			label: 'Description',
			type: 'textarea',
			required: true,
			placeholder: 'Enter product description',
			validation: {
				min: 10,
				max: 2000,
				message: 'Description must be between 10 and 2000 characters',
			},
		},
	],

	// Actions
	actions: [
		{
			type: 'create',
			label: 'Add Product',
			icon: 'plus',
			variant: 'primary',
		},
		{
			type: 'edit',
			label: 'Edit',
			icon: 'edit',
		},
		{
			type: 'delete',
			label: 'Delete',
			icon: 'trash',
			variant: 'danger',
			confirmation: {
				title: 'Delete Product',
				message:
					'Are you sure you want to delete this product? This action cannot be undone.',
				confirmText: 'Delete',
				cancelText: 'Cancel',
			},
		},
		{
			type: 'bulk-edit',
			label: 'Edit Selected',
			icon: 'edit',
			variant: 'warning',
		},
		{
			type: 'bulk-delete',
			label: 'Delete Selected',
			icon: 'trash',
			variant: 'danger',
			confirmation: {
				title: 'Delete Products',
				message:
					'Are you sure you want to delete {count} selected products? This action cannot be undone.',
				confirmText: 'Delete',
				cancelText: 'Cancel',
			},
		},
		{
			type: 'import',
			label: 'Import Products',
			icon: 'upload',
			variant: 'secondary',
		},
		{
			type: 'export',
			label: 'Export Products',
			icon: 'download',
			variant: 'secondary',
		},
	],

	// Features
	search: {
		enabled: true,
		placeholder: 'Search for products by name, category, technology...',
		fields: ['name', 'category', 'technology', 'description'],
		filters: [
			{
				name: 'category',
				label: 'Category',
				type: 'select',
				options: [
					{ label: 'All', value: '' },
					{ label: 'Electronics', value: 'Electronics' },
					{ label: 'Software', value: 'Software' },
					{ label: 'Hardware', value: 'Hardware' },
					{ label: 'Services', value: 'Services' },
					{ label: 'Education', value: 'Education' },
					{ label: 'Books', value: 'Books' },
					{ label: 'Clothing', value: 'Clothing' },
					{ label: 'Food', value: 'Food' },
					{ label: 'Other', value: 'Other' },
				],
			},
			{
				name: 'technology',
				label: 'Technology',
				type: 'select',
				options: [
					{ label: 'All', value: '' },
					{ label: 'React', value: 'React' },
					{ label: 'Vue.js', value: 'Vue.js' },
					{ label: 'Angular', value: 'Angular' },
					{ label: 'Node.js', value: 'Node.js' },
					{ label: 'Python', value: 'Python' },
					{ label: 'Java', value: 'Java' },
					{ label: 'Docker', value: 'Docker' },
					{ label: 'Kubernetes', value: 'Kubernetes' },
					{ label: 'AWS', value: 'AWS' },
					{ label: 'MongoDB', value: 'MongoDB' },
					{ label: 'PostgreSQL', value: 'PostgreSQL' },
					{ label: 'Other', value: 'Other' },
				],
			},
			{
				name: 'priceRange',
				label: 'Price Range',
				type: 'select',
				options: [
					{ label: 'All', value: '' },
					{ label: 'Under $50', value: '0-50' },
					{ label: '$50 - $100', value: '50-100' },
					{ label: '$100 - $500', value: '100-500' },
					{ label: 'Over $500', value: '500+' },
				],
			},
		],
	},

	pagination: {
		enabled: true,
		defaultPageSize: 10,
		pageSizeOptions: [5, 10, 20, 50, 100],
		showSizeChanger: true,
	},

	import: {
		enabled: true,
		allowedFormats: ['csv', 'xlsx', 'json'],
		templateUrl: '/templates/products-import-template.csv',
		mapping: {
			'Product Name': 'name',
			Category: 'category',
			Technology: 'technology',
			Price: 'price',
			Discount: 'discount',
			Description: 'description',
		},
		validation: {
			requiredFields: [
				'name',
				'category',
				'technology',
				'price',
				'description',
			],
			uniqueFields: ['name'],
		},
	},

	export: {
		enabled: true,
		formats: ['csv', 'xlsx', 'json'],
		defaultFields: [
			'id',
			'name',
			'category',
			'technology',
			'price',
			'discount',
		],
		allowCustomFields: true,
	},

	// Permissions
	permissions: {
		create: ['admin', 'manager'],
		read: ['admin', 'manager', 'employee'],
		update: ['admin', 'manager'],
		delete: ['admin'],
		bulk: ['admin', 'manager'],
	},

	// Custom components (optional overrides)
	customComponents: {
		// You can override default components here if needed
		// rowRenderer: (product, index) => <CustomProductRow product={product} index={index} />,
		// actionsRenderer: (product) => <CustomProductActions product={product} />
	},
};
