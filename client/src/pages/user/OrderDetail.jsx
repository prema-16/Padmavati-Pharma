import { imgUrl } from "../../services/imageHelper";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import api from "../../services/api";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";

const STEPS = ["Pending","Confirmed","Packed","Shipped","Delivered"];
const STATUS_BG = { Pending:"bg-yellow-100 text-yellow-700", Confirmed:"bg-blue-100 text-blue-700", Packed:"bg-indigo-100 text-indigo-700", Shipped:"bg-cyan-100 text-cyan-700", Delivered:"bg-green-100 text-green-700", Cancelled:"bg-red-100 text-red-600" };

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState("");
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => setOrder(r.data.order)).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const r = await api.put(`/orders/${id}/cancel`, { reason });
      setOrder(r.data.order);
      setShowCancel(false);
      toast.success("Order cancelled");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setCancelling(false); }
  };

  if (loading) return <Spinner />;
  if (!order) return <div className="text-center py-20 text-gray-400">Order not found</div>;

  const currentIdx = STEPS.indexOf(order.status);
  const cancelled = order.status === "Cancelled";

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600">
          <FaArrowLeft className="text-sm" />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold leading-tight">Order Details</h1>
          <p className="text-xs text-gray-400">{order.orderNumber}</p>
        </div>
        <span className={`ml-auto text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_BG[order.status] || "bg-gray-100 text-gray-600"}`}>
          {order.status}
        </span>
      </div>

      {/* Status Stepper */}
      {!cancelled ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4 shadow-sm">
          <div className="flex items-center justify-between">
            {STEPS.map((step, idx) => {
              const done = idx < currentIdx;
              const active = idx === currentIdx;
              return (
                <div key={step} className={`flex-1 flex flex-col items-center relative
                  ${idx < STEPS.length - 1 ? "after:content-[''] after:absolute after:top-3.5 after:left-[55%] after:w-[calc(100%-10px)] after:h-0.5 " + (done ? "after:bg-green-400" : "after:bg-gray-200") : ""}`}>
                  <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all mb-1
                    ${done ? "bg-green-500 border-green-500 text-white"
                    : active ? "border-primary text-primary bg-white shadow shadow-primary/30"
                    : "border-gray-200 text-gray-300 bg-white"}`}>
                    {done ? "✓" : idx + 1}
                  </div>
                  <p className={`text-[10px] font-semibold text-center ${done || active ? "text-gray-700" : "text-gray-400"}`}>{step}</p>
                </div>
              );
            })}
          </div>
          {order.trackingNumber && (
            <div className="mt-4 bg-blue-50 rounded-xl px-3 py-2 text-xs text-blue-700">
              🚚 Tracking: <strong>{order.trackingNumber}</strong>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-4 text-sm text-red-600">
          🚫 Order Cancelled{order.cancelReason ? ` — ${order.cancelReason}` : ""}
        </div>
      )}

      {/* Order Items */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-4">
        <p className="font-bold text-sm px-4 py-3 border-b border-gray-100">Order Items</p>
        <div className="divide-y divide-gray-50">
          {order.items.map((item) => (
            <div key={item._id} className="flex items-center gap-3 px-4 py-3">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {item.product?.image ? <img src={imgUrl(item.product.image)} className="w-full h-full object-contain p-0.5" alt="" /> : <span>💊</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-1">{item.product?.name || "N/A"}</p>
                <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price?.toFixed(0)}</p>
              </div>
              <p className="font-bold text-primary text-sm">₹{item.total?.toFixed(0)}</p>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 px-4 py-3 text-right space-y-1">
          <p className="text-xs text-gray-500">Subtotal ₹{order.subtotal?.toFixed(0)} + GST ₹{order.gstAmount?.toFixed(0)}</p>
          <p className="font-bold text-base text-primary">Total: ₹{order.totalPrice?.toFixed(0)}</p>
        </div>
      </div>

      {/* Shipping + Payment */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <p className="font-bold text-xs text-gray-500 uppercase mb-2">Ship To</p>
          {order.shippingAddress && (
            <div className="text-xs text-gray-600 leading-5 space-y-0.5">
              <p className="font-semibold text-sm text-gray-800">{order.shippingAddress.companyName}</p>
              <p>{order.shippingAddress.contactPerson}</p>
              <p>📞 {order.shippingAddress.phone}</p>
              <p className="text-gray-400">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
            </div>
          )}
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <p className="font-bold text-xs text-gray-500 uppercase mb-2">Payment</p>
          <p className="font-semibold text-sm text-gray-800">{order.paymentMethod}</p>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${order.paymentStatus==="Paid"?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"}`}>
            {order.paymentStatus}
          </span>
          <p className="text-xs text-gray-400 mt-2">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
        </div>
      </div>

      {/* Status History */}
      {order.statusHistory?.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-4">
          <p className="font-bold text-sm mb-3">Activity</p>
          <div className="space-y-3">
            {[...order.statusHistory].reverse().map((h, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary text-xs mt-0.5">✓</div>
                <div>
                  <p className="font-semibold text-sm">{h.status}</p>
                  {h.notes && <p className="text-xs text-gray-400">{h.notes}</p>}
                  <p className="text-xs text-gray-300">{new Date(h.timestamp).toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancel button */}
      {["Pending","Confirmed"].includes(order.status) && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          {!showCancel ? (
            <button onClick={() => setShowCancel(true)} className="w-full py-3 border-2 border-red-200 text-red-500 rounded-xl font-semibold text-sm hover:bg-red-50 transition-all">
              Cancel Order
            </button>
          ) : (
            <div className="space-y-3">
              <textarea value={reason} onChange={e=>setReason(e.target.value)} className="input text-sm" rows="2" placeholder="Reason (optional)" />
              <div className="flex gap-2">
                <button onClick={handleCancel} disabled={cancelling}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold text-sm disabled:opacity-60">
                  {cancelling ? "Cancelling..." : "Confirm Cancel"}
                </button>
                <button onClick={() => setShowCancel(false)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm">
                  Keep Order
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
