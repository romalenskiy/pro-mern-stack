import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import 'whatwg-fetch'

import IssueAdd from './IssueAdd.jsx' // eslint-disable-line import/extensions
import IssueFilter from './IssueFilter.jsx' // eslint-disable-line import/extensions

class IssueList extends React.Component {
  constructor() {
    super()
    this.state = {
      issues: [],
    }
    this.createIssue = this.createIssue.bind(this)
    this.setFilter = this.setFilter.bind(this)
  }

  componentDidMount() {
    this.loadData()
  }

  componentDidUpdate(prevProps) {
    const oldQuery = prevProps.location.search
    const { location } = this.props
    const newQuery = location.search

    if (newQuery !== oldQuery) this.loadData()
  }

  setFilter(query) {
    const { history, location } = this.props
    let search
    if (Object.keys(query).length !== 0) {
      const key = Object.keys(query)[0].toString()
      const value = query[key]
      search = `?${key}=${value}`
    } else search = ''
    history.push({ pathname: location.pathname, search })
  }

  async loadData() {
    try {
      const { location } = this.props
      const { search } = location
      const response = await fetch(`/api/issues${search}`)
      if (response.ok) {
        const data = await response.json()

        data.records.forEach((issue) => {
          issue.created = new Date(issue.created)
          if (issue.completionDate) issue.completionDate = new Date(issue.completionDate)
        })

        this.setState({ issues: data.records })
      } else {
        const error = await response.json()
        alert(`Failed to fetch issues: ${error.message}`)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async createIssue(newIssue) {
    try {
      const response = await fetch(
        '/api/issues',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newIssue),
        },
      )

      if (response.ok) {
        const updatedIssue = await response.json()
        updatedIssue.created = new Date(updatedIssue.created)

        if (updatedIssue.completionDate) {
          updatedIssue.completionDate = new Date(updatedIssue.completionDate)
        }

        this.setState((prevState) => {
          const newIssues = prevState.issues.concat(updatedIssue)
          return { issues: newIssues }
        })
      } else {
        const error = await response.json()
        alert(`Failed to add an issue: ${error.message}`)
      }
    } catch (err) {
      alert(`Error in sending data to server: ${err.message}`)
    }
  }

  render() {
    const { issues } = this.state
    return (
      <div>
        <IssueFilter setFilter={this.setFilter} />
        <hr />
        <IssueTable issues={issues} />
        <hr />
        <IssueAdd createIssue={this.createIssue} />
      </div>
    )
  }
}

IssueList.propTypes = {
  location: PropTypes.object.isRequired, // eslint-disable-line
  history: PropTypes.object, // eslint-disable-line
}

const IssueTable = (props) => {
  const { issues } = props
  const issueRows = issues.map(issue => <IssueRow key={issue._id} issue={issue} />)
  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Completion Date</th>
          <th>Title</th>
        </tr>
      </thead>
      <tbody>
        {issueRows}
      </tbody>
    </table>
  )
}

const IssueRow = (props) => {
  const { issue } = props
  const {
    _id, status, owner, created, effort, completionDate, title,
  } = issue

  return (
    <tr>
      <td>
        <Link to={`/issues/${_id}`}>
          {_id.substr(-4)}
        </Link>
      </td>
      <td>{status}</td>
      <td>{owner}</td>
      <td>{created.toDateString()}</td>
      <td>{effort}</td>
      <td>{completionDate ? completionDate.toDateString() : ''}</td>
      <td>{title}</td>
    </tr>
  )
}

export default IssueList
