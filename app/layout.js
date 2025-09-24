import "../styles/globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata = {
  title: "MotoHub — Каталог запчастей",
  description: "Каталог запчастей: Honda, Yamaha, Kawasaki. Pattaya, Thailand",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={`${inter.className} min-h-screen`}>
        <div className="container py-6">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
