import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Expense, ExpenseContextType } from '../types';

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const STORAGE_KEY_EXPENSES = 'lumina_expenses';
const STORAGE_KEY_SALARY = 'lumina_salary';

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [salary, setSalaryState] = useState<number>(0);
  const [currency] = useState<string>('₹');

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem(STORAGE_KEY_EXPENSES);
    const savedSalary = localStorage.getItem(STORAGE_KEY_SALARY);

    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (e) {
        console.error("Failed to parse expenses", e);
      }
    }

    if (savedSalary) {
      setSalaryState(parseFloat(savedSalary));
    }
  }, []);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SALARY, salary.toString());
  }, [salary]);

  const setSalary = (amount: number) => {
    setSalaryState(amount);
  };

  const addExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExpense,
      id: crypto.randomUUID(),
    };
    setExpenses((prev) => [expense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  const editExpense = (id: string, updated: Partial<Expense>) => {
    setExpenses((prev) => prev.map((exp) => (exp.id === id ? { ...exp, ...updated } : exp)));
  };

  const resetMonth = (monthStr: string) => {
    // monthStr format: YYYY-MM
    if (window.confirm("Are you sure you want to delete all expenses for this month?")) {
      setExpenses((prev) => prev.filter(exp => !exp.date.startsWith(monthStr)));
    }
  };

  const getExpensesByMonth = (monthStr: string) => {
    return expenses.filter(exp => exp.date.startsWith(monthStr));
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        salary,
        currency,
        setSalary,
        addExpense,
        deleteExpense,
        editExpense,
        resetMonth,
        getExpensesByMonth
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};