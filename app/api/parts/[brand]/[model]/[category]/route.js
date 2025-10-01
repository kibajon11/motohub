import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

export async function GET(_req, { params }) {
  try {
    // ⬇️ важно в Next 15
    const p = await params;
    const brand = String(p.brand || "").toLowerCase();
    const model = String(p.model || "").toLowerCase();
    const category = String(p.category || "").toLowerCase();

    // ожидаем файлы вида parts_body.xlsx / parts_engine.xlsx / parts_suspension.xlsx
    const fileName = `parts_${category}.xlsx`;
    const file = path.join(process.cwd(), "public", "data", brand, model, fileName);

    if (!fs.existsSync(file)) {
      return Response.json(
        { error: `Файл не найден: data/${brand}/${model}/${fileName}`, parts: [] },
        { status: 200 }
      );
    }

    const buffer = fs.readFileSync(file);
    const wb = XLSX.read(buffer, { type: "buffer" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    // гарантируем нужные поля
    const parts = rows.map((r) => ({
      code: r.code,
      name: r.name,
      color: r.color || "",
      price: Number(r.price ?? 0),
      stock: Number(r.stock ?? 0),
      imageFile: r.imageFile || "example.png",
    }));

    return Response.json({ parts }, { status: 200 });
  } catch (err) {
    return Response.json({ error: String(err), parts: [] }, { status: 200 });
  }
}
