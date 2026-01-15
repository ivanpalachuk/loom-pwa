import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader, LoadingSpinner } from '../components/ui';
import type { Product } from '../modules/ecom/types';
import { getProductById, addToCart } from '../modules/ecom/services';

export function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const loadProduct = async () => {
            if (!id) {
                navigate('/ecom');
                return;
            }

            const result = await getProductById(id);
            if (result) {
                setProduct(result);
            } else {
                navigate('/ecom');
            }
            setIsLoading(false);
        };

        loadProduct();
    }, [id, navigate]);

    const handleAddToCart = () => {
        if (!product) return;
        
        setIsAdding(true);
        try {
            addToCart(product, quantity);
            
            // Feedback visual
            setTimeout(() => {
                setIsAdding(false);
                setQuantity(1);
            }, 1000);
        } catch (error) {
            setIsAdding(false);
            alert((error as Error).message);
        }
    };

    const handleQuantityChange = (delta: number) => {
        if (!product) return;
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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <PageHeader 
                    title="Detalle del Producto" 
                    onBack={() => navigate('/ecom')}
                />
                <div className="container mx-auto px-4 py-8">
                    <LoadingSpinner title="Cargando producto" subtitle="Obteniendo detalles" />
                </div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock <= 10;

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader title="Detalle del Producto" onBack={() => navigate('/ecom')} />
            
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Imagen */}
                        <div className="relative bg-gray-100 min-h-[400px] md:min-h-[600px] flex items-center justify-center p-8">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="max-w-full max-h-full object-contain"
                                onError={(e) => {
                                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"%3E%3Crect fill="%23f3f4f6" width="600" height="600"/%3E%3Cg transform="translate(300 300)"%3E%3Ccircle fill="%23004EA8" r="120"/%3E%3Cpath fill="white" d="M-45-30 L45-30 L45 0 L22.5 0 L22.5 60 L-22.5 60 L-22.5 0 L-45 0 Z"/%3E%3Crect fill="white" x="-52.5" y="-52.5" width="30" height="22.5" rx="3"/%3E%3Crect fill="white" x="22.5" y="-52.5" width="30" height="22.5" rx="3"/%3E%3C/g%3E%3Ctext x="300" y="480" text-anchor="middle" fill="%23004EA8" font-size="24" font-family="Arial" font-weight="bold"%3EProducto Loom%3C/text%3E%3C/svg%3E';
                                }}
                            />
                            
                            {/* Badges */}
                            {isOutOfStock && (
                                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                    Sin stock
                                </div>
                            )}
                            {isLowStock && (
                                <div className="absolute top-4 right-4 bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                    Últimas {product.stock} unidades
                                </div>
                            )}
                            
                            <div className="absolute bottom-4 left-4 bg-loom text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg capitalize">
                                {product.category}
                            </div>
                        </div>

                        {/* Información */}
                        <div className="p-8 flex flex-col">
                            {/* SKU */}
                            {product.sku && (
                                <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>
                            )}

                            {/* Nombre */}
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                                {product.name}
                            </h1>

                            {/* Precio */}
                            <div className="flex items-baseline gap-3 mb-6">
                                <span className="text-4xl font-bold text-loom">
                                    {formatPrice(product.price)}
                                </span>
                                <span className="text-lg text-gray-500">
                                    por unidad
                                </span>
                            </div>

                            {/* Stock */}
                            <div className="flex items-center gap-2 mb-6 pb-6 border-b border-gray-200">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <span className="text-gray-700">
                                    Stock disponible: <span className="font-bold">{product.stock}</span> unidades
                                </span>
                            </div>

                            {/* Descripción */}
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-gray-800 mb-3">Descripción</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Controles */}
                            {!isOutOfStock && (
                                <div className="mt-auto space-y-4">
                                    {/* Selector de cantidad */}
                                    <div className="flex items-center gap-4">
                                        <label className="text-gray-700 font-semibold">Cantidad:</label>
                                        <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => handleQuantityChange(-1)}
                                                disabled={quantity <= 1}
                                                className="px-5 py-3 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <span className="px-6 py-3 font-bold text-lg min-w-[60px] text-center">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(1)}
                                                disabled={quantity >= product.stock}
                                                className="px-5 py-3 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Subtotal */}
                                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                                        <span className="text-gray-700 font-semibold">Subtotal:</span>
                                        <span className="text-2xl font-bold text-loom">
                                            {formatPrice(product.price * quantity)}
                                        </span>
                                    </div>

                                    {/* Botones */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={isAdding}
                                            className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg ${
                                                isAdding
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-loom text-white hover:bg-loom-70 hover:shadow-xl transform hover:scale-105'
                                            }`}
                                        >
                                            {isAdding ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Agregado al Carrito
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    Agregar al Carrito
                                                </span>
                                            )}
                                        </button>

                                        <button
                                            onClick={() => navigate('/ecom/cart')}
                                            className="py-4 px-6 rounded-xl font-bold border-2 border-loom text-loom hover:bg-loom hover:text-white transition-all"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {isOutOfStock && (
                                <div className="mt-auto bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
                                    <p className="text-red-700 font-bold text-lg">
                                        Producto sin stock
                                    </p>
                                    <p className="text-red-600 text-sm mt-2">
                                        Consulta disponibilidad próximamente
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
