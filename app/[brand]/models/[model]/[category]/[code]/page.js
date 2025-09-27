'use client';

import React from "react";
import Link from "next/link";
import ModelImage from "../../../../../../components/ModelImage";
import { useCart } from "../../../../../../components/CartProvider";

function codeToSlug(code = "") {
  return code.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function slugToMatcher(slug = "") {
  const re = new RegExp("^" + slug.replace(/-/g, "[^a-zA-Z0-9]+") + "$", "i");
  return (code) => re.test(codeToSlug(code));
}

export default function PartPage({ params }) {
  const { brand: brandSlug, model: modelSlug, category: categorySlug, code: codeSlug } = React.use(params);
  const [part, setPart] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [qty, setQty] = React.useState(1);
  const [selectedColor, setSelectedColor] = React.useState("");
  const { addItem, items } = useCart();

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/parts/${brandSlug}/${modelSlug}/${categorySlug}`, { cache: "no-store" });
        const data = await res.json();
        const matchSlug = slugToMatcher(codeSlug);
        const found = (data?.parts || []).find((p) => matchSlug(p.code)) || null;
        if (mounted) {
          setPart(found);
          if (found) {
            const colors = (found.color || "").split(",").map((s) => s.trim()).filter(Boolean);
            setSelectedColor(colors[0] || "");
          }
        }
      } catch {
        if (mounted) setPart(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [brandSlug, modelSlug, categorySlug, codeSlug]);

  const inCart = part ? (items.find((i) => i.code === part.code)?.qty || 0) : 0;
  const avail = part ? Math.max(0, (part.stockQty || 0) - inCart) : 0;
  const price = part?.priceTHB || 0;
  const total = price * qty;

  function dec() { setQty((q) => Math.max(1, q - 1)); }
  function inc() { setQty((q) => Math.min(999, q + 1)); }

  function addToCart() {
    if (!part) return;
    addItem({
      brand: brandSlug,
      model: modelSlug,
      category: categorySlug,
      code: part.code,
      name: part.name + (selectedColor ? ` (${selectedColor})` : ""),
      priceTHB: part.priceTHB || 0,
    }, qty);
  }

  if (loading) return <div className="p-6 text-gray-300">Загрузка…</div>;
  if (!part) return <div className="p-6 text-red-300">Деталь не найдена</div>;

  const imgSrc = part.imageFile ? `/parts/${part.imageFile}` : "/placeholder.png";
  const colors = (part.color || "").split(",").map((s) => s.trim()).filter(Boolean);
  const disabled = avail <= 0;

  return (
    <section>
      <div className="mb-6">
        <nav className="text-sm text-white/70">
          <Link href="/">Главная</Link> <span>›</span>{" "}
          <Link href={`/${brandSlug}`}>{brandSlug}</Link> <span>›</span>{" "}
          <Link href={`/${brandSlug}/models/${modelSlug}`}>{modelSlug.replace(/-/g, " ")}</Link> <span>›</span>{" "}
          <Link href={`/${brandSlug}/models/${modelSlug}/${categorySlug}`}>{categorySlug}</Link> <span>›</span>{" "}
          <span className="text-white">{part.name}</span>
        </nav>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="relative h-72 w-full bg-white/10 rounded-lg">
            <ModelImage src={imgSrc} alt={part.name} fill className="object-contain p-4" />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h1 className="mb-2 text-2xl font-bold">{part.name}</h1>
          <p className="mb-4 font-mono text-sm text-white/70">Код: {part.code}</p>
          {part.notes && <p className="mb-4 text-sm text-white/90">{part.notes}</p>}

          <div className="mb-4">
            <div className="text-3xl font-extrabold">{price.toLocaleString()} THB</div>
            <div className="text-sm text-white/70">за 1 шт.</div>
          </div>

          {colors.length > 0 && (
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Цвет</label>
              <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="w-full rounded-md border border-white/15 bg-white/10 p-2">
                {colors.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-4 flex items-center gap-3">
            <button className="rounded-md border border-white/20 px-3 py-1.5 hover:bg-white/10" onClick={dec}>−</button>
            <input
              value={qty}
              onChange={(e) => {
                const n = Math.max(1, Math.min(999, Number(e.target.value) || 1));
                setQty(n);
              }}
              type="number"
              min="1"
              className="w-20 rounded-md border border-white/20 bg-transparent p-2 text-center"
            />
            <button className="rounded-md border border-white/20 px-3 py-1.5 hover:bg-white/10" onClick={inc}>+</button>
            <span className="ml-3 text-sm text-white/70">
              В наличии: {avail}
            </span>
          </div>

          <div className="mb-6 text-lg">
            Итого: <b>{total.toLocaleString()} THB</b>
          </div>

          <button
            disabled={disabled || qty > avail}
            className={`btn-primary ${disabled || qty > avail ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={addToCart}
          >
            Добавить в корзину
          </button>
        </div>
      </div>
    </section>
  );
}