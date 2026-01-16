import { useMemo } from 'react';
import { AnalyzedMessage, Department } from '../types/bias';
import { Building2, TrendingUp, AlertTriangle } from 'lucide-react';

interface DepartmentBiasBreakdownProps {
  messages: AnalyzedMessage[];
}

export function DepartmentBiasBreakdown({ messages }: DepartmentBiasBreakdownProps) {
  const departmentStats = useMemo(() => {
    const departments: Department[] = ['engineering', 'sales', 'marketing', 'hr', 'finance', 'operations', 'executive'];
    
    return departments.map(dept => {
      const deptMessages = messages.filter(m => m.department === dept);
      const totalMessages = deptMessages.length;
      const messagesWithBias = deptMessages.filter(m => m.biasIndicators.length > 0).length;
      const avgBiasScore = totalMessages > 0 
        ? deptMessages.reduce((sum, m) => sum + m.overallBiasScore, 0) / totalMessages 
        : 0;
      const totalBiasInstances = deptMessages.reduce((sum, m) => sum + m.biasIndicators.length, 0);

      return {
        department: dept,
        totalMessages,
        messagesWithBias,
        avgBiasScore,
        totalBiasInstances,
        biasRate: totalMessages > 0 ? (messagesWithBias / totalMessages) * 100 : 0,
      };
    }).filter(stat => stat.totalMessages > 0) // Only show departments with messages
      .sort((a, b) => b.avgBiasScore - a.avgBiasScore); // Sort by bias score descending
  }, [messages]);

  const departmentLabels: Record<Department, string> = {
    engineering: 'Engineering',
    sales: 'Sales',
    marketing: 'Marketing',
    hr: 'Human Resources',
    finance: 'Finance',
    operations: 'Operations',
    executive: 'Executive',
  };

  const departmentColors: Record<Department, string> = {
    engineering: 'bg-blue-100 text-blue-700',
    sales: 'bg-green-100 text-green-700',
    marketing: 'bg-purple-100 text-purple-700',
    hr: 'bg-pink-100 text-pink-700',
    finance: 'bg-yellow-100 text-yellow-700',
    operations: 'bg-orange-100 text-orange-700',
    executive: 'bg-red-100 text-red-700',
  };

  const getBiasScoreColor = (score: number) => {
    if (score === 0) return 'text-green-600';
    if (score < 50) return 'text-yellow-600';
    if (score < 75) return 'text-orange-600';
    return 'text-red-600';
  };

  const getBiasScoreBg = (score: number) => {
    if (score === 0) return 'bg-green-100';
    if (score < 50) return 'bg-yellow-100';
    if (score < 75) return 'bg-orange-100';
    return 'bg-red-100';
  };

  if (departmentStats.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-100 rounded-lg">
          <Building2 className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Department Analysis
          </h2>
          <p className="text-slate-600 text-sm">
            Bias detection breakdown by department
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {departmentStats.map((stat) => (
          <div
            key={stat.department}
            className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${departmentColors[stat.department]}`}>
                  {departmentLabels[stat.department]}
                </span>
                <span className="text-sm text-slate-600">
                  {stat.totalMessages} {stat.totalMessages === 1 ? 'message' : 'messages'}
                </span>
              </div>
              
              <div className={`px-4 py-2 rounded-lg ${getBiasScoreBg(stat.avgBiasScore)}`}>
                <span className={`text-lg font-bold ${getBiasScoreColor(stat.avgBiasScore)}`}>
                  {stat.avgBiasScore.toFixed(1)}
                </span>
                <span className="text-xs text-slate-600 ml-1">avg score</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                <span>Bias Detection Rate</span>
                <span>{stat.biasRate.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    stat.biasRate > 75 ? 'bg-red-500' :
                    stat.biasRate > 50 ? 'bg-orange-500' :
                    stat.biasRate > 25 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${stat.biasRate}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 bg-slate-50 rounded">
                <div className="text-xs text-slate-600 mb-1">Messages with Bias</div>
                <div className="text-lg font-semibold text-slate-900">{stat.messagesWithBias}</div>
              </div>
              <div className="text-center p-2 bg-slate-50 rounded">
                <div className="text-xs text-slate-600 mb-1">Clean Messages</div>
                <div className="text-lg font-semibold text-slate-900">
                  {stat.totalMessages - stat.messagesWithBias}
                </div>
              </div>
              <div className="text-center p-2 bg-slate-50 rounded">
                <div className="text-xs text-slate-600 mb-1">Total Issues</div>
                <div className="text-lg font-semibold text-slate-900">{stat.totalBiasInstances}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Alert */}
      {departmentStats.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <div className="font-medium text-blue-900 mb-1">Department Insights</div>
              <div className="text-sm text-blue-700">
                <strong>{departmentLabels[departmentStats[0].department]}</strong> has the highest average bias score 
                ({departmentStats[0].avgBiasScore.toFixed(1)}), while{' '}
                {departmentStats.length > 1 && (
                  <>
                    <strong>{departmentLabels[departmentStats[departmentStats.length - 1].department]}</strong> has the lowest 
                    ({departmentStats[departmentStats.length - 1].avgBiasScore.toFixed(1)})
                  </>
                )}
                .
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
