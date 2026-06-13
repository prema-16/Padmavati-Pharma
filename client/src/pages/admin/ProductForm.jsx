import { imgUrl } from "../../services/imageHelper";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    name:"", description:"", category:"", manufacturer:"", batchNumber:"",
    expiryDate:"", mrp:"", distributorPrice:"", gstPercentage:"12",
    stock:"", minOrderQuantity:"1", prescriptionRequired: false, discount:"0", isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => { api.get("/categories/all").then(r => setCategories(r.data.categories)); }, []);
  useEffect(() => {
    if (isEdit) {
      api.get(`/products/${id}`).then(r => {
        const p = r.data.product;
        setForm({
          name: p.name||"", description: p.description||"", category: p.category?._id||"",
          manufacturer: p.manufacturer||"", batchNumber: p.batchNumber||"",
          expiryDate: p.expiryDate ? new Date(p.expiryDate).toISOString().split("T")[0] : "",
          mrp: p.mrp||"", distributorPrice: p.distributorPrice||"", gstPercentage: p.gstPercentage||"12",
          stock: p.stock||"", minOrderQuantity: p.minOrderQuantity||"1",
          prescriptionRequired: p.prescriptionRequired||false, discount: p.discount||"0", isActive: p.isActive!==false,
        });
        if (p.image) setPreview(imgUrl(p.image));
      }).finally(() => setLoading(false));
    }
  }, [id]);

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 799 * 1024) {
      toast.error("Image size must be less than 799 KB");
      e.target.value = "";
      return;
    }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);

      if (isEdit) await api.put(`/products/${id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      else await api.post("/products", fd, { headers: { "Content-Type": "multipart/form-data" } });

      toast.success(isEdit ? "Product updated!" : "Product added!");
      navigate("/admin/products");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div><h1 className="text-2xl font-bold">{isEdit ? "Edit Product" : "Add Product"}</h1></div>
        <button onClick={() => navigate("/admin/products")} className="btn-outline py-2 text-sm">← Back</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold mb-5">Basic Information</h3>
              <div className="space-y-4">
                <div><label className="label">Product Name *</label><input value={form.name} onChange={f("name")} className="input" required placeholder="e.g. Paracetamol 500mg" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="label">Category *</label><select value={form.category} onChange={f("category")} className="input" required><option value="">Select Category</option>{categories.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
                  <div><label className="label">Manufacturer *</label><input value={form.manufacturer} onChange={f("manufacturer")} className="input" required /></div>
                </div>
                <div><label className="label">Description *</label><textarea value={form.description} onChange={f("description")} className="input" rows="4" required /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="label">Medical Usage</label><input value={form.medicalUsage||""} onChange={f("medicalUsage")} className="input" /></div>
                  <div><label className="label">Dosage</label><input value={form.dosage||""} onChange={f("dosage")} className="input" /></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold mb-5">Pricing & Stock</h3>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="label">MRP (₹) *</label><input type="number" value={form.mrp} onChange={f("mrp")} className="input" required min="0" step="0.01" /></div>
                <div><label className="label">Dist. Price (₹) *</label><input type="number" value={form.distributorPrice} onChange={f("distributorPrice")} className="input" required min="0" step="0.01" /></div>
                <div><label className="label">GST %</label><select value={form.gstPercentage} onChange={f("gstPercentage")} className="input">{[0,5,12,18,28].map(g=><option key={g} value={g}>{g}%</option>)}</select></div>
                <div><label className="label">Stock *</label><input type="number" value={form.stock} onChange={f("stock")} className="input" required min="0" /></div>
                <div><label className="label">Min. Order Qty</label><input type="number" value={form.minOrderQuantity} onChange={f("minOrderQuantity")} className="input" min="1" /></div>
                <div><label className="label">Discount %</label><input type="number" value={form.discount} onChange={f("discount")} className="input" min="0" max="100" /></div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold mb-4">Product Image</h3>
              <div className="w-full h-44 rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 mb-3 flex items-center justify-center">
                {preview ? <img src={preview} className="w-full h-full object-contain" alt="" /> : <div className="text-center text-gray-400"><div className="text-4xl mb-2">🖼️</div><p className="text-xs">No image selected</p></div>}
              </div>
              <input type="file" accept="image/*" onChange={handleImage} className="input text-sm" />
              <p className="text-xs text-gray-400 mt-1.5">Max size: 799 KB</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold mb-4">Batch & Expiry</h3>
              <div className="space-y-3">
                <div><label className="label">Batch Number</label><input value={form.batchNumber} onChange={f("batchNumber")} className="input" placeholder="BATCH-2024-001" /></div>
                <div><label className="label">Expiry Date *</label><input type="date" value={form.expiryDate} onChange={f("expiryDate")} className="input" required /></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold mb-4">Options</h3>
              <label className="flex items-center gap-3 cursor-pointer mb-3">
                <input type="checkbox" checked={form.prescriptionRequired} onChange={f("prescriptionRequired")} className="w-4 h-4 accent-primary" />
                <span className="text-sm font-medium">Prescription Required (Rx)</span>
              </label>
              {isEdit && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={f("isActive")} className="w-4 h-4 accent-primary" />
                  <span className="text-sm font-medium">Product Active</span>
                </label>
              )}
            </div>

            <button type="submit" disabled={saving} className="btn-primary w-full py-3.5 text-base disabled:opacity-60">
              {saving ? "Saving..." : isEdit ? "💾 Save Changes" : "➕ Add Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
