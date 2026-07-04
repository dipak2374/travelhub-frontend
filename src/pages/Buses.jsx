import createListingPage from './ListingPage';
import { busAPI } from '../services';

const Buses = createListingPage(
  'Bus Tickets',
  'Comfortable bus travel across cities',
  busAPI,
  'bus',
  '/buses'
);

export default Buses;
