const express = require("express");
const {checkAuthenticated} = require('../middlewares/auth')
const router = express.Router();
const User = require('../models/user.model')

// 친구 목록 불러오기
router.get('/',checkAuthenticated, async (req, res) => {
    await User.find({})
        .then((users) => {
            res.render('friends', {
            users:users,
        })
        }).catch((err) => {
            req.flash('error', '유저를 가져오는데 에러가 발생했습니다.')
            res.redirect('/posts')
    })
})

// 친구 요청
router.put('/:id/add-friend', checkAuthenticated, async (req, res) => {
    // 몽고db 연산자 $push는 항상 값을 추가한다. 이미 존재 했어도
    // $addToSet은 중복된 경우 하지 않는다.
    await User.findByIdAndUpdate(req.params.id,
        {$addToSet: { friendsRequests: req.user._id }})
       .then(async (user) => {
           req.flash('success', '친구 추가에 성공했습니다.')
           res.redirect('back')
        }).catch((err) => {
            console.log(err)
            req.flash('error', '친구 추가에 실패했습니다.')
            res.redirect('back')
        })
})

// 친구 요청 취소
router.put('/:id/remove-friend-request/:currentUserId', checkAuthenticated, async (req, res) => {
    // $pull 몽고디비 배열에서 제거
    await User.findByIdAndUpdate(req.params.id, {
        $pull: {friendsRequests: req.params.currentUserId}
    }).then((user) => {
        req.flash('success', '친구 요청이 취소되었습니다.')
        res.redirect('back')
    }).catch((err) => {
        console.log(err)
        req.flash('error', '친구 요청 취소 중 에러가 발생했습니다.')
        res.redirect('back')
    })
})

// 친구 요청 수락
router.put('/:id/accept-friend-request', checkAuthenticated, async (req, res) => {
    
    await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { friends: req.params.id },
        $pull: {friendsRequests: req.params.id}
    })
    await User.findByIdAndUpdate(req.params.id, {
        $addToSet: { friends: req.user._id },
    })   
        .then(() => {
        req.flash('success', '친구 요청이 수락되었습니다.')
        res.redirect('back')
    }).catch(() => {
        req.flash('error', '친구 요청이 수락 중 에러가 발생했습니다..')
        res.redirect('back')
    })
})

// 친구 취소
router.put('/:id/remove-friend', checkAuthenticated, async (req, res) => {
    
    await User.findByIdAndUpdate(req.user._id, {
        $pull: {friends: req.params.id}
    })
    await User.findByIdAndUpdate(req.params.id, {
        $pull: { friends: req.user._id },
    })   
        .then(() => {
        req.flash('success', '친구 삭제되었습니다.')
        res.redirect('back')
    }).catch(() => {
        req.flash('error', '친구 삭제 중 에러가 발생했습니다..')
        res.redirect('back')
    })
})


module.exports = router;
