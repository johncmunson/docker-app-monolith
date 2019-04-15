import React, { Component } from 'react'
import { Box, Tab, Tabs, Form, FormField, Button } from 'grommet'
import ActionLink from './ActionLink'
import Loading from './Loading'
import { fetch } from '../fetch'

export default class LoginForm extends Component {
  state = {
    loginEmail: '',
    loginPassword: '',
    signupEmail: '',
    signupPassword: '',
    signingUp: false,
    signupSuccessful: false,
    signupFailed: false,
    sentForgotPasswordEmail: false
  }

  validateForm(formName) {
    return (
      this.state[formName + 'Email'].length > 0 &&
      this.state[formName + 'Password'].length > 0
    )
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handleSignup = async event => {
    event.preventDefault()
    this.setState({ signingUp: true })
    try {
      await fetch({
        method: 'post',
        url: '/signup',
        data: {
          email: this.state.signupEmail,
          password: this.state.signupPassword
        }
      })
      this.setState({
        signingUp: false,
        signupFailed: false,
        signupSuccessful: true
      })
    } catch (error) {
      this.setState({
        signingUp: false,
        signupFailed: true,
        signupSuccessful: false
      })
    }
  }

  handleForgotPassword = async () => {
    try {
      await fetch({
        method: 'post',
        url: '/forgotpassword',
        data: {
          email: this.state.loginEmail
        }
      })
    } catch (error) {
      console.log(error)
    }
    this.setState({ sentForgotPasswordEmail: true })
  }

  handleResendActivationEmail = async () => {
    try {
      await fetch({
        method: 'post',
        url: '/resendactivationemail',
        data: {
          email: this.state.signupEmail
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <Box
        direction="row-responsive"
        justify="center"
        align="center"
        pad="xlarge"
      >
        <Tabs height="medium" alignSelf="center">
          <Tab title="Login">
            <Box pad="medium" align="center" round>
              <Form>
                <FormField
                  id="loginEmail"
                  type="email"
                  name="email"
                  label="Email"
                  value={this.state.loginEmail}
                  onChange={this.handleChange}
                />
                <FormField
                  id="loginPassword"
                  type="password"
                  name="password"
                  label="Password"
                  value={this.state.loginPassword}
                  onChange={this.handleChange}
                />
                <Button
                  type="button"
                  primary
                  disabled={!this.validateForm('login') || this.props.loggingIn}
                  onClick={() =>
                    this.props.handleLogin(
                      this.state.loginEmail,
                      this.state.loginPassword
                    )
                  }
                >
                  <Box pad="small" direction="row" align="center" gap="small">
                    {this.props.loggingIn ? <Loading /> : <span>Login</span>}
                  </Box>
                </Button>
                <br />
                <br />
                <ActionLink handleClick={this.handleForgotPassword}>
                  Forgot your password?
                </ActionLink>
                {this.props.loginFailed && (
                  <div>
                    <br />
                    <div style={{ color: 'red', maxWidth: '250px' }}>
                      Incorrect username or password.
                    </div>
                  </div>
                )}
                {this.state.sentForgotPasswordEmail && (
                  <div>
                    <br />
                    <div style={{ maxWidth: '250px' }}>
                      A new password was sent to the provided email address.
                    </div>
                  </div>
                )}
              </Form>
            </Box>
          </Tab>
          <Tab title="Signup">
            <Box pad="medium" align="center" round>
              <Form>
                <FormField
                  id="signupEmail"
                  type="email"
                  name="email"
                  label="Email"
                  value={this.state.signupEmail}
                  onChange={this.handleChange}
                />
                <FormField
                  id="signupPassword"
                  type="password"
                  name="password"
                  label="Password"
                  value={this.state.signupPassword}
                  onChange={this.handleChange}
                />
                <Button
                  type="button"
                  primary
                  disabled={
                    !this.validateForm('signup') ||
                    this.state.signingUp ||
                    this.state.signupSuccessful
                  }
                  onClick={this.handleSignup}
                >
                  <Box pad="small" direction="row" align="center" gap="small">
                    {this.state.signingUp ? <Loading /> : <span>Signup</span>}
                  </Box>
                </Button>
                {this.state.signupSuccessful && (
                  <div style={{ maxWidth: '250px' }}>
                    <br />
                    <div>Please check your email to verify your account.</div>
                    <br />
                    <ActionLink handleClick={this.handleResendActivationEmail}>
                      Click here to resend the account activation email.
                    </ActionLink>
                  </div>
                )}
                {this.state.signupFailed && (
                  <div style={{ color: 'red', maxWidth: '250px' }}>
                    <br />
                    <div>
                      There was an issue signing up. Either your password is too
                      weak or the provided email is already taken.
                    </div>
                  </div>
                )}
              </Form>
            </Box>
          </Tab>
        </Tabs>
      </Box>
    )
  }
}
