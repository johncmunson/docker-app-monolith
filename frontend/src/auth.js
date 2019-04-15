import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect'
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper'
import Loading from './components/Loading'

const locationHelper = locationHelperBuilder({})

export const userIsAuthenticated = connectedRouterRedirect({
  // Path to send the user if they are not logged in
  redirectPath: '/login',
  // Function that receives redux state tree and checks if the user is logged in
  authenticatedSelector: state => state.user.data !== null,
  // Returns true if the user auth state is loading
  authenticatingSelector: state => state.user.isLoading,
  // Render this component when the authenticatingSelector returns true
  AuthenticatingComponent: Loading,
  // A nice display name for this check
  wrapperDisplayName: 'UserIsAuthenticated'
})

export const userIsNotAuthenticated = connectedRouterRedirect({
  // This sends the user either to the query param route if we have one,
  // or to the default route if none is specified and the user is already
  // logged in. For example, if the user navigates to /profile, they will
  // be redirected to /login?redirect=%2Fprofile
  redirectPath: (state, ownProps) =>
    locationHelper.getRedirectQueryParam(ownProps) || '/app',
  // This prevents us from adding the query parameter when we send the user
  // away from the login page
  allowRedirectBack: false,
  // Determine if the user is authenticated or not
  authenticatedSelector: state =>
    state.user.data === null && state.user.isLoading === false,
  // A nice display name for this check
  wrapperDisplayName: 'UserIsNotAuthenticated'
})
