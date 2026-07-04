import { createSlice } from '@reduxjs/toolkit';

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    cart: null,
    currentBooking: null,
    searchParams: {},
  },
  reducers: {
    setSearchParams: (state, action) => {
      state.searchParams = action.payload;
    },
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload;
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    clearCart: (state) => {
      state.cart = null;
      state.currentBooking = null;
    },
  },
});

export const { setSearchParams, setCurrentBooking, setCart, clearCart } = bookingSlice.actions;
export default bookingSlice.reducer;
