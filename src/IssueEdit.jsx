import React from 'react'
import PropTypes from 'prop-types'

import {
  FormGroup, FormControl, ControlLabel,
  ButtonToolbar, Button,
  Panel, Form, Col, Alert,
} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import NumInput from './NumInput.jsx' // eslint-disable-line import/extensions
import DateInput from './DateInput.jsx' // eslint-disable-line import/extensions
import Toast from './Toast.jsx' // eslint-disable-line import/extensions

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
      showingValidation: false,
      toastVisible: false,
      toastMessage: '',
      toastType: 'success',
    }

    this.onChange = this.onChange.bind(this)
    this.onValidityChange = this.onValidityChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.dismissValidation = this.dismissValidation.bind(this)
    this.showValidation = this.showValidation.bind(this)
    this.showSuccess = this.showSuccess.bind(this)
    this.showError = this.showError.bind(this)
    this.dismissToast = this.dismissToast.bind(this)
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

    this.showValidation()

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

        this.showSuccess('Updated issue successfully')
      } else {
        const error = await response.json()
        this.showError(`Failed to update issue: ${error.message}`)
      }
    } catch (err) {
      this.showError(`Error in sending data to server: ${err.message}`)
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
        this.showError(`Failed to fetch issue: ${error.message}`)
      }
    } catch (err) {
      this.showError(`Error in fetching data from server: ${err.message}`)
    }
  }

  showSuccess(message) {
    this.setState({ toastVisible: true, toastMessage: message, toastType: 'success' })
  }

  showError(message) {
    this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger' })
  }

  dismissToast() {
    this.setState({ toastVisible: false })
  }

  showValidation() {
    this.setState({ showingValidation: true })
  }

  dismissValidation() {
    this.setState({ showingValidation: false })
  }

  render() {
    const {
      issue, invalidFields, showingValidation,
      toastVisible, toastMessage, toastType,
    } = this.state
    let validationMessage = null
    if (Object.keys(invalidFields).length !== 0 && showingValidation) {
      validationMessage = (
        <Alert bsStyle="danger" onDismiss={this.dismissValidation}>
          Please, correct invalid fields before submitting!
        </Alert>
      )
    }
    // "key" prop in <form> needed to implement this pattern --> https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key
    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title>Edit Issue</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Form horizontal autoComplete="off" key={issue._id} onSubmit={this.onSubmit}>

            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>ID:</Col>
              <Col sm={9}>
                <FormControl.Static>{issue._id}</FormControl.Static>
              </Col>
            </FormGroup>

            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>Created:</Col>
              <Col sm={9}>
                <FormControl.Static>{issue.created ? issue.created.toDateString() : ''}</FormControl.Static>
              </Col>
            </FormGroup>

            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>Status:</Col>
              <Col sm={9}>
                <FormControl componentClass="select" name="status" value={issue.status} onChange={this.onChange}>
                  <option value="New">New</option>
                  <option value="Open">Open</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Fixed">Fixed</option>
                  <option value="Verified">Verified</option>
                  <option value="Closed">Closed</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>Owner:</Col>
              <Col sm={9}>
                <FormControl name="owner" value={issue.owner} onChange={this.onChange} />
              </Col>
            </FormGroup>

            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>Effort:</Col>
              <Col sm={9}>
                <FormControl componentClass={NumInput} name="effort" value={issue.effort} onChange={this.onChange} />
              </Col>
            </FormGroup>

            <FormGroup validationState={invalidFields.completionDate ? 'error' : null}>
              <Col componentClass={ControlLabel} sm={2}>Completion Date:</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={DateInput}
                  name="completionDate"
                  value={issue.completionDate}
                  onChange={this.onChange}
                  onValidityChange={this.onValidityChange}
                />
                <FormControl.Feedback />
              </Col>
            </FormGroup>

            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>Title:</Col>
              <Col sm={9}>
                <FormControl name="title" value={issue.title} onChange={this.onChange} />
              </Col>
            </FormGroup>

            <FormGroup>
              <Col smOffset={2} sm={6}>
                <ButtonToolbar>
                  <Button bsStyle="primary" type="submit">Submit</Button>
                  <LinkContainer to="/issues">
                    <Button bsStyle="link">Back</Button>
                  </LinkContainer>
                </ButtonToolbar>
              </Col>
            </FormGroup>

            <FormGroup>
              <Col smOffset={2} sm={9}>{validationMessage}</Col>
            </FormGroup>

          </Form>
        </Panel.Body>

        <Toast
          bsStyle={toastType}
          showing={toastVisible}
          message={toastMessage}
          onDismiss={this.dismissToast}
        />
      </Panel>
    )
  }
}

IssueEdit.propTypes = {
  params: PropTypes.object.isRequired, // eslint-disable-line
  match: PropTypes.object.isRequired, // eslint-disable-line
}

export default IssueEdit
