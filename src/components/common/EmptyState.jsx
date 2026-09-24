import { PackageSearch, XCircle } from "lucide-react";

export default function EmptyState({
  title = "No products found",
  description = "No products matched your search or active filter criteria. Try adjusting your query.",
  onClearFilters,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs my-4">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-4">
        <PackageSearch className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-5">{description}</p>
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-all active:scale-95"
        >
          <XCircle className="w-4 h-4" />
          Clear All Filters
        </button>
      )}
    </div>
  );
}
