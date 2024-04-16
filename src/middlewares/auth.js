const Post = require('../models/posts.model')

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
          req.falsh('error', "포스트가 없거나 에러가 발생했습니다.")
        res.redirect('back')}
    })
  }
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  checkPostOwnership
};
