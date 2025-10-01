"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function CategoryPage({ params }) {
  const p = React.use(params);
  const brand = p.brand;
  const model = p.model;
  const category = p.category;

  const [parts, setParts] = React.useState([]);
  const [state, setState] = React.useState({ loading: true, error: "" });

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setState({ loading: true, error: "" });
        const res = await fetch(`/api/parts/${brand}/${model}/${category}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!alive) return;
        setParts(data?.parts || []);
        setState({ loading: false, error: "" });
      } catch (e) {
        if (!alive) return;
        setState({ loading: false, error: String(e) });
      }
    })();
    return () => { alive = false; };
  }, [brand, model, category]);

  if (state.loading) return <div className="p-6">Загрузка деталей…</div>;
  if (state.error)   return <div className="p-6 text-red-400">Ошибка: {state.error}</div>;
  if (!parts.length) {
    return <div className="p-6 text-white/80">Детали не найдены в категории {category.toUpperCase()}.</div>;
  }

  return (
    <section className="p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        {brand.toUpperCase()} — {model.toUpperCase()} — {category.toUpperCase()}
      </h1>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {parts.map((part) => (
          <li key={part.code}
              className="rounded-xl border border-white/10 bg-[#141922] p-4 hover:bg-white/[0.08] transition">
            <Link href={`/${brand}/models/${model}/${category}/${(part.code||"").toLowerCase()}`} className="block">
              <div className="flex flex-col items-center">
                <div className="relative w-full h-36 bg-white/5 rounded overflow-hidden">
                  <Image
                    src={`/parts/${part.imageFile || "example.png"}`}
                    alt={part.name || part.code}
                    fill
                    className="object-contain p-3 group-hover:scale-105 transition"
                  />
                </div>
                <h2 className="mt-3 text-base font-semibold text-white group-hover:text-blue-400 transition">
                  {part.name}
                </h2>
                <p className="text-sm text-white/70">Код: {part.code}</p>
                {part.color ? <p className="text-sm text-white/70">Цвет: {part.color}</p> : null}
                <p className="text-md font-bold mt-2">{Number(part.price)} ฿</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
