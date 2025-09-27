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

function resolvePartsTarget(brand, model, category) {
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

export async function POST(req, { params }) {
  try {
    const brand = String(params.brand || "").toLowerCase();
    const model = String(params.model || "").toLowerCase();
    const category = String(params.category || "").toLowerCase();

    const form = await req.formData();
    const file = form.get("file");
    if (!file) {
      return NextResponse.json({ error: "Файл не получен" }, { status: 400 });
    }
    if (!file.name.endsWith(".xlsx")) {
      return NextResponse.json({ error: "Ожидается .xlsx" }, { status: 400 });
    }

    const targetPath = resolvePartsTarget(brand, model, category);
    ensureDirFor(targetPath);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(targetPath, buffer);

    return NextResponse.json({ ok: true, saved: path.basename(targetPath) });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}