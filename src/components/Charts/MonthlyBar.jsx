import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { useFinance } from "../../context/FinanceContext";
import { useChartPalette } from "../../context/ThemeContext";

const card =
  "rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800";
const cardEmpty = `${card} flex h-64 items-center justify-center`;

export default function MonthlyBar() {
  const { transactions, monthlyIncome } = useFinance();
  const p = useChartPalette();

  const data = transactions
    .filter((t) => t.type !== "income")
    .reduce((acc, t) => {
      const month = t.date.slice(0, 7);
      const label = new Date(t.date).toLocaleString("en-US", { month: "short", year: "2-digit" });
      const existing = acc.find((i) => i.month === month);
      if (existing) {
        existing.Expenses += t.amount;
      } else {
        acc.push({
          month,
          label,
          Income: monthlyIncome,
          Expenses: t.amount,
        });
      }
      return acc;
    }, [])
    .map((row) => ({ ...row, Income: monthlyIncome }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const tooltipStyle = {
    background: p.tooltipBg,
    border: p.tooltipBorder === "transparent" ? "none" : `1px solid ${p.tooltipBorder}`,
    borderRadius: "8px",
    color: p.tooltipColor,
  };

  if (data.length === 0)
    return (
      <div className={cardEmpty}>
        <p className="text-sm text-gray-500 dark:text-gray-400">No transactions yet</p>
      </div>
    );

  return (
    <div className={card}>
      <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-gray-600 dark:text-gray-400">
        Income vs Expenses
      </h2>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke={p.grid} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: p.tick }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: p.tick }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
          <Tooltip formatter={(val) => [`$${val.toFixed(2)}`, ""]} contentStyle={tooltipStyle} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", color: p.legendColor }} />
          <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
