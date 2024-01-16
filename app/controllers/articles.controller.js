const {fetchArticleById, fetchArticles} = require('../models/articles.models')


exports.getArticleById = (req,res,next) => {
    const article_id = req.params.article_id;
    fetchArticleById(article_id).then((response) => {
        res.status(200).send(response)
    }).catch((err) => {
        next(err)
    })
}


exports.getArticles = (req,res,next) => {

    fetchArticles().then((response) => {
        res.status(200).send(response)
    }).catch((err) => {
        next(err)
    })
}