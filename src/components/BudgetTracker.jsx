import { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { useLocale } from "../context/LocaleContext";
import { buildExpenseCategories, normalizeCategory } from "../utils/categoryMeta";

const inputClass =
  "w-20 rounded-lg border border-gray-300 bg-white px-2 py-0.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white";

export default function BudgetTracker() {
  const { transactions, budgets, setBudget } = useFinance();
  const { t, formatMoney } = useLocale();
  const [editing, setEditing] = useState(null);
  const [tempVal, setTempVal] = useState("");

  const spending = transactions
    .filter((t) => t.type !== "income")
    .reduce((acc, t) => {
      const category = normalizeCategory(t.category);
      acc[category] = (acc[category] || 0) + t.amount;
      return acc;
    }, {});

  const categories = buildExpenseCategories(transactions, budgets);

  const handleSave = (category) => {
    const val = parseFloat(tempVal);
    if (!Number.isNaN(val) && val > 0) setBudget(category, val);
    setEditing(null);
  };

  const cancelEdit = () => {
    setEditing(null);
    setTempVal("");
  };

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-gray-600 dark:text-gray-400">
        {t("budget_title")}
      </h2>
      <div className="flex flex-col gap-4">
        {categories.map((category) => {
          const budget = budgets[category] ?? 0;
          const spent = spending[category] || 0;
          const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
          const over = spent > budget;
          const color = over ? "bg-red-500" : pct > 75 ? "bg-amber-500 dark:bg-amber-400" : "bg-indigo-500";

          return (
            <div key={category}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm text-gray-900 dark:text-white">{category}</span>
                <div className="flex items-center gap-2">
                  {editing === category ? (
                    <div className="flex items-center gap-1">
                      <input
                        className={inputClass}
                        value={tempVal}
                        onChange={(e) => setTempVal(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSave(category);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleSave(category)}
                        className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        {t("budget_save")}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(category);
                        setTempVal(String(budget));
                      }}
                      className="text-xs text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {formatMoney(spent, { maximumFractionDigits: 0 })} /{" "}
                      {formatMoney(budget, { maximumFractionDigits: 0 })}
                    </button>
                  )}
                  {over && <span className="text-xs text-red-600 dark:text-red-400">{t("budget_over")}</span>}
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
