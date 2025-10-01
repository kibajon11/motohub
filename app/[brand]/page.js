"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function BrandPage({ params }) {
  const brand = React.use(params).brand;

  const [models, setModels] = React.useState([]);
  const [state, setState] = React.useState({ loading: true, error: "" });

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setState({ loading: true, error: "" });
        const res = await fetch("/api/models", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!alive) return;
        setModels(data?.brands?.[brand] || []);
        setState({ loading: false, error: "" });
      } catch (e) {
        if (!alive) return;
        setState({ loading: false, error: String(e) });
      }
    })();
    return () => { alive = false; };
  }, [brand]);

  if (state.loading) return <div className="p-6">Загрузка моделей…</div>;
  if (state.error)   return <div className="p-6 text-red-400">Ошибка: {state.error}</div>;
  if (!models.length) {
    return (
      <div className="p-6 text-red-400">
        Для бренда «{brand}» модели не найдены. Проверь <code>public/data/models.xlsx</code>.
      </div>
    );
  }

  return (
    <section className="p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 capitalize">{brand} — модели</h1>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {models.map((m) => (
          <li key={m.slug || m.name}
              className="group rounded-xl border border-white/10 bg-[#141922] p-4 hover:bg-white/[0.08] transition">
            <Link href={`/${brand}/models/${m.slug || (m.name||"").toLowerCase().replace(/\s+/g,"-")}`} className="block">
              <div className="relative h-40 w-full rounded bg-white/5 overflow-hidden">
                <Image
                  src={`/models/${m.imageFile || "placeholder.png"}`}
                  alt={m.name || "model"}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition"
                />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-white">{m.name}</h2>
              {m.years ? <p className="text-sm text-white/60">{m.years}</p> : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
