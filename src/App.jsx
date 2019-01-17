import '@babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  Route, Switch, Redirect, withRouter,
} from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import IssueList from './IssueList.jsx' // eslint-disable-line import/extensions
import IssueEdit from './IssueEdit.jsx' // eslint-disable-line import/extensions

const contentNode = document.getElementById('contents')
const NoMatch = () => <p>Page Not Found</p>

const App = (props) => {
  const { children } = props
  return (
    <div>
      <div className="header">
        <h1>Issue Tracker</h1>
      </div>
      <div className="contents">
        {children}
      </div>
      <div className="footer">
        Full source code available at this
        {' '}
        <a href="https://github.com/vasansr/pro-mern-stack">GitHub repository</a>
      </div>
    </div>
  )
}

App.propTypes = {
  children: PropTypes.object.isRequired, // eslint-disable-line
}

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

ReactDOM.render(<RouterApp />, contentNode)

if (module.hot) {
  module.hot.accept()
}
