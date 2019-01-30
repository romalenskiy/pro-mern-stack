import '@babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  Route, Switch, Redirect, withRouter,
} from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import {
  Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon,
} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import IssueList from './IssueList.jsx' // eslint-disable-line import/extensions
import IssueEdit from './IssueEdit.jsx' // eslint-disable-line import/extensions
import IssueAddNavItem from './IssueAddNavItem.jsx' // eslint-disable-line import/extensions

const App = (props) => {
  const { children } = props
  return (
    <div>
      <Header />
      <div className="container-fluid">
        {children}
        <hr />
        <h5>
          <small>
            Full source code available at this
            {' '}
            <a href="https://github.com/vasansr/pro-mern-stack">GitHub repository</a>
          </small>
        </h5>
      </div>
    </div>
  )
}

App.propTypes = {
  children: PropTypes.object.isRequired, // eslint-disable-line
}

const Header = () => (
  <Navbar fluid>
    <Navbar.Header>
      <Navbar.Brand>Issue Tracker</Navbar.Brand>
    </Navbar.Header>

    <Nav>
      <LinkContainer to="/issues">
        <NavItem>Issues</NavItem>
      </LinkContainer>
      <LinkContainer to="/reports">
        <NavItem>Reports</NavItem>
      </LinkContainer>
    </Nav>

    <Nav pullRight>
      <IssueAddNavItem />
      <NavDropdown id="user-dropdown" title={<Glyphicon glyph="option-horizontal" />} noCaret>
        <MenuItem>Logout</MenuItem>
      </NavDropdown>
    </Nav>
  </Navbar>
)

const NoMatch = () => <p>Page Not Found</p>

const RouterApp = () => (
  <BrowserRouter>
    <App>
      <Switch>
        <Route
          exact
          path="/"
          render={() => <Redirect to="/issues" />}
        />
        <Route exact path="/issues" component={withRouter(IssueList)} />
        <Route path="/issues/:id" component={withRouter(IssueEdit)} />
        <Route path="*" component={NoMatch} />
      </Switch>
    </App>
  </BrowserRouter>
)

const contentNode = document.getElementById('contents')
ReactDOM.render(<RouterApp />, contentNode)

if (module.hot) {
  module.hot.accept()
}
