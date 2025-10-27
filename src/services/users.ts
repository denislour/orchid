/* eslint-disable no-param-reassign */
import { faker } from '@faker-js/faker';
import { RANDOMIZE } from '../app/constants.js';
import type { Users } from '../types/entities.js';

let usersStaticData: Users | null = null;

async function loadUsersData() {
	if (!usersStaticData) {
		try {
			const { default: data } = await import('../../data/users.json', { assert: { type: 'json' } });
			usersStaticData = data as Users;
		} catch (error) {
			console.error('Failed to load users data:', error);
			usersStaticData = [];
		}
	}
	return usersStaticData;
}

export async function getUsers(randomize = RANDOMIZE) {
	console.log('getUsers');

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
