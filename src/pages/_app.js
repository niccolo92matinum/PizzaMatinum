
import styles from "../styles/globals.css";
import { Provider } from 'react-redux'
import {SessionProvider} from 'next-auth/react'
import makeStore from '../../store'


console.log(makeStore)
//const store = createStore(rootReducer);



export default function App({ Component, pageProps, session }) {
  return (
    <SessionProvider session={session}>
     <Provider store={makeStore()}>
       <Component {...pageProps} />
     </Provider>
    </SessionProvider>
  
  )
}