import "../styles/globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Inter } from "next/font/google";
import { CartProvider } from "../components/CartProvider";

const inter = Inter({ subsets: ["latin", "cyrillic"], display: "swap" });

export const metadata = {
  title: "MotoHub — Каталог запчастей",
  description: "Каталог запчастей: Honda, Yamaha, Kawasaki. Pattaya, Thailand",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white`}>
        <CartProvider>
          <div className="container mx-auto px-4 py-6">
            <Header />
            <main className="py-6">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}