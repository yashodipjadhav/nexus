import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorMessage({
  message = "Failed to fetch data from the server.",
  onRetry,
}) {
  return (
    <div className="bg-red-50/80 border border-red-200 rounded-2xl p-6 my-4 text-center max-w-lg mx-auto">
      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-red-900 mb-1">Something went wrong</h3>
      <p className="text-sm text-red-700 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-all shadow-sm active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Request
        </button>
      )}
    </div>
  );
}
