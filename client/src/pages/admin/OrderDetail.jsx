import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";

const STATUS_COLORS = { Pending:"badge-warning", Confirmed:"badge-info", Packed:"badge-primary", Shipped:"badge-info", Delivered:"badge-success", Cancelled:"badge-danger" };

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState({ status:"", trackingNumber:"", notes:"" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => {
      setOrder(r.data.order);
      setUpdate({ status: r.data.order.status, trackingNumber: r.data.order.trackingNumber||"", notes:"" });
    }).finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await api.put(`/admin/orders/${id}/status`, update);
      setOrder(r.data.order);
      toast.success("Order updated!");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  if (loading) return <Spinner />;
  if (!order) return <div className="text-center py-20 text-gray-400">Order not found</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div><h1 className="text-2xl font-bold">Order Details</h1><p className="text-gray-400 text-sm">{order.orderNumber}</p></div>
        <button onClick={() => navigate("/admin/orders")} className="btn-outline py-2 text-sm">← Back</button>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className={STATUS_COLORS[order.status]||"badge-primary"} style={{fontSize:"0.9rem",padding:"7px 16px"}}>{order.status}</span>
              <span className="font-bold text-primary text-xl">₹{order.totalPrice?.toFixed(2)}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase"><tr><th className="px-4 py-3 text-left">Product</th><th className="px-4 py-3">Qty</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Total</th></tr></thead>
                <tbody>
                  {order.items.map(item=>(
                    <tr key={item._id} className="border-t border-gray-50">
                      <td className="px-4 py-3 flex items-center gap-2">
                        {item.product?.image ? <img src={`/uploads/${item.product.image}`} className="w-9 h-9 object-cover rounded" alt="" /> : <div className="w-9 h-9 bg-gray-100 rounded" />}
                        <span className="font-medium">{item.product?.name||"N/A"}</span>
                      </td>
                      <td className="px-4 py-3 text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-center">₹{item.price?.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center font-bold text-primary">₹{item.total?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-right text-sm mt-3 pt-3 border-t border-gray-100 space-y-1">
              <p>Subtotal: ₹{order.subtotal?.toFixed(2)} | GST: ₹{order.gstAmount?.toFixed(2)}</p>
              <p className="font-bold text-primary text-base">Total: ₹{order.totalPrice?.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold mb-4">Update Status</h3>
            <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4">
              <div><label className="label">Status</label><select value={update.status} onChange={e=>setUpdate({...update,status:e.target.value})} className="input">{["Pending","Confirmed","Packed","Shipped","Delivered","Cancelled"].map(s=><option key={s}>{s}</option>)}</select></div>
              <div><label className="label">Tracking No.</label><input value={update.trackingNumber} onChange={e=>setUpdate({...update,trackingNumber:e.target.value})} className="input" placeholder="Optional" /></div>
              <div className="col-span-2"><label className="label">Notes</label><textarea value={update.notes} onChange={e=>setUpdate({...update,notes:e.target.value})} className="input" rows="2" /></div>
              <button type="submit" disabled={saving} className="col-span-2 btn-primary py-3 disabled:opacity-60">{saving?"Saving...":"💾 Update Status"}</button>
            </form>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h4 className="font-bold mb-3 text-sm">Customer</h4>
            <p className="font-semibold">{order.user?.name}</p>
            <p className="text-sm text-gray-400">{order.user?.email}</p>
            <p className="text-sm">{order.user?.companyName}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h4 className="font-bold mb-3 text-sm">Shipping</h4>
            {order.shippingAddress && (
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-semibold">{order.shippingAddress.companyName}</p>
                <p>{order.shippingAddress.contactPerson} · {order.shippingAddress.phone}</p>
                <p className="text-gray-400">{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}</p>
              </div>
            )}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h4 className="font-bold mb-3 text-sm">Status History</h4>
            <div className="space-y-3">
              {[...( order.statusHistory||[])].reverse().map((h,i)=>(
                <div key={i} className="flex gap-3 text-sm">
                  <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs flex-shrink-0">✓</div>
                  <div><p className="font-semibold">{h.status}</p>{h.notes&&<p className="text-xs text-gray-400">{h.notes}</p>}<p className="text-xs text-gray-300">{new Date(h.timestamp).toLocaleString("en-IN")}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
