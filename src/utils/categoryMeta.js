const DEFAULT_CATEGORY = "Other";

const FIXED_CATEGORY_COLORS = {
  Food: "#6366f1",
  Rent: "#f43f5e",
  Transport: "#10b981",
  Entertainment: "#f59e0b",
  Health: "#3b82f6",
  Other: "#8b5cf6",
};

export const DEFAULT_CATEGORIES = Object.keys(FIXED_CATEGORY_COLORS);
export const defaultCategory = DEFAULT_CATEGORY;

function titleCase(value) {
  return value
    .toLowerCase()
    .split(" ")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ""))
    .join(" ");
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function normalizeCategory(category) {
  if (typeof category !== "string") return DEFAULT_CATEGORY;

  const compact = category.trim().replace(/\s+/g, " ");
  if (!compact) return DEFAULT_CATEGORY;

  const fixedMatch = DEFAULT_CATEGORIES.find(
    (fixed) => fixed.toLowerCase() === compact.toLowerCase()
  );
  if (fixedMatch) return fixedMatch;

  return titleCase(compact);
}

export function getCategoryColor(category) {
  const normalized = normalizeCategory(category);
  if (FIXED_CATEGORY_COLORS[normalized]) return FIXED_CATEGORY_COLORS[normalized];

  const hash = hashString(normalized.toLowerCase());
  const hue = hash % 360;
  return `hsl(${hue} 70% 55%)`;
}
