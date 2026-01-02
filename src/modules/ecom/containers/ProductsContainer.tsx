import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/ui';
import { ProductGrid } from '../components';
import type { Product, ProductFilters } from '../types';
import { getProducts, addToCart, getCartItemCount } from '../services';

export function ProductsContainer() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<ProductFilters>({});
    const [cartCount, setCartCount] = useState(0);

    const loadProducts = useCallback(async () => {
        setIsLoading(true);
        const results = await getProducts(filters);
        setProducts(results);
        setIsLoading(false);
    }, [filters]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    useEffect(() => {
        // Actualizar contador del carrito al montar
        setCartCount(getCartItemCount());
    }, []);

    const handleFiltersChange = (newFilters: ProductFilters) => {
        setFilters(newFilters);
    };

    const handleProductClick = (product: Product) => {
        navigate(`/ecom/product/${product.id}`);
    };

    const handleAddToCart = (product: Product, quantity: number) => {
        addToCart(product, quantity);
        setCartCount(getCartItemCount());
    };

    return (
        <div className="flex flex-col bg-gray-50" style={{ height: '100dvh' }}>
            {/* Header fijo con patrón Loom */}
            <PageHeader 
                title="Tienda" 
                onBack={() => navigate('/home')}
                transparent={true}
                withPattern={true}
                action={
                    <button
                        onClick={() => navigate('/ecom/cart')}
                        className="relative p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center shadow-lg">
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                    </button>
                }
            />
            
            {/* Contenido scrolleable */}
            <div className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-4 py-8">
                <ProductGrid
                    products={products}
                    isLoading={isLoading}
                    onProductClick={handleProductClick}
                    onAddToCart={handleAddToCart}
                    onFiltersChange={handleFiltersChange}
                />
                </div>
            </div>
        </div>
    );
}
