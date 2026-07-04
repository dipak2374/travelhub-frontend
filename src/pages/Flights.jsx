import createListingPage from './ListingPage';
import { flightAPI } from '../services';

const Flights = createListingPage(
  'Flights',
  'Search and book flights to destinations worldwide',
  flightAPI,
  'flight',
  '/flights'
);

export default Flights;
