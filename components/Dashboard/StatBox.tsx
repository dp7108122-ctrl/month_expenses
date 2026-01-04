import React from 'react';
import { Card } from '../ui/LayoutComponents';
import CountUp from 'react-countup';

interface StatBoxProps {
  label: string;
  amount: number;
  currency: string;
  color: 'indigo' | 'emerald' | 'rose';
  icon: React.ReactNode;
  delay?: number;
}

export const StatBox: React.FC<StatBoxProps> = ({ label, amount, currency, color, icon, delay }) => {
  const colorStyles = {
    indigo: "from-indigo-500/20 to-indigo-500/5 text-indigo-400 border-indigo-500/20",
    emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20",
    rose: "from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/20"
  };

  return (
    <Card className={`relative overflow-hidden group hover:border-white/20 transition-all duration-300 bg-gradient-to-br ${colorStyles[color]}`} delay={delay}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-slate-400 font-medium text-sm uppercase tracking-wider">{label}</p>
        <div className={`p-2 rounded-lg bg-white/5 ${colorStyles[color].split(' ')[2]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-3xl font-bold text-white mb-1">
        {currency}
        <CountUp end={amount} duration={2} separator="," decimals={2} />
      </h3>
      {/* Decorative Blur */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl opacity-20 ${color === 'indigo' ? 'bg-indigo-500' : color === 'emerald' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
    </Card>
  );
};