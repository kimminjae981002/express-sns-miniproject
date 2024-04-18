const express = require("express");
const router = express.Router({mergeParams:true});
const User = require('../models/user.model')
const Post = require('../models/posts.model')
const {checkAuthenticated, checkIsMe} = require('../middlewares/auth')

// 프로필 데이터 가져오기
router.get('/', checkAuthenticated, async (req, res) => {
    // Post model에서 author 에 id를 참조한다.
    await Post.find({"author.id":req.user._id}).populate('comments').sort({ createdAt: -1 }).exec()
        .then(async(posts) => {
            await User.findById(req.user._id)
                .then((user) => {
                    res.render('profile', {
                        posts: posts,
                        user:user,
                })
            })
        }).catch(() => {
            req.flash('error',' 에러 발생')
        })
    
})

// 프로필 수정 UI render
router.get('/edit', checkAuthenticated, async (req, res) => {
    await User.findById(req.params.id)
        .then((user) => {
            res.render('profile/edit',{user:user})
        }).catch(() => {
        req.flash('error','에러 발생')
    })
})

// 프로필 수정
router.put('/', checkIsMe, async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, req.body)
        .then((user) => {
            req.flash('success', '프로필이 수정되었습니다.')
            res.redirect(`/profile/${req.user._id}`)
        }).catch((err) => {
            console.log(err)
            req.flash('error', '프로필 수정 실패했습니다.')
            res.redirect('back')
    })
})

module.exports = router;
