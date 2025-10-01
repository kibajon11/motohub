'use client';

import { useCart } from '@/lib/cart-context';

export default function CartPage() {
  const { items, totalPrice, setQty, remove, clear, hydrated } = useCart();

  if (!hydrated) return <div className="p-6">Загрузка…</div>;
  if (items.length === 0) return <div className="p-6">Корзина пуста</div>;

  return (
    <div className="p-6 space-y-6">
      {items.map(i => (
        <div key={i.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {i.image ? (
              <img src={i.image} alt={i.title} className="w-16 h-16 object-cover rounded-md" />
            ) : (
              <div className="w-16 h-16 rounded-md bg-neutral-800" />
            )}
            <div>
              <div className="font-medium">{i.title}</div>
              <div className="text-sm opacity-70">{i.price.toLocaleString()} ฿</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={i.qty}
              onChange={(e) => setQty(i.id, Number(e.target.value))}
              className="w-16 bg-neutral-900 border border-white/10 rounded px-2 py-1"
            />
            <button
              onClick={() => remove(i.id)}
              className="px-3 py-1 border border-white/20 rounded hover:border-white/40"
            >
              Удалить
            </button>
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <div className="text-lg">Итого: {totalPrice.toLocaleString()} ฿</div>
        <button onClick={clear} className="px-4 py-2 border border-white/20 rounded hover:border-white/40">
          Очистить
        </button>
      </div>
    </div>
  );
}
