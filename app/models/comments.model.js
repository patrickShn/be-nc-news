const db = require('../../db/connection')

exports.fetchCommentsByArticleId = (article_id) => {
    let queryStr = `SELECT
     * FROM 
    comments 
    WHERE comments.article_id = ${article_id}
     ORDER BY created_at DESC`
    return db.query(queryStr).then(({rows}) => {
        if (rows.length === 0){
        return Promise.reject({status:400, msg: "invalid id"})
        }
        return rows
    })
}

exports.addCommentToArticle = (article_id, comment) => {
    const body = comment.body;
    const author = comment.author;
    return db.query(`INSERT INTO comments (author, body, article_id)
    VALUES
    ($1 ,$2, $3)
    RETURNING 
    *;`, [author, body, `${article_id}`])
    .then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status:401, msg: "bad input"})
        }
        return rows[0]
    })
}

exports.removeCommentFromDb = (comment_id) => {

    return db.query(`
    DELETE FROM comments
    WHERE comment_id = $1 RETURNING *`,[comment_id]).then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status: 400 ,msg: "invalid id"})
        }
        return rows;
    })

}


