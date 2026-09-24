import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, UserCircle, KeyRound } from "lucide-react";
import ProfileModal from "../common/ProfileModal";

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand & Mobile Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 md:hidden transition-colors"
                aria-label="Toggle Navigation Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link to="/products" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg flex items-center gap-1.5">
                    Nexus Admin
                  </span>
                </div>
              </Link>
            </div>

            {/* Right: User Profile & Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {user && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setProfileModalOpen(true)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all text-left group"
                    title="Change Username & Password"
                  >
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.firstName || "User"}
                        className="w-8 h-8 rounded-full border border-slate-200 object-cover bg-slate-100"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        {user.firstName?.charAt(0) || <UserCircle className="w-5 h-5" />}
                      </div>
                    )}
                    <div className="hidden md:flex flex-col">
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        @{user.username || "admin"}
                      </span>
                    </div>
                    <KeyRound className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 ml-1 hidden sm:block transition-colors" />
                  </button>

                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-slate-200/80 hover:border-red-200"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  );
}
