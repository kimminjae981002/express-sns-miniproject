const Post = require('../models/posts.model')
const Comment = require('../models/comments.model')

// passport에서 제공하는 인증 미들웨어
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/posts");
  }

  next();
}

// post를 만든 사람인지 미들웨어
function checkPostOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Post.findById(req.params.id)
      .then((post) => {
        if (post.author.id.equals(req.user._id)) {
          req.post = post // posts.router 사용할 수 있다.
        next()
        } else {
          req.flash('error', '권한이 없습니다.')
          res.redirect('/login')
      }
      }).catch((error) => {
        if (error) {
          req.flash('error', "포스트가 없거나 에러가 발생했습니다.")
        res.redirect('back')}
    })
  }
}

function checkCommentOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.commentId)
      .then((comment) => {
        if (comment.author.id.equals(req.user._id)) {
          req.comment = comment
        next()
        } else {
          req.flash('error', '권한이 없습니다.')
          res.redirect('/posts')
      }
      }).catch(() => {
        req.flash('error', '댓글이 존재하지 않거나 에러가 발생했습니다.')
        res.redirect('back')
    })
  }
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  checkPostOwnership,
  checkCommentOwnership
};
