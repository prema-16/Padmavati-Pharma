import { imgUrl } from "../../services/imageHelper";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaShoppingBag, FaArrowLeft } from "react-icons/fa";
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
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 sm:hidden">
          <FaArrowLeft className="text-sm" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold">My Cart</h1>
        {items?.length > 0 && <span className="ml-auto text-sm text-gray-400">{items.length} item{items.length > 1 ? "s" : ""}</span>}
      </div>

      {!items?.length ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-5 opacity-20">🛒</div>
          <h3 className="text-gray-500 font-semibold text-lg mb-2">Your cart is empty</h3>
          <p className="text-gray-400 text-sm mb-6">Add medicines and healthcare products.</p>
          <Link to="/products" className="btn-primary inline-flex">Browse Products</Link>
        </div>
      ) : (
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-4 lg:gap-7 lg:items-start">

          {/* Items list — mobile card style */}
          <div className="space-y-3">
            {items.map((item) => {
              if (!item.product) return null;
              const lineTotal = item.product.distributorPrice * item.quantity;
              const gst = lineTotal * (item.product.gstPercentage || 12) / 100;
              return (
                <div key={item._id} className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 shadow-sm flex gap-3">
                  {/* Image */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 flex items-center justify-center">
                    {item.product.image
                      ? <img src={imgUrl(item.product.image)} alt="" className="w-full h-full object-contain p-1" />
                      : <span className="text-2xl">💊</span>}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.product._id}`} className="font-semibold text-sm text-gray-800 line-clamp-2 leading-snug hover:text-primary">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5 mb-2">{item.product.manufacturer}</p>

                    <div className="flex items-center justify-between">
                      {/* Qty stepper */}
                      <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                        <button onClick={() => handleQty(item.product._id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold text-lg active:scale-90 transition-all">−</button>
                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                        <button onClick={() => handleQty(item.product._id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold text-lg active:scale-90 transition-all">+</button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-bold text-primary text-base">₹{(lineTotal + gst).toFixed(0)}</p>
                        <p className="text-xs text-gray-400">₹{item.product.distributorPrice} × {item.quantity}</p>
                      </div>

                      {/* Remove */}
                      <button onClick={() => dispatch(removeFromCart(item.product._id))}
                        className="w-8 h-8 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 active:scale-90 transition-all ml-2">
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <Link to="/products" className="flex items-center gap-2 text-primary text-sm font-semibold py-2">
              <FaArrowLeft className="text-xs" /> Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm lg:sticky lg:top-20">
            <h3 className="font-bold text-base sm:text-lg mb-4">Order Summary</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹{(subtotal||0).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">GST</span><span>₹{(gstAmount||0).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="text-green-600 font-bold">FREE</span></div>
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold text-base sm:text-lg">
              <span>Total</span>
              <span className="text-primary">₹{(total||0).toFixed(2)}</span>
            </div>
            <button onClick={() => navigate("/checkout")}
              className="w-full mt-5 bg-primary text-white font-bold py-4 rounded-xl text-base flex items-center justify-center gap-2 hover:bg-primary-dark active:scale-95 transition-all">
              <FaShoppingBag /> Proceed to Checkout
            </button>
            <div className="mt-3 bg-green-50 rounded-xl p-2.5 text-xs text-green-700 text-center">
              🔒 Secure checkout with GST compliant invoice
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
