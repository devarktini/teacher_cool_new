import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type { UserRole } from '@/types/auth'

interface AuthState {
  id: string | null
  user_type: UserRole | null
  token: string | null
  isAuthenticated: boolean
  user: any | null
}

const initialState: AuthState = {
  id: null,
  user_type: null,
  token: null,
  isAuthenticated: false,
  user: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ id: string; user_type: UserRole; token: string; user: any }>
    ) => {
      const { id, user_type, token, user } = action.payload

      state.id = id
      state.user_type = user_type
      state.token = token
      state.isAuthenticated = true
      state.user = user

      if (typeof window !== 'undefined') {
        localStorage.setItem('id', id)
        localStorage.setItem('user_type', user_type)
        localStorage.setItem('token', token)
      }
    },

    logout: (state) => {
      state.id = null
      state.user_type = null
      state.token = null
      state.isAuthenticated = false
      state.user = null

      if (typeof window !== 'undefined') {
        localStorage.removeItem('id')
        localStorage.removeItem('user_type')
        localStorage.removeItem('token')
      }
    },

    restoreSession: (state) => {
      if (typeof window !== 'undefined') {
        const id = localStorage.getItem('id')
        const user_type = localStorage.getItem('user_type') as UserRole | null
        const token = localStorage.getItem('token')

        if (id && user_type && token) {
          state.id = id
          state.user_type = user_type
          state.token = token
          state.isAuthenticated = true
        }
      }
    },
  },
})

export const { setCredentials, logout, restoreSession } = authSlice.actions
export const selectAuth = (state: RootState) => state.auth
export default authSlice.reducer

