import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardFormLayout from '../layouts/DashboardFormLayout';
import { tourAPI } from '../services';
import { formatPrice } from '../utils/constants';

const STEPS = [
  { label: 'Basic Information', description: 'Tour title, destination, and duration' },
  { label: 'Itinerary', description: 'Day-by-day plan' },
  { label: 'Inclusions & Exclusions', description: 'What is covered' },
  { label: 'Pricing & Availability', description: 'Cost and group size' },
  { label: 'Images', description: 'Tour gallery' },
  { label: 'Review & Submit', description: 'Verify all details' },
];

const AdminEditTour = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [activeStep, setActiveStep] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    destination: '',
    duration: 3,
    durationUnit: 'days',
    itinerary: [{ day: 1, title: '', description: '' }],
    inclusions: [''],
    exclusions: [''],
    price: '',
    maxGroupSize: 20,
    startDates: [''],
    images: [],
  });

  useEffect(() => {
    if (isEdit && id) {
      (async () => {
        try {
          const { data } = await tourAPI.getOne(id);
          const t = data.data || data;
          setForm({
            title: t.title || '',
            description: t.description || '',
            destination: t.destination || '',
            duration: t.duration || 3,
            durationUnit: t.durationUnit || 'days',
            itinerary: t.itinerary?.length > 0 ? t.itinerary : [{ day: 1, title: '', description: '' }],
            inclusions: t.inclusions?.length > 0 ? t.inclusions : [''],
            exclusions: t.exclusions?.length > 0 ? t.exclusions : [''],
            price: t.price || '',
            maxGroupSize: t.maxGroupSize || 20,
            startDates: t.startDates?.length > 0 ? t.startDates.map(d => new Date(d).toISOString().slice(0, 10)) : [''],
            images: t.images || [],
          });
        } catch (err) {
          console.error('Failed to load tour:', err);
          toast.error('Unable to fetch tour details');
        }
      })();
    }
  }, [isEdit, id]);

  // Sync itinerary length with duration
  useEffect(() => {
    const n = Number(form.duration) || 1;
    if (form.durationUnit === 'days') {
      setForm(prev => {
        if (prev.itinerary.length === n) return prev;
        const newItin = Array.from({ length: n }, (_, i) => prev.itinerary[i] || { day: i + 1, title: '', description: '' });
        return { ...prev, itinerary: newItin };
      });
    }
  }, [form.duration, form.durationUnit]);

  const validate = (step) => {
    switch (step) {
      case 0:
        if (!form.title.trim()) { toast.error('Tour title is required'); return false; }
        if (!form.description.trim()) { toast.error('Description is required'); return false; }
        if (form.description.trim().length < 20) { toast.error('Description must be at least 20 characters'); return false; }
        if (!form.destination.trim()) { toast.error('Destination is required'); return false; }
        if (!form.duration || form.duration < 1) { toast.error('Duration must be at least 1'); return false; }
        return true;
      case 1:
        const incomplete = form.itinerary.some(d => !d.title.trim());
        if (incomplete) { toast.error('All itinerary days need a title'); return false; }
        return true;
      case 2:
        if (form.inclusions.filter(s => s.trim()).length === 0) { toast.error('Add at least one inclusion'); return false; }
        return true;
      case 3:
        if (!form.price || Number(form.price) <= 0) { toast.error('Price is required'); return false; }
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

  const handleCancel = () => navigate('/dashboard/admin/tours');

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

  const handleSubmit = async () => {
    for (let i = 0; i < STEPS.length - 1; i++) {
      if (!validate(i)) { setActiveStep(i); return; }
    }
    const payload = {
      title: form.title,
      description: form.description,
      destination: form.destination,
      duration: Number(form.duration),
      durationUnit: form.durationUnit,
      itinerary: form.itinerary.map((d, idx) => ({ day: idx + 1, title: d.title, description: d.description })),
      inclusions: form.inclusions.filter(s => s.trim()),
      exclusions: form.exclusions.filter(s => s.trim()),
      price: Number(form.price),
      maxGroupSize: Number(form.maxGroupSize),
      startDates: form.startDates.filter(d => d).map(d => new Date(d)),
      images: form.images,
    };
    try {
      if (isEdit) {
        await tourAPI.update(id, payload);
        toast.success('Tour updated successfully!');
      } else {
        await tourAPI.create(payload);
        toast.success('Tour added successfully!');
      }
      navigate('/dashboard/admin/tours');
    } catch (error) {
      console.error('Error saving tour:', error);
      toast.error(error?.response?.data?.message || 'Failed to save tour. Please try again.');
    }
  };

  const inputClass = 'w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none';
  const selectClass = `${inputClass} bg-white`;
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

  const updateList = (field, index, value) => {
    setForm(prev => {
      const list = [...prev[field]];
      list[index] = value;
      return { ...prev, [field]: list };
    });
  };

  const addListItem = (field) => setForm(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  const removeListItem = (field, index) => setForm(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));

  return (
    <DashboardFormLayout
      title={isEdit ? 'Edit Tour' : 'Add Tour'}
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
            <div className="sm:col-span-2">
              <label className={labelClass}>Tour Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className={inputClass}
                placeholder="e.g., Bali Adventure — 7 Days"
              />
            </div>
            <div>
              <label className={labelClass}>Destination *</label>
              <input
                type="text"
                value={form.destination}
                onChange={e => setForm({ ...form, destination: e.target.value })}
                className={inputClass}
                placeholder="e.g., Bali, Indonesia"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Duration *</label>
                <input
                  type="number" min="1"
                  value={form.duration}
                  onChange={e => setForm({ ...form, duration: parseInt(e.target.value) || 1 })}
                  className={inputClass}
                  placeholder="e.g., 7"
                />
              </div>
              <div>
                <label className={labelClass}>Unit</label>
                <select value={form.durationUnit} onChange={e => setForm({ ...form, durationUnit: e.target.value })} className={selectClass}>
                  <option value="days">Days</option>
                  <option value="hours">Hours</option>
                </select>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Description *</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={4}
                className={`${inputClass} resize-none`}
                placeholder="Describe this tour package in detail..."
              />
              <p className="text-xs text-gray-400 mt-1">{form.description.length} / 20+ characters required</p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: Itinerary */}
      {activeStep === 1 && (
        <div className="space-y-5 max-w-2xl">
          <p className="text-sm text-gray-500">
            {form.durationUnit === 'days'
              ? `Add details for each of the ${form.duration} days`
              : 'Add the tour schedule'}
          </p>
          {form.itinerary.map((day, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={day.title}
                  onChange={e => {
                    const itin = [...form.itinerary];
                    itin[idx] = { ...itin[idx], title: e.target.value };
                    setForm({ ...form, itinerary: itin });
                  }}
                  className={inputClass}
                  placeholder={`Day ${idx + 1} title (e.g., Arrival & Beach Time)`}
                />
              </div>
              <textarea
                value={day.description}
                onChange={e => {
                  const itin = [...form.itinerary];
                  itin[idx] = { ...itin[idx], description: e.target.value };
                  setForm({ ...form, itinerary: itin });
                }}
                rows={2}
                className={`${inputClass} resize-none`}
                placeholder="What will guests do on this day?"
              />
            </div>
          ))}
          {form.durationUnit === 'hours' && (
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: '', description: '' }] }))}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              + Add Activity
            </button>
          )}
        </div>
      )}

      {/* STEP 2: Inclusions & Exclusions */}
      {activeStep === 2 && (
        <div className="space-y-8 max-w-2xl">
          {/* Inclusions */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">✓</span>
              Inclusions *
            </h3>
            <div className="space-y-2">
              {form.inclusions.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={e => updateList('inclusions', idx, e.target.value)}
                    className={inputClass}
                    placeholder="e.g., Airport transfer"
                  />
                  {form.inclusions.length > 1 && (
                    <button type="button" onClick={() => removeListItem('inclusions', idx)} className="text-rose-400 hover:text-rose-600 px-2">×</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addListItem('inclusions')} className="text-sm text-primary-600 hover:text-primary-700 font-medium mt-1">
                + Add inclusion
              </button>
            </div>
          </div>

          {/* Exclusions */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs">✕</span>
              Exclusions
            </h3>
            <div className="space-y-2">
              {form.exclusions.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={e => updateList('exclusions', idx, e.target.value)}
                    className={inputClass}
                    placeholder="e.g., Personal expenses"
                  />
                  {form.exclusions.length > 1 && (
                    <button type="button" onClick={() => removeListItem('exclusions', idx)} className="text-rose-400 hover:text-rose-600 px-2">×</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addListItem('exclusions')} className="text-sm text-primary-600 hover:text-primary-700 font-medium mt-1">
                + Add exclusion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Pricing & Availability */}
      {activeStep === 3 && (
        <div className="space-y-8 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-5 border border-emerald-200 bg-emerald-50/30 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">💰</span>
                <span className="text-sm font-bold text-emerald-800">Price Per Person *</span>
              </div>
              <label className={labelClass}>Amount (₹)</label>
              <input
                type="number" min="0"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                className={inputClass}
                placeholder="e.g., 599"
              />
            </div>
            <div className="p-5 border border-blue-200 bg-blue-50/30 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">👥</span>
                <span className="text-sm font-bold text-blue-800">Max Group Size</span>
              </div>
              <label className={labelClass}>Persons</label>
              <input
                type="number" min="1"
                value={form.maxGroupSize}
                onChange={e => setForm({ ...form, maxGroupSize: parseInt(e.target.value) || 20 })}
                className={inputClass}
                placeholder="e.g., 20"
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Available Start Dates</h3>
            <div className="space-y-2">
              {form.startDates.map((date, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="date"
                    value={date}
                    onChange={e => {
                      const dates = [...form.startDates];
                      dates[idx] = e.target.value;
                      setForm({ ...form, startDates: dates });
                    }}
                    className={inputClass}
                    min={new Date().toISOString().slice(0, 10)}
                  />
                  {form.startDates.length > 1 && (
                    <button type="button" onClick={() => setForm(prev => ({ ...prev, startDates: prev.startDates.filter((_, i) => i !== idx) }))} className="text-rose-400 hover:text-rose-600 px-2">×</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setForm(prev => ({ ...prev, startDates: [...prev.startDates, ''] }))} className="text-sm text-primary-600 hover:text-primary-700 font-medium mt-1">
                + Add date
              </button>
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
            <button type="button" onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }} className="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-medium hover:bg-primary-700">
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
                      className="absolute top-2 right-2 bg-red-600/90 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-700 shadow-md opacity-0 group-hover:opacity-100 text-base"
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
              <h3 className="text-lg font-bold text-gray-900">{form.title || 'Unnamed Tour'}</h3>
              <p className="text-sm text-gray-500">{form.destination} · {form.duration} {form.durationUnit}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-primary-600">{formatPrice(form.price || 0, 'INR', 'INR')}</p>
              <p className="text-xs text-gray-400">per person</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</h4>
              <p className="text-sm text-gray-600 line-clamp-4">{form.description || 'No description.'}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Itinerary</h4>
              <div className="space-y-1">
                {form.itinerary.slice(0, 4).map((day, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-xs font-bold text-primary-600 w-10 flex-shrink-0">Day {idx + 1}</span>
                    <span className="text-gray-700 truncate">{day.title || '—'}</span>
                  </div>
                ))}
                {form.itinerary.length > 4 && <p className="text-xs text-gray-400">+{form.itinerary.length - 4} more days</p>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">✓ Inclusions</h4>
              <ul className="space-y-1">
                {form.inclusions.filter(s => s.trim()).map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-1.5"><span className="text-emerald-500 mt-0.5">•</span>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">✕ Exclusions</h4>
              <ul className="space-y-1">
                {form.exclusions.filter(s => s.trim()).map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-1.5"><span className="text-rose-400 mt-0.5">•</span>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-sm">
            <div><span className="text-gray-500">Max Group Size:</span> <span className="font-bold">{form.maxGroupSize} persons</span></div>
            <div><span className="text-gray-500">Start Dates:</span> <span className="font-medium">{form.startDates.filter(d => d).length}</span></div>
          </div>

          {form.images.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Gallery Preview</h4>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {form.images.map((img, idx) => (
                  <img key={idx} src={img} alt={`Tour ${idx + 1}`} className="w-24 h-16 object-cover rounded-lg border border-gray-100 flex-shrink-0" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardFormLayout>
  );
};

export default AdminEditTour;
