import { useState, useEffect } from "react";
import { FaBoxOpen, FaRupeeSign, FaUsers, FaPills, FaExclamationTriangle } from "react-icons/fa";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import api from "../../services/api";
import Spinner from "../../components/common/Spinner";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const STATUS_COLORS = { Pending:"badge-warning", Confirmed:"badge-info", Packed:"badge-primary", Shipped:"badge-info", Delivered:"badge-success", Cancelled:"badge-danger" };

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get("/admin/dashboard").then(r=>setData(r.data)).finally(()=>setLoading(false)); }, []);

  if (loading) return <Spinner />;
  if (!data) return null;

  const { stats, recentOrders, lowStock, expiringProducts, monthlySales, topProducts } = data;

  const salesByMonth = Array(12).fill(0);
  monthlySales?.forEach(m => { salesByMonth[m._id - 1] = m.total || 0; });

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-gray-400 text-sm">{new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
        {[
          { icon: FaBoxOpen, label:"Total Orders", value: stats.totalOrders, color:"bg-blue-100 text-blue-600" },
          { icon: FaRupeeSign, label:"Revenue", value: `₹${(stats.revenue||0).toLocaleString("en-IN",{maximumFractionDigits:0})}`, color:"bg-green-100 text-green-600" },
          { icon: FaUsers, label:"Customers", value: stats.totalUsers, color:"bg-orange-100 text-orange-500" },
          { icon: FaPills, label:"Products", value: stats.totalProducts, color:"bg-purple-100 text-purple-600" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`w-13 h-13 rounded-xl flex items-center justify-center p-3 ${s.color}`}><s.icon className="text-2xl" /></div>
            <div><p className="text-2xl font-bold">{s.value}</p><p className="text-gray-400 text-sm">{s.label}</p></div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-5 mb-7">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold mb-4">Monthly Sales</h3>
          <Bar data={{ labels: MONTHS, datasets: [{ label:"Revenue (₹)", data: salesByMonth, backgroundColor: "rgba(0,87,184,0.8)", borderRadius: 6, borderSkipped: false }] }}
            options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: v => `₹${(v/1000).toFixed(0)}k` }, grid: { color: "#f1f5f9" } }, x: { grid: { display: false } } } }} />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold mb-4">Order Status</h3>
          <Doughnut data={{ labels:["Pending","Delivered","Cancelled"], datasets:[{ data: [stats.pendingOrders||0, stats.totalOrders-(stats.pendingOrders||0), 0], backgroundColor:["#f59e0b","#16a34a","#dc2626"], borderWidth:0 }] }}
            options={{ cutout:"65%", plugins: { legend: { position:"bottom", labels: { padding:14, font:{ size:12 } } } } }} />
        </div>
      </div>

      {/* Alerts */}
      <div className="grid md:grid-cols-2 gap-5 mb-7">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2"><FaExclamationTriangle className="text-yellow-400" />Low Stock</h3>
          </div>
          {lowStock?.length ? lowStock.map(p=>(
            <div key={p._id} className="flex justify-between items-center px-5 py-3 border-b border-gray-50 text-sm hover:bg-gray-50">
              <span className="font-medium">{p.name}</span><span className="text-yellow-600 font-bold">{p.stock} left</span>
            </div>
          )) : <p className="px-5 py-4 text-gray-400 text-sm">All products have sufficient stock</p>}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2"><FaExclamationTriangle className="text-red-400" />Expiring Soon</h3>
          </div>
          {expiringProducts?.length ? expiringProducts.map(p=>(
            <div key={p._id} className="flex justify-between items-center px-5 py-3 border-b border-gray-50 text-sm hover:bg-gray-50">
              <span className="font-medium">{p.name}</span><span className="text-red-500 font-bold">{new Date(p.expiryDate).toLocaleDateString("en-IN",{month:"short",year:"numeric"})}</span>
            </div>
          )) : <p className="px-5 py-4 text-gray-400 text-sm">No products expiring soon</p>}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase"><tr><th className="px-5 py-3 text-left">Order ID</th><th className="px-5 py-3 text-left">Customer</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Date</th></tr></thead>
            <tbody>
              {recentOrders?.map(o=>(
                <tr key={o._id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3.5 font-bold">#{o.orderNumber?.split("-").pop() || o._id.toString().slice(-6).toUpperCase()}</td>
                  <td className="px-5 py-3.5"><div className="font-medium">{o.user?.companyName || o.user?.name}</div><div className="text-xs text-gray-400">{o.user?.email}</div></td>
                  <td className="px-5 py-3.5 text-center font-bold">₹{(o.totalPrice||0).toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-center"><span className={STATUS_COLORS[o.status]||"badge-primary"}>{o.status}</span></td>
                  <td className="px-5 py-3.5 text-center text-gray-400">{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
