/* eslint-disable no-param-reassign */

import type { Endpoint } from '@/types/entities';
import { fetchData } from '@/lib/data';
import { endpointsToOperations } from '@/pages/api/[...entity]';

export class CrudEntities extends HTMLElement {
	#body = this.querySelector('tbody')!;

	#rows = this.#body.querySelectorAll('tr');

	#refreshButton = this.querySelector('[data-refresh]');

	type: Endpoint | undefined;

	constructor() {
		super();
		const type = this.getAttribute('type');

		if (
			Object.keys(endpointsToOperations).find((endpoint) => endpoint === type)
		)
			this.type = type as Endpoint;
		else throw Error('Wrong CRUD type!');

		this.#refreshButton?.addEventListener('click', () => {
			this.update().catch(() => undefined);
		});
	}

	/**
	 * Fetch new content from API and update DOM text accordingly
	 */
	async update() {
		if (!this.type) return;

		const newData = await fetchData(this.type);

		this.#rows.forEach((row, index) => {
			const rowData = newData[index];
			if (!rowData) return;

			row.querySelectorAll('data').forEach((binding) => {
				const valKey = binding.value;
				if (!(valKey in rowData)) return;

				binding.innerText =
					(rowData as Record<string, unknown>)[valKey]?.toString() || '';
			});
		});

		// New data received!
	}
}

export const tagName = 'entities-crud';
declare global {
	interface HTMLElementTagNameMap {
		[tagName]: CrudEntities;
	}
}
customElements.define(tagName, CrudEntities);
