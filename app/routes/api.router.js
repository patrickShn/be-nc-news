const express = require('express')

const apiRouter = express.Router();

const userRouter = require('./user.router')

const {getDocs} = require('../controllers/api.controller')


apiRouter.get('/',getDocs)

apiRouter.use('/users',userRouter)

module.exports = apiRouter;