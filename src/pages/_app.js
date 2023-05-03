import '@/styles/globals.css'

import { Provider } from 'react-redux'

import { createStore } from "redux";
import rootReducer from "../reducers";


const store = createStore(rootReducer);


export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
    
   
       <Component {...pageProps} />

     
    </Provider>
  
  )
}