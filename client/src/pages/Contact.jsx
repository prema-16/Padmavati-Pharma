import { useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", subject: "", message: "" });
  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", phone: "", company: "", subject: "", message: "" });
  };

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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Name *</label><input value={form.name} onChange={f("name")} className="input" required /></div>
              <div><label className="label">Email *</label><input type="email" value={form.email} onChange={f("email")} className="input" required /></div>
              <div><label className="label">Phone</label><input value={form.phone} onChange={f("phone")} className="input" /></div>
              <div><label className="label">Company</label><input value={form.company} onChange={f("company")} className="input" /></div>
            </div>
            <div>
              <label className="label">Subject *</label>
              <select value={form.subject} onChange={f("subject")} className="input" required>
                <option value="">Select subject</option>
                <option>Product Enquiry</option>
                <option>Pricing & Discounts</option>
                <option>Partnership / Registration</option>
                <option>Order Issue</option>
                <option>Other</option>
              </select>
            </div>
            <div><label className="label">Message *</label><textarea value={form.message} onChange={f("message")} className="input" rows="4" required /></div>
            <button type="submit" className="btn-primary w-full py-3 text-base">Send Message →</button>
          </form>
        </div>
      </div>
    </div>
  );
}
