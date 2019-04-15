import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers/rootReducer'
import throttle from 'lodash/throttle'
import { loadState, saveState } from '../localStorage.js'

const middlewares = [thunkMiddleware]

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger')
  middlewares.push(logger)
}

// Necessary for redux devtools in Chrome. Wrap this around 'applyMiddleware'
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default function configureStore() {
  const persistedState = loadState()
  const store = createStore(
    rootReducer,
    persistedState,
    composeEnhancers(applyMiddleware(...middlewares))
  )
  store.subscribe(
    throttle(() => {
      saveState({
        user: store.getState().user,
        invoicing: store.getState().invoicing
      })
    }, 1000)
  )
  return store
}
