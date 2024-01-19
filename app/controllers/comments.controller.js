
const {fetchCommentsByArticleId, addCommentToArticle, removeCommentFromDb, amendCommentVotes} = require('../models/comments.model')



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
    const comment = req.body;
    addCommentToArticle(article_id,comment).then((response) => {
            res.status(201).send(response)
    }).catch((err) => {
        
        next(err)
    })
}

exports.deleteComment = (req,res,next) => {
    const {comment_id} = req.params;
    removeCommentFromDb(comment_id).then((response) => {
        res.status(204).send()
    }).catch((err) => {
        next(err)
    })
}

exports.updateCommentVotesByCommentId = (req,res,next) => {
    const {comment_id} = req.params;
    const {inc_votes} = req.body;
    
   amendCommentVotes(comment_id,inc_votes).then((comment) => {
        res.status(200).send(comment)
    }).catch((err) => {
        next(err)
    })

}