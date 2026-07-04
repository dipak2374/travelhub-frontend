import createDetailPage from './DetailPage';
import { flightAPI } from '../services';

const FlightDetail = createDetailPage(flightAPI, 'flight', 'flight', 'Flight');
export default FlightDetail;
