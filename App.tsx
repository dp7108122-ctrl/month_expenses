import React, { useState } from 'react';
import { ExpenseProvider, useExpenses } from './context/ExpenseContext';
import { Card, Button, Input } from './components/ui/LayoutComponents';
import { StatBox } from './components/Dashboard/StatBox';
import { CategoryPieChart, DailyBarChart } from './components/Charts/OverviewCharts';
import { ExpenseList } from './components/Expenses/ExpenseList';
import { AddExpenseModal } from './components/Expenses/AddExpenseModal';
import { Wallet, TrendingDown, DollarSign, Plus, Settings, Filter, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardContent: React.FC = () => {
  const { salary, expenses, setSalary, addExpense, deleteExpense, currency, getExpensesByMonth, resetMonth } = useExpenses();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingSalary, setIsEditingSalary] = useState(false);
  const [salaryInput, setSalaryInput] = useState('');

  // Date Filtering
  const currentMonthStr = currentDate.toISOString().slice(0, 7); // YYYY-MM
  const currentExpenses = getExpensesByMonth(currentMonthStr);
  
  const totalSpent = currentExpenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = salary - totalSpent;
  const spentPercentage = salary > 0 ? (totalSpent / salary) * 100 : 0;

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDate(new Date(e.target.value + '-01'));
  };

  const handleSaveSalary = () => {
    const val = parseFloat(salaryInput);
    if (!isNaN(val)) {
      setSalary(val);
    }
    setIsEditingSalary(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400"
          >
            Lumina Finance
          </motion.h1>
          <p className="text-slate-400">Manage your monthly flow</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white/5 p-1 rounded-xl border border-white/10">
          <input 
            type="month" 
            value={currentMonthStr} 
            onChange={handleMonthChange}
            className="bg-transparent text-white px-3 py-1.5 focus:outline-none [color-scheme:dark]"
          />
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative group">
            {isEditingSalary ? (
                <Card className="h-full flex flex-col justify-center">
                    <label className="text-sm text-slate-400 mb-2">Update Monthly Income</label>
                    <div className="flex gap-2">
                        <Input 
                            label="" 
                            type="number" 
                            value={salaryInput} 
                            onChange={(e) => setSalaryInput(e.target.value)} 
                            placeholder={salary.toString()} 
                            autoFocus
                        />
                        <Button onClick={handleSaveSalary} className="h-[50px] mt-4">Save</Button>
                    </div>
                </Card>
            ) : (
                <div onClick={() => { setSalaryInput(salary.toString()); setIsEditingSalary(true); }} className="cursor-pointer h-full">
                    <StatBox 
                        label="Monthly Income" 
                        amount={salary} 
                        currency={currency} 
                        color="emerald" 
                        icon={<Wallet size={20} />} 
                        delay={0.1}
                    />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Settings size={16} className="text-slate-400" />
                    </div>
                </div>
            )}
        </div>
        
        <StatBox 
          label="Total Spent" 
          amount={totalSpent} 
          currency={currency} 
          color="rose" 
          icon={<TrendingDown size={20} />} 
          delay={0.2}
        />
        
        <StatBox 
          label="Remaining Balance" 
          amount={remaining} 
          currency={currency} 
          color="indigo" 
          icon={<DollarSign size={20} />} 
          delay={0.3}
        />
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Visuals & Actions */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Progress Bar Card */}
            <Card className="flex flex-col justify-center gap-4" delay={0.4}>
                <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-300">Monthly Budget Usage</span>
                    <span className={remaining < 0 ? 'text-red-400' : 'text-indigo-400'}>
                        {spentPercentage.toFixed(1)}%
                    </span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(spentPercentage, 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full rounded-full ${remaining < 0 ? 'bg-red-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                    />
                </div>
                <p className="text-xs text-slate-500 text-center">
                    {remaining < 0 
                        ? `You have exceeded your budget by ${currency}${Math.abs(remaining).toFixed(2)}`
                        : `You have ${currency}${remaining.toFixed(2)} safe to spend`
                    }
                </p>
            </Card>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card delay={0.5} className="min-h-[350px]">
                    <h3 className="text-lg font-semibold text-white mb-6">Spending by Category</h3>
                    <CategoryPieChart expenses={currentExpenses} />
                </Card>
                <Card delay={0.6} className="min-h-[350px]">
                    <h3 className="text-lg font-semibold text-white mb-6">Daily Trend</h3>
                    <DailyBarChart expenses={currentExpenses} />
                </Card>
            </div>

        </div>

        {/* Right Column: Transactions List */}
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Transactions</h2>
                <div className="flex gap-2">
                    {currentExpenses.length > 0 && (
                        <button 
                            onClick={() => resetMonth(currentMonthStr)} 
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Reset Month"
                        >
                            <RefreshCw size={18} />
                        </button>
                    )}
                    <Button onClick={() => setIsModalOpen(true)} icon={<Plus size={18} />}>
                        Add New
                    </Button>
                </div>
            </div>

            <div className="bg-slate-900/50 rounded-2xl p-1 overflow-hidden h-[calc(100vh-300px)] min-h-[500px] overflow-y-auto custom-scrollbar">
                <ExpenseList expenses={currentExpenses} onDelete={deleteExpense} />
            </div>
        </div>
      </div>

      <AddExpenseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={addExpense} 
      />

    </div>
  );
};

const App: React.FC = () => {
  return (
    <ExpenseProvider>
      <DashboardContent />
    </ExpenseProvider>
  );
};

export default App;