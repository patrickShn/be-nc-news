const db = require('../db/connection')

// exports.findCommentCountForArticles = async (rows) => { 
//     const updatedRowsWithCommentCount = await Promise.all(rows.map( async (row) => {
//     const rowArticleId = row.article_id;
//     const commentCountQuery = await db.query(`SELECT COUNT(*)
//     FROM comments
//     WHERE comments.article_id = ${rowArticleId}`)
//     const commentCount = commentCountQuery.rows[0].count
//     row.commentCount = commentCount
//     return row
// }))
// console.log()
// return updatedRowsWithCommentCount
// }