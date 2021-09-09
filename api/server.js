const express = require('express')
const helmet = require('helmet')
const SchemeRouter = require('./schemes/scheme-router.js')

const server = express()

server.use(express.json())
server.use(helmet())
server.use('/api/schemes', SchemeRouter)

module.exports = server
