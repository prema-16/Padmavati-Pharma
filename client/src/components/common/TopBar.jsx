import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp } from "react-icons/fa";

export default function TopBar() {
  return (
    <div className="bg-primary text-white text-sm py-2 px-4 hidden md:block">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left — Address */}
        <div className="flex items-center gap-2 font-medium">
          <FaMapMarkerAlt className="text-yellow-300 flex-shrink-0 text-base" />
          <span className="text-blue-100">
            B8, Aaraj Complex, UG Floor No. 6, Khadkat Road, Near Irrigation Office,{" "}
            <span className="text-white font-semibold">Khasbag, Ashti, Beed, Maharashtra – 414203</span>
          </span>
        </div>

        {/* Right — Phone, WhatsApp, Email */}
        <div className="flex items-center gap-5 flex-shrink-0">
          <a
            href="tel:+917498520397"
            className="flex items-center gap-1.5 hover:text-yellow-300 transition-colors"
          >
            <FaPhone className="text-yellow-300 text-xs" />
            <span>+91 7498520397</span>
          </a>
          <a
            href="https://wa.me/917498520397"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-yellow-300 transition-colors"
          >
            <FaWhatsapp className="text-green-300 text-base" />
            <span>WhatsApp</span>
          </a>
          <a
            href="mailto:sunillambade02@gmail.com"
            className="flex items-center gap-1.5 hover:text-yellow-300 transition-colors"
          >
            <FaEnvelope className="text-yellow-300 text-xs" />
            <span>sunillambade02@gmail.com</span>
          </a>
        </div>
      </div>
    </div>
  );
}
