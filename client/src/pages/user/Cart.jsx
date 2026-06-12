import { imgUrl } from "../../services/imageHelper";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaShoppingBag } from "react-icons/fa";
import { fetchCart, updateCart, removeFromCart } from "../../redux/slices/cartSlice";
import Spinner from "../../components/common/Spinner";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, subtotal, gstAmount, total, loading } = useSelector((s) => s.cart);

  useEffect(() => { dispatch(fetchCart()); }, []);

  const handleQty = (productId, qty) => {
    if (qty < 1) return;
    dispatch(updateCart({ productId, quantity: qty }));
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-7">My Cart</h1>
      {!items?.length ? (
        <div className="text-center py-24">
          <div className="text-7xl mb-5 opacity-20">🛒</div>
          <h3 className="text-gray-500 font-semibold text-xl mb-2">Your cart is empty</h3>
          <p className="text-gray-400 text-sm mb-6">Add medicines and healthcare products to your cart.</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_340px] gap-7 items-start">
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs font-bold uppercase text-gray-500 tracking-wide">
                <tr><th className="px-5 py-3.5 text-left">Product</th><th className="px-5 py-3.5 text-left">Price</th><th className="px-5 py-3.5 text-left">Qty</th><th className="px-5 py-3.5 text-left">Total</th><th className="px-5 py-3.5" /></tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  if (!item.product) return null;
                  const lineTotal = item.product.distributorPrice * item.quantity;
                  const gst = lineTotal * (item.product.gstPercentage || 12) / 100;
                  return (
                    <tr key={item._id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {item.product.image ? <img src={imgUrl(item.product.image)} alt="" className="w-14 h-14 object-cover rounded-lg border border-gray-100" /> : <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center text-xl">💊</div>}
                          <div>
                            <Link to={`/products/${item.product._id}`} className="font-semibold text-sm hover:text-primary">{item.product.name}</Link>
                            <p className="text-xs text-gray-400">{item.product.manufacturer}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-sm">₹{item.product.distributorPrice}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden w-fit">
                          <button onClick={() => handleQty(item.product._id, item.quantity - 1)} className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 font-bold">−</button>
                          <span className="px-3 py-1.5 font-bold text-sm min-w-[36px] text-center">{item.quantity}</span>
                          <button onClick={() => handleQty(item.product._id, item.quantity + 1)} className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 font-bold">+</button>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-bold text-primary">₹{(lineTotal + gst).toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <button onClick={() => dispatch(removeFromCart(item.product._id))} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-all"><FaTrash className="text-xs" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-5 py-4 border-t border-gray-100 flex justify-between items-center">
              <Link to="/products" className="text-primary text-sm font-semibold hover:underline">← Continue Shopping</Link>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-20">
            <h3 className="font-bold text-lg mb-5">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹{(subtotal||0).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">GST Amount</span><span>₹{(gstAmount||0).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="badge-success text-xs">FREE</span></div>
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold text-base">
              <span>Grand Total</span><span className="text-primary text-lg">₹{(total||0).toFixed(2)}</span>
            </div>
            <button onClick={() => navigate("/checkout")} className="btn-primary w-full py-3 mt-5 text-base">
              <FaShoppingBag /> Proceed to Checkout
            </button>
            <div className="mt-4 bg-green-50 rounded-xl p-3 text-xs text-green-700 text-center">🔒 Secure checkout with GST compliant invoice</div>
          </div>
        </div>
      )}
    </div>
  );
}
