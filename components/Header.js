'use client';

import React, { useState } from "react";
import Link from "next/link";
import { Bike, ShoppingCart, MessageCircle, Menu, X, Search } from "lucide-react";

// 🔧 замени на свой номер без плюса и пробелов
const WHATSAPP_NUMBER = "66812345678";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const NAV = [
  { href: "/honda", label: "Honda" },
  { href: "/yamaha", label: "Yamaha" },
  { href: "/kawasaki", label: "Kawasaki" },
  { href: "/price", label: "Прайс" },
  { href: "/admin", label: "Админ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 mb-8">
      <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 px-4 py-3 shadow-xl backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          {/* ЛОГО */}
          <Link href="/" className="flex items-center gap-2 text-white hover:opacity-90" onClick={() => setOpen(false)}>
            <Bike className="h-6 w-6 text-red-500" />
            <span className="text-xl font-extrabold tracking-tight">MotoHub</span>
          </Link>

          {/* ПОИСК (desktop) */}
          <div className="hidden md:flex flex-1 justify-center px-4">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Поиск модели или детали…"
                className="w-full rounded-full border border-white/15 bg-white/10 pl-10 pr-4 py-2 text-sm text-white placeholder-white/60 outline-none transition focus:bg-white/15"
              />
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-white/70" />
            </div>
          </div>

          {/* НАВ + ДЕЙСТВИЯ (desktop) */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-5 text-sm font-medium text-white/80">
              {NAV.map((i) => (
                <Link key={i.href} href={i.href} className="hover:text-white underline-offset-4 hover:underline">
                  {i.label}
                </Link>
              ))}
            </nav>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-green-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-green-700"
              title="Написать в WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>

            <Link href="/cart" className="relative inline-flex items-center text-white hover:text-blue-300" title="Корзина">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                0
              </span>
            </Link>
          </div>

          {/* БУРГЕР (mobile) */}
          <button
            className="md:hidden inline-flex items-center rounded-lg px-2 py-1.5 text-white hover:bg-white/10"
            aria-label="Открыть меню"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* ДРОПДАУН (mobile) */}
        {open && (
          <div className="md:hidden mt-3 border-t border-white/10 pt-3 text-white">
            <div className="mb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск модели или детали…"
                  className="w-full rounded-lg border border-white/15 bg-white/10 pl-10 pr-3 py-2 text-sm text-white placeholder-white/60 outline-none"
                />
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-white/70" />
              </div>
            </div>

            <nav className="flex flex-col gap-1 text-base">
              {NAV.map((i) => (
                <Link
                  key={i.href}
                  href={i.href}
                  className="rounded-md px-2 py-2 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  {i.label}
                </Link>
              ))}

              <div className="mt-2 flex items-center gap-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700"
                  onClick={() => setOpen(false)}
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
                <Link
                  href="/cart"
                  className="relative inline-flex items-center justify-center rounded-md bg-white/10 p-2 hover:bg-white/15"
                  onClick={() => setOpen(false)}
                  title="Корзина"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    0
                  </span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
