import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPills, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaExclamationCircle } from "react-icons/fa";
import { login, clearError } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

/* ── Reusable inline error message ──────────────────────────── */
function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg animate-[fadeIn_.15s_ease]">
      <FaExclamationCircle className="text-red-500 text-xs flex-shrink-0" />
      <p className="text-xs text-red-600 font-medium">{msg}</p>
    </div>
  );
}

export default function Login() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, error, user } = useSelector((s) => s.auth);
  const [form,   setForm]   = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (user) navigate(["owner", "staff"].includes(user.role) ? "/admin/dashboard" : "/");
  }, [user]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error]);

  /* ── Validate a single field on blur ── */
  const validateField = (name, value) => {
    let msg = "";
    if (name === "email") {
      if (!value.trim())               msg = "Email address is required.";
      else if (!/\S+@\S+\.\S+/.test(value)) msg = "Please enter a valid email address.";
    }
    if (name === "password") {
      if (!value) msg = "Password is required.";
    }
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  /* ── Validate all on submit ── */
  const validate = () => {
    const newErrors = {};
    if (!form.email.trim())               newErrors.email    = "Email address is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Please enter a valid email address.";
    if (!form.password)                   newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(login(form));
  };

  const inputClass = (field) =>
    `input pl-10 h-12 text-base transition-all ${
      errors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/30"
        : ""
    }`;

  return (
    <div className="min-h-screen flex flex-col md:grid md:grid-cols-2">

      {/* ── Left panel — desktop only ── */}
      <div className="hidden md:flex bg-gradient-to-br from-primary to-primary-dark items-center justify-center p-12">
        <div className="text-white max-w-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FaPills className="text-2xl" />
            </div>
            <span className="font-bold text-2xl">Padmavati Pharma</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-blue-100 leading-7 mb-8">
            Login to access your wholesale account, browse thousands of pharmaceutical products and manage your orders.
          </p>
          {[
            ["🔒", "Secure Access",    "Bank-grade encrypted login"],
            ["📦", "Order Management", "Track all your orders"],
            ["💰", "Exclusive Pricing","Access wholesale prices"],
          ].map(([icon, title, desc]) => (
            <div key={title} className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-lg flex-shrink-0">{icon}</div>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-blue-200 text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col bg-gray-50">

        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 pt-5 pb-2">
          <Link to="/" className="flex items-center gap-1.5 text-gray-500 text-sm hover:text-primary transition-colors">
            <FaArrowLeft className="text-xs" /> Home
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <FaPills className="text-white text-xs" />
            </div>
            <span className="font-bold text-sm text-primary">Padmavati Pharma</span>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-4 py-6 sm:px-8 sm:py-10">
          <div className="w-full max-w-sm">

            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">Sign In</h1>
              <p className="text-gray-500 text-sm mt-1">Enter your credentials to access your account</p>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-6 sm:px-7 sm:py-8 space-y-5"
            >
              {/* Email */}
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => { setForm({ ...form, email: e.target.value }); if (errors.email) validateField("email", e.target.value); }}
                    onBlur={(e) => validateField("email", e.target.value)}
                    className={inputClass("email")}
                    placeholder="you@company.com"
                  />
                </div>
                <FieldError msg={errors.email} />
              </div>

              {/* Password */}
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <input
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(e) => { setForm({ ...form, password: e.target.value }); if (errors.password) validateField("password", e.target.value); }}
                    onBlur={(e) => validateField("password", e.target.value)}
                    className={`${inputClass("password")} pr-12`}
                    placeholder="Your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1.5"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <FieldError msg={errors.password} />
              </div>

              {/* Forgot */}
              <div className="text-right -mt-1">
                <Link to="/forgot-password" className="text-primary text-sm font-medium hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full h-12 text-base disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-semibold hover:underline">Register here</Link>
            </p>
            <p className="text-center mt-3 hidden md:block">
              <Link to="/" className="text-gray-400 text-xs hover:text-gray-600">← Back to Home</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
