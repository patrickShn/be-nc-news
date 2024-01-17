const {fetchArticleById, fetchArticles, updateArticleWithVotes} = require('../models/articles.models')


exports.getArticleById = (req,res,next) => {
    const article_id = req.params.article_id;
    fetchArticleById(article_id).then((response) => {
        res.status(200).send(response)
    }).catch((err) => {
        next(err)
    })
}


exports.getArticles = (req,res,next) => {
    fetchArticles().then((articles) => {
        res.status(200).send(articles)
    })
}

exports.patchArticleWithUpdatedVotes = (req,res,next) => {
    const {article_id} = req.params;
    const {inc_votes} = req.body;
    updateArticleWithVotes(article_id, inc_votes).then((articles) => {
        const article = articles[0] 
        res.status(200).send({article})
    }).catch((err) => {
        next(err)
    })

}