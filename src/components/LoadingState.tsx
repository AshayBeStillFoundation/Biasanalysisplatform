import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">
          Loading Bias Analytics
        </h2>
        <p className="text-slate-600">
          Fetching and analyzing messages from API...
        </p>
      </div>
    </div>
  );
}
