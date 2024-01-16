const express = require('express')

const app = express();

const {errorHandlerBadForm,errorhandlerinvalid} = require('./errorhandler.js')

const {getDocs} = require('./controllers/api.controller.js')

const {getTopics} = require('./controllers/topics.controller');

const {getArticleById, getArticles} = require('./controllers/articles.controller')



app.get('/api/topics',getTopics)

app.get('/api/articles/:article_id',getArticleById)

app.get('/api', getDocs)

app.get('/api/articles',getArticles)


app.use(errorHandlerBadForm)
app.use(errorhandlerinvalid)






module.exports = app;