const db = require('../../db/connection')
const findCommentCountForArticles = require('../utils')

// where i am at:

// problem: the sql injection prveention (using $1 EventCounts.) is not working. fix that
// need to order the articles from oldest to youngest 
// u got this:)

exports.fetchArticleById = (article_id) => {
   return db.query(`SELECT * FROM articles WHERE article_id = $1;`,[article_id]).then(({rows}) => {
    if (rows.length === 0){
        return Promise.reject({status:404, msg: "invalid id"})
    }
    return rows[0]
    })
}

exports.fetchArticles = async (sort_by = 'created_at', order = 'DESC') => {
  
    let queryString = `SELECT 
    articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url
    FROM 
    articles JOIN 
    comments 
    ON articles.article_id = comments.article_id
     ORDER BY articles.${sort_by} ${order};`;
    return db.query(queryString).then( async ({rows}) => {
        console.log(rows)
        //async
            const updatedRows = await Promise.all(rows.map( async (row) => {
                const rowArticleId = row.article_id;
                const commentCountQuery = await db.query(`SELECT COUNT(*)
                FROM comments
                WHERE comments.article_id = ${rowArticleId}`)
                const commentCount = commentCountQuery.rows[0].count
                row.commentCount = commentCount
                return row
            }))
        return updatedRows
    
    }).catch((err) => {
        console.log(err,"line43")
        next(err)
    })
    

}
   
