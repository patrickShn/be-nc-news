const express = require('express')

const app = express();

app.use(express.json())

const {errorHandlerBadForm,errorhandlerinvalid, psqlerror} = require('./errorhandler.js')

const {getDocs} = require('./controllers/api.controller.js')

const {getTopics} = require('./controllers/topics.controller');

const {getArticleById, getArticles, patchArticleWithUpdatedVotes} = require('./controllers/articles.controller')

const {getCommentsByArticleId, postCommentOnSpecificArticle} = require('./controllers/comments.controller.js')


//get requests

app.get('/api/topics',getTopics)

app.get('/api/articles/:article_id',getArticleById)

app.get('/api', getDocs)

app.get('/api/articles',getArticles)

app.get('/api/articles/:article_id/comments',getCommentsByArticleId)

//post reqeusts

app.post('/api/articles/:article_id/comments',postCommentOnSpecificArticle)

//patch 

app.patch(`/api/articles/:article_id`,patchArticleWithUpdatedVotes)


//error


app.use(psqlerror)
app.use(errorHandlerBadForm)
app.use(errorhandlerinvalid)






module.exports = app;