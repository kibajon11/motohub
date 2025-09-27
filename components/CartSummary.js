'use client';

import React from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import ModelImage from "./ModelImage";
import { useCart } from "./CartProvider";

function formatTHB(n) {
  return (n || 0).toLocaleString("en-US");
}

export default function CartSummary() {
  const { items, totalQty, totalPriceTHB, increment, decrement, removeItem } = useCart();

  if (items.length === 0) {
    return <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/80">Корзина пуста.</div>;
  }

  return (
    <div className="space-y-4">
      {items.map((i) => (
        <div
          key={i.code}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 flex items-center gap-4"
        >
          <div className="relative h-16 w-24 rounded-lg bg-white/10 overflow-hidden">
            <ModelImage src={i.imageFile ? `/parts/${i.imageFile}` : "/placeholder.png"} alt={i.name} fill className="object-contain p-2" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">{i.name}</div>
            <div className="text-xs font-mono text-white/60 truncate">Код: {i.code}</div>
          </div>
          <div className="hidden sm:block w-24 text-right font-medium">{formatTHB(i.priceTHB)} THB</div>
          <div className="flex items-center gap-2">
            <button className="rounded-md border border-white/20 px-2 py-1 hover:bg-white/10" onClick={() => decrement(i.code)} aria-label="minus"><Minus className="h-4 w-4" /></button>
            <span className="min-w-[2ch] text-center">{i.qty}</span>
            <button className="rounded-md border border-white/20 px-2 py-1 hover:bg-white/10" onClick={() => increment(i.code)} aria-label="plus"><Plus className="h-4 w-4" /></button>
          </div>
          <div className="w-24 text-right font-semibold">{formatTHB(i.qty * i.priceTHB)} THB</div>
          <button className="ml-2 rounded-md border border-white/20 px-2 py-1 text-red-300 hover:bg-red-500/10" onClick={() => removeItem(i.code)} aria-label="remove">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      <div className="rounded-2xl border border-white/10 bg-white/10 p-4 flex items-center justify-between">
        <div className="text-sm text-white/80">Позиций: {items.length} • Штук: {totalQty}</div>
        <div className="text-lg font-extrabold">{formatTHB(totalPriceTHB)} THB</div>
      </div>
    </div>
  );
}
