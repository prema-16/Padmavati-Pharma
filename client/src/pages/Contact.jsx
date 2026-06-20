import { useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp, FaExclamationCircle } from "react-icons/fa";
import toast from "react-hot-toast";

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
      <FaExclamationCircle className="text-red-500 text-xs flex-shrink-0" />
      <p className="text-xs text-red-600 font-medium">{msg}</p>
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});

  const f = (k) => (e) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, [k]: val }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: validateField(k, val) }));
  };

  const validateField = (k, val) => {
    if (k === "name"    && !val.trim()) return "Your name is required.";
    if (k === "email") {
      if (!val.trim())               return "Email address is required.";
      if (!/\S+@\S+\.\S+/.test(val)) return "Enter a valid email address.";
    }
    if (k === "subject"  && !val)     return "Please select a subject.";
    if (k === "message"  && !val.trim()) return "Message cannot be empty.";
    return "";
  };

  const validateAll = () => {
    const required = ["name", "email", "subject", "message"];
    const newErrors = {};
    required.forEach((k) => { const msg = validateField(k, form[k]); if (msg) newErrors[k] = msg; });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", phone: "", company: "", subject: "", message: "" });
    setErrors({});
  };

  const inputClass = (k) =>
    `input ${errors[k] ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-100" : ""}`;

  const contacts = [
    { icon: FaMapMarkerAlt, title: "Address", text: "B8, Aaraj Complex, Under Ground Floor No. 6\nKhadkat Road, Near Irrigation Office\nKhasbag, Ashti, Beed, Maharashtra - 414203", color: "bg-primary/10 text-primary" },
    { icon: FaPhone, title: "Phone & WhatsApp", text: "+91 7498520397", color: "bg-green-100 dark:bg-green-900/30 text-green-600" },
    { icon: FaEnvelope, title: "Email", text: "sunillambade02@gmail.com", color: "bg-orange-100 dark:bg-orange-900/30 text-orange-500" },
    { icon: FaWhatsapp, title: "WhatsApp", text: "+91 7498520397\nQuick orders & queries", color: "bg-green-100 dark:bg-green-900/30 text-green-500" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
          <p className="text-blue-100">We're here to help with your pharmaceutical supply needs</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-14">
        {/* Left — contact info */}
        <div>
          <h2 className="text-2xl font-bold mb-3 text-heading">Get in Touch</h2>
          <p className="text-muted mb-8">Have questions about our products, pricing or partnerships? Our team is ready to help.</p>

          {contacts.map((c) => (
            <div key={c.title} className="flex items-start gap-4 mb-7">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${c.color}`}>
                <c.icon />
              </div>
              <div>
                <h4 className="font-semibold mb-1 text-heading">{c.title}</h4>
                <p className="text-muted text-sm whitespace-pre-line">{c.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right — form card */}
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
          <h3 className="font-bold text-xl mb-6 text-heading">Send a Message</h3>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Name */}
            <div>
              <label className="label">Name <span className="text-red-400">*</span></label>
              <input value={form.name} onChange={f("name")} onBlur={(e) => setErrors((p) => ({ ...p, name: validateField("name", e.target.value) }))} className={inputClass("name")} placeholder="Your full name" />
              <FieldError msg={errors.name} />
            </div>

            {/* Email */}
            <div>
              <label className="label">Email <span className="text-red-400">*</span></label>
              <input type="email" inputMode="email" value={form.email} onChange={f("email")} onBlur={(e) => setErrors((p) => ({ ...p, email: validateField("email", e.target.value) }))} className={inputClass("email")} placeholder="you@company.com" />
              <FieldError msg={errors.email} />
            </div>

            {/* Phone + Company — side by side on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Phone <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
                <input type="tel" inputMode="numeric" value={form.phone} onChange={f("phone")} className="input" placeholder="+91 XXXXX XXXXX" />
              </div>
              <div>
                <label className="label">Company <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
                <input value={form.company} onChange={f("company")} className="input" placeholder="Your pharmacy / clinic" />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="label">Subject <span className="text-red-400">*</span></label>
              <select value={form.subject} onChange={f("subject")} onBlur={(e) => setErrors((p) => ({ ...p, subject: validateField("subject", e.target.value) }))} className={inputClass("subject")}>
                <option value="">Select a subject</option>
                <option>Product Enquiry</option>
                <option>Pricing &amp; Discounts</option>
                <option>Partnership / Registration</option>
                <option>Order Issue</option>
                <option>Other</option>
              </select>
              <FieldError msg={errors.subject} />
            </div>

            {/* Message */}
            <div>
              <label className="label">Message <span className="text-red-400">*</span></label>
              <textarea value={form.message} onChange={f("message")} onBlur={(e) => setErrors((p) => ({ ...p, message: validateField("message", e.target.value) }))} className={inputClass("message")} rows="4" placeholder="Tell us how we can help…" />
              <FieldError msg={errors.message} />
            </div>

            <button type="submit" className="btn-primary w-full py-3 text-base">Send Message →</button>
          </form>
        </div>
      </div>
    </div>
  );
}
