import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardFormLayout from '../layouts/DashboardFormLayout';
import { busAPI } from '../services';
import { formatPrice } from '../utils/constants';

const STEPS = [
  { label: 'Basic Information', description: 'Bus number, operator, and type' },
  { label: 'Route & Schedule', description: 'Origin, destination, and timings' },
  { label: 'Seating & Features', description: 'Seat layout and amenities' },
  { label: 'Pricing', description: 'Fares and discounts' },
  { label: 'Review & Submit', description: 'Verify all details' },
];

const BUS_AMENITIES = [
  'Air Conditioning', 'USB Charging', 'WiFi', 'Blanket & Pillow',
  'Reading Light', 'Snacks Included', 'Entertainment Screen', 'Washroom',
];

const AdminEditBus = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [activeStep, setActiveStep] = useState(0);

  const [form, setForm] = useState({
    busNumber: '',
    operator: '',
    busType: 'AC',
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    totalSeats: 40,
    availableSeats: 40,
    seatLayout: { rows: 10, columns: 4 },
    amenities: [],
    price: '',
  });

  useEffect(() => {
    if (isEdit && id) {
      (async () => {
        try {
          const { data } = await busAPI.getOne(id);
          const b = data.data || data;
          setForm({
            busNumber: b.busNumber || '',
            operator: b.operator || '',
            busType: b.busType || 'AC',
            origin: b.route?.origin || '',
            destination: b.route?.destination || '',
            departureTime: b.departureTime ? new Date(b.departureTime).toISOString().slice(0, 16) : '',
            arrivalTime: b.arrivalTime ? new Date(b.arrivalTime).toISOString().slice(0, 16) : '',
            totalSeats: b.totalSeats || 40,
            availableSeats: b.availableSeats || 40,
            seatLayout: b.seatLayout || { rows: 10, columns: 4 },
            amenities: b.amenities || [],
            price: b.price || '',
          });
        } catch (err) {
          console.error('Failed to load bus:', err);
          toast.error('Unable to fetch bus details');
        }
      })();
    }
  }, [isEdit, id]);

  const handleAmenityToggle = (amenity) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const validate = (step) => {
    switch (step) {
      case 0:
        if (!form.busNumber.trim()) { toast.error('Bus number is required'); return false; }
        if (!form.operator.trim()) { toast.error('Operator name is required'); return false; }
        return true;
      case 1:
        if (!form.origin.trim()) { toast.error('Origin city is required'); return false; }
        if (!form.destination.trim()) { toast.error('Destination city is required'); return false; }
        if (!form.departureTime) { toast.error('Departure time is required'); return false; }
        if (!form.arrivalTime) { toast.error('Arrival time is required'); return false; }
        if (new Date(form.arrivalTime) <= new Date(form.departureTime)) {
          toast.error('Arrival must be after departure'); return false;
        }
        return true;
      case 2:
        if (!form.totalSeats || Number(form.totalSeats) < 1) { toast.error('Total seats must be at least 1'); return false; }
        return true;
      case 3:
        if (!form.price || Number(form.price) <= 0) { toast.error('Price is required'); return false; }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validate(activeStep)) return;
    setActiveStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleCancel = () => navigate('/dashboard/admin/buses');

  const handleSubmit = async () => {
    for (let i = 0; i < STEPS.length - 1; i++) {
      if (!validate(i)) { setActiveStep(i); return; }
    }
    const payload = {
      busNumber: form.busNumber,
      operator: form.operator,
      busType: form.busType,
      route: {
        origin: form.origin,
        destination: form.destination,
      },
      departureTime: form.departureTime,
      arrivalTime: form.arrivalTime,
      totalSeats: Number(form.totalSeats),
      availableSeats: Number(form.availableSeats),
      seatLayout: form.seatLayout,
      amenities: form.amenities,
      price: Number(form.price),
    };
    try {
      if (isEdit) {
        await busAPI.update(id, payload);
        toast.success('Bus updated successfully!');
      } else {
        await busAPI.create(payload);
        toast.success('Bus added successfully!');
      }
      navigate('/dashboard/admin/buses');
    } catch (error) {
      console.error('Error saving bus:', error);
      toast.error(error?.response?.data?.message || 'Failed to save bus. Please try again.');
    }
  };

  const inputClass = 'w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none';
  const selectClass = `${inputClass} bg-white`;
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

  const getDuration = () => {
    if (!form.departureTime || !form.arrivalTime) return '—';
    const diff = new Date(form.arrivalTime) - new Date(form.departureTime);
    if (diff <= 0) return '—';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  };

  return (
    <DashboardFormLayout
      title={isEdit ? 'Edit Bus' : 'Add Bus'}
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
              <label className={labelClass}>Bus Number *</label>
              <input
                type="text"
                value={form.busNumber}
                onChange={e => setForm({ ...form, busNumber: e.target.value })}
                className={inputClass}
                placeholder="e.g., KA01-1234"
              />
            </div>
            <div>
              <label className={labelClass}>Operator *</label>
              <input
                type="text"
                value={form.operator}
                onChange={e => setForm({ ...form, operator: e.target.value })}
                className={inputClass}
                placeholder="e.g., VRL Travels"
              />
            </div>
            <div>
              <label className={labelClass}>Bus Type</label>
              <select
                value={form.busType}
                onChange={e => setForm({ ...form, busType: e.target.value })}
                className={selectClass}
              >
                <option value="AC">AC</option>
                <option value="Non-AC">Non-AC</option>
                <option value="Sleeper">Sleeper</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: Route & Schedule */}
      {activeStep === 1 && (
        <div className="space-y-8 max-w-2xl">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Route</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Origin City *</label>
                <input
                  type="text"
                  value={form.origin}
                  onChange={e => setForm({ ...form, origin: e.target.value })}
                  className={inputClass}
                  placeholder="e.g., Delhi"
                />
              </div>
              <div>
                <label className={labelClass}>Destination City *</label>
                <input
                  type="text"
                  value={form.destination}
                  onChange={e => setForm({ ...form, destination: e.target.value })}
                  className={inputClass}
                  placeholder="e.g., Jaipur"
                />
              </div>
            </div>
            {form.origin && form.destination && (
              <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
                <span className="font-semibold text-gray-800">{form.origin}</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                <span className="font-semibold text-gray-800">{form.destination}</span>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Schedule</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Departure *</label>
                <input type="datetime-local" value={form.departureTime} onChange={e => setForm({ ...form, departureTime: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Arrival *</label>
                <input type="datetime-local" value={form.arrivalTime} onChange={e => setForm({ ...form, arrivalTime: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Duration</label>
                <div className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-600">{getDuration()}</div>
                <p className="text-xs text-gray-400 mt-1">Auto-calculated</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Seating & Features */}
      {activeStep === 2 && (
        <div className="space-y-8 max-w-2xl">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Seat Configuration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className={labelClass}>Total Seats *</label>
                <input
                  type="number" min="1"
                  value={form.totalSeats}
                  onChange={e => setForm({ ...form, totalSeats: parseInt(e.target.value) || '' })}
                  className={inputClass}
                  placeholder="e.g., 40"
                />
              </div>
              <div>
                <label className={labelClass}>Available Seats</label>
                <input
                  type="number" min="0"
                  value={form.availableSeats}
                  onChange={e => setForm({ ...form, availableSeats: parseInt(e.target.value) || '' })}
                  className={inputClass}
                  placeholder="e.g., 40"
                />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Rows</label>
                <input
                  type="number" min="1"
                  value={form.seatLayout.rows}
                  onChange={e => setForm({ ...form, seatLayout: { ...form.seatLayout, rows: parseInt(e.target.value) || '' } })}
                  className={inputClass}
                  placeholder="e.g., 10"
                />
              </div>
              <div>
                <label className={labelClass}>Columns</label>
                <input
                  type="number" min="1" max="6"
                  value={form.seatLayout.columns}
                  onChange={e => setForm({ ...form, seatLayout: { ...form.seatLayout, columns: parseInt(e.target.value) || '' } })}
                  className={inputClass}
                  placeholder="e.g., 4"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              {BUS_AMENITIES.map(amenity => {
                const checked = form.amenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all text-sm ${
                      checked ? 'border-primary-600 bg-primary-50/30 text-primary-900' : 'border-gray-100 hover:border-gray-200 text-gray-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="rounded text-primary-600 h-4 w-4 border-gray-300"
                    />
                    <span className="font-medium">{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Pricing */}
      {activeStep === 3 && (
        <div className="space-y-6 max-w-2xl">
          <div className="p-6 border border-orange-200 bg-orange-50/30 rounded-xl max-w-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🚌</span>
              <span className="text-sm font-bold text-orange-800">Base Fare *</span>
            </div>
            <label className={labelClass}>Price per Seat (₹)</label>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              className={inputClass}
              placeholder="e.g., 25"
            />
          </div>
          <p className="text-xs text-gray-400">This is the base fare per seat. Discounts or class upgrades can be managed separately.</p>
        </div>
      )}

      {/* STEP 4: Review & Submit */}
      {activeStep === 4 && (
        <div className="space-y-6 max-w-2xl bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{form.busNumber || 'Bus #—'}</h3>
              <p className="text-sm text-gray-500">{form.operator || 'Unknown Operator'} · {form.busType}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-primary-600">{formatPrice(form.price || 0, 'INR', 'INR')}</p>
              <p className="text-xs text-gray-400">per seat</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Route</h4>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold text-gray-800">{form.origin || '—'}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                <span className="font-bold text-gray-800">{form.destination || '—'}</span>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Schedule</h4>
              <div className="text-sm space-y-1">
                <p><span className="text-gray-500">Departure:</span> <span className="font-medium">{form.departureTime ? new Date(form.departureTime).toLocaleString() : '—'}</span></p>
                <p><span className="text-gray-500">Arrival:</span> <span className="font-medium">{form.arrivalTime ? new Date(form.arrivalTime).toLocaleString() : '—'}</span></p>
                <p><span className="text-gray-500">Duration:</span> <span className="font-medium">{getDuration()}</span></p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Seating</h4>
              <p className="text-sm"><span className="text-gray-500">Total:</span> <span className="font-bold">{form.totalSeats}</span></p>
              <p className="text-sm"><span className="text-gray-500">Available:</span> <span className="font-bold">{form.availableSeats}</span></p>
            </div>
            {form.amenities.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Amenities</h4>
                <div className="flex flex-wrap gap-1">
                  {form.amenities.map(a => (
                    <span key={a} className="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs text-gray-700">{a}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardFormLayout>
  );
};

export default AdminEditBus;
