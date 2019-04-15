const zxcvbn = require('zxcvbn')
const Isemail = require('isemail')
const { oneLineTrim } = require('common-tags')

module.exports.checkPasswordStrength = function(pw) {
  return zxcvbn(pw).score // rates password strength from 1 to 4
}

module.exports.checkEmailValidity = function(email) {
  return Isemail.validate(email)
}

module.exports.getActivationLink = function(activationCode, env) {
  if (!activationCode || !env) {
    return false
  }

  const activationLink =
    env === 'development'
      ? oneLineTrim`
      ${process.env.DEV_PROTOCOL}://
      ${process.env.DEV_HOST}:
      ${process.env.DEV_PORT}
      /api/activate/
      ${activationCode}
    `
      : oneLineTrim`
      ${process.env.PROD_PROTOCOL}://
      ${process.env.PROD_HOST}:
      ${process.env.PROD_PORT}
      /api/activate/
      ${activationCode}
    `

  return activationLink
}
