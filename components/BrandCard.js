import Link from "next/link";

export default function BrandCard({ brand }) {
  return (
    <li className="card">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{brand.name}</h3>
        <span className="badge">{brand.models.length} моделей</span>
      </div>
      <div className="mt-2 flex gap-4">
        <Link href={`/${brand.slug}`} className="text-sm font-medium">
          Перейти к моделям
        </Link>
        <Link href={`/${brand.slug}/models/${brand.models[0]?.name ? brand.models[0].name.toLowerCase().replace(/\s+/g,"-") : ""}`} className="text-sm text-gray-600">
          {brand.models[0]?.name ? `Открыть ${brand.models[0].name}` : "Моделей пока нет"}
        </Link>
      </div>
    </li>
  );
}
