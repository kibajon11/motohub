"use client";

import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addToCart = (item) => {
    setItems((prev) => {
      const exist = prev.find((i) => i.code === item.code);
      if (exist) {
        return prev.map((i) =>
          i.code === item.code ? { ...i, qty: i.qty + item.qty } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (code) => {
    setItems((prev) => prev.filter((i) => i.code !== code));
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
