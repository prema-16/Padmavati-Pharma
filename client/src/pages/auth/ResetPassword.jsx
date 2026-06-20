import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaPills, FaEye, FaEyeSlash, FaLock, FaExclamationCircle } from "react-icons/fa";
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

export default function ResetPassword() {
  const { token } = useParams();
  const navigate  = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);
  const [errors,   setErrors]   = useState({});

  const validateField = (name, val, all = { password, confirm }) => {
    if (name === "password") {
      if (!val)         return "New password is required.";
      if (val.length < 6) return "Password must be at least 6 characters.";
    }
    if (name === "confirm") {
      if (!val)           return "Please confirm your password.";
      if (val !== all.password) return "Passwords do not match.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pwErr  = validateField("password", password);
    const cfmErr = validateField("confirm",  confirm, { password, confirm });
    if (pwErr || cfmErr) { setErrors({ password: pwErr, confirm: cfmErr }); return; }

    setLoading(true);
    try {
      await api.put(`/auth/resetpassword/${token}`, { password });
      setDone(true);
      toast.success("Password reset successfully");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired link");
    } finally { setLoading(false); }
  };

  const inputClass = (field) =>
    `input h-12 text-base pl-10 ${field === "password" ? "pr-12" : ""} ${
      errors[field] ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-100" : ""
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <FaPills className="text-white text-lg" />
          </div>
          <span className="font-bold text-xl text-primary">Padmavati Pharma</span>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">Set New Password</h1>
        <p className="text-gray-500 text-sm text-center mb-8">Enter a strong new password for your account</p>

        {done ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="font-bold text-green-700 text-lg mb-2">Password Updated!</h3>
            <p className="text-green-600 text-sm mb-6">Redirecting you to login...</p>
            <Link to="/login" className="btn-primary">Go to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 space-y-5">
            {/* New Password */}
            <div>
              <label className="label">New Password</label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                <input
                  type={showPwd ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((p) => ({ ...p, password: validateField("password", e.target.value) }));
                  }}
                  onBlur={(e) => setErrors((p) => ({ ...p, password: validateField("password", e.target.value) }))}
                  className={inputClass("password")}
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1.5"
                  onClick={() => setShowPwd((p) => !p)}
                  aria-label={showPwd ? "Hide" : "Show"}
                >
                  {showPwd ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <FieldError msg={errors.password} />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                <input
                  type={showPwd ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    if (errors.confirm) setErrors((p) => ({ ...p, confirm: validateField("confirm", e.target.value, { password, confirm: e.target.value }) }));
                  }}
                  onBlur={(e) => setErrors((p) => ({ ...p, confirm: validateField("confirm", e.target.value, { password, confirm: e.target.value }) }))}
                  className={inputClass("confirm")}
                  placeholder="Re-enter password"
                />
              </div>
              {errors.confirm ? (
                <FieldError msg={errors.confirm} />
              ) : confirm.length > 0 ? (
                <div className="flex items-center gap-1.5 mt-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-green-500 text-xs font-bold">✓</span>
                  <p className="text-xs text-green-600 font-medium">Passwords match</p>
                </div>
              ) : null}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full h-12 text-base disabled:opacity-60">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Resetting...
                </span>
              ) : "Reset Password"}
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
