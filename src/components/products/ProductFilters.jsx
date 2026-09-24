import { Search, X, SlidersHorizontal, ArrowUpDown, Sparkles, Filter } from "lucide-react";

export default function ProductFilters({
  search,
  setSearch,
  category,
  setCategory,
  sort,
  setSort,
  categories = [],
  isSearching = false,
  onReset,
}) {
  const hasActiveFilters = Boolean(search || category || sort);

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs mb-6 space-y-4">
      {/* Top Filter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        {/* Search Field */}
        <div className="lg:col-span-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search products by title, description, or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {isSearching && (
            <div className="absolute right-9 top-1/2 -translate-y-1/2">
              <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="lg:col-span-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Filter className="w-4 h-4" />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 appearance-none cursor-pointer transition-all truncate"
          >
            <option value="">All Categories ({categories.length || 0})</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="lg:col-span-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <ArrowUpDown className="w-4 h-4" />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 appearance-none cursor-pointer transition-all"
          >
            <option value="">Default Sorting</option>
            <option value="price-asc">Price: Low to High ($ → $$$)</option>
            <option value="price-desc">Price: High to Low ($$$ → $)</option>
            <option value="rating-desc">Rating: Highest Rated (★ 5 → 1)</option>
            <option value="rating-asc">Rating: Lowest Rated (★ 1 → 5)</option>
            <option value="title-asc">Title: Alphabetical (A to Z)</option>
            <option value="title-desc">Title: Alphabetical (Z to A)</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Active Filter Pills & Reset */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Active filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium">
                Search: "{search}"
                <button
                  onClick={() => setSearch("")}
                  className="hover:text-indigo-900 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 border border-violet-200 font-medium capitalize">
                Category: {category.replace("-", " ")}
                <button
                  onClick={() => setCategory("")}
                  className="hover:text-violet-900 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {sort && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                Sort: {sort.replace("-", " ")}
                <button
                  onClick={() => setSort("")}
                  className="hover:text-slate-900 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <button
            onClick={onReset}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors underline"
          >
            Reset all
          </button>
        </div>
      )}

      {/* Simultaneous Search & Filter Info Notice */}
      {search && category && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-800">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Combined Filter:</strong> Searching for "<em>{search}</em>" inside the "
            <strong className="capitalize">{category.replace("-", " ")}</strong>" category using client-side query matching.
          </span>
        </div>
      )}
    </div>
  );
}
