import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

export interface PopupData {
  key: string
  value: string | number | boolean
}

interface PopupState {
  isOpen: boolean
  title: string
  description: string
  additionalData?: PopupData[]
  theme?: 'success' | 'error' | 'warning' | 'info'
  onConfirm?: () => void
}

const initialState: PopupState = {
  isOpen: false,
  title: '',
  description: '',
  additionalData: [],
  theme: 'info'
}

export const popupSlice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    showPopup: (state, action: PayloadAction<Omit<PopupState, 'isOpen'>>) => {
      state.isOpen = true
      state.title = action.payload.title
      state.description = action.payload.description
      state.additionalData = action.payload.additionalData
      state.theme = action.payload.theme
      state.onConfirm = action.payload.onConfirm
    },
    hidePopup: (state) => {
      state.isOpen = false
      state.onConfirm = undefined
    }
  }
})

export const { showPopup, hidePopup } = popupSlice.actions
export const selectPopup = (state: RootState) => state.popup
export default popupSlice.reducer
