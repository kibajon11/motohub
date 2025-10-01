import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

export async function GET(_req, { params }) {
  try {
    // ⬇️ важно в Next 15
    const p = await params;
    const brand = String(p.brand || "").toLowerCase();
    const model = String(p.model || "").toLowerCase();

    const file = path.join(process.cwd(), "public", "data", brand, model, "categories.xlsx");

    if (!fs.existsSync(file)) {
      return Response.json(
        { error: `Файл не найден: data/${brand}/${model}/categories.xlsx`, categories: [] },
        { status: 200 }
      );
    }

    const buffer = fs.readFileSync(file);
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    return Response.json({ categories: rows }, { status: 200 });
  } catch (err) {
    return Response.json({ error: String(err), categories: [] }, { status: 200 });
  }
}
