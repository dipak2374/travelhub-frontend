import createDetailPage from './DetailPage';
import { hotelAPI } from '../services';

const HotelDetail = createDetailPage(hotelAPI, 'hotel', 'hotel', 'Hotel');
export default HotelDetail;
