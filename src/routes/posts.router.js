const express = require("express");
const router = express.Router();
const { checkAuthenticated } = require("../middlewares/auth");
const Post = require('../models/posts.model')
const multer = require('multer')
const path = require('path')
const Comment = require('../models/comments.model')

const storageEngine = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '../public/assets/images'))
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname)
  }
})

const upload = multer({ storage: storageEngine }).single('image')

// auth 미들웨어를 실행하고, upload 미들웨어를 실행한다.
router.post('/', checkAuthenticated, upload, (req, res) => {
  let name = req.body.name;
  let description = req.body.description;
  console.log(description,name)
  let image = req.file ? req.file.filename : "";
  Post.create({
    name,
    image,
    description,
    author: {
      id: req.user._id,
      username: req.user.username
    }
  }).then(result => {
    req.flash('success', '포스트 생성 성공') // 포스트가 생성 되면 req.flash에 전달 해준다.
    res.redirect('back')
  }).catch(err => {
    if (err) {
      req.flash('error', '포스트 생성 실패')
      res.redirect('back')
    }
  })
})

// Post DB에 있는 모든 것들을 찾고 comments 데이터도 보여주고 실행해라
// posts에는 posts 데이터를 가져오고 currentUser에는 현재 로그인 된 유저를 넣어준다.
// ejs에서 사용가능하다.
router.get("/", checkAuthenticated, (req, res) => {
  Post.find().populate('comments').sort({ createdAt: -1 }).exec()
    .then(posts => {
      res.render("posts/index", {
        posts: posts,
      })
    }).catch(err => {
    console.log(err)
  })

});

module.exports = router;
