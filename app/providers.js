'use client';

import { ThemeProvider } from 'next-themes';
import { CartProvider } from '@/lib/cart-context';

export default function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <CartProvider>
        {children}
      </CartProvider>
    </ThemeProvider>
  );
}
