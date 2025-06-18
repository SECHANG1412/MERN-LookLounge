const jwt = require("jsonwebtoken");
const User = require("../models/User");  // ✅ 추가

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🔐 들어온 헤더:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "토큰이 없습니다." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ 토큰 확인 완료:", decoded);

    // ✅ DB에서 사용자 정보 조회 (username 얻기)
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ msg: "사용자를 찾을 수 없습니다." });
    }

    // ✅ 사용자 정보 추가
    req.user = {
      userId: decoded.userId,
      username: user.username,
    };

    next();
  } catch (err) {
    console.error("❌ 토큰 검증 실패:", err.message);
    return res.status(401).json({ msg: "토큰이 유효하지 않습니다." });
  }
};
