import { imgUrl } from "../../services/imageHelper";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTrash, FaCartPlus } from "react-icons/fa";
import api from "../../services/api";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";

export default function Wishlist() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get("/wishlist").then(r=>setProducts(r.data.products)).finally(()=>setLoading(false)); }, []);

  const remove = async (id) => {
    await api.delete(`/wishlist/${id}`);
    setProducts(p => p.filter(x => x._id !== id));
    toast.success("Removed from wishlist");
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-7">My Wishlist ({products.length})</h1>
      {products.length === 0 ? (
        <div className="text-center py-24"><div className="text-7xl mb-5 opacity-20">❤️</div><h3 className="text-gray-500 font-semibold text-xl mb-2">Wishlist is Empty</h3><Link to="/products" className="btn-primary">Browse Products</Link></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <div key={p._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all">
              <div className="h-40 overflow-hidden bg-gray-50">{p.image ? <img src={imgUrl(p.image)} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">💊</div>}</div>
              <div className="p-4">
                <p className="text-primary text-xs font-bold uppercase mb-1">{p.category?.name}</p>
                <h3 className="font-semibold text-sm truncate mb-1">{p.name}</h3>
                <p className="font-bold text-primary mb-3">₹{p.distributorPrice}</p>
                <div className="flex gap-2">
                  <Link to={`/products/${p._id}`} className="flex-1 text-center py-2 text-xs font-semibold border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all">View</Link>
                  <button onClick={() => dispatch(addToCart({ productId: p._id, quantity: 1 }))} className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all"><FaCartPlus /></button>
                  <button onClick={() => remove(p._id)} className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-100 transition-all"><FaTrash /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
