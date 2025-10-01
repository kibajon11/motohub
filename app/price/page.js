import Link from "next/link";

export const metadata = { title: "Прайс — MotoHub" };

export default function PricePage() {
  return (
    <section>
      <h1 className="mb-6 text-3xl font-extrabold">Прайс</h1>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
        <p className="text-white/80">
          Скачайте базовый список моделей (Excel):{" "}
          <a className="text-blue-300 underline" href="/data/models.xlsx" download>
            /public/data/models.xlsx
          </a>
        </p>

        <p className="text-sm text-white/60">
          Категории и детали лежат в <code>public/data/&lt;brand&gt;/&lt;model&gt;/</code> (файлы
          <code> categories.xlsx</code> и <code>parts_*.xlsx</code>). В ближайшие шаги добавим сборку полного прайса по всем моделям.
        </p>

        <div className="pt-2">
          <Link href="/" className="btn-primary">На главную</Link>
        </div>
      </div>
    </section>
  );
}
