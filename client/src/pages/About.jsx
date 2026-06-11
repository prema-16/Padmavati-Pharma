import { FaShieldAlt, FaHeartbeat, FaHandshake, FaRocket, FaEye, FaFlag } from "react-icons/fa";

export default function About() {
  return (
    <div>
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-16"><div className="max-w-7xl mx-auto px-6"><h1 className="text-4xl font-bold mb-2">About Padmavati Pharma</h1><p className="text-blue-100">Trusted pharmaceutical distributor since 2024</p></div></div>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <span className="badge-primary mb-4 inline-block">Our Story</span>
            <h2 className="text-3xl font-bold mb-4">Trusted Partner for Healthcare Professionals</h2>
            <p className="text-gray-500 leading-7 mb-4">Founded in 2024, Padmavati Pharma has grown from a small regional distributor to one of India's most trusted pharmaceutical wholesale companies. We supply quality medicines and healthcare products to over 1,000 pharmacies, clinics, hospitals and medical stores across the country.</p>
            <p className="text-gray-500 leading-7">Our commitment to authenticity, competitive pricing and reliable delivery has made us the preferred choice for healthcare professionals across India.</p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[{icon:FaShieldAlt,t:"Integrity",d:"100% genuine products"},{icon:FaHeartbeat,t:"Quality",d:"WHO-GMP certified"},{icon:FaHandshake,t:"Partnership",d:"Long-term trust"},{icon:FaRocket,t:"Innovation",d:"Digital-first approach"}].map(v=>(
                <div key={v.t} className="bg-primary/5 rounded-xl p-4">
                  <v.icon className="text-primary text-xl mb-2" />
                  <h4 className="font-semibold mb-1">{v.t}</h4>
                  <p className="text-xs text-gray-400">{v.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[["1,000+","Clients Served","🏥"],["600+","Products","💊"],["100+","Daily Deliveries","🚚"],["98%","Satisfaction","⭐"]].map(([v,l,e])=>(
              <div key={l} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
                <div className="text-3xl mb-2">{e}</div>
                <p className="text-2xl font-bold text-primary">{v}</p>
                <p className="text-gray-500 text-sm">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-r from-primary/5 to-blue-50 rounded-3xl p-10 grid md:grid-cols-2 gap-10">
          <div><h3 className="font-bold text-xl mb-3 flex items-center gap-2"><FaEye className="text-primary" /> Our Mission</h3><p className="text-gray-500 leading-7">To make quality pharmaceutical products accessible and affordable to every healthcare provider in India, ensuring the end patient receives authentic medicines that improve their health and wellbeing.</p></div>
          <div><h3 className="font-bold text-xl mb-3 flex items-center gap-2"><FaFlag className="text-green-500" /> Our Vision</h3><p className="text-gray-500 leading-7">To become India's most trusted and technology-driven pharmaceutical distributor, leveraging digital innovation to build a transparent, efficient and patient-centric supply chain.</p></div>
        </div>
      </div>
    </div>
  );
}
