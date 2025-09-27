import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import * as XLSX from "xlsx";

const MASTER = [
  { slug: "body", partsFile: "parts_body.xlsx" },
  { slug: "engine", partsFile: "parts_engine.xlsx" },
  { slug: "transmission", partsFile: "parts_transmission.xlsx" },
  { slug: "suspension", partsFile: "parts_suspension.xlsx" },
  { slug: "brakes", partsFile: "parts_brakes.xlsx" },
  { slug: "electrical", partsFile: "parts_electrical.xlsx" },
  { slug: "exhaust", partsFile: "parts_exhaust.xlsx" },
  { slug: "cooling", partsFile: "parts_cooling.xlsx" },
  { slug: "fuel", partsFile: "parts_fuel.xlsx" },
  { slug: "controls", partsFile: "parts_controls.xlsx" },
  { slug: "wheels", partsFile: "parts_wheels.xlsx" },
  { slug: "lighting", partsFile: "parts_lighting.xlsx" },
  { slug: "accessories", partsFile: "parts_accessories.xlsx" },
];

function resolvePartsPath(brand, model, category) {
  const baseDir = path.join(process.cwd(), "public", "data", brand, model);
  const catFile = path.join(baseDir, "categories.xlsx");

  if (fs.existsSync(catFile)) {
    try {
      const catBuf = fs.readFileSync(catFile);
      const wbCat = XLSX.read(catBuf, { type: "buffer" });
      const wsCat = wbCat.Sheets[wbCat.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(wsCat, { defval: "" });
      const found = rows.find(
        (r) => String(r.CategorySlug || "").trim().toLowerCase() === String(category).toLowerCase()
      );
      if (found && found.PartsFile) {
        return path.join(baseDir, String(found.PartsFile).trim());
      }
    } catch {}
  }

  const master = MASTER.find((c) => c.slug === String(category).toLowerCase());
  const partsFile = master?.partsFile || `parts_${category}.xlsx`;
  return path.join(baseDir, partsFile);
}

function ensureDirFor(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export async function GET(_req, { params }) {
  try {
    const brand = String(params.brand || "").toLowerCase();
    const model = String(params.model || "").toLowerCase();
    const category = String(params.category || "").toLowerCase();

    const partsPath = resolvePartsPath(brand, model, category);
    if (!fs.existsSync(partsPath)) {
      return NextResponse.json({ parts: [], category });
    }

    const buf = fs.readFileSync(partsPath);
    const wb = XLSX.read(buf, { type: "buffer" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });

    const parts = rows.map((r) => ({
      name: String(r.PartName || "").trim(),
      code: String(r.PartCode || "").trim(),
      color: String(r.Color || "").trim(),
      priceTHB: Number(r.PriceTHB || 0),
      stockQty: Number(r.StockQty || 0),
      imageFile: String(r.ImageFile || "").trim(),
      notes: String(r.Notes || "").trim(),
    }));

    return NextResponse.json({ parts, category });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const brand = String(params.brand || "").toLowerCase();
    const model = String(params.model || "").toLowerCase();
    const category = String(params.category || "").toLowerCase();

    const body = await req.json();
    const item = {
      name: String(body?.name || "").trim(),
      code: String(body?.code || "").trim(),
      color: Array.isArray(body?.color) ? body.color.join(", ") : String(body?.color || "").trim(),
      priceTHB: Number(body?.priceTHB || 0),
      stockQty: Number(body?.stockQty || 0),
      imageFile: String(body?.imageFile || "").trim(),
      notes: String(body?.notes || "").trim(),
    };

    if (!item.name || !item.code) {
      return NextResponse.json({ error: "name и code обязательны" }, { status: 400 });
    }

    const partsPath = resolvePartsPath(brand, model, category);
    ensureDirFor(partsPath);

    let rows = [];
    if (fs.existsSync(partsPath)) {
      const buf = fs.readFileSync(partsPath);
      const wb = XLSX.read(buf, { type: "buffer" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(ws, { defval: "" });
    }

    const exists = rows.some((r) => String(r.PartCode || "").trim().toLowerCase() === item.code.toLowerCase());
    if (exists) {
      return NextResponse.json({ error: "Деталь с таким PartCode уже существует" }, { status: 409 });
    }

    rows.push({
      PartName: item.name,
      PartCode: item.code,
      Color: item.color,
      PriceTHB: item.priceTHB,
      StockQty: item.stockQty,
      ImageFile: item.imageFile,
      Notes: item.notes,
    });

    const wsNew = XLSX.utils.json_to_sheet(rows);
    const wbNew = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wbNew, wsNew, "Sheet1");
    const out = XLSX.write(wbNew, { bookType: "xlsx", type: "buffer" });
    fs.writeFileSync(partsPath, out);

    return NextResponse.json({ ok: true, added: item });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}