import React from 'react'
import { Link, withRouter } from 'react-router-dom'

const ActionLink = ({ match, location, handleClick, children }) => (
  <Link to={`${match.url}${location.search}`} onClick={handleClick}>
    {children}
  </Link>
)

export default withRouter(ActionLink)
