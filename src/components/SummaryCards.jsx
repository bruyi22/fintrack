import { useFinance } from "../context/FinanceContext";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export default function SummaryCards() {
  const { balance, monthlyIncome, totalExpenses } = useFinance();

  const cards = [
    {
      label: "Monthly Income",
      value: monthlyIncome,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    { label: "Spent", value: totalExpenses, color: "text-red-600 dark:text-red-400" },
    {
      label: "Remaining",
      value: balance,
      color: balance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
        >
          <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">{c.label}</p>
          <p className={`text-2xl font-semibold ${c.color}`}>{fmt(c.value)}</p>
        </div>
      ))}
    </div>
  );
}
