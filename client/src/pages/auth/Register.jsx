import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaPills, FaEye, FaEyeSlash, FaArrowLeft,
  FaUser, FaEnvelope, FaBuilding, FaPhone,
  FaIdCard, FaLock,
} from "react-icons/fa";
import { register, clearError } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({
    name: "", email: "", companyName: "",
    licenseNumber: "", phone: "", password: "", confirmPassword: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    if (user) { toast.success("Account created! Welcome 🎉"); navigate("/"); }
  }, [user]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error("Passwords do not match");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    const { confirmPassword, ...data } = form;
    dispatch(register(data));
  };

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
          <h2 className="text-3xl font-bold mb-4">Join Padmavati Pharma</h2>
          <p className="text-blue-100 leading-7 mb-8">
            Register your pharmacy, clinic or hospital to access thousands of genuine pharmaceutical products at wholesale prices.
          </p>
          {[
            ["💊", "10,000+ Products", "Tablets, capsules, syrups & more"],
            ["💰", "Wholesale Prices", "Save up to 30% vs retail"],
            ["📄", "GST Invoicing", "Automated compliant billing"],
            ["🚚", "Fast Delivery", "Pan-India shipping"],
          ].map(([icon, title, desc]) => (
            <div key={title} className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 text-lg">
                {icon}
              </div>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-blue-200 text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel / full screen on mobile ── */}
      <div className="flex-1 flex flex-col bg-gray-50 overflow-y-auto">

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
        <div className="flex-1 flex items-start justify-center px-4 py-5 sm:px-8 sm:py-8">
          <div className="w-full max-w-sm">

            {/* Heading */}
            <div className="mb-5">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">Create Account</h1>
              <p className="text-gray-500 text-sm mt-1">Fill in your details to get started</p>
            </div>

            {/* Form card */}
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-6 sm:px-7 sm:py-7 space-y-4"
            >

              {/* Full Name */}
              <div>
                <label className="label">Full Name *</label>
                <div className="relative">
                  <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={f("name")}
                    className="input pl-10 h-12 text-base"
                    placeholder="Dr. John Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="label">Email Address *</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <input
                    type="email"
                    required
                    inputMode="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={f("email")}
                    className="input pl-10 h-12 text-base"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label className="label">Company / Store Name *</label>
                <div className="relative">
                  <FaBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <input
                    type="text"
                    required
                    autoComplete="organization"
                    value={form.companyName}
                    onChange={f("companyName")}
                    className="input pl-10 h-12 text-base"
                    placeholder="Apollo Pharmacy"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="label">Phone Number</label>
                <div className="relative">
                  <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={f("phone")}
                    className="input pl-10 h-12 text-base"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                </div>
              </div>

              {/* License Number */}
              <div>
                <label className="label">Drug License Number *</label>
                <div className="relative">
                  <FaIdCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={form.licenseNumber}
                    onChange={f("licenseNumber")}
                    className="input pl-10 h-12 text-base"
                    placeholder="DL-MH-123456"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="label">Password *</label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={form.password}
                    onChange={f("password")}
                    className="input pl-10 pr-12 h-12 text-base"
                    placeholder="Min. 6 characters"
                    minLength={6}
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
              </div>

              {/* Confirm Password */}
              <div>
                <label className="label">Confirm Password *</label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <input
                    type={showCPw ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={f("confirmPassword")}
                    className="input pl-10 pr-12 h-12 text-base"
                    placeholder="Repeat your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCPw((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1.5"
                    aria-label={showCPw ? "Hide password" : "Show password"}
                  >
                    {showCPw ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {/* Password match hint */}
                {form.confirmPassword.length > 0 && (
                  <p className={`text-xs mt-1.5 font-medium ${form.password === form.confirmPassword ? "text-green-600" : "text-red-500"}`}>
                    {form.password === form.confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full h-12 text-base disabled:opacity-60 mt-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : "Create Account"}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500 mt-5 mb-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
