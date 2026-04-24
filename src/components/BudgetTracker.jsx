import { useState } from "react";
import { useFinance } from "../context/FinanceContext";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const inputClass =
  "w-20 rounded-lg border border-gray-300 bg-white px-2 py-0.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white";

export default function BudgetTracker() {
  const { transactions, budgets, setBudget } = useFinance();
  const [editing, setEditing] = useState(null);
  const [tempVal, setTempVal] = useState("");

  const spending = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

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
        Budget Tracker
      </h2>
      <div className="flex flex-col gap-4">
        {Object.entries(budgets).map(([category, budget]) => {
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
                        Save
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
                      {fmt(spent)} / {fmt(budget)}
                    </button>
                  )}
                  {over && <span className="text-xs text-red-600 dark:text-red-400">Over!</span>}
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
