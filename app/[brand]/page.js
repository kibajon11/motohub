import Link from "next/link";

function slugify(str = "") {
  return String(str).toLowerCase().trim().replace(/\s+/g, "-");
}

export default async function BrandPage({ params }) {
  // В Next 15 params — Promise; тут корректно его await-им
  const { brand } = await params;

  // Читаем модели через стабильный API (не трогаем формат Excel)
  let models = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/models`, {
      cache: "no-store",
      // На dev можно без BASE_URL, но на всякий случай подстрахуемся:
      // если пусто — ниже повторим запрос относительным путём
    });
    if (res.ok) {
      const data = await res.json();
      models = data?.brands?.[brand] || [];
    }
    if (!models.length) {
      // Повторяем относительным путём (для dev)
      const res2 = await fetch("/api/models", { cache: "no-store" });
      if (res2.ok) {
        const data2 = await res2.json();
        models = data2?.brands?.[brand] || [];
      }
    }
  } catch (_) {
    // Если API недоступно — оставим models пустым
    models = [];
  }

  if (!models.length) {
    return (
      <div className="p-6 text-red-400">
        Для бренда «{brand}» модели не найдены. Проверь <code>public/data/models.xlsx</code>.
      </div>
    );
  }

  return (
    <section>
      <h1 className="mb-6 text-3xl font-extrabold capitalize">{brand} — модели</h1>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {models.map((m) => {
          const slug = slugify(m.name);
          return (
            <li
              key={m.name}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
            >
              <Link href={`/${brand}/models/${slug}`} className="block">
                <div className="relative h-40 w-full rounded-lg bg-white/10" />
                <div className="mt-4 text-xl font-bold">{m.name}</div>
                <div className="text-white/70 text-sm mt-1">Открыть категории →</div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
