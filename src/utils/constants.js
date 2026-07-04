export const ROLES = {
  CUSTOMER: 'customer',
  TRAVEL_AGENCY: 'travel_agency',
  CAR_RENTAL: 'car_rental_partner',
  BUS_OPERATOR: 'bus_operator',
  AIRLINE: 'airline_partner',
  ADMIN: 'admin',
};

export const ROLE_LABELS = {
  customer: 'Customer',
  travel_agency: 'Travel Agency',
  car_rental_partner: 'Car Rental Partner',
  bus_operator: 'Bus Operator',
  airline_partner: 'Airline Partner',
  admin: 'Admin',
};

export const BOOKING_TYPES = ['hotel', 'flight', 'bus', 'car', 'tour'];

export const USD_TO_INR_RATE = 83;

export const convertCurrency = (amount, fromCurrency = 'USD', toCurrency = 'INR') => {
  if (!amount || fromCurrency === toCurrency) return amount;
  if (fromCurrency === 'USD' && toCurrency === 'INR') {
    return amount * USD_TO_INR_RATE;
  }
  if (fromCurrency === 'INR' && toCurrency === 'USD') {
    return amount / USD_TO_INR_RATE;
  }
  return amount;
};

export const formatPrice = (amount, currency = 'INR', fromCurrency = currency) => {
  const value = currency === fromCurrency ? amount : convertCurrency(amount, fromCurrency, currency);
  const locale = currency === 'USD' ? 'en-US' : 'en-IN';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getDashboardPath = (role) => {
  const paths = {
    admin: '/dashboard/admin',
    travel_agency: '/dashboard/agency',
    car_rental_partner: '/dashboard/car-partner',
    bus_operator: '/dashboard/bus-operator',
    airline_partner: '/dashboard/airline',
    customer: '/profile',
  };
  return paths[role] || '/profile';
};

export const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';
