const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const ssl = require('./ssl')

const app = express()

app.use(logger('dev'))
app.use(bodyParser.json({
  limit: '1mb'
}))

app.post('/', (req, res) => {
  ssl(req.body)
    .then(stdout => {
      res.json({
        stdout: stdout
      })
    })
    .catch(e => {
      res.json(e)
    })
})

app.use((req, res, next) => {
  res.status(404)
  res.send('Not Found')
})

module.exports = app
