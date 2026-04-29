const DEFAULT_CATEGORY = "Food";

const FIXED_CATEGORY_COLORS = {
  Rent: "#f43f5e",
  Food: "#6366f1",
  Gas: "#10b981",
  Electricity: "#eab308",
  Water: "#0ea5e9",
  Subscriptions: "#f59e0b",
  "Car Insurance": "#06b6d4",
};

const LEGACY_CATEGORY_ALIASES = {
  health: "Car Insurance",
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
  const alias = LEGACY_CATEGORY_ALIASES[compact.toLowerCase()];
  if (alias) return alias;

  const fixedMatch = DEFAULT_CATEGORIES.find(
    (fixed) => fixed.toLowerCase() === compact.toLowerCase()
  );
  if (fixedMatch) return fixedMatch;

  return titleCase(compact);
}

/** Same roster as Budget Tracker: defaults, every budget row, and categories seen in expense transactions */
export function buildExpenseCategories(transactions = [], budgets = {}) {
  const spending = {};
  transactions
    .filter((t) => t.type !== "income")
    .forEach((t) => {
      const c = normalizeCategory(t.category);
      spending[c] = (spending[c] || 0) + t.amount;
    });

  return Array.from(
    new Set([
      ...DEFAULT_CATEGORIES,
      ...Object.keys(budgets).map((k) => normalizeCategory(k)),
      ...Object.keys(spending),
    ])
  ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}

export function getCategoryColor(category) {
  const normalized = normalizeCategory(category);
  if (FIXED_CATEGORY_COLORS[normalized]) return FIXED_CATEGORY_COLORS[normalized];

  const hash = hashString(normalized.toLowerCase());
  const hue = hash % 360;
  return `hsl(${hue} 70% 55%)`;
}
