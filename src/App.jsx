class IssueList extends React.Component {
  constructor() {
    super()
    this.state = {
      issues: []
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

        console.log('Total number of records:', data._metadata.total_count)

        data.records.forEach(issue => {
          issue.created = new Date(issue.created)
          if (issue.completionDate) issue.completionDate = new Date(issue.completionDate)
        })

        this.setState({ issues: data.records })
      } else {
        const error = await response.json()
        alert('Failed to fetch issues: ' + error.message)
      }
    } 
    catch (err) {
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
          body: JSON.stringify(newIssue)
        }
      )

      if (response.ok) {
        const updatedIssue = await response.json()
        updatedIssue.created = new Date(updatedIssue.created)
        if (updatedIssue.completionDate) updatedIssue.completionDate = new Date(updatedIssue.completionDate)
  
        const newIssues = this.state.issues.concat(updatedIssue)
        this.setState({ issues: newIssues })
      } else {
        const error = await response.json()
        alert('Failed to add an issue: ' + error.message)
      }

    } 
    catch (err) {
      alert('Error in sending data to server: ' + err.message)
    }
  }

  render() {
    const {issues} = this.state
    return (
      <div>
        <h1>Issue Tracker</h1>
        <IssueFilter />
        <hr/>
        <IssueTable issues={issues} />
        <hr/>
        <IssueAdd createIssue={this.createIssue} />
      </div>
    )
  }
}

class IssueFilter extends React.Component {
  render() {
    return (
      <div>This is a placeholder for the Issue Filter.</div>
    )
  }
}

const IssueTable = (props) => {
  const { issues } = props
  const issueRows = issues.map((issue) => <IssueRow key={issue._id} issue={issue} />)
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
  const {_id, status, owner, created, effort, completionDate, title} = props.issue

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

class IssueAdd extends React.Component {
  constructor() {
    super()

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()
    let form = document.forms.issueAdd
    this.props.createIssue({
      owner: form.owner.value,
      title: form.title.value,
      status: 'New',
      created: new Date()
    })
    // clear the form for the next input
    form.owner.value = ''
    form.title.value = ''
  }

  render() {
    return (
      <div>
        <form name="issueAdd" onSubmit={this.handleSubmit} autoComplete="off">
          <input type="text" name="owner" placeholder="Owner"/>
          <input type="text" name="title" placeholder="Title"/>
          <button type="submit">Add</button>
        </form>
      </div>
    )
  }
}

const contentNode = document.getElementById('contents');
ReactDOM.render(<IssueList />, contentNode)