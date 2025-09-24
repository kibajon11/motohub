import { brands } from "../../lib/brands";

export const metadata = {
  title: "Прайс-листы — MotoHub",
  description: "Скачайте общий прайс или отдельные прайс-листы по брендам Honda, Yamaha, Kawasaki",
};

export default function PricePage() {
  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold tracking-tight">📄 Прайс-листы</h1>

      {/* Общий прайс */}
      <div className="mb-10 rounded-xl border bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white shadow-md">
        <h2 className="mb-2 text-xl font-semibold">Общий прайс-лист</h2>
        <p className="mb-4 text-sm text-white/80">
          Содержит все позиции по Honda, Yamaha и Kawasaki в одном файле.
        </p>
        <a
          href="/price/all.pdf"
          className="inline-block rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow hover:bg-gray-100"
          download
        >
          📥 Скачать общий прайс
        </a>
      </div>

      {/* Прайсы по брендам */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b) => (
          <div
            key={b.slug}
            className="rounded-xl border bg-white p-6 shadow-sm ring-1 ring-black/5"
          >
            <h2 className="mb-2 text-xl font-semibold">{b.name}</h2>
            <p className="mb-4 text-sm text-gray-600">
              Скачайте актуальный прайс-лист на запчасти {b.name}.
            </p>
            <a
              href={`/price/${b.slug}.pdf`}
              className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
              download
            >
              📥 Скачать прайс {b.name}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
