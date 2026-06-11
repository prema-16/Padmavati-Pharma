import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import api from "../../services/api";
import toast from "react-hot-toast";
import Spinner from "../../components/common/Spinner";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "add" | {edit object}
  const [form, setForm] = useState({ name:"", description:"" });

  const load = () => { api.get("/categories/all").then(r=>setCategories(r.data.categories)).finally(()=>setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm({ name:"", description:"" }); setModal("add"); };
  const openEdit = (c) => { setForm({ name: c.name, description: c.description||"" }); setModal(c); };

  const handleSave = async () => {
    try {
      if (modal === "add") await api.post("/categories", form);
      else await api.put(`/categories/${modal._id}`, form);
      toast.success(modal === "add" ? "Category added!" : "Category updated!");
      setModal(null);
      load();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try { await api.delete(`/categories/${id}`); toast.success("Deleted!"); load(); }
    catch (err) { toast.error(err.response?.data?.message || "Cannot delete — products exist"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button onClick={openAdd} className="btn-primary py-2.5"><FaPlus /> Add Category</button>
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase"><tr><th className="px-5 py-3.5 text-left">Name</th><th className="px-5 py-3.5 text-left">Description</th><th className="px-5 py-3.5">Products</th><th className="px-5 py-3.5">Status</th><th className="px-5 py-3.5">Actions</th></tr></thead>
            <tbody>
              {categories.map(c=>(
                <tr key={c._id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3.5 font-semibold">{c.name}</td>
                  <td className="px-5 py-3.5 text-gray-500">{c.description||"—"}</td>
                  <td className="px-5 py-3.5 text-center"><span className="badge-primary">{c.productCount||0}</span></td>
                  <td className="px-5 py-3.5 text-center"><span className={c.isActive!==false?"badge-success":"bg-gray-100 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-full"}>{c.isActive!==false?"Active":"Inactive"}</span></td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={()=>openEdit(c)} className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-100"><FaEdit className="text-xs" /></button>
                      <button onClick={()=>handleDelete(c._id)} className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100"><FaTrash className="text-xs" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && <tr><td colSpan="5" className="text-center py-12 text-gray-400">No categories yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-lg mb-5">{modal === "add" ? "Add Category" : "Edit Category"}</h3>
            <div className="space-y-4">
              <div><label className="label">Name *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input" required /></div>
              <div><label className="label">Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="input" rows="2" /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleSave} className="btn-primary flex-1">Save</button>
              <button onClick={()=>setModal(null)} className="btn-outline flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
