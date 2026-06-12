import { imgUrl } from "../services/imageHelper";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaStar, FaCartPlus, FaHeart, FaIndustry, FaBoxes, FaCalendarAlt } from "react-icons/fa";
import api from "../services/api";
import { addToCart } from "../redux/slices/cartSlice";
import Spinner from "../components/common/Spinner";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 0, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.get(`/products/${id}`), api.get(`/reviews/${id}`)])
      .then(([pr, rr]) => { setProduct(pr.data.product); setReviews(rr.data.reviews); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    if (!user) return toast.error("Please login to add to cart");
    dispatch(addToCart({ productId: id, quantity: qty }));
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!review.rating) return toast.error("Please select a rating");
    setSubmitting(true);
    try {
      await api.post("/reviews", { productId: id, ...review });
      toast.success("Review submitted! Pending approval.");
      setReview({ rating: 0, comment: "" });
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setSubmitting(false); }
  };

  if (loading) return <Spinner />;
  if (!product) return <div className="text-center py-20 text-gray-400">Product not found</div>;

  const saving = product.mrp - product.distributorPrice;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="text-sm text-gray-400 mb-6"><Link to="/products" className="hover:text-primary">Products</Link> › {product.name}</div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Image */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {product.image ? <img src={imgUrl(product.image)} alt={product.name} className="w-full h-96 object-cover" /> : <div className="w-full h-96 flex items-center justify-center bg-primary/5 text-8xl opacity-20">💊</div>}
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="badge-primary">{product.category?.name}</span>
            {product.prescriptionRequired && <span className="badge-danger">Prescription Required</span>}
            <span className={product.stock > 0 ? "badge-success" : "bg-gray-100 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-full"}>
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <p className="flex items-center gap-2 text-sm text-gray-500 mb-4"><FaIndustry className="text-primary" />{product.manufacturer}</p>
          <div className="flex items-center gap-2 mb-5">
            {[...Array(5)].map((_,i)=><FaStar key={i} className={`${i<Math.round(product.averageRating||0)?"text-yellow-400":"text-gray-200"}`}/>)}
            <span className="text-sm text-gray-400">{product.averageRating || 0} ({product.numReviews || 0} reviews)</span>
          </div>

          <div className="bg-primary/5 rounded-xl p-5 mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">₹{product.distributorPrice}</span>
              <span className="text-gray-400 text-sm line-through">MRP ₹{product.mrp}</span>
              {saving > 0 && <span className="badge-success">Save ₹{saving.toFixed(0)}</span>}
            </div>
            <p className="text-xs text-gray-400 mt-1">GST {product.gstPercentage || 12}% applicable · Inclusive in price shown</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {[["Batch No.", product.batchNumber||"N/A"],["Expiry", product.expiryDate ? new Date(product.expiryDate).toLocaleDateString("en-IN",{month:"short",year:"numeric"}) : "N/A"],["Stock", `${product.stock} units`],["Min. Order", `${product.minOrderQuantity||1} unit(s)`]].map(([l,v])=>(
              <div key={l} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{l}</p>
                <p className="font-semibold text-sm">{v}</p>
              </div>
            ))}
          </div>

          {product.description && <p className="text-gray-500 text-sm leading-7 mb-5">{product.description}</p>}

          {user?.role === "customer" && product.stock > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q=>Math.max(1,q-1))} className="px-4 py-3 font-bold text-gray-600 hover:bg-gray-100 transition-all">−</button>
                <input type="number" value={qty} onChange={e=>setQty(Math.max(1,Math.min(product.stock,+e.target.value)))} className="w-14 text-center font-bold border-none outline-none py-3" />
                <button onClick={() => setQty(q=>Math.min(product.stock,q+1))} className="px-4 py-3 font-bold text-gray-600 hover:bg-gray-100 transition-all">+</button>
              </div>
              <button onClick={handleAdd} className="flex-1 btn-primary py-3 text-base"><FaCartPlus /> Add to Cart</button>
            </div>
          )}
          {!user && <Link to="/login" className="btn-primary py-3 w-full mt-2 block text-center">Login to Order</Link>}
        </div>
      </div>

      {/* Reviews */}
      <div className="border-t border-gray-100 pt-12">
        <h2 className="text-xl font-bold mb-6">Customer Reviews</h2>
        {reviews.length === 0 ? <p className="text-gray-400 text-sm mb-8">No reviews yet.</p> : (
          <div className="space-y-4 mb-8">
            {reviews.map((r) => (
              <div key={r._id} className="bg-white border border-gray-100 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <div><p className="font-semibold text-sm">{r.user?.name || "Anonymous"}</p>
                    <div className="flex gap-1">{[...Array(5)].map((_,i)=><FaStar key={i} className={`text-xs ${i<r.rating?"text-yellow-400":"text-gray-200"}`}/>)}</div>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString("en-IN")}</span>
                </div>
                <p className="text-gray-500 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {user?.role === "customer" && (
          <div className="bg-gray-50 rounded-2xl p-6 max-w-lg">
            <h3 className="font-semibold mb-4">Write a Review</h3>
            <form onSubmit={handleReview} className="space-y-4">
              <div>
                <label className="label">Rating</label>
                <div className="flex gap-2">{[1,2,3,4,5].map(n=><button key={n} type="button" onClick={()=>setReview(r=>({...r,rating:n}))} className={`text-2xl transition-all ${n<=review.rating?"text-yellow-400":"text-gray-300 hover:text-yellow-300"}`}>★</button>)}</div>
              </div>
              <div><label className="label">Comment</label><textarea value={review.comment} onChange={e=>setReview(r=>({...r,comment:e.target.value}))} className="input" rows="3" placeholder="Share your experience..." required minLength="10" /></div>
              <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">{submitting?"Submitting...":"Submit Review"}</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
