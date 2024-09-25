import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authSlice from './authSlice';
import dropdownSlice from './dropdownSlice';
import { combineReducers } from 'redux';
import customerSlice from './customerSlice';

const rootReducer = combineReducers({
  auth: authSlice,
  dropDown: dropdownSlice,
  customer: customerSlice,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['customer', 'dropDown'], // Specify which reducers to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefeaultMiddleware) =>
    getDefeaultMiddleware({
      serializableCheck: false,
    }),
  // middleware:[]
  // middleware: getDefeaultMiddleware({
  //   serializableCheck: false
  // })
});

export const persistor = persistStore(store);
