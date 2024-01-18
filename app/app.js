const express = require('express')

const app = express();

app.use(express.json())

const {errorHandlerBadForm,errorhandlerinvalid, PSQLerror, TopicNotFoundError} = require('./errorhandler.js')

const {getDocs} = require('./controllers/api.controller.js')

const {getTopics} = require('./controllers/topics.controller');

const {getArticleById, getArticles, patchArticleWithUpdatedVotes} = require('./controllers/articles.controller')

const {getCommentsByArticleId, postCommentOnSpecificArticle, deleteComment} = require('./controllers/comments.controller.js')

const {getUsers} = require('./controllers/users.controllers.js')
//get requests

app.get('/api/topics',getTopics)

app.get('/api/articles/:article_id',getArticleById)

app.get('/api', getDocs)

app.get('/api/articles?:topic',getArticles)

app.get('/api/articles/:article_id/comments',getCommentsByArticleId)

app.get('/api/users',getUsers)


//post reqeusts

app.post('/api/articles/:article_id/comments',postCommentOnSpecificArticle)

//patch 

app.patch(`/api/articles/:article_id`,patchArticleWithUpdatedVotes)


//delete 

app.delete(`/api/comments/:comment_id`,deleteComment)

//error


app.use(PSQLerror)
app.use(errorHandlerBadForm)
app.use(TopicNotFoundError)
app.use(errorhandlerinvalid)






module.exports = app;