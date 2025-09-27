export default function AdminHelper() {
  return (
    <aside className="sticky top-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-relaxed">
      <h3 className="mb-3 text-lg font-bold">Памятка по админке</h3>
      <ol className="list-decimal pl-4 space-y-2 text-white/85">
        <li>Сначала выбери <b>Бренд → Модель → Категорию</b>.</li>
        <li>Для <b>ручного добавления</b> заполни поля и нажми «Добавить в Excel». Файл parts_*.xlsx создастся/обновится автоматически.</li>
        <li>Для <b>импорта Excel</b> выбери .xlsx и нажми «Загрузить и заменить Excel». Текущий файл parts_*.xlsx будет заменён.</li>
        <li>Картинки деталей положи в <code>public/parts/</code>, а имя файла укажи в поле «Имя файла картинки» (например <code>front-fairing-red.png</code>).</li>
        <li>Рекомендуемый размер фото: <b>500×300</b>, фон прозрачный или светлый, формат PNG/JPG. Имя файла — латиница, без пробелов (используй дефисы).</li>
        <li>Цвета перечисляй через запятую (например: <code>Black, Red</code>). На странице детали можно будет выбрать цвет.</li>
        <li>Сток автоматически уменьшится после покупки (в следующем этапе добавим запись заказа и отчёты).</li>
      </ol>
      <p className="mt-4 text-xs text-white/60">Файлы с данными лежат в <code>public/data/&lt;brand&gt;/&lt;model&gt;/</code>. Категории — <code>categories.xlsx</code>, детали — <code>parts_*.xlsx</code>.</p>
    </aside>
  );
}
