import { brands } from "../lib/brands";
import BrandCard from "../components/BrandCardV3";

export default function HomePage() {
  return (
    <section>
      {/* HERO */}
      <div className="relative mb-12 overflow-hidden rounded-3xl shadow-2xl hero-gradient hero-noise">
        <div className="pointer-events-none absolute -left-24 top-0 h-full w-72 rotate-6 bg-gradient-to-b from-red-600/10 to-transparent blur-2xl" />
        <div className="pointer-events-none absolute -right-24 top-10 h-2/3 w-72 -rotate-6 bg-gradient-to-b from-blue-500/10 to-transparent blur-2xl" />

        <div className="relative z-10 flex flex-col items-center px-6 py-20 text-center text-white">
          <div className="flex items-center gap-3 animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth="2"
                 className="h-10 w-10 text-red-500 animate-glow">
              <path d="M5 16h.01M19 16h.01M13 16h-2M5 16a7 7 0 0114 0" />
            </svg>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
              <span className="text-white">Moto</span>
              <span className="text-red-500">Hub</span>
            </h1>
          </div>

          <p className="mt-4 max-w-2xl text-lg text-gray-200 animate-fade-in-delay">
            Каталог запчастей и аксессуаров для <b>Honda</b>, <b>Yamaha</b>, <b>Kawasaki</b>.
          </p>

          <a href="#brands"
             className="mt-8 inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-red-700 animate-fade-in-delay-2">
            Перейти к брендам
          </a>
        </div>
      </div>

      {/* Бренды */}
      <h2 id="brands" className="mb-6 text-2xl font-bold tracking-tight text-gray-900">
        Выберите бренд
      </h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b) => (
          <BrandCard key={b.slug} brand={b} />
        ))}
      </ul>
    </section>
  );
}
