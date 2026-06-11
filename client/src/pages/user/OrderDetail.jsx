import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";

const STEPS = ["Pending","Confirmed","Packed","Shipped","Delivered"];
const STATUS_COLORS = { Pending:"badge-warning", Confirmed:"badge-info", Packed:"badge-primary", Shipped:"badge-info", Delivered:"badge-success", Cancelled:"badge-danger" };

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => setOrder(r.data.order)).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Cancel this order?")) return;
    setCancelling(true);
    try {
      const r = await api.put(`/orders/${id}/cancel`, { reason });
      setOrder(r.data.order);
      toast.success("Order cancelled");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setCancelling(false); }
  };

  if (loading) return <Spinner />;
  if (!order) return <div className="text-center py-20 text-gray-400">Order not found</div>;

  const currentIdx = STEPS.indexOf(order.status);
  const cancelled = order.status === "Cancelled";

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-7">
        <div><h1 className="text-2xl font-bold">Order Details</h1><p className="text-gray-400 text-sm">{order.orderNumber}</p></div>
        <Link to="/my-orders" className="btn-outline py-2 text-sm">← My Orders</Link>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <div>
          {/* Status Stepper */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-5 shadow-sm">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className={STATUS_COLORS[order.status] || "badge-primary"} style={{fontSize:"0.85rem",padding:"6px 14px"}}>{order.status}</span>
                <span className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleString("en-IN")}</span>
              </div>
              <span className="font-bold text-primary text-xl">₹{order.totalPrice?.toFixed(2)}</span>
            </div>
            {order.trackingNumber && <div className="bg-blue-50 rounded-lg px-4 py-2.5 text-sm text-blue-700 mt-3">🚚 Tracking: <strong>{order.trackingNumber}</strong></div>}

            {!cancelled && (
              <div className="flex items-start justify-between mt-6">
                {STEPS.map((step, idx) => {
                  const done = idx < currentIdx;
                  const active = idx === currentIdx;
                  return (
                    <div key={step} className={`flex-1 text-center relative ${idx < STEPS.length - 1 ? "after:content-[''] after:absolute after:top-4 after:left-1/2 after:w-full after:h-0.5 after:z-0 " + (done ? "after:bg-green-400" : "after:bg-gray-200") : ""}`}>
                      <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-2 text-sm border-2 transition-all ${done ? "bg-green-500 border-green-500 text-white" : active ? "border-primary text-primary bg-white shadow-md shadow-primary/20" : "border-gray-200 text-gray-400 bg-white"}`}>
                        {done ? "✓" : idx + 1}
                      </div>
                      <p className={`text-xs font-semibold ${done || active ? "text-gray-700" : "text-gray-400"}`}>{step}</p>
                    </div>
                  );
                })}
              </div>
            )}
            {cancelled && <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-600">🚫 Cancelled{order.cancelReason ? `: ${order.cancelReason}` : ""}</div>}
          </div>

          {/* Items */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-5">
            <div className="px-6 py-4 border-b border-gray-100 font-bold">Order Items</div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase"><tr><th className="px-5 py-3 text-left">Product</th><th className="px-5 py-3">Qty</th><th className="px-5 py-3">Price</th><th className="px-5 py-3">Total</th></tr></thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item._id} className="border-t border-gray-50">
                    <td className="px-5 py-4 flex items-center gap-3">
                      {item.product?.image ? <img src={`/uploads/${item.product.image}`} className="w-10 h-10 object-cover rounded-lg" alt="" /> : <div className="w-10 h-10 bg-gray-100 rounded-lg" />}
                      <span className="font-medium">{item.product?.name || "N/A"}</span>
                    </td>
                    <td className="px-5 py-4 text-center">{item.quantity}</td>
                    <td className="px-5 py-4 text-center">₹{item.price?.toFixed(2)}</td>
                    <td className="px-5 py-4 text-center font-bold text-primary">₹{item.total?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-4 bg-gray-50 text-right text-sm space-y-1">
              <p>Subtotal: ₹{order.subtotal?.toFixed(2)} | GST: ₹{order.gstAmount?.toFixed(2)}</p>
              <p className="font-bold text-base text-primary">Total: ₹{order.totalPrice?.toFixed(2)}</p>
            </div>
          </div>

          {/* Status History */}
          {order.statusHistory?.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold mb-5">Activity Log</h3>
              <div className="space-y-4">
                {[...order.statusHistory].reverse().map((h, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary text-xs font-bold mt-0.5">✓</div>
                    <div>
                      <p className="font-semibold text-sm">{h.status}</p>
                      {h.notes && <p className="text-xs text-gray-400">{h.notes}</p>}
                      <p className="text-xs text-gray-300 mt-1">{new Date(h.timestamp).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h4 className="font-bold mb-3 text-sm">Shipping To</h4>
            {order.shippingAddress && (
              <div className="text-sm text-gray-600 space-y-1 leading-6">
                <p className="font-semibold">{order.shippingAddress.companyName}</p>
                <p>{order.shippingAddress.contactPerson}</p>
                <p>📞 {order.shippingAddress.phone}</p>
                <p className="text-gray-400">{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}</p>
              </div>
            )}
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h4 className="font-bold mb-3 text-sm">Payment</h4>
            <div className="flex justify-between text-sm mb-2"><span className="text-gray-400">Method</span><strong>{order.paymentMethod}</strong></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Status</span><span className={order.paymentStatus==="Paid"?"badge-success":"badge-warning"}>{order.paymentStatus}</span></div>
          </div>

          {["Pending","Confirmed"].includes(order.status) && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h4 className="font-bold mb-3 text-sm text-red-500">Cancel Order</h4>
              <textarea value={reason} onChange={e=>setReason(e.target.value)} className="input text-sm mb-3" rows="2" placeholder="Reason for cancellation (optional)" />
              <button onClick={handleCancel} disabled={cancelling} className="btn-danger w-full py-2 text-sm disabled:opacity-60">{cancelling?"Cancelling...":"Cancel Order"}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
