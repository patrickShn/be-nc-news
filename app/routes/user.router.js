const express = require('express')

const userRouter = express.Router()

const {getUsers} = require('../controllers/users.controllers')


userRouter.get('/',getUsers)



module.exports = userRouter