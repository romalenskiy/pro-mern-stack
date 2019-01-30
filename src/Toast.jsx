import React from 'react'
import PropTypes from 'prop-types'

import { Alert, Fade } from 'react-bootstrap'

class Toast extends React.Component {
  componentDidUpdate() {
    const { showing, onDismiss } = this.props
    if (showing) {
      clearTimeout(this.dismissTimer)
      this.dismissTimer = setTimeout(onDismiss, 5000)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.dismissTimer)
  }

  render() {
    const {
      showing, bsStyle, onDismiss, message,
    } = this.props
    const toastStyle = {
      position: 'fixed', top: 30, left: 0, right: 0, textAlign: 'center',
    }
    const alertStyle = {
      display: 'inline-block', width: 500,
    }
    return (
      <Fade in={showing}>
        <div style={toastStyle}>
          <Alert
            style={alertStyle}
            bsStyle={bsStyle}
            onDismiss={onDismiss}
          >
            {message}
          </Alert>
        </div>
      </Fade>
    )
  }
}

Toast.propTypes = {
  showing: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  bsStyle: PropTypes.string,
  message: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
}

Toast.defaultProps = {
  bsStyle: 'success',
}

export default Toast
