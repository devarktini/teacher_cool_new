import { configureStore } from '@reduxjs/toolkit'
import { userApi } from './services/userApi'
import authReducer from './features/authSlice'
import progressReducer from './features/progressSlice'
import popupReducer from './features/popupSlice'
import courseReducer from './features/courseSlice'
export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    auth: authReducer,
    progress: progressReducer,
    popup: popupReducer,
    course: courseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
