import { Link, useLocation } from "react-router-dom";
import {
  Package,
  PlusCircle,
  X,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    {
      name: "Product Catalog",
      href: "/products",
      icon: Package,
      exact: true,
    },
    {
      name: "Add New Product",
      href: "/products/new",
      icon: PlusCircle,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 z-40 md:z-20 h-screen md:h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 md:hidden">
            <span className="font-bold text-slate-800">Navigation Menu</span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1">
            <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Management
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => onClose?.()}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 font-semibold shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-indigo-600" : "text-slate-400"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* <div className="mt-8 space-y-1">
            <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              API Status
            </p>
            <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center justify-between font-medium">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  DummyJSON API
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-[11px] text-slate-500">
                Axios interceptors + Local CRUD overlay active
              </p>
            </div>
          </div> */}
        </div>

        {/* <div className="p-4 border-t border-slate-100">
          <div className="bg-linear-to-br from-indigo-50 to-violet-50 p-3.5 rounded-2xl border border-indigo-100 text-xs text-slate-700">
            <div className="flex items-center gap-1.5 font-semibold text-indigo-900 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>React 19 Build</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Tailwind CSS, Pure React pagination, custom table & client-overlay state.
            </p>
          </div>
        </div> */}
      </aside>
    </>
  );
}
