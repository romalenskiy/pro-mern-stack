import React from 'react'
import PropTypes from 'prop-types'

import {
  Col, Row, FormGroup, FormControl, ControlLabel,
  InputGroup, ButtonToolbar, Button,
} from 'react-bootstrap'

class IssueFilter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      status: props.initFilter.status || '',
      effort_gte: props.initFilter.effort_gte || '',
      effort_lte: props.initFilter.effort_lte || '',
      changed: false,
    }
    this.onChangeStatus = this.onChangeStatus.bind(this)
    this.onChangeEffortGte = this.onChangeEffortGte.bind(this)
    this.onChangeEffortLte = this.onChangeEffortLte.bind(this)
    this.applyFilter = this.applyFilter.bind(this)
    this.resetFilter = this.resetFilter.bind(this)
    this.clearFilter = this.clearFilter.bind(this)
  }

  onChangeStatus(e) {
    this.setState({ status: e.target.value, changed: true })
  }

  onChangeEffortGte(e) {
    const effortString = e.target.value
    if (effortString.match(/^\d*$/)) this.setState({ effort_gte: e.target.value, changed: true })
  }

  onChangeEffortLte(e) {
    const effortString = e.target.value
    if (effortString.match(/^\d*$/)) this.setState({ effort_lte: e.target.value, changed: true })
  }

  applyFilter() {
    const { status, effort_gte, effort_lte } = this.state
    const { setFilter } = this.props
    const newFilter = {}

    //  Any condition not specified will be undefined, and not an empty string.
    if (status) newFilter.status = status
    if (effort_gte) newFilter.effort_gte = effort_gte
    if (effort_lte) newFilter.effort_lte = effort_lte

    setFilter(newFilter)
    this.setState({
      changed: false,
    })
  }

  clearFilter() {
    const { setFilter } = this.props
    setFilter({})
    this.setState({
      status: '',
      effort_gte: '',
      effort_lte: '',
      changed: false,
    })
  }

  resetFilter() {
    const { initFilter } = this.props
    this.setState({
      status: initFilter.status || '',
      effort_gte: initFilter.effort_gte || '',
      effort_lte: initFilter.effort_lte || '',
      changed: false,
    })
  }

  render() {
    const {
      status, effort_gte, 
      effort_lte, changed 
    } = this.state

    return (
      <Row>
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>Status:</ControlLabel>
            <FormControl componentClass="select" value={status} onChange={this.onChangeStatus}>
              <option value="">(Any)</option>
              <option value="New">New</option>
              <option value="Open">Open</option>
              <option value="Assigned">Assigned</option>
              <option value="Fixed">Fixed</option>
              <option value="Verified">Verified</option>
              <option value="Closed">Closed</option>
            </FormControl>
          </FormGroup>
        </Col>

        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>Effort between:</ControlLabel>
            <InputGroup>
              <FormControl value={effort_gte} onChange={this.onChangeEffortGte} />
              <InputGroup.Addon>-</InputGroup.Addon>
              <FormControl value={effort_lte} onChange={this.onChangeEffortLte} />
            </InputGroup>
          </FormGroup>
        </Col>

        <Col xs={12} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>{' '}</ControlLabel>
            <ButtonToolbar>
              <Button bsStyle="primary" onClick={this.applyFilter}>Apply</Button>
              <Button onClick={this.resetFilter} disabled={!changed}>Reset</Button>
              <Button onClick={this.clearFilter}>Clear</Button>
            </ButtonToolbar>
          </FormGroup>
        </Col>
      </Row>
    )
  }
}

IssueFilter.propTypes = {
  setFilter: PropTypes.func.isRequired,
  initFilter: PropTypes.object.isRequired, // eslint-disable-line
}

export default IssueFilter
