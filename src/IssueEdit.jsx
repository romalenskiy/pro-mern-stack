import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import NumInput from './NumInput.jsx' // eslint-disable-line import/extensions
import DateInput from './DateInput.jsx' // eslint-disable-line import/extensions

class IssueEdit extends React.Component {
  constructor() {
    super()
    this.state = {
      issue: {
        _id: '',
        title: '',
        status: '',
        owner: '',
        effort: null,
        completionDate: null,
        created: null,
      },
      invalidFields: {},
    }

    this.onChange = this.onChange.bind(this)
    this.onValidityChange = this.onValidityChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    this.loadData()
  }

  componentDidUpdate(prevProps) {
    const oldParamsId = prevProps.match.params.id
    const { match } = this.props
    const { params } = match
    const newParamsId = params.id

    if (newParamsId !== oldParamsId) this.loadData()
  }

  onValidityChange(event, valid) {
    event.persist() // --> https://reactjs.org/docs/events.html#event-pooling

    this.setState((state) => {
      const invalidFields = { ...state.invalidFields }
      const { name } = event.target

      if (!valid) {
        invalidFields[name] = true
      } else {
        delete invalidFields[name]
      }

      return { invalidFields }
    })
  }

  onChange(event, convertedValue) {
    event.persist() // --> https://reactjs.org/docs/events.html#event-pooling

    this.setState((state) => {
      const issue = { ...state.issue }
      const value = (convertedValue !== undefined) ? convertedValue : event.target.value

      issue[event.target.name] = value

      return { issue }
    })
  }

  async onSubmit(event) {
    event.preventDefault()

    const { issue, invalidFields } = this.state
    const { match } = this.props
    const { params } = match

    if (Object.keys(invalidFields).length !== 0) return

    try {
      const response = await fetch(`/api/issues/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issue),
      })

      if (response.ok) {
        const updatedIssue = await response.json()
        updatedIssue.created = new Date(updatedIssue.created)
        if (updatedIssue.completionDate) {
          updatedIssue.completionDate = new Date(updatedIssue.completionDate)
        }

        this.setState({ issue: updatedIssue })

        alert('Updated issue successfully')
      } else {
        const error = await response.json()
        alert(`Failed to update issue: ${error.message}`)
      }
    } catch (err) {
      alert(`Error in sending data to server: ${err.message}`)
    }
  }

  async loadData() {
    try {
      const { match } = this.props
      const { params } = match
      const response = await fetch(`/api/issues/${params.id}`)
      if (response.ok) {
        const issue = await response.json()
        issue.created = new Date(issue.created)
        issue.completionDate = issue.completionDate != null
          ? new Date(issue.completionDate)
          : null
        this.setState({ issue })
      } else {
        const error = await response.json()
        alert(`Failed to fetch issue: ${error.message}`)
      }
    } catch (err) {
      alert(`Error in fetching data from server: ${err.message}`)
    }
  }

  render() {
    const { issue, invalidFields } = this.state
    // key prop in <form> needed to implement this pattern --> https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key
    return (
      <div>
        <form autoComplete="off" key={issue._id} onSubmit={this.onSubmit}>
          ID: {issue._id}
          <br />
          Created: {issue.created ? issue.created.toDateString() : ''}
          <br />
          Status:
          {' '}
          <select name="status" value={issue.status} onChange={this.onChange}>
            <option value="New">New</option>
            <option value="Open">Open</option>
            <option value="Assigned">Assigned</option>
            <option value="Fixed">Fixed</option>
            <option value="Verified">Verified</option>
            <option value="Closed">Closed</option>
          </select>
          <br />
          Owner: <input type="text" name="owner" value={issue.owner} onChange={this.onChange} />
          <br />
          Effort: <NumInput size={5} name="effort" value={issue.effort} onChange={this.onChange} />
          <br />
          Completion Date: <DateInput name="completionDate" value={issue.completionDate} onChange={this.onChange} onValidityChange={this.onValidityChange} />
          <br />
          Title: <input type="text" name="title" value={issue.title} onChange={this.onChange} />
          <br />
          {Object.keys(invalidFields).length !== 0
            && (
              <div className="error">
                Please correct invalid fields before submitting!
              </div>
            )
          }
          <button type="submit">Submit</button>
          <br />
          <Link to="/issues">Back to issues List</Link>
          <br />
        </form>
      </div>
    )
  }
}

IssueEdit.propTypes = {
  params: PropTypes.object.isRequired, // eslint-disable-line
  match: PropTypes.object.isRequired, // eslint-disable-line
}

export default IssueEdit
