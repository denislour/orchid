import type { User } from '@/types/entities';
import type {
	EntityConfig,
	FieldConfig,
	ColumnConfig,
	ActionConfig,
} from './types';

export const usersConfig: EntityConfig<User> = {
	// Basic info
	type: 'users',
	name: 'user',
	displayName: 'User',
	pluralName: 'Users',
	route: '/users',

	// UI Configuration
	breadcrumb: [
		{ label: 'Home', path: '/dashboard' },
		{ label: 'Users', path: '/users' },
		{ label: 'List' },
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
			key: 'avatar',
			label: 'Avatar',
			type: 'avatar',
			width: '80px',
			formatter: (value) =>
				`<img src="${value}" alt="Avatar" class="w-10 h-10 rounded-full" />`,
		},
		{
			key: 'name',
			label: 'Name',
			type: 'text',
			sortable: true,
			searchable: true,
		},
		{
			key: 'email',
			label: 'Email',
			type: 'text',
			sortable: true,
			searchable: true,
		},
		{
			key: 'position',
			label: 'Position',
			type: 'text',
			sortable: true,
			searchable: true,
		},
		{
			key: 'country',
			label: 'Country',
			type: 'text',
			sortable: true,
			searchable: true,
		},
		{
			key: 'status',
			label: 'Status',
			type: 'badge',
			sortable: true,
			badgeVariant: (value) => {
				switch (value) {
					case 'active':
						return 'success';
					case 'inactive':
						return 'warning';
					case 'pending':
						return 'info';
					default:
						return 'secondary';
				}
			},
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
			label: 'Full Name',
			type: 'text',
			required: true,
			placeholder: 'Enter full name',
			validation: {
				min: 2,
				max: 100,
				message: 'Name must be between 2 and 100 characters',
			},
		},
		{
			name: 'email',
			label: 'Email Address',
			type: 'email',
			required: true,
			placeholder: 'Enter email address',
			validation: {
				pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
				message: 'Please enter a valid email address',
			},
		},
		{
			name: 'position',
			label: 'Position',
			type: 'text',
			placeholder: 'Enter job position',
		},
		{
			name: 'country',
			label: 'Country',
			type: 'select',
			options: [
				{ label: 'United States', value: 'United States' },
				{ label: 'United Kingdom', value: 'United Kingdom' },
				{ label: 'Canada', value: 'Canada' },
				{ label: 'Australia', value: 'Australia' },
				{ label: 'Germany', value: 'Germany' },
				{ label: 'France', value: 'France' },
				{ label: 'Vietnam', value: 'Vietnam' },
				{ label: 'Japan', value: 'Japan' },
			],
		},
		{
			name: 'status',
			label: 'Status',
			type: 'select',
			required: true,
			defaultValue: 'active',
			options: [
				{ label: 'Active', value: 'active' },
				{ label: 'Inactive', value: 'inactive' },
				{ label: 'Pending', value: 'pending' },
			],
		},
		{
			name: 'biography',
			label: 'Biography',
			type: 'textarea',
			placeholder: 'Enter user biography',
			validation: {
				max: 1000,
				message: 'Biography must be less than 1000 characters',
			},
		},
		{
			name: 'avatar',
			label: 'Profile Picture',
			type: 'file',
			validation: {
				message: 'Please upload a valid image file',
			},
		},
	],

	// Actions
	actions: [
		{
			type: 'create',
			label: 'Add User',
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
				title: 'Delete User',
				message:
					'Are you sure you want to delete this user? This action cannot be undone.',
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
				title: 'Delete Users',
				message:
					'Are you sure you want to delete {count} selected users? This action cannot be undone.',
				confirmText: 'Delete',
				cancelText: 'Cancel',
			},
		},
		{
			type: 'import',
			label: 'Import Users',
			icon: 'upload',
			variant: 'secondary',
		},
		{
			type: 'export',
			label: 'Export Users',
			icon: 'download',
			variant: 'secondary',
		},
	],

	// Features
	search: {
		enabled: true,
		placeholder: 'Search for users by name, email, position...',
		fields: ['name', 'email', 'position', 'country'],
		filters: [
			{
				name: 'status',
				label: 'Status',
				type: 'select',
				options: [
					{ label: 'All', value: '' },
					{ label: 'Active', value: 'active' },
					{ label: 'Inactive', value: 'inactive' },
					{ label: 'Pending', value: 'pending' },
				],
			},
			{
				name: 'country',
				label: 'Country',
				type: 'select',
				options: [
					{ label: 'All', value: '' },
					{ label: 'United States', value: 'United States' },
					{ label: 'United Kingdom', value: 'United Kingdom' },
					{ label: 'Canada', value: 'Canada' },
					{ label: 'Australia', value: 'Australia' },
					{ label: 'Germany', value: 'Germany' },
					{ label: 'France', value: 'France' },
					{ label: 'Vietnam', value: 'Vietnam' },
					{ label: 'Japan', value: 'Japan' },
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
		templateUrl: '/templates/users-import-template.csv',
		mapping: {
			Name: 'name',
			Email: 'email',
			Position: 'position',
			Country: 'country',
			Status: 'status',
			Biography: 'biography',
		},
		validation: {
			requiredFields: ['name', 'email'],
			uniqueFields: ['email'],
		},
	},

	export: {
		enabled: true,
		formats: ['csv', 'xlsx', 'json'],
		defaultFields: ['id', 'name', 'email', 'position', 'country', 'status'],
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
		// rowRenderer: (user, index) => <CustomRow user={user} index={index} />,
		// actionsRenderer: (user) => <CustomActions user={user} />
	},
};
