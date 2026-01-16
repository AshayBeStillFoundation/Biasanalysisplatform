import { useState } from 'react';
import { Upload, Slack, Users, Mail, FileText, Sparkles } from 'lucide-react';
import { Message } from '../types';
import { generateMockMessages } from '../utils/mockData';

interface MessageUploadProps {
  onMessagesUploaded: (messages: Message[]) => void;
}

export function MessageUpload({ onMessagesUploaded }: MessageUploadProps) {
  const [selectedSource, setSelectedSource] = useState<'slack' | 'teams' | 'email' | null>(null);

  const handleLoadDemo = () => {
    const mockMessages = generateMockMessages();
    onMessagesUploaded(mockMessages);
  };

  const handleSourceSelect = (source: 'slack' | 'teams' | 'email') => {
    setSelectedSource(source);
    // In a real app, this would trigger OAuth flow or file upload
    // For demo, we'll generate mock data for the selected source
    const mockMessages = generateMockMessages(source);
    onMessagesUploaded(mockMessages);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl mb-3">Bias Analysis Platform</h1>
          <p className="text-lg text-slate-600">
            Analyze communication for unconscious bias and promote inclusive language
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-xl mb-6">Select Communication Source</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => handleSourceSelect('slack')}
              className="p-6 border-2 border-slate-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group"
            >
              <Slack className="w-12 h-12 mb-3 mx-auto text-slate-400 group-hover:text-purple-500" />
              <h3 className="text-lg mb-2">Slack</h3>
              <p className="text-sm text-slate-600">Import Slack messages</p>
            </button>

            <button
              onClick={() => handleSourceSelect('teams')}
              className="p-6 border-2 border-slate-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group"
            >
              <Users className="w-12 h-12 mb-3 mx-auto text-slate-400 group-hover:text-purple-500" />
              <h3 className="text-lg mb-2">Microsoft Teams</h3>
              <p className="text-sm text-slate-600">Import Teams chats</p>
            </button>

            <button
              onClick={() => handleSourceSelect('email')}
              className="p-6 border-2 border-slate-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group"
            >
              <Mail className="w-12 h-12 mb-3 mx-auto text-slate-400 group-hover:text-purple-500" />
              <h3 className="text-lg mb-2">Email</h3>
              <p className="text-sm text-slate-600">Import email threads</p>
            </button>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <p className="text-sm text-slate-600 mb-4 text-center">Or upload a file directly</p>
            <label className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 cursor-pointer transition-all">
              <Upload className="w-5 h-5 text-slate-400" />
              <span className="text-slate-600">Upload CSV, JSON, or TXT file</span>
              <input type="file" className="hidden" accept=".csv,.json,.txt" />
            </label>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleLoadDemo}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
          >
            <FileText className="w-5 h-5" />
            Load Demo Data
          </button>
          <p className="text-sm text-slate-500 mt-3">
            Try with sample messages to see how it works
          </p>
        </div>
      </div>
    </div>
  );
}
