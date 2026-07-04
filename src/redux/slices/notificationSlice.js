import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationAPI } from '../../services';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async () => {
  const { data } = await notificationAPI.getAll();
  return data;
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    unreadCount: 0,
    loading: false,
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },
    markRead: (state, action) => {
      const item = state.items.find((n) => n._id === action.payload);
      if (item && !item.isRead) {
        item.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => { state.loading = true; })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.unreadCount = action.payload.unreadCount;
      });
  },
});

export const { addNotification, markRead } = notificationSlice.actions;
export default notificationSlice.reducer;
