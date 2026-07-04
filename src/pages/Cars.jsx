import createListingPage from './ListingPage';
import { carAPI } from '../services';

const Cars = createListingPage(
  'Car Rentals',
  'Rent the perfect vehicle for your journey',
  carAPI,
  'car',
  '/cars'
);

export default Cars;
