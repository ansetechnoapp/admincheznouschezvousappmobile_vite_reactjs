import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import authReducer from './Slices/authSlice';
import imagesReducer from './Slices/slideImageSlice';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import categoryReducer from './Slices/CategorySlice';
import { createCategory, modifyCategory }  from './Slices/CategorySlice';
import { useDispatch } from 'react-redux';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  images: imagesReducer,
  categories: categoryReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
          createCategory.pending.type,
          createCategory.fulfilled.type,
          createCategory.rejected.type,
          modifyCategory.pending.type,
          modifyCategory.fulfilled.type,
          modifyCategory.rejected.type
        ],
        ignoredPaths: ['categories.categories'],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
