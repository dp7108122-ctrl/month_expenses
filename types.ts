export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export interface ExpenseContextType {
  expenses: Expense[];
  salary: number;
  currency: string;
  setSalary: (amount: number) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  editExpense: (id: string, updatedExpense: Partial<Expense>) => void;
  resetMonth: (monthStr: string) => void; // Clear expenses for a specific month
  getExpensesByMonth: (monthStr: string) => Expense[];
}

export const CATEGORIES = [
  'Housing',
  'Food',
  'Transportation',
  'Utilities',
  'Insurance',
  'Healthcare',
  'Savings',
  'Personal',
  'Entertainment',
  'Other'
];

export const COLORS = [
  '#818cf8', // Indigo
  '#f472b6', // Pink
  '#34d399', // Emerald
  '#fbbf24', // Amber
  '#60a5fa', // Blue
  '#a78bfa', // Violet
  '#f87171', // Red
  '#2dd4bf', // Teal
];