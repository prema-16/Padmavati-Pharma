import { useState } from "react";
import { Link } from "react-router-dom";
import { FaPills, FaEnvelope, FaExclamationCircle } from "react-icons/fa";
import api from "../../services/api";
import toast from "react-hot-toast";

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
      <FaExclamationCircle className="text-red-500 text-xs flex-shrink-0" />
      <p className="text-xs text-red-600 font-medium">{msg}</p>
    </div>
  );
}

export default function ForgotPassword() {
  const [email, setEmail]     = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const validateEmail = (val) => {
    if (!val.trim())                    return "Email address is required.";
    if (!/\S+@\S+\.\S+/.test(val))     return "Please enter a valid email address.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) { setEmailErr(err); return; }
    setLoading(true);
    try {
      await api.post("/auth/forgotpassword", { email });
      setSent(true);
      toast.success("Reset link sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <FaPills className="text-white text-lg" />
          </div>
          <span className="font-bold text-xl text-primary">Padmavati Pharma</span>
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Forgot Password?</h1>
        <p className="text-gray-500 text-sm text-center mb-8">Enter your registered email to receive a reset link</p>

        {sent ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">📧</div>
            <h3 className="font-bold text-green-700 text-lg mb-2">Email Sent!</h3>
            <p className="text-green-600 text-sm mb-6">Check your inbox for the password reset link.</p>
            <Link to="/login" className="btn-primary">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailErr) setEmailErr(validateEmail(e.target.value)); }}
                  onBlur={(e) => setEmailErr(validateEmail(e.target.value))}
                  className={`input pl-10 h-12 text-base ${emailErr ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-100" : ""}`}
                  placeholder="you@company.com"
                />
              </div>
              <FieldError msg={emailErr} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full h-12 text-base disabled:opacity-60">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Sending...
                </span>
              ) : "Send Reset Link"}
            </button>
          </form>
        )}
        <p className="text-center mt-5">
          <Link to="/login" className="text-primary text-sm hover:underline">← Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
