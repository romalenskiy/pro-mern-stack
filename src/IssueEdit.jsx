import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

class IssueEdit extends React.Component { // eslint-disable-line
  render() {
    const { match } = this.props
    const { params } = match
    const { id } = params
    return (
      <div>
        <p>This is a placeholder for editing issue {id}</p>
        <Link to="/issues">Back to Issue List</Link>
      </div>
    )
  }
}

IssueEdit.propTypes = {
  match: PropTypes.object.isRequired, // eslint-disable-line
  params: PropTypes.object.isRequired, // eslint-disable-line
}

export default IssueEdit
