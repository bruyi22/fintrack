/** @typedef {{ [key: string]: string }} MessageMap */

/** @type {{ en: MessageMap, es: MessageMap }} */
export const STRINGS = {
  en: {
    app_tagline: "Personal finance dashboard",
    theme_light: "Light",
    theme_dark: "Dark",
    theme_ariaLight: "Switch to light mode",
    theme_ariaDark: "Switch to dark mode",
    lang_aria: "Language",

    summary_monthlyIncome: "Monthly Income",
    summary_spent: "Spent",
    summary_remaining: "Remaining",

    income_title: "Monthly Income",
    income_placeholder: "Income amount",
    income_projected: "Projected monthly:",
    income_saved: "Saved: {{amount}} ({{freq}}) → {{monthly}}/mo",
    income_save: "Save income",
    freq_weekly: "Weekly",
    freq_biweekly: "Bi-weekly",
    freq_monthly: "Monthly",

    transactions_title: "Transactions",
    transactions_all: "All",
    transactions_empty: "No transactions yet",

    expense_title: "Add Expense",
    expense_description: "Description",
    expense_amount: "Amount",
    expense_categoryAria: "Category",
    expense_addCategory: "Add new category…",
    expense_newCategoryAria: "New category name",
    expense_newCategoryPlaceholder: "New category (Food if empty)",
    expense_submit: "Add Expense",

    budget_title: "Budget Tracker",
    budget_save: "Save",
    budget_over: "Over!",

    chart_spendingByCategory: "Spending by Category",
    chart_incomeVsExpenses: "Income vs Expenses",
    chart_remainingTrend: "Remaining trend",
    chart_noExpenses: "No expenses yet",
    chart_noTransactions: "No transactions yet",
    chart_income: "Income",
    chart_expenses: "Expenses",
    chart_remaining: "Remaining",
  },
  es: {
    app_tagline: "Panel de finanzas personales",
    theme_light: "Claro",
    theme_dark: "Oscuro",
    theme_ariaLight: "Cambiar a modo claro",
    theme_ariaDark: "Cambiar a modo oscuro",
    lang_aria: "Idioma",

    summary_monthlyIncome: "Ingreso mensual",
    summary_spent: "Gastado",
    summary_remaining: "Restante",

    income_title: "Ingreso mensual",
    income_placeholder: "Monto del ingreso",
    income_projected: "Proyección mensual:",
    income_saved: "Guardado: {{amount}} ({{freq}}) → {{monthly}}/mes",
    income_save: "Guardar ingreso",
    freq_weekly: "Semanal",
    freq_biweekly: "Quincenal",
    freq_monthly: "Mensual",

    transactions_title: "Transacciones",
    transactions_all: "Todas",
    transactions_empty: "Aún no hay transacciones",

    expense_title: "Agregar gasto",
    expense_description: "Descripción",
    expense_amount: "Monto",
    expense_categoryAria: "Categoría",
    expense_addCategory: "Agregar categoría…",
    expense_newCategoryAria: "Nombre de la nueva categoría",
    expense_newCategoryPlaceholder: "Nueva categoría (Comida si está vacío)",
    expense_submit: "Agregar gasto",

    budget_title: "Presupuesto",
    budget_save: "Guardar",
    budget_over: "¡Excedido!",

    chart_spendingByCategory: "Gastos por categoría",
    chart_incomeVsExpenses: "Ingresos vs gastos",
    chart_remainingTrend: "Tendencia del saldo",
    chart_noExpenses: "Aún no hay gastos",
    chart_noTransactions: "Aún no hay transacciones",
    chart_income: "Ingresos",
    chart_expenses: "Gastos",
    chart_remaining: "Restante",
  },
};
