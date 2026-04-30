import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";
import { useFinance } from "../../context/FinanceContext";
import { useLocale } from "../../context/LocaleContext";
import { useChartPalette } from "../../context/ThemeContext";

const card =
  "rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800";
const cardEmpty = `${card} flex h-64 items-center justify-center`;

function monthsInclusive(ymStart, ymEnd) {
  const [ys, ms] = ymStart.split("-").map(Number);
  const [ye, me] = ymEnd.split("-").map(Number);
  return (ye - ys) * 12 + (me - ms) + 1;
}

export default function TrendLine() {
  const { transactions, monthlyIncome } = useFinance();
  const { locale, t, formatMoney } = useLocale();
  const p = useChartPalette();
  const chartLocale = locale === "es" ? "es-MX" : "en-US";

  const expensesOnly = transactions.filter((tx) => tx.type !== "income");
  const sorted = [...expensesOnly].sort((a, b) => a.date.localeCompare(b.date));

  const firstMonth = sorted[0]?.date.slice(0, 7);
  const data = sorted.map((tx, index) => {
    const cumulative = sorted
      .slice(0, index + 1)
      .reduce((sum, x) => sum + x.amount, 0);
    const ym = tx.date.slice(0, 7);
    const monthCount = firstMonth ? monthsInclusive(firstMonth, ym) : 1;
    const incomeCredited = monthlyIncome * monthCount;
    const remaining = incomeCredited - cumulative;
    return {
      date: new Date(tx.date).toLocaleDateString(chartLocale, { month: "short", day: "numeric" }),
      Remaining: parseFloat(remaining.toFixed(2)),
    };
  });

  const tooltipStyle = {
    background: p.tooltipBg,
    border: p.tooltipBorder === "transparent" ? "none" : `1px solid ${p.tooltipBorder}`,
    borderRadius: "8px",
    color: p.tooltipColor,
  };

  if (data.length === 0)
    return (
      <div className={cardEmpty}>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t("chart_noTransactions")}</p>
      </div>
    );

  return (
    <div className={card}>
      <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-gray-600 dark:text-gray-400">
        {t("chart_remainingTrend")}
      </h2>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={p.grid} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: p.tick }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: p.tick }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
          <Tooltip
            formatter={(val) => [formatMoney(val), t("chart_remaining")]}
            contentStyle={tooltipStyle}
          />
          <ReferenceLine y={0} stroke={p.refLine} strokeDasharray="4 4" />
          <Line
            type="monotone"
            name={t("chart_remaining")}
            dataKey="Remaining"
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
