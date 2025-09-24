import Image from "next/image";
import Link from "next/link";

const bg = {
  honda: "from-[#EA4335] to-[#ff6b6b]",
  yamaha: "from-[#1A73E8] to-[#60a5fa]",
  kawasaki: "from-[#10B981] to-[#34d399]",
};

export default function BrandCardV2({ brand }) {
  const g = bg[brand.slug] ?? "from-gray-200 to-gray-300";
  return (
    <li className="relative overflow-hidden rounded-2xl border shadow-sm">
      <div className={`absolute inset-0 bg-gradient-to-br ${g} opacity-90`} />
      <div className="relative p-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-20">
            <Image src={`/brands/${brand.slug}.svg`} alt={brand.name} fill className="object-contain drop-shadow" />
          </div>
          <span className="badge bg-white/80 text-gray-800">{brand.models.length} моделей</span>
        </div>

        <div className="mt-3 flex gap-5 text-white">
          <Link href={`/${brand.slug}`} className="font-semibold underline-offset-4 hover:underline">
            Перейти к моделям
          </Link>
          {brand.models[0] && (
            <Link href={`/${brand.slug}/models/${brand.models[0].name.toLowerCase().replace(/\s+/g,"-")}`}
                  className="opacity-90 hover:opacity-100">
              Открыть {brand.models[0].name}
            </Link>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 scale-105 bg-[radial-gradient(ellipse_at_top,white_0%,transparent_60%)] opacity-40 transition group-hover:opacity-50" />
    </li>
  );
}
