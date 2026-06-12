import { imgUrl } from "../../services/imageHelper";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Spinner from "../../components/common/Spinner";

const STATUS_COLORS = { Pending:"badge-warning", Confirmed:"badge-info", Packed:"badge-primary", Shipped:"badge-info", Delivered:"badge-success", Cancelled:"badge-danger" };

export default function Orders() {
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
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <Link to="/products" className="btn-primary py-2 text-sm">+ Order More</Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24"><div className="text-7xl mb-5 opacity-20">📦</div><h3 className="text-gray-500 font-semibold text-xl mb-2">No Orders Yet</h3><p className="text-gray-400 text-sm mb-6">You haven't placed any orders.</p><Link to="/products" className="btn-primary">Shop Now</Link></div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-wrap items-center gap-5">
              <div className="min-w-[140px]">
                <p className="text-xs text-gray-400">Order Number</p>
                <p className="font-bold text-sm">{order.orderNumber || `#${order._id.toString().slice(-8).toUpperCase()}`}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</p>
              </div>
              <div className="flex gap-2 flex-wrap flex-1">
                {order.items?.slice(0,4).map((item) => item.product && (
                  item.product.image ? <img key={item._id} src={imgUrl(item.product.image)} className="w-10 h-10 object-cover rounded-lg border border-gray-100" title={item.product.name} alt="" /> : <div key={item._id} className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-sm">💊</div>
                ))}
                {(order.items?.length || 0) > 4 && <span className="text-xs text-gray-400 self-center">+{order.items.length-4} more</span>}
              </div>
              <span className={STATUS_COLORS[order.status] || "badge-primary"}>{order.status}</span>
              <div className="text-right">
                <p className="font-bold text-primary text-base">₹{(order.totalPrice||0).toFixed(2)}</p>
                <p className="text-xs text-gray-400">{order.paymentMethod}</p>
              </div>
              <Link to={`/orders/${order._id}`} className="btn-outline py-2 text-sm">Track Order →</Link>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(totalPages)].map((_,i)=>(
            <button key={i} onClick={()=>setPage(i+1)} className={`w-9 h-9 rounded-lg text-sm font-semibold ${page===i+1?"bg-primary text-white":"border border-gray-200 hover:border-primary"}`}>{i+1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
