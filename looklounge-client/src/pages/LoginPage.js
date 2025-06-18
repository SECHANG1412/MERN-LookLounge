// src/pages/LoginPage.js

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";
import "../App.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/login", {
        username,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      // ✅ username은 여기서 정확히 토큰에서 추출
      const decoded = jwtDecode(token);
      localStorage.setItem("currentUser", decoded.username);

      alert(res.data.msg || "로그인 성공!");
      navigate("/posts");
    } catch (err) {
      console.error("로그인 실패:", err);

      if (err.response?.status === 401) {
        alert(err.response.data.msg);
      } else {
        alert("서버 오류로 로그인 실패");
      }
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">
        <span>Look</span>
        <span>Lounge</span>
      </h1>

      <form className="login-form" onSubmit={handleLogin}>
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      <p className="signup-link">
        계정이 없으신가요? <Link to="/signup">회원가입</Link>
      </p>
    </div>
  );
}
