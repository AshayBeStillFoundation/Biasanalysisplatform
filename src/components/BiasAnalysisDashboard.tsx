import { AnalyzedMessage, BiasType } from '../types/bias';
import { AlertTriangle, CheckCircle, TrendingUp, BarChart3 } from 'lucide-react';

interface BiasAnalysisDashboardProps {
  messages: AnalyzedMessage[];
}

export function BiasAnalysisDashboard({ messages }: BiasAnalysisDashboardProps) {
  const totalMessages = messages.length;
  const messagesWithBias = messages.filter(m => m.biasIndicators.length > 0).length;
  const averageBiasScore = messages.reduce((sum, m) => sum + m.overallBiasScore, 0) / totalMessages;

  // Count bias by type
  const biasByType = messages.reduce((acc, message) => {
    message.biasIndicators.forEach(indicator => {
      acc[indicator.type] = (acc[indicator.type] || 0) + 1;
    });
    return acc;
  }, {} as Record<BiasType, number>);

  const biasTypeColors: Record<BiasType, string> = {
    gender: 'bg-pink-500',
    racial: 'bg-orange-500',
    age: 'bg-blue-500',
    disability: 'bg-purple-500',
    religious: 'bg-green-500',
    none: 'bg-slate-500',
  };

  const biasTypeLabels: Record<BiasType, string> = {
    gender: 'Gender',
    racial: 'Racial',
    age: 'Age',
    disability: 'Disability',
    religious: 'Religious',
    none: 'None',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Messages */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="p-3 bg-blue-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-900">{totalMessages}</div>
        <div className="text-sm text-slate-600">Total Messages</div>
      </div>

      {/* Messages with Bias */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="p-3 bg-red-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-900">{messagesWithBias}</div>
        <div className="text-sm text-slate-600">
          Messages with Bias ({Math.round((messagesWithBias / totalMessages) * 100)}%)
        </div>
      </div>

      {/* Clean Messages */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="p-3 bg-green-100 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-900">
          {totalMessages - messagesWithBias}
        </div>
        <div className="text-sm text-slate-600">
          Clean Messages ({Math.round(((totalMessages - messagesWithBias) / totalMessages) * 100)}%)
        </div>
      </div>

      {/* Average Bias Score */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="p-3 bg-yellow-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-900">
          {averageBiasScore.toFixed(1)}
        </div>
        <div className="text-sm text-slate-600">Average Bias Score</div>
      </div>

      {/* Bias Type Breakdown */}
      <div className="col-span-full bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Bias Type Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {(Object.entries(biasByType) as [BiasType, number][]).map(([type, count]) => (
            <div key={type} className="text-center">
              <div className={`w-16 h-16 ${biasTypeColors[type]} rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-2`}>
                {count}
              </div>
              <div className="text-sm font-medium text-slate-700">{biasTypeLabels[type]}</div>
              <div className="text-xs text-slate-500">
                {Math.round((count / messages.reduce((sum, m) => sum + m.biasIndicators.length, 0)) * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
