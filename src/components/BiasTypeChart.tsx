import { useMemo } from 'react';
import { AnalyzedMessage, BiasType } from '../types/bias';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface BiasTypeChartProps {
  messages: AnalyzedMessage[];
}

export function BiasTypeChart({ messages }: BiasTypeChartProps) {
  const chartData = useMemo(() => {
    const biasTypeCounts: Record<string, number> = {
      Gender: 0,
      Racial: 0,
      Age: 0,
      Disability: 0,
      Religious: 0,
    };

    messages.forEach(msg => {
      msg.biasIndicators.forEach(indicator => {
        const key = indicator.type.charAt(0).toUpperCase() + indicator.type.slice(1);
        biasTypeCounts[key] = (biasTypeCounts[key] || 0) + 1;
      });
    });

    return Object.entries(biasTypeCounts).map(([type, count]) => ({
      type,
      count,
    }));
  }, [messages]);

  const colors: Record<string, string> = {
    Gender: '#ec4899',
    Racial: '#f97316',
    Age: '#3b82f6',
    Disability: '#a855f7',
    Religious: '#22c55e',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">
          Bias Type Distribution
        </h2>
        <p className="text-slate-600 text-sm">
          Breakdown of detected bias instances by category
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="type" 
            stroke="#64748b"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#64748b"
            style={{ fontSize: '12px' }}
            label={{ value: 'Number of Instances', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#64748b' } }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[entry.type]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-5 gap-3">
        {chartData.map((item) => (
          <div key={item.type} className="text-center">
            <div 
              className="w-3 h-3 rounded-full mx-auto mb-1"
              style={{ backgroundColor: colors[item.type] }}
            />
            <div className="text-xs text-slate-600">{item.type}</div>
            <div className="text-lg font-bold text-slate-900">{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
