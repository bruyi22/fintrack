import { FinanceProvider } from "./context/FinanceContext";
import { useTheme } from "./context/ThemeContext";
import SummaryCards from "./components/SummaryCards";
import IncomeSetup from "./components/IncomeSetup";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import SpendingPie from "./components/Charts/SpendingPie";
import MonthlyBar from "./components/Charts/MonthlyBar";
import TrendLine from "./components/Charts/TrendLine";
import BudgetTracker from "./components/BudgetTracker";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="shrink-0 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">FinTrack</h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-500">
                Personal finance dashboard
              </p>
            </div>
            <ThemeToggle />
          </div>

          <SummaryCards />

          <IncomeSetup />

          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <SpendingPie />
            <MonthlyBar />
            <TrendLine />
          </div>

          <BudgetTracker />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <TransactionForm />
            <TransactionList />
          </div>
        </div>
      </div>
    </FinanceProvider>
  );
}
