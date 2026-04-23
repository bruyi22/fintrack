import { FinanceProvider } from "./context/FinanceContext";
import SummaryCards from "./components/SummaryCards";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import SpendingPie from "./components/Charts/SpendingPie";
import MonthlyBar from "./components/Charts/MonthlyBar";
import TrendLine from "./components/Charts/TrendLine";

export default function App() {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-5xl mx-auto px-4 py-8">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-white">FinTrack</h1>
            <p className="text-sm text-gray-500 mt-1">Personal finance dashboard</p>
          </div>

          {/* Summary Cards */}
          <SummaryCards />

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <SpendingPie />
            <MonthlyBar />
            <TrendLine />
          </div>

          {/* Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TransactionForm />
            <TransactionList />
          </div>

        </div>
      </div>
    </FinanceProvider>
  );
}
