import Image from "next/image";
import Link from "next/link";

export default function BrandCardV1({ brand }) {
  const map = {
    honda: { logo: "/brands/honda.svg" },
    yamaha: { logo: "/brands/yamaha.svg" },
    kawasaki: { logo: "/brands/kawasaki.svg" },
  };
  const cfg = map[brand.slug] ?? { logo: "/brands/honda.svg" };

  return (
    <li className="group relative overflow-hidden rounded-xl border bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-20">
            <Image src={cfg.logo} alt={brand.name} fill className="object-contain" />
          </div>
          <span className="badge">{brand.models.length} моделей</span>
        </div>

        <div className="mt-3 flex gap-5">
          <Link href={`/${brand.slug}`} className="font-medium">Перейти к моделям</Link>
          {brand.models[0] && (
            <Link href={`/${brand.slug}/models/${brand.models[0].name.toLowerCase().replace(/\s+/g,"-")}`}
                  className="text-gray-600 hover:text-gray-800">
              Открыть {brand.models[0].name}
            </Link>
          )}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-black/0 via-black/10 to-black/0 opacity-0 transition group-hover:opacity-100" />
    </li>
  );
}
