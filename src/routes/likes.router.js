const express = require("express");
const router = express.Router({mergeParams:true});
const { checkAuthenticated } = require("../middlewares/auth");
const Post = require('../models/posts.model')

// router.put('/posts/:id/like', checkAuthenticated, async (req, res) => {
//     const post = await Post.findById(req.params.id)

//     // like를 순회하면서 내 아이디랑 같냐?
//     // 같으면 내 거와 다른 id들만 updatedLikes에 넣어라
//     if (post) {
//         // 이미 누른 좋아요
//         if (post.likes.find(like => like === req.user._id.toString())) {
//             let updatedLikes = post.likes.filter((like) => {
//                return like !== req.user._id.toString()
//             })
//             Post.findByIdAndUpdate(post._id)
//                 .then((post) => {
//                 post.likes = updatedLikes
//                 }).catch((err) => {
//                 req.flash('error')
//                 console.log(err)
//             })
//         } else {
//             Post.findByIdAndUpdate(post._id)
//                 .then((post) => {
//                     post.likes.concat([req.user._id])
//                 }).catch((err) => {
//                     req.flash('error')
//                     console.log(err)
//             })
//         }
//     }else {
//         req.flash('error', '포스트가 존재하지 않습니다.')
//         res.redirect('/posts')
//     }
    
// })


// likes
router.put('/posts/:id/like', checkAuthenticated, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            // post likes 배열에 내가 있으면
            // post.likes는 나를 제외한다.
            // 내가 없다면 post.likes에 나를 넣는다.
            // post 저장
            if (post.likes.includes(req.user._id.toString())) {
                post.likes = post.likes.filter(like => like !== req.user._id.toString());
            } else {
                post.likes.push(req.user._id);
            }

            await post.save();
            req.flash('success', '좋아요가 업데이트되었습니다.');
        } else {
            req.flash('error', '포스트가 존재하지 않습니다.');
        }

        res.redirect('/posts');
    } catch (err) {
        req.flash('error', '좋아요 업데이트에 실패했습니다.');
        console.log(err);
        res.redirect('/posts');
    }
});

module.exports = router;
