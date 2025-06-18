// src/pages/SignupPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../App.css";

export default function SignupPage() {
  const navigate = useNavigate();

  // ✅ username으로 수정
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    // 빈 값 확인
    if (!username || !pw || !pwConfirm) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    // 비밀번호 일치 확인
    if (pw !== pwConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // ✅ username 기반으로 API 요청
      const res = await api.post("/api/signup", {
        username,
        password: pw,
      });

      alert(res.data.msg || "회원가입 완료!");
      navigate("/"); // 로그인 페이지로 이동
    } catch (err) {
      console.error("회원가입 실패:", err);

      console.log("🔍 err.response:", err.response);
      console.log("🔍 err.message:", err.message);
      console.log("🔍 err.code:", err.code);
      console.log("🔍 err.config:", err.config);

      // ✅ 오류 응답에 따라 구체적인 안내
      if (err.response?.status === 409) {
        alert("이미 존재하는 아이디입니다.");
      } else {
        const serverMsg = err.response?.data?.msg || "회원가입 중 오류가 발생했습니다.";
        alert(serverMsg);
      }
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">
        <span>Sign</span>
        <span>Up</span>
      </h1>

      <form className="login-form" onSubmit={handleSignup}>
        {/* ✅ username 입력 필드 */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={pwConfirm}
          onChange={(e) => setPwConfirm(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
