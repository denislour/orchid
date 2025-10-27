// NOTE: This is where you could wire up your own data providers:
// GraphQL, Databases, REST APIs, CDNs, proxies, S3, Matrix, IPFS, you name it…

import { API_URL, REMOTE_ASSETS_BASE_URL } from '../app/constants.js';
import type { Endpoint, EndpointsToOperations } from '../types/entities.js';

export async function fetchData<Selected extends Endpoint>(endpoint: Selected) {
	const apiEndpoint = `${API_URL}${endpoint}`;

	console.info(`Fetching ${apiEndpoint}…`);

	// Check if we're in build mode (static generation)
	const isBuildMode =
		import.meta.env.MODE === 'production' && !import.meta.env.SSR;

	// During build mode, directly use local data to avoid connection errors
	if (isBuildMode) {
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
			console.info(`Using local data for ${endpoint} (build mode)`);
			return data;
		} catch (localError) {
			console.error(`Could not load local data for ${endpoint}:`, localError);
			return [];
		}
	}

	// Try to fetch from API first in dev mode
	try {
		const response = await fetch(apiEndpoint);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return (await response.json()) as unknown as Promise<
			ReturnType<EndpointsToOperations[Selected]>
		>;
	} catch (e) {
		console.error(`API fetch failed for ${endpoint}:`, e);

		// Fallback to local data files
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
			console.info(`Using local data for ${endpoint} (fallback)`);
			return data;
		} catch (localError) {
			console.error(`Could not load local data for ${endpoint}:`, localError);
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
