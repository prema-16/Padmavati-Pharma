import { Link } from "react-router-dom";
import { FaShieldAlt, FaTruck, FaTag, FaHeadset, FaFileInvoiceDollar, FaRedo, FaPills, FaSyringe, FaStethoscope, FaCut, FaStar, FaHeart, FaFlask, FaFirstAid, FaHandSparkles, FaMapMarkerAlt, FaPhone, FaWhatsapp, FaEnvelope, FaClock, FaDirections } from "react-icons/fa";

const features = [
  { icon: FaShieldAlt, title: "100% Genuine Products", desc: "Every product sourced directly from licensed manufacturers and verified for authenticity.", color: "text-primary bg-primary/10" },
  { icon: FaTruck, title: "Fast Delivery", desc: "Same-day dispatch for orders before 2 PM. Pan-India delivery with real-time tracking.", color: "text-green-600 bg-green-100" },
  { icon: FaTag, title: "Best Wholesale Prices", desc: "Competitive distributor pricing with transparent GST billing and volume discounts.", color: "text-orange-500 bg-orange-100" },
  { icon: FaHeadset, title: "24/7 Support", desc: "Dedicated account managers and round-the-clock support for all your queries.", color: "text-purple-600 bg-purple-100" },
  { icon: FaFileInvoiceDollar, title: "GST Compliant Invoicing", desc: "Automated GST invoices with complete itemization for easy accounting.", color: "text-red-500 bg-red-100" },
  { icon: FaRedo, title: "Easy Returns", desc: "Hassle-free returns for expired or damaged products within 7 days.", color: "text-cyan-600 bg-cyan-100" },
];

const categories = [
  { icon: FaPills, name: "Tablets", count: "2,000+ items", q: "Tablets" },
  { icon: FaFlask, name: "Capsules", count: "800+ items", q: "Capsules" },
  { icon: FaFirstAid, name: "Syrups", count: "600+ items", q: "Syrups" },
  { icon: FaSyringe, name: "Injections", count: "400+ items", q: "Injections" },
  { icon: FaCut, name: "Surgical", count: "300+ items", q: "Surgical Products" },
  { icon: FaStethoscope, name: "Equipment", count: "250+ items", q: "Medical Equipment" },
  { icon: FaHandSparkles, name: "Personal Care", count: "500+ items", q: "Personal Care" },
];

const testimonials = [
  { name: "Dr. Rahul Sharma", title: "Apollo Pharmacy, Mumbai", text: "Excellent service and genuine medicines. Order tracking is very helpful and delivery is always on time.", rating: 5, initials: "R", color: "bg-primary" },
  { name: "Priya Nair", title: "City Medical Store, Chennai", text: "Best wholesale prices in the market. GST invoicing is seamless and inventory is always well-stocked.", rating: 5, initials: "P", color: "bg-green-600" },
  { name: "Dr. Amit Patel", title: "Sunrise Clinic, Ahmedabad", text: "Running a small clinic, I need reliable supply. Padmavati Pharma has never let me down.", rating: 4, initials: "A", color: "bg-orange-500" },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-blue-900 text-white py-10 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z'/%3E%3C/g%3E%3C/svg%3E\")" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative grid md:grid-cols-2 gap-8 md:gap-12 items-center">

          {/* LEFT — Heading & CTA */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs sm:text-sm font-semibold mb-4">
              <FaShieldAlt /> Trusted Since 2024
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3 sm:mb-5">
              India's Leading <span className="text-sky-300">Padmavati Pharma</span> Distributor
            </h1>
            <p className="text-blue-100 text-sm sm:text-lg mb-6 sm:mb-8 leading-relaxed">
              Supplying quality medicines and healthcare products to 1,000+ pharmacies, clinics, hospitals and medical stores with guaranteed authenticity.
            </p>
            <div className="flex flex-col xs:flex-row gap-3">
              <Link to="/products" className="bg-white text-primary font-bold px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
                <FaPills /> Browse Products
              </Link>
              <Link to="/register" className="border-2 border-white/60 text-white font-bold px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl hover:bg-white/10 transition-all text-center text-sm sm:text-base">
                Register Now →
              </Link>
            </div>
            <div className="flex gap-6 sm:gap-10 mt-8 sm:mt-12">
              {[["600+","Products"],["1,000+","Clients"],["98%","Satisfaction"]].map(([v,l])=>(
                <div key={l}><p className="text-xl sm:text-3xl font-bold">{v}</p><p className="text-blue-200 text-xs sm:text-sm">{l}</p></div>
              ))}
            </div>
          </div>

          {/* RIGHT — Address Card (hidden on small mobile, visible sm+) */}
          <div className="hidden sm:flex justify-center md:justify-end">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 w-full max-w-sm text-white shadow-2xl">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/20">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaPills className="text-blue-900 text-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">Padmavati Pharma</h3>
                  <p className="text-blue-200 text-xs">Visit Our Store</p>
                </div>
              </div>
              <div className="flex items-start gap-3 mb-3">
                <FaMapMarkerAlt className="text-yellow-300 text-base mt-0.5 flex-shrink-0" />
                <p className="text-blue-100 text-sm leading-6">B8, Aaraj Complex, UG Floor No. 6,<br/>Khadkat Road, Near Irrigation Office,<br/><span className="text-white font-semibold">Khasbag, Ashti, Beed, MH – 414203</span></p>
              </div>
              <a href="tel:+917498520397" className="flex items-center gap-3 mb-2.5 hover:text-yellow-300 transition-colors">
                <FaPhone className="text-yellow-300 text-sm flex-shrink-0" />
                <span className="text-sm font-medium">+91 7498520397</span>
              </a>
              <a href="https://wa.me/917498520397" target="_blank" rel="noreferrer" className="flex items-center gap-3 mb-2.5 hover:text-yellow-300 transition-colors">
                <FaWhatsapp className="text-green-300 text-base flex-shrink-0" />
                <span className="text-sm font-medium">+91 7498520397 (WhatsApp)</span>
              </a>
              <a href="mailto:sunillambade02@gmail.com" className="flex items-center gap-3 mb-4 hover:text-yellow-300 transition-colors">
                <FaEnvelope className="text-yellow-300 text-sm flex-shrink-0" />
                <span className="text-sm font-medium">sunillambade02@gmail.com</span>
              </a>
              <div className="flex items-center gap-3 mb-4">
                <FaClock className="text-yellow-300 text-sm flex-shrink-0" />
                <span className="text-blue-100 text-sm">Mon – Sat: 9:00 AM – 7:00 PM</span>
              </div>
              <a href="https://maps.google.com/?q=Khasbag+Ashti+Beed+Maharashtra" target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold py-2.5 rounded-xl transition-all text-sm">
                <FaDirections /> Get Directions
              </a>
            </div>
          </div>

          {/* Mobile address strip */}
          <div className="sm:hidden bg-white/10 border border-white/20 rounded-xl p-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-sm"><FaMapMarkerAlt className="text-yellow-300 flex-shrink-0" /><span className="text-blue-100 text-xs">Khasbag, Ashti, Beed, MH – 414203</span></div>
            <div className="flex gap-3">
              <a href="tel:+917498520397" className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 text-blue-900 font-bold py-2 rounded-lg text-xs">
                <FaPhone /> Call Now
              </a>
              <a href="https://wa.me/917498520397" target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-2 rounded-lg text-xs">
                <FaWhatsapp /> WhatsApp
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">Browse by Category</span>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Our Product Categories</h2>
            <p className="text-gray-500">Explore our wide range of pharmaceutical and healthcare categories</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((c) => (
              <Link key={c.name} to={`/products?search=${c.q}`} className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:border-primary hover:shadow-md transition-all group">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary transition-all">
                  <c.icon className="text-2xl text-primary group-hover:text-white transition-all" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">{c.name}</h4>
                <p className="text-xs text-gray-400">{c.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">Why Choose Us</span>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">The Preferred Choice for Healthcare Professionals</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-all">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-5 ${f.color}`}><f.icon /></div>
                <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">Testimonials</span>
            <h2 className="text-3xl font-bold text-gray-800">Trusted by Healthcare Professionals</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-md transition-all">
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_,i)=><FaStar key={i} className={i < t.rating ? "text-yellow-400" : "text-gray-200"} />)}</div>
                <p className="text-gray-500 text-sm italic leading-7 mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 ${t.color} text-white rounded-full flex items-center justify-center font-bold`}>{t.initials}</div>
                  <div><p className="font-semibold text-sm">{t.name}</p><p className="text-xs text-gray-400">{t.title}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Streamline Your Pharmaceutical Supply?</h2>
          <p className="text-blue-100 mb-8">Join 1,000+ healthcare professionals who trust Padmavati Pharma.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="bg-white text-primary font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-all">Create Free Account</Link>
            <Link to="/contact" className="border-2 border-white/50 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all">Contact Sales</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
