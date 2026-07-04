import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ListingCard from '../components/ListingCard';

const createListingPage = (title, subtitle, api, type, linkPrefix) => {
  const ListingPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const getInitialFilters = () => ({
      origin: searchParams.get('origin') || '',
      destination: searchParams.get('destination') || '',
      city: searchParams.get('city') || '',
      checkIn: searchParams.get('checkIn') || '',
      checkOut: searchParams.get('checkOut') || '',
      passengers: searchParams.get('passengers') || '1',
      search: searchParams.get('search') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
    });

    const [filters, setFilters] = useState(getInitialFilters());

    const buildRequestParams = (values) => {
      const params = {};

      if (type === 'flight') {
        if (values.origin) params.origin = values.origin;
        if (values.destination) params.destination = values.destination;
        if (values.checkIn) params.checkIn = values.checkIn;
        if (values.passengers) params.passengers = values.passengers;
      } else if (type === 'hotel' || type === 'car') {
        if (values.city) params.city = values.city;
        if (values.checkIn) params.checkIn = values.checkIn;
        if (values.checkOut) params.checkOut = values.checkOut;
        if (values.passengers) params.passengers = values.passengers;
      } else {
        if (values.search) params.search = values.search;
        if (values.city) params.city = values.city;
        if (values.minPrice) params.minPrice = values.minPrice;
        if (values.maxPrice) params.maxPrice = values.maxPrice;
      }

      return params;
    };

    const fetchItems = async (currentFilters = filters) => {
      setLoading(true);
      try {
        const params = buildRequestParams(currentFilters);
        const { data } = await api.getAll(params);
        setItems(data.data);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      const initialFilters = getInitialFilters();
      setFilters(initialFilters);
      fetchItems(initialFilters);
    }, [searchParams, type]);

    const handleSearch = (e) => {
      e.preventDefault();
      const params = buildRequestParams(filters);
      const queryString = new URLSearchParams(params).toString();
      navigate(`${linkPrefix}?${queryString}`);
      fetchItems(filters);
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="section-title">{title}</h1>
          <p className="text-gray-500 mt-2">{subtitle}</p>
        </div>

        <form onSubmit={handleSearch} className="card p-4 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {type === 'flight' ? (
              <>
                <input
                  type="text"
                  placeholder="Origin"
                  className="input-field"
                  value={filters.origin}
                  onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Destination"
                  className="input-field"
                  value={filters.destination}
                  onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                />
                <input
                  type="date"
                  placeholder="Departure"
                  className="input-field"
                  value={filters.checkIn}
                  onChange={(e) => setFilters({ ...filters, checkIn: e.target.value })}
                />
                <input
                  type="number"
                  min="1"
                  placeholder="Passengers"
                  className="input-field"
                  value={filters.passengers}
                  onChange={(e) => setFilters({ ...filters, passengers: Math.max(1, parseInt(e.target.value, 10) || 1).toString() })}
                />
              </>
            ) : type === 'hotel' || type === 'car' ? (
              <>
                <input
                  type="text"
                  placeholder="City"
                  className="input-field"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                />
                <input
                  type="date"
                  placeholder="Check-in"
                  className="input-field"
                  value={filters.checkIn}
                  onChange={(e) => setFilters({ ...filters, checkIn: e.target.value })}
                />
                <input
                  type="date"
                  placeholder="Check-out"
                  className="input-field"
                  value={filters.checkOut}
                  onChange={(e) => setFilters({ ...filters, checkOut: e.target.value })}
                />
                <input
                  type="number"
                  min="1"
                  placeholder="Passengers"
                  className="input-field"
                  value={filters.passengers}
                  onChange={(e) => setFilters({ ...filters, passengers: Math.max(1, parseInt(e.target.value, 10) || 1).toString() })}
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Search..."
                  className="input-field"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="City / Destination"
                  className="input-field"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Min Price"
                  className="input-field"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  className="input-field"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                />
              </>
            )}
            <button type="submit" className="btn-primary">Search</button>
          </div>
        </form>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card h-72 animate-pulse bg-gray-100 dark:bg-gray-800" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No results found</p>
            <p className="text-sm mt-2">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ListingCard key={item._id} item={item} type={type} linkPrefix={linkPrefix} />
            ))}
          </div>
        )}
      </div>
    );
  };
  return ListingPage;
};

export default createListingPage;
