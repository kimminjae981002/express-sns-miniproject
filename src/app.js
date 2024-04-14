const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");
const cookieSession = require("cookie-session");
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

app.use("/", mainRouter);
app.use("/auth", usersRouter);
app.use("/posts", postsRouter);
app.use("/posts/:id/comments", commentsRouter);
app.use("/profile/:id", profilesRouter);
app.use("/freinds", friendsRouter);
app.use("/posts/:id/like", likesRouter);

app.listen("3000", (req, res) => {
  console.log("listening 3000");
});
