import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTachometerAlt, FaPills, FaBoxOpen, FaUsers, FaTags, FaStar, FaSignOutAlt, FaBars, FaTimes, FaGlobe, FaChartLine } from "react-icons/fa";
import { logout } from "../../redux/slices/authSlice";

const links = [
  { to: "/admin/dashboard", icon: FaTachometerAlt, label: "Dashboard", section: "Main" },
  { to: "/admin/products", icon: FaPills, label: "Products", section: "Catalogue" },
  { to: "/admin/categories", icon: FaTags, label: "Categories", section: "Catalogue" },
  { to: "/admin/orders", icon: FaBoxOpen, label: "Orders", section: "Sales" },
  { to: "/admin/users", icon: FaUsers, label: "Users", section: "People" },
  { to: "/admin/reviews", icon: FaStar, label: "Reviews", section: "People" },
];

export default function AdminLayout() {
  const [sideOpen, setSideOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = () => { dispatch(logout()); navigate("/"); };

  const Sidebar = () => (
    <aside className="h-full flex flex-col bg-gray-900 text-gray-400 w-64 py-6">
      <div className="px-5 mb-6">
        <div className="flex items-center gap-2.5 font-bold text-white text-lg mb-1">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"><FaPills className="text-sm" /></div>
          <span>Admin Panel</span>
        </div>
        <p className="text-xs text-gray-500">{user?.name} · <span className="text-yellow-400 uppercase">{user?.role}</span></p>
      </div>

      {["Main","Catalogue","Sales","People"].map(section => {
        const sectionLinks = links.filter(l => l.section === section);
        return (
          <div key={section} className="mb-2 px-3">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-600 px-3 mb-1">{section}</p>
            {sectionLinks.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} onClick={() => setSideOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-all ${isActive ? "bg-primary text-white" : "hover:bg-gray-800 hover:text-gray-200"}`}>
                <Icon className="w-4" /> {label}
              </NavLink>
            ))}
          </div>
        );
      })}

      <div className="mt-auto px-3 pt-4 border-t border-gray-800">
        <a href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-800 hover:text-gray-200 transition-all mb-1"><FaGlobe className="w-4" /> View Site</a>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-gray-800 w-full transition-all"><FaSignOutAlt className="w-4" /> Logout</button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 z-30 shadow-xl"><Sidebar /></div>

      {/* Mobile sidebar */}
      {sideOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 flex flex-col shadow-xl"><Sidebar /></div>
          <div className="flex-1 bg-black/40" onClick={() => setSideOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 md:ml-64 flex flex-col">
        <header className="bg-white border-b border-gray-100 shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <button className="md:hidden p-2 text-gray-600" onClick={() => setSideOpen(true)}><FaBars /></button>
          <h1 className="font-bold text-gray-800 text-sm sm:text-base">Padmavati Pharma Admin</h1>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">{user?.name?.charAt(0)}</div>
            <span className="text-sm font-medium hidden sm:inline">{user?.name}</span>
          </div>
        </header>
        <div className="flex-1 p-5 md:p-8 bg-gray-50"><Outlet /></div>
      </div>
    </div>
  );
}
