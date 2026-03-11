// src/context/CartContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { CartItem } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  loadCartFromDb: () => Promise<void>;
  clearCart: () => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        loadCartFromDb();
      } else {
        setCartItems([]);
        setCartCount(0);
      }
    }
  }, [user, isAuthenticated, isLoading]);

  const loadCartFromDb = async () => {
    try {
      if (!user?.sub) return;

      const response = await fetch(`/api/users/cart?auth0Id=${user.sub}`);
      if (!response.ok) throw new Error('Error al cargar carrito');
      
      const result = await response.json();

      const items: CartItem[] = result.map((item: any) => ({
        id: item.id,
        serviceId: item.serviceId || '',
        serviceName: item.serviceName,
        servicePrice: Number(item.servicePrice),
        category: item.category || '',
        imageUrl: item.imageUrl || '',
        quantity: item.quantity || 1,
        addedAt: item.createdAt || new Date().toISOString(),
        duration: Number(item.duration || 60)
      }));

      setCartItems(items);
      setCartCount(items.length);
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
    }
  };

  const clearCart = async () => {
    if (!user?.sub) return;

    try {
      await fetch(`/api/users/cart?auth0Id=${user.sub}&all=true`, {
        method: 'DELETE'
      });
      setCartItems([]);
      setCartCount(0);
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await fetch(`/api/users/cart?id=${itemId}`, {
        method: 'DELETE'
      });
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      setCartCount(updatedItems.length);
    } catch (error) {
      console.error("Error al eliminar el ítem del carrito:", error);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      setCartItems, 
      cartCount, 
      loadCartFromDb, 
      clearCart, 
      removeItem 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
