import React from 'react'
import PropTypes from 'prop-types'

class IssueFilter extends React.Component {
  constructor() {
    super()
    this.clearFilter = this.clearFilter.bind(this)
    this.setFilterOpen = this.setFilterOpen.bind(this)
    this.setFilterAssigned = this.setFilterAssigned.bind(this)
  }

  setFilterOpen() {
    const { setFilter } = this.props
    setFilter({ status: 'Open' })
  }

  setFilterAssigned() {
    const { setFilter } = this.props
    setFilter({ status: 'Assigned' })
  }

  clearFilter() {
    const { setFilter } = this.props
    setFilter({})
  }

  render() {
    const Separator = () => <span> | </span>
    return (
      <div>
        <button type="button" onClick={this.clearFilter}>All Issues</button>
        <Separator />
        <button type="button" onClick={this.setFilterOpen}>Open Issues</button>
        <Separator />
        <button type="button" onClick={this.setFilterAssigned}>Assigned Issues</button>
      </div>
    )
  }
}

IssueFilter.propTypes = {
  setFilter: PropTypes.func.isRequired,
}

export default IssueFilter
