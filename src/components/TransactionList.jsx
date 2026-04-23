import { useState } from "react";
import { useFinance } from "../context/FinanceContext";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export default function TransactionList() {
  const { transactions, deleteTransaction } = useFinance();
  const [filter, setFilter] = useState("all");

  const filtered = transactions.filter((t) =>
    filter === "all" ? true : t.type === filter
  );

  return (
    <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest">Transactions</h2>
        <div className="flex gap-2">
          {["all", "income", "expense"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1 rounded-lg capitalize transition-colors ${
                filter === f ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-400 hover:bg-gray-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">No transactions yet</p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((t) => (
            <div key={t.id} className="flex items-center justify-between bg-gray-900 rounded-xl px-4 py-3">
              <div>
                <p className="text-sm text-white font-medium">{t.description}</p>
                <p className="text-xs text-gray-500">{t.category} · {t.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-semibold ${t.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                  {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                </span>
                <button
                  onClick={() => deleteTransaction(t.id)}
                  className="text-gray-600 hover:text-red-400 transition-colors text-xs"
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
