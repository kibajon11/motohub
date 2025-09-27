// Единый справочник постоянных категорий для всех брендов/моделей.
// При желании можешь переименовать названия (name), но slug менять осторожно.
const MASTER_CATEGORIES = [
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
  { name: "Accessories", slug: "accessories", partsFile: "parts_accessories.xlsx" }
];

export default MASTER_CATEGORIES;
