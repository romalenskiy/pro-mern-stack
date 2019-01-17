import React from 'react'
import PropTypes from 'prop-types'

class NumInput extends React.Component {
  static format(num) {
    return num != null ? num.toString() : ''
  }

  static unformat(str) {
    const val = parseInt(str, 10)
    return Number.isNaN(val) ? null : val
  }

  constructor(props) {
    super(props)
    this.state = {
      value: NumInput.format(props.value),
    }

    this.onBlur = this.onBlur.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onBlur(e) {
    const { onChange } = this.props
    const { value } = this.state
    onChange(e, NumInput.unformat(value))
  }

  onChange(e) {
    const { value } = e.target
    if (value.match(/^\d*$/)) this.setState({ value })
  }

  render() {
    const { value } = this.state
    return (
      <input type="text" {...this.props} value={value} onBlur={this.onBlur} onChange={this.onChange} />
    )
  }
}

NumInput.propTypes = {
  value: PropTypes.number, // eslint-disable-line
  onChange: PropTypes.func.isRequired,
}

export default NumInput
