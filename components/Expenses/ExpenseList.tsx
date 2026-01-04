import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Expense } from '../../types';
import { Button } from '../ui/LayoutComponents';
import { Trash2, ShoppingBag, Coffee, Home, Zap, Heart, DollarSign, Smartphone, Monitor } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'housing': return <Home size={18} />;
    case 'food': return <Coffee size={18} />;
    case 'transportation': return <Zap size={18} />; // Just a placeholder
    case 'healthcare': return <Heart size={18} />;
    case 'savings': return <DollarSign size={18} />;
    case 'entertainment': return <Monitor size={18} />;
    case 'personal': return <Smartphone size={18} />;
    default: return <ShoppingBag size={18} />;
  }
};

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete }) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="text-slate-500 opacity-50" size={32} />
        </div>
        <h3 className="text-lg font-medium text-white mb-1">No expenses found</h3>
        <p className="text-slate-400">Add your first expense to track your spending.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {expenses.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((expense, index) => (
          <motion.div
            key={expense.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-lg">
                {getCategoryIcon(expense.category)}
              </div>
              <div>
                <h4 className="font-medium text-white">{expense.title}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{new Date(expense.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{expense.category}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="font-bold text-white text-lg">
                ₹{expense.amount.toFixed(2)}
              </span>
              <button
                onClick={() => onDelete(expense.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};