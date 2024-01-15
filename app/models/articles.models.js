const db = require('../../db/connection')


exports.fetchArticleById = (article_id) => {
   return db.query(`SELECT * FROM articles WHERE article_id = $1;`,[article_id]).then(({rows}) => {
    if (rows.length === 0){
        throw new Error("Invalid id")
    }
    return rows[0]
    }).catch((err) => {
        throw err
    })
}
   
