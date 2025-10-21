import { configureStore } from '@reduxjs/toolkit'
import { productsApi } from './services/productsApi'
import { userApi } from './services/userApi'
import cartReducer from './features/cartSlice'
import authReducer from './features/authSlice'
import progressReducer from './features/progressSlice'
import popupReducer from './features/popupSlice'

export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    cart: cartReducer,
    auth: authReducer,
    progress: progressReducer,
    popup: popupReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productsApi.middleware,
      userApi.middleware
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
