import { FiSearch, FiMapPin, FiCalendar } from 'react-icons/fi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const tabs = [
  { id: 'hotels', label: 'Hotels', icon: '🏨' },
  { id: 'flights', label: 'Flights', icon: '✈️' },
  { id: 'buses', label: 'Buses', icon: '🚌' },
  { id: 'cars', label: 'Cars', icon: '🚗' },
  { id: 'tours', label: 'Tours', icon: '🗺️' },
];

const SearchBox = () => {
  const [activeTab, setActiveTab] = useState('hotels');
  const [search, setSearch] = useState({ destination: '', checkIn: '', checkOut: '', passengers: 1 });
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.destination) params.set('city', search.destination);
    if (search.checkIn) params.set('checkIn', search.checkIn);
    if (search.checkOut) params.set('checkOut', search.checkOut);
    navigate(`/${activeTab}?${params.toString()}`);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden max-w-4xl mx-auto" id="search-box">
      <div className="flex overflow-x-auto border-b border-gray-100 dark:border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50 dark:bg-primary-900/20'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            id={`search-tab-${tab.id}`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch} className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === 'flights' ? 'From / To' : 'Destination'}
              className="input-field pl-10"
              value={search.destination}
              onChange={(e) => setSearch({ ...search, destination: e.target.value })}
              id="search-destination"
            />
          </div>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              className="input-field pl-10"
              value={search.checkIn}
              onChange={(e) => setSearch({ ...search, checkIn: e.target.value })}
              id="search-checkin"
            />
          </div>
          {(activeTab === 'hotels' || activeTab === 'cars') && (
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                className="input-field pl-10"
                value={search.checkOut}
                onChange={(e) => setSearch({ ...search, checkOut: e.target.value })}
                id="search-checkout"
              />
            </div>
          )}
          <button type="submit" className="btn-primary flex items-center justify-center gap-2" id="search-submit">
            <FiSearch />
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBox;
