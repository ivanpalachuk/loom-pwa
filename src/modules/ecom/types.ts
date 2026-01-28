// E-Commerce Module Types

export interface ProductPresentation {
    size: string; // e.g., '1Lt', '5Lts', '10Lts', '20Lts'
    pricePerLiter: number;
    stock: number;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    shortDescription?: string;
    imageUrl: string;
    price: number; // precio base (presentación más común)
    presentations?: ProductPresentation[]; // múltiples presentaciones
    category: string;
    stock: number;
    sku?: string;
    brand?: string;
    color?: string; // color para el diseño visual
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

export type ProductCategory = 'antigranizo' | 'cortaviento' | 'proteccion' | 'agua' | 'fertilizantes' | 'equipos' | 'coadyuvantes' | 'correctores' | 'bactericidas' | 'limpiadores' | 'todos';

export interface ProductFilters {
    category?: ProductCategory;
    minPrice?: number;
    maxPrice?: number;
    searchQuery?: string;
}
