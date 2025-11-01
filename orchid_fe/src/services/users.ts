import { faker } from '@faker-js/faker';
import { RANDOMIZE, API_URL } from '../app/constants';
import type { Users, User } from '../types/entities';

interface StandardApiResponse<T> {
	success: boolean;
	message: string;
	data: T;
}

interface PaginatedApiResponse {
	success: boolean;
	message: string;
	data: {
		items: Users;
		total: number;
		page: number;
		limit: number;
		total_pages: number;
	};
}

type ApiResponse =
	| StandardApiResponse<Users>
	| PaginatedApiResponse
	| Users
	| User;

function extractUsers(result: ApiResponse): Users {
	if (
		'data' in result &&
		typeof result.data === 'object' &&
		result.data !== null &&
		'items' in result.data &&
		Array.isArray(result.data.items)
	) {
		return result.data.items;
	}
	if ('data' in result && Array.isArray(result.data)) {
		return result.data;
	}
	if (Array.isArray(result)) {
		return result;
	}
	throw new Error('Invalid API response format - expected user array');
}

function extractPaginationData(
	result: ApiResponse,
	fallbackPage: number,
	fallbackLimit: number,
) {
	if (
		'data' in result &&
		typeof result.data === 'object' &&
		result.data !== null &&
		'items' in result.data
	) {
		const paginatedData = result.data as {
			items: Users;
			total: number;
			page: number;
			limit: number;
		};
		return {
			total: paginatedData.total || 0,
			page: paginatedData.page || fallbackPage,
			limit: paginatedData.limit || fallbackLimit,
		};
	}
	return {
		total: 0,
		page: fallbackPage,
		limit: fallbackLimit,
	};
}

function randomizeUserData(users: Users): Users {
	return users.map((p) => ({
		...p,
		name: faker.name.fullName(),
		email: faker.internet.email(),
		position: faker.name.jobTitle(),
		country: faker.address.country(),
	}));
}

async function fetchFromAPI(url: string): Promise<ApiResponse> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`API Error: ${response.status} ${response.statusText}`);
	}
	return response.json() as unknown as ApiResponse;
}

async function fetchFromAPIWithBody(
	url: string,
	options: RequestInit,
): Promise<ApiResponse> {
	const response = await fetch(url, {
		headers: { 'Content-Type': 'application/json' },
		...options,
	});
	if (!response.ok) {
		throw new Error(`API Error: ${response.status} ${response.statusText}`);
	}
	return response.json() as unknown as ApiResponse;
}

export async function getUsers(randomize = RANDOMIZE): Promise<Users> {
	const url = `${API_URL}users?page=1&limit=100`;
	const result = await fetchFromAPI(url);
	const users = extractUsers(result);
	return randomize ? randomizeUserData(users) : users;
}

export async function getUsersPaginated(
	page: number = 1,
	limit: number = 10,
	randomize = RANDOMIZE,
) {
	const url = `${API_URL}users?page=${page}&limit=${limit}`;
	const result = await fetchFromAPI(url);
	const users = extractUsers(result);
	const pagination = extractPaginationData(result, page, limit);

	return {
		data: randomize ? randomizeUserData(users) : users,
		...pagination,
	};
}

export async function getUserById(id: number): Promise<User | null> {
	try {
		const result = await fetchFromAPI(`${API_URL}users/${id}`);

		if (
			'data' in result &&
			typeof result.data === 'object' &&
			result.data !== null &&
			!('items' in result.data)
		) {
			return result.data as unknown as User;
		}
		if ('id' in result) {
			return result;
		}

		throw new Error('Invalid user response format');
	} catch (error) {
		if (error instanceof Error && error.message.includes('404')) {
			return null;
		}
		throw error;
	}
}

export async function createUser(userData: Partial<User>): Promise<User> {
	const result = await fetchFromAPIWithBody(`${API_URL}users`, {
		method: 'POST',
		body: JSON.stringify(userData),
	});

	if (
		'data' in result &&
		typeof result.data === 'object' &&
		result.data !== null &&
		!('items' in result.data)
	) {
		return result.data as unknown as User;
	}
	throw new Error('Invalid create user response format');
}

export async function updateUser(
	id: number,
	userData: Partial<User>,
): Promise<User> {
	const result = await fetchFromAPIWithBody(`${API_URL}users/${id}`, {
		method: 'PUT',
		body: JSON.stringify(userData),
	});

	if (
		'data' in result &&
		typeof result.data === 'object' &&
		result.data !== null &&
		!('items' in result.data)
	) {
		return result.data as unknown as User;
	}
	throw new Error('Invalid update user response format');
}

export async function deleteUser(id: number): Promise<void> {
	await fetchFromAPIWithBody(`${API_URL}users/${id}`, {
		method: 'DELETE',
	});
}
