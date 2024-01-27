const express = require('express')

const userRouter = express.Router()

const {getUsers, getUsersByUsername} = require('../controllers/users.controllers')


userRouter.get('/',getUsers)

userRouter.get('/:username',getUsersByUsername)



module.exports = userRouter