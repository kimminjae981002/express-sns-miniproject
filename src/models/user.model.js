const mongoose = require("mongoose");

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
});
// userSchema라는 변수에 mongoose Schema를 생성한다.

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // password 비교 함수를 만들어준다.
  // 원래는 bcrypt 라이브러리를 이용하면 더욱 쉽다.

  // plainPassword = 사용자 입력 필드 password
  // this.password = db에 입력된 password
  if (plainPassword === this.password) {
    cb(null, true);
  } else {
    cb(null, false);
  }

  return cb({ error: "error" });
};

const User = mongoose.model("User", userSchema);
// model 메소드를 이용해서 schema를 지정해준다.
// User라는 name으로 userSchema를 넣어준다.

module.exports = User;
