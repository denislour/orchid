/* eslint-disable no-param-reassign */
import { faker } from '@faker-js/faker';
import { RANDOMIZE, API_URL } from '../app/constants';
import type { Users, User } from '../types/entities';

// Types for BE API response
interface UsersResponse {
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

// Fetch users from BE API
async function fetchUsersFromAPI(
	page: number = 1,
	limit: number = 100,
): Promise<Users> {
	const apiUrl = `${API_URL}users?page=${page}&limit=${limit}`;
	const response = await fetch(apiUrl);

	if (!response.ok) {
		throw new Error(
			`Failed to fetch users: ${response.status} ${response.statusText}`,
		);
	}

	const result = (await response.json()) as UsersResponse;
	return result.data.items;
}

// Legacy function to maintain compatibility with existing code
async function loadUsersData(): Promise<Users> {
	// Force API call - remove fallback for debugging
	return fetchUsersFromAPI();

	// Original fallback logic (commented out for debugging)
	// try {
	// 	// Try to fetch from API first
	// 	return await fetchUsersFromAPI();
	// } catch (error) {
	// API failed, using fallback
	// 	// Fallback to local JSON if API fails
	// 	try {
	// 		const { default: data } = await import('../../data/users.json', {
	// 			assert: { type: 'json' },
	// 		});
	// 		console.log('📁 Using local JSON data');
	// 		return data as Users;
	// 	} catch (localError) {
	// 		console.error('❌ Local JSON also failed:', localError);
	// 		return [];
	// 	}
	// }
}

export async function getUsers(randomize = RANDOMIZE): Promise<Users> {
	const data = await loadUsersData();

	const result = randomize
		? data.map((p) => {
				p.name = faker.name.fullName();
				p.email = faker.internet.email();
				p.position = faker.name.jobTitle();
				p.country = faker.address.country();
				return p;
			})
		: data;

	return result;
}

// New function to get users with pagination from BE
export async function getUsersPaginated(
	page: number = 1,
	limit: number = 10,
	randomize = RANDOMIZE,
) {
	try {
		const response = await fetch(`${API_URL}users?page=${page}&limit=${limit}`);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch users: ${response.status} ${response.statusText}`,
			);
		}

		const result = (await response.json()) as UsersResponse;

		// Apply randomization if requested
		const data = randomize
			? result.data.items.map((p) => {
					p.name = faker.name.fullName();
					p.email = faker.internet.email();
					p.position = faker.name.jobTitle();
					p.country = faker.address.country();
					return p;
				})
			: result.data.items;

		return {
			data,
			total: result.data.total,
			page: result.data.page,
			limit: result.data.limit,
		};
	} catch (error) {
		// Failed to fetch paginated users from API

		// Fallback to local data with pagination simulation
		const localData = await loadUsersData();
		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;
		const paginatedData = localData.slice(startIndex, endIndex);

		return {
			data: randomize
				? paginatedData.map((p) => ({
						...p,
						name: faker.name.fullName(),
						email: faker.internet.email(),
						position: faker.name.jobTitle(),
						country: faker.address.country(),
					}))
				: paginatedData,
			total: localData.length,
			page,
			limit,
		};
	}
}

// Function to get a single user by ID from BE
export async function getUserById(id: number): Promise<User | null> {
	try {
		const response = await fetch(`${API_URL}users/${id}`);

		if (!response.ok) {
			if (response.status === 404) {
				return null;
			}
			throw new Error(
				`Failed to fetch user: ${response.status} ${response.statusText}`,
			);
		}

		const result = (await response.json()) as { success: boolean; data: User };
		return result.data;
	} catch (error) {
		// Failed to fetch user by ID from API

		// Fallback to local data
		const localData = await loadUsersData();
		return localData.find((user) => user.id === id) || null;
	}
}

// Function to create a new user via BE API
export async function createUser(userData: Partial<User>): Promise<User> {
	const response = await fetch(`${API_URL}users`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(userData),
	});

	if (!response.ok) {
		throw new Error(
			`Failed to create user: ${response.status} ${response.statusText}`,
		);
	}

	const result = (await response.json()) as { success: boolean; data: User };
	return result.data;
}

// Function to update a user via BE API
export async function updateUser(
	id: number,
	userData: Partial<User>,
): Promise<User> {
	const response = await fetch(`${API_URL}users/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(userData),
	});

	if (!response.ok) {
		throw new Error(
			`Failed to update user: ${response.status} ${response.statusText}`,
		);
	}

	const result = (await response.json()) as { success: boolean; data: User };
	return result.data;
}

// Function to delete a user via BE API
export async function deleteUser(id: number): Promise<void> {
	const response = await fetch(`${API_URL}users/${id}`, {
		method: 'DELETE',
	});

	if (!response.ok) {
		throw new Error(
			`Failed to delete user: ${response.status} ${response.statusText}`,
		);
	}
}
