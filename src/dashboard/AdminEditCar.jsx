import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardFormLayout from '../layouts/DashboardFormLayout';
import { carAPI } from '../services';
import { formatPrice } from '../utils/constants';

const STEPS = [
  { label: 'Basic Information', description: 'Make, model, category, and transmission' },
  { label: 'Features & Specs', description: 'Seating, fuel type, and features' },
  { label: 'Pricing', description: 'Rate per day' },
  { label: 'Location & Availability', description: 'Pickup city and address' },
  { label: 'Images', description: 'Car photos' },
  { label: 'Review & Submit', description: 'Verify all details' },
];

const CAR_FEATURES = [
  'GPS Navigation', 'Bluetooth', 'Rear Camera', 'Sunroof',
  'Leather Seats', 'Child Seat', 'Cruise Control', 'Heated Seats',
  'Air Conditioning', 'Spare Tyre', 'First Aid Kit', 'Insurance Included',
];

const AdminEditCar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [activeStep, setActiveStep] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    category: 'Economy',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 5,
    features: [],
    pricePerDay: '',
    location: { city: '', address: '' },
    images: [],
  });

  useEffect(() => {
    if (isEdit && id) {
      (async () => {
        try {
          const { data } = await carAPI.getOne(id);
          const c = data.data || data;
          setForm({
            make: c.make || '',
            model: c.model || '',
            year: c.year || new Date().getFullYear(),
            category: c.category || 'Economy',
            transmission: c.transmission || 'Automatic',
            fuelType: c.fuelType || 'Petrol',
            seats: c.seats || 5,
            features: c.features || [],
            pricePerDay: c.pricePerDay || '',
            location: { city: c.location?.city || '', address: c.location?.address || '' },
            images: c.images || [],
          });
        } catch (err) {
          console.error('Failed to load car:', err);
          toast.error('Unable to fetch car details');
        }
      })();
    }
  }, [isEdit, id]);

  const handleFeatureToggle = (feature) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const readFilesAsDataURLs = (files) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setForm(prev => {
          if (prev.images.includes(dataUrl)) return prev;
          return { ...prev, images: [...prev.images, dataUrl] };
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const validate = (step) => {
    switch (step) {
      case 0:
        if (!form.make.trim()) { toast.error('Car make is required'); return false; }
        if (!form.model.trim()) { toast.error('Car model is required'); return false; }
        if (!form.year || form.year < 2000 || form.year > new Date().getFullYear() + 1) {
          toast.error('Please enter a valid year'); return false;
        }
        return true;
      case 1:
        if (!form.seats || form.seats < 1) { toast.error('Number of seats is required'); return false; }
        return true;
      case 2:
        if (!form.pricePerDay || Number(form.pricePerDay) <= 0) { toast.error('Price per day is required'); return false; }
        return true;
      case 3:
        if (!form.location.city.trim()) { toast.error('City is required'); return false; }
        return true;
      case 4:
        if (form.images.length === 0) { toast.error('Please upload at least one image'); return false; }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validate(activeStep)) return;
    setActiveStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleCancel = () => navigate('/dashboard/admin/cars');

  const handleSubmit = async () => {
    for (let i = 0; i < STEPS.length - 1; i++) {
      if (!validate(i)) { setActiveStep(i); return; }
    }
    const payload = {
      ...form,
      year: Number(form.year),
      seats: Number(form.seats),
      pricePerDay: Number(form.pricePerDay),
    };
    try {
      if (isEdit) {
        await carAPI.update(id, payload);
        toast.success('Car updated successfully!');
      } else {
        await carAPI.create(payload);
        toast.success('Car added successfully!');
      }
      navigate('/dashboard/admin/cars');
    } catch (error) {
      console.error('Error saving car:', error);
      toast.error(error?.response?.data?.message || 'Failed to save car. Please try again.');
    }
  };

  const inputClass = 'w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none';
  const selectClass = `${inputClass} bg-white`;
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

  return (
    <DashboardFormLayout
      title={isEdit ? 'Edit Car' : 'Add Car'}
      steps={STEPS}
      activeStep={activeStep}
      onStepChange={setActiveStep}
      onCancel={handleCancel}
      onNext={handleNext}
      onSubmit={handleSubmit}
      isLastStep={activeStep === STEPS.length - 1}
    >
      {/* STEP 0: Basic Information */}
      {activeStep === 0 && (
        <div className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Make (Brand) *</label>
              <input
                type="text"
                value={form.make}
                onChange={e => setForm({ ...form, make: e.target.value })}
                className={inputClass}
                placeholder="e.g., Toyota"
              />
            </div>
            <div>
              <label className={labelClass}>Model *</label>
              <input
                type="text"
                value={form.model}
                onChange={e => setForm({ ...form, model: e.target.value })}
                className={inputClass}
                placeholder="e.g., Innova Crysta"
              />
            </div>
            <div>
              <label className={labelClass}>Year *</label>
              <input
                type="number"
                min="2000"
                max={new Date().getFullYear() + 1}
                value={form.year}
                onChange={e => setForm({ ...form, year: parseInt(e.target.value) || '' })}
                className={inputClass}
                placeholder="e.g., 2023"
              />
            </div>
            <div>
              <label className={labelClass}>Category *</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={selectClass}>
                <option value="Economy">Economy</option>
                <option value="Compact">Compact</option>
                <option value="SUV">SUV</option>
                <option value="Luxury">Luxury</option>
                <option value="Van">Van</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Transmission *</label>
              <select value={form.transmission} onChange={e => setForm({ ...form, transmission: e.target.value })} className={selectClass}>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: Features & Specs */}
      {activeStep === 1 && (
        <div className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Number of Seats *</label>
              <input
                type="number" min="1" max="20"
                value={form.seats}
                onChange={e => setForm({ ...form, seats: parseInt(e.target.value) || '' })}
                className={inputClass}
                placeholder="e.g., 5"
              />
            </div>
            <div>
              <label className={labelClass}>Fuel Type</label>
              <select value={form.fuelType} onChange={e => setForm({ ...form, fuelType: e.target.value })} className={selectClass}>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Car Features</h3>
            <div className="grid grid-cols-2 gap-3">
              {CAR_FEATURES.map(feature => {
                const checked = form.features.includes(feature);
                return (
                  <label
                    key={feature}
                    className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all text-sm ${
                      checked ? 'border-primary-600 bg-primary-50/30 text-primary-900' : 'border-gray-100 hover:border-gray-200 text-gray-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleFeatureToggle(feature)}
                      className="rounded text-primary-600 h-4 w-4 border-gray-300"
                    />
                    <span className="font-medium">{feature}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Pricing */}
      {activeStep === 2 && (
        <div className="space-y-6 max-w-2xl">
          <div className="p-6 border border-blue-200 bg-blue-50/30 rounded-xl max-w-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🚗</span>
              <span className="text-sm font-bold text-blue-800">Daily Rate *</span>
            </div>
            <label className={labelClass}>Price Per Day (₹)</label>
            <input
              type="number" min="0"
              value={form.pricePerDay}
              onChange={e => setForm({ ...form, pricePerDay: e.target.value })}
              className={inputClass}
              placeholder="e.g., 45"
            />
          </div>
          <p className="text-xs text-gray-400">This is the base rate per day for renting this vehicle.</p>
        </div>
      )}

      {/* STEP 3: Location & Availability */}
      {activeStep === 3 && (
        <div className="space-y-6 max-w-2xl">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Pickup Location</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>City *</label>
              <input
                type="text"
                value={form.location.city}
                onChange={e => setForm({ ...form, location: { ...form.location, city: e.target.value } })}
                className={inputClass}
                placeholder="e.g., Mumbai"
              />
            </div>
            <div>
              <label className={labelClass}>Pickup Address</label>
              <input
                type="text"
                value={form.location.address}
                onChange={e => setForm({ ...form, location: { ...form.location, address: e.target.value } })}
                className={inputClass}
                placeholder="e.g., T2 International Airport"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Images */}
      {activeStep === 4 && (
        <div className="space-y-6 max-w-2xl">
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => { readFilesAsDataURLs(e.target.files); e.target.value = ''; }} />
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={e => { e.preventDefault(); setIsDragOver(false); readFilesAsDataURLs(e.dataTransfer.files); }}
            className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl h-44 cursor-pointer transition-all ${isDragOver ? 'border-primary-500 bg-primary-50/40' : 'border-gray-200 hover:border-primary-400 hover:bg-gray-50/50'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5V18a2 2 0 002 2h14a2 2 0 002-2v-1.5M12 3v12m0-12L8.5 6.5M12 3l3.5 3.5" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700">Click to upload or drag & drop</p>
              <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP up to 10MB each</p>
            </div>
            <button type="button" onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }} className="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-medium hover:bg-primary-700 transition-colors">
              Browse Files
            </button>
          </div>

          {form.images.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">Gallery ({form.images.length} image{form.images.length !== 1 ? 's' : ''})</h4>
                <button type="button" onClick={() => setForm(prev => ({ ...prev, images: [] }))} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove all</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {form.images.map((imgSrc, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-100 aspect-video bg-gray-50">
                    <img src={imgSrc} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                      className="absolute top-2 right-2 bg-red-600/90 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-700 transition-all shadow-md opacity-0 group-hover:opacity-100 text-base"
                    >×</button>
                    {idx === 0 && <span className="absolute bottom-2 left-2 bg-primary-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">Cover</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 5: Review & Submit */}
      {activeStep === 5 && (
        <div className="space-y-6 max-w-2xl bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{form.year} {form.make} {form.model}</h3>
              <p className="text-sm text-gray-500">{form.category} · {form.transmission} · {form.fuelType}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-primary-600">{formatPrice(form.pricePerDay || 0, 'INR', 'INR')}</p>
              <p className="text-xs text-gray-400">per day</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Specs</h4>
              <div className="text-sm space-y-1">
                <p><span className="text-gray-500">Seats:</span> <span className="font-medium">{form.seats}</span></p>
                <p><span className="text-gray-500">Fuel:</span> <span className="font-medium">{form.fuelType}</span></p>
                <p><span className="text-gray-500">Transmission:</span> <span className="font-medium">{form.transmission}</span></p>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Pickup Location</h4>
              <p className="text-sm font-medium text-gray-900">{form.location.city || '—'}</p>
              <p className="text-sm text-gray-500">{form.location.address || ''}</p>
            </div>
          </div>

          {form.features.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Features</h4>
              <div className="flex flex-wrap gap-1.5">
                {form.features.map(f => (
                  <span key={f} className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700">{f}</span>
                ))}
              </div>
            </div>
          )}

          {form.images.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Photos ({form.images.length})</h4>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {form.images.map((img, idx) => (
                  <img key={idx} src={img} alt={`Car ${idx + 1}`} className="w-24 h-16 object-cover rounded-lg border border-gray-100 flex-shrink-0" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardFormLayout>
  );
};

export default AdminEditCar;
