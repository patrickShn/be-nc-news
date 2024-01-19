const {fetchArticleById, fetchArticles, updateArticleWithVotes, insertNewArticle} = require('../models/articles.models')
const {checkTopicExists} = require('../utils') 

exports.getArticleById = (req,res,next) => {
    const article_id = req.params.article_id;
    fetchArticleById(article_id).then((articles) => {
        res.status(200).send({articles})
    }).catch((err) => {
        next(err)
    })
}


exports.getArticles = (req,res,next) => {
    const {topic, sort_by, order} = req.query;
    const fetchArticlesQuery = fetchArticles(topic,sort_by,order);
    const queries = [fetchArticlesQuery]
    if (topic){
        const topicExistenceQuery = checkTopicExists(topic);
        queries.push(topicExistenceQuery)
    }
    Promise.all(queries).then((responses) => {
        const articles = responses[0]
        res.status(200).send({ articles })
    }).catch((err) => {
        next(err)
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

exports.addNewArticle = (req,res,next) => {
    const newArticle = req.body;
    
    insertNewArticle(newArticle).then((article) => {
        console.log(article)
        res.status(201).send({article})
    }).catch((err) => {
        console.log(err)
            next(err)
    })
}