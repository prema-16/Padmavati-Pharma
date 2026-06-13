import { imgUrl } from "../../services/imageHelper";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaChevronRight } from "react-icons/fa";
import api from "../../services/api";
import Spinner from "../../components/common/Spinner";

const STATUS_COLORS = {
  Pending:   "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Packed:    "bg-indigo-100 text-indigo-700",
  Shipped:   "bg-cyan-100 text-cyan-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-600",
};

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    api.get(`/orders?page=${page}`).then((r) => {
      setOrders(r.data.orders);
      setTotalPages(r.data.totalPages || 1);
    }).finally(() => setLoading(false));
  }, [page]);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 sm:hidden">
          <FaArrowLeft className="text-sm" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold">My Orders</h1>
        <Link to="/products" className="ml-auto btn-primary py-2 text-xs sm:text-sm px-3 sm:px-5">+ Order</Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-5 opacity-20">📦</div>
          <h3 className="text-gray-500 font-semibold text-lg mb-2">No Orders Yet</h3>
          <p className="text-gray-400 text-sm mb-6">You haven't placed any orders.</p>
          <Link to="/products" className="btn-primary inline-flex">Shop Now</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order._id} onClick={() => navigate(`/orders/${order._id}`)}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm active:scale-[0.99] transition-all cursor-pointer">
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-sm text-gray-800">
                    {order.orderNumber || `#${order._id.toString().slice(-8).toUpperCase()}`}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {day:"numeric", month:"short", year:"numeric"})}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                    {order.status}
                  </span>
                  <FaChevronRight className="text-gray-300 text-xs" />
                </div>
              </div>

              {/* Product thumbnails */}
              <div className="flex items-center gap-2 mb-3">
                {order.items?.slice(0, 4).map((item, i) => item.product && (
                  <div key={i} className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                    {item.product.image
                      ? <img src={imgUrl(item.product.image)} alt="" className="w-full h-full object-contain p-0.5" />
                      : <span className="text-lg">💊</span>}
                  </div>
                ))}
                {(order.items?.length || 0) > 4 && (
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-bold">
                    +{order.items.length - 4}
                  </div>
                )}
                <div className="ml-auto text-right">
                  <p className="font-bold text-primary text-base">₹{(order.totalPrice||0).toFixed(0)}</p>
                  <p className="text-xs text-gray-400">{order.paymentMethod}</p>
                </div>
              </div>

              {/* Track button */}
              <div className="border-t border-gray-50 pt-3 flex items-center justify-between">
                <span className="text-xs text-gray-400">{order.items?.length} item{order.items?.length > 1 ? "s" : ""}</span>
                <span className="text-xs font-semibold text-primary flex items-center gap-1">
                  Track Order <FaChevronRight className="text-xs" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(totalPages)].map((_,i) => (
            <button key={i} onClick={() => setPage(i+1)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold ${page===i+1?"bg-primary text-white":"border border-gray-200 hover:border-primary"}`}>
              {i+1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
