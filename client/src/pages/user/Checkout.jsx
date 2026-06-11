import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaMoneyBillWave, FaUniversity, FaCreditCard } from "react-icons/fa";
import api from "../../services/api";
import { fetchCart, clearCart } from "../../redux/slices/cartSlice";
import toast from "react-hot-toast";
import Spinner from "../../components/common/Spinner";

const STATES = ["Maharashtra","Delhi","Karnataka","Tamil Nadu","Gujarat","Rajasthan","Uttar Pradesh","West Bengal","Telangana","Kerala","Punjab","Haryana","Madhya Pradesh","Bihar","Assam","Odisha","Jharkhand","Uttarakhand","Himachal Pradesh","Goa"];
const PAYMENT = [
  { value: "COD", icon: FaMoneyBillWave, label: "Cash on Delivery", desc: "Pay when your order arrives" },
  { value: "Bank Transfer", icon: FaUniversity, label: "Bank Transfer", desc: "NEFT / RTGS transfer" },
  { value: "Credit", icon: FaCreditCard, label: "Credit (30 days)", desc: "For approved accounts only" },
];

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { items, subtotal, gstAmount, total, loading } = useSelector((s) => s.cart);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placing, setPlacing] = useState(false);
  const [addr, setAddr] = useState({
    companyName: user?.companyName || "",
    contactPerson: user?.name || "",
    phone: user?.phone || "",
    street: "", city: "", state: "", zipCode: "", country: "India",
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
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <button onClick={() => navigate("/cart")} className="btn-outline py-2 text-sm">← Back to Cart</button>
      </div>

      <form onSubmit={handlePlace}>
        <div className="grid lg:grid-cols-[1fr_340px] gap-7 items-start">
          <div className="space-y-5">
            {/* Shipping */}
            <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
              <h3 className="font-bold mb-5 flex items-center gap-2"><span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</span> Shipping Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Company/Store Name *</label><input required value={addr.companyName} onChange={e=>setAddr({...addr,companyName:e.target.value})} className="input" placeholder="Apollo Pharmacy" /></div>
                <div><label className="label">Contact Person *</label><input required value={addr.contactPerson} onChange={e=>setAddr({...addr,contactPerson:e.target.value})} className="input" /></div>
                <div><label className="label">Phone *</label><input required value={addr.phone} onChange={e=>setAddr({...addr,phone:e.target.value})} className="input" placeholder="10-digit number" /></div>
                <div><label className="label">Street Address *</label><input required value={addr.street} onChange={e=>setAddr({...addr,street:e.target.value})} className="input" placeholder="123 Medical Street" /></div>
                <div><label className="label">City *</label><input required value={addr.city} onChange={e=>setAddr({...addr,city:e.target.value})} className="input" /></div>
                <div><label className="label">State *</label>
                  <select required value={addr.state} onChange={e=>setAddr({...addr,state:e.target.value})} className="input">
                    <option value="">Select State</option>
                    {STATES.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div><label className="label">PIN Code *</label><input required value={addr.zipCode} onChange={e=>setAddr({...addr,zipCode:e.target.value})} className="input" placeholder="400001" maxLength="6" /></div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
              <h3 className="font-bold mb-5 flex items-center gap-2"><span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">2</span> Payment Method</h3>
              <div className="space-y-3">
                {PAYMENT.map((p) => (
                  <label key={p.value} onClick={() => setPaymentMethod(p.value)} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod===p.value?"border-primary bg-primary/5":"border-gray-200 hover:border-primary/50"}`}>
                    <input type="radio" name="payment" value={p.value} checked={paymentMethod===p.value} onChange={()=>setPaymentMethod(p.value)} className="accent-primary" />
                    <p.icon className={`text-xl ${paymentMethod===p.value?"text-primary":"text-gray-400"}`} />
                    <div><p className="font-semibold text-sm">{p.label}</p><p className="text-xs text-gray-400">{p.desc}</p></div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-20">
            <h3 className="font-bold text-lg mb-5">Order Summary</h3>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items?.map((item) => item.product && (
                <div key={item._id} className="flex items-center gap-3 py-2 border-b border-gray-50">
                  {item.product.image ? <img src={`/uploads/${item.product.image}`} className="w-11 h-11 object-cover rounded-lg" alt="" /> : <div className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center">💊</div>}
                  <div className="flex-1 min-w-0"><p className="text-xs font-medium truncate">{item.product.name}</p><p className="text-xs text-gray-400">× {item.quantity}</p></div>
                  <span className="text-sm font-bold text-primary">₹{(item.product.distributorPrice*item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹{(subtotal||0).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">GST</span><span>₹{(gstAmount||0).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="text-green-600 font-semibold">FREE</span></div>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-gray-100 mt-3 pt-3">
              <span>Total</span><span className="text-primary text-lg">₹{(total||0).toFixed(2)}</span>
            </div>
            <button type="submit" disabled={placing} className="btn-primary w-full py-3 mt-5 text-base disabled:opacity-60">
              {placing ? "Placing Order..." : "✓ Place Order"}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">🔒 Your order is secure and protected</p>
          </div>
        </div>
      </form>
    </div>
  );
}
