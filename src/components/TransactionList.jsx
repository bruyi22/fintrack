import { useState } from "react";
import { useFinance } from "../context/FinanceContext";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const filterBtn = (active) =>
  active
    ? "bg-indigo-600 text-white"
    : "bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600";

export default function TransactionList() {
  const { transactions, deleteTransaction } = useFinance();
  const [filter, setFilter] = useState("all");

  const filtered = transactions.filter((t) => (filter === "all" ? true : t.type === filter));

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium uppercase tracking-widest text-gray-600 dark:text-gray-400">
          Transactions
        </h2>
        <div className="flex gap-2">
          {["all", "income", "expense"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1 text-xs capitalize transition-colors ${filterBtn(filter === f)}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">No transactions yet</p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{t.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t.category} · {t.date}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-semibold ${
                    t.type === "income"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}
                  {fmt(t.amount)}
                </span>
                <button
                  type="button"
                  onClick={() => deleteTransaction(t.id)}
                  className="text-xs text-gray-500 transition-colors hover:text-red-600 dark:text-gray-600 dark:hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
