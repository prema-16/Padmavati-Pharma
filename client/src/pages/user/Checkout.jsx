import { imgUrl } from "../../services/imageHelper";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaMoneyBillWave, FaUniversity, FaCreditCard, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import api from "../../services/api";
import { fetchCart, clearCart } from "../../redux/slices/cartSlice";
import toast from "react-hot-toast";
import Spinner from "../../components/common/Spinner";

const STATES = ["Maharashtra","Delhi","Karnataka","Tamil Nadu","Gujarat","Rajasthan","Uttar Pradesh","West Bengal","Telangana","Kerala","Punjab","Haryana","Madhya Pradesh","Bihar","Assam","Odisha","Jharkhand","Uttarakhand","Himachal Pradesh","Goa"];
const PAYMENT = [
  { value: "COD", icon: FaMoneyBillWave, label: "Cash on Delivery", desc: "Pay when order arrives", color: "text-green-500" },
  { value: "Bank Transfer", icon: FaUniversity, label: "Bank Transfer", desc: "NEFT / RTGS", color: "text-blue-500" },
  { value: "Credit", icon: FaCreditCard, label: "Credit (30 days)", desc: "Approved accounts only", color: "text-purple-500" },
];

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { items, subtotal, gstAmount, total, loading } = useSelector((s) => s.cart);
  const [paymentMethod] = useState("COD");
  const [placing, setPlacing] = useState(false);
  const [addr, setAddr] = useState({
    companyName: user?.companyName || "",
    contactPerson: user?.name || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
    country: "India",
  });

  useEffect(() => { dispatch(fetchCart()); }, []);

  const handlePlace = async (e) => {
    e.preventDefault();
    if (!items?.length) return toast.error("Cart is empty");
    setPlacing(true);
    try {
      const res = await api.post("/orders", { shippingAddress: addr, paymentMethod });
      dispatch(clearCart());
      toast.success("Order placed successfully!");
      navigate(`/orders/${res.data.order._id}`);
    } catch (err) { toast.error(err.response?.data?.message || "Failed to place order"); }
    finally { setPlacing(false); }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-lg mx-auto px-3 sm:px-6 py-4 sm:py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate("/cart")} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600">
          <FaArrowLeft className="text-sm" />
        </button>
        <h1 className="text-xl font-bold">Checkout</h1>
      </div>

      <form onSubmit={handlePlace} className="space-y-4">
        {/* Shipping */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
            Delivery Details
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label text-xs">Store / Company *</label><input required value={addr.companyName} onChange={e=>setAddr({...addr,companyName:e.target.value})} className="input py-2.5 text-sm" placeholder="Apollo Pharmacy" /></div>
              <div><label className="label text-xs">Contact Person *</label><input required value={addr.contactPerson} onChange={e=>setAddr({...addr,contactPerson:e.target.value})} className="input py-2.5 text-sm" /></div>
            </div>
            <div><label className="label text-xs">Phone *</label><input required value={addr.phone} onChange={e=>setAddr({...addr,phone:e.target.value})} className="input py-2.5 text-sm" placeholder="10-digit number" /></div>
            <div><label className="label text-xs">Street Address *</label><input required value={addr.street} onChange={e=>setAddr({...addr,street:e.target.value})} className="input py-2.5 text-sm" placeholder="123 Medical Street" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label text-xs">City *</label><input required value={addr.city} onChange={e=>setAddr({...addr,city:e.target.value})} className="input py-2.5 text-sm" /></div>
              <div><label className="label text-xs">PIN Code *</label><input required value={addr.zipCode} onChange={e=>setAddr({...addr,zipCode:e.target.value})} className="input py-2.5 text-sm" maxLength="6" /></div>
            </div>
            <div><label className="label text-xs">State *</label>
              <select required value={addr.state} onChange={e=>setAddr({...addr,state:e.target.value})} className="input py-2.5 text-sm">
                <option value="">Select State</option>
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
            Payment Method
          </h3>
          <div className="space-y-2.5">
            {PAYMENT.map((p) => {
              const disabled = p.value !== "COD";
              return (
                <div key={p.value}>
                  <div className={`flex items-center gap-3 p-3.5 border-2 rounded-xl transition-all ${disabled ? "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed" : "border-primary bg-primary/5 cursor-pointer"}`}>
                    <input type="radio" name="payment" value={p.value} checked={!disabled} disabled={disabled} className="accent-primary" readOnly />
                    <p.icon className={`text-xl ${p.color}`} />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{p.label}</p>
                      <p className="text-xs text-gray-400">{p.desc}</p>
                    </div>
                    {disabled && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full flex-shrink-0">Coming Soon</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-sm mb-3">Order Summary ({items?.length || 0} items)</h3>
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {items?.map((item) => item.product && (
              <div key={item._id} className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {item.product.image ? <img src={imgUrl(item.product.image)} className="w-full h-full object-contain" alt="" /> : <span className="text-sm">💊</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{item.product.name}</p>
                  <p className="text-xs text-gray-400">× {item.quantity}</p>
                </div>
                <span className="text-xs font-bold text-primary">₹{(item.product.distributorPrice * item.quantity).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹{(subtotal||0).toFixed(0)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">GST</span><span>₹{(gstAmount||0).toFixed(0)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="text-green-600 font-bold">FREE</span></div>
          </div>
          <div className="flex justify-between font-bold text-base border-t border-gray-100 mt-3 pt-3">
            <span>Total</span>
            <span className="text-primary text-lg">₹{(total||0).toFixed(0)}</span>
          </div>
        </div>

        {/* Place Order */}
        <button type="submit" disabled={placing}
          className="w-full py-4 bg-primary text-white font-bold rounded-2xl text-base flex items-center justify-center gap-2 hover:bg-primary-dark active:scale-95 transition-all disabled:opacity-60 shadow-lg shadow-primary/30">
          {placing ? "Placing Order..." : <><FaCheckCircle className="text-lg" /> Place Order</>}
        </button>
        <p className="text-center text-xs text-gray-400">🔒 Secured by SSL encryption</p>
      </form>
    </div>
  );
}
