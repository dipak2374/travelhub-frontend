import createDetailPage from './DetailPage';
import { tourAPI } from '../services';

const TourDetail = createDetailPage(tourAPI, 'tour', 'tour', 'Tour');
export default TourDetail;
