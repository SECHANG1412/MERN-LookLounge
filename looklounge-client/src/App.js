// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// 페이지 컴포넌트
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PostListPage from "./pages/PostListPage";
import PostCreatePage from "./pages/PostCreatePage";
import PostDetailPage from "./pages/PostDetailPage";
import PostEditPage from "./pages/PostEditPage";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* 로그인 페이지는 레이아웃 없이 */}
        <Route path="/" element={<LoginPage />} />

        {/* 나머지 모든 페이지는 Layout 안에서 */}
        <Route element={<Layout />}>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/posts" element={<PostListPage />} />
          <Route path="/posts/new" element={<PostCreatePage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/posts/:id/edit" element={<PostEditPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;