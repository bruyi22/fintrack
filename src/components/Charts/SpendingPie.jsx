import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useFinance } from "../../context/FinanceContext";
import { useChartPalette } from "../../context/ThemeContext";

const COLORS = ["#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6"];

const card =
  "rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800";
const cardEmpty = `${card} flex h-64 items-center justify-center`;

export default function SpendingPie() {
  const { transactions } = useFinance();
  const p = useChartPalette();

  const data = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      const existing = acc.find((i) => i.name === t.category);
      if (existing) existing.value += t.amount;
      else acc.push({ name: t.category, value: t.amount });
      return acc;
    }, []);

  const tooltipStyle = {
    background: p.tooltipBg,
    border: p.tooltipBorder === "transparent" ? "none" : `1px solid ${p.tooltipBorder}`,
    borderRadius: "8px",
    color: p.tooltipColor,
  };

  if (data.length === 0)
    return (
      <div className={cardEmpty}>
        <p className="text-sm text-gray-500 dark:text-gray-400">No expenses yet</p>
      </div>
    );

  return (
    <div className={card}>
      <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-gray-600 dark:text-gray-400">
        Spending by Category
      </h2>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(val) => [`$${val.toFixed(2)}`, ""]} contentStyle={tooltipStyle} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", color: p.legendColor }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
