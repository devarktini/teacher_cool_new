'use client'
import { Provider, useDispatch } from 'react-redux'
import { store } from './store'
import { useEffect } from 'react'
import { restoreSession } from './features/authSlice'

// ✅ Helper component to rehydrate the session
function SessionRestorer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(restoreSession())
  }, [dispatch])

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SessionRestorer>{children}</SessionRestorer>
    </Provider>
  )
}



// 'use client'
// import { Provider } from 'react-redux'
// import { store } from './store'

// export function Providers({ children }: { children: React.ReactNode }) {
//   return <Provider store={store}>{children}</Provider>
// }
