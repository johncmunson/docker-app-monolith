import React from 'react'
import { Link, Route, Switch, Redirect, withRouter } from 'react-router-dom'
import CoLogoutLink from './containers/CoLogoutLink'
import Hamburger from './components/Hamburger'
import Home from './views/Home'
import Work from './views/Work'
import Invoicing from './views/Invoicing'

const App = ({ match }) => (
  <div>
    <Hamburger>
      <Link to={`home`}>Home</Link>
      <Link to={`work`}>Work</Link>
      <Link to={`invoicing`}>Invoicing</Link>
      <CoLogoutLink>Logout</CoLogoutLink>
    </Hamburger>
    <Switch>
      <Route path={`${match.path}/home`} component={Home} />
      <Route path={`${match.path}/work`} component={Work} />
      <Route path={`${match.path}/invoicing`} component={Invoicing} />
      <Redirect to={`${match.url}/home`} />
    </Switch>
  </div>
)

export default withRouter(App)
