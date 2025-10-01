'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import React from 'react';
import { useCart } from '@/lib/cart-context';

const COLORS = [
  { code: 'black',   label: 'Black',   swatch: '#0b0b0b' },
  { code: 'white',   label: 'White',   swatch: '#e5e7eb' },
  { code: 'red',     label: 'Red',     swatch: '#ef4444' },
  { code: 'blue',    label: 'Blue',    swatch: '#3b82f6' },
  { code: 'silver',  label: 'Silver',  swatch: '#9ca3af' },
];

export default function PartPage() {
  const params = useParams();
  const { add } = useCart();

  // Демоданные — подставь реальные по необходимости
  const baseId = String(params.code);
  const title = `${(params.brand || '').toUpperCase()} ${params.model || ''} — ${params.category || ''} — ${params.code || ''}`;
  const price = 1500;
  const img = '/models/pcx-160.png'; // положи файл в /public/models/ или замени путь на существующий

  const [color, setColor] = React.useState(null);
  const [qty, setQty] = React.useState(1);

  const total = price * qty;

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => q + 1);

  const canAdd = Boolean(color) && qty >= 1;

  const onAdd = () => {
    if (!canAdd) return;
    // Делаем уникальный id для варианта (код + цвет)
    const id = `${baseId}::${color}`;
    add({ id, title: `${title} (${color})`, price, image: img }, qty);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 rounded-2xl border border-white/10 bg-neutral-900/40">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-white/10">
            <Image
              src={img}
              alt={title}
              width={800}
              height={800}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>

        <div className="flex-1 space-y-5">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="text-xl opacity-80">Цена: ฿ {price.toLocaleString('en-US')}</div>

          {/* Выбор цвета */}
          <div className="space-y-2">
            <div className="text-sm text-white/70">Цвет</div>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(c => (
                <button
                  key={c.code}
                  onClick={() => setColor(c.code)}
                  className={`relative h-10 rounded-xl border ${color === c.code ? 'border-white/60' : 'border-white/15'} px-4 flex items-center gap-3 bg-white/5 hover:bg-white/10 transition`}
                  aria-pressed={color === c.code}
                >
                  <span className="inline-block h-6 w-6 rounded-md" style={{ backgroundColor: c.swatch }} />
                  <span className="text-sm">{c.label}</span>
                </button>
              ))}
            </div>
            {!color && <div className="text-xs text-amber-300/90">Пожалуйста, выбери цвет</div>}
          </div>

          {/* Количество + онлайн сумма */}
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center rounded-xl border border-white/15 bg-white/5">
              <button onClick={dec} className="px-3 py-2 hover:bg-white/10">−</button>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={e => setQty(Math.max(1, Number(e.target.value) || 1))}
                className="w-16 bg-transparent text-center outline-none"
              />
              <button onClick={inc} className="px-3 py-2 hover:bg-white/10">+</button>
            </div>

            <div className="text-lg">
              Итого: <span className="font-semibold">฿ {total.toLocaleString('en-US')}</span>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-3">
            <button
              onClick={onAdd}
              disabled={!canAdd}
              className={`px-5 py-3 rounded-xl text-white ${canAdd ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-neutral-700 cursor-not-allowed'} transition`}
            >
              Добавить в корзину
            </button>

            <a
              href="https://wa.me/66812345678"
              target="_blank"
              className="px-5 py-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
