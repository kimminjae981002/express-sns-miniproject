const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");
const cookieSession = require("cookie-session");
const flash = require('connect-flash');
require("dotenv").config();

const mainRouter = require("./routes/main.router");
const usersRouter = require("./routes/user.router");
const commentsRouter = require("./routes/comments.router");
const postsRouter = require("./routes/posts.router");
const profilesRouter = require("./routes/profile.router");
const likesRouter = require("./routes/likes.router");
const friendsRouter = require("./routes/friends.router");

const app = express();

app.use(
  cookieSession({
    name: "cookie-session",
    keys: [process.env.cookieEncryptionKey],
  })
);

// register regenerate & save after the cookieSession middleware initialization
app.use(function (request, response, next) {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = (cb) => {
      cb();
    };
  }
  if (request.session && !request.session.save) {
    request.session.save = (cb) => {
      cb();
    };
  }
  next();
});



app.use(passport.initialize());
app.use(passport.session());
require("./config/passport");

app.use(flash())

app.use((req, res, next) => {
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  res.locals.currentUser =  req.user,
  // console.log(res.locals)
  next()
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use("/static", express.static(path.join(__dirname, "public"))); // localhost:3000/static
app.use(express.static(path.join(__dirname, "public"))); // localhost:3000


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

mongoose
  .connect(process.env.mongo_db)
  .then(() => {
    console.log("mognodb connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.get('/send', (req, res) => {
  req.flash('post success', '포스트가 생성 되었습니다.')
  res.redirect('/receive')
})
  
app.get('/receive', (req, res) => {
  res.send(req.flash('post success')[0])
})

app.use("/", mainRouter);
app.use("/auth", usersRouter);
app.use("/posts", postsRouter);
app.use("/posts/:id/comments", commentsRouter);
app.use("/profile/:id", profilesRouter);
app.use("/freinds", friendsRouter);
app.use("/posts/:id/like", likesRouter);

// 에러처리
app.use((error, req, res, next) => {
  console.log(error)
  res.json({ message: error.message });
  });

app.listen("3000", (req, res) => {
  console.log("listening 3000");
});
