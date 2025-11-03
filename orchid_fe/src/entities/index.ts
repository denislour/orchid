export * from './types';
export * from './users.config';
export * from './products.config';

// Entity registry for dynamic entity loading
export const entityRegistry = {
  users: () => import('./users.config').then(m => m.usersConfig),
  products: () => import('./products.config').then(m => m.productsConfig),
};

// Helper function to get entity config by type
export async function getEntityConfig(type: keyof typeof entityRegistry) {
  return await entityRegistry[type]();
}

// Get all available entity types
export function getAvailableEntityTypes() {
  return Object.keys(entityRegistry) as Array<keyof typeof entityRegistry>;
}
