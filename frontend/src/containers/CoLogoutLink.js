import { connect } from 'react-redux'
import logout from '../actions/logout'
import ActionLink from '../components/ActionLink'

const mapDispatchToProps = dispatch => ({
  handleClick: () => dispatch(logout())
})

const CoLogoutLink = connect(
  null,
  mapDispatchToProps
)(ActionLink)

export default CoLogoutLink
