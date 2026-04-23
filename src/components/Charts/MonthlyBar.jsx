import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { useFinance } from "../../context/FinanceContext";

export default function MonthlyBar() {
  const { transactions } = useFinance();

  const data = transactions.reduce((acc, t) => {
    const month = t.date.slice(0, 7); // "2026-04"
    const label = new Date(t.date).toLocaleString("en-US", { month: "short", year: "2-digit" });
    const existing = acc.find((i) => i.month === month);
    if (existing) {
      if (t.type === "income") existing.Income += t.amount;
      else existing.Expenses += t.amount;
    } else {
      acc.push({
        month,
        label,
        Income: t.type === "income" ? t.amount : 0,
        Expenses: t.type === "expense" ? t.amount : 0,
      });
    }
    return acc;
  }, []).sort((a, b) => a.month.localeCompare(b.month));

  if (data.length === 0)
    return (
      <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700 flex items-center justify-center h-64">
        <p className="text-gray-500 text-sm">No transactions yet</p>
      </div>
    );

  return (
    <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">
        Income vs Expenses
      </h2>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
          <Tooltip
            formatter={(val) => [`$${val.toFixed(2)}`, ""]}
            contentStyle={{ background: "#1f2937", border: "none", borderRadius: "8px", color: "#e5e7eb" }}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }} />
          <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
