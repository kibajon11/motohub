import fs from "fs";
import path from "path";

export async function POST(request, { params }) {
  try {
    // ⬇️ важно в Next 15
    const p = await params;
    const brand = String(p.brand || "").toLowerCase();
    const model = String(p.model || "").toLowerCase();
    const category = String(p.category || "").toLowerCase();

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !file.name) {
      return Response.json({ ok: false, error: "Файл (form field 'file') не получен" }, { status: 400 });
    }

    // Куда сохраняем
    const dir = path.join(process.cwd(), "public", "data", brand, model);
    await fs.promises.mkdir(dir, { recursive: true });

    // Имя файла: categories.xlsx или parts_<category>.xlsx
    let target = "";
    if (category === "categories") {
      target = path.join(dir, "categories.xlsx");
    } else {
      target = path.join(dir, `parts_${category}.xlsx`);
    }

    // Сохраняем тело файла
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.promises.writeFile(target, buffer);

    return Response.json({ ok: true, saved: `data/${brand}/${model}/${path.basename(target)}` }, { status: 200 });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
