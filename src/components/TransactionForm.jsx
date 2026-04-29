import { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { DEFAULT_CATEGORIES, normalizeCategory } from "../utils/categoryMeta";

const fieldClass =
  "rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500";

export default function TransactionForm() {
  const { addTransaction } = useFinance();
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    addTransaction({
      ...form,
      category: normalizeCategory(form.category),
      amount: parseFloat(form.amount),
    });
    setForm({
      description: "",
      amount: "",
      category: "Food",
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-gray-600 dark:text-gray-400">
        Add Expense
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          className={`${fieldClass} col-span-2`}
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="number"
          className={fieldClass}
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <input type="date" className={fieldClass} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <input
          className={fieldClass}
          value={form.category}
          list="expense-categories"
          placeholder="Category (e.g. Auto Insurance)"
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <datalist id="expense-categories">
          {DEFAULT_CATEGORIES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <button
          type="submit"
          className="col-span-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}
