import type { APIRoute } from 'astro';
import * as operations from '../../services/index';

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
	const operationName = parseTypeParam(params.entity);

	if (!operationName) return new Response('404', { status: 404 });

	const data = await endpointsToOperations[operationName]();

	return new Response(JSON.stringify(data), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};

/* Additional HTTP method handlers */

export const post: APIRoute = async ({ params, request }) => {
	const operationName = parseTypeParam(params.entity);

	if (!operationName) return new Response('404', { status: 404 });

	try {
		await request.json();
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
	const operationName = parseTypeParam(params.entity);

	if (!operationName) return new Response('404', { status: 404 });

	try {
		// In a real application, you would update the data here
		// For now, we'll just return the current data
		await request.json();
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

export const del: APIRoute = ({ params }) => {
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
