import React from 'react'
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
  }

  componentDidMount() {
    this.loadData()
  }

  async loadData() {
    try {
      const response = await fetch('/api/issues')
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
        <h1>Issue Tracker</h1>
        <IssueFilter />
        <hr />
        <IssueTable issues={issues} />
        <hr />
        <IssueAdd createIssue={this.createIssue} />
      </div>
    )
  }
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
      <td>{_id}</td>
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
