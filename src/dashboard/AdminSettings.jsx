import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiSave, FiGlobe, FiMail, FiSmartphone, FiCreditCard, FiFacebook, FiInstagram, FiSearch, FiSettings } from 'react-icons/fi';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('General');
  const [form, setForm] = useState({
    siteName: 'TravelHub',
    siteEmail: 'support@travelhub.com',
    phone: '+1 (987) 654-3210',
    timezone: 'GMT-5: 00 - America/Havana',
    dateFormat: 'DD-MM-YYYY',
    currency: 'INR (₹) - Indian Rupee',
    paymentGateway: 'Razorpay',
    paymentMode: 'Test',
    razorpayKey: '',
    stripeKey: '',
    taxRate: 12,
    smtpHost: 'smtp.travelhub.com',
    smtpPort: 587,
    senderName: 'TravelHub Support',
    senderEmail: 'support@travelhub.com',
    emailEncryption: 'TLS',
    facebook: 'https://facebook.com/travelhub',
    instagram: 'https://instagram.com/travelhub',
    twitter: 'https://x.com/travelhub',
    linkedin: 'https://linkedin.com/company/travelhub',
    metaTitle: 'TravelHub - Book Hotels, Flights, Buses, Cars and Tours',
    metaDescription: 'Plan and book complete travel experiences with TravelHub.',
    metaKeywords: 'travel, hotels, flights, buses, cars, tours',
    bookingWindow: 365,
    cancellationHours: 24,
    supportHours: '24/7',
    maintenanceMode: 'Disabled',
  });

  const tabs = ['General', 'Payment Settings', 'Email Settings', 'Social Media', 'SEO Settings', 'Other'];

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50">
      {/* Tabs */}
      <div className="border-b border-gray-100 px-6 overflow-x-auto">
        <div className="flex items-center gap-6 min-w-max">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSave} className="p-8">
        {activeTab === 'General' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">General Settings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Site Name</label>
                  <div className="relative">
                    <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input type="text" value={form.siteName} onChange={e => setForm({...form, siteName: e.target.value})}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Site Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input type="email" value={form.siteEmail} onChange={e => setForm({...form, siteEmail: e.target.value})}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                  <div className="relative">
                    <FiSmartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
                  <div className="relative">
                    <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none bg-white">
                      <option>USD - US Dollar</option>
                      <option>EUR (€) - Euro</option>
                      <option>GBP (£) - British Pound</option>
                      <option>INR (₹) - Indian Rupee</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Timezone</label>
                  <select value={form.timezone} onChange={e => setForm({...form, timezone: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none bg-white">
                    <option>GMT-5: 00 - America/Havana</option>
                    <option>GMT+0: 00 - UTC</option>
                    <option>GMT+5: 30 - Asia/Kolkata</option>
                    <option>GMT+8: 00 - Asia/Singapore</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Date Format</label>
                  <select value={form.dateFormat} onChange={e => setForm({...form, dateFormat: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none bg-white">
                    <option>DD-MM-YYYY</option>
                    <option>MM-DD-YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center gap-3">
              <button type="button" className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                <label className="cursor-pointer">Choose File
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              </button>
              <span className="text-sm text-gray-400">No file chosen</span>
            </div>
          </div>
        )}

        {activeTab === 'Payment Settings' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Payment Settings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Gateway</label>
                  <div className="relative">
                    <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <select value={form.paymentGateway} onChange={e => setForm({...form, paymentGateway: e.target.value})}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none bg-white">
                      <option>Razorpay</option>
                      <option>Stripe</option>
                      <option>PayPal</option>
                      <option>Cash on Arrival</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Mode</label>
                  <select value={form.paymentMode} onChange={e => setForm({...form, paymentMode: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none bg-white">
                    <option>Test</option>
                    <option>Live</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Razorpay Key</label>
                  <input type="password" value={form.razorpayKey} onChange={e => setForm({...form, razorpayKey: e.target.value})}
                    placeholder="rzp_test_xxxxxxxxx"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Stripe Publishable Key</label>
                  <input type="password" value={form.stripeKey} onChange={e => setForm({...form, stripeKey: e.target.value})}
                    placeholder="pk_test_xxxxxxxxx"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tax Rate (%)</label>
                  <input type="number" min="0" value={form.taxRate} onChange={e => setForm({...form, taxRate: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Email Settings' && (
          <div className="max-w-2xl space-y-6">
            <h3 className="text-base font-semibold text-gray-900">Email Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">SMTP Host</label>
                <input type="text" value={form.smtpHost} onChange={e => setForm({...form, smtpHost: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">SMTP Port</label>
                <input type="number" value={form.smtpPort} onChange={e => setForm({...form, smtpPort: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Sender Name</label>
                <input type="text" value={form.senderName} onChange={e => setForm({...form, senderName: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Sender Email</label>
                <input type="email" value={form.senderEmail} onChange={e => setForm({...form, senderEmail: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Encryption</label>
                <select value={form.emailEncryption} onChange={e => setForm({...form, emailEncryption: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none bg-white">
                  <option>TLS</option>
                  <option>SSL</option>
                  <option>None</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Social Media' && (
          <div className="max-w-2xl space-y-6">
            <h3 className="text-base font-semibold text-gray-900">Social Media</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                ['facebook', 'Facebook URL', FiFacebook],
                ['instagram', 'Instagram URL', FiInstagram],
                ['twitter', 'X / Twitter URL', FiGlobe],
                ['linkedin', 'LinkedIn URL', FiGlobe],
              ].map(([key, label, Icon]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input type="url" value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'SEO Settings' && (
          <div className="max-w-2xl space-y-6">
            <h3 className="text-base font-semibold text-gray-900">SEO Settings</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Title</label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                  <input type="text" value={form.metaTitle} onChange={e => setForm({...form, metaTitle: e.target.value})}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Description</label>
                <textarea rows={4} value={form.metaDescription} onChange={e => setForm({...form, metaDescription: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Keywords</label>
                <input type="text" value={form.metaKeywords} onChange={e => setForm({...form, metaKeywords: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Other' && (
          <div className="max-w-2xl space-y-6">
            <h3 className="text-base font-semibold text-gray-900">Other Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Booking Window (days)</label>
                <input type="number" min="1" value={form.bookingWindow} onChange={e => setForm({...form, bookingWindow: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Free Cancellation Before (hours)</label>
                <input type="number" min="0" value={form.cancellationHours} onChange={e => setForm({...form, cancellationHours: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Support Hours</label>
                <input type="text" value={form.supportHours} onChange={e => setForm({...form, supportHours: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Maintenance Mode</label>
                <div className="relative">
                  <FiSettings className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                  <select value={form.maintenanceMode} onChange={e => setForm({...form, maintenanceMode: e.target.value})}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none bg-white">
                    <option>Disabled</option>
                    <option>Enabled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100">
          <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium text-sm hover:bg-primary-700 transition-colors">
            <FiSave size={15} /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
