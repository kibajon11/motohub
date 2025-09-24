export const metadata = { title: "Корзина — MotoHub" };

export default function CartPage() {
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Корзина</h1>
      <div className="card">
        <p className="text-gray-700">
          Корзина пока пуста. Добавьте товары из каталога.
        </p>
      </div>
    </section>
  );
}
