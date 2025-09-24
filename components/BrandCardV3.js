'use client';

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BrandCardV3({ brand }) {
  const router = useRouter();

  const theme = {
    honda:   { bg: "from-[#0f141b] via-[#111827] to-[#101316]", halo: "bg-[#ea4335]/25" },
    yamaha:  { bg: "from-[#0a142b] via-[#0b1b3a] to-[#0f1a2b]", halo: "bg-[#1a73e8]/25" },
    kawasaki:{ bg: "from-[#031c17] via-[#052e24] to-[#061d18]", halo: "bg-[#10b981]/25" },
  }[brand.slug] ?? { bg:"from-[#0e1116] via-[#111827] to-[#0f1318]", halo:"bg-white/10" };

  const firstModel = brand.models?.[0];

  return (
    <li className="group brand-tilt brand-glow relative overflow-hidden rounded-2xl shadow-sm transition">
      <Link href={`/${brand.slug}`} className="block relative h-full w-full">
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg}`} />
        <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl ${theme.halo}`} />

        <div className="relative rounded-2xl ring-1 ring-white/10 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-24 sm:h-12 sm:w-28">
              <Image
                src={`/brands/${brand.slug}.png`}
                alt={brand.name}
                fill
                className="object-contain logo-glow"
                sizes="(max-width: 640px) 96px, 112px"
              />
            </div>
            <span className="rounded bg-white/15 px-2 py-0.5 text-xs text-white/90">
              {brand.models.length} моделей
            </span>
          </div>

          {firstModel && (
            <div className="mt-4 text-sm text-white/90">
              Быстрый переход:{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/${brand.slug}/models/${firstModel.name.toLowerCase().replace(/\s+/g, "-")}`);
                }}
                className="underline underline-offset-4 hover:text-white"
              >
                {firstModel.name}
              </button>
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-white/0 to-white/10" />
        </div>
      </Link>
    </li>
  );
}
