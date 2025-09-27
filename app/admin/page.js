'use client';

import React from "react";
import AdminHelper from "../../components/AdminHelper";

function slugify(str = "") {
  return String(str).toLowerCase().trim().replace(/\s+/g, "-");
}

const MASTER_CATEGORIES = [
  { name: "Body (Plastic)", slug: "body" },
  { name: "Engine", slug: "engine" },
  { name: "Transmission", slug: "transmission" },
  { name: "Suspension", slug: "suspension" },
  { name: "Brakes", slug: "brakes" },
  { name: "Electrical", slug: "electrical" },
  { name: "Exhaust", slug: "exhaust" },
  { name: "Cooling", slug: "cooling" },
  { name: "Fuel System", slug: "fuel" },
  { name: "Controls & Cables", slug: "controls" },
  { name: "Wheels & Tires", slug: "wheels" },
  { name: "Lighting", slug: "lighting" },
  { name: "Accessories", slug: "accessories" },
];

export default function AdminPage() {
  const [brandsMap, setBrandsMap] = React.useState(null);
  const [brand, setBrand] = React.useState("");
  const [model, setModel] = React.useState("");
  const [category, setCategory] = React.useState("");

  const [name, setName] = React.useState("");
  const [code, setCode] = React.useState("");
  const [color, setColor] = React.useState("");
  const [priceTHB, setPriceTHB] = React.useState("");
  const [stockQty, setStockQty] = React.useState("");
  const [imageFile, setImageFile] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const [busyManual, setBusyManual] = React.useState(false);
  const [msgManual, setMsgManual] = React.useState("");

  const [fileXlsx, setFileXlsx] = React.useState(null);
  const [busyUpload, setBusyUpload] = React.useState(false);
  const [msgUpload, setMsgUpload] = React.useState("");

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/models", { cache: "no-store" });
        const json = await res.json();
        if (mounted) setBrandsMap(json?.brands || {});
      } catch {
        if (mounted) setBrandsMap({});
      }
    })();
    return () => { mounted = false; };
  }, []);

  const brandList = React.useMemo(() => Object.keys(brandsMap || {}), [brandsMap]);
  const modelList = React.useMemo(() => (brand ? (brandsMap?.[brand] || []) : []), [brand, brandsMap]);

  async function onSubmitManual(e) {
    e.preventDefault();
    setBusyManual(true);
    setMsgManual("");
    try {
      if (!brand || !model || !category) {
        setMsgManual("Заполни бренд, модель и категорию.");
        return;
      }
      if (!name || !code) {
        setMsgManual("Название и код детали обязательны.");
        return;
      }
      const res = await fetch(`/api/parts/${brand}/${slugify(model)}/${category}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          code,
          color,
          priceTHB: Number(priceTHB || 0),
          stockQty: Number(stockQty || 0),
          imageFile,
          notes,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMsgManual(`Ошибка: ${json?.error || res.statusText}`);
      } else {
        setMsgManual("✅ Деталь добавлена в Excel!");
        setName(""); setCode(""); setColor(""); setPriceTHB(""); setStockQty(""); setImageFile(""); setNotes("");
      }
    } catch (err) {
      setMsgManual(`Ошибка сети: ${String(err)}`);
    } finally {
      setBusyManual(false);
    }
  }

  async function onSubmitUpload(e) {
    e.preventDefault();
    setBusyUpload(false);
    setMsgUpload("");
    try {
      if (!brand || !model || !category) {
        setMsgUpload("Выбери бренд, модель и категорию.");
        return;
      }
      if (!fileXlsx) {
        setMsgUpload("Выбери Excel-файл (.xlsx).");
        return;
      }
      const formData = new FormData();
      formData.append("file", fileXlsx);
      const res = await fetch(`/api/admin/upload/${brand}/${slugify(model)}/${category}`, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        setMsgUpload(`Ошибка: ${json?.error || res.statusText}`);
      } else {
        setMsgUpload("✅ Файл загружен и заменён! Категория обновлена.");
        setFileXlsx(null);
        (document.getElementById("xlsx-input") || {}).value = "";
      }
    } catch (err) {
      setMsgUpload(`Ошибка сети: ${String(err)}`);
    } finally {
      setBusyUpload(false);
    }
  }

  return (
    <section className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-6">
        <h1 className="text-3xl font-extrabold">Админ-панель</h1>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 text-xl font-bold">Шаг 1. Выбор места</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Бренд</label>
              <select value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full rounded-md border border-white/15 bg-white/10 p-2">
                <option value="">—</option>
                {brandList.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Модель</label>
              <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full rounded-md border border-white/15 bg-white/10 p-2">
                <option value="">—</option>
                {modelList.map((m) => <option key={m.name} value={m.name}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Категория</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md border border-white/15 bg-white/10 p-2">
                <option value="">—</option>
                {MASTER_CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 text-xl font-bold">Шаг 2A. Добавить/обновить деталь (вручную)</h2>
          <form onSubmit={onSubmitManual} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Название детали *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-white/15 bg-white/10 p-2" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Код детали (уникальный) *</label>
                <input value={code} onChange={(e) => setCode(e.target.value)} className="w-full rounded-md border border-white/15 bg-white/10 p-2" required />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Цвета (через запятую)</label>
                <input value={color} onChange={(e) => setColor(e.target.value)} placeholder="Black, White" className="w-full rounded-md border border-white/15 bg-white/10 p-2" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Цена THB</label>
                <input value={priceTHB} onChange={(e) => setPriceTHB(e.target.value)} type="number" min="0" className="w-full rounded-md border border-white/15 bg-white/10 p-2" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Сток (шт)</label>
                <input value={stockQty} onChange={(e) => setStockQty(e.target.value)} type="number" min="0" className="w-full rounded-md border border-white/15 bg-white/10 p-2" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Имя файла картинки (в /public/parts)</label>
              <input value={imageFile} onChange={(e) => setImageFile(e.target.value)} placeholder="front-fairing-red.png" className="w-full rounded-md border border-white/15 bg-white/10 p-2" />
              <p className="mt-1 text-xs text-white/60">PNG/JPG, 500×300, латиница, без пробелов. Файл положи в <code>public/parts/</code>.</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Описание (Notes)</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-md border border-white/15 bg-white/10 p-2" />
            </div>

            <button type="submit" disabled={busyManual || !brand || !model || !category} className={`btn-primary ${(!brand || !model || !category) ? "opacity-50 cursor-not-allowed" : ""}`}>
              {busyManual ? "Сохраняю…" : "Добавить в Excel"}
            </button>
            {msgManual && <p className="text-sm mt-2">{msgManual}</p>}
          </form>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 text-xl font-bold">Шаг 2B. Импорт Excel (замена parts_*.xlsx)</h2>
          <form onSubmit={onSubmitUpload} className="space-y-4">
            <div>
              <input id="xlsx-input" type="file" accept=".xlsx" onChange={(e) => setFileXlsx(e.target.files?.[0] || null)} className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700" />
              <p className="mt-2 text-xs text-white/60">
                Файл заменит текущий <code>parts_*.xlsx</code> в выбранной категории.
              </p>
            </div>
            <button type="submit" disabled={busyUpload || !brand || !model || !category || !fileXlsx} className={`btn-primary ${(!brand || !model || !category || !fileXlsx) ? "opacity-50 cursor-not-allowed" : ""}`}>
              {busyUpload ? "Загружаю…" : "Загрузить и заменить Excel"}
            </button>
            {msgUpload && <p className="text-sm mt-2">{msgUpload}</p>}
          </form>
        </div>
      </div>

      <div className="md:col-span-1">
        <AdminHelper />
      </div>
    </section>
  );
}