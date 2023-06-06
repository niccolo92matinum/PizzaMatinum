import { Provider } from 'react-redux'
import { SessionProvider } from 'next-auth/react'
import makeStore from '../../store'
import '../styles/globals.css'

export default function App ({ Component, pageProps, session }) {
  return (
  <SessionProvider session={session}>
   <Provider store={makeStore()}>
    <Component {...pageProps} />
   </Provider>
  </SessionProvider>

  )
}
