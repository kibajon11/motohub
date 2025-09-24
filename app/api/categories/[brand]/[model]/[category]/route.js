import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import * as XLSX from "xlsx";

export async function GET(_req, { params }) {
  try {
    const brand = String(params.brand || "").toLowerCase();
    const model = String(params.model || "").toLowerCase();
    const category = String(params.category || "").toLowerCase();

    // читаем categories.xlsx, чтобы узнать имя файла с деталями для этой категории
    const catFile = path.join(process.cwd(), "public", "data", brand, model, "categories.xlsx");
    if (!fs.existsSync(catFile)) {
      return NextResponse.json({ parts: [] });
    }

    const catBuf = fs.readFileSync(catFile);
    const wbCat = XLSX.read(catBuf, { type: "buffer" });
    const wsCat = wbCat.Sheets[wbCat.SheetNames[0]];
    const catRows = XLSX.utils.sheet_to_json(wsCat, { defval: "" });

    const match = catRows.find(
      (r) => String(r.CategorySlug || "").trim().toLowerCase() === category
    );
    if (!match || !match.PartsFile) {
      return NextResponse.json({ parts: [] });
    }

    const partsPath = path.join(process.cwd(), "public", "data", brand, model, String(match.PartsFile));
    if (!fs.existsSync(partsPath)) {
      return NextResponse.json({ parts: [] });
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
      imageFile: String(r.ImageFile || "").trim(), // напр. oil-filter.png в /public/parts/
      notes: String(r.Notes || "").trim(),
    }));

    return NextResponse.json({ parts, category });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
