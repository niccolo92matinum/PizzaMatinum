import createSagaMiddleware from 'redux-saga'
import rootReducer from './reducers'
import configurePersist from './configurePersist'
import { logger } from 'redux-logger'
import { applyMiddleware, createStore, compose } from 'redux'

const devMode = process.env.NODE_ENV === 'development'
const sagaMiddleware = createSagaMiddleware()

const composeEnhancers =
  (process.browser && typeof window !== 'undefined' && window.REDUX_DEVTOOLS_EXTENSION_COMPOSE) || compose

const { load, save } = configurePersist({ doNotSave: ['status'] })

const middlewares = [sagaMiddleware, save]

if (devMode) {
  middlewares.push(logger)
}

const makeStore = () => {
  const store = createStore(
    rootReducer,
    load(rootReducer({}, '')),
    composeEnhancers(applyMiddleware(...middlewares))
  )

  return store
}

export default makeStore
