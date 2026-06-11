import { useState } from "react";
import { Link } from "react-router-dom";
import { FaPills } from "react-icons/fa";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center"><FaPills className="text-white text-lg" /></div>
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
          <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 space-y-5">
            <div><label className="label">Email Address</label><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="input" placeholder="you@company.com" /></div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">{loading ? "Sending..." : "Send Reset Link"}</button>
          </form>
        )}
        <p className="text-center mt-5"><Link to="/login" className="text-primary text-sm hover:underline">← Back to Login</Link></p>
      </div>
    </div>
  );
}
