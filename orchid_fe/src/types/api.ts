// API endpoint types to avoid circular dependency

export type Endpoint = 'products' | 'users';

export type EndpointsToOperations = {
  products: () => Promise<any[]>;
  users: () => Promise<any[]>;
};
