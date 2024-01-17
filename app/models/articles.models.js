const db = require('../../db/connection')
const findCommentCountForArticles = require('../utils')

// where i am at:

// problem: the sql injection prveention (using $1 EventCounts.) is not working. fix that
// need to order the articles from oldest to youngest 
// u got this:)

exports.fetchArticleById = (article_id) => {
   return db.query(`SELECT * FROM articles WHERE article_id = $1;`,[article_id]).then(({rows}) => {
    if (rows.length === 0){
        return Promise.reject(rows)
    }
    return rows[0]
    })
}

exports.fetchArticles = async (sort_by = 'created_at', order = 'DESC') => {
    let queryString = `SELECT 
    articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
    FROM 
    articles 
    LEFT JOIN 
    comments 
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order};`;
    return db.query(queryString).then(({rows}) => {
        return rows
    }).catch((err) => {
        next(err)
    })
    

}
   
