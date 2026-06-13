import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUser, FaLock, FaSignOutAlt, FaArrowLeft, FaChevronRight, FaBox } from "react-icons/fa";
import { updateProfile, logout } from "../../redux/slices/authSlice";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const STATES = ["Maharashtra","Delhi","Karnataka","Tamil Nadu","Gujarat","Rajasthan","Uttar Pradesh","West Bengal","Telangana","Kerala","Punjab","Haryana","Madhya Pradesh","Bihar","Goa","Odisha","Assam","Jharkhand","Uttarakhand","Himachal Pradesh"];

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((s) => s.auth);
  const [tab, setTab] = useState("home"); // home | edit | password
  const [form, setForm] = useState({
    name: user?.name || "", companyName: user?.companyName || "",
    phone: user?.phone || "", licenseNumber: user?.licenseNumber || "",
    address: { street: user?.address?.street||"", city: user?.address?.city||"", state: user?.address?.state||"", zipCode: user?.address?.zipCode||"" },
  });
  const [pwForm, setPwForm] = useState({ currentPassword:"", newPassword:"", confirmNew:"" });
  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const fa = (k) => (e) => setForm({ ...form, address: { ...form.address, [k]: e.target.value } });

  const handleProfile = async (e) => {
    e.preventDefault();
    const res = await dispatch(updateProfile(form));
    if (res.meta.requestStatus === "fulfilled") { toast.success("Profile updated!"); setTab("home"); }
    else toast.error("Update failed");
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmNew) return toast.error("Passwords do not match");
    try {
      await api.put("/auth/changepassword", { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success("Password changed!");
      setPwForm({ currentPassword:"", newPassword:"", confirmNew:"" });
      setTab("home");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  // ── Home screen ────────────────────────────────────────────
  if (tab === "home") return (
    <div className="max-w-lg mx-auto px-3 sm:px-6 py-4 sm:py-8">
      {/* Avatar card */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-6 mb-5 flex items-center gap-4 shadow-lg">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold flex-shrink-0">
          {user?.name?.charAt(0)}
        </div>
        <div className="min-w-0">
          <h2 className="font-bold text-xl leading-tight truncate">{user?.name}</h2>
          <p className="text-blue-200 text-sm truncate">{user?.email}</p>
          {user?.companyName && <p className="text-blue-100 text-xs mt-0.5 truncate">{user.companyName}</p>}
        </div>
      </div>

      {/* Menu items */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-50">
        {[
          { icon: FaUser, label: "Edit Profile", sub: "Update your details", action: () => setTab("edit"), color: "bg-blue-50 text-blue-500" },
          { icon: FaBox, label: "My Orders", sub: "View & track orders", action: () => navigate("/my-orders"), color: "bg-green-50 text-green-500" },
          { icon: FaLock, label: "Change Password", sub: "Update your password", action: () => setTab("password"), color: "bg-purple-50 text-purple-500" },
        ].map((item) => (
          <button key={item.label} onClick={item.action}
            className="w-full flex items-center gap-4 px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-all text-left">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
              <item.icon className="text-base" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-800">{item.label}</p>
              <p className="text-xs text-gray-400">{item.sub}</p>
            </div>
            <FaChevronRight className="text-gray-300 text-xs" />
          </button>
        ))}

        <button onClick={() => { dispatch(logout()); navigate("/"); }}
          className="w-full flex items-center gap-4 px-4 py-4 hover:bg-red-50 active:bg-red-100 transition-all text-left">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-400 flex items-center justify-center flex-shrink-0">
            <FaSignOutAlt className="text-base" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-red-500">Logout</p>
            <p className="text-xs text-gray-400">Sign out of your account</p>
          </div>
          <FaChevronRight className="text-gray-300 text-xs" />
        </button>
      </div>

      {/* License info */}
      {user?.licenseNumber && (
        <div className="mt-4 bg-blue-50 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">🏥</span>
          <div>
            <p className="text-xs text-gray-500">License Number</p>
            <p className="font-semibold text-sm text-gray-700">{user.licenseNumber}</p>
          </div>
        </div>
      )}
    </div>
  );

  // ── Edit Profile ───────────────────────────────────────────
  if (tab === "edit") return (
    <div className="max-w-lg mx-auto px-3 sm:px-6 py-4 sm:py-8">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => setTab("home")} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600">
          <FaArrowLeft className="text-sm" />
        </button>
        <h1 className="text-xl font-bold">Edit Profile</h1>
      </div>
      <form onSubmit={handleProfile} className="space-y-3">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-4">
          <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Personal Info</h3>
          <div><label className="label">Full Name</label><input value={form.name} onChange={f("name")} className="input" required /></div>
          <div><label className="label">Email (read only)</label><input value={user?.email} className="input bg-gray-50 text-gray-400" disabled /></div>
          <div><label className="label">Phone</label><input value={form.phone} onChange={f("phone")} className="input" placeholder="+91 XXXXXXXXXX" /></div>
          <div><label className="label">Company / Store Name</label><input value={form.companyName} onChange={f("companyName")} className="input" /></div>
          <div><label className="label">License Number</label><input value={form.licenseNumber} onChange={f("licenseNumber")} className="input" /></div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-4">
          <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Delivery Address</h3>
          <div><label className="label">Street Address</label><input value={form.address.street} onChange={fa("street")} className="input" placeholder="123 Medical Street" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">City</label><input value={form.address.city} onChange={fa("city")} className="input" /></div>
            <div><label className="label">PIN Code</label><input value={form.address.zipCode} onChange={fa("zipCode")} className="input" /></div>
          </div>
          <div><label className="label">State</label>
            <select value={form.address.state} onChange={fa("state")} className="input">
              <option value="">Select State</option>
              {STATES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-4 bg-primary text-white font-bold rounded-2xl text-base hover:bg-primary-dark active:scale-95 transition-all disabled:opacity-60">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );

  // ── Change Password ────────────────────────────────────────
  return (
    <div className="max-w-lg mx-auto px-3 sm:px-6 py-4 sm:py-8">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => setTab("home")} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600">
          <FaArrowLeft className="text-sm" />
        </button>
        <h1 className="text-xl font-bold">Change Password</h1>
      </div>
      <form onSubmit={handlePassword} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div><label className="label">Current Password</label><input type="password" value={pwForm.currentPassword} onChange={e=>setPwForm({...pwForm,currentPassword:e.target.value})} className="input" required /></div>
        <div><label className="label">New Password</label><input type="password" value={pwForm.newPassword} onChange={e=>setPwForm({...pwForm,newPassword:e.target.value})} className="input" required minLength="6" /></div>
        <div><label className="label">Confirm New Password</label><input type="password" value={pwForm.confirmNew} onChange={e=>setPwForm({...pwForm,confirmNew:e.target.value})} className="input" required /></div>
        <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-2xl text-base hover:bg-primary-dark active:scale-95 transition-all">
          Update Password
        </button>
      </form>
    </div>
  );
}
