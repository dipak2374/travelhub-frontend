import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thanks for reaching out! We will get back to you soon.');
  };

  return (
    <div className="bg-white dark:bg-gray-950 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary-600 font-semibold mb-3">Contact us</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">We are here to help with every trip detail.</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Need help with a booking, want to become a partner, or have feedback for us? Reach out and our team will respond shortly.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <FiMail className="text-primary-600" size={18} />
              <span>support@travelhub.com</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <FiPhone className="text-primary-600" size={18} />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <FiMapPin className="text-primary-600" size={18} />
              <span>New York, USA</span>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-gray-200 bg-gray-50 h-48 flex items-center justify-center text-gray-500">
            Map placeholder
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field w-full"
            />
            <input
              type="email"
              placeholder="Your email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field w-full"
            />
            <textarea
              rows={5}
              placeholder="How can we help?"
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="input-field w-full resize-none"
            />
            <button type="submit" className="btn-primary w-full">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
