import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function ProductPagination({
  currentPage = 1,
  limit = 10,
  total = 0,
  onPageChange,
  onLimitChange,
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);

  const start = total === 0 ? 0 : (safePage - 1) * limit + 1;
  const end = Math.min(safePage * limit, total);

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (safePage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (safePage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [1, "...", safePage - 1, safePage, safePage + 1, "...", totalPages];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <div className="text-xs sm:text-sm text-slate-600 font-medium">
        Showing <span className="font-bold text-slate-900">{start}</span>–
        <span className="font-bold text-slate-900">{end}</span> of{" "}
        <span className="font-bold text-slate-900">{total}</span> products
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={safePage === 1}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage === 1}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1 text-xs font-medium px-2.5"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        <div className="flex items-center gap-1 mx-1">
          {pageNumbers.map((p, index) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-1 text-xs font-medium text-slate-400 select-none"
                >
                  ...
                </span>
              );
            }

            const isCurrent = p === safePage;
            return (
              <button
                key={`page-${p}`}
                onClick={() => onPageChange(p)}
                className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold transition-all ${
                  isCurrent
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage >= totalPages}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1 text-xs font-medium px-2.5"
          title="Next Page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={safePage >= totalPages}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-600">
        <label htmlFor="pageSizeSelect" className="font-medium whitespace-nowrap">
          Page size:
        </label>
        <select
          id="pageSizeSelect"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 cursor-pointer"
        >
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>
      </div>
    </div>
  );
}
