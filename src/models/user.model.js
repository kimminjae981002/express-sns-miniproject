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

const User = mongoose.model("User", userSchema);
// model 메소드를 이용해서 schema를 지정해준다.
// User라는 name으로 userSchema를 넣어준다.

module.exports = User;
