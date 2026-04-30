import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { useFinance } from "../../context/FinanceContext";
import { useLocale } from "../../context/LocaleContext";
import { useChartPalette } from "../../context/ThemeContext";

const card =
  "rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800";
const cardEmpty = `${card} flex h-64 items-center justify-center`;

export default function MonthlyBar() {
  const { transactions, monthlyIncome } = useFinance();
  const { locale, t, formatMoney } = useLocale();
  const p = useChartPalette();
  const chartLocale = locale === "es" ? "es-MX" : "en-US";

  const data = transactions
    .filter((tx) => tx.type !== "income")
    .reduce((acc, tx) => {
      const month = tx.date.slice(0, 7);
      const label = new Date(tx.date).toLocaleString(chartLocale, { month: "short", year: "2-digit" });
      const existing = acc.find((i) => i.month === month);
      if (existing) {
        existing.Expenses += tx.amount;
      } else {
        acc.push({
          month,
          label,
          Income: monthlyIncome,
          Expenses: tx.amount,
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
        <p className="text-sm text-gray-500 dark:text-gray-400">{t("chart_noTransactions")}</p>
      </div>
    );

  return (
    <div className={card}>
      <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-gray-600 dark:text-gray-400">
        {t("chart_incomeVsExpenses")}
      </h2>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke={p.grid} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: p.tick }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: p.tick }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
          <Tooltip formatter={(val) => [formatMoney(val), ""]} contentStyle={tooltipStyle} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", color: p.legendColor }} />
          <Bar name={t("chart_income")} dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar name={t("chart_expenses")} dataKey="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
