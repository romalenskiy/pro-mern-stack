import React from 'react'
import PropTypes from 'prop-types'

class DateInput extends React.Component {
  static displayFormat(date) {
    return (date != null) ? date.toDateString() : '' // date != null --> date !== null && date !== undefined
  }

  static editFormat(date) {
    return (date != null) ? date.toISOString().substr(0, 10) : ''
  }

  static unformat(str) {
    const val = new Date(str)
    return Number.isNaN(val.getTime()) ? null : val
  }

  constructor(props) {
    super(props)
    this.state = {
      value: DateInput.editFormat(props.value),
      focused: false,
      valid: true,
    }

    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onFocus() {
    this.setState({ focused: true })
  }

  onBlur(e) {
    e.persist()
    this.setState((state) => {
      const { value, valid } = state
      const { onValidityChange, onChange } = this.props
      const newValue = DateInput.unformat(value)
      const newValid = value === '' || newValue != null

      if (newValid !== valid && onValidityChange) onValidityChange(e, newValid)
      if (newValid) onChange(e, newValue)

      return { focused: false, valid: newValid }
    })
  }

  onChange(e) {
    const { value } = e.target
    if (value.match(/^[\d-]*$/)) this.setState({ value })
  }

  render() {
    const { value, valid, focused } = this.state
    const { onValidityChange, ...clearProps } = this.props
    const appropriateValue = (focused || !valid) ? value : DateInput.displayFormat(this.props.value)

    return (
      <input
        {...clearProps}
        value={appropriateValue}
        placeholder={focused ? 'YYYY-MM-DD' : null}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onChange={this.onChange}
      />
    )
  }
}

DateInput.propTypes = {
  value: PropTypes.object, // eslint-disable-line
  onChange: PropTypes.func.isRequired,
  onValidityChange: PropTypes.func, // eslint-disable-line react/require-default-props
  name: PropTypes.string.isRequired,
}

export default DateInput
