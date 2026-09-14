import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [deliveryOption, setDeliveryOption] = useState('DELIVERY');
  const [promoCode, setPromoCode] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    localStorage.setItem('aura_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (menuItem, qty = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.menuItemId === menuItem.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }
      return [
        ...prev,
        {
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: Number(menuItem.price),
          image: menuItem.image,
          category: menuItem.categoryRel?.name || menuItem.category,
          quantity: qty,
        },
      ];
    });
    toast.success(`Added "${menuItem.name}" to cart`);
  };

  const removeItem = (menuItemId) => {
    setItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
    toast.info('Item removed from cart');
  };

  const updateQuantity = (menuItemId, qty) => {
    if (qty <= 0) {
      removeItem(menuItemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity: qty } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode('');
  };

  const cartCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return Number(total.toFixed(2));
  }, [items]);

  const deliveryFee = useMemo(() => {
    if (deliveryOption !== 'DELIVERY' || subtotal === 0) return 0;
    return subtotal >= 50 ? 0 : 5.00;
  }, [deliveryOption, subtotal]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        deliveryFee,
        deliveryOption,
        setDeliveryOption,
        promoCode,
        setPromoCode,
        isDrawerOpen,
        setIsDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
