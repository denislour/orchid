// API endpoint types to avoid circular dependency

import type { Products, Users } from './entities';

export type Endpoint = 'products' | 'users';

export type EndpointsToOperations = {
	products: () => Promise<Products>;
	users: () => Promise<Users>;
};
