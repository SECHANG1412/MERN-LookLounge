// src/pages/PostListPage.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../App.css";

export default function PostListPage() {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [inputKeyword, setInputKeyword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/");
      return;
    }
    (async () => {
      try {
        const res = await api.get("/api/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data.posts);
      } catch {
        alert("게시글을 불러올 수 없습니다.");
      }
    })();
  }, [navigate]);

  const filteredPosts = posts.filter((post) => {
    const categoryMatch =
      selectedCategory === "전체" || post.category === selectedCategory;
    const keywordMatch = post.title
      .toLowerCase()
      .includes(searchKeyword.toLowerCase());
    return categoryMatch && keywordMatch;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchKeyword(inputKeyword);
  };

  return (
    <div className="post-list-container">
      {/* 카테고리 셀렉트 생략 */}
      <table className="post-table">
        <thead>
          <tr>
            <th>No</th>
            <th>제목</th>
            <th>글쓴이</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                해당 조건에 맞는 글이 없습니다.
              </td>
            </tr>
          ) : (
            filteredPosts.map((post, index) => (
              <tr key={post._id}>
                <td>{filteredPosts.length - index}</td>
                <td>
                  <Link to={`/posts/${post._id}`} className="post-link">
                    {post.title}
                  </Link>
                </td>
                {/* author는 이제 항상 문자열 */}
                <td>{post.author}</td>
                <td>{post.date?.split("T")[0]}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="postlist-footer">
        <form className="postlist-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by title"
            className="search-input"
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.target.value)}
          />
          <button type="submit" className="search-button">
            검색
          </button>
        </form>
        <Link to="/posts/new" className="write-button">
          글쓰기
        </Link>
      </div>
    </div>
  );
}
