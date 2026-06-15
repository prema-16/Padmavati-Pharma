import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../services/api";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const { user: me } = useSelector((s) => s.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");
  const [modal, setModal] = useState(null);
  const [newRole, setNewRole] = useState("");

  const load = () => {
    setLoading(true);
    api.get(`/admin/users?role=${roleFilter}&limit=50`).then(r => setUsers(r.data.users)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [roleFilter]);

  const handleRoleUpdate = async () => {
    try { await api.put(`/admin/users/${modal._id}/role`, { role: newRole }); toast.success("Role updated!"); setModal(null); load(); }
    catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const handleToggle = async (id) => {
    try { await api.put(`/admin/users/${id}/toggle`); toast.success("User status updated"); load(); }
    catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const roleBadge = (r) => r === "owner" ? "bg-red-100 text-red-600" : r === "staff" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-600";

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>
      <div className="flex gap-2 mb-5">
        {["","owner","staff","customer"].map(r=>(
          <button key={r} onClick={()=>setRoleFilter(r)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${roleFilter===r?"bg-primary text-white":"bg-white border border-gray-200 text-gray-600 hover:border-primary"}`}>{r?r.charAt(0).toUpperCase()+r.slice(1):"All"}</button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <tr><th className="px-5 py-3.5 text-left">User</th><th className="px-5 py-3.5">Company</th><th className="px-5 py-3.5">Phone</th><th className="px-5 py-3.5">Role</th><th className="px-5 py-3.5">Status</th><th className="px-5 py-3.5">Joined</th><th className="px-5 py-3.5">Actions</th></tr>
              </thead>
              <tbody>
                {users.map(u=>(
                  <tr key={u._id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">{u.name.charAt(0)}</div>
                        <div><p className="font-medium">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{u.companyName||"—"}</td>
                    <td className="px-5 py-3.5 text-gray-500">{u.phone||"—"}</td>
                    <td className="px-5 py-3.5 text-center"><span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${roleBadge(u.role)}`}>{u.role}</span></td>
                    <td className="px-5 py-3.5 text-center"><span className={u.isActive!==false?"badge-success":"bg-gray-100 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-full"}>{u.isActive!==false?"Active":"Inactive"}</span></td>
                    <td className="px-5 py-3.5 text-center text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-5 py-3.5">
                      {me?.role === "owner" && u._id !== me._id && (
                        <div className="flex gap-2">
                          <button onClick={()=>{setModal(u);setNewRole(u.role);}} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs hover:bg-blue-100">Role</button>
                          <button onClick={()=>handleToggle(u._id)} className={`px-3 py-1.5 rounded-lg text-xs ${u.isActive!==false?"bg-red-50 text-red-500 hover:bg-red-100":"bg-green-50 text-green-600 hover:bg-green-100"}`}>{u.isActive!==false?"Deactivate":"Activate"}</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && <tr><td colSpan="7" className="text-center py-12 text-gray-400">No users found</td></tr>}
              </tbody>
            </table>
          </div>

          {/* Mobile View Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {users.map((u) => (
              <div key={u._id} className="p-4 hover:bg-gray-50 flex flex-col gap-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">{u.name.charAt(0)}</div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-sm text-gray-950 truncate">{u.name}</h4>
                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex-shrink-0 ${roleBadge(u.role)}`}>{u.role}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <div><span className="text-gray-400">Company:</span> <span className="font-medium text-gray-700">{u.companyName || "—"}</span></div>
                  <div><span className="text-gray-400">Phone:</span> <span className="font-medium text-gray-700">{u.phone || "—"}</span></div>
                  <div><span className="text-gray-400">Status:</span> <span className={u.isActive !== false ? "text-green-600 font-bold" : "text-gray-400"}>{u.isActive !== false ? "Active" : "Inactive"}</span></div>
                  <div><span className="text-gray-400">Joined:</span> <span className="text-gray-500">{new Date(u.createdAt).toLocaleDateString("en-IN")}</span></div>
                </div>
                {me?.role === "owner" && u._id !== me._id && (
                  <div className="flex gap-2.5 mt-1">
                    <button onClick={() => { setModal(u); setNewRole(u.role); }} className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100">Change Role</button>
                    <button onClick={() => handleToggle(u._id)} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${u.isActive !== false ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>{u.isActive !== false ? "Deactivate" : "Activate"}</button>
                  </div>
                )}
              </div>
            ))}
            {users.length === 0 && <p className="p-5 text-center text-gray-400 text-sm">No users found</p>}
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-lg mb-4">Change Role for {modal.name}</h3>
            <select value={newRole} onChange={e=>setNewRole(e.target.value)} className="input mb-5">
              <option value="customer">Customer</option>
              <option value="staff">Staff</option>
              <option value="owner">Owner</option>
            </select>
            <div className="flex gap-3">
              <button onClick={handleRoleUpdate} className="btn-primary flex-1">Update Role</button>
              <button onClick={()=>setModal(null)} className="btn-outline flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
