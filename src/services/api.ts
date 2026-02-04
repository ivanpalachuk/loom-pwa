const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: 'admin' | 'user';
  personalDiscount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  basePrice: number; // in cents
  stock: number;
  unit: string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PriceListItem {
  productId: string;
  product: Product;
  pricing: {
    originalPrice: number;
    priceAfterListDiscount: number;
    finalPrice: number;
    listDiscount: number;
    personalDiscount: number;
    totalSavings: number;
    formatted: string;
  };
}

export interface ActivePriceList {
  priceList: {
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
  };
  items: PriceListItem[];
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  me: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to get user');
    return response.json();
  },

  refresh: async (refreshToken: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) throw new Error('Failed to refresh token');
    return response.json();
  },

  logout: async (refreshToken: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) throw new Error('Logout failed');
    return response.json();
  },
};

// Products API (public endpoints)
export const productsAPI = {
  getAll: async (page = 1, limit = 100, search = '', category = '') => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    
    const response = await fetch(`${API_BASE_URL}/products?${params}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },
};

// Price Lists API (requires auth)
export const priceListsAPI = {
  getActive: async (token: string): Promise<ActivePriceList> => {
    const response = await fetch(`${API_BASE_URL}/price-lists/active`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch active price list');
    return response.json();
  },
};

// Helper to convert cents to CLP for display
export const formatPrice = (cents: number): string => {
  const clp = cents / 100;
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(clp);
};

// Backward compatibility - keep old Photo API for other features
export interface Photo {
  id: string;
  url: string;
  userId: string;
  createdAt: string;
}

export const api = {
  // Fotos (mock - mantener para compatibilidad)
  getPhotos: async (userId: string): Promise<Photo[]> => {
    // Mock implementation
    return [];
  },

  uploadPhoto: async (imageData: string, userId: string): Promise<Photo> => {
    // Mock implementation
    return {
      id: Math.random().toString(36),
      url: imageData,
      userId,
      createdAt: new Date().toISOString(),
    };
  },

  deletePhoto: async (photoId: string): Promise<void> => {
    // Mock implementation
  },
};
