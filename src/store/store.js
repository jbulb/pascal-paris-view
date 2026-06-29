import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
const storage = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, item) => Promise.resolve(localStorage.setItem(key, item)),
  removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
};

import cartReducer from './cartSlice';
import userReducer from './userSlice';
import blogReducer from './blogSlice';
import productsReducer from './productsSlice';

// ---------------------------------------------------------------------------
// Config (same URLs for dev & prod in this project)
// ---------------------------------------------------------------------------
import config from '../config/development.json';

// ---------------------------------------------------------------------------
// redux-persist: only persist the cart items across page reloads
// ---------------------------------------------------------------------------
const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items'], // only persist the items array, not paymentClientToken
};

// ---------------------------------------------------------------------------
// Root reducer
// ---------------------------------------------------------------------------
const rootReducer = combineReducers({
  cart: persistReducer(cartPersistConfig, cartReducer),
  user: userReducer,
  blog: blogReducer,
  products: productsReducer,
  config: () => config,
});

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist dispatches non-serializable actions; ignore them
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
