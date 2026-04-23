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
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case "DELETE_TRANSACTION":
      return { ...state, transactions: state.transactions.filter((t) => t.id !== action.payload) };
    case "SET_BUDGET":
      return { ...state, budgets: { ...state.budgets, [action.category]: action.amount } };
    case "LOAD":
      return action.payload;
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

  const totalIncome = state.transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = state.transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <FinanceContext.Provider
      value={{ ...state, addTransaction, deleteTransaction, setBudget, totalIncome, totalExpenses, balance }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => useContext(FinanceContext);
