import { useMemo, useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { useLocale } from "../context/LocaleContext";
import { buildExpenseCategories, defaultCategory, normalizeCategory } from "../utils/categoryMeta";

const fieldClass =
  "rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500";

const CUSTOM_CATEGORY = "__CUSTOM__";

export default function TransactionForm() {
  const { addTransaction, transactions, budgets } = useFinance();
  const { t } = useLocale();
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: defaultCategory,
    date: new Date().toISOString().split("T")[0],
  });

  const categories = useMemo(
    () => buildExpenseCategories(transactions, budgets),
    [transactions, budgets]
  );

  const presetValue = categories.includes(form.category) ? form.category : CUSTOM_CATEGORY;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    addTransaction({
      ...form,
      category: normalizeCategory(form.category.trim() || defaultCategory),
      amount: parseFloat(form.amount),
    });
    setForm({
      description: "",
      amount: "",
      category: defaultCategory,
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-gray-600 dark:text-gray-400">
        {t("expense_title")}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          className={`${fieldClass} col-span-2`}
          placeholder={t("expense_description")}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="number"
          step="any"
          className={fieldClass}
          placeholder={t("expense_amount")}
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <input type="date" className={fieldClass} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <div className="col-span-2 flex flex-col gap-2 sm:flex-row sm:items-start">
          <select
            className={`${fieldClass} w-full shrink-0 sm:flex-1 sm:min-w-0`}
            aria-label={t("expense_categoryAria")}
            value={presetValue}
            onChange={(e) => {
              const v = e.target.value;
              if (v === CUSTOM_CATEGORY) setForm({ ...form, category: "" });
              else setForm({ ...form, category: v });
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value={CUSTOM_CATEGORY}>{t("expense_addCategory")}</option>
          </select>
          {presetValue === CUSTOM_CATEGORY && (
            <input
              className={`${fieldClass} w-full sm:flex-1 sm:min-w-0`}
              value={form.category}
              placeholder={t("expense_newCategoryPlaceholder")}
              aria-label={t("expense_newCategoryAria")}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          )}
        </div>
        <button
          type="submit"
          className="col-span-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          {t("expense_submit")}
        </button>
      </form>
    </div>
  );
}
