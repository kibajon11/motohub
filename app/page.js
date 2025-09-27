import Link from "next/link";

const BRANDS = [
  { slug: "honda", name: "Honda" },
  { slug: "yamaha", name: "Yamaha" },
  { slug: "kawasaki", name: "Kawasaki" },
];

export default function HomePage() {
  return (
    <section>
      <h1 className="mb-6 text-3xl font-extrabold">MotoHub — выберите бренд</h1>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BRANDS.map((b) => (
          <li key={b.slug} className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
            <Link href={`/${b.slug}`} className="block">
              <div className="text-xl font-bold">{b.name}</div>
              <div className="text-white/70 text-sm mt-2">Перейти к моделям →</div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}