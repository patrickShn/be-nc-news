const express = require('express')

const app = express();

// const handleErrors = require('errorhandler.js')

const {getTopics} = require('./controllers/topics.controller')


// app.use(handleErrors)


app.get('/api/topics',getTopics)

module.exports = app;