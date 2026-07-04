import { FiUser, FiMail, FiPhone } from 'react-icons/fi';

const TravellerForm = ({ passengers, guestDetails, onChange }) => {
  const handleChange = (index, field, value) => {
    const newDetails = [...guestDetails];
    if (!newDetails[index]) newDetails[index] = {};
    newDetails[index][field] = value;
    onChange(newDetails);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Traveller Details</h3>
      {Array.from({ length: passengers }).map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm">{i + 1}</span>
            Traveller {i + 1}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  value={guestDetails[i]?.name || ''}
                  onChange={(e) => handleChange(i, 'name', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                required
                min="1"
                value={guestDetails[i]?.age || ''}
                onChange={(e) => handleChange(i, 'age', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="25"
              />
            </div>
            {i === 0 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address (Primary Contact)</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={guestDetails[i]?.email || ''}
                      onChange={(e) => handleChange(i, 'email', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={guestDetails[i]?.phone || ''}
                      onChange={(e) => handleChange(i, 'phone', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TravellerForm;
