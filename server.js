// Configs, vars etc.
const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

const app = express()
let db

app.use(express.static('static'))
app.use(bodyParser.json())

app.set('json spaces', 2) // pretty-print any JSON

// MongoDB
MongoClient.connect('mongodb://localhost/issuetracker', { useNewUrlParser: true })
  .then(connection => {
    db = connection.db()
    app.listen(3000, () => {console.log('App started on port 3000')})
  })
  .catch(error => {
    console.log('ERROR: ', error)
  })

// Get
app.get('/api/issues', (req, res) => {
  db.collection('issues').find().toArray()
    .then(issues => {
      const metadata = { total_count: issues.length }
      res.json({ _metadata: metadata, records: issues })
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ message: `Internal Server Error: ${error}` })
    })
})

// Post
const validIssueStatus = {
  New: true,
  Open: true,
  Assigned: true,
  Fixed: true,
  Verified: true,
  Closed: true,
}

const issueFieldType = {
  status: 'required',
  owner: 'required',
  effort: 'optional',
  created: 'required',
  completionDate: 'optional',
  title: 'required',
}

const validateIssue = (issue) => {
  for (const field in issue) {
    const type = issueFieldType[field]
    if (!type) {
      delete issue[field]
    } else if (type === 'required' && !issue[field]) {
      return `${field} is required!`
    }
  }

  if (!validIssueStatus[issue.status]) return `${issue.status} is not a valid status!`

  return null
}

app.post('/api/issues', (req, res) => {
  const newIssue = req.body
  newIssue.created = new Date()
  if (!newIssue.status) newIssue.status = 'New'

  const err = validateIssue(newIssue)
  if (err) {
    res.status(422).json({ message: `Invalid request: ${err}` })
    return
  }
  
  db.collection('issues').insertOne(newIssue)
    .then(result => {
      return db.collection('issues').find({ _id: result.insertedId }).limit(1).next()
    })
    .then(addedIssue => {
      res.json(addedIssue)
    })
    .catch(error => {
      res.status(500).json({ message: `Internal Server Error: ${error}` })
    })
})