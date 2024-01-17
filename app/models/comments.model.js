const db = require('../../db/connection')

exports.fetchCommentsByArticleId = (article_id) => {
    let queryStr = `SELECT
     * FROM 
    comments 
    WHERE comments.article_id = ${article_id}
     ORDER BY created_at DESC`
    return db.query(queryStr).then(({rows}) => {
        if (rows.length === 0){
        return Promise.reject(rows)
        }
        return rows
    }).catch((err) => {
        return Promise.reject(err)
    })
}


