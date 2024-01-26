const express = require('express')

const app = express();

app.use(express.json())

const {errorHandlerBadForm,
    errorhandlerinvalid, 
    PSQLerror, 
    TopicNotFoundError, 
    invalidOrderQuery, 
    invalidSortByQuery,
userNotFoundError} = require('./errorhandler.js')

const {getDocs} = require('./controllers/api.controller.js')

const {getTopics} = require('./controllers/topics.controller.js');

const {getArticleById, getArticles, patchArticleWithUpdatedVotes, addNewArticle} = require('./controllers/articles.controller.js')

const {getCommentsByArticleId, postCommentOnSpecificArticle, deleteComment, updateCommentVotesByCommentId} = require('./controllers/comments.controller.js')

const {getUsers, getUsersByUsername} = require('./controllers/users.controllers.js')
//get requests

app.get('/api',getDocs)

app.get('/api/topics',getTopics)

app.get('/api/articles/:article_id',getArticleById)

app.get('/api/articles?:topic?:limit?:p',getArticles)

app.get('/api/articles/:article_id/comments',getCommentsByArticleId)

app.get('/api/users',getUsers)

app.get('/api/users/:username',getUsersByUsername)


//post reqeusts

app.post('/api/articles/:article_id/comments',postCommentOnSpecificArticle)

app.post('/api/articles',addNewArticle)

//patch 

app.patch(`/api/articles/:article_id`,patchArticleWithUpdatedVotes)

app.patch(`/api/comments/:comment_id`, updateCommentVotesByCommentId)


//delete 

app.delete(`/api/comments/:comment_id`,deleteComment)

//error


app.use(PSQLerror)
app.use(errorHandlerBadForm)
app.use(TopicNotFoundError)
app.use(userNotFoundError)
app.use(invalidSortByQuery)
app.use(invalidOrderQuery)
app.use(errorhandlerinvalid)






module.exports = app;