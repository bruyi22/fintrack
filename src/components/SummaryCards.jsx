import { useFinance } from "../context/FinanceContext";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export default function SummaryCards() {
  const { balance, totalIncome, totalExpenses } = useFinance();

  const cards = [
    { label: "Balance", value: balance, color: balance >= 0 ? "text-emerald-400" : "text-red-400", bg: "bg-gray-800" },
    { label: "Income", value: totalIncome, color: "text-emerald-400", bg: "bg-gray-800" },
    { label: "Expenses", value: totalExpenses, color: "text-red-400", bg: "bg-gray-800" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {cards.map((c) => (
        <div key={c.label} className={`${c.bg} rounded-2xl p-5 border border-gray-700`}>
          <p className="text-sm text-gray-400 mb-1">{c.label}</p>
          <p className={`text-2xl font-semibold ${c.color}`}>{fmt(c.value)}</p>
        </div>
      ))}
    </div>
  );
}
