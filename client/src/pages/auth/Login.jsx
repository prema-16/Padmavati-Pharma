import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPills, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { login, clearError } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);

  useEffect(() => { if (user) navigate(["owner","staff"].includes(user.role) ? "/admin/dashboard" : "/"); }, [user]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error]);

  const handleSubmit = (e) => { e.preventDefault(); dispatch(login(form)); };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex bg-gradient-to-br from-primary to-primary-dark items-center justify-center p-12">
        <div className="text-white max-w-sm">
          <div className="flex items-center gap-3 mb-8"><div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><FaPills className="text-2xl" /></div><span className="font-bold text-2xl">Padmavati Pharma</span></div>
          <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-blue-100 leading-7 mb-8">Login to access your wholesale account, browse thousands of pharmaceutical products and manage your orders.</p>
          {[["🔒 Secure Access","Bank-grade encrypted login"],["📦 Order Management","Track all your orders"],["💰 Exclusive Pricing","Access wholesale prices"]].map(([t,d])=>(
            <div key={t} className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-base flex-shrink-0">{t.charAt(0)}</div>
              <div><p className="font-semibold">{t.slice(2)}</p><p className="text-blue-200 text-sm">{d}</p></div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 md:hidden">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center"><FaPills className="text-white" /></div>
            <span className="font-bold text-lg text-primary">Padmavati Pharma</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Sign In</h1>
          <p className="text-gray-500 text-sm mb-7">Enter your credentials to access your account</p>
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative"><FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" /><input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input pl-10" placeholder="you@company.com" /></div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative"><FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" /><input type={showPw?"text":"password"} required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="input pl-10 pr-10" placeholder="Your password" /><button type="button" onClick={()=>setShowPw(p=>!p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPw?<FaEyeSlash/>:<FaEye/>}</button></div>
            </div>
            <div className="text-right"><Link to="/forgot-password" className="text-primary text-sm font-medium hover:underline">Forgot password?</Link></div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base disabled:opacity-60">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5">Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Register here</Link></p>
          <p className="text-center mt-3"><Link to="/" className="text-gray-400 text-xs hover:text-gray-600">← Back to Home</Link></p>
        </div>
      </div>
    </div>
  );
}
