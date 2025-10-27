import type { APIRoute } from 'astro';
import * as operations from '../../services/index.js';

/* Map REST API endpoints to internal operations
  (GETs only for illustration purpose) */
export const endpointsToOperations = {
	products: operations.getProducts,
	users: operations.getUsers,
};

function parseTypeParam(endpoint: string | undefined) {
	if (!endpoint || !(endpoint in endpointsToOperations)) return undefined;
	return endpoint as keyof typeof endpointsToOperations;
}

/* Controllers */

export const get: APIRoute = async ({ params /* , request */ }) => {
	console.log('Hit!', params.entity);

	const operationName = parseTypeParam(params.entity);

	if (!operationName) return new Response('404', { status: 404 });

	const body = await endpointsToOperations[operationName]();

	return new Response(JSON.stringify(body), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};

/* Additional HTTP method handlers */

export const post: APIRoute = async ({ params, request }) => {
	console.log('POST Hit!', params.entity);

	const operationName = parseTypeParam(params.entity);

	if (!operationName) return new Response('404', { status: 404 });

	try {
		const body = await request.json();
		// In a real application, you would process the POST data here
		// For now, we'll just return the current data
		const data = await endpointsToOperations[operationName]();

		return new Response(JSON.stringify({ success: true, data }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
			status: 400,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
};

export const put: APIRoute = async ({ params, request }) => {
	console.log('PUT Hit!', params.entity);

	const operationName = parseTypeParam(params.entity);

	if (!operationName) return new Response('404', { status: 404 });

	try {
		const body = await request.json();
		// In a real application, you would update the data here
		// For now, we'll just return the current data
		const data = await endpointsToOperations[operationName]();

		return new Response(JSON.stringify({ success: true, data }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
			status: 400,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
};

export const del: APIRoute = async ({ params }) => {
	console.log('DELETE Hit!', params.entity);

	const operationName = parseTypeParam(params.entity);

	if (!operationName) return new Response('404', { status: 404 });

	// In a real application, you would delete the resource here
	// For now, we'll just return a success message
	return new Response(
		JSON.stringify({ success: true, message: 'Resource deleted' }),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		},
	);
};

/* Astro's static build helper, can be removed for SSR mode */
export function getStaticPaths() {
	return Object.keys(endpointsToOperations).map((endpoint) => ({
		params: { entity: endpoint },
	}));
}
