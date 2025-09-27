'use client';

import React from "react";

const CartContext = React.createContext(null);

function load() {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = localStorage.getItem("motohub_cart");
    return raw ? JSON.parse(raw) : { items: [] };
  } catch {
    return { items: [] };
  }
}

function save(state) {
  try {
    localStorage.setItem("motohub_cart", JSON.stringify(state));
  } catch {}
}

export function CartProvider({ children }) {
  const [items, setItems] = React.useState(() => load().items || []);

  const totalQty = React.useMemo(() => items.reduce((s, x) => s + (x.qty || 0), 0), [items]);
  const totalPriceTHB = React.useMemo(() => items.reduce((s, x) => s + (x.qty * (x.priceTHB || 0)), 0), [items]);

  React.useEffect(() => {
    save({ items });
  }, [items]);

  function addItem(item, qty = 1) {
    setItems((list) => {
      const idx = list.findIndex((x) => x.code === item.code);
      if (idx >= 0) {
        const copy = [...list];
        copy[idx] = { ...copy[idx], qty: Math.min(999, (copy[idx].qty || 0) + qty) };
        return copy;
      }
      return [...list, { ...item, qty }];
    });
  }

  function removeItem(code) {
    setItems((list) => list.filter((x) => x.code !== code));
  }

  function increment(code, d = 1) {
    setItems((list) => list.map((x) => (x.code === code ? { ...x, qty: Math.min(999, x.qty + d) } : x)));
  }

  function decrement(code, d = 1) {
    setItems((list) => list.map((x) => (x.code === code ? { ...x, qty: Math.max(1, x.qty - d) } : x)));
  }

  function clear() {
    setItems([]);
  }

  return (
    <CartContext.Provider value={{ items, totalQty, totalPriceTHB, addItem, removeItem, increment, decrement, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
