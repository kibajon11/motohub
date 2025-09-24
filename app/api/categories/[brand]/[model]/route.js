import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import * as XLSX from "xlsx";

export async function GET(_req, { params }) {
  try {
    const brand = String(params.brand || "").toLowerCase();
    const model = String(params.model || "").toLowerCase();
    const filePath = path.join(process.cwd(), "public", "data", brand, model, "categories.xlsx");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ categories: [] });
    }

    const buf = fs.readFileSync(filePath);
    const wb = XLSX.read(buf, { type: "buffer" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });

    const categories = rows.map((r) => ({
      name: String(r.Category || "").trim(),
      slug: String(r.CategorySlug || "").trim().toLowerCase(),
      imageFile: String(r.ImageFile || "").trim(), // напр. cat-engine.png
      partsFile: String(r.PartsFile || "").trim(), // напр. parts_engine.xlsx
    }));

    return NextResponse.json({ categories });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
