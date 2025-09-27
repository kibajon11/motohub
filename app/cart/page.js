'use client';

import React from "react";
import Link from "next/link";
import { useCart } from "../../components/CartProvider";
import { Trash2, Plus, Minus, MessageCircle } from "lucide-react";

function formatTHB(n) {
  return (n || 0).toLocaleString("en-US");
}

const WHATSAPP_NUMBER = "66812345678"; // замени

export default function CartPage() {
  const { items, totalQty, totalPriceTHB, increment, decrement, removeItem, clear } = useCart();

  const message = React.useMemo(() => {
    const lines = [];
    lines.push("🛒 *MotoHub — заказ*");
    if (items.length === 0) lines.push("_Корзина пуста_");
    items.forEach((i, idx) => {
      lines.push(`${idx + 1}) ${i.name} (${i.code}) — x${i.qty} = ${formatTHB(i.qty * i.priceTHB)} THB`);
    });
    if (items.length > 0) {
      lines.push("");
      lines.push(`Итого: *${formatTHB(totalPriceTHB)} THB*`);
    }
    return encodeURIComponent(lines.join("\n"));
  }, [items, totalPriceTHB]);

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <section>
      <h1 className="mb-6 text-3xl font-extrabold">Корзина</h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
          <p className="mb-4 text-white/80">В корзине пусто.</p>
          <Link href="/" className="btn-primary">На главную</Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
            <table className="min-w-full text-sm">
              <thead className="bg-white/10">
                <tr>
                  <th className="p-3 text-left">Товар</th>
                  <th className="p-3 text-left">Код</th>
                  <th className="p-3 text-right">Цена, THB</th>
                  <th className="p-3 text-center">Кол-во</th>
                  <th className="p-3 text-right">Сумма, THB</th>
                  <th className="p-3 text-center">Удалить</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.code} className="border-t border-white/10">
                    <td className="p-3">{i.name}</td>
                    <td className="p-3 font-mono">{i.code}</td>
                    <td className="p-3 text-right">{formatTHB(i.priceTHB)}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <button className="rounded-md border border-white/20 px-2 py-1 hover:bg-white/10" onClick={() => decrement(i.code)} aria-label="Уменьшить">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-[2ch] text-center">{i.qty}</span>
                        <button className="rounded-md border border-white/20 px-2 py-1 hover:bg-white/10" onClick={() => increment(i.code)} aria-label="Увеличить">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="p-3 text-right">{formatTHB(i.qty * i.priceTHB)}</td>
                    <td className="p-3 text-center">
                      <button className="rounded-md border border-white/20 px-2 py-1 text-red-300 hover:bg-red-500/10" onClick={() => removeItem(i.code)} aria-label="Удалить">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="border-t border-white/10 bg-white/10 font-semibold">
                  <td className="p-3" colSpan={2}>Итого позиций: {items.length}</td>
                  <td className="p-3 text-right" colSpan={2}>Всего шт.: {totalQty}</td>
                  <td className="p-3 text-right">{formatTHB(totalPriceTHB)}</td>
                  <td className="p-3"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10" onClick={clear}>
              Очистить корзину
            </button>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Отправить заказ в WhatsApp
            </a>
          </div>
        </>
      )}
    </section>
  );
}