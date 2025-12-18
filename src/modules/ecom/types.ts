// E-Commerce Module Types

export interface Product {
    id: string;
    name: string;
    description: string;
    shortDescription?: string;
    imageUrl: string;
    price: number;
    category: string;
    stock: number;
    sku?: string;
    waterCorrection?: {
        parameter: 'ph' | 'alkalinity' | 'hardness' | 'all';
        action: 'increase' | 'decrease' | 'balance';
    };
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Cart {
    items: CartItem[];
    total: number;
}

export type ProductCategory = 'antigranizo' | 'cortaviento' | 'proteccion' | 'agua' | 'fertilizantes' | 'equipos' | 'todos';

export interface ProductFilters {
    category?: ProductCategory;
    minPrice?: number;
    maxPrice?: number;
    searchQuery?: string;
}
