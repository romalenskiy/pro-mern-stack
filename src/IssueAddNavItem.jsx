import React from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'

import {
  NavItem, Glyphicon, Modal, Form, FormGroup, FormControl,
  ControlLabel, Button, ButtonToolbar,
} from 'react-bootstrap'

import Toast from './Toast.jsx' // eslint-disable-line import/extensions

class IssueAddNavItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showing: false,
      toastVisible: false,
      toastMessage: '',
      toastType: 'success',
    }

    this.showModal = this.showModal.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.submit = this.submit.bind(this)
    this.showError = this.showError.bind(this)
    this.dismissToast = this.dismissToast.bind(this)
  }

  async submit(e) {
    e.preventDefault()
    this.hideModal()
    try {
      const { history } = this.props
      const form = document.forms.issueAdd
      const newIssue = {
        owner: form.owner.value,
        title: form.title.value,
        status: 'New',
        created: new Date(),
      }

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
        history.push(`/issues/${updatedIssue._id}`)
      } else {
        const error = await response.json()
        this.showError(`Failed to add issue: ${error.message}`)
      }
    } catch (err) {
      this.showError(`Error in sending data to server: ${err.message}`)
    }
  }

  showModal() {
    this.setState({ showing: true })
  }

  hideModal() {
    console.log('TEST')
    this.setState({ showing: false })
  }

  showError(message) {
    this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger' })
  }

  dismissToast() {
    this.setState({ toastVisible: false })
  }

  render() {
    const {
      showing, toastType, toastMessage, toastVisible,
    } = this.state
    return (
      <NavItem onClick={this.showModal}>
        <Glyphicon glyph="plus" />{' '}Create Issue

        <Modal keyboard show={showing} onHide={this.hideModal}>

          <Modal.Header closeButton>
            <Modal.Title>Create Issue</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form name="issueAdd">

              <FormGroup>
                <ControlLabel>Title</ControlLabel>
                <FormControl name="title" autoFocus />
              </FormGroup>

              <FormGroup>
                <ControlLabel>Owner</ControlLabel>
                <FormControl name="owner" />
              </FormGroup>

            </Form>
          </Modal.Body>

          <Modal.Footer>
            <ButtonToolbar>
              <Button type="button" bsStyle="primary" onClick={this.submit}>Submit</Button>
              <Button bsStyle="link" onClick={this.hideModal}>Cancel</Button>
            </ButtonToolbar>
          </Modal.Footer>
        </Modal>

        <Toast
          bsStyle={toastType}
          showing={toastVisible}
          message={toastMessage}
          onDismiss={this.dismissToast}
        />
      </NavItem>
    )
  }
}

IssueAddNavItem.propTypes = {
  history: PropTypes.object // eslint-disable-line
}

export default withRouter(IssueAddNavItem)
