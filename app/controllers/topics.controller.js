const {fetchTopics} = require('../models/topics.model')


exports.getTopics = (req,res,next) => {
    console.log(req.path)
    fetchTopics().then((topics) => {
        res.status(200).send({topics})
    }).catch((err) => {
        console.log(err)
        next(err)
    })
}

