import './globals.css';
import Providers from './providers';
import Header from '@/components/Header';

export const metadata = {
  title: 'MotoHub',
  description: 'Parts • Pattaya • Thailand',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-neutral-950 text-slate-100">
        <Providers>
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Header />
            <main className="pb-10">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
