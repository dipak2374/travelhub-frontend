import createListingPage from './ListingPage';
import { hotelAPI } from '../services';

const Hotels = createListingPage(
  'Hotels & Resorts',
  'Find the perfect stay for your next adventure',
  hotelAPI,
  'hotel',
  '/hotels'
);

export default Hotels;
