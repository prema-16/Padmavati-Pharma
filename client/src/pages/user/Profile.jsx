import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUser, FaBox, FaLock, FaSignOutAlt } from "react-icons/fa";
import { updateProfile, logout, clearError } from "../../redux/slices/authSlice";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const STATES = ["Maharashtra","Delhi","Karnataka","Tamil Nadu","Gujarat","Rajasthan","Uttar Pradesh","West Bengal","Telangana","Kerala","Punjab","Haryana"];

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((s) => s.auth);
  const [form, setForm] = useState({
    name: user?.name || "", companyName: user?.companyName || "",
    phone: user?.phone || "", licenseNumber: user?.licenseNumber || "",
    address: { street: user?.address?.street||"", city: user?.address?.city||"", state: user?.address?.state||"", zipCode: user?.address?.zipCode||"" },
  });
  const [pwForm, setPwForm] = useState({ currentPassword:"", newPassword:"", confirmNew:"" });
  const [tab, setTab] = useState("profile");
  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const fa = (k) => (e) => setForm({ ...form, address: { ...form.address, [k]: e.target.value } });

  const handleProfile = async (e) => {
    e.preventDefault();
    const res = await dispatch(updateProfile(form));
    if (res.meta.requestStatus === "fulfilled") toast.success("Profile updated!");
    else toast.error("Update failed");
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmNew) return toast.error("Passwords do not match");
    try {
      await api.put("/auth/changepassword", { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success("Password changed!");
      setPwForm({ currentPassword:"", newPassword:"", confirmNew:"" });
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-7">My Profile</h1>
      <div className="grid md:grid-cols-[260px_1fr] gap-7 items-start">
        {/* Sidebar */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm">
          <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-3">{user?.name?.charAt(0)}</div>
          <h3 className="font-bold text-gray-800">{user?.name}</h3>
          <p className="text-sm text-gray-400 mb-2">{user?.email}</p>
          <span className="badge-primary">{user?.companyName || "Customer"}</span>
          <nav className="mt-5 space-y-1 text-left">
            {[["profile",FaUser,"Profile"],["password",FaLock,"Change Password"]].map(([t,Icon,l])=>(
              <button key={t} onClick={()=>setTab(t)} className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${tab===t?"bg-primary/10 text-primary":"text-gray-500 hover:bg-gray-50"}`}><Icon className="text-sm" />{l}</button>
            ))}
            <Link to="/my-orders" className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50"><FaBox className="text-sm" />My Orders</Link>
            <button onClick={() => { dispatch(logout()); navigate("/"); }} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50"><FaSignOutAlt className="text-sm" />Logout</button>
          </nav>
        </div>

        {/* Content */}
        {tab === "profile" ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
            <h2 className="font-bold text-lg mb-5">Personal Information</h2>
            <form onSubmit={handleProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Full Name</label><input value={form.name} onChange={f("name")} className="input" required /></div>
                <div><label className="label">Email</label><input value={user?.email} className="input bg-gray-50" disabled /></div>
                <div><label className="label">Company Name</label><input value={form.companyName} onChange={f("companyName")} className="input" /></div>
                <div><label className="label">Phone</label><input value={form.phone} onChange={f("phone")} className="input" /></div>
                <div className="col-span-2"><label className="label">License Number</label><input value={form.licenseNumber} onChange={f("licenseNumber")} className="input" /></div>
              </div>
              <hr className="border-gray-100" />
              <h3 className="font-semibold text-gray-700">Delivery Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="label">Street Address</label><input value={form.address.street} onChange={fa("street")} className="input" placeholder="123 Medical Street" /></div>
                <div><label className="label">City</label><input value={form.address.city} onChange={fa("city")} className="input" /></div>
                <div><label className="label">State</label><select value={form.address.state} onChange={fa("state")} className="input"><option value="">Select State</option>{STATES.map(s=><option key={s}>{s}</option>)}</select></div>
                <div><label className="label">PIN Code</label><input value={form.address.zipCode} onChange={fa("zipCode")} className="input" /></div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">{loading ? "Saving..." : "Save Changes"}</button>
            </form>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
            <h2 className="font-bold text-lg mb-5">Change Password</h2>
            <form onSubmit={handlePassword} className="space-y-4 max-w-sm">
              <div><label className="label">Current Password</label><input type="password" value={pwForm.currentPassword} onChange={e=>setPwForm({...pwForm,currentPassword:e.target.value})} className="input" required /></div>
              <div><label className="label">New Password</label><input type="password" value={pwForm.newPassword} onChange={e=>setPwForm({...pwForm,newPassword:e.target.value})} className="input" required minLength="6" /></div>
              <div><label className="label">Confirm New Password</label><input type="password" value={pwForm.confirmNew} onChange={e=>setPwForm({...pwForm,confirmNew:e.target.value})} className="input" required /></div>
              <button type="submit" className="btn-primary">Update Password</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
