const db = require('../../db/connection')
const { articleData } = require('../../db/data/test-data')

exports.fetchArticleById = (article_id) => {
   return db.query(`SELECT 
   articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
   FROM 
   articles 
   LEFT JOIN 
   comments 
   ON articles.article_id = comments.article_id
   WHERE articles.article_id = $1 OR $1 IS NULL 
   GROUP BY articles.article_id
   ORDER BY created_at DESC;`,[article_id]).then(({rows}) => {
    if (rows.length === 0){
        return Promise.reject({status:400, msg: "invalid id"})
    }
    return rows[0]
    })
}

exports.fetchArticles = async (topic) => {
    let queryString = `SELECT 
    articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
    FROM 
    articles 
    LEFT JOIN 
    comments 
    ON articles.article_id = comments.article_id
    WHERE articles.topic = $1 OR $1 IS NULL 
    GROUP BY articles.article_id
    ORDER BY created_at DESC;`;
    return db.query(queryString, [topic]).then(({rows}) => {
        return rows
    })
}


exports.updateArticleWithVotes = (article_id, inc_votes) => {

    return db.query(
        `UPDATE articles
        SET votes =  votes + ${inc_votes}
        WHERE article_id = ${article_id}
        RETURNING *`
        ).then(({rows}) => {
            if (rows.length === 0){
                return Promise.reject({status: 404, msg:"invalid id"})
            }
            return rows;
        })

}
   
