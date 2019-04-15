import { combineReducers } from 'redux'
import userReducer from './userReducer.js'
import invoicingReducer from './invoicingReducer.js'

const appReducer = combineReducers({
  user: userReducer,
  invoicing: invoicingReducer
})

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer
