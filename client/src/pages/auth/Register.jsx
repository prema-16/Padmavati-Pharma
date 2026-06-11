import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPills, FaEye, FaEyeSlash } from "react-icons/fa";
import { register, clearError } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name:"", email:"", companyName:"", licenseNumber:"", phone:"", password:"", confirmPassword:"" });
  const [showPw, setShowPw] = useState(false);

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => { if (user) { toast.success("Account created!"); navigate("/"); } }, [user]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error("Passwords do not match");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    const { confirmPassword, ...data } = form;
    dispatch(register(data));
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex bg-gradient-to-br from-primary to-primary-dark items-center justify-center p-12">
        <div className="text-white max-w-sm">
          <div className="flex items-center gap-3 mb-8"><div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><FaPills className="text-2xl" /></div><span className="font-bold text-2xl">Padmavati Pharma</span></div>
          <h2 className="text-3xl font-bold mb-4">Join Padmavati Pharma</h2>
          <p className="text-blue-100 leading-7 mb-8">Register your pharmacy, clinic or hospital to access thousands of genuine pharmaceutical products at wholesale prices.</p>
          {[["💊 10,000+ Products","Tablets, capsules, syrups & more"],["💰 Wholesale Prices","Save up to 30% vs retail"],["📄 GST Invoicing","Automated compliant billing"],["🚚 Fast Delivery","Pan-India shipping"]].map(([t,d])=>(
            <div key={t} className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 text-base">{t.charAt(0)}</div>
              <div><p className="font-semibold">{t.slice(2)}</p><p className="text-blue-200 text-sm">{d}</p></div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center p-8 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Create Account</h1>
          <p className="text-gray-500 text-sm mb-7">Fill in your details to get started</p>
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Full Name *</label><input type="text" required value={form.name} onChange={f("name")} className="input" placeholder="Dr. John Doe" /></div>
              <div><label className="label">Email *</label><input type="email" required value={form.email} onChange={f("email")} className="input" placeholder="you@company.com" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Company / Store *</label><input type="text" required value={form.companyName} onChange={f("companyName")} className="input" placeholder="Apollo Pharmacy" /></div>
              <div><label className="label">Phone</label><input type="text" value={form.phone} onChange={f("phone")} className="input" placeholder="10-digit number" /></div>
            </div>
            <div><label className="label">License Number *</label><input type="text" required value={form.licenseNumber} onChange={f("licenseNumber")} className="input" placeholder="DL-MH-123456" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Password *</label>
                <div className="relative"><input type={showPw?"text":"password"} required value={form.password} onChange={f("password")} className="input pr-10" placeholder="Min 6 chars" minLength="6" /><button type="button" onClick={()=>setShowPw(p=>!p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPw?<FaEyeSlash/>:<FaEye/>}</button></div>
              </div>
              <div><label className="label">Confirm Password *</label><input type="password" required value={form.confirmPassword} onChange={f("confirmPassword")} className="input" placeholder="Repeat password" /></div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base disabled:opacity-60">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5">Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
