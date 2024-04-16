const express = require("express");
const router = express.Router({mergeParams: true});
const Post = require('../models/posts.model')
const Comment = require('../models/comments.model')
const { checkAuthenticated, checkCommentOwnership } = require("../middlewares/auth");


// 댓글 생성
router.post('/', checkAuthenticated, async (req, res) => {
    // app.js에서 router 경로를 정의 해줬기 때문에 여기서는 할 필요가 없다.
    // 그런데 post를 찾으려면 req.params.id를 가져와야 하는데 app.js router 경로에 있기 때문에
    // 여기서는 사용이 불가능하다. 그때  const router = express.Router({mergeParams: true}); 설정 해주면 된다.
    const post = await Post.findById(req.params.id);

    let text = req.body.text
    if (post) {
         Comment.create({
            text,
            author: {
              id: req.user._id,
              username: req.user.username
            }
         }).then((comment) => {
             post.comments.push(comment)
             post.save()

             req.flash('success', '댓글이 생성되었습니다.')
             res.redirect('/posts')
         }).catch(() => {
            req.flash('error', '댓글 생성이 실패했습니다.')
            res.redirect('/posts')
            })
    } else {
        req.flash('error', '포스트가 존재하지 않습니다.')
        res.redirect('/posts')
    }
})


// 댓글 삭제
router.delete('/:commentId', checkCommentOwnership, async (req, res) => {
    const comment = await Comment.findByIdAndDelete(req.params.commentId)

    if (!comment) {
        req.flash('error', '댓글 삭제에 실패했습니다.')
        res.redirect('back')
      }
      req.flash('success', '댓글 삭제에 성공했습니다.')
      res.redirect('/posts')
})

// 댓글 수정 UI 가져오기
router.get('/:commentId/edit', checkCommentOwnership, async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (post) {
        res.render('comments/edit',
            // post = 위에 가져온 post
            // comment는 미들웨어에서 전달한 req.comment 
        // ejs에서 사용가능
            {
                post: post,
            comment: req.comment})
    }
})

// 댓글 수정
router.put('/:commentId', checkCommentOwnership, async (req, res) => {
    const comment = await Comment.findByIdAndUpdate(req.params.commentId, req.body)

    if (comment) {
        req.flash('success', '댓글 수정에 성공했습니다.')
        res.redirect('/posts')
    } else {
        req.flash('error', '댓글 수정에 실패했습니다.')
        res.redirect('/posts')
    }
})
module.exports = router;
