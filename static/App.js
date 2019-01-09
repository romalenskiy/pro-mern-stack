'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IssueList = function (_React$Component) {
  _inherits(IssueList, _React$Component);

  function IssueList() {
    _classCallCheck(this, IssueList);

    var _this = _possibleConstructorReturn(this, (IssueList.__proto__ || Object.getPrototypeOf(IssueList)).call(this));

    _this.state = {
      issues: []
    };

    _this.createIssue = _this.createIssue.bind(_this);
    return _this;
  }

  _createClass(IssueList, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadData();
    }
  }, {
    key: 'loadData',
    value: async function loadData() {
      try {
        var response = await fetch('/api/issues');
        var data = await response.json();

        console.log('Total number of records:', data._metadata.total_count);

        data.records.forEach(function (issue) {
          issue.created = new Date(issue.created);
          if (issue.completionDate) issue.completionDate = new Date(issue.completionDate);
        });

        this.setState({ issues: data.records });
      } catch (err) {
        console.log(err);
      }
    }
  }, {
    key: 'createIssue',
    value: async function createIssue(newIssue) {
      try {
        var response = await fetch('/api/issues', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newIssue)
        });

        if (response.ok) {
          var updatedIssue = await response.json();
          updatedIssue.created = new Date(updatedIssue.created);
          if (updatedIssue.completionDate) updatedIssue.completionDate = new Date(updatedIssue.completionDate);

          var newIssues = this.state.issues.concat(updatedIssue);
          this.setState({ issues: newIssues });
        } else {
          var error = await response.json();
          alert('Failed to add an issue: ' + error.message);
        }
      } catch (err) {
        alert('Error in sending data to server: ' + err.message);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var issues = this.state.issues;

      return React.createElement(
        'div',
        null,
        React.createElement(
          'h1',
          null,
          'Issue Tracker'
        ),
        React.createElement(IssueFilter, null),
        React.createElement('hr', null),
        React.createElement(IssueTable, { issues: issues }),
        React.createElement('hr', null),
        React.createElement(IssueAdd, { createIssue: this.createIssue })
      );
    }
  }]);

  return IssueList;
}(React.Component);

var IssueFilter = function (_React$Component2) {
  _inherits(IssueFilter, _React$Component2);

  function IssueFilter() {
    _classCallCheck(this, IssueFilter);

    return _possibleConstructorReturn(this, (IssueFilter.__proto__ || Object.getPrototypeOf(IssueFilter)).apply(this, arguments));
  }

  _createClass(IssueFilter, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        'This is a placeholder for the Issue Filter.'
      );
    }
  }]);

  return IssueFilter;
}(React.Component);

var IssueTable = function IssueTable(props) {
  var issues = props.issues;

  var issueRows = issues.map(function (issue) {
    return React.createElement(IssueRow, { key: issue.id, issue: issue });
  });
  return React.createElement(
    'table',
    { className: 'bordered-table' },
    React.createElement(
      'thead',
      null,
      React.createElement(
        'tr',
        null,
        React.createElement(
          'th',
          null,
          'Id'
        ),
        React.createElement(
          'th',
          null,
          'Status'
        ),
        React.createElement(
          'th',
          null,
          'Owner'
        ),
        React.createElement(
          'th',
          null,
          'Created'
        ),
        React.createElement(
          'th',
          null,
          'Effort'
        ),
        React.createElement(
          'th',
          null,
          'Completion Date'
        ),
        React.createElement(
          'th',
          null,
          'Title'
        )
      )
    ),
    React.createElement(
      'tbody',
      null,
      issueRows
    )
  );
};

var IssueRow = function IssueRow(props) {
  var _props$issue = props.issue,
      id = _props$issue.id,
      status = _props$issue.status,
      owner = _props$issue.owner,
      created = _props$issue.created,
      effort = _props$issue.effort,
      completionDate = _props$issue.completionDate,
      title = _props$issue.title;


  return React.createElement(
    'tr',
    null,
    React.createElement(
      'td',
      null,
      id
    ),
    React.createElement(
      'td',
      null,
      status
    ),
    React.createElement(
      'td',
      null,
      owner
    ),
    React.createElement(
      'td',
      null,
      created.toDateString()
    ),
    React.createElement(
      'td',
      null,
      effort
    ),
    React.createElement(
      'td',
      null,
      completionDate ? completionDate.toDateString() : ''
    ),
    React.createElement(
      'td',
      null,
      title
    )
  );
};

var IssueAdd = function (_React$Component3) {
  _inherits(IssueAdd, _React$Component3);

  function IssueAdd() {
    _classCallCheck(this, IssueAdd);

    var _this3 = _possibleConstructorReturn(this, (IssueAdd.__proto__ || Object.getPrototypeOf(IssueAdd)).call(this));

    _this3.handleSubmit = _this3.handleSubmit.bind(_this3);
    return _this3;
  }

  _createClass(IssueAdd, [{
    key: 'handleSubmit',
    value: function handleSubmit(e) {
      e.preventDefault();
      var form = document.forms.issueAdd;
      this.props.createIssue({
        owner: form.owner.value,
        title: form.title.value,
        status: 'New',
        created: new Date()
      });
      // clear the form for the next input
      form.owner.value = '';
      form.title.value = '';
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'form',
          { name: 'issueAdd', onSubmit: this.handleSubmit, autoComplete: 'off' },
          React.createElement('input', { type: 'text', name: 'owner', placeholder: 'Owner' }),
          React.createElement('input', { type: 'text', name: 'title', placeholder: 'Title' }),
          React.createElement(
            'button',
            { type: 'submit' },
            'Add'
          )
        )
      );
    }
  }]);

  return IssueAdd;
}(React.Component);

var contentNode = document.getElementById('contents');
ReactDOM.render(React.createElement(IssueList, null), contentNode);