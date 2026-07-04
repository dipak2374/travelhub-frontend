const GoogleMapPlaceholder = ({ location, height = '300px', className = '' }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const lat = location?.lat || location?.coordinates?.lat || 40.7128;
  const lng = location?.lng || location?.coordinates?.lng || -74.006;
  const label = location?.city || location?.address || 'Location';

  if (apiKey && apiKey !== 'your_google_maps_api_key') {
    const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=14`;
    return (
      <div className={`rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`} style={{ height }}>
        <iframe
          title={`Map of ${label}`}
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center justify-center ${className}`}
      style={{ height }}
    >
      <div className="text-4xl mb-3">📍</div>
      <p className="font-medium text-gray-700 dark:text-gray-300">{label}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {lat.toFixed(4)}, {lng.toFixed(4)}
      </p>
      <p className="text-xs text-gray-400 mt-3 px-4 text-center">
        Set VITE_GOOGLE_MAPS_API_KEY in .env to enable live maps
      </p>
    </div>
  );
};

export default GoogleMapPlaceholder;
