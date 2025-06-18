const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  author: String,
  content: String,
  date: String,
}, { _id: true });  // ✅ 반드시 _id: true 설정 (또는 생략 — 기본값이 true)

const postSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  image: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: Date,
  comments: [commentSchema]  // ✅ 서브도큐먼트로 _id 포함
});


module.exports = mongoose.model("Post", postSchema);
