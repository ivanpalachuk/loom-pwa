import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import type { Product, ProductFilters, ProductCategory } from '../types';

interface ProductGridProps {
    products: Product[];
    isLoading: boolean;
    onProductClick: (product: Product) => void;
    onAddToCart: (product: Product, quantity: number) => void;
    onFiltersChange?: (filters: ProductFilters) => void;
}

const CATEGORIES: { value: ProductCategory; label: string }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'agua', label: 'Agua' },
    { value: 'antigranizo', label: 'Antigranizo' },
    { value: 'cortaviento', label: 'Cortaviento' },
    { value: 'proteccion', label: 'Protección' },
    { value: 'fertilizantes', label: 'Fertilizantes' },
    { value: 'equipos', label: 'Equipos' }
];

export function ProductGrid({ 
    products, 
    isLoading, 
    onProductClick, 
    onAddToCart,
    onFiltersChange 
}: ProductGridProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('todos');
    const [showFilters, setShowFilters] = useState(false);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Notify parent of filter changes
    useEffect(() => {
        if (onFiltersChange) {
            onFiltersChange({
                searchQuery: debouncedSearchQuery.trim() || undefined,
                category: selectedCategory !== 'todos' ? selectedCategory : undefined
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchQuery, selectedCategory]);

    const handleCategoryChange = (category: ProductCategory) => {
        setSelectedCategory(category);
    };

    return (
        <div className="space-y-6">
            {/* Búsqueda */}
            <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-full px-5 py-4 pl-12 pr-12 rounded-2xl border-2 border-gray-200 focus:border-loom focus:outline-none text-base shadow-sm transition-all"
                />
                <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Filtros de categoría */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-gray-100">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                        Categorías
                    </h3>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="lg:hidden text-loom flex items-center"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                    </button>
                </div>
                
                <div className={`flex flex-wrap gap-2 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => handleCategoryChange(cat.value)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                selectedCategory === cat.value
                                    ? 'bg-loom text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Resultados */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-loom-10 rounded-full" />
                        <div className="absolute inset-0 border-4 border-loom border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="mt-4 text-gray-600">Cargando productos...</p>
                </div>
            ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No se encontraron productos</h3>
                    <p className="text-gray-500">Intenta con otra búsqueda o filtro</p>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            {products.length} {products.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                        </p>
                    </div>

                    {/* Grid de productos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={onProductClick}
                                onAddToCart={onAddToCart}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
