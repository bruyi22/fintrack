# FinTrack 💰

A personal finance dashboard built with React and Tailwind CSS. Track income, expenses, budgets, and visualize your spending — deployed on Vercel.

🔗 **Live Demo:** [fintrack-3f0uku268-diazbnavarro-7828s-projects.vercel.app](https://fintrack-3f0uku268-diazbnavarro-7828s-projects.vercel.app/)

## Features

- Add and delete income / expense transactions
- Filter transactions by type and category
- Interactive charts — spending by category (pie), monthly trend (line), income vs expenses (bar)
- Budget tracker per category with progress indicators
- Persistent state via localStorage — data survives page refresh
- Fully responsive design with dark mode

## Tech Stack

- **React** (Vite) — component-based UI
- **Tailwind CSS** — utility-first styling
- **Recharts** — interactive data visualization
- **Context API + useReducer** — global state management
- **localStorage** — client-side data persistence
- **Vercel** — deployment

## Getting Started

```bash
git clone https://github.com/bruyi22/fintrack
cd fintrack
npm install
npm run dev
```

## Project Structure

```
src/
  components/
    SummaryCards.jsx
    TransactionForm.jsx
    TransactionList.jsx
    Charts/
      SpendingPie.jsx
      MonthlyBar.jsx
      TrendLine.jsx
    BudgetTracker.jsx
  context/
    FinanceContext.jsx
  hooks/
    useTransactions.js
    useLocalStorage.js
  pages/
    Dashboard.jsx
    Transactions.jsx
    Budget.jsx
```

## Author

Bryan Navarro · [linkedin.com/in/bryan-navarro](https://linkedin.com/in/bryan-navarro) · [github.com/bruyi22](https://github.com/bruyi22)
