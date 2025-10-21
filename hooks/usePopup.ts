import { useDispatch } from 'react-redux'
import { showPopup, hidePopup, PopupData } from '@/store/features/popupSlice'

interface ShowPopupOptions {
  title: string
  description: string
  additionalData?: PopupData[]
  theme?: 'success' | 'error' | 'warning' | 'info'
  onConfirm?: () => void
}

export function usePopup() {
  const dispatch = useDispatch()

  const show = (options: ShowPopupOptions) => {
    dispatch(showPopup(options))
  }

  const hide = () => {
    dispatch(hidePopup())
  }

  return { show, hide }
}
