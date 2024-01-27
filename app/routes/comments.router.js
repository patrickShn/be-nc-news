const commentsRouter = require('express').Router()

const {updateCommentVotesByCommentId, deleteComment} = require('../controllers/comments.controller')


commentsRouter.route('/:comment_id')
.patch(updateCommentVotesByCommentId)
.delete(deleteComment)





module.exports = commentsRouter