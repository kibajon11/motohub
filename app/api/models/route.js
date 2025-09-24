import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "MotoHub_2023-2025.xlsx");
    const buf = fs.readFileSync(filePath);
    const wb = XLSX.read(buf, { type: "buffer" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { defval: null });

    // Оставляем только модели, которые актуальны до 2023+
    const filtered = rows.filter((r) => Number(r?.To) >= 2023);

    // Группируем по бренду (ключ — в нижнем регистре)
    const brands = {};
    for (const r of filtered) {
      const brandSlug = String(r.Brand || "").toLowerCase();
      if (!brandSlug) continue;
      if (!brands[brandSlug]) brands[brandSlug] = [];
      brands[brandSlug].push({
        name: String(r.Model || "").trim(),
        from: Number(r.From) || null,
        to: Number(r.To) || null,
      });
    }

    return NextResponse.json({ brands });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
