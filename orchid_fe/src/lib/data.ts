// NOTE: This is where you could wire up your own data providers:
// GraphQL, Databases, REST APIs, CDNs, proxies, S3, Matrix, IPFS, you name it…

import { API_URL, REMOTE_ASSETS_BASE_URL } from '@/app/constants';
import type { Endpoint, EndpointsToOperations, Users } from '@/types/entities';

export async function fetchData<Selected extends Endpoint>(endpoint: Selected) {
	const apiEndpoint = `${API_URL}${endpoint}`;
	// Fetch data from endpoint

	// Check if we're in build mode (static generation)
	// const isBuildMode =
	//	import.meta.env.MODE === 'production' && !import.meta.env.SSR;

	// Build mode detection disabled for debugging

	// Skip build mode for debugging - force API call
	// During build mode, directly use local data to avoid connection errors
	const isBuildModeDisabled = true;
	if (isBuildModeDisabled) {
		// Disabled for debugging
		try {
			let data;
			if (endpoint === 'products') {
				const module = await import('../../data/products.json', {
					assert: { type: 'json' },
				});
				data = module.default;
			} else if (endpoint === 'users') {
				const module = await import('../../data/users.json', {
					assert: { type: 'json' },
				});
				data = module.default;
			} else {
				throw new Error(`Unknown endpoint: ${endpoint}`);
			}

			return data;
		} catch (localError) {
			return [];
		}
	}

	// Force API call - skip build mode logic

	// Try to fetch from API first in dev mode
	try {
		const response = await fetch(apiEndpoint);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const result = (await response.json()) as {
			success: boolean;
			data: { items?: Users[]; total?: number; page?: number; limit?: number };
		};

		// Extract data from BE response structure
		const extractedData = result.data?.items || result.data || result;

		return await Promise.resolve(
			extractedData as ReturnType<EndpointsToOperations[Selected]>,
		);
	} catch (e) {
		// Fallback to local data files
		try {
			let data: unknown;
			if (endpoint === 'products') {
				const module = await import('../../data/products.json', {
					assert: { type: 'json' },
				});
				data = module.default;
			} else if (endpoint === 'users') {
				const module = await import('../../data/users.json', {
					assert: { type: 'json' },
				});
				data = module.default;
			} else {
				throw new Error(`Unknown endpoint: ${endpoint}`);
			}

			const typedData = data as Users;
			return typedData;
		} catch (localError) {
			// Return empty array as final fallback
			return [];
		}
	}
}

// NOTE: These helpers are useful for unifying paths, app-wide
export function url(path = '') {
	return `${import.meta.env.SITE}${import.meta.env.BASE_URL}${path}`;
}

// TODO: Remove old local assets from git history (to make cloning snappier).
export function asset(path: string) {
	// NOTE: Fetching remote assets from the Hugo admin dashboard Vercel dist.
	return `${REMOTE_ASSETS_BASE_URL}/${path}`;
}
