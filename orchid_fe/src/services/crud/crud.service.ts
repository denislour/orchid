import type { Endpoint } from '@/types/api';
import type { EntityConfig, BaseEntity } from '@/entities/types';

export class CrudService<T extends BaseEntity = BaseEntity> {
	private config: EntityConfig<T>;
	private entityType: Endpoint;

	constructor(config: EntityConfig<T>) {
		this.config = config;
		this.entityType = config.type;
	}

	async list(params?: {
		page?: number;
		limit?: number;
		sortBy?: string;
		sortDirection?: 'asc' | 'desc';
		search?: string;
		filters?: Record<string, unknown>;
	}): Promise<{ data: T[]; total: number; page: number; limit: number }> {
		const {
			page = 1,
			limit = this.config.pagination.defaultPageSize,
			sortBy = this.config.defaultSort?.field,
			sortDirection = this.config.defaultSort?.direction,
			search,
			filters,
		} = params || {};

		const queryParams = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
		});

		if (sortBy) {
			queryParams.append('sort', sortBy);
			queryParams.append('order', sortDirection || 'asc');
		}

		if (search && this.config.search.enabled) {
			queryParams.append('search', search);
		}

		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== '' && value !== null && value !== undefined) {
					queryParams.append(key, String(value));
				}
			});
		}

		const url = `/api/${this.entityType}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch ${this.config.pluralName.toLowerCase()}: ${response.statusText}`,
			);
		}

		const result = (await response.json()) as any;

		if (
			result &&
			typeof result === 'object' &&
			'data' in result &&
			Array.isArray(result.data)
		) {
			return {
				data: result.data as T[],
				total: result.total || result.data.length,
				page: result.page || page,
				limit: result.limit || limit,
			};
		}

		const data = Array.isArray(result) ? result : [];
		return {
			data: data as T[],
			total: data.length,
			page,
			limit,
		};
	}

	async create(data: Partial<T>): Promise<T> {
		const response = await fetch(`/api/${this.entityType}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error(
				`Failed to create ${this.config.name.toLowerCase()}: ${response.statusText}`,
			);
		}

		return response.json() as Promise<T>;
	}

	async update(id: string | number, data: Partial<T>): Promise<T> {
		const response = await fetch(`/api/${this.entityType}/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error(
				`Failed to update ${this.config.name.toLowerCase()}: ${response.statusText}`,
			);
		}

		return response.json() as Promise<T>;
	}

	async delete(id: string | number): Promise<void> {
		const response = await fetch(`/api/${this.entityType}/${id}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			throw new Error(
				`Failed to delete ${this.config.name.toLowerCase()}: ${response.statusText}`,
			);
		}
	}

	async bulkDelete(ids: (string | number)[]): Promise<void> {
		const response = await fetch(`/api/${this.entityType}/bulk`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ ids }),
		});

		if (!response.ok) {
			throw new Error(
				`Failed to bulk delete ${this.config.pluralName.toLowerCase()}: ${response.statusText}`,
			);
		}
	}

	async bulkUpdate(ids: (string | number)[], data: Partial<T>): Promise<T[]> {
		const response = await fetch(`/api/${this.entityType}/bulk`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ ids, data }),
		});

		if (!response.ok) {
			throw new Error(
				`Failed to bulk update ${this.config.pluralName.toLowerCase()}: ${response.statusText}`,
			);
		}

		return response.json() as Promise<T[]>;
	}

	async import(
		file: File,
		mapping?: Record<string, string>,
	): Promise<{
		successful: number;
		errors: Array<{ row: number; message: string }>;
	}> {
		const formData = new FormData();
		formData.append('file', file);
		if (mapping) {
			formData.append('mapping', JSON.stringify(mapping));
		}

		const response = await fetch(`/api/${this.entityType}/import`, {
			method: 'POST',
			body: formData,
		});

		if (!response.ok) {
			throw new Error(
				`Failed to import ${this.config.pluralName.toLowerCase()}: ${response.statusText}`,
			);
		}

		return response.json() as Promise<{
			successful: number;
			errors: Array<{ row: number; message: string }>;
		}>;
	}

	async export(
		format: 'csv' | 'xlsx' | 'json',
		fields?: string[],
		filters?: Record<string, unknown>,
	): Promise<Blob> {
		const queryParams = new URLSearchParams({
			format,
		});

		if (fields && fields.length > 0) {
			queryParams.append('fields', fields.join(','));
		}

		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== '' && value !== null && value !== undefined) {
					queryParams.append(key, String(value));
				}
			});
		}

		const response = await fetch(
			`/api/${this.entityType}/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
		);

		if (!response.ok) {
			throw new Error(
				`Failed to export ${this.config.pluralName.toLowerCase()}: ${response.statusText}`,
			);
		}

		return response.blob();
	}

	async getById(id: string | number): Promise<T | null> {
		const response = await fetch(`/api/${this.entityType}/${id}`);

		if (response.status === 404) {
			return null;
		}

		if (!response.ok) {
			throw new Error(
				`Failed to fetch ${this.config.name.toLowerCase()}: ${response.statusText}`,
			);
		}

		return response.json() as Promise<T>;
	}
}

export function createCrudService<T extends BaseEntity>(
	config: EntityConfig<T>,
): CrudService<T> {
	return new CrudService<T>(config);
}
