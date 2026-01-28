import { useState } from 'react';
import type { Product, ProductPresentation } from '../types';

interface ProductCardProps {
    product: Product;
    onClick: (product: Product) => void;
    onAddToCart: (product: Product, quantity: number, presentation?: ProductPresentation) => void;
}

export function ProductCard({ product, onClick, onAddToCart }: ProductCardProps) {
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedPresentation, setSelectedPresentation] = useState<ProductPresentation | undefined>(
        product.presentations?.[0]
    );
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation(); // Evitar que se dispare el onClick del card
        setIsAdding(true);
        
        try {
            onAddToCart(product, quantity, selectedPresentation);
            setQuantity(1); // Reset cantidad
            
            // Feedback visual
            setTimeout(() => setIsAdding(false), 1000);
        } catch (error) {
            setIsAdding(false);
            alert((error as Error).message);
        }
    };

    const handleQuantityChange = (e: React.MouseEvent, delta: number) => {
        e.stopPropagation();
        const currentStock = selectedPresentation?.stock || product.stock;
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= currentStock) {
            setQuantity(newQuantity);
        }
    };

    const handlePresentationChange = (presentation: ProductPresentation) => {
        setSelectedPresentation(presentation);
        setQuantity(1); // Reset cantidad cuando cambia presentación
        setIsDropdownOpen(false);
    };

    const toggleDropdown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDropdownOpen(!isDropdownOpen);
    };

    const formatPrice = (price: number) => {
        // Si el precio es menor a 1000, es USD (H2oControl), sino es ARS (Loom)
        if (price < 1000) {
            return `USD ${price.toFixed(2)} / Litro`;
        }
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(price);
    };

    const currentPrice = selectedPresentation?.pricePerLiter || product.price;
    const currentStock = selectedPresentation?.stock || product.stock;
    const isOutOfStock = currentStock === 0;
    const isLowStock = currentStock > 0 && currentStock <= 10;

    return (
        <div
            onClick={() => !isOutOfStock && onClick(product)}
            className={`bg-white rounded-2xl shadow-md border-2 border-gray-100 overflow-hidden transition-all duration-300 ${
                isOutOfStock ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-xl hover:border-loom/30 cursor-pointer transform hover:scale-105'
            }`}
            style={product.color ? { borderLeftWidth: '6px', borderLeftColor: product.color } : {}}
        >
            {/* Imagen */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // Placeholder si falla la imagen
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3Cg transform="translate(200 200)"%3E%3Ccircle fill="%23004EA8" r="80"/%3E%3Cpath fill="white" d="M-30-20 L30-20 L30 0 L15 0 L15 40 L-15 40 L-15 0 L-30 0 Z"/%3E%3Crect fill="white" x="-35" y="-35" width="20" height="15" rx="2"/%3E%3Crect fill="white" x="15" y="-35" width="20" height="15" rx="2"/%3E%3C/g%3E%3Ctext x="200" y="320" text-anchor="middle" fill="%23004EA8" font-size="18" font-family="Arial" font-weight="bold"%3EProducto Loom%3C/text%3E%3C/svg%3E';
                    }}
                />
                
                {/* Badge de stock */}
                {isOutOfStock && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Sin stock
                    </div>
                )}
                {isLowStock && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Últimas unidades
                    </div>
                )}

                {/* Badge de categoría */}
                <div className="absolute bottom-2 left-2 bg-loom/90 text-white px-3 py-1 rounded-full text-xs font-semibold capitalize">
                    {product.category}
                </div>

                {/* Badge de marca */}
                {product.brand && (
                    <div className="absolute top-2 left-2 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-bold">
                        {product.brand}
                    </div>
                )}
            </div>

            {/* Contenido */}
            <div className="p-4">
                {/* Nombre */}
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
                    {product.name}
                </h3>

                {/* Descripción corta */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">
                    {product.shortDescription || product.description}
                </p>

                {/* Selector de presentación personalizado (si hay múltiples) */}
                {product.presentations && product.presentations.length > 1 && (
                    <div className="mb-3 relative" onClick={(e) => e.stopPropagation()}>
                        <label className="text-xs text-gray-600 mb-1 block font-medium">Presentación:</label>
                        
                        {/* Botón selector */}
                        <button
                            type="button"
                            onClick={toggleDropdown}
                            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-semibold bg-white hover:border-loom/50 focus:border-loom focus:outline-none transition-colors flex items-center justify-between group"
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-loom" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <span className="text-gray-800">
                                    {selectedPresentation?.size || product.presentations[0].size}
                                </span>
                                <span className="text-loom font-bold">
                                    USD {(selectedPresentation?.pricePerLiter || product.presentations[0].pricePerLiter).toFixed(2)}/L
                                </span>
                            </span>
                            <svg
                                className={`w-5 h-5 text-gray-500 group-hover:text-loom transition-all duration-200 ${
                                    isDropdownOpen ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown menu */}
                        {isDropdownOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                {product.presentations.map((pres) => (
                                    <button
                                        key={pres.size}
                                        type="button"
                                        onClick={() => handlePresentationChange(pres)}
                                        className={`w-full px-4 py-3 text-left hover:bg-loom/5 transition-colors border-b border-gray-100 last:border-b-0 ${
                                            selectedPresentation?.size === pres.size ? 'bg-loom/10' : ''
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {selectedPresentation?.size === pres.size && (
                                                    <svg className="w-4 h-4 text-loom" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                                <span className="text-sm font-semibold text-gray-800">{pres.size}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm font-bold text-loom">
                                                    USD {pres.pricePerLiter.toFixed(2)}/L
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    Stock: {pres.stock}
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Precio */}
                <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold text-loom">
                        {formatPrice(currentPrice)}
                    </span>
                    <span className="text-xs text-gray-500">
                        Stock: {currentStock}
                    </span>
                </div>

                {/* Controles */}
                {!isOutOfStock && (
                    <div className="flex items-center gap-2">
                        {/* Selector de cantidad */}
                        <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                            <button
                                onClick={(e) => handleQuantityChange(e, -1)}
                                disabled={quantity <= 1}
                                className="px-3 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                            </button>
                            <span className="px-4 py-2 font-bold text-base min-w-[45px] text-center">
                                {quantity}
                            </span>
                            <button
                                onClick={(e) => handleQuantityChange(e, 1)}
                                disabled={quantity >= currentStock}
                                className="px-3 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>

                        {/* Botón agregar */}
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            className={`flex-1 rounded-lg font-semibold py-3 px-4 text-white transition-all ${
                                isAdding ? 'bg-green-500' : 'bg-loom hover:bg-loom-70'
                            }`}
                        >
                            {isAdding ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Agregado
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Agregar
                                </span>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
