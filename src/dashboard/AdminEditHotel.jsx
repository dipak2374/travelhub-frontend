import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardFormLayout from '../layouts/DashboardFormLayout';
import { hotelAPI } from '../services';
import { formatPrice } from '../utils/constants';

const STEPS = [
  { label: 'Basic Information', description: 'Name, category, and star rating' },
  { label: 'Location & Contact', description: 'Address and map details' },
  { label: 'Amenities & Policies', description: 'Facilities and rules' },
  { label: 'Rooms & Pricing', description: 'Room types and base prices' },
  { label: 'Images', description: 'Gallery and featured image' },
  { label: 'Review & Submit', description: 'Verify all details' },
];

const PRESET_AMENITIES = [
  'Free WiFi',
  'Swimming Pool',
  'Fitness Center',
  'Spa',
  'Restaurant',
  'Bar & Lounge',
  'Room Service',
  'Free Parking',
  'Air Conditioning',
  'Airport Shuttle',
];

const AdminEditHotel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [activeStep, setActiveStep] = useState(0);

  const [form, setForm] = useState({
    name: isEdit ? 'Sea View Resort' : '',
    hotelType: 'Resort',
    starRating: 4,
    description: isEdit ? 'A beautiful sea view resort with all modern amenities.' : '',
    tags: isEdit ? ['Sea View', 'Beach', 'Luxury'] : [],
    location: {
      address: isEdit ? '123 Beach Road, Candolim' : '',
      city: isEdit ? 'Goa' : '',
      country: isEdit ? 'India' : '',
    },
    amenities: isEdit ? ['Free WiFi', 'Swimming Pool', 'Free Parking'] : [],
    pricePerNight: isEdit ? 120 : '',
    totalRooms: isEdit ? 50 : 10,
    availableRooms: isEdit ? 45 : 10,
    images: isEdit
      ? [
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        ]
      : [],
  });
  // Load hotel data when editing
  useEffect(() => {
    if (isEdit && id) {
      (async () => {
        try {
          const { data } = await hotelAPI.getOne(id);
          const h = data.data || data;
          // Populate form with received data (adjust fields as needed)
          setForm({
            name: h.name || '',
            hotelType: h.hotelType || 'Resort',
            starRating: h.starRating || 1,
            description: h.description || '',
            tags: h.tags || [],
            location: {
              address: h.location?.address || '',
              city: h.location?.city || '',
              country: h.location?.country || '',
            },
            amenities: h.amenities || [],
            pricePerNight: h.pricePerNight || '',
            totalRooms: h.totalRooms || 10,
            availableRooms: h.availableRooms || 10,
            images: h.images || [],
          });
        } catch (err) {
          console.error('Failed to load hotel data:', err);
          toast.error('Unable to fetch hotel details');
        }
      })();
    }
  }, [isEdit, id]);

  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleAddTag = () => {
    const trimmed = newTagInput.trim();
    if (trimmed && !form.tags.includes(trimmed)) {
      setForm((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmed],
      }));
    }
    setNewTagInput('');
    setIsAddingTag(false);
  };

  const handleRemoveTag = (tagToRemove) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const readFilesAsDataURLs = (files) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setForm((prev) => {
          if (prev.images.includes(dataUrl)) return prev;
          return { ...prev, images: [...prev.images, dataUrl] };
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileInputChange = (e) => {
    readFilesAsDataURLs(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    readFilesAsDataURLs(e.dataTransfer.files);
  };

  const handleRemoveImage = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setForm((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const validate = (step) => {
    switch (step) {
      case 0: // Basic Information
        if (!form.name.trim()) {
          toast.error('Hotel name is required');
          return false;
        }
        if (!form.description.trim()) {
          toast.error('Description is required');
          return false;
        }
        if (form.description.trim().length < 20) {
          toast.error('Description must be at least 20 characters');
          return false;
        }
        return true;

      case 1: // Location & Contact
        if (!form.location.address.trim()) {
          toast.error('Street address is required');
          return false;
        }
        if (!form.location.city.trim()) {
          toast.error('City is required');
          return false;
        }
        if (!form.location.country.trim()) {
          toast.error('Country is required');
          return false;
        }
        return true;

      case 2: // Amenities
        if (form.amenities.length === 0) {
          toast.error('Please select at least one amenity');
          return false;
        }
        return true;

      case 3: // Rooms & Pricing
        if (!form.pricePerNight || Number(form.pricePerNight) <= 0) {
          toast.error('Price per night must be greater than 0');
          return false;
        }
        if (!form.totalRooms || Number(form.totalRooms) < 1) {
          toast.error('Total rooms must be at least 1');
          return false;
        }
        if (Number(form.availableRooms) > Number(form.totalRooms)) {
          toast.error('Available rooms cannot exceed total rooms');
          return false;
        }
        return true;

      case 4: // Images
        if (form.images.length === 0) {
          toast.error('Please upload at least one image');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validate(activeStep)) return;
    setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleCancel = () => navigate('/dashboard/admin/hotels');

  const handleSubmit = async () => {
    // Validate all steps before submitting
    for (let i = 0; i < STEPS.length - 1; i++) {
      if (!validate(i)) {
        setActiveStep(i);
        return;
      }
    }
    // Handle create or update based on mode
    try {
      if (isEdit) {
        await hotelAPI.update(id, form);
        toast.success('Hotel updated successfully!');
      } else {
        await hotelAPI.create(form);
        toast.success('Hotel added successfully!');
      }
    } catch (error) {
      console.error('Error saving hotel:', error);
      toast.error(error?.response?.data?.message || 'Failed to save hotel. Please try again.');
    }
    navigate('/dashboard/admin/hotels');
  };

  return (
    <DashboardFormLayout
      title={isEdit ? 'Edit Hotel' : 'Add Hotel'}
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Hotel Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                placeholder="e.g. Sea View Resort"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Hotel Type *</label>
              <select
                value={form.hotelType}
                onChange={(e) => setForm({ ...form, hotelType: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white outline-none"
              >
                <option>Hotel</option>
                <option>Resort</option>
                <option>Villa</option>
                <option>Camp</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Star Rating *</label>
            <select
              value={form.starRating}
              onChange={(e) => setForm({ ...form, starRating: parseInt(e.target.value) })}
              className="w-32 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white outline-none"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} Star
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none outline-none"
              placeholder="Describe the hotel details..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}

              {isAddingTag ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      } else if (e.key === 'Escape') {
                        setIsAddingTag(false);
                        setNewTagInput('');
                      }
                    }}
                    placeholder="New tag..."
                    autoFocus
                    className="px-2 py-1 text-xs border border-gray-300 rounded-full focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none w-24"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="text-xs px-2 py-0.5 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors font-medium"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingTag(false);
                      setNewTagInput('');
                    }}
                    className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingTag(true)}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-dashed border-gray-300 text-primary-600 hover:bg-gray-50 transition-colors focus:outline-none"
                >
                  + Add Tag
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: Location & Contact */}
      {activeStep === 1 && (
        <div className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address *</label>
            <input
              type="text"
              value={form.location.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  location: { ...form.location, address: e.target.value },
                })
              }
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
              placeholder="e.g. 123 Beach Road, Candolim"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
              <input
                type="text"
                value={form.location.city}
                onChange={(e) =>
                  setForm({
                    ...form,
                    location: { ...form.location, city: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                placeholder="e.g. Goa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Country *</label>
              <input
                type="text"
                value={form.location.country}
                onChange={(e) =>
                  setForm({
                    ...form,
                    location: { ...form.location, country: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                placeholder="e.g. India"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Amenities & Policies */}
      {activeStep === 2 && (
        <div className="space-y-6 max-w-2xl">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Select Hotel Amenities</h3>
            <div className="grid grid-cols-2 gap-4">
              {PRESET_AMENITIES.map((amenity) => {
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
                      className="rounded text-primary-600 focus:ring-primary-500/30 h-4.5 w-4.5 border-gray-300"
                    />
                    <span className="text-sm font-medium">{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Rooms & Pricing */}
      {activeStep === 3 && (
        <div className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price Per Night (₹) *</label>
              <input
                type="number"
                min="0"
                value={form.pricePerNight}
                onChange={(e) => setForm({ ...form, pricePerNight: parseFloat(e.target.value) || '' })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                placeholder="e.g. 120"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Rooms</label>
              <input
                type="number"
                min="1"
                value={form.totalRooms}
                onChange={(e) => setForm({ ...form, totalRooms: parseInt(e.target.value) || 10 })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                placeholder="e.g. 50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Available Rooms</label>
              <input
                type="number"
                min="0"
                value={form.availableRooms}
                onChange={(e) => setForm({ ...form, availableRooms: parseInt(e.target.value) || 10 })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                placeholder="e.g. 45"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Images */}
      {activeStep === 4 && (
        <div className="space-y-6 max-w-2xl">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileInputChange}
          />

          {/* Drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl h-44 cursor-pointer transition-all ${
              isDragOver
                ? 'border-primary-500 bg-primary-50/40 scale-[1.01]'
                : 'border-gray-200 hover:border-primary-400 hover:bg-gray-50/50'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5V18a2 2 0 002 2h14a2 2 0 002-2v-1.5M12 3v12m0-12L8.5 6.5M12 3l3.5 3.5" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700">Click to upload or drag &amp; drop</p>
              <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP up to 10MB each</p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              className="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-medium hover:bg-primary-700 transition-colors"
            >
              Browse Files
            </button>
          </div>

          {/* Gallery Preview */}
          {form.images.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">Gallery ({form.images.length} image{form.images.length !== 1 ? 's' : ''})</h4>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, images: [] }))}
                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Remove all
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {form.images.map((imgSrc, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-100 aspect-video bg-gray-50">
                    <img
                      src={imgSrc}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 bg-red-600/90 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-700 transition-all shadow-md focus:outline-none text-base leading-none opacity-0 group-hover:opacity-100"
                      title="Remove"
                    >
                      ×
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-2 left-2 bg-primary-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        Cover
                      </span>
                    )}
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
              <h3 className="text-lg font-bold text-gray-900">{form.name || 'Unnamed Hotel'}</h3>
              <p className="text-sm text-gray-500">
                {form.hotelType} · {form.starRating} Star
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-primary-600">{formatPrice(form.pricePerNight || 0, 'INR', 'INR')}</p>
              <p className="text-xs text-gray-400">per night</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</h4>
              <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed">{form.description || 'No description provided.'}</p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Location</h4>
              <p className="text-sm text-gray-700 font-medium">{form.location.address || 'No address provided'}</p>
              <p className="text-sm text-gray-500">
                {form.location.city ? `${form.location.city}, ` : ''}
                {form.location.country || ''}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Amenities</h4>
              {form.amenities.length === 0 ? (
                <p className="text-sm text-gray-500">No amenities selected.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {form.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Room Stats</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Total Rooms:</span>
                  <span className="ml-1.5 font-bold text-gray-900">{form.totalRooms}</span>
                </div>
                <div>
                  <span className="text-gray-500">Available:</span>
                  <span className="ml-1.5 font-bold text-gray-900">{form.availableRooms}</span>
                </div>
              </div>
            </div>
          </div>

          {form.images.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Gallery Image Preview</h4>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {form.images.map((imgUrl, idx) => (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt={`Preview ${idx + 1}`}
                    className="w-24 h-16 object-cover rounded-lg border border-gray-100 flex-shrink-0 shadow-sm"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardFormLayout>
  );
};

export default AdminEditHotel;
