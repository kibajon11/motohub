'use client';

import { useCart } from '@/lib/cart-context';

export default function AddToCartButton({ product }) {
  const { add } = useCart();
  return (
    <button
      onClick={() =>
        add(
          {
            id: String(product.id),
            title: product.title,
            price: Number(product.price) || 0,
            image: product.image || '',
          },
          1
        )
      }
      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
    >
      В корзину
    </button>
  );
}
