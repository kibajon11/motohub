'use client';

import React from "react";
import Link from "next/link";
import ModelImage from "../../../../../components/ModelImage";
import { useCart } from "../../../../../components/CartProvider";

function codeToSlug(code = "") {
  return code.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function CategoryPage({ params }) {
  const { brand: brandSlug, model: modelSlug, category: categorySlug } = React.use(params);
  const [parts, setParts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { addItem, items } = useCart();

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/parts/${brandSlug}/${modelSlug}/${categorySlug}`, { cache: "no-store" });
        const data = await res.json();
        if (mounted) setParts(data?.parts || []);
      } catch {
        if (mounted) setParts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [brandSlug, modelSlug, categorySlug]);

  const inCartQtyByCode = React.useCallback(
    (code) => (items.find((i) => i.code === code)?.qty || 0),
    [items]
  );

  if (loading) return <div className="p-6 text-gray-300">Загрузка деталей…</div>;

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold capitalize">
          {brandSlug} / {modelSlug.replace(/-/g, " ")} / {categorySlug}
        </h1>
      </div>

      {parts.length === 0 ? (
        <p className="text-gray-300">В этой категории пока пусто.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
          <table className="min-w-full text-sm">
            <thead className="bg-white/10">
              <tr>
                <th className="p-3 text-left">Фото</th>
                <th className="p-3 text-left">Название</th>
                <th className="p-3 text-left">Код</th>
                <th className="p-3 text-left">Цвет</th>
                <th className="p-3 text-right">Цена, THB</th>
                <th className="p-3 text-left">Сток</th>
                <th className="p-3 text-left">Действие</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((p) => {
                const inCart = inCartQtyByCode(p.code);
                const avail = Math.max(0, (p.stockQty || 0) - inCart);
                const imgSrc = p.imageFile ? `/parts/${p.imageFile}` : "/placeholder.png";
                const disabled = avail === 0;
                const codeSlug = codeToSlug(p.code);

                return (
                  <tr key={p.code} className="border-t border-white/10">
                    <td className="p-3">
                      <div className="relative h-14 w-14 bg-white/10 rounded">
                        <ModelImage src={imgSrc} alt={p.name} fill className="object-contain p-1" />
                      </div>
                    </td>
                    <td className="p-3">
                      <Link className="text-blue-300 hover:underline" href={`/${brandSlug}/models/${modelSlug}/${categorySlug}/${codeSlug}`}>
                        {p.name}
                      </Link>
                    </td>
                    <td className="p-3 font-mono">{p.code}</td>
                    <td className="p-3">{p.color || "-"}</td>
                    <td className="p-3 text-right">{(p.priceTHB || 0).toLocaleString()}</td>
                    <td className="p-3">
                      {avail > 0 ? (
                        <span className="rounded bg-green-500/20 text-green-300 px-2 py-0.5">В наличии: {avail}</span>
                      ) : (
                        <span className="rounded bg-red-500/20 text-red-300 px-2 py-0.5">Out of stock</span>
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        className={`btn-primary ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={disabled}
                        onClick={() =>
                          addItem({
                            brand: brandSlug,
                            model: modelSlug,
                            category: categorySlug,
                            code: p.code,
                            name: p.name,
                            priceTHB: p.priceTHB || 0,
                          }, 1)
                        }
                      >
                        В корзину (1)
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 flex gap-6 text-sm text-white/80">
        <Link href={`/${brandSlug}/models/${modelSlug}`}>← К категориям</Link>
        <Link href={`/${brandSlug}`}>К моделям {brandSlug}</Link>
        <Link href="/">На главную</Link>
      </div>
    </section>
  );
}