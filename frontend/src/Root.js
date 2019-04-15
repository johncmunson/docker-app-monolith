import React from 'react'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore.js'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import { userIsAuthenticated, userIsNotAuthenticated } from './auth'
import App from './App'
import Login from './views/Login'

const store = configureStore()

const UnprotectedApp = userIsNotAuthenticated(Login)
const ProtectedApp = userIsAuthenticated(App)

const Root = () => (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/login" component={UnprotectedApp} />
        <Route path="/app" component={ProtectedApp} />
        <Redirect to="/app" />
      </Switch>
    </Router>
  </Provider>
)

export default Root
