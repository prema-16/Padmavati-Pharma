import { Link } from "react-router-dom";
import { FaPills, FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center"><FaPills className="text-white" /></div>
            <span className="text-white font-bold text-lg">Padmavati Pharma</span>
          </div>
          <p className="text-sm leading-7">Trusted pharmaceutical distributor supplying quality medicines and healthcare products to pharmacies, clinics, hospitals and medical stores across India.</p>
        </div>
        <div>
          <h4 className="text-gray-200 font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[["Home","/"],["Products","/products"],["About Us","/about"],["Contact","/contact"]].map(([l,h])=>(
              <li key={h}><Link to={h} className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-gray-200 font-semibold text-sm uppercase tracking-wider mb-4">Customer</h4>
          <ul className="space-y-2 text-sm">
            {[["Register","/register"],["Login","/login"],["My Orders","/my-orders"],["Profile","/profile"]].map(([l,h])=>(
              <li key={h}><Link to={h} className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-gray-200 font-semibold text-sm uppercase tracking-wider mb-4">Contact</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3"><FaMapMarkerAlt className="text-primary mt-0.5 flex-shrink-0" /><span>B8, Aaraj Complex, UG Floor No. 6, Khadkat Road, Near Irrigation Office, Khasbag, Ashti, Beed, MH - 414203</span></div>
            <div className="flex items-center gap-3"><FaPhone className="text-primary flex-shrink-0" /><span>+91 7498520397</span></div>
            <div className="flex items-center gap-3"><FaEnvelope className="text-primary flex-shrink-0" /><span>sunillambade02@gmail.com</span></div>
            <div className="flex items-center gap-3"><FaWhatsapp className="text-green-400 flex-shrink-0" /><span>+91 7498520397</span></div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
        <p className="text-xs">&copy; {new Date().getFullYear()} Padmavati Pharma. All rights reserved.</p>
        <p className="text-xs text-gray-600">
          Designed & Developed by{" "}
          <a href="https://wa.me/918624853376" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-yellow-400 font-semibold transition-colors">
            Premanand Londhe
          </a>
          <br />
          <a href="mailto:premanandlondhe16@gmail.com" className="text-gray-500 hover:text-yellow-400 transition-colors">
            premanandlondhe16@gmail.com
          </a>
        </p>
        <div className="flex gap-3 text-xs">
          <span className="bg-gray-800 px-3 py-1 rounded-full">🔒 Secure</span>
          <span className="bg-gray-800 px-3 py-1 rounded-full">✓ Licensed</span>
          <span className="bg-gray-800 px-3 py-1 rounded-full">ISO Certified</span>
        </div>
      </div>
    </footer>
  );
}
