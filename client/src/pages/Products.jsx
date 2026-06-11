import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch, FaStar, FaCartPlus, FaHeart, FaFilter } from "react-icons/fa";
import api from "../services/api";
import { addToCart } from "../redux/slices/cartSlice";
import Spinner from "../components/common/Spinner";
import toast from "react-hot-toast";

const Skeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
    <div className="h-44 bg-gray-200 animate-pulse" />
    <div className="p-4 space-y-2">
      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
      <div className="h-8 bg-gray-100 rounded-lg animate-pulse mt-3" />
    </div>
  </div>
);

export default function Products() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    sort: searchParams.get("sort") || "-createdAt",
    page: 1,
  });

  useEffect(() => { api.get("/categories").then((r) => setCategories(r.data.categories)); }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(filters);
    api.get(`/products?${params}`).then((r) => {
      setProducts(r.data.products);
      setPagination({ totalPages: r.data.totalPages, currentPage: r.data.currentPage, total: r.data.total });
    }).finally(() => setLoading(false));
  }, [filters]);

  const handleFilter = (key, val) => setFilters((p) => ({ ...p, [key]: val, page: 1 }));

  const handleAddToCart = async (productId) => {
    if (!user) return toast.error("Please login to add to cart");
    dispatch(addToCart({ productId, quantity: 1 }));
  };

  const imgSrc = (img) => img ? `/uploads/${img}` : null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div><h1 className="text-2xl font-bold">Our Products</h1><p className="text-gray-400 text-sm">{pagination.total || 0} products found</p></div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort:</span>
          <select value={filters.sort} onChange={(e) => handleFilter("sort", e.target.value)} className="input w-auto text-sm py-2">
            <option value="-createdAt">Newest</option>
            <option value="distributorPrice">Price: Low-High</option>
            <option value="-distributorPrice">Price: High-Low</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-7 flex flex-wrap gap-4 items-end shadow-sm">
        <div className="flex-1 min-w-[200px]">
          <label className="label">Search</label>
          <div className="relative"><FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" /><input type="text" value={filters.search} onChange={(e) => handleFilter("search", e.target.value)} className="input pl-9" placeholder="Search medicines, brands..." /></div>
        </div>
        <div className="min-w-[180px]">
          <label className="label">Category</label>
          <select value={filters.category} onChange={(e) => handleFilter("category", e.target.value)} className="input">
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <button onClick={() => setFilters({ search:"", category:"", sort:"-createdAt", page:1 })} className="btn-outline py-2.5 text-sm">Reset</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">{[...Array(8)].map((_,i)=><Skeleton key={i}/>)}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-24"><div className="text-6xl mb-4 opacity-20">🔍</div><h3 className="text-gray-500 font-semibold text-lg mb-2">No products found</h3><p className="text-gray-400 text-sm">Try adjusting your search or filters</p></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <div key={p._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all group">
              <div className="relative h-44 overflow-hidden bg-gray-50">
                {imgSrc(p.image) ? <img src={imgSrc(p.image)} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">💊</div>}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {p.prescriptionRequired && <span className="badge-danger text-[10px]">Rx</span>}
                  {p.stock < 10 && p.stock > 0 && <span className="badge-warning text-[10px]">Low Stock</span>}
                </div>
              </div>
              <div className="p-4">
                <p className="text-primary text-xs font-bold uppercase tracking-wide mb-1">{p.category?.name}</p>
                <h3 className="font-semibold text-sm text-gray-800 mb-1 truncate" title={p.name}>{p.name}</h3>
                <p className="text-xs text-gray-400 mb-2">{p.manufacturer}</p>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_,i)=><FaStar key={i} className={`text-xs ${i<Math.round(p.averageRating||0)?"text-yellow-400":"text-gray-200"}`}/>)}
                  <span className="text-xs text-gray-400">({p.numReviews||0})</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-primary text-base">₹{p.distributorPrice}</span>
                  <span className="text-xs text-gray-400 line-through">₹{p.mrp}</span>
                </div>
                <p className={`text-xs font-semibold mb-3 ${p.stock>10?"text-green-600":p.stock>0?"text-yellow-600":"text-red-500"}`}>
                  {p.stock > 0 ? `In Stock (${p.stock})` : "Out of Stock"}
                </p>
                <div className="flex gap-2">
                  <Link to={`/products/${p._id}`} className="flex-1 text-center py-2 text-sm font-semibold border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all">Details</Link>
                  {user?.role === "customer" && p.stock > 0 && (
                    <button onClick={() => handleAddToCart(p._id)} className="flex-1 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-dark transition-all flex items-center justify-center gap-1">
                      <FaCartPlus className="text-xs" /> Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {filters.page > 1 && <button onClick={() => setFilters(p=>({...p,page:p.page-1}))} className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg hover:border-primary text-sm">‹</button>}
          {[...Array(pagination.totalPages)].map((_,i) => (
            <button key={i} onClick={() => setFilters(p=>({...p,page:i+1}))} className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${filters.page===i+1?"bg-primary text-white":"border border-gray-200 hover:border-primary"}`}>{i+1}</button>
          ))}
          {filters.page < pagination.totalPages && <button onClick={() => setFilters(p=>({...p,page:p.page+1}))} className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg hover:border-primary text-sm">›</button>}
        </div>
      )}
    </div>
  );
}
