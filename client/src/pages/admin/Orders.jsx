import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";

const STATUS_COLORS = { Pending:"badge-warning", Confirmed:"badge-info", Packed:"badge-primary", Shipped:"badge-info", Delivered:"badge-success", Cancelled:"badge-danger" };
const STATUSES = ["","Pending","Confirmed","Packed","Shipped","Delivered","Cancelled"];

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modal, setModal] = useState(null);
  const [update, setUpdate] = useState({ status:"", trackingNumber:"", notes:"" });
  const [updating, setUpdating] = useState(false);

  const load = () => {
    setLoading(true);
    api.get(`/admin/orders?status=${statusFilter}&page=${page}&limit=20`).then(r => {
      setOrders(r.data.orders);
      setTotalPages(r.data.totalPages || 1);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter, page]);

  const openModal = (order) => { setModal(order); setUpdate({ status: order.status, trackingNumber: order.trackingNumber||"", notes:"" }); };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await api.put(`/admin/orders/${modal._id}/status`, update);
      toast.success("Status updated!");
      setModal(null);
      load();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setUpdating(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div><h1 className="text-2xl font-bold">Orders</h1></div>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {STATUSES.map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${statusFilter===s?"bg-primary text-white":"bg-white border border-gray-200 text-gray-600 hover:border-primary"}`}>{s||"All"}</button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <tr><th className="px-5 py-3.5 text-left">Order</th><th className="px-5 py-3.5 text-left">Customer</th><th className="px-5 py-3.5">Items</th><th className="px-5 py-3.5">Total</th><th className="px-5 py-3.5">Status</th><th className="px-5 py-3.5">Date</th><th className="px-5 py-3.5">Actions</th></tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3.5 font-bold">#{o.orderNumber?.split("-").pop() || o._id.toString().slice(-6).toUpperCase()}</td>
                    <td className="px-5 py-3.5"><p className="font-medium">{o.user?.companyName || o.user?.name}</p><p className="text-xs text-gray-400">{o.user?.email}</p></td>
                    <td className="px-5 py-3.5 text-center">{o.items?.length} item(s)</td>
                    <td className="px-5 py-3.5 text-center font-bold">₹{(o.totalPrice||0).toFixed(2)}</td>
                    <td className="px-5 py-3.5 text-center"><span className={STATUS_COLORS[o.status]||"badge-primary"}>{o.status}</span></td>
                    <td className="px-5 py-3.5 text-center text-gray-400 text-xs">{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => navigate(`/admin/orders/${o._id}`)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs hover:border-primary text-gray-600">View</button>
                        <button onClick={() => openModal(o)} className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs hover:bg-primary-dark">Update</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan="7" className="text-center py-12 text-gray-400">No orders found</td></tr>}
              </tbody>
            </table>
          </div>

          {/* Mobile View Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {orders.map((o) => (
              <div key={o._id} className="p-4 hover:bg-gray-50 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-sm">#{o.orderNumber?.split("-").pop() || o._id.toString().slice(-6).toUpperCase()}</span>
                  <span className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString("en-IN")}</span>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">{o.user?.companyName || o.user?.name}</p>
                  <p className="text-xs text-gray-400">{o.user?.email}</p>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div><span className="text-gray-400">Items:</span> <span className="font-semibold text-gray-700">{o.items?.length} item(s)</span></div>
                  <div><span className="text-gray-400">Total:</span> <span className="font-bold text-primary">₹{(o.totalPrice||0).toFixed(2)}</span></div>
                </div>
                <div className="flex justify-between items-center gap-4 mt-1">
                  <span className={`text-[10px] ${STATUS_COLORS[o.status]||"badge-primary"}`}>{o.status}</span>
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/admin/orders/${o._id}`)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs hover:border-primary text-gray-600 bg-white">View</button>
                    <button onClick={() => openModal(o)} className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs hover:bg-primary-dark">Update</button>
                  </div>
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="p-5 text-center text-gray-400 text-sm">No orders found</p>}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(totalPages)].map((_,i)=>(
            <button key={i} onClick={()=>setPage(i+1)} className={`w-9 h-9 rounded-lg text-sm font-semibold ${page===i+1?"bg-primary text-white":"border border-gray-200 hover:border-primary"}`}>{i+1}</button>
          ))}
        </div>
      )}

      {/* Update Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-lg mb-5">Update Order Status</h3>
            <div className="space-y-4">
              <div><label className="label">New Status</label><select value={update.status} onChange={e=>setUpdate({...update,status:e.target.value})} className="input">{["Pending","Confirmed","Packed","Shipped","Delivered","Cancelled"].map(s=><option key={s}>{s}</option>)}</select></div>
              <div><label className="label">Tracking Number (optional)</label><input value={update.trackingNumber} onChange={e=>setUpdate({...update,trackingNumber:e.target.value})} className="input" placeholder="Enter tracking number" /></div>
              <div><label className="label">Notes (optional)</label><textarea value={update.notes} onChange={e=>setUpdate({...update,notes:e.target.value})} className="input" rows="2" /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleUpdate} disabled={updating} className="btn-primary flex-1 disabled:opacity-60">{updating?"Updating...":"Update Status"}</button>
              <button onClick={() => setModal(null)} className="btn-outline flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
