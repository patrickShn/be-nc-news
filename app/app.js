const express = require('express')
const app = express();
const {errorHandler} = require('./errorhandler')
const {getTopics} = require('./controllers/topics.controller')



app.use(express.json())

app.get('/api/topics',getTopics)



app.use(errorHandler);


module.exports = app;