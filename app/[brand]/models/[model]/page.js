"use client";

import React from "react";
import Link from "next/link";

export default function ModelPage({ params }) {
  const p = React.use(params);
  const brand = p.brand;
  const model = p.model;

  const [categories, setCategories] = React.useState([]);
  const [state, setState] = React.useState({ loading: true, error: "" });

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setState({ loading: true, error: "" });
        const res = await fetch(`/api/categories/${brand}/${model}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!alive) return;
        setCategories(data?.categories || []);
        setState({ loading: false, error: "" });
      } catch (e) {
        if (!alive) return;
        setState({ loading: false, error: String(e) });
      }
    })();
    return () => { alive = false; };
  }, [brand, model]);

  if (state.loading) return <div className="p-6">Загрузка категорий…</div>;
  if (state.error)   return <div className="p-6 text-red-400">Ошибка: {state.error}</div>;
  if (!categories.length) {
    return <div className="p-6 text-white/80">Категории не найдены для {model.toUpperCase()}.</div>;
  }

  return (
    <section className="p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        {brand.toUpperCase()} — {model.toUpperCase()}
      </h1>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <li key={c.slug}
              className="rounded-xl border border-white/10 bg-[#141922] p-4 hover:bg-white/[0.08] transition">
            <Link href={`/${brand}/models/${model}/${c.slug}`} className="block">
              <div className="flex items-center justify-center h-28">
                <span className="text-lg font-semibold text-white group-hover:text-blue-400 transition">
                  {c.name}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
