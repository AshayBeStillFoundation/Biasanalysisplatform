import { useMemo } from 'react';
import { AnalyzedMessage } from '../types/bias';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface BiasReductionTrendProps {
  messages: AnalyzedMessage[];
}

export function BiasReductionTrend({ messages }: BiasReductionTrendProps) {
  const trendData = useMemo(() => {
    // Group messages by week
    const weeks = new Map<string, { total: number; biasScore: number; count: number }>();

    messages.forEach(msg => {
      const date = new Date(msg.timestamp);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weeks.has(weekKey)) {
        weeks.set(weekKey, { total: 0, biasScore: 0, count: 0 });
      }

      const week = weeks.get(weekKey)!;
      week.total += 1;
      week.biasScore += msg.overallBiasScore;
      week.count += msg.biasIndicators.length;
    });

    // Convert to array and sort by date
    const data = Array.from(weeks.entries())
      .map(([date, stats]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        avgBiasScore: Math.round(stats.biasScore / stats.total),
        totalIssues: stats.count,
        messages: stats.total,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return data;
  }, [messages]);

  const improvement = useMemo(() => {
    if (trendData.length < 2) return null;
    
    const firstWeek = trendData[0].avgBiasScore;
    const lastWeek = trendData[trendData.length - 1].avgBiasScore;
    const change = firstWeek - lastWeek;
    const percentChange = ((change / firstWeek) * 100).toFixed(1);

    return {
      change,
      percentChange,
      isImproving: change > 0,
    };
  }, [trendData]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Bias Reduction Trend
            </h2>
            <p className="text-slate-600 text-sm">
              Weekly average bias scores and improvement over time
            </p>
          </div>

          {improvement && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              improvement.isImproving ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {improvement.isImproving ? (
                <TrendingDown className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingUp className="w-5 h-5 text-red-600" />
              )}
              <div>
                <div className={`text-2xl font-bold ${
                  improvement.isImproving ? 'text-green-700' : 'text-red-700'
                }`}>
                  {improvement.percentChange}%
                </div>
                <div className="text-xs text-slate-600">
                  {improvement.isImproving ? 'Improvement' : 'Increase'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={trendData}>
          <defs>
            <linearGradient id="colorBias" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            stroke="#64748b"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#64748b"
            style={{ fontSize: '12px' }}
            label={{ value: 'Avg Bias Score', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#64748b' } }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Area
            type="monotone"
            dataKey="avgBiasScore"
            stroke="#ef4444"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorBias)"
            name="Avg Bias Score"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {trendData.length > 0 && (
          <>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <div className="text-sm text-slate-600 mb-1">First Week</div>
              <div className="text-2xl font-bold text-slate-900">{trendData[0].avgBiasScore}</div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <div className="text-sm text-slate-600 mb-1">Current Week</div>
              <div className="text-2xl font-bold text-slate-900">
                {trendData[trendData.length - 1].avgBiasScore}
              </div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <div className="text-sm text-slate-600 mb-1">Total Reduction</div>
              <div className="text-2xl font-bold text-green-600">
                -{trendData[0].avgBiasScore - trendData[trendData.length - 1].avgBiasScore}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
