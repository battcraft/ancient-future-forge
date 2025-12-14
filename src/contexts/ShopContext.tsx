import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  type: 'course' | 'product';
  image?: string;
  quantity: number;
}

interface ShopContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from database for logged-in users
  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        setCart([]);
        return;
      }

      const { data: cartItems } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

      if (cartItems && cartItems.length > 0) {
        // Load item details for courses and products
        const enrichedItems: CartItem[] = [];

        for (const item of cartItems) {
          if (item.item_type === 'course') {
            const { data: course } = await supabase
              .from('courses')
              .select('title, price, image_url')
              .eq('id', item.item_id)
              .maybeSingle();
            
            if (course) {
              enrichedItems.push({
                id: item.item_id,
                title: course.title,
                price: Number(course.price),
                type: 'course',
                image: course.image_url || undefined,
                quantity: item.quantity,
              });
            }
          } else if (item.item_type === 'product') {
            const { data: product } = await supabase
              .from('products')
              .select('title, price, image_url')
              .eq('id', item.item_id)
              .maybeSingle();
            
            if (product) {
              enrichedItems.push({
                id: item.item_id,
                title: product.title,
                price: Number(product.price),
                type: 'product',
                image: product.image_url || undefined,
                quantity: item.quantity,
              });
            }
          }
        }

        setCart(enrichedItems);
      }
    };

    loadCart();
  }, [user]);

  const syncCartToDb = async (newCart: CartItem[]) => {
    if (!user) return;

    // Delete all existing cart items
    await supabase.from('cart_items').delete().eq('user_id', user.id);

    // Insert new cart items
    if (newCart.length > 0) {
      await supabase.from('cart_items').insert(
        newCart.map(item => ({
          user_id: user.id,
          item_id: item.id,
          item_type: item.type,
          quantity: item.quantity,
        }))
      );
    }
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      let newCart: CartItem[];
      
      if (existing) {
        newCart = prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        newCart = [...prev, { ...item, quantity: 1 }];
      }
      
      syncCartToDb(newCart);
      return newCart;
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const newCart = prev.filter(item => item.id !== id);
      syncCartToDb(newCart);
      return newCart;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => {
      const newCart = prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      syncCartToDb(newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    if (user) {
      supabase.from('cart_items').delete().eq('user_id', user.id);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ShopContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      isCartOpen,
      setIsCartOpen,
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
