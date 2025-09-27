import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import * as XLSX from "xlsx";

const MASTER = [
  { name: "Body (Plastic)", slug: "body", partsFile: "parts_body.xlsx" },
  { name: "Engine", slug: "engine", partsFile: "parts_engine.xlsx" },
  { name: "Transmission", slug: "transmission", partsFile: "parts_transmission.xlsx" },
  { name: "Suspension", slug: "suspension", partsFile: "parts_suspension.xlsx" },
  { name: "Brakes", slug: "brakes", partsFile: "parts_brakes.xlsx" },
  { name: "Electrical", slug: "electrical", partsFile: "parts_electrical.xlsx" },
  { name: "Exhaust", slug: "exhaust", partsFile: "parts_exhaust.xlsx" },
  { name: "Cooling", slug: "cooling", partsFile: "parts_cooling.xlsx" },
  { name: "Fuel System", slug: "fuel", partsFile: "parts_fuel.xlsx" },
  { name: "Controls & Cables", slug: "controls", partsFile: "parts_controls.xlsx" },
  { name: "Wheels & Tires", slug: "wheels", partsFile: "parts_wheels.xlsx" },
  { name: "Lighting", slug: "lighting", partsFile: "parts_lighting.xlsx" },
  { name: "Accessories", slug: "accessories", partsFile: "parts_accessories.xlsx" },
];

export async function GET(_req, { params }) {
  try {
    const brand = String(params.brand || "").toLowerCase();
    const model = String(params.model || "").toLowerCase();

    const file = path.join(process.cwd(), "public", "data", brand, model, "categories.xlsx");
    if (!fs.existsSync(file)) {
      return NextResponse.json({ categories: MASTER });
    }

    const buf = fs.readFileSync(file);
    const wb = XLSX.read(buf, { type: "buffer" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });

    const categories = rows.map((r) => ({
      name: String(r.CategoryName || "").trim(),
      slug: String(r.CategorySlug || "").trim(),
      partsFile: String(r.PartsFile || "").trim(),
      imageFile: String(r.ImageFile || "").trim(),
    }));

    return NextResponse.json({ categories });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}