import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaPills, FaShoppingCart, FaBars, FaTimes, FaChevronDown,
  FaSignOutAlt, FaUser, FaBox, FaTachometerAlt, FaSearch,
  FaHome, FaInfoCircle, FaEnvelope,
} from "react-icons/fa";
import { logout } from "../../redux/slices/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);
  const cartCount = items?.length || 0;

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Close user dropdown on outside click
  useEffect(() => {
    const h = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setMenuOpen(false);
    setDropOpen(false);
  };

  const navLinks = [
    { to: "/", label: "Home", icon: FaHome },
    { to: "/products", label: "Products", icon: FaPills },
    { to: "/about", label: "About", icon: FaInfoCircle },
    { to: "/contact", label: "Contact", icon: FaEnvelope },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary flex-shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FaPills className="text-white text-sm" />
            </div>
            <span className="hidden xs:block">
              <span className="text-gray-800">Padmavati</span>
              <span className="text-primary">Pharma</span>
            </span>
            <span className="xs:hidden text-primary">PP</span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? "text-primary bg-primary/10" : "text-gray-600 hover:text-primary hover:bg-primary/5"}`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search icon — mobile/tablet */}
            <Link
              to="/products"
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary transition-all"
              aria-label="Search products"
            >
              <FaSearch className="text-sm" />
            </Link>

            {/* Cart */}
            {user?.role === "customer" && (
              <Link
                to="/cart"
                className="relative flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary rounded-xl font-semibold text-sm hover:bg-primary hover:text-white transition-all"
              >
                <FaShoppingCart className="text-base" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User dropdown — desktop */}
            {user ? (
              <div className="relative hidden md:block" ref={dropRef}>
                <button
                  onClick={() => setDropOpen((p) => !p)}
                  className="flex items-center gap-1.5 px-2.5 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:border-primary transition-all"
                >
                  <div className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[80px] truncate">{user.name.split(" ")[0]}</span>
                  <FaChevronDown className="text-xs text-gray-400" />
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
                      <Link to="/admin/dashboard" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-primary/5 hover:text-primary transition-all">
                        <FaTachometerAlt className="text-primary" /> Dashboard
                      </Link>
                    )}
                    {user.role === "customer" && (
                      <>
                        <Link to="/profile" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-primary/5 hover:text-primary transition-all">
                          <FaUser className="text-primary" /> Profile
                        </Link>
                        <Link to="/my-orders" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-primary/5 hover:text-primary transition-all">
                          <FaBox className="text-primary" /> My Orders
                        </Link>
                      </>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full transition-all">
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="hidden md:flex items-center px-4 py-2 text-sm font-semibold text-primary border-2 border-primary rounded-xl hover:bg-primary hover:text-white transition-all">
                  Login
                </Link>
                <Link to="/register" className="hidden md:flex items-center px-4 py-2 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary-dark transition-all">
                  Register
                </Link>
              </>
            )}

            {/* Hamburger — mobile & tablet only */}
            <button
              className="md:hidden p-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
              onClick={() => setMenuOpen((p) => !p)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile / Tablet slide-down menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-14 sm:top-16 z-40 bg-black/40" onClick={() => setMenuOpen(false)}>
          <div
            className="bg-white w-72 sm:w-80 h-full shadow-2xl flex flex-col overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* User info bar */}
            {user ? (
              <div className="flex items-center gap-3 px-5 py-4 bg-primary/5 border-b border-gray-100">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{user.name}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${user.role === "owner" ? "bg-red-100 text-red-600" : user.role === "staff" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-600"}`}>
                    {user.role}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 px-5 py-4 border-b border-gray-100">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 text-sm font-semibold text-primary border-2 border-primary rounded-xl hover:bg-primary hover:text-white transition-all">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary-dark transition-all">
                  Register
                </Link>
              </div>
            )}

            {/* Nav links */}
            <div className="px-3 py-3 flex flex-col gap-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-1">Navigation</p>
              {navLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-primary/5 hover:text-primary"}`
                  }
                >
                  <l.icon className="text-base flex-shrink-0" />
                  {l.label}
                </NavLink>
              ))}
            </div>

            {/* Customer extra links */}
            {user?.role === "customer" && (
              <div className="px-3 pb-3 flex flex-col gap-1 border-t border-gray-100 pt-3 mt-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-1">My Account</p>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-all">
                  <FaUser className="text-base flex-shrink-0 text-primary" /> Profile
                </Link>
                <Link to="/my-orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-all">
                  <FaBox className="text-base flex-shrink-0 text-primary" /> My Orders
                </Link>
                <Link to="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-all">
                  <FaShoppingCart className="text-base flex-shrink-0 text-primary" /> Cart {cartCount > 0 && <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartCount > 9 ? "9+" : cartCount}</span>}
                </Link>
              </div>
            )}

            {/* Admin link */}
            {(user?.role === "owner" || user?.role === "staff") && (
              <div className="px-3 pb-3 flex flex-col gap-1 border-t border-gray-100 pt-3 mt-1">
                <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-all">
                  <FaTachometerAlt className="text-base flex-shrink-0 text-primary" /> Admin Dashboard
                </Link>
              </div>
            )}

            {/* Logout */}
            {user && (
              <div className="mt-auto px-3 pb-6 border-t border-gray-100 pt-3">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                >
                  <FaSignOutAlt className="text-base flex-shrink-0" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
