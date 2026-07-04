import { FiBriefcase, FiCoffee, FiShield, FiStar } from 'react-icons/fi';
import { formatPrice } from '../../utils/constants';

const ADD_ONS_DATA = [
  { id: 'baggage', name: 'Extra Baggage', desc: 'Add up to 20 kg extra baggage', price: 900, icon: FiBriefcase },
  { id: 'meal', name: 'Meal Preference', desc: 'Choose your preferred meal', price: 350, icon: FiCoffee },
  { id: 'insurance', name: 'Travel Insurance', desc: 'Protect your trip', price: 299, icon: FiShield },
  { id: 'lounge', name: 'Lounge Access', desc: 'Relax in airport lounges', price: 1200, icon: FiStar },
];

const AddOns = ({ addOns, onAddOnChange }) => {
  const toggleAddOn = (id) => {
    const isSelected = !!addOns[id];
    onAddOnChange({ ...addOns, [id]: !isSelected });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Add-Ons</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ADD_ONS_DATA.map(addon => {
          const isSelected = !!addOns[addon.id];
          return (
            <div 
              key={addon.id}
              onClick={() => toggleAddOn(addon.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 ${isSelected ? 'border-primary-600 bg-primary-50/50' : 'border-gray-200 bg-white hover:border-primary-300'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-primary-600 text-white' : 'bg-primary-50 text-primary-600'}`}>
                <addon.icon size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">{addon.name}</h4>
                    <p className="text-xs text-gray-500">{addon.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary-600">{formatPrice(addon.price, 'INR', 'INR')}</span>
                    <input type="checkbox" checked={isSelected} readOnly className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default AddOns;
export { ADD_ONS_DATA };
