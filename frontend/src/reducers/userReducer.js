const initialState = {
  isLoading: false,
  data: null,
  errMsg: null
}

export default function userReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'LOGIN_USER_REQUEST': {
      return {
        ...initialState,
        isLoading: true
      }
    }
    case 'LOGIN_USER_SUCCESS': {
      return {
        ...initialState,
        data: payload
      }
    }
    case 'LOGIN_USER_FAILURE': {
      return {
        ...initialState,
        errMsg: payload
      }
    }
    default: {
      return state
    }
  }
}
