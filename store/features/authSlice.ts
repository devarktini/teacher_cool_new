import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@/types/user'
import type { RootState } from '../store'

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: {
    id: 1,
    email: 'admin@example.com',
    username: 'Admin User',
    role: 'admin'
  },
  token: 'dummy-token',
  isAuthenticated: true
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = true; // change to false when we will integrate actual api call
      localStorage.removeItem('token');
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export const selectAuth = (state: RootState) => state.auth
export default authSlice.reducer
