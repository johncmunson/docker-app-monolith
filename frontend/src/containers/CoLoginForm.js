import { connect } from 'react-redux'
import LoginForm from '../components/LoginForm.js'
import loginUser from '../thunks/loginUser.js'

const mapStateToProps = state => ({
  loggingIn: state.user.isLoading,
  loginFailed: !!state.user.errMsg
})

const mapDispatchToProps = dispatch => ({
  handleLogin: (email, password) => dispatch(loginUser(email, password))
})

const CoLoginForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm)

export default CoLoginForm
