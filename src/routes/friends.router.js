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

module.exports = router;
