import Link from "next/link";
import Image from "next/image";

const BRANDS = [
  { name: "Honda", slug: "honda", logo: "/logos/honda.png" },
  { name: "Yamaha", slug: "yamaha", logo: "/logos/yamaha.png" },
  { name: "Kawasaki", slug: "kawasaki", logo: "/logos/kawasaki.png" },
];

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <section className="py-8">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
        MotoHub — выберите бренд
      </h1>

      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {BRANDS.map((b) => (
          <li key={b.slug} className="group relative rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/[0.08] transition">
            <Link href={`/${b.slug}`} className="block">
              <div className="relative h-24 w-full rounded bg-white/5">
                <Image
                  src={b.logo || "/placeholder.png"}
                  alt={b.name}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition"
                />
              </div>
              <h2 className="mt-4 text-lg font-semibold">{b.name}</h2>
              <p className="text-sm text-white/70">Перейти к моделям →</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
