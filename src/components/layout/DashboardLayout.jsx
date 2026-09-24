import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import AuthGuard from "../common/AuthGuard";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
