import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPills, FaShoppingCart, FaBars, FaTimes, FaChevronDown,
         FaSignOutAlt, FaUser, FaBox, FaTachometerAlt, FaSearch } from "react-icons/fa";
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
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleLogout = () => { dispatch(logout()); navigate("/"); setMenuOpen(false); };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary flex-shrink-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <FaPills className="text-white text-sm" />
          </div>
          <span className="hidden xs:block"><span className="text-gray-800">Padmavati</span><span className="text-primary">Pharma</span></span>
          <span className="xs:hidden text-primary">PP</span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.to === "/"} className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? "text-primary bg-primary/10" : "text-gray-600 hover:text-primary hover:bg-primary/5"}`}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search icon — mobile */}
          <Link to="/products" className="sm:hidden w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary transition-all">
            <FaSearch className="text-sm" />
          </Link>

          {user?.role === "customer" && (
            <Link to="/cart" className="relative flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary rounded-xl font-semibold text-sm hover:bg-primary hover:text-white transition-all">
              <FaShoppingCart className="text-base" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="relative" ref={dropRef}>
              <button onClick={() => setDropOpen((p) => !p)}
                className="flex items-center gap-1.5 px-2.5 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:border-primary transition-all">
                <div className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[80px] truncate">{user.name.split(" ")[0]}</span>
                <FaChevronDown className="text-xs text-gray-400 hidden sm:block" />
              </button>

              {dropOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-gray-100 mb-1">
                    <p className="font-semibold text-sm truncate">{user.name}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${user.role === "owner" ? "bg-red-100 text-red-600" : user.role === "staff" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-600"}`}>
                      {user.role}
                    </span>
                  </div>
                  {(user.role === "owner" || user.role === "staff") && (
                    <Link to="/admin/dashboard" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-primary/5 hover:text-primary transition-all">
                      <FaTachometerAlt className="text-primary" /> Dashboard
                    </Link>
                  )}
                  {user.role === "customer" && (<>
                    <Link to="/profile" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-primary/5 hover:text-primary transition-all md:flex hidden">
                      <FaUser className="text-primary" /> Profile
                    </Link>
                    <Link to="/my-orders" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-primary/5 hover:text-primary transition-all md:flex hidden">
                      <FaBox className="text-primary" /> My Orders
                    </Link>
                  </>)}
                  <hr className="my-1 border-gray-100" />
                  <button onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full transition-all">
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="hidden sm:flex items-center px-4 py-2 text-sm font-semibold text-primary border-2 border-primary rounded-xl hover:bg-primary hover:text-white transition-all">
                Login
              </Link>
              <Link to="/register" className="hidden sm:flex items-center px-4 py-2 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary-dark transition-all">
                Register
              </Link>
              {/* Mobile: show just Login */}
              <Link to="/login" className="sm:hidden px-3 py-2 text-sm font-semibold text-primary border-2 border-primary rounded-xl">
                Login
              </Link>
            </>
          )}

          {/* Hamburger — desktop only (mobile uses BottomNav) */}
          <button className="hidden sm:flex md:hidden p-2 text-gray-600 rounded-lg hover:bg-gray-100" onClick={() => setMenuOpen((p) => !p)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Tablet dropdown menu */}
      {menuOpen && (
        <div className="hidden sm:flex md:hidden flex-col bg-white border-t border-gray-100 px-4 py-3 gap-1">
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `px-3 py-2.5 rounded-xl text-sm font-medium ${isActive ? "text-primary bg-primary/10" : "text-gray-600"}`}>
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
