const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    description: String,
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment", // comments는 Comment model을 참조한다.
      },
    ], // 여러개의 comments를 받아올 수 있다.
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // id는 User model을 참조한다.
      },
      username: String,
    },
    image: {
      type: String,
    },
    likes: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
