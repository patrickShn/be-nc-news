const express = require('express')
const fs = require('fs/promises')

const app = express();

const docs = require('../endpoints.json')

const {errorHandlerBadForm,errorhandlerinvalid} = require('./errorhandler.js')

const {getTopics} = require('./controllers/topics.controller');
const {getArticleById} = require('./controllers/articles.controller')



app.get('/api/topics',getTopics)


app.get('/api/articles/:article_id',getArticleById)
app.get('/api', getDocs)


function getDocs (req,res){
    return res.status(200).send(docs)
}

app.use(errorHandlerBadForm)
app.use(errorhandlerinvalid)






module.exports = app;