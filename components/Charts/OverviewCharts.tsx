import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Expense, COLORS } from '../../types';

interface OverviewChartsProps {
  expenses: Expense[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-white/10 p-3 rounded-lg shadow-xl">
        <p className="text-white font-medium">{payload[0].name}</p>
        <p className="text-indigo-400 font-bold">
          ₹{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export const CategoryPieChart: React.FC<OverviewChartsProps> = ({ expenses }) => {
  const data = expenses.reduce((acc: any[], curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-500">
        <svg className="w-12 h-12 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
        <p>No data to display</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {data.slice(0, 4).map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            <span className="text-xs text-slate-400">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DailyBarChart: React.FC<OverviewChartsProps> = ({ expenses }) => {
    // Aggregate by day (1-31)
    const data = expenses.reduce((acc: any[], curr) => {
        const day = new Date(curr.date).getDate();
        const existing = acc.find(item => item.day === day);
        if(existing) {
            existing.amount += curr.amount;
        } else {
            acc.push({ day, amount: curr.amount });
        }
        return acc;
    }, []).sort((a, b) => a.day - b.day);

    if (data.length === 0) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500">
              <p>No activity yet</p>
            </div>
        );
    }

    return (
        <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="day" stroke="#94a3b8" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip 
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} 
                    />
                    <Bar dataKey="amount" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}