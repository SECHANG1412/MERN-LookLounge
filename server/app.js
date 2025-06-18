// server/app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ 라우터 연결
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

// ✅ 요청 로그 미들웨어
app.use((req,res,next) => {
  console.log(`요청 받음: ${req.method} ${req.url}`);
  next();
});

// ✅ 라우터 등록
app.use("/api", userRoutes);
app.use("/api", postRoutes);



// ✅ DB 연결
mongoose
  .connect("mongodb://localhost:27017/test")
  .then(() => {
    console.log("✅ MongoDB 연결 성공");
    app.listen(PORT, () => {
      console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ DB 연결 실패:", err));
