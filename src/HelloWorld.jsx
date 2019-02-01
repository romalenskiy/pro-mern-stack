import React from 'react'
import PropTypes from 'prop-types'

class HelloWorld extends React.Component {
  constructor(props) {
    super(props)
    this.state = Object.assign({}, props)
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ addressee: 'Galaxy' })
    }, 3000)
  }

  render() {
    const { addressee } = this.state
    return (
      <h1>Hello {addressee}!</h1>
    )
  }
}

HelloWorld.propTypes = {
  addressee: PropTypes.string,
}

HelloWorld.defaultProps = {
  addressee: '',
}

export default HelloWorld
