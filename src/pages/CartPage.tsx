import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import type { Cart } from '../modules/ecom/types';
import { getCart, updateCartItemQuantity, removeFromCart, clearCart } from '../modules/ecom/services';

export function CartPage() {
    const navigate = useNavigate();
    const [cart, setCart] = useState<Cart>({ items: [], total: 0 });

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = () => {
        const currentCart = getCart();
        setCart(currentCart);
    };

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        try {
            const updatedCart = updateCartItemQuantity(productId, newQuantity);
            setCart(updatedCart);
        } catch (error) {
            alert((error as Error).message);
        }
    };

    const handleRemove = (productId: string) => {
        const updatedCart = removeFromCart(productId);
        setCart(updatedCart);
    };

    const handleClearCart = () => {
        if (confirm('¿Estás seguro de vaciar el carrito?')) {
            const updatedCart = clearCart();
            setCart(updatedCart);
        }
    };

    const handleCheckout = () => {
        alert('Funcionalidad de checkout próximamente');
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(price);
    };

    const isEmpty = cart.items.length === 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader 
                title="Carrito de Compras" 
                onBack={() => navigate('/ecom')}
                transparent={true}
                withPattern={true}
            />
            
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {isEmpty ? (
                    /* Carrito vacío */
                    <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
                        <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-700 mb-3">Tu carrito está vacío</h2>
                        <p className="text-gray-500 mb-8">Agrega productos para comenzar tu pedido</p>
                        <button
                            onClick={() => navigate('/ecom')}
                            className="bg-loom text-white px-8 py-3 rounded-xl font-semibold hover:bg-loom-70 transition-all transform hover:scale-105"
                        >
                            Ver Productos
                        </button>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Lista de productos */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Header */}
                            <div className="bg-white rounded-2xl shadow-md p-4 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-700">
                                    {cart.items.length} {cart.items.length === 1 ? 'producto' : 'productos'}
                                </h2>
                                <button
                                    onClick={handleClearCart}
                                    className="text-red-500 hover:text-red-700 text-sm font-semibold"
                                >
                                    Vaciar carrito
                                </button>
                            </div>

                            {/* Items */}
                            {cart.items.map((item) => (
                                <div key={item.product.id} className="bg-white rounded-2xl shadow-md p-6">
                                    <div className="flex gap-4">
                                        {/* Imagen */}
                                        <div 
                                            className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
                                            onClick={() => navigate(`/ecom/product/${item.product.id}`)}
                                        >
                                            <img
                                                src={item.product.imageUrl}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ccircle fill="%23004EA8" cx="50" cy="50" r="20"/%3E%3Cpath fill="white" d="M42.5 45 L57.5 45 L57.5 50 L53.75 50 L53.75 60 L46.25 60 L46.25 50 L42.5 50 Z"/%3E%3C/svg%3E';
                                                }}
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1">
                                            <h3 
                                                className="font-bold text-gray-800 mb-1 cursor-pointer hover:text-loom"
                                                onClick={() => navigate(`/ecom/product/${item.product.id}`)}
                                            >
                                                {item.product.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-3 capitalize">{item.product.category}</p>
                                            
                                            <div className="flex items-center justify-between">
                                                {/* Controles de cantidad */}
                                                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="px-3 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                        </svg>
                                                    </button>
                                                    <span className="px-4 py-2 font-bold min-w-[50px] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                                        disabled={item.quantity >= item.product.stock}
                                                        className="px-3 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* Precio */}
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500">
                                                        {formatPrice(item.product.price)} c/u
                                                    </p>
                                                    <p className="text-lg font-bold text-loom">
                                                        {formatPrice(item.product.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Stock warning */}
                                            {item.quantity >= item.product.stock && (
                                                <p className="text-xs text-amber-600 mt-2">
                                                    Cantidad máxima alcanzada
                                                </p>
                                            )}
                                        </div>

                                        {/* Botón eliminar */}
                                        <button
                                            onClick={() => handleRemove(item.product.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Resumen */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Resumen del Pedido</h2>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">{formatPrice(cart.total)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Envío</span>
                                        <span className="font-semibold">A calcular</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between text-lg">
                                        <span className="font-bold text-gray-800">Total</span>
                                        <span className="font-bold text-loom text-2xl">{formatPrice(cart.total)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-loom text-white py-4 rounded-xl font-bold text-lg hover:bg-loom-70 transition-all transform hover:scale-105 shadow-lg mb-3"
                                >
                                    Finalizar Compra
                                </button>

                                <button
                                    onClick={() => navigate('/ecom')}
                                    className="w-full border-2 border-loom text-loom py-3 rounded-xl font-semibold hover:bg-loom hover:text-white transition-all"
                                >
                                    Seguir Comprando
                                </button>

                                <div className="mt-6 pt-6 border-t text-sm text-gray-500 space-y-2">
                                    <p className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Envío a todo el país
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Productos garantizados
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
