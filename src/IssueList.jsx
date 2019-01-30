import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import qs from 'qs'
import 'whatwg-fetch'

import {
  Button, Glyphicon, Table, Panel,
} from 'react-bootstrap'

import IssueFilter from './IssueFilter.jsx' // eslint-disable-line import/extensions
import Toast from './Toast.jsx' // eslint-disable-line import/extensions

class IssueList extends React.Component {
  constructor() {
    super()
    this.state = {
      issues: [],
      toastVisible: false,
      toastMessage: '',
      toastType: 'success',
    }
    this.setFilter = this.setFilter.bind(this)
    this.deleteIssue = this.deleteIssue.bind(this)
    this.showError = this.showError.bind(this)
    this.dismissToast = this.dismissToast.bind(this)
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
    const search = qs.stringify(query, { addQueryPrefix: true })
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
        this.showError(`Failed to fetch issues: ${error.message}`)
      }
    } catch (err) {
      this.showError(`Error in fetching data from server: ${err}`)
    }
  }

  async deleteIssue(id) {
    const response = await fetch(`/api/issues/${id}`, { method: 'DELETE' })


    if (!response.ok) this.showError('Failed to delete issue!')
    else this.loadData()
  }

  showError(message) {
    this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger' })
  }

  dismissToast() {
    this.setState({ toastVisible: false })
  }

  render() {
    const {
      issues, toastVisible, toastMessage, toastType,
    } = this.state
    const { location } = this.props
    const initFilter = qs.parse(location.search, { ignoreQueryPrefix: true })
    return (
      <div>
        <Panel defaultExpanded>
          <Panel.Toggle componentClass={Panel.Heading}>
            <Panel.Title>
              Filter
            </Panel.Title>
          </Panel.Toggle>
          <Panel.Collapse>
            <Panel.Body>
              <IssueFilter setFilter={this.setFilter} initFilter={initFilter} />
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
        <IssueTable issues={issues} deleteIssue={this.deleteIssue} />
        <Toast
          bsStyle={toastType}
          showing={toastVisible}
          message={toastMessage}
          onDismiss={this.dismissToast}
        />
      </div>
    )
  }
}

IssueList.propTypes = {
  location: PropTypes.object.isRequired, // eslint-disable-line
  history: PropTypes.object, // eslint-disable-line
}

const IssueTable = (props) => {
  const { issues, deleteIssue } = props
  const issueRows = issues.map(issue => (
    <IssueRow key={issue._id} issue={issue} deleteIssue={deleteIssue} />
  ))
  return (
    <Table bordered condensed hover responsive>
      <thead>
        <tr>
          <th>Id</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Completion Date</th>
          <th>Title</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {issueRows}
      </tbody>
    </Table>
  )
}

IssueTable.propTypes = {
  issues: PropTypes.object.isRequired, // eslint-disable-line
  deleteIssue: PropTypes.func.isRequired,
}

const IssueRow = (props) => {
  const { issue, deleteIssue } = props
  const {
    _id, status, owner, created,
    effort, completionDate, title,
  } = issue

  function onDeleteClick() {
    deleteIssue(issue._id)
  }

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
      <td>
        <Button bsSize="xsmall" onClick={onDeleteClick}>
          <Glyphicon glyph="trash" />
        </Button>
      </td>
    </tr>
  )
}

IssueRow.propTypes = {
  issue: PropTypes.object.isRequire, // eslint-disable-line
  deleteIssue: PropTypes.func.isRequired,
}

export default IssueList
