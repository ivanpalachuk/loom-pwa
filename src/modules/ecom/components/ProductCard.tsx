import { useState } from 'react';
import type { Product } from '../types';

interface ProductCardProps {
    product: Product;
    onClick: (product: Product) => void;
    onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductCard({ product, onClick, onAddToCart }: ProductCardProps) {
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation(); // Evitar que se dispare el onClick del card
        setIsAdding(true);
        
        try {
            onAddToCart(product, quantity);
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
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(price);
    };

    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock <= 10;

    return (
        <div
            onClick={() => !isOutOfStock && onClick(product)}
            className={`bg-white rounded-2xl shadow-md border-2 border-gray-100 overflow-hidden transition-all duration-300 ${
                isOutOfStock ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-xl hover:border-loom/30 cursor-pointer transform hover:scale-105'
            }`}
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

                {/* Precio */}
                <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold text-loom">
                        {formatPrice(product.price)}
                    </span>
                    <span className="text-xs text-gray-500">
                        Stock: {product.stock}
                    </span>
                </div>

                {/* Controles */}
                {!isOutOfStock && (
                    <div className="flex items-center gap-2">
                        {/* Selector de cantidad */}
                        <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                            <button
                                onClick={(e) => handleQuantityChange(e, -1)}
                                disabled={quantity <= 1}
                                className="px-3 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                            </button>
                            <input
                                type="number"
                                value={quantity}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    const val = parseInt(e.target.value);
                                    if (!isNaN(val) && val >= 1 && val <= product.stock) {
                                        setQuantity(val);
                                    }
                                }}
                                className="w-12 text-center font-semibold border-0 focus:outline-none"
                                min={1}
                                max={product.stock}
                            />
                            <button
                                onClick={(e) => handleQuantityChange(e, 1)}
                                disabled={quantity >= product.stock}
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
                            className="flex-1 relative overflow-hidden rounded-lg font-semibold transition-all group"
                        >
                            {/* Fondo con patrón */}
                            <div className="absolute inset-0 bg-loom">
                                <div 
                                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 group-hover:opacity-30 transition-opacity"
                                    style={{ 
                                        backgroundImage: "url('/patron-03.png')",
                                        backgroundSize: '200%'
                                    }}
                                />
                            </div>
                            
                            {/* Contenido del botón */}
                            <div className={`relative z-10 py-2 px-4 text-white transition-all ${
                                isAdding ? 'bg-green-500/90' : ''
                            }`}>
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
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
