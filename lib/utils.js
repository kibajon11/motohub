export function slugify(str = "") {
  return str.toLowerCase().trim().replace(/\s+/g, "-");
}
