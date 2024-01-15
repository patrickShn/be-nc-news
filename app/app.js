const express = require('express')
const fs = require('fs/promises')

const app = express();

// const handleErrors = require('errorhandler.js')

const {getTopics} = require('./controllers/topics.controller');
const { Console } = require('console');







// app.use(handleErrors)


app.get('/api/topics',getTopics)

//reads the file
//returns the endpoints.json file when you make this request
//don't know if i have actually changed it or what 

app.get('/api', (req,res) => {
    fs.readFile('endpoints.json','utf-8',(err,data) => {
        if (err) {
            console.log(err)
            return new Error;
        }
        else {
            console.log(JSON.stringify(data))
            return data
        }
    }).then((response) => {
            res.status(200).send(JSON.parse(response))
        }).catch((err) => {
            Console.log("err")
            next(err)
        })
    })






module.exports = app;