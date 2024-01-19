const {fetchUsers, fetchUsersById} = require('../models/users.models')

exports.getUsers = (req,res,next) => {
    fetchUsers().then((users) => {
    res.status(200).send({users})
    }) 
}

exports.getUsersById = (req,res,next) => {
const {username} = req.params;
    fetchUsersById(username).then((user) => {
        res.status(200).send({user})
    }).catch((err) => {
        next(err)
    })
}

