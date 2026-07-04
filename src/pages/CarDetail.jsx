import createDetailPage from './DetailPage';
import { carAPI } from '../services';

const CarDetail = createDetailPage(carAPI, 'car', 'car', 'Car');
export default CarDetail;
