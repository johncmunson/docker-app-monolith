const db = require('./db')
const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
// consider ditching passport for permit
const passport = require('passport')
const { BasicStrategy } = require('passport-http')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const bcrypt = require('bcryptjs')
const uuidv4 = require('uuid/v4')
const nanoid = require('nanoid')
const jwt = require('jsonwebtoken')
const { oneLine, stripIndents } = require('common-tags')
const { sendMail } = require('./mail')
const {
  checkPasswordStrength,
  checkEmailValidity,
  getActivationLink
} = require('./utils')

const env = process.env.NODE_ENV || 'development'
const app = express()
const port = process.env.BACKEND_PORT || 3000
const salt = bcrypt.genSaltSync(10)

passport.use(
  new BasicStrategy(async (email, password, cb) => {
    const user = (await db.query('SELECT * FROM account WHERE email=$1', [
      email
    ])).rows[0]

    if (!user) return cb(null, false)

    if (!user.activated) return cb(null, false)

    const passwordValid = await bcrypt.compare(password, user.password)

    if (!passwordValid) return cb(null, false)

    let token = jwt.sign(
      {
        // jwt claims go here
        // this includes standard claims like iat (issued at)
        // as well as any custom data you would like to include
        email: email
      },
      process.env.JWT_SECRET
    )

    return cb(null, token)
  })
)

passport.use(
  new JwtStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    (jwt_payload, cb) => {
      return cb(null, jwt_payload)
    }
  )
)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())
// initialize passport and allow express to use it
app.use(passport.initialize())

app.get(`/api/ping`, (req, res) => {
  return res.status(200).json({ message: 'ping' })
})

app.get(
  `/api/login`,
  passport.authenticate('basic', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    res.status(200).json({ jwt: req.user })
  }
)

app.post(`/api/signup`, async (req, res) => {
  try {
    const { email, password } = req.body

    // check password strength
    if (checkPasswordStrength(password) < 2) {
      return res.status(400).json({ error: 'Weak password' })
    }

    // check if email is valid
    if (!checkEmailValidity(email)) {
      return res.status(400).json({ error: 'Invalid email' })
    }

    const user = (await db.query('SELECT * FROM account WHERE email=$1', [
      email
    ])).rows[0]

    // check if user already exists and account has been activated
    if (user && user.activated) {
      return res.status(400).json({ error: 'Account already exists' })
    }

    // check if user already exists, but account has not yet been activated
    if (user && !user.activated) {
      return res.status(400).json({
        error: 'Account already exists, but has not yet been activated'
      })
    }

    const hash = bcrypt.hashSync(password, salt)
    const activationCode = uuidv4()
    const activated = false

    await db.query(
      oneLine`
        INSERT INTO account (email, password, activation_code, activated)
        VALUES ($1, $2, $3, $4)
      `,
      [email, hash, activationCode, activated]
    )

    const activationLink = getActivationLink(activationCode, env)

    await sendMail({
      from: 'foo@example.com', // sender address
      to: email, // list of receivers (string, comma separated)
      subject: 'Account created', // Subject line
      text: stripIndents`
        Congratulations, your account has been successfully created!
        To activate your account, please click the link below or paste into your web browser.
        ${activationLink}
      ` // plain text body
      // html: "<b>Hello world?</b>" // html body
    })

    return res.status(200).json({ message: 'Account created' })
  } catch (error) {
    return res.status(400).json({ error: error })
  }
})

app.get(`/api/activate/:activationCode`, async (req, res) => {
  try {
    const activationCode = req.params.activationCode
    await db.query(
      'UPDATE account SET activated = true WHERE activation_code = $1',
      [activationCode]
    )
    return res.status(200).json({ message: 'Your account has been activated' })
  } catch (error) {
    return res.status(400).json({ error: error })
  }
})

app.post(
  `/api/changepassword`,
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { newPassword } = req.body

      if (checkPasswordStrength(newPassword) < 2) {
        return res.status(400).json({ error: 'Weak password' })
      }

      await db.query('UPDATE account SET password = $1 WHERE email = $2', [
        bcrypt.hashSync(newPassword, salt),
        req.user.email
      ])

      return res.status(200).json({ message: 'Successfully changed password' })
    } catch (error) {
      return res.status(400).json({ error: error })
    }
  }
)

// This implementation is a good first attempt, but it is vulnerable to denial
// of service attacks. This is because anyone can reset anyone else's password
// at any time. They can't gain access to their account though, so it's more of
// an inconvenience attack rather than a security attack. A better solution
// would be to send an email with a special link that will allow the user to
// reset their password on their own.
app.post(`/api/forgotpassword`, async (req, res) => {
  try {
    const { email } = req.body
    const newPassword = nanoid()

    await db.query('UPDATE account SET password = $1 WHERE email = $2', [
      bcrypt.hashSync(newPassword, salt),
      email
    ])

    await sendMail({
      from: 'foo@example.com', // sender address
      to: email, // list of receivers (string, comma separated)
      subject: 'Your password has been reset', // Subject line
      text: stripIndents`
        Your password has been reset to...
        ${newPassword}

        Be sure to change your password to something more memorable once you login.
      ` // plain text body
      // html: "<b>Hello world?</b>" // html body
    })

    return res.status(200).json({
      message: 'Your password has been reset. Please check your email.'
    })
  } catch (error) {
    return res.status(400).json({ error: error })
  }
})

app.post(`/api/resendactivationemail`, async (req, res) => {
  try {
    const { email } = req.body

    const activationCode = (await db.query(
      'SELECT * FROM account WHERE email=$1',
      [email]
    )).rows[0].activation_code

    const activationLink = getActivationLink(activationCode, env)

    await sendMail({
      from: 'foo@example.com', // sender address
      to: email, // list of receivers (string, comma separated)
      subject: 'Account created', // Subject line
      text: stripIndents`
        Congratulations, your account has been successfully created!
        To activate your account, please click the link below or paste into your web browser.
        ${activationLink}
      ` // plain text body
      // html: "<b>Hello world?</b>" // html body
    })

    return res
      .status(200)
      .json({ message: 'Your account activation email has been resent.' })
  } catch (error) {
    return res.status(400).json({ error: error })
  }
})

app.post(`/api/signout`, (req, res) => {
  // might not need this endpoint... just invalidate the jwt on the client
})

app.post(`/api/deleteaccount`, (req, res) => {})

app.use((req, res, next) => {
  return res.status(404).json({ error: 'Route not found' })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
