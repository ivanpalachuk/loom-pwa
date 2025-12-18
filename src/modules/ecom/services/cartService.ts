import type { Cart, CartItem, Product } from '../types';

const CART_STORAGE_KEY = 'loom_cart';

/**
 * Obtiene el carrito desde localStorage
 */
export const getCart = (): Cart => {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
            const cart: Cart = JSON.parse(stored);
            return cart;
        }
    } catch (error) {
        console.error('Error loading cart:', error);
    }
    return { items: [], total: 0 };
};

/**
 * Guarda el carrito en localStorage
 */
const saveCart = (cart: Cart): void => {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart:', error);
    }
};

/**
 * Calcula el total del carrito
 */
const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
};

/**
 * Agrega un producto al carrito
 */
export const addToCart = (product: Product, quantity: number = 1): Cart => {
    const cart = getCart();
    
    // Verificar si el producto ya existe
    const existingItemIndex = cart.items.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex >= 0) {
        // Actualizar cantidad
        const newQuantity = cart.items[existingItemIndex].quantity + quantity;
        // Verificar stock
        if (newQuantity <= product.stock) {
            cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            throw new Error(`Stock insuficiente. Disponible: ${product.stock}`);
        }
    } else {
        // Agregar nuevo item
        if (quantity <= product.stock) {
            cart.items.push({ product, quantity });
        } else {
            throw new Error(`Stock insuficiente. Disponible: ${product.stock}`);
        }
    }
    
    cart.total = calculateTotal(cart.items);
    saveCart(cart);
    return cart;
};

/**
 * Actualiza la cantidad de un producto en el carrito
 */
export const updateCartItemQuantity = (productId: string, quantity: number): Cart => {
    const cart = getCart();
    const itemIndex = cart.items.findIndex(item => item.product.id === productId);
    
    if (itemIndex >= 0) {
        if (quantity <= 0) {
            // Eliminar item
            cart.items.splice(itemIndex, 1);
        } else if (quantity <= cart.items[itemIndex].product.stock) {
            // Actualizar cantidad
            cart.items[itemIndex].quantity = quantity;
        } else {
            throw new Error(`Stock insuficiente. Disponible: ${cart.items[itemIndex].product.stock}`);
        }
    }
    
    cart.total = calculateTotal(cart.items);
    saveCart(cart);
    return cart;
};

/**
 * Elimina un producto del carrito
 */
export const removeFromCart = (productId: string): Cart => {
    const cart = getCart();
    cart.items = cart.items.filter(item => item.product.id !== productId);
    cart.total = calculateTotal(cart.items);
    saveCart(cart);
    return cart;
};

/**
 * Vacía el carrito
 */
export const clearCart = (): Cart => {
    const cart: Cart = { items: [], total: 0 };
    saveCart(cart);
    return cart;
};

/**
 * Obtiene la cantidad de items en el carrito
 */
export const getCartItemCount = (): number => {
    const cart = getCart();
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
};
