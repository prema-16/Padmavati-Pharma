import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPills, FaShoppingCart, FaBars, FaTimes, FaChevronDown, FaSignOutAlt, FaUser, FaBox, FaTachometerAlt } from "react-icons/fa";
import { logout } from "../../redux/slices/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  const cartCount = items?.length || 0;

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => { dispatch(logout()); navigate("/"); };

  const links = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 font-bold text-xl text-primary">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <FaPills className="text-white text-lg" />
          </div>
          <span><span className="text-gray-800">Padmavati</span><span className="text-primary">Pharma</span></span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.to === "/"} className={({ isActive }) => `px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? "text-primary bg-primary/10" : "text-gray-600 hover:text-primary hover:bg-primary/5"}`}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {user?.role === "customer" && (
            <Link to="/cart" className="relative flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary rounded-lg font-semibold text-sm hover:bg-primary hover:text-white transition-all">
              <FaShoppingCart />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="relative" ref={dropRef}>
              <button onClick={() => setDropOpen((p) => !p)} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:border-primary transition-all">
                <div className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
                <FaChevronDown className="text-xs text-gray-400" />
              </button>
              {dropOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="font-semibold text-sm">{user.name}</p>
                    <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${user.role === "owner" ? "bg-red-100 text-red-600" : user.role === "staff" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-600"}`}>{user.role}</span>
                  </div>
                  {(user.role === "owner" || user.role === "staff") && (
                    <Link to="/admin/dashboard" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-primary/5 hover:text-primary transition-all">
                      <FaTachometerAlt className="text-primary" /> Dashboard
                    </Link>
                  )}
                  {user.role === "customer" && (
                    <>
                      <Link to="/profile" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-primary/5 hover:text-primary transition-all"><FaUser className="text-primary" /> Profile</Link>
                      <Link to="/my-orders" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-primary/5 hover:text-primary transition-all"><FaBox className="text-primary" /> My Orders</Link>
                    </>
                  )}
                  <hr className="my-1 border-gray-100" />
                  <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full transition-all"><FaSignOutAlt /> Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 text-sm font-semibold text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-all">Login</Link>
              <Link to="/register" className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-dark transition-all">Register</Link>
            </div>
          )}

          <button className="md:hidden p-2 text-gray-600" onClick={() => setMenuOpen((p) => !p)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={() => setMenuOpen(false)} className={({ isActive }) => `px-3 py-2.5 rounded-lg text-sm font-medium ${isActive ? "text-primary bg-primary/10" : "text-gray-600"}`}>
              {l.label}
            </NavLink>
          ))}
          {!user && (
            <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 text-sm font-semibold border-2 border-primary text-primary rounded-lg">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 text-sm font-semibold bg-primary text-white rounded-lg">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
