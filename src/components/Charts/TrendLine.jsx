import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";
import { useFinance } from "../../context/FinanceContext";

export default function TrendLine() {
  const { transactions } = useFinance();

  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));

  let running = 0;
  const data = sorted.map((t) => {
    running += t.type === "income" ? t.amount : -t.amount;
    return {
      date: new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      Balance: parseFloat(running.toFixed(2)),
    };
  });

  if (data.length === 0)
    return (
      <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700 flex items-center justify-center h-64">
        <p className="text-gray-500 text-sm">No transactions yet</p>
      </div>
    );

  return (
    <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">
        Balance Trend
      </h2>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
          <Tooltip
            formatter={(val) => [`$${val.toFixed(2)}`, "Balance"]}
            contentStyle={{ background: "#1f2937", border: "none", borderRadius: "8px", color: "#e5e7eb" }}
          />
          <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="Balance"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ fill: "#6366f1", r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
