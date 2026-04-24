import { useState, useEffect } from "react";
import { useFinance, computeMonthlyIncome } from "../context/FinanceContext";

const fieldClass =
  "rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const frequencyLabel = { weekly: "Weekly", biweekly: "Bi-weekly", monthly: "Monthly" };

export default function IncomeSetup() {
  const { income, setIncome } = useFinance();
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("monthly");

  useEffect(() => {
    setAmount(income.amount > 0 ? String(income.amount) : "");
    setFrequency(income.frequency || "monthly");
  }, [income.amount, income.frequency]);

  const parsed = parseFloat(amount);
  const amountNum = Number.isFinite(parsed) ? parsed : 0;
  const projectedMonthly = computeMonthlyIncome(amountNum, frequency);

  const handleSave = (e) => {
    e.preventDefault();
    if (!amount.trim() || Number.isNaN(parsed)) return;
    setIncome({ amount: Math.max(0, parsed), frequency });
  };

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-gray-600 dark:text-gray-400">
        Monthly Income
      </h2>
      <form onSubmit={handleSave} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          type="number"
          className={`${fieldClass} sm:col-span-1`}
          placeholder="Income amount"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select
          className={fieldClass}
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="weekly">Weekly</option>
          <option value="biweekly">Bi-weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <p className="text-sm text-gray-600 dark:text-gray-400 sm:col-span-2">
          Projected monthly:{" "}
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{fmt(projectedMonthly)}</span>
        </p>
        {income.amount > 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-500 sm:col-span-2">
            Saved: {fmt(income.amount)} ({frequencyLabel[income.frequency] || income.frequency}) →{" "}
            {fmt(computeMonthlyIncome(income.amount, income.frequency))}/mo
          </p>
        )}
        <button
          type="submit"
          className="sm:col-span-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          Save income
        </button>
      </form>
    </div>
  );
}
