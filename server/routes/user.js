// server/routes/user.js

console.log("✅ user.js 라우터 불러와짐");


const express = require("express");
const router = express.Router();
const User = require("../models/User");   // 모델은 반드시 있어야 함
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

router.post("/login",async(req, res) => {
  const {username, password} = req.body;


  try{
    // 1. 사용자 존재 여부 확인
    const user = await User.findOne({ username });
    if(!user){
      return res.status(401).json({ msg: "존재하지 않는 회원입니다."});
    }

    console.log("🔐 암호화된 비번:", user.password);

    // 2. 비밀번호 비교 (bycrypt로 암호화된 것과 비교)
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(401).json({ msg: "비밀번호가 일치하지 않습니다."});
    }

    // JWT 토큰 발급
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username, // 이게 반드시 있어야 함!!!
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    

    res.json({ msg: "로그인 성공", token });

    // 3. 로그인 성공
    res.status(200).json({ msg: "로그인 성공!"});
  }
  catch (err){
    console.error("로그인 오류:", err);
    res.status(500).json({ msg: "서버 오류로 로그인 실패"});
  }
});

module.exports = router;
