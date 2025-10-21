import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface ProgressState {
  isLoading: boolean
  color: string
}

const initialState: ProgressState = {
  isLoading: false,
  color: '#3B82F6'
}

export const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    startProgress: (state, action) => {
      state.isLoading = true
      if (action.payload?.color) {
        state.color = action.payload.color
      }
    },
    stopProgress: (state) => {
      state.isLoading = false
    },
  },
})

export const { startProgress, stopProgress } = progressSlice.actions
export const selectProgress = (state: RootState) => state.progress
export default progressSlice.reducer
