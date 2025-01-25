const express = require('express')
const cors = require('cors')
const blocksRouter = require('./routes/blocks')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/blocks', blocksRouter)

module.exports = app