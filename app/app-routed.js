const express = require('express')

const app = express()
const cors = require('cors')

app.use(express.json())

const {errorHandlerBadForm,
    errorhandlerinvalid, 
    PSQLerror, 
    TopicNotFoundError, 
    invalidOrderQuery, 
    invalidSortByQuery,
userNotFoundError} = require('./errorhandler.js')

const apiRouter = require('./routes/api.router')

app.use(cors())

app.use('/api',apiRouter)


//error handler


app.use(PSQLerror)
app.use(errorHandlerBadForm)
app.use(TopicNotFoundError)
app.use(userNotFoundError)
app.use(invalidSortByQuery)
app.use(invalidOrderQuery)
app.use(errorhandlerinvalid)

module.exports = app;