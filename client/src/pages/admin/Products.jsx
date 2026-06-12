import { imgUrl } from "../../services/imageHelper";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import api from "../../services/api";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function AdminProducts() {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = () => {
    setLoading(true);
    api.get(`/products?limit=20&page=${page}&isActive=all`).then(r => {
      setProducts(r.data.products);
      setTotalPages(r.data.totalPages || 1);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    try { await api.delete(`/products/${id}`); toast.success("Product deleted"); load(); }
    catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div><h1 className="text-2xl font-bold">Products</h1><p className="text-gray-400 text-sm">{products.length} products</p></div>
        <Link to="/admin/products/add" className="btn-primary py-2.5"><FaPlus /> Add Product</Link>
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <tr><th className="px-5 py-3.5 text-left">Product</th><th className="px-5 py-3.5 text-left">Category</th><th className="px-5 py-3.5">MRP</th><th className="px-5 py-3.5">Dist. Price</th><th className="px-5 py-3.5">Stock</th><th className="px-5 py-3.5">Expiry</th><th className="px-5 py-3.5">Status</th><th className="px-5 py-3.5">Actions</th></tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {p.image ? <img src={imgUrl(p.image)} className="w-10 h-10 object-cover rounded-lg border border-gray-100" alt="" /> : <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-lg">💊</div>}
                        <div><p className="font-semibold">{p.name}</p><p className="text-xs text-gray-400">{p.manufacturer}</p></div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><span className="badge-primary">{p.category?.name}</span></td>
                    <td className="px-5 py-3.5 text-center">₹{p.mrp}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-primary">₹{p.distributorPrice}</td>
                    <td className="px-5 py-3.5 text-center"><span className={p.stock < 10 ? "badge-warning" : p.stock === 0 ? "badge-danger" : ""}>{p.stock}</span></td>
                    <td className={`px-5 py-3.5 text-center text-xs ${p.expiryDate && new Date(p.expiryDate) < new Date(Date.now()+30*86400000) ? "text-red-500 font-bold" : "text-gray-400"}`}>
                      {p.expiryDate ? new Date(p.expiryDate).toLocaleDateString("en-IN",{month:"short",year:"numeric"}) : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-center"><span className={p.isActive !== false ? "badge-success" : "bg-gray-100 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-full"}>{p.isActive !== false ? "Active" : "Inactive"}</span></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/admin/products/edit/${p._id}`)} className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-100"><FaEdit className="text-xs" /></button>
                        {user?.role === "owner" && <button onClick={() => handleDelete(p._id)} className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100"><FaTrash className="text-xs" /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </div>
  );
}
