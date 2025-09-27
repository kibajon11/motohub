'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Menu, X, ShoppingCart, MessageCircle } from "lucide-react";
import { useCart } from "./CartProvider";

const BRANDS = [
  { slug: "honda", name: "Honda" },
  { slug: "yamaha", name: "Yamaha" },
  { slug: "kawasaki", name: "Kawasaki" },
];

const WHATSAPP_NUMBER = "66812345678"; // замени

function formatTHB(n) {
  return (n || 0).toLocaleString("en-US");
}

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const { totalQty, totalPriceTHB } = useCart();

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="mb-6">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/5 p-3 sm:p-4 shadow-lg shadow-black/20">
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="group inline-flex items-center gap-3">
            <div className="relative">
              <span className="inline-block h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 group-hover:scale-105 transition-transform"></span>
              <span className="absolute inset-0 m-auto h-10 w-10 rounded-xl ring-1 ring-white/15"></span>
              <span className="absolute inset-0 -z-10 blur-md bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors"></span>
            </div>
            <div className="leading-tight">
              <div className="text-xl sm:text-2xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">MotoHub</span>
              </div>
              <div className="text-[11px] sm:text-xs text-white/60">Parts • Pattaya • Thailand</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {BRANDS.map((b) => (
              <Link
                key={b.slug}
                href={`/${b.slug}`}
                className="rounded-xl px-3 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 transition"
              >
                {b.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/20 transition"
              aria-label="WhatsApp"
              title="Написать в WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Cart with total price */}
            <Link
              href="/cart"
              className="relative inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
              aria-label="Корзина"
              title="Корзина"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:flex items-baseline gap-1">
                <span>฿</span>
                <span className="font-semibold">{formatTHB(totalPriceTHB)}</span>
              </span>
              {totalQty > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[1.5rem] rounded-full bg-blue-600 px-1.5 py-0.5 text-center text-[11px] font-bold">
                  {totalQty}
                </span>
              )}
            </Link>

            {/* Burger */}
            <button
              className="md:hidden inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 p-2 hover:bg-white/10 transition"
              onClick={() => setOpen((v) => !v)}
              aria-label="Меню"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile panel */}
        {open && (
          <div className="mt-3 grid gap-2 md:hidden">
            {BRANDS.map((b) => (
              <Link
                key={b.slug}
                href={`/${b.slug}`}
                className="rounded-xl px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 transition"
              >
                {b.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
