import { fetch } from '../fetch'
import { base64encode } from '../utilities.js'
import loginUserRequest from '../actions/loginUserRequest.js'
import loginUserSuccess from '../actions/loginUserSuccess.js'
import loginUserFailure from '../actions/loginUserFailure.js'

export default function loginUser(email, password) {
  return function(dispatch) {
    dispatch(loginUserRequest())
    return fetch({
      method: 'get',
      url: '/login',
      headers: {
        Authorization: `Basic ${base64encode(email + ':' + password)}`
      }
    }).then(
      response => dispatch(loginUserSuccess(response.data)),
      error => dispatch(loginUserFailure(error))
    )
  }
}
