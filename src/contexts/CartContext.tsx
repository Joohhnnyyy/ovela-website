'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, Product } from '@/types/database';
import { CartService } from '@/services/cartService';
import { useAuth } from './AuthContext';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' };

interface CartContextType extends CartState {
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => Promise<void>;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string, size: string, color: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_CART':
      const items = action.payload;
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return {
        ...state,
        items,
        totalItems,
        totalPrice,
        isLoading: false
      };
    
    case 'ADD_ITEM':
      const newItems = [...state.items, action.payload];
      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    
    case 'UPDATE_ITEM':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        totalItems: filteredItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
    
    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { currentUser } = useAuth();

  // Load cart items when user changes
  useEffect(() => {
    if (currentUser) {
      refreshCart();
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [currentUser]);

  const refreshCart = async () => {
    if (!currentUser) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // First update cart prices to ensure they match current product prices
      // Use a non-blocking approach to prevent navigation issues
      CartService.updateCartPrices(currentUser.uid).catch(error => {
        console.warn('Price update failed, continuing with existing prices:', error);
      });
      
      // Get the cart (this will get updated prices if the update succeeded)
      const response = await CartService.getUserCart(currentUser.uid);
      if (response.success && response.data) {
        dispatch({ type: 'SET_CART', payload: response.data.items });
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToCart = async (
    product: Product,
    quantity: number = 1,
    size: string = 'M',
    color: string = 'Default'
  ) => {
    if (!currentUser) {
      throw new Error('User must be logged in to add items to cart');
    }

    try {
      const response = await CartService.addToCart(
        currentUser.uid,
        product.id,
        size,
        color,
        quantity
      );
      
      if (response.success && response.data) {
        dispatch({ type: 'SET_CART', payload: response.data.items });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (productId: string, size: string, color: string, quantity: number) => {
    if (!currentUser) return;

    try {
      const response = await CartService.updateCartItem(
        currentUser.uid,
        productId,
        size,
        color,
        quantity
      );
      
      if (response.success && response.data) {
        dispatch({ type: 'SET_CART', payload: response.data.items });
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId: string, size: string, color: string) => {
    if (!currentUser) return;

    try {
      const response = await CartService.removeFromCart(
        currentUser.uid,
        productId,
        size,
        color
      );
      
      if (response.success && response.data) {
        dispatch({ type: 'SET_CART', payload: response.data.items });
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!currentUser) return;

    try {
      const response = await CartService.clearCart(currentUser.uid);
      if (response.success) {
        dispatch({ type: 'CLEAR_CART' });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const value: CartContextType = {
    ...state,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};