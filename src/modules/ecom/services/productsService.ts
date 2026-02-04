import type { Product, ProductFilters } from '../types';
import { productsAPI, type Product as APIProduct } from '../../../services/api';

// Map backend product to PWA product format
function mapAPIProduct(apiProduct: APIProduct): Product {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    description: apiProduct.description || '',
    shortDescription: apiProduct.description?.substring(0, 100) || '',
    imageUrl: apiProduct.imageUrl || '/loom_products.png',
    price: apiProduct.basePrice / 100, // Convert cents to dollars
    category: apiProduct.category,
    stock: apiProduct.stock,
    sku: apiProduct.id,
    brand: 'Loom',
    color: '#004EA8',
  };
}

/**
 * Obtiene productos desde el backend
 */
export const getProducts = async (filters?: ProductFilters): Promise<Product[]> => {
  try {
    const searchQuery = filters?.searchQuery || '';
    const category = filters?.category === 'todos' ? '' : filters?.category || '';
    
    const response = await productsAPI.getAll(1, 100, searchQuery, category);
    let products = response.products.map(mapAPIProduct);

    // Apply price filters if needed
    if (filters) {
      if (filters.minPrice !== undefined) {
        products = products.filter(p => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        products = products.filter(p => p.price <= filters.maxPrice!);
      }
    }

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to empty array on error
    return [];
  }
};

/**
 * Obtiene un producto por ID
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const apiProduct = await productsAPI.getById(id);
    return mapAPIProduct(apiProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

/**
 * Obtiene todas las categorías disponibles
 */
export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await productsAPI.getAll(1, 100);
    const categories = [...new Set(response.products.map(p => p.category))];
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

/**
 * Obtiene productos de H2oControl Agro (filtrado por backend)
 */
export const getH2oControlProducts = async (): Promise<Product[]> => {
  // El backend no tiene el concepto de "brand" actualmente
  // Retornamos todos los productos por ahora
  return getProducts();
};

/**
 * Obtiene productos por marca (no implementado en backend aún)
 */
export const getProductsByBrand = async (brand: string): Promise<Product[]> => {
  // El backend no tiene filtro por marca aún
  // Retornamos todos y filtramos en frontend
  const allProducts = await getProducts();
  return allProducts.filter(p => p.brand === brand);
};
