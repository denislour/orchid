/* eslint-disable no-param-reassign */
import { faker } from '@faker-js/faker';
import { RANDOMIZE } from '../app/constants.js';
import type { Products } from '../types/entities.js';

let productsStaticData: Products | null = null;

async function loadProductsData() {
	if (!productsStaticData) {
		try {
			const { default: data } = await import('../../data/products.json', {
				assert: { type: 'json' },
			});
			productsStaticData = data as Products;
		} catch (error) {
			console.error('Failed to load products data:', error);
			productsStaticData = [];
		}
	}
	return productsStaticData;
}

export async function getProducts(randomize = RANDOMIZE) {
	console.log('getProducts');

	const data = await loadProductsData();

	const result = randomize
		? data.map((p) => {
				p.price = faker.commerce.price();
				p.technology = faker.commerce.productName();
				p.description = faker.commerce.productDescription();
				return p;
			})
		: data;

	return result;
}
