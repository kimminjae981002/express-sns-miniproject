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
  let desc = req.body.desc;
  let image = req.file ? req.file.filename : "";
  Post.create({
    name,
    image,
    description: desc,
    author: {
      id: req.user._id,
      username: req.user.username
    }
  }).then(result => {
    res.redirect('back')
  }).catch(err => {
    console.log('err')
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
        currentUser: req.user
      })
    }).catch(err => {
    console.log(err)
  })

});

module.exports = router;
