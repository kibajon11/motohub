import path from "path";
import fs from "fs";
import * as XLSX from "xlsx";

function fallback() {
  return {
    brands: {
      honda: [
        { name: "Forza 350", slug: "forza-350", years: "", imageFile: "forza-350.png" },
        { name: "PCX 160",   slug: "pcx-160",   years: "", imageFile: "pcx-160.png" },
      ],
      yamaha: [{ name: "NMAX 155", slug: "nmax-155", years: "", imageFile: "nmax-155.png" }],
      kawasaki: [{ name: "Ninja 400", slug: "ninja-400", years: "", imageFile: "ninja-400.png" }],
    },
  };
}

export async function GET() {
  try {
    const file = path.join(process.cwd(), "public", "data", "models.xlsx");
    if (!fs.existsSync(file)) {
      return Response.json(fallback(), { status: 200 });
    }

    const buf = fs.readFileSync(file);
    const wb = XLSX.read(buf, { type: "buffer" });
    const brands = {};

    for (const sheetName of wb.SheetNames) {
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { defval: "" });
      brands[sheetName.toLowerCase()] = rows.map((r) => ({
        name: r.name,
        slug: r.slug || String(r.name || "").toLowerCase().trim().replace(/\s+/g, "-"),
        years: r.years || "",
        imageFile: r.imageFile || "placeholder.png",
      }));
    }

    return Response.json({ brands }, { status: 200 });
  } catch (e) {
    return Response.json({ ...fallback(), error: String(e) }, { status: 200 });
  }
}
