import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "models.xlsx");

    // Если файла нет — просто отдаём пустую структуру (без 500)
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ brands: {} }, { status: 200 });
    }

    const buf = fs.readFileSync(filePath);
    const wb = XLSX.read(buf, { type: "buffer" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    if (!ws) return NextResponse.json({ brands: {} }, { status: 200 });

    // Читаем строки, пустые поля не превращаем в undefined
    const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });

    // Ожидаем колонки Brand и ModelName (как мы изначально сделали)
    const brands = {};
    for (const r of rows) {
      const brand = String(r.Brand || "").toLowerCase().trim();
      const name = String(r.ModelName || "").trim();
      if (!brand || !name) continue;
      if (!brands[brand]) brands[brand] = [];
      brands[brand].push({ name }); // slug делаем на странице
    }

    return NextResponse.json({ brands }, { status: 200 });
  } catch (e) {
    // Не валим сервер 500-ками без смысла — отдадим пусто, но с пояснением
    return NextResponse.json(
      { brands: {}, error: "models.xlsx read error: " + String(e) },
      { status: 200 }
    );
  }
}
