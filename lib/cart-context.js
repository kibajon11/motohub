'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'motohub_cart_v1';
const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // 1) Поднять состояние из localStorage после монтирования (только на клиенте)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {}
    setHydrated(true);
  }, []);

  // 2) Сохранять обратно при изменениях (после гидратации)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const value = useMemo(() => {
    const totalQty = items.reduce((s, i) => s + (Number(i.qty) || 0), 0);
    const totalPrice = items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.price) || 0), 0);

    // Базовые операции
    const add = (item, qty = 1) => {
      const q = Math.max(1, Number(qty) || 1);
      setItems(prev => {
        const id = String(item.id);
        const idx = prev.findIndex(p => String(p.id) === id);
        if (idx === -1) return [...prev, { ...item, id, qty: q }];
        const clone = [...prev];
        clone[idx] = { ...clone[idx], qty: (Number(clone[idx].qty) || 0) + q };
        return clone;
      });
    };

    const remove = (id) =>
      setItems(prev => prev.filter(p => String(p.id) !== String(id)));

    const setQty = (id, qty) =>
      setItems(prev =>
        prev.map(p =>
          String(p.id) === String(id)
            ? { ...p, qty: Math.max(1, Number(qty) || 1) }
            : p
        )
      );

    const clear = () => setItems([]);

    // Возвращаем объект состояния/действий
    return {
      items,
      totalQty,
      totalPrice,
      hydrated,

      // Новое имя
      add,
      // ✅ Алиас под старое имя — чтобы старые вызовы addToCart не падали
      addToCart: add,

      remove,
      setQty,
      clear,
    };
  }, [items, hydrated]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
