// Configs, vars etc.
import '@babel/polyfill'
import SourceMapSupport from 'source-map-support'
import express from 'express'
import bodyParser from 'body-parser'
import { MongoClient, ObjectId } from 'mongodb'
import path from 'path'

import Issue from './issue'

const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const config = require('../webpack.config')


SourceMapSupport.install()

const app = express()
let db

app.use(express.static('static'))
app.use(bodyParser.json())

app.set('json spaces', 2) // pretty-print any JSON

// HMR middleware for express
if (process.env.NODE_ENV !== 'production') {
  config.entry.app.push('webpack-hot-middleware/client',
    'webpack/hot/only-dev-server')
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
  const bundler = webpack(config)
  app.use(webpackDevMiddleware(bundler, { noInfo: true }))
  app.use(webpackHotMiddleware(bundler, { log: console.log }))
}

// MongoDB
MongoClient.connect('mongodb://localhost/issuetracker', { useNewUrlParser: true })
  .then((connection) => {
    db = connection.db()
    app.listen(3000, () => { console.log('App started on port 3000') })
  })
  .catch((error) => {
    console.log('ERROR: ', error)
  })

// Get
app.get('/api/issues', (req, res) => {
  const filter = {}
  const { query } = req
  if (query.status) filter.status = req.query.status
  if (query.effort_lte || query.effort_gte) filter.effort = {}
  if (query.effort_lte) filter.effort.$lte = parseInt(query.effort_lte, 10)
  if (query.effort_gte) filter.effort.$gte = parseInt(query.effort_gte, 10)

  db.collection('issues').find(filter).toArray()
    .then((issues) => {
      const metadata = { total_count: issues.length }
      res.json({ _metadata: metadata, records: issues })
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({ message: `Internal Server Error: ${error}` })
    })
})

app.get('/api/issues/:id', (req, res) => {
  let issueId
  try {
    issueId = new ObjectId(req.params.id)
  } catch (error) {
    res.status(422).json({ message: `Invalid issue ID format: ${error}` })
    return
  }

  db.collection('issues').findOne({ _id: issueId })
    .then((issue) => {
      if (!issue) res.status(404).json({ message: `No such issue: ${issueId}` })
      else res.json(issue)
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({ message: `Internal Server Error: ${error}` })
    })
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve('static/index.html'))
})

// Post
app.post('/api/issues', (req, res) => {
  const newIssue = req.body
  newIssue.created = new Date()
  if (!newIssue.status) newIssue.status = 'New'

  const err = Issue.validateIssue(newIssue)
  if (err) {
    res.status(422).json({ message: `Invalid request: ${err}` })
    return
  }

  db.collection('issues').insertOne(Issue.cleanupIssue(newIssue))
    .then(result => db.collection('issues').findOne({ _id: result.insertedId }))
    .then((addedIssue) => {
      res.json(addedIssue)
    })
    .catch((error) => {
      res.status(500).json({ message: `Internal Server Error: ${error}` })
    })
})

// Put
app.put('/api/issues/:id', (req, res) => {
  let issueId
  try {
    issueId = new ObjectId(req.params.id)
  } catch (error) {
    res.status(422).json({ message: `Invalid issue ID format: ${error}` })
    return
  }

  const issue = req.body
  delete issue._id

  const err = Issue.validateIssue(issue)
  if (err) {
    res.status(422).json({ message: `Invalid request: ${err}` })
    return
  }

  db.collection('issues').update({ _id: issueId }, Issue.convertIssue(issue))
    .then(() => db.collection('issues').findOne({ _id: issueId }))
    .then(savedIssue => res.json(savedIssue))
    .catch((error) => {
      console.log(error)
      res.status(500).json({ message: `Internal Server Error: ${error}` })
    })
})

// Delete
app.delete('/api/issues/:id', (req, res) => {
  let issueId
  try {
    issueId = new ObjectId(req.params.id)
  } catch (error) {
    res.status(422).json({ message: `Invalid issue ID format: ${error}` })
    return
  }

  db.collection('issues').deleteOne({ _id: issueId })
    .then((deleteResult) => {
      if (deleteResult.result.n === 1) res.json({ status: 'OK' })
      else res.json({ status: 'Warning: object not found!' })
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({ message: `Internal Server Error: ${error}` })
    })
})
