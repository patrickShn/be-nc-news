const apiRouter = require('express').Router()

const userRouter = require('./user.router')
const topicRouter = require('./topics.Router')
const commentsRouter = require('./comments.router')
const articlesRouter = require('./articles.router')

const {getDocs} = require('../controllers/api.controller')



apiRouter.get('/',getDocs)


apiRouter.use('/users',userRouter)

apiRouter.use('/topics',topicRouter)

apiRouter.use('/comments',commentsRouter)

apiRouter.use('/articles',articlesRouter)



module.exports = apiRouter;