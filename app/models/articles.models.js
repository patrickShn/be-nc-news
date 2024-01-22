const db = require('../../db/connection')

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

exports.fetchArticles = (topic,sort_by = 'created_at',order = 'DESC', limit = 10, p = 1) => {
    const acceptableSortBy = ['article_id','votes','created_at','comment_count','author','title']
    const acceptableOrder = ['ASC','DESC'];
    if (!acceptableSortBy.includes(sort_by)){
        return Promise.reject({status:400,msg:"invalid sort_by query"})
    }
    if (!acceptableOrder.includes(order)){
        return Promise.reject({status:400,msg:"invalid order type"})
    }
    let queryString = `SELECT 
    articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
    FROM 
    articles 
    LEFT JOIN 
    comments 
    ON articles.article_id = comments.article_id
    WHERE articles.topic = $1 OR $1 IS NULL 
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order};`;
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

exports.insertNewArticle = async (newArticle) => {
    const {author,title,body,topic,article_img_url} = newArticle
    const acceptableTopics = ['mitch','cats','paper']

    if (!acceptableTopics.includes(topic)){
        return Promise.reject({status: 404, msg: "topic is not found"})
    }
    const insertquery = await db.query(`INSERT INTO articles (author,title,topic,body,article_img_url) 
    VALUES
    ($1,$2,$3,$4,$5)`,[author,title,topic,body,article_img_url])

    return db.query(`SELECT articles.*
    FROM articles
    WHERE title = $1;
    `,[title]).then(({rows}) => {
        let newArticle = rows[0]
        newArticle.comment_count = 0
        return newArticle
    })

  
}


