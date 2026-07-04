import createListingPage from './ListingPage';
import { tourAPI } from '../services';

const Tours = createListingPage(
  'Tour Packages',
  'Curated travel experiences and adventures',
  tourAPI,
  'tour',
  '/tours'
);

export default Tours;
