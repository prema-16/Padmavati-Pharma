import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaExclamationCircle } from "react-icons/fa";
import api from "../../services/api";
import toast from "react-hot-toast";
import Spinner from "../../components/common/Spinner";
import ConfirmDialog from "../../components/common/ConfirmDialog";

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
      <FaExclamationCircle className="text-red-500 text-xs flex-shrink-0" />
      <p className="text-xs text-red-600 font-medium">{msg}</p>
    </div>
  );
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "add" | {edit object}
  const [form, setForm] = useState({ name: "", description: "" });
  const [formErrors, setFormErrors] = useState({});
  const [confirm, setConfirm] = useState(null); // null | id to delete

  const load = () => {
    api.get("/categories/all").then(r => setCategories(r.data.categories)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm({ name: "", description: "" }); setFormErrors({}); setModal("add"); };
  const openEdit = (c) => { setForm({ name: c.name, description: c.description || "" }); setFormErrors({}); setModal(c); };

  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Category name is required.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      if (modal === "add") await api.post("/categories", form);
      else await api.put(`/categories/${modal._id}`, form);
      toast.success(modal === "add" ? "Category added!" : "Category updated!");
      setModal(null);
      load();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/categories/${confirm}`);
      toast.success("Category deleted!");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cannot delete — products exist");
    } finally { setConfirm(null); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button onClick={openAdd} className="btn-primary py-2.5"><FaPlus /> Add Category</button>
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  <th className="px-5 py-3.5 text-left">Name</th>
                  <th className="px-5 py-3.5 text-left">Description</th>
                  <th className="px-5 py-3.5">Products</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c._id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3.5 font-semibold">{c.name}</td>
                    <td className="px-5 py-3.5 text-gray-500">{c.description || "—"}</td>
                    <td className="px-5 py-3.5 text-center"><span className="badge-primary">{c.productCount || 0}</span></td>
                    <td className="px-5 py-3.5 text-center"><span className={c.isActive !== false ? "badge-success" : "bg-gray-100 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-full"}>{c.isActive !== false ? "Active" : "Inactive"}</span></td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(c)} className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-100"><FaEdit className="text-xs" /></button>
                        <button onClick={() => setConfirm(c._id)} className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100"><FaTrash className="text-xs" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && <tr><td colSpan="5" className="text-center py-12 text-gray-400">No categories yet</td></tr>}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {categories.map((c) => (
              <div key={c._id} className="p-4 hover:bg-gray-50 flex flex-col gap-2.5">
                <div className="flex justify-between items-center gap-3">
                  <h4 className="font-semibold text-sm text-gray-950 truncate">{c.name}</h4>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => openEdit(c)} className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-100"><FaEdit className="text-xs" /></button>
                    <button onClick={() => setConfirm(c._id)} className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100"><FaTrash className="text-xs" /></button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{c.description || "No description provided"}</p>
                <div className="flex justify-between items-center text-xs mt-1">
                  <div><span className="text-gray-400">Products:</span> <span className="font-semibold text-primary">{c.productCount || 0} items</span></div>
                  <div><span className="text-gray-400">Status:</span> <span className={c.isActive !== false ? "text-green-600 font-bold" : "text-gray-400"}>{c.isActive !== false ? "Active" : "Inactive"}</span></div>
                </div>
              </div>
            ))}
            {categories.length === 0 && <p className="p-5 text-center text-gray-400 text-sm">No categories yet</p>}
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-lg mb-5">{modal === "add" ? "Add Category" : "Edit Category"}</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Name <span className="text-red-400">*</span></label>
                <input
                  value={form.name}
                  onChange={e => { setForm({ ...form, name: e.target.value }); if (formErrors.name) setFormErrors({}); }}
                  className={`input ${formErrors.name ? "border-red-400 bg-red-50/30" : ""}`}
                  placeholder="e.g. Tablets"
                />
                <FieldError msg={formErrors.name} />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input" rows="2" placeholder="Optional description" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleSave} className="btn-primary flex-1">Save</button>
              <button onClick={() => setModal(null)} className="btn-outline flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!confirm}
        title="Delete Category?"
        message="This will permanently delete the category. This action cannot be undone."
        confirmText="Yes, Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
