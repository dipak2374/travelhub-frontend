import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardFormLayout from '../layouts/DashboardFormLayout';
import { flightAPI } from '../services';
import { formatPrice } from '../utils/constants';

const STEPS = [
  { label: 'Basic Information', description: 'Flight number, airline, and type' },
  { label: 'Route & Schedule', description: 'Origin, destination, and timings' },
  { label: 'Seats & Classes', description: 'Capacity and fare classes' },
  { label: 'Baggage & Amenities', description: 'Allowances and in-flight services' },
  { label: 'Pricing', description: 'Base fares and taxes' },
  { label: 'Review & Submit', description: 'Verify all details' },
];

const AMENITIES_LIST = [
  'In-flight WiFi',
  'USB Charging',
  'Entertainment Screen',
  'Meal Included',
  'Blanket & Pillow',
  'Priority Boarding',
  'Lounge Access',
  'Extra Legroom',
];

const AdminEditFlight = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [activeStep, setActiveStep] = useState(0);

  const [form, setForm] = useState({
    flightNumber: '',
    airline: '',
    flightType: 'Domestic',
    origin: { city: '', airport: '', code: '' },
    destination: { city: '', airport: '', code: '' },
    departureTime: '',
    arrivalTime: '',
    duration: '',
    totalSeats: 180,
    availableSeats: 180,
    baggageAllowance: { checkin: '15', cabin: '7' },
    amenities: [],
    price: { economy: '', business: '', firstClass: '' },
  });

  // Load flight data when editing
  useEffect(() => {
    if (isEdit && id) {
      (async () => {
        try {
          const { data } = await flightAPI.getOne(id);
          const f = data.data || data;
          setForm({
            flightNumber: f.flightNumber || '',
            airline: f.airline || '',
            flightType: f.flightType || 'Domestic',
            origin: {
              city: f.origin?.city || '',
              airport: f.origin?.airport || '',
              code: f.origin?.code || '',
            },
            destination: {
              city: f.destination?.city || '',
              airport: f.destination?.airport || '',
              code: f.destination?.code || '',
            },
            departureTime: f.departureTime ? new Date(f.departureTime).toISOString().slice(0, 16) : '',
            arrivalTime: f.arrivalTime ? new Date(f.arrivalTime).toISOString().slice(0, 16) : '',
            duration: f.duration || '',
            totalSeats: f.totalSeats || 180,
            availableSeats: f.availableSeats || 180,
            baggageAllowance: f.baggageAllowance || { checkin: '15', cabin: '7' },
            amenities: f.amenities || [],
            price: {
              economy: f.price?.economy || '',
              business: f.price?.business || '',
              firstClass: f.price?.firstClass || '',
            },
          });
        } catch (err) {
          console.error('Failed to load flight:', err);
          toast.error('Unable to fetch flight details');
        }
      })();
    }
  }, [isEdit, id]);

  // Auto-calculate duration when times change
  useEffect(() => {
    if (form.departureTime && form.arrivalTime) {
      const dep = new Date(form.departureTime);
      const arr = new Date(form.arrivalTime);
      const diffMs = arr - dep;
      if (diffMs > 0) {
        setForm(prev => ({ ...prev, duration: Math.round(diffMs / 60000) }));
      }
    }
  }, [form.departureTime, form.arrivalTime]);

  const handleAmenityToggle = (amenity) => {
    setForm(prev => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter(a => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const formatDuration = (mins) => {
    if (!mins || mins <= 0) return '—';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const validate = (step) => {
    switch (step) {
      case 0:
        if (!form.flightNumber.trim()) { toast.error('Flight number is required'); return false; }
        if (!form.airline.trim()) { toast.error('Airline name is required'); return false; }
        return true;

      case 1:
        if (!form.origin.city.trim()) { toast.error('Origin city is required'); return false; }
        if (!form.origin.airport.trim()) { toast.error('Origin airport is required'); return false; }
        if (!form.origin.code.trim()) { toast.error('Origin airport code is required'); return false; }
        if (!form.destination.city.trim()) { toast.error('Destination city is required'); return false; }
        if (!form.destination.airport.trim()) { toast.error('Destination airport is required'); return false; }
        if (!form.destination.code.trim()) { toast.error('Destination airport code is required'); return false; }
        if (!form.departureTime) { toast.error('Departure time is required'); return false; }
        if (!form.arrivalTime) { toast.error('Arrival time is required'); return false; }
        if (new Date(form.arrivalTime) <= new Date(form.departureTime)) {
          toast.error('Arrival time must be after departure time'); return false;
        }
        return true;

      case 2:
        if (!form.totalSeats || Number(form.totalSeats) < 1) { toast.error('Total seats must be at least 1'); return false; }
        if (Number(form.availableSeats) > Number(form.totalSeats)) { toast.error('Available seats cannot exceed total seats'); return false; }
        return true;

      case 3:
        return true;

      case 4:
        if (!form.price.economy || Number(form.price.economy) <= 0) { toast.error('Economy price is required'); return false; }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validate(activeStep)) return;
    setActiveStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleCancel = () => navigate('/dashboard/admin/flights');

  const handleSubmit = async () => {
    for (let i = 0; i < STEPS.length - 1; i++) {
      if (!validate(i)) {
        setActiveStep(i);
        return;
      }
    }

    const payload = {
      ...form,
      duration: Number(form.duration),
      totalSeats: Number(form.totalSeats),
      availableSeats: Number(form.availableSeats),
      price: {
        economy: Number(form.price.economy),
        business: Number(form.price.business) || 0,
        firstClass: Number(form.price.firstClass) || 0,
      },
    };
    // Remove non-schema fields
    delete payload.baggageAllowance;
    delete payload.amenities;
    delete payload.flightType;

    try {
      if (isEdit) {
        await flightAPI.update(id, payload);
        toast.success('Flight updated successfully!');
      } else {
        await flightAPI.create(payload);
        toast.success('Flight added successfully!');
      }
      navigate('/dashboard/admin/flights');
    } catch (error) {
      console.error('Error saving flight:', error);
      toast.error(error?.response?.data?.message || 'Failed to save flight. Please try again.');
    }
  };

  const inputClass = 'w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none';
  const selectClass = `${inputClass} bg-white`;
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

  return (
    <DashboardFormLayout
      title={isEdit ? 'Edit Flight' : 'Add Flight'}
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
              <label className={labelClass}>Flight Number *</label>
              <input
                type="text"
                value={form.flightNumber}
                onChange={e => setForm({ ...form, flightNumber: e.target.value.toUpperCase() })}
                className={inputClass}
                placeholder="e.g., AI101"
              />
            </div>
            <div>
              <label className={labelClass}>Airline *</label>
              <input
                type="text"
                value={form.airline}
                onChange={e => setForm({ ...form, airline: e.target.value })}
                className={inputClass}
                placeholder="e.g., Air India"
              />
            </div>
            <div>
              <label className={labelClass}>Flight Type</label>
              <select
                value={form.flightType}
                onChange={e => setForm({ ...form, flightType: e.target.value })}
                className={selectClass}
              >
                <option>Domestic</option>
                <option>International</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: Route & Schedule */}
      {activeStep === 1 && (
        <div className="space-y-8 max-w-2xl">
          {/* Origin */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">A</span>
              Origin
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>City *</label>
                <input
                  type="text"
                  value={form.origin.city}
                  onChange={e => setForm({ ...form, origin: { ...form.origin, city: e.target.value } })}
                  className={inputClass}
                  placeholder="e.g., New Delhi"
                />
              </div>
              <div>
                <label className={labelClass}>Airport *</label>
                <input
                  type="text"
                  value={form.origin.airport}
                  onChange={e => setForm({ ...form, origin: { ...form.origin, airport: e.target.value } })}
                  className={inputClass}
                  placeholder="e.g., Indira Gandhi Intl"
                />
              </div>
              <div>
                <label className={labelClass}>Code *</label>
                <input
                  type="text"
                  value={form.origin.code}
                  onChange={e => setForm({ ...form, origin: { ...form.origin, code: e.target.value.toUpperCase() } })}
                  className={inputClass}
                  placeholder="e.g., DEL"
                  maxLength={4}
                />
              </div>
            </div>
          </div>

          {/* Destination */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">B</span>
              Destination
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>City *</label>
                <input
                  type="text"
                  value={form.destination.city}
                  onChange={e => setForm({ ...form, destination: { ...form.destination, city: e.target.value } })}
                  className={inputClass}
                  placeholder="e.g., Mumbai"
                />
              </div>
              <div>
                <label className={labelClass}>Airport *</label>
                <input
                  type="text"
                  value={form.destination.airport}
                  onChange={e => setForm({ ...form, destination: { ...form.destination, airport: e.target.value } })}
                  className={inputClass}
                  placeholder="e.g., Chhatrapati Shivaji Intl"
                />
              </div>
              <div>
                <label className={labelClass}>Code *</label>
                <input
                  type="text"
                  value={form.destination.code}
                  onChange={e => setForm({ ...form, destination: { ...form.destination, code: e.target.value.toUpperCase() } })}
                  className={inputClass}
                  placeholder="e.g., BOM"
                  maxLength={4}
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Schedule</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Departure *</label>
                <input
                  type="datetime-local"
                  value={form.departureTime}
                  onChange={e => setForm({ ...form, departureTime: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Arrival *</label>
                <input
                  type="datetime-local"
                  value={form.arrivalTime}
                  onChange={e => setForm({ ...form, arrivalTime: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Duration</label>
                <div className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-600">
                  {formatDuration(form.duration)}
                </div>
                <p className="text-xs text-gray-400 mt-1">Auto-calculated</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Seats & Classes */}
      {activeStep === 2 && (
        <div className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Total Seats *</label>
              <input
                type="number"
                min="1"
                value={form.totalSeats}
                onChange={e => setForm({ ...form, totalSeats: parseInt(e.target.value) || '' })}
                className={inputClass}
                placeholder="e.g., 180"
              />
            </div>
            <div>
              <label className={labelClass}>Available Seats</label>
              <input
                type="number"
                min="0"
                value={form.availableSeats}
                onChange={e => setForm({ ...form, availableSeats: parseInt(e.target.value) || '' })}
                className={inputClass}
                placeholder="e.g., 180"
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Seat Class Distribution</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Economy', color: 'bg-emerald-50 border-emerald-200 text-emerald-800', icon: '💺' },
                { label: 'Business', color: 'bg-blue-50 border-blue-200 text-blue-800', icon: '🪑' },
                { label: 'First Class', color: 'bg-amber-50 border-amber-200 text-amber-800', icon: '👑' },
              ].map(cls => (
                <div key={cls.label} className={`p-4 rounded-xl border ${cls.color} text-center`}>
                  <span className="text-2xl">{cls.icon}</span>
                  <p className="text-sm font-semibold mt-2">{cls.label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">Seat class pricing is configured in the Pricing step</p>
          </div>
        </div>
      )}

      {/* STEP 3: Baggage & Amenities */}
      {activeStep === 3 && (
        <div className="space-y-8 max-w-2xl">
          {/* Baggage */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Baggage Allowance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Check-in Baggage (kg)</label>
                <input
                  type="number"
                  min="0"
                  value={form.baggageAllowance.checkin}
                  onChange={e => setForm({ ...form, baggageAllowance: { ...form.baggageAllowance, checkin: e.target.value } })}
                  className={inputClass}
                  placeholder="e.g., 15"
                />
              </div>
              <div>
                <label className={labelClass}>Cabin Baggage (kg)</label>
                <input
                  type="number"
                  min="0"
                  value={form.baggageAllowance.cabin}
                  onChange={e => setForm({ ...form, baggageAllowance: { ...form.baggageAllowance, cabin: e.target.value } })}
                  className={inputClass}
                  placeholder="e.g., 7"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">In-flight Amenities</h3>
            <div className="grid grid-cols-2 gap-4">
              {AMENITIES_LIST.map(amenity => {
                const checked = form.amenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${
                      checked
                        ? 'border-primary-600 bg-primary-50/30 text-primary-900'
                        : 'border-gray-100 hover:border-gray-200 text-gray-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="rounded text-primary-600 focus:ring-primary-500/30 h-4 w-4 border-gray-300"
                    />
                    <span className="text-sm font-medium">{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Pricing */}
      {activeStep === 4 && (
        <div className="space-y-6 max-w-2xl">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Fare Classes</h3>
          <p className="text-xs text-gray-400 mb-4">Set the base fare for each class. Economy is required.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-5 border border-emerald-200 bg-emerald-50/30 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">💺</span>
                <span className="text-sm font-bold text-emerald-800">Economy *</span>
              </div>
              <label className={labelClass}>Price (₹)</label>
              <input
                type="number"
                min="0"
                value={form.price.economy}
                onChange={e => setForm({ ...form, price: { ...form.price, economy: e.target.value } })}
                className={inputClass}
                placeholder="e.g., 149"
              />
            </div>

            <div className="p-5 border border-blue-200 bg-blue-50/30 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🪑</span>
                <span className="text-sm font-bold text-blue-800">Business</span>
              </div>
              <label className={labelClass}>Price (₹)</label>
              <input
                type="number"
                min="0"
                value={form.price.business}
                onChange={e => setForm({ ...form, price: { ...form.price, business: e.target.value } })}
                className={inputClass}
                placeholder="e.g., 450"
              />
            </div>

            <div className="p-5 border border-amber-200 bg-amber-50/30 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">👑</span>
                <span className="text-sm font-bold text-amber-800">First Class</span>
              </div>
              <label className={labelClass}>Price (₹)</label>
              <input
                type="number"
                min="0"
                value={form.price.firstClass}
                onChange={e => setForm({ ...form, price: { ...form.price, firstClass: e.target.value } })}
                className={inputClass}
                placeholder="e.g., 1200"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Review & Submit */}
      {activeStep === 5 && (
        <div className="space-y-6 max-w-2xl bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{form.flightNumber || 'No Flight No.'}</h3>
              <p className="text-sm text-gray-500">{form.airline || 'Unknown Airline'} · {form.flightType}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-primary-600">{formatPrice(form.price.economy || 0, 'INR', 'INR')}</p>
              <p className="text-xs text-gray-400">economy fare</p>
            </div>
          </div>

          {/* Route */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Route</h4>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{form.origin.code || '—'}</p>
                  <p className="text-xs text-gray-500">{form.origin.city}</p>
                </div>
                <div className="flex-1 flex items-center gap-1 px-2">
                  <div className="h-px flex-1 bg-gray-300"></div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  <div className="h-px flex-1 bg-gray-300"></div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{form.destination.code || '—'}</p>
                  <p className="text-xs text-gray-500">{form.destination.city}</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Schedule</h4>
              <div className="text-sm space-y-1">
                <p><span className="text-gray-500">Departure:</span> <span className="font-medium text-gray-900">{form.departureTime ? new Date(form.departureTime).toLocaleString() : '—'}</span></p>
                <p><span className="text-gray-500">Arrival:</span> <span className="font-medium text-gray-900">{form.arrivalTime ? new Date(form.arrivalTime).toLocaleString() : '—'}</span></p>
                <p><span className="text-gray-500">Duration:</span> <span className="font-medium text-gray-900">{formatDuration(form.duration)}</span></p>
              </div>
            </div>
          </div>

          {/* Seats & Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Capacity</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-500">Total Seats:</span> <span className="ml-1 font-bold text-gray-900">{form.totalSeats}</span></div>
                <div><span className="text-gray-500">Available:</span> <span className="ml-1 font-bold text-gray-900">{form.availableSeats}</span></div>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Pricing</h4>
              <div className="flex gap-3">
                {[
                  { label: 'Economy', value: form.price.economy, color: 'bg-emerald-100 text-emerald-700' },
                  { label: 'Business', value: form.price.business, color: 'bg-blue-100 text-blue-700' },
                  { label: 'First', value: form.price.firstClass, color: 'bg-amber-100 text-amber-700' },
                ].map(p => (
                  <div key={p.label} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${p.color}`}>
                    {p.label}: {formatPrice(p.value || 0, 'INR', 'INR')}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Amenities */}
          {form.amenities.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">In-flight Amenities</h4>
              <div className="flex flex-wrap gap-1.5">
                {form.amenities.map(amenity => (
                  <span key={amenity} className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardFormLayout>
  );
};

export default AdminEditFlight;
