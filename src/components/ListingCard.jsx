import { FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { formatPrice, PLACEHOLDER_IMAGE } from '../utils/constants';

const ListingCard = ({ item, type, linkPrefix }) => {
  const getTitle = () => {
    if (type === 'hotel') return item.name;
    if (type === 'flight') return `${item.origin?.code} → ${item.destination?.code}`;
    if (type === 'bus') return `${item.operator} - ${item.busNumber}`;
    if (type === 'car') return `${item.make} ${item.model}`;
    if (type === 'tour') return item.title;
    return 'Listing';
  };

  const getPrice = () => {
    if (type === 'hotel') return formatPrice(item.pricePerNight) + '/night';
    if (type === 'flight') return formatPrice(item.price?.economy || 0);
    if (type === 'car') return formatPrice(item.pricePerDay) + '/day';
    return formatPrice(item.price || 0);
  };

  const getImage = () => {
    if (item.images?.length) return item.images[0];
    return PLACEHOLDER_IMAGE;
  };

  const getSubtitle = () => {
    if (type === 'hotel') return `${item.location?.city}, ${item.location?.country}`;
    if (type === 'flight') return item.airline;
    if (type === 'bus') return item.busType;
    if (type === 'car') return `${item.category} · ${item.location?.city}`;
    if (type === 'tour') return `${item.destination} · ${item.duration} days`;
    return '';
  };

  return (
    <Link to={`${linkPrefix}/${item._id}`} className="card group block">
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImage()}
          alt={getTitle()}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {item.averageRating > 0 && (
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-medium">
            <FiStar className="text-yellow-400 fill-yellow-400" size={14} />
            {item.averageRating}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors truncate">
          {getTitle()}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{getSubtitle()}</p>
        {type === 'hotel' && item.amenities?.includes('Bar & Lounge') && (
          <div className="mt-3">
            <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-1 text-xs font-semibold text-primary-700">
              Bar & Lounge
            </span>
          </div>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-primary-600">{getPrice()}</span>
          {type === 'hotel' && (
            <span className="text-xs text-gray-400">{'★'.repeat(item.starRating || 3)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
