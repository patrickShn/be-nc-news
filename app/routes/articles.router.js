const express = require('express')

const articlesRouter = express.Router()

const {getArticleById, getArticles, patchArticleWithUpdatedVotes, addNewArticle} = require('../controllers/articles.controller')

const {postCommentOnSpecificArticle, getCommentsByArticleId} = require('../controllers/comments.controller')


articlesRouter.route('/:article_id/comments').post(postCommentOnSpecificArticle).get(getCommentsByArticleId)

articlesRouter.post('/',addNewArticle)

articlesRouter.get('/',getArticles)

articlesRouter.route('/:article_id')
.get(getArticleById)
.patch(patchArticleWithUpdatedVotes)





module.exports = articlesRouter