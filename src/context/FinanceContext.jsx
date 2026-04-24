import { createContext, useContext, useReducer, useEffect } from "react";

const FinanceContext = createContext();

const initialState = {
  transactions: [],
  budgets: {
    Food: 400,
    Rent: 1200,
    Transport: 150,
    Entertainment: 100,
    Health: 100,
    Other: 200,
  },
  income: { amount: 0, frequency: "monthly" },
};

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
    .map(({ type: _type, ...rest }) => rest);

  return {
    transactions,
    budgets: raw.budgets ?? initialState.budgets,
    income: raw.income ?? { amount: 0, frequency: "monthly" },
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return { ...state, transactions: [action.payload, ...state.transactions] };
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
    dispatch({ type: "ADD_TRANSACTION", payload: { ...tx, id: Date.now() } });

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
