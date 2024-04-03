const passport = require("passport");
const User = require("../models/user.model");
const LocalStrategy = require("passport-local").Strategy;

// req.logIn(user)
// app.js에서 req.login에서 user를 받아오고
// user 정보를 이용해서 세션을 생성하고 저장한다.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// client => session => request
// user.id를 이용해서 id를 가져오고
// done(null,user)를 이용해서 req.user = user를 이용한다.
passport.deserializeUser(async (id, done) => {
  await User.findById(id).then((user) => {
    done(null, user);

    // req.user = user; req.user에 user가 들어간다.
  });
});

// passport.use 무슨 전략을 사용할지(local)
passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email.toLocaleLowerCase() });

        if (!user) {
          return done(null, false, { msg: `Email ${email} not found` });
        }

        const isMatch = await user.comparePassword(password);

        if (isMatch) {
          return done(null, user);
        }

        return done(null, false, { msg: "Invalid email or password" });
      } catch (error) {
        done(error);
      }
    }
  )
);
