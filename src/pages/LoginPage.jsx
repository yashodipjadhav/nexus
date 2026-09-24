import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { validateLogin } from "../utils/validation";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  LayoutDashboard,
  AlertCircle,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const { showToast } = useToast();

  const [username, setUsername] = useState("Yashodip");
  const [password, setPassword] = useState("Yashodip1234");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/products", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setApiError("");
    const validationErrors = validateLogin(username, password);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const userData = await login(username, password);
      showToast(`Welcome back, ${userData.firstName || username}!`, "success");
      navigate("/products", { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Invalid username or password. Please check credentials and try again.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoCredentials = () => {
    setUsername("Yashodip");
    setPassword("Yashodip1234");
    setErrors({});
    setApiError("");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-tr from-indigo-600 to-violet-500 text-white shadow-xl shadow-indigo-500/25 mb-4 transform hover:scale-105 transition-transform">
            <LayoutDashboard className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Product Admin Portal
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Sign in to manage catalog, products, & inventory
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50">
          {apiError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) setErrors((prev) => ({ ...prev, username: "" }));
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.username
                      ? "border-red-300 focus:ring-red-500/20 focus:border-red-500 bg-red-50/20"
                      : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-600"
                  }`}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500/20 focus:border-red-500 bg-red-50/20"
                      : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-600"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.password}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 mb-2">Quick Demo Access Credentials:</p>
            <button
              type="button"
              onClick={handleFillDemoCredentials}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                User: <strong className="text-indigo-600 font-semibold">{username || "Yashodip"}</strong> / Pass:{" "}
                <strong className="text-indigo-600 font-semibold">{password ? "••••••••" : "Yashodip1234"}</strong>
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-6">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Product Admin Dashboard</span>
        </div>
      </div>
    </div>
  );
}
