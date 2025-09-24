'use client';

import React from "react";
import Link from "next/link";
import ModelImage from "../../../../components/ModelImage";

function slugify(str = "") {
  return str.toLowerCase().trim().replace(/\s+/g, "-");
}

export default function ModelPage({ params }) {
  const { brand: brandSlug, model: modelSlug } = React.use(params);
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(`/api/categories/${brandSlug}/${modelSlug}`, { cache: "no-store" });
        const data = await res.json();
        if (mounted) setCategories(data?.categories || []);
      } catch (e) {
        if (mounted) setCategories([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [brandSlug, modelSlug]);

  return (
    <section>
      {/* Баннер модели */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 to-black text-white shadow-lg">
        <div className="relative z-10 flex flex-col items-center px-6 py-14 text-center">
          <h1 className="text-4xl font-extrabold uppercase">
            {brandSlug} — {modelSlug.replace(/-/g, " ")}
          </h1>
          <p className="mt-2 text-gray-300">Выберите категорию деталей</p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600">Загрузка категорий…</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-600">Категории не найдены.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const img = c.imageFile ? `/categories/${c.imageFile}` : `/placeholder.png`;
            return (
              <li key={c.slug} className="group relative overflow-hidden rounded-2xl bg-white shadow hover:shadow-xl transition transform hover:-translate-y-1">
                <Link href={`/${brandSlug}/models/${modelSlug}/${c.slug}`}>
                  <div className="relative h-32 w-full bg-gray-100">
                    <ModelImage
                      src={img}
                      alt={c.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{c.name}</h3>
                    <p className="text-sm text-gray-500">Открыть детали</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-8 flex gap-6 text-sm">
        <Link href={`/${brandSlug}`}>← К моделям {brandSlug}</Link>
        <Link href="/">На главную</Link>
      </div>
    </section>
  );
}
