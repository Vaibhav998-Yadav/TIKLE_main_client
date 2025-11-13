import { configureStore } from '@reduxjs/toolkit';
import bdcMetaReducer from './slices/bdcMetaSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    bdcMeta: bdcMetaReducer,
    notifications: notificationsReducer ,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
