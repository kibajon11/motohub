'use client';

import React from "react";
import Link from "next/link";
import ModelImage from "../../../../../components/ModelImage";

// простейшая корзина в localStorage — дальше улучшим
function useCart() {
  const [cart, setCart] = React.useState([]);
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      setCart(raw ? JSON.parse(raw) : []);
    } catch {
      setCart([]);
    }
  }, []);
  const add = (item) => {
    setCart((prev) => {
      const next = [...prev, item];
      localStorage.setItem("cart", JSON.stringify(next));
      return next;
    });
  };
  const countByCode = (code) => cart.filter((i) => i.code === code).length;
  return { cart, add, countByCode };
}

export default function CategoryPage({ params }) {
  const { brand: brandSlug, model: modelSlug, category: categorySlug } = React.use(params);
  const [parts, setParts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { add, countByCode } = useCart();

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(`/api/parts/${brandSlug}/${modelSlug}/${categorySlug}`, { cache: "no-store" });
        const data = await res.json();
        if (mounted) setParts(data?.parts || []);
      } catch {
        if (mounted) setParts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [brandSlug, modelSlug, categorySlug]);

  if (loading) return <div className="p-6 text-gray-600">Загрузка деталей…</div>;

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold capitalize">
          {brandSlug} / {modelSlug.replace(/-/g, " ")} / {categorySlug}
        </h1>
      </div>

      {parts.length === 0 ? (
        <p className="text-gray-600">В этой категории пока пусто.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Фото</th>
                <th className="p-3 text-left">Название</th>
                <th className="p-3 text-left">Код</th>
                <th className="p-3 text-left">Цвет</th>
                <th className="p-3 text-left">Цена, THB</th>
                <th className="p-3 text-left">Сток</th>
                <th className="p-3 text-left">Действие</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((p) => {
                const inCart = countByCode(p.code);
                const avail = Math.max(0, (p.stockQty || 0) - inCart);
                const imgSrc = p.imageFile ? `/parts/${p.imageFile}` : "/placeholder.png";
                const disabled = avail === 0;
                return (
                  <tr key={p.code} className="border-t">
                    <td className="p-3">
                      <div className="relative h-14 w-14 bg-gray-100 rounded">
                        <ModelImage src={imgSrc} alt={p.name} fill className="object-contain p-1" />
                      </div>
                    </td>
                    <td className="p-3">{p.name}</td>
                    <td className="p-3 font-mono">{p.code}</td>
                    <td className="p-3">{p.color || "-"}</td>
                    <td className="p-3">{(p.priceTHB || 0).toLocaleString()}</td>
                    <td className="p-3">
                      {avail > 0 ? (
                        <span className="badge">В наличии: {avail}</span>
                      ) : (
                        <span className="badge bg-red-100 text-red-700">Out of stock</span>
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        className={`btn-primary ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={disabled}
                        onClick={() =>
                          add({
                            brand: brandSlug,
                            model: modelSlug,
                            category: categorySlug,
                            code: p.code,
                            name: p.name,
                            priceTHB: p.priceTHB,
                          })
                        }
                      >
                        Добавить в корзину
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 flex gap-6 text-sm">
        <Link href={`/${brandSlug}/models/${modelSlug}`}>← К категориям</Link>
        <Link href={`/${brandSlug}`}>К моделям {brandSlug}</Link>
        <Link href="/">На главную</Link>
      </div>
    </section>
  );
}
