const express = require("express");
const router = express.Router();
const { checkAuthenticated } = require("../middlewares/auth");
const Post = require('../models/posts.model')

// Post DB에 있는 모든 것들을 찾고 comments 데이터도 보여주고 실행해라
// posts에는 posts 데이터를 가져오고 currentUser에는 현재 로그인 된 유저를 넣어준다.
// ejs에서 사용가능하다.
router.get("/", checkAuthenticated, (req, res) => {
  Post.find().populate('comments').sort({ createdAt: -1 }).exec()
    .then(posts => {
      res.render("posts/index", {
        posts: posts,
        currentUser: req.user
      })
    }).catch(err => {
    console.log(err)
  })

});

module.exports = router;
