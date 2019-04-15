import React, { Component } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MenuSVG from '@material-ui/icons/Menu'

class Hamburger extends Component {
  state = {
    anchorEl: null
  }

  handleOpenMenu = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleCloseMenu = () => {
    this.setState({ anchorEl: null })
  }

  render() {
    const { children } = this.props
    const { anchorEl } = this.state

    return (
      <div>
        <IconButton
          aria-owns={anchorEl ? 'hamburger-menu-345345' : undefined}
          aria-haspopup="true"
          onClick={this.handleOpenMenu}
        >
          <MenuSVG />
        </IconButton>
        <Menu
          id="hamburger-menu-345345"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleCloseMenu}
        >
          {React.Children.map(children, child => (
            <MenuItem onClick={this.handleCloseMenu}>{child}</MenuItem>
          ))}
        </Menu>
      </div>
    )
  }
}

export default Hamburger
