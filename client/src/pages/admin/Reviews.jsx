import { imgUrl } from "../../services/imageHelper";
import { useState, useEffect } from "react";
import { FaCheck, FaTrash, FaStar } from "react-icons/fa";
import api from "../../services/api";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/common/ConfirmDialog";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [confirm, setConfirm] = useState(null); // review id to delete

  const load = () => { setLoading(true); api.get(`/admin/reviews?status=${filter}`).then(r=>setReviews(r.data.reviews)).finally(()=>setLoading(false)); };
  useEffect(() => { load(); }, [filter]);

  const approve = async (id) => {
    try { await api.put(`/admin/reviews/${id}/approve`); toast.success("Approved!"); load(); }
    catch (err) { toast.error("Failed"); }
  };

  const del = async () => {
    try { await api.delete(`/admin/reviews/${confirm}`); toast.success("Deleted!"); load(); }
    catch (err) { toast.error("Failed"); }
    finally { setConfirm(null); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-7"><h1 className="text-2xl font-bold">Reviews</h1></div>
      <div className="flex gap-2 mb-5">
        {["pending","approved","all"].map(s=>(
          <button key={s} onClick={()=>setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${filter===s?"bg-primary text-white":"bg-white border border-gray-200 text-gray-600 hover:border-primary"}`}>{s}</button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase"><tr><th className="px-5 py-3.5 text-left">Product</th><th className="px-5 py-3.5 text-left">Customer</th><th className="px-5 py-3.5">Rating</th><th className="px-5 py-3.5 text-left">Review</th><th className="px-5 py-3.5">Date</th><th className="px-5 py-3.5">Actions</th></tr></thead>
              <tbody>
                {reviews.map(r=>(
                  <tr key={r._id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {r.product?.image && <img src={imgUrl(r.product.image)} className="w-9 h-9 object-cover rounded" alt="" />}
                        <span className="font-medium">{r.product?.name||"N/A"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><p className="font-medium">{r.user?.name}</p><p className="text-xs text-gray-400">{r.user?.email}</p></td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex gap-0.5 justify-center">{[...Array(5)].map((_,i)=><FaStar key={i} className={`text-xs ${i<r.rating?"text-yellow-400":"text-gray-200"}`}/>)}</div>
                    </td>
                    <td className="px-5 py-3.5 max-w-xs text-gray-500">{r.comment.substring(0,100)}{r.comment.length>100?"...":""}</td>
                    <td className="px-5 py-3.5 text-center text-gray-400 text-xs">{new Date(r.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2 justify-center">
                        {!r.isApproved && <button onClick={()=>approve(r._id)} className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-100"><FaCheck className="text-xs" /></button>}
                        {r.isApproved && <span className="badge-success text-xs">Approved</span>}
                        <button onClick={()=>setConfirm(r._id)} className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100"><FaTrash className="text-xs" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {reviews.length === 0 && <tr><td colSpan="6" className="text-center py-12 text-gray-400">No reviews found</td></tr>}
              </tbody>
            </table>
          </div>

          {/* Mobile View Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {reviews.map((r) => (
              <div key={r._id} className="p-4 hover:bg-gray-50 flex flex-col gap-2.5">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {r.product?.image && <img src={imgUrl(r.product.image)} className="w-8 h-8 object-cover rounded flex-shrink-0" alt="" />}
                    <span className="font-semibold text-sm text-gray-950 truncate">{r.product?.name || "N/A"}</span>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    {!r.isApproved && (
                      <button onClick={() => approve(r._id)} className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-100"><FaCheck className="text-xs" /></button>
                    )}
                    <button onClick={() => setConfirm(r._id)} className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100"><FaTrash className="text-xs" /></button>
                  </div>
                </div>
                <div className="text-xs">
                  <p className="font-medium text-gray-800">{r.user?.name}</p>
                  <p className="text-gray-400">{r.user?.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">{[...Array(5)].map((_,i)=><FaStar key={i} className={`text-[10px] ${i<r.rating?"text-yellow-400":"text-gray-200"}`}/>)}</div>
                  <span className="text-[10px] text-gray-400">{new Date(r.createdAt).toLocaleDateString("en-IN")}</span>
                  {r.isApproved && <span className="badge-success text-[10px] py-0.5 px-1.5 ml-auto">Approved</span>}
                </div>
                <p className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100 italic">"{r.comment}"</p>
              </div>
            ))}
            {reviews.length === 0 && <p className="p-5 text-center text-gray-400 text-sm">No reviews found</p>}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        title="Delete Review?"
        message="This will permanently remove the review and cannot be undone."
        confirmText="Yes, Delete"
        onConfirm={del}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
