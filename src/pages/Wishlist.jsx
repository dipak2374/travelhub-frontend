import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { wishlistAPI } from '../services';
import ListingCard from '../components/ListingCard';

const Wishlist = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    wishlistAPI.get().then((r) => setItems(r.data.data)).catch(() => {});
  }, []);

  const typeMap = { Hotel: 'hotel', Flight: 'flight', Bus: 'bus', Car: 'car', Tour: 'tour' };
  const prefixMap = { Hotel: '/hotels', Flight: '/flights', Bus: '/buses', Car: '/cars', Tour: '/tours' };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="section-title mb-8">My Wishlist</h1>
      {items.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <p>Your wishlist is empty</p>
          <Link to="/hotels" className="btn-primary inline-block mt-4 text-sm">Explore Hotels</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ListingCard
              key={item._id}
              item={item}
              type={typeMap[item.itemModel] || 'hotel'}
              linkPrefix={prefixMap[item.itemModel] || '/hotels'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
