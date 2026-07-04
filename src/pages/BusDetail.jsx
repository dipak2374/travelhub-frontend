import createDetailPage from './DetailPage';
import { busAPI } from '../services';

const BusDetail = createDetailPage(busAPI, 'bus', 'bus', 'Bus');
export default BusDetail;
