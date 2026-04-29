import { createContext, useContext, useReducer, useEffect } from "react";
import { DEFAULT_CATEGORIES, normalizeCategory } from "../utils/categoryMeta";

const FinanceContext = createContext();

const initialState = {
  transactions: [],
  budgets: {
    Rent: 1200,
    Food: 400,
    Gas: 150,
    Electricity: 0,
    Water: 0,
    Subscriptions: 100,
    "Car Insurance": 0,
  },
  income: { amount: 0, frequency: "monthly" },
};

const LEGACY_BUDGET_CATEGORY_MAP = {
  Transport: "Gas",
  Entertainment: "Subscriptions",
  Health: "Car Insurance",
};

function normalizeBudgets(loadedBudgets = {}) {
  const normalized = {};

  Object.entries(loadedBudgets).forEach(([category, amount]) => {
    const nextCategory = LEGACY_BUDGET_CATEGORY_MAP[category] || normalizeCategory(category);
    normalized[nextCategory] = (normalized[nextCategory] || 0) + amount;
  });

  DEFAULT_CATEGORIES.forEach((category) => {
    if (typeof normalized[category] !== "number") {
      normalized[category] = initialState.budgets[category] ?? 0;
    }
  });

  return normalized;
}

/** @param {number} amount @param {"weekly"|"biweekly"|"monthly"} frequency */
export function computeMonthlyIncome(amount, frequency) {
  switch (frequency) {
    case "weekly":
      return amount * 4.33;
    case "biweekly":
      return amount * 2.17;
    default:
      return amount * 1;
  }
}

function normalizeLoadedState(raw) {
  const transactions = (raw.transactions || [])
    .filter((t) => t.type !== "income")
    .map((transaction) => {
      const next = { ...transaction };
      delete next.type;
      return {
        ...next,
        category: normalizeCategory(next.category),
      };
    });

  return {
    transactions,
    budgets: normalizeBudgets(raw.budgets ?? initialState.budgets),
    income: raw.income ?? { amount: 0, frequency: "monthly" },
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TRANSACTION": {
      const tx = action.payload;
      const cat = normalizeCategory(tx.category);
      const nextBudgets = { ...state.budgets };
      if (!(cat in nextBudgets)) nextBudgets[cat] = 0;
      return { ...state, transactions: [tx, ...state.transactions], budgets: nextBudgets };
    }
    case "DELETE_TRANSACTION":
      return { ...state, transactions: state.transactions.filter((t) => t.id !== action.payload) };
    case "SET_BUDGET":
      return { ...state, budgets: { ...state.budgets, [action.category]: action.amount } };
    case "SET_INCOME":
      return { ...state, income: action.payload };
    case "LOAD":
      return normalizeLoadedState(action.payload);
    default:
      return state;
  }
}

export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem("fintrack");
    if (saved) dispatch({ type: "LOAD", payload: JSON.parse(saved) });
  }, []);

  useEffect(() => {
    localStorage.setItem("fintrack", JSON.stringify(state));
  }, [state]);

  const addTransaction = (tx) =>
    dispatch({
      type: "ADD_TRANSACTION",
      payload: { ...tx, category: normalizeCategory(tx.category), id: Date.now() },
    });

  const deleteTransaction = (id) =>
    dispatch({ type: "DELETE_TRANSACTION", payload: id });

  const setBudget = (category, amount) =>
    dispatch({ type: "SET_BUDGET", category, amount });

  const setIncome = (payload) => dispatch({ type: "SET_INCOME", payload });

  const monthlyIncome = computeMonthlyIncome(state.income.amount, state.income.frequency);

  // Legacy rows with type "income" are excluded on load; exclude here if any slip through
  const totalExpenses = state.transactions
    .filter((t) => t.type !== "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = monthlyIncome - totalExpenses;

  return (
    <FinanceContext.Provider
      value={{
        ...state,
        addTransaction,
        deleteTransaction,
        setBudget,
        setIncome,
        monthlyIncome,
        totalExpenses,
        balance,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => useContext(FinanceContext);
