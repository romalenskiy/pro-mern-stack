// Configs, vars etc.
import '@babel/polyfill'
import SourceMapSupport from 'source-map-support'
import express from 'express'
import bodyParser from 'body-parser'
import { MongoClient } from 'mongodb'
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
  if (req.query.status) filter.status = req.query.status

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
    .then(result => db.collection('issues').find({ _id: result.insertedId }).limit(1).next())
    .then((addedIssue) => {
      res.json(addedIssue)
    })
    .catch((error) => {
      res.status(500).json({ message: `Internal Server Error: ${error}` })
    })
})
