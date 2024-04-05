const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    minLength: 5,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  kakaoId: {
    type: String,
    unique: true,
    sparse: true,
  },
});
// userSchema라는 변수에 mongoose Schema를 생성한다.

const saltRounds = 10;
userSchema.pre("save", function (next) {
  let user = this;
  if (user.isModified("password")) {
    // salt 생성
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      resolve(isMatch);
    });
  });
};

const User = mongoose.model("User", userSchema);
// model 메소드를 이용해서 schema를 지정해준다.
// User라는 name으로 userSchema를 넣어준다.

module.exports = User;
