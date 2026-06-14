import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHome, FaPills, FaShoppingCart, FaBoxOpen, FaUser } from "react-icons/fa";

export default function BottomNav() {
  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);
  const cartCount = items?.length || 0;

  if (!user || user.role !== "customer") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-2xl transition-colors duration-200">
      <div className="grid grid-cols-5 h-16">
        <NavLink to="/" end className={({ isActive }) =>
          `flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${isActive ? "text-primary" : "text-gray-400"}`}>
          <FaHome className="text-xl" />
          <span>Home</span>
        </NavLink>

        <NavLink to="/products" className={({ isActive }) =>
          `flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${isActive ? "text-primary" : "text-gray-400"}`}>
          <FaPills className="text-xl" />
          <span>Products</span>
        </NavLink>

        <NavLink to="/cart" className={({ isActive }) =>
          `flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors relative ${isActive ? "text-primary" : "text-gray-400"}`}>
          <div className="relative">
            <FaShoppingCart className="text-xl" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </NavLink>

        <NavLink to="/my-orders" className={({ isActive }) =>
          `flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${isActive ? "text-primary" : "text-gray-400"}`}>
          <FaBoxOpen className="text-xl" />
          <span>Orders</span>
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) =>
          `flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${isActive ? "text-primary" : "text-gray-400"}`}>
          <FaUser className="text-xl" />
          <span>Profile</span>
        </NavLink>
      </div>
      {/* iOS safe area */}
      <div className="h-safe-bottom bg-white dark:bg-gray-900" />
    </nav>
  );
}
