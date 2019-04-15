import axios from 'axios'

let fetch

if (process.env.NODE_ENV === 'development') {
  fetch = axios.create({
    baseURL: `${process.env.REACT_APP_DEV_PROTOCOL}://${
      process.env.REACT_APP_DEV_HOST
    }:${process.env.REACT_APP_DEV_PORT}/api`,
    headers: { 'Content-Type': 'application/json' }
  })
} else {
  fetch = axios.create({
    baseURL: `${process.env.REACT_APP_PROD_PROTOCOL}://${
      process.env.REACT_APP_PROD_HOST
    }:${process.env.REACT_APP_PROD_PORT}/api`,
    headers: { 'Content-Type': 'application/json' }
  })
}

export { fetch }
