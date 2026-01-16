import { useMemo, useState } from 'react';
import { AnalyzedMessage, BiasType, Department } from '../types/bias';

interface BiasHeatmapProps {
  messages: AnalyzedMessage[];
}

interface HeatmapCell {
  source: string;
  biasType: BiasType;
  count: number;
  severity: number;
}

interface DepartmentHeatmapCell {
  department: Department;
  biasType: BiasType;
  count: number;
  severity: number;
}

export function BiasHeatmap({ messages }: BiasHeatmapProps) {
  const [activeTab, setActiveTab] = useState<'source' | 'department'>('source');

  const heatmapData = useMemo(() => {
    const sources = ['slack', 'teams', 'email'];
    const biasTypes: BiasType[] = ['gender', 'racial', 'age', 'disability', 'religious'];
    
    const data: HeatmapCell[] = [];
    
    sources.forEach(source => {
      biasTypes.forEach(biasType => {
        const relevantMessages = messages.filter(m => m.source === source);
        const indicators = relevantMessages.flatMap(m => 
          m.biasIndicators.filter(i => i.type === biasType)
        );
        
        const count = indicators.length;
        const severityScores = { low: 1, medium: 2, high: 3 };
        const avgSeverity = count > 0 
          ? indicators.reduce((sum, i) => sum + severityScores[i.severity], 0) / count 
          : 0;
        
        data.push({
          source,
          biasType,
          count,
          severity: avgSeverity,
        });
      });
    });
    
    return data;
  }, [messages]);

  const departmentHeatmapData = useMemo(() => {
    const departments: Department[] = ['engineering', 'sales', 'marketing', 'hr', 'finance', 'operations', 'executive'];
    const biasTypes: BiasType[] = ['gender', 'racial', 'age', 'disability', 'religious'];
    
    const data: DepartmentHeatmapCell[] = [];
    
    departments.forEach(department => {
      biasTypes.forEach(biasType => {
        const relevantMessages = messages.filter(m => m.department === department);
        const indicators = relevantMessages.flatMap(m => 
          m.biasIndicators.filter(i => i.type === biasType)
        );
        
        const count = indicators.length;
        const severityScores = { low: 1, medium: 2, high: 3 };
        const avgSeverity = count > 0 
          ? indicators.reduce((sum, i) => sum + severityScores[i.severity], 0) / count 
          : 0;
        
        data.push({
          department,
          biasType,
          count,
          severity: avgSeverity,
        });
      });
    });
    
    return data;
  }, [messages]);

  const maxCount = activeTab === 'source' 
    ? Math.max(...heatmapData.map(d => d.count), 1)
    : Math.max(...departmentHeatmapData.map(d => d.count), 1);

  const getColorIntensity = (count: number, severity: number) => {
    if (count === 0) return 'bg-slate-50';
    
    const intensity = count / maxCount;
    
    if (severity >= 2.5) {
      // High severity - red scale
      if (intensity > 0.66) return 'bg-red-700 text-white';
      if (intensity > 0.33) return 'bg-red-500 text-white';
      return 'bg-red-300';
    } else if (severity >= 1.5) {
      // Medium severity - orange scale
      if (intensity > 0.66) return 'bg-orange-600 text-white';
      if (intensity > 0.33) return 'bg-orange-400 text-white';
      return 'bg-orange-200';
    } else {
      // Low severity - yellow scale
      if (intensity > 0.66) return 'bg-yellow-500';
      if (intensity > 0.33) return 'bg-yellow-300';
      return 'bg-yellow-100';
    }
  };

  const biasTypeLabels: Record<BiasType, string> = {
    gender: 'Gender',
    racial: 'Racial',
    age: 'Age',
    disability: 'Disability',
    religious: 'Religious',
    none: 'None',
  };

  const sourceLabels: Record<string, string> = {
    slack: 'Slack',
    teams: 'Teams',
    email: 'Email',
  };

  const departmentLabels: Record<Department, string> = {
    engineering: 'Engineering',
    sales: 'Sales',
    marketing: 'Marketing',
    hr: 'HR',
    finance: 'Finance',
    operations: 'Operations',
    executive: 'Executive',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">
          Bias Detection Heatmap
        </h2>
        <p className="text-slate-600 mb-4">
          Visualization of bias patterns across different dimensions
        </p>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('source')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'source'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            By Message Source
          </button>
          <button
            onClick={() => setActiveTab('department')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'department'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            By Department
          </button>
        </div>
      </div>

      {/* Source Heatmap */}
      {activeTab === 'source' && (
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-left text-sm font-semibold text-slate-700 border-b-2 border-slate-200">
                    Source
                  </th>
                  {(['gender', 'racial', 'age', 'disability', 'religious'] as BiasType[]).map(type => (
                    <th key={type} className="p-3 text-center text-sm font-semibold text-slate-700 border-b-2 border-slate-200">
                      {biasTypeLabels[type]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['slack', 'teams', 'email'].map(source => (
                  <tr key={source} className="border-b border-slate-100">
                    <td className="p-3 text-sm font-medium text-slate-700">
                      {sourceLabels[source]}
                    </td>
                    {(['gender', 'racial', 'age', 'disability', 'religious'] as BiasType[]).map(biasType => {
                      const cell = heatmapData.find(
                        d => d.source === source && d.biasType === biasType
                      );
                      const colorClass = cell ? getColorIntensity(cell.count, cell.severity) : 'bg-slate-50';
                      
                      return (
                        <td key={biasType} className="p-0">
                          <div
                            className={`h-20 flex items-center justify-center ${colorClass} transition-all hover:scale-105 cursor-pointer group relative`}
                            title={`${cell?.count || 0} instances`}
                          >
                            <div className="text-center">
                              <div className="text-2xl font-bold">
                                {cell?.count || 0}
                              </div>
                              <div className="text-xs opacity-75">
                                {cell && cell.count > 0 ? (
                                  cell.severity >= 2.5 ? 'High' : 
                                  cell.severity >= 1.5 ? 'Med' : 'Low'
                                ) : ''}
                              </div>
                            </div>
                            
                            {/* Tooltip */}
                            {cell && cell.count > 0 && (
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                {cell.count} {cell.count === 1 ? 'instance' : 'instances'} - {
                                  cell.severity >= 2.5 ? 'High' : 
                                  cell.severity >= 1.5 ? 'Medium' : 'Low'
                                } severity
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Department Heatmap */}
      {activeTab === 'department' && (
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-left text-sm font-semibold text-slate-700 border-b-2 border-slate-200">
                    Department
                  </th>
                  {(['gender', 'racial', 'age', 'disability', 'religious'] as BiasType[]).map(type => (
                    <th key={type} className="p-3 text-center text-sm font-semibold text-slate-700 border-b-2 border-slate-200">
                      {biasTypeLabels[type]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(['engineering', 'sales', 'marketing', 'hr', 'finance', 'operations', 'executive'] as Department[]).map(department => (
                  <tr key={department} className="border-b border-slate-100">
                    <td className="p-3 text-sm font-medium text-slate-700">
                      {departmentLabels[department]}
                    </td>
                    {(['gender', 'racial', 'age', 'disability', 'religious'] as BiasType[]).map(biasType => {
                      const cell = departmentHeatmapData.find(
                        d => d.department === department && d.biasType === biasType
                      );
                      const colorClass = cell ? getColorIntensity(cell.count, cell.severity) : 'bg-slate-50';
                      
                      return (
                        <td key={biasType} className="p-0">
                          <div
                            className={`h-20 flex items-center justify-center ${colorClass} transition-all hover:scale-105 cursor-pointer group relative`}
                            title={`${cell?.count || 0} instances`}
                          >
                            <div className="text-center">
                              <div className="text-2xl font-bold">
                                {cell?.count || 0}
                              </div>
                              <div className="text-xs opacity-75">
                                {cell && cell.count > 0 ? (
                                  cell.severity >= 2.5 ? 'High' : 
                                  cell.severity >= 1.5 ? 'Med' : 'Low'
                                ) : ''}
                              </div>
                            </div>
                            
                            {/* Tooltip */}
                            {cell && cell.count > 0 && (
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                {cell.count} {cell.count === 1 ? 'instance' : 'instances'} - {
                                  cell.severity >= 2.5 ? 'High' : 
                                  cell.severity >= 1.5 ? 'Medium' : 'Low'
                                } severity
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-200 rounded"></div>
          <span className="text-slate-600">Low Severity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-400 rounded"></div>
          <span className="text-slate-600">Medium Severity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-600 rounded"></div>
          <span className="text-slate-600">High Severity</span>
        </div>
      </div>
    </div>
  );
}