// server/routes/user.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 회원가입 라우트
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("요청 바디:", username, password);  // 여기까지 확인!

    if (!username || !password) {
      return res.status(400).json({ msg: "아이디와 비밀번호를 입력하세요." });
    }

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(409).json({ msg: "이미 존재하는 아이디입니다." });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ msg: "회원가입 완료!" });
  } catch (err) {
    console.error("회원가입 오류:", err);
    res.status(500).json({ msg: "서버 오류로 회원가입 실패" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ msg: "존재하지 않는 회원입니다." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "비밀번호가 일치하지 않습니다." });
    }

    // ⚡️ 토큰 payload를 반드시 ObjectId로만 세팅
    const token = jwt.sign(
      {
        userId: user._id.toString(),  // <-- 여기가 핵심
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ⚡️ 한 번만 응답하기
    return res.json({ msg: "로그인 성공", token });
  } catch (err) {
    console.error("로그인 오류:", err);
    return res.status(500).json({ msg: "서버 오류로 로그인 실패" });
  }
});

module.exports = router;
