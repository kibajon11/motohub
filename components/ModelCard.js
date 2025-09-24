import Link from "next/link";
import { slugify } from "../lib/utils";

export default function ModelCard({ brandSlug, model }) {
  return (
    <li className="group relative overflow-hidden rounded-xl border bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-tight">{model.name}</h3>
        <span className="badge">{model.year}</span>
      </div>

      <p className="mt-1 text-sm text-gray-600">Оригинальные и аналоговые запчасти.</p>

      <div className="mt-3">
        <Link
          href={`/${brandSlug}/models/${slugify(model.name)}`}
          className="text-sm font-medium text-blue-700 underline-offset-4 hover:underline"
        >
          Открыть карточку модели
        </Link>
      </div>

      {/* Лёгкий блик при hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-white/0 to-white/30" />
      </div>
    </li>
  );
}
