const { promises } = require('supertest/lib/test');
const {fetchCommentsByArticleId, addCommentToArticle} = require('../models/comments.model')



/// invalid id error


exports.getCommentsByArticleId = (req,res,next) => {
    const article_id = req.params.article_id;
    fetchCommentsByArticleId(article_id).then((comments) => {
        if (comments.length === 0){
            Promise.reject({status:400, msg: "invalid id"})
        }
        res.status(200).send(comments)
    }).catch((err)=> {
        next(err)
    })
}

exports.postCommentOnSpecificArticle = (req,res,next) => {
    const {article_id} = req.params;
    const comment = req.body
    addCommentToArticle(article_id,comment).then((response) => {
            res.status(201).send(response)
    }).catch((err) => {
        next(err)
    })
}