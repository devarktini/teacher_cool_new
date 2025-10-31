import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface LoginPopupState {
  isOpen: boolean
  onConfirm?: () => void
}

const initialState: LoginPopupState = {
  isOpen: false,
}

const loginPopupSlice = createSlice({
  name: 'loginPopup',
  initialState,
  reducers: {
    showLoginPopup: (state, action: PayloadAction<{ onConfirm?: () => void } | undefined>) => {
      state.isOpen = true
      state.onConfirm = action?.payload?.onConfirm
    },
    hideLoginPopup: (state) => {
      state.isOpen = false
      state.onConfirm = undefined
    },
  },
})

export const { showLoginPopup, hideLoginPopup } = loginPopupSlice.actions
export const selectLoginPopup = (state: RootState) => state.loginPopup
export default loginPopupSlice.reducer
