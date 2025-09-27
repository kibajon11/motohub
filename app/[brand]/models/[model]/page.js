import React from "react";
import Link from "next/link";

const CATEGORIES = [
  { name: "Body (Plastic)", slug: "body" },
  { name: "Engine", slug: "engine" },
  { name: "Transmission", slug: "transmission" },
  { name: "Suspension", slug: "suspension" },
  { name: "Brakes", slug: "brakes" },
  { name: "Electrical", slug: "electrical" },
  { name: "Exhaust", slug: "exhaust" },
  { name: "Cooling", slug: "cooling" },
  { name: "Fuel System", slug: "fuel" },
  { name: "Controls & Cables", slug: "controls" },
  { name: "Wheels & Tires", slug: "wheels" },
  { name: "Lighting", slug: "lighting" },
  { name: "Accessories", slug: "accessories" },
];

export default function ModelPage({ params }) {
  const { brand, model } = React.use(params);

  return (
    <section>
      <h1 className="mb-6 text-3xl font-extrabold capitalize">
        {brand} / {model.replace(/-/g, " ")} — категории
      </h1>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => (
          <li key={c.slug} className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
            <Link href={`/${brand}/models/${model}/${c.slug}`} className="block">
              <div className="text-xl font-bold">{c.name}</div>
              <div className="text-white/70 text-sm mt-2">Открыть детали →</div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}