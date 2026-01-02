// Configuración de la API
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Endpoints de la API
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_URL}/api/auth/login`,
  REGISTER: `${API_URL}/api/auth/register`,
  PROFILE: `${API_URL}/api/auth/profile`,
  
  // Products
  PRODUCTS: `${API_URL}/api/products`,
  PRODUCT_BY_ID: (id: string) => `${API_URL}/api/products/${id}`,
  TOGGLE_PRODUCT_VISIBILITY: (id: string) => `${API_URL}/api/products/${id}/toggle-visibility`,
  
  // Users
  USERS: `${API_URL}/api/users`,
  USER_BY_ID: (id: string) => `${API_URL}/api/users/${id}`,
};
