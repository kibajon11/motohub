'use client';

import React, { Fragment } from "react";
import AdminHelper from "../../components/AdminHelper";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronsUpDown, Check, Loader2, Trash2, Save, Download } from "lucide-react";

/* ======================= ВСПОМОГАТЕЛЬНЫЕ ======================= */

function slugify(str = "") {
  return String(str).toLowerCase().trim().replace(/\s+/g, "-");
}
const fmt = (n) => (Number(n) || 0).toLocaleString("en-US");

function validatePart(p) {
  const errors = [];
  if (!p.name) errors.push("Название обязательно");
  if (!p.code) errors.push("Код обязателен");
  if (Number.isNaN(Number(p.priceTHB))) errors.push("Цена должна быть числом");
  if (Number.isNaN(Number(p.stockQty))) errors.push("Сток должен быть числом");
  return errors;
}

/* ======================= ТЁМНЫЙ SELECT ======================= */

function Select({ label, value, onChange, options, placeholder = "—", disabled = false }) {
  const current = options.find(o => o.value === value) || null;
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-white/80">{label}</label>}
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <Listbox.Button
            className={`relative w-full cursor-default rounded-xl py-2.5 pl-4 pr-10 text-left text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
            ${disabled ? 'bg-neutral-800/40 border border-white/10 opacity-60' : 'bg-neutral-800/80 border border-white/10 hover:bg-neutral-800'}`}
          >
            <span className={`block truncate ${!current ? "text-white/50" : ""}`}>
              {current ? current.label : placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronsUpDown className="h-5 w-5 text-white/60" />
            </span>
          </Listbox.Button>
          {!disabled && (
            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
              <Listbox.Options className="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-neutral-900 border border-white/10 py-1 text-sm shadow-lg focus:outline-none">
                {options.length === 0 && <div className="px-3 py-2 text-white/60">нет данных</div>}
                {options.map((opt) => (
                  <Listbox.Option
                    key={opt.value}
                    value={opt.value}
                    className={({ active }) =>
                      `relative cursor-pointer select-none px-3 py-2 ${active ? "bg-white/10 text-white" : "text-white/90"}`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? "font-semibold" : "font-normal"}`}>
                          {opt.label}
                        </span>
                        {selected && <span className="absolute inset-y-0 right-3 flex items-center"><Check className="h-4 w-4" /></span>}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          )}
        </div>
      </Listbox>
    </div>
  );
}

/* ======================= ОСНОВНАЯ СТРАНИЦА ======================= */

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
  /* ---------- Флаг монтирования (больше не прерывает хуки) ---------- */
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  /* ---------- Справочники ---------- */
  const [brandsMap, setBrandsMap] = React.useState(null); // { honda: [{name,slug}, ...], ... }
  const brandList = React.useMemo(() => Object.keys(brandsMap || {}), [brandsMap]);

  /* ---------- Шаг 1: выбор места ---------- */
  const [brand, setBrand] = React.useState("");
  const [model, setModel] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [models, setModels] = React.useState([]);
  const [categories, setCategories] = React.useState(MASTER_CATEGORIES.map(c => ({ value: c.slug, label: c.name })));
  const [loading, setLoading] = React.useState(false);

  /* ---------- Шаг 2A: ручное добавление ---------- */
  const [name, setName] = React.useState("");
  const [code, setCode] = React.useState("");
  const [color, setColor] = React.useState("");
  const [priceTHB, setPriceTHB] = React.useState("");
  const [stockQty, setStockQty] = React.useState("");
  const [imageFile, setImageFile] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [busyManual, setBusyManual] = React.useState(false);
  const [msgManual, setMsgManual] = React.useState("");

  /* ---------- Шаг 2B: импорт Excel ---------- */
  const [fileXlsx, setFileXlsx] = React.useState(null);
  const [busyUpload, setBusyUpload] = React.useState(false);
  const [msgUpload, setMsgUpload] = React.useState("");

  /* ---------- Шаг 3: предпросмотр/правка ---------- */
  const [previewRows, setPreviewRows] = React.useState([]); // [{code,name,priceTHB,stockQty,color,imageFile,notes}]
  const [busyPublish, setBusyPublish] = React.useState(false);
  const [msgPublish, setMsgPublish] = React.useState("");

  /* ---------- Шаг 4: корректировка цен ---------- */
  const [multiplier, setMultiplier] = React.useState("1.00");

  /* ========== Загрузка справочника моделей ========== */
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/models", { cache: "no-store" });
        const json = await res.json();
        const map = json?.brands || json || {};
        if (alive) setBrandsMap(map);
      } catch {
        if (alive) setBrandsMap({});
      }
    })();
    return () => { alive = false; };
  }, []);

  /* ========== При смене бренда ========== */
  React.useEffect(() => {
    setModel(""); setCategory(""); setModels([]);
    setCategories(MASTER_CATEGORIES.map(c => ({ value: c.slug, label: c.name })));
    setPreviewRows([]);
    if (!brand) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list = (brandsMap?.[brand] || []).map(m => ({
          value: m.slug || m.name || slugify(m),
          label: m.name || m,
        }));
        if (!cancelled) setModels(list);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [brand, brandsMap]);

  /* ========== При смене модели ========== */
  React.useEffect(() => {
    setCategory("");
    setPreviewRows([]);
    if (!brand || !model) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/categories/${brand}/${model}`);
        if (res.ok) {
          const json = await res.json();
          const list = (json || []).map(c => ({ value: c.slug || c.name || slugify(c), label: c.name || c }));
          if (!cancelled && list.length) setCategories(list);
        }
      } catch {}
      finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [brand, model]);

  /* ================= Шаг 2A: ручное добавление ================= */
  async function onSubmitManual(e) {
    e.preventDefault();
    setBusyManual(true);
    setMsgManual("");

    try {
      if (!brand || !model || !category) return setMsgManual("Заполни бренд, модель и категорию.");
      const row = {
        name, code, color,
        priceTHB: Number(priceTHB || 0),
        stockQty: Number(stockQty || 0),
        imageFile, notes,
      };
      const errs = validatePart(row);
      if (errs.length) return setMsgManual("Ошибки: " + errs.join("; "));

      const res = await fetch(`/api/parts/${brand}/${slugify(model)}/${category}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row),
      });
      const json = await res.json();

      if (!res.ok) setMsgManual(`Ошибка: ${json?.error || res.statusText}`);
      else {
        setMsgManual("✅ Деталь добавлена.");
        setPreviewRows(prev => [{ ...row }, ...prev]);
        setName(""); setCode(""); setColor(""); setPriceTHB(""); setStockQty(""); setImageFile(""); setNotes("");
      }
    } catch (err) {
      setMsgManual(`Ошибка сети: ${String(err)}`);
    } finally {
      setBusyManual(false);
    }
  }

  /* ================= Шаг 2B: импорт Excel ================= */
  async function onSubmitUpload(e) {
    e.preventDefault();
    setBusyUpload(true);
    setMsgUpload("");

    try {
      if (!brand || !model || !category) return setMsgUpload("Выбери бренд, модель и категорию.");
      if (!fileXlsx) return setMsgUpload("Выбери Excel-файл (.xlsx).");

      const formData = new FormData();
      formData.append("file", fileXlsx);

      const res = await fetch(`/api/admin/upload/${brand}/${slugify(model)}/${category}`, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();

      if (!res.ok) setMsgUpload(`Ошибка: ${json?.error || res.statusText}`);
      else {
        setMsgUpload("✅ Файл загружен, категории обновлены.");
        const rows = json?.rows;
        if (Array.isArray(rows)) setPreviewRows(rows);
        setFileXlsx(null);
        const el = document.getElementById("xlsx-input"); if (el) el.value = "";
      }
    } catch (err) {
      setMsgUpload(`Ошибка сети: ${String(err)}`);
    } finally {
      setBusyUpload(false);
    }
  }

  /* ================= Шаг 3: предпросмотр/правка ================= */
  function updateRow(idx, patch) {
    setPreviewRows(prev => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  }
  function removeRow(idx) {
    setPreviewRows(prev => prev.filter((_, i) => i !== idx));
  }
  async function publishAll() {
    if (!brand || !model || !category) return setMsgPublish("Сначала выбери бренд/модель/категорию.");
    if (previewRows.length === 0) return setMsgPublish("Нет строк для публикации.");
    setBusyPublish(true);
    setMsgPublish("");
    try {
      for (const r of previewRows) {
        const errs = validatePart(r);
        if (errs.length) {
          setBusyPublish(false);
          return setMsgPublish(`Ошибка в строке "${r.code || r.name}": ${errs.join("; ")}`);
        }
      }
      const res = await fetch(`/api/parts/${brand}/${slugify(model)}/${category}/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: previewRows }),
      });
      const json = await res.json();
      if (!res.ok) setMsgPublish(`Ошибка: ${json?.error || res.statusText}`);
      else setMsgPublish(`✅ Опубликовано: ${json?.count ?? previewRows.length} позиций.`);
    } catch (e) {
      setMsgPublish(`Ошибка сети: ${String(e)}`);
    } finally {
      setBusyPublish(false);
    }
  }

  /* ================= Шаг 4: множитель цен ================= */
  function applyMultiplier() {
    const k = Number(multiplier);
    if (!k || !isFinite(k)) return;
    setPreviewRows(prev => prev.map(r => ({ ...r, priceTHB: Math.round((Number(r.priceTHB)||0) * k) })));
  }

  /* ================= Шаг 5: экспорт CSV ================= */
  function exportCSV() {
    if (previewRows.length === 0) return;
    const headers = ["code","name","color","priceTHB","stockQty","imageFile","notes"];
    const lines = [headers.join(",")];
    previewRows.forEach(r => {
      const row = headers.map(h => {
        let v = r[h] ?? "";
        v = String(v).replace(/"/g, '""');
        if (/[",\n]/.test(v)) v = `"${v}"`;
        return v;
      });
      lines.push(row.join(","));
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brand || 'brand'}_${model || 'model'}_${category || 'category'}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  /* ===================== РЕНДЕР ===================== */
  return (
    <section className="grid gap-6 md:grid-cols-3">
      {!mounted ? (
        <>
          <div className="md:col-span-2 space-y-6">
            <div className="h-12 rounded-2xl border border-white/10 bg-neutral-900/40 animate-pulse" />
            <div className="h-80 rounded-2xl border border-white/10 bg-neutral-900/40 animate-pulse" />
            <div className="h-80 rounded-2xl border border-white/10 bg-neutral-900/40 animate-pulse" />
          </div>
          <div className="h-80 rounded-2xl border border-white/10 bg-neutral-900/40 animate-pulse" />
        </>
      ) : (
        <>
          <div className="md:col-span-2 space-y-6">
            <h1 className="text-3xl font-extrabold">Админ-панель</h1>

            {/* Шаг 1. Выбор места */}
            <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-5">
              <h2 className="mb-4 text-xl font-bold">Шаг 1. Выбор места</h2>

              <div className="grid gap-4 sm:grid-cols-3">
                <Select
                  label="Бренд"
                  value={brand}
                  onChange={(v) => { setBrand(v); setPreviewRows([]); }}
                  options={brandList.map(b => ({ value: b, label: b }))}
                  placeholder="—"
                />
                <Select
                  label="Модель"
                  value={model}
                  onChange={(v) => { setModel(v); setPreviewRows([]); }}
                  options={models}
                  placeholder={loading && brand ? "загрузка…" : "—"}
                  disabled={!brand || models.length === 0}
                />
                <Select
                  label="Категория"
                  value={category}
                  onChange={(v) => { setCategory(v); setPreviewRows([]); }}
                  options={categories}
                  placeholder={loading && model ? "загрузка…" : "—"}
                  disabled={!brand || !model}
                />
              </div>

              <div className="mt-3 text-sm text-white/70">
                {brand && model && category
                  ? <>Выбрано: <b>{brand}</b> / <b>{model}</b> / <b>{category}</b></>
                  : <>Выберите бренд, модель и категорию.</>}
              </div>
            </div>

            {/* Шаг 2A. Ручное добавление */}
            <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Шаг 2A. Добавить/обновить деталь (вручную)</h2>
                {busyManual && <Loader2 className="h-5 w-5 animate-spin text-white/70" />}
              </div>

              <form onSubmit={onSubmitManual} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Название детали *</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 outline-none focus:ring-2 focus:ring-blue-500" required/>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Код детали (уникальный) *</label>
                    <input value={code} onChange={(e) => setCode(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 outline-none focus:ring-2 focus:ring-blue-500" required/>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Цвета (через запятую)</label>
                    <input value={color} onChange={(e) => setColor(e.target.value)} placeholder="Black, White" className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Цена THB</label>
                    <input value={priceTHB} onChange={(e) => setPriceTHB(e.target.value)} type="number" min="0" className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Сток (шт)</label>
                    <input value={stockQty} onChange={(e) => setStockQty(e.target.value)} type="number" min="0" className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Имя файла картинки (в /public/parts)</label>
                  <input value={imageFile} onChange={(e) => setImageFile(e.target.value)} placeholder="front-fairing-red.png" className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"/>
                  <p className="mt-1 text-xs text-white/60">PNG/JPG, 500×300, латиница. Файл положи в <code>public/parts/</code>.</p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Описание (Notes)</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>

                <button type="submit" disabled={busyManual || !brand || !model || !category}
                  className={`px-4 py-2 rounded-xl text-white transition ${(!brand || !model || !category) ? "bg-neutral-700 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"}`}>
                  {busyManual ? "Сохраняю…" : "Добавить в Excel"}
                </button>
                {msgManual && <p className="text-sm mt-2">{msgManual}</p>}
              </form>
            </div>

            {/* Шаг 2B. Импорт Excel */}
            <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Шаг 2B. Импорт Excel (замена parts_*.xlsx)</h2>
                {busyUpload && <Loader2 className="h-5 w-5 animate-spin text-white/70" />}
              </div>

              <form onSubmit={onSubmitUpload} className="space-y-4">
                <div>
                  <input id="xlsx-input" type="file" accept=".xlsx" onChange={(e) => setFileXlsx(e.target.files?.[0] || null)}
                    className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"/>
                  <p className="mt-2 text-xs text-white/60">Файл заменит текущий <code>parts_*.xlsx</code> в выбранной категории.</p>
                </div>

                <button type="submit" disabled={busyUpload || !brand || !model || !category || !fileXlsx}
                  className={`px-4 py-2 rounded-xl text-white transition ${(!brand || !model || !category || !fileXlsx) ? "bg-neutral-700 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"}`}>
                  {busyUpload ? "Загружаю…" : "Загрузить и заменить Excel"}
                </button>
                {msgUpload && <p className="text-sm mt-2">{msgUpload}</p>}
              </form>
            </div>

            {/* Шаг 3. Предпросмотр/таблица */}
            <PreviewTable
              rows={previewRows}
              setRows={setPreviewRows}
              busyPublish={busyPublish}
              msgPublish={msgPublish}
              setMsgPublish={setMsgPublish}
              publishAll={publishAll}
              multiplier={multiplier}
              setMultiplier={setMultiplier}
              applyMultiplier={applyMultiplier}
              exportCSV={exportCSV}
            />
          </div>

          {/* Памятка (как у тебя было) */}
          <div className="md:col-span-1">
            <AdminHelper />
          </div>
        </>
      )}
    </section>
  );
}

/* ======================= ТАБЛИЦА ПРЕДПРОСМОТРА ======================= */

function PreviewTable({
  rows, setRows,
  busyPublish, msgPublish, setMsgPublish,
  publishAll, multiplier, setMultiplier, applyMultiplier, exportCSV
}) {
  function updateRow(idx, patch) {
    setRows(prev => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  }
  function removeRow(idx) {
    setRows(prev => prev.filter((_, i) => i !== idx));
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Шаг 3. Предпросмотр и массовое редактирование</h2>
        {busyPublish && <Loader2 className="h-5 w-5 animate-spin text-white/70" />}
      </div>

      {rows.length === 0 ? (
        <div className="text-sm text-white/60">Пока пусто. Добавь вручную или импортируй Excel — позиции появятся здесь для редактирования.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-white/70 border-b border-white/10">
                <th className="py-2 pr-3">Код</th>
                <th className="py-2 pr-3">Название</th>
                <th className="py-2 pr-3">Цвета</th>
                <th className="py-2 pr-3">Цена</th>
                <th className="py-2 pr-3">Сток</th>
                <th className="py-2 pr-3">Изобр.</th>
                <th className="py-2 pr-3">Примечание</th>
                <th className="py-2 pr-3 w-24">Действия</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={r.code || idx} className="border-b border-white/5">
                  <td className="py-2 pr-3">
                    <input value={r.code || ""} onChange={e => updateRow(idx, { code: e.target.value })}
                      className="w-32 rounded-lg bg-white/5 border border-white/10 px-2 py-1 outline-none"/>
                  </td>
                  <td className="py-2 pr-3">
                    <input value={r.name || ""} onChange={e => updateRow(idx, { name: e.target.value })}
                      className="w-64 rounded-lg bg-white/5 border border-white/10 px-2 py-1 outline-none"/>
                  </td>
                  <td className="py-2 pr-3">
                    <input value={r.color || ""} onChange={e => updateRow(idx, { color: e.target.value })}
                      className="w-40 rounded-lg bg-white/5 border border-white/10 px-2 py-1 outline-none"/>
                  </td>
                  <td className="py-2 pr-3">
                    <div className="flex items-center gap-1">
                      <input type="number" value={r.priceTHB ?? 0} onChange={e => updateRow(idx, { priceTHB: Number(e.target.value || 0) })}
                        className="w-28 rounded-lg bg-white/5 border border-white/10 px-2 py-1 outline-none text-right"/>
                      <span className="opacity-70">฿</span>
                    </div>
                  </td>
                  <td className="py-2 pr-3">
                    <input type="number" value={r.stockQty ?? 0} onChange={e => updateRow(idx, { stockQty: Number(e.target.value || 0) })}
                      className="w-20 rounded-lg bg-white/5 border border-white/10 px-2 py-1 outline-none text-right"/>
                  </td>
                  <td className="py-2 pr-3">
                    <input value={r.imageFile || ""} onChange={e => updateRow(idx, { imageFile: e.target.value })}
                      className="w-56 rounded-lg bg-white/5 border border-white/10 px-2 py-1 outline-none"/>
                  </td>
                  <td className="py-2 pr-3">
                    <input value={r.notes || ""} onChange={e => updateRow(idx, { notes: e.target.value })}
                      className="w-64 rounded-lg bg-white/5 border border-white/10 px-2 py-1 outline-none"/>
                  </td>
                  <td className="py-2 pr-3">
                    <button onClick={() => removeRow(idx)} className="p-1 rounded-lg border border-white/10 hover:bg-white/10" title="Удалить">
                      <Trash2 className="h-4 w-4"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button onClick={publishAll} disabled={busyPublish || rows.length === 0}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white ${rows.length === 0 ? "bg-neutral-700 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"}`}>
          <Save className="h-4 w-4"/> Опубликовать все
        </button>

        <div className="flex items-center gap-2 ml-auto">
          <input
            type="number" step="0.01" min="0" value={multiplier}
            onChange={e => setMultiplier(e.target.value)}
            className="w-24 rounded-lg bg-white/5 border border-white/10 px-2 py-1 outline-none text-right"
          />
          <button onClick={applyMultiplier} disabled={rows.length === 0}
            className={`px-3 py-1.5 rounded-lg border border-white/10 ${rows.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-white/10"}`}>
            × применить ко всем
          </button>

          <button onClick={exportCSV} disabled={rows.length === 0}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 ${rows.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-white/10"}`}>
            <Download className="h-4 w-4"/> CSV
          </button>
        </div>
        {msgPublish && <div className="text-sm w-full">{msgPublish}</div>}
      </div>
    </div>
  );
}
