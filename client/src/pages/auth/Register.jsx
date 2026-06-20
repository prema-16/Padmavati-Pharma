import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaPills, FaEye, FaEyeSlash, FaArrowLeft,
  FaUser, FaEnvelope, FaBuilding, FaPhone,
  FaIdCard, FaLock, FaExclamationCircle,
} from "react-icons/fa";
import { register, clearError } from "../../redux/slices/authSlice";
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

/* ── Validation rules ────────────────────────────────────────── */
const rules = {
  name:            (v) => (!v.trim()                              ? "Full name is required."              : ""),
  email:           (v) => (!v.trim()                              ? "Email address is required."          :
                           !/\S+@\S+\.\S+/.test(v)               ? "Enter a valid email address."        : ""),
  companyName:     (v) => (!v.trim()                              ? "Company / Store name is required."   : ""),
  licenseNumber:   (v) => (!v.trim()                              ? "Drug license number is required."    : ""),
  password:        (v) => (!v                                     ? "Password is required."               :
                           v.length < 6                           ? "Password must be at least 6 characters." : ""),
  confirmPassword: (v, form) => (!v                               ? "Please confirm your password."      :
                           v !== form.password                    ? "Passwords do not match."             : ""),
};

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({
    name: "", email: "", companyName: "",
    licenseNumber: "", phone: "", password: "", confirmPassword: "",
  });
  const [errors,  setErrors]  = useState({});
  const [showPw,  setShowPw]  = useState(false);
  const [showCPw, setShowCPw] = useState(false);

  useEffect(() => {
    if (user) { toast.success("Account created! Welcome 🎉"); navigate("/"); }
  }, [user]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error]);

  const set = (k) => (e) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, [k]: val }));
    // Clear error as user types (live)
    if (errors[k]) {
      const msg = rules[k] ? rules[k](val, { ...form, [k]: val }) : "";
      setErrors((prev) => ({ ...prev, [k]: msg }));
    }
  };

  const blur = (k) => (e) => {
    if (!rules[k]) return;
    const msg = rules[k](e.target.value, form);
    setErrors((prev) => ({ ...prev, [k]: msg }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(rules).forEach((k) => {
      const msg = rules[k](form[k], form);
      if (msg) newErrors[k] = msg;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    const { confirmPassword, ...data } = form;
    dispatch(register(data));
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
          <h2 className="text-3xl font-bold mb-4">Join Padmavati Pharma</h2>
          <p className="text-blue-100 leading-7 mb-8">
            Register your pharmacy, clinic or hospital to access thousands of genuine pharmaceutical products at wholesale prices.
          </p>
          {[
            ["💊", "10,000+ Products", "Tablets, capsules, syrups & more"],
            ["💰", "Wholesale Prices", "Save up to 30% vs retail"],
            ["📄", "GST Invoicing",    "Automated compliant billing"],
            ["🚚", "Fast Delivery",    "Pan-India shipping"],
          ].map(([icon, title, desc]) => (
            <div key={title} className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 text-lg">{icon}</div>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-blue-200 text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
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

            <div className="mb-5">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">Create Account</h1>
              <p className="text-gray-500 text-sm mt-1">Fill in your details to get started</p>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-6 sm:px-7 sm:py-7 space-y-4"
            >

              {/* Full Name */}
              <div>
                <label className="label">Full Name <span className="text-red-400">*</span></label>
                <div className="relative">
                  <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <input
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={set("name")}
                    onBlur={blur("name")}
                    className={inputClass("name")}
                    placeholder="Dr. John Doe"
                  />
                </div>
                <FieldError msg={errors.name} />
              </div>

              {/* Email */}
              <div>
                <label className="label">Email Address <span className="text-red-400">*</span></label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={set("email")}
                    onBlur={blur("email")}
                    className={inputClass("email")}
                    placeholder="you@company.com"
                  />
                </div>
                <FieldError msg={errors.email} />
              </div>

              {/* Company Name */}
              <div>
                <label className="label">Company / Store Name <span className="text-red-400">*</span></label>
                <div className="relative">
                  <FaBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <input
                    type="text"
                    autoComplete="organization"
                    value={form.companyName}
                    onChange={set("companyName")}
                    onBlur={blur("companyName")}
                    className={inputClass("companyName")}
                    placeholder="Apollo Pharmacy"
                  />
                </div>
                <FieldError msg={errors.companyName} />
              </div>

              {/* Phone — optional */}
              <div>
                <label className="label">Phone Number <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
                <div className="relative">
                  <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    className="input pl-10 h-12 text-base"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                </div>
              </div>

              {/* License Number */}
              <div>
                <label className="label">Drug License Number <span className="text-red-400">*</span></label>
                <div className="relative">
                  <FaIdCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <input
                    type="text"
                    value={form.licenseNumber}
                    onChange={set("licenseNumber")}
                    onBlur={blur("licenseNumber")}
                    className={inputClass("licenseNumber")}
                    placeholder="DL-MH-123456"
                  />
                </div>
                <FieldError msg={errors.licenseNumber} />
              </div>

              {/* Password */}
              <div>
                <label className="label">Password <span className="text-red-400">*</span></label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <input
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={set("password")}
                    onBlur={blur("password")}
                    className={`${inputClass("password")} pr-12`}
                    placeholder="Min. 6 characters"
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

              {/* Confirm Password */}
              <div>
                <label className="label">Confirm Password <span className="text-red-400">*</span></label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <input
                    type={showCPw ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={set("confirmPassword")}
                    onBlur={blur("confirmPassword")}
                    className={`${inputClass("confirmPassword")} pr-12`}
                    placeholder="Repeat your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCPw((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1.5"
                    aria-label={showCPw ? "Hide" : "Show"}
                  >
                    {showCPw ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {/* Custom match indicator */}
                {errors.confirmPassword ? (
                  <FieldError msg={errors.confirmPassword} />
                ) : form.confirmPassword.length > 0 ? (
                  <div className="flex items-center gap-1.5 mt-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-green-500 text-xs font-bold flex-shrink-0">✓</span>
                    <p className="text-xs text-green-600 font-medium">Passwords match</p>
                  </div>
                ) : null}
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

            <p className="text-center text-sm text-gray-500 mt-5 mb-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
