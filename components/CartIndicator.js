'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useEffect, useState } from 'react';

export default function CartIndicator() {
  const { totalQty, hydrated } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const qty = mounted && hydrated ? totalQty : undefined;

  return (
    <Link href="/cart" className="relative inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 hover:border-white/30">
      <span className="inline-block">🛒</span>
      {qty !== undefined && <span className="text-sm font-medium">{qty}</span>}
    </Link>
  );
}
