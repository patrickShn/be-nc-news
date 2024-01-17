const {fetchCommentsByArticleId} = require('../models/comments.model')



/// invalid id error


exports.getCommentsByArticleId = (req,res,next) => {
    const article_id = req.params.article_id;
    fetchCommentsByArticleId(article_id).then((comments) => {
        if (comments.length === 0){
            next(comments)
        }
        res.status(200).send(comments)
    }).catch((err)=> {
        next(err)
    })
}