import { Package, FolderTree, AlertOctagon, TrendingUp } from "lucide-react";

export default function ProductStats({ total = 0, categoriesCount = 0, products = [] }) {
  const lowStockCount = products.filter((p) => Number(p.stock) > 0 && Number(p.stock) <= 15).length;
  const outOfStockCount = products.filter((p) => Number(p.stock) <= 0).length;

  const stats = [
    {
      name: "Total Products",
      value: total.toLocaleString(),
      subtitle: "In database catalog",
      icon: Package,
      color: "text-indigo-600",
      bg: "bg-indigo-50 border-indigo-100",
    },
    {
      name: "Categories",
      value: categoriesCount || "24+",
      subtitle: "Product segments",
      icon: FolderTree,
      color: "text-violet-600",
      bg: "bg-violet-50 border-violet-100",
    },
    {
      name: "Low / Out of Stock",
      value: `${lowStockCount + outOfStockCount}`,
      subtitle: `${lowStockCount} low, ${outOfStockCount} out of stock`,
      icon: AlertOctagon,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-100",
    },
    {
      name: "Inventory Status",
      value: "Healthy",
      subtitle: "Active sync with DummyJSON",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">{stat.name}</span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${stat.bg}`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold text-slate-900">{stat.value}</span>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">{stat.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
