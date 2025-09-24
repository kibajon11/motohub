'use client';

import React from "react";
import Link from "next/link";
import ModelImage from "../../components/ModelImage";

function slugify(str = "") {
  return str.toLowerCase().trim().replace(/\s+/g, "-");
}

export default function BrandPage({ params }) {
  const { brand: brandSlug } = React.use(params);
  const [models, setModels] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await fetch("/api/models", { cache: "no-store" });
        const data = await res.json();
        const list = data?.brands?.[brandSlug] || [];
        if (isMounted) setModels(list);
      } catch (e) {
        if (isMounted) setModels([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [brandSlug]);

  const themes = {
    honda: { gradient: "from-red-600/90 to-red-800/90", logo: "/brands/honda.png" },
    yamaha:{ gradient: "from-blue-600/90 to-blue-800/90", logo: "/brands/yamaha.png" },
    kawasaki:{ gradient: "from-green-600/90 to-green-800/90", logo: "/brands/kawasaki.png" },
  };
  const theme = themes[brandSlug] ?? { gradient: "from-gray-700/90 to-gray-900/90", logo: "" };

  return (
    <section>
      {/* Баннер */}
      <div className={`relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r ${theme.gradient} shadow-lg`}>
        <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16 text-center text-white">
          {theme.logo ? (
            <img src={theme.logo} alt={brandSlug} className="mb-4 h-14 w-36 object-contain drop-shadow-lg" />
          ) : null}
          <h1 className="text-4xl font-extrabold capitalize">{brandSlug}</h1>
          <p className="mt-2 text-gray-100">Каталог моделей {brandSlug}</p>
        </div>
      </div>

      {/* Список моделей из Excel */}
      {loading ? (
        <p className="text-gray-600">Загрузка моделей…</p>
      ) : models.length === 0 ? (
        <p className="text-gray-600">Пока нет моделей за 2023–2025.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((m) => {
            const s = slugify(m.name);
            return (
              <li key={s} className="group relative overflow-hidden rounded-2xl bg-white shadow hover:shadow-xl transition transform hover:-translate-y-1">
                <Link href={`/${brandSlug}/models/${s}`}>
                  <div className="relative h-32 w-full bg-gray-100">
                    <ModelImage
                      src={`/models/${s}.png`}
                      alt={m.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{m.name}</h3>
                    <p className="text-sm text-gray-500">
                      Годы: {m.from ?? "?"}–{m.to ?? "?"}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-8">
        <Link href="/" className="text-sm text-gray-600 hover:text-black">
          ← Назад к брендам
        </Link>
      </div>
    </section>
  );
}
