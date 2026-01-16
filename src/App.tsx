import { useState, useEffect } from 'react';
import { BiasAnalysisDashboard } from './components/BiasAnalysisDashboard';
import { BiasHeatmap } from './components/BiasHeatmap';
import { DepartmentBiasBreakdown } from './components/DepartmentBiasBreakdown';
import { BiasReductionTrend } from './components/BiasReductionTrend';
import { BiasTypeChart } from './components/BiasTypeChart';
import { LoadingState } from './components/LoadingState';
import { AnalyzedMessage, Department } from './types/bias';
import { fetchMessagesFromAPI } from './utils/mockApi';
import { BarChart3, TrendingDown, Building2, Map } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState<AnalyzedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'departments' | 'heatmap'>('overview');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'all'>('all');

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      try {
        const data = await fetchMessagesFromAPI();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  const filteredMessages = selectedDepartment === 'all' 
    ? messages 
    : messages.filter(m => m.department === selectedDepartment);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Bias Analytics Dashboard
          </h1>
          <p className="text-slate-600">
            Real-time insights into communication bias patterns across your organization
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'trends'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <TrendingDown className="w-5 h-5" />
              Bias Reduction
            </button>
            <button
              onClick={() => setActiveTab('departments')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'departments'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-5 h-5" />
              Departments
            </button>
            <button
              onClick={() => setActiveTab('heatmap')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'heatmap'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Map className="w-5 h-5" />
              Heatmaps
            </button>
          </div>
        </div>

        {/* Department Filter */}
        <div className="mb-6 bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-slate-700">
              Filter by Department:
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value as Department | 'all')}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              <option value="engineering">Engineering</option>
              <option value="sales">Sales</option>
              <option value="marketing">Marketing</option>
              <option value="hr">Human Resources</option>
              <option value="finance">Finance</option>
              <option value="operations">Operations</option>
              <option value="executive">Executive</option>
            </select>
            <div className="ml-auto text-sm text-slate-600">
              Analyzing <span className="font-semibold text-slate-900">{filteredMessages.length}</span> messages
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <BiasAnalysisDashboard messages={filteredMessages} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <BiasReductionTrend messages={filteredMessages} />
              <BiasTypeChart messages={filteredMessages} />
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-8">
            <BiasReductionTrend messages={filteredMessages} />
            <BiasTypeChart messages={filteredMessages} />
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Key Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-200 rounded-lg">
                      <TrendingDown className="w-5 h-5 text-green-700" />
                    </div>
                    <div>
                      <div className="font-medium text-green-900 mb-1">Positive Progress</div>
                      <div className="text-sm text-green-700">
                        Bias detection rates have decreased significantly over the past 3 months, 
                        indicating improved communication practices.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-200 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-blue-700" />
                    </div>
                    <div>
                      <div className="font-medium text-blue-900 mb-1">Recent Improvements</div>
                      <div className="text-sm text-blue-700">
                        Most departments show reduced bias scores in recent weeks, 
                        with HR and Marketing leading the improvement.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'departments' && (
          <div className="space-y-8">
            <DepartmentBiasBreakdown messages={filteredMessages} />
          </div>
        )}

        {activeTab === 'heatmap' && (
          <div className="space-y-8">
            <BiasHeatmap messages={filteredMessages} />
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Heatmap Insights
              </h3>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700">
                  The heatmap visualization provides a quick overview of bias patterns across different dimensions:
                </p>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>
                    <strong>By Message Source:</strong> Compare bias instances across Slack, Teams, and Email 
                    to identify which communication channels need more attention.
                  </li>
                  <li>
                    <strong>By Department:</strong> Track which departments have higher concentrations of 
                    specific bias types to target training and awareness programs.
                  </li>
                  <li>
                    <strong>Color Intensity:</strong> Darker, redder cells indicate higher severity and 
                    frequency, requiring immediate intervention.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
