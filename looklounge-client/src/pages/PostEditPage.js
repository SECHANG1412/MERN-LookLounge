// src/pages/PostEditPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../App.css";

export default function PostEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    category: "",
    title: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/");
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await api.get(`/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPost(res.data.post);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
        alert("게시글을 불러오지 못했습니다.");
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPost((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await api.patch(`/api/posts/${id}`, post, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("수정 완료!");
      navigate(`/posts/${id}`);
    } catch (err) {
      console.error("게시글 수정 실패:", err);
      alert("수정 중 오류 발생");
    }
  };

  return (
    <div className="postcreate-container">
      <h1 className="logo-title">✏️ 글 수정</h1>

      <form onSubmit={handleSubmit} className="post-form">
        <label>
          상황 선택
          <select name="category" value={post.category} onChange={handleChange} required>
            <option value="">-- 선택하세요 --</option>
            <option value="결혼식">결혼식</option>
            <option value="소개팅">소개팅</option>
            <option value="모임">모임</option>
            <option value="학교">학교</option>
            <option value="기타">기타</option>
          </select>
        </label>

        <label>
          제목
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          설명
          <textarea
            name="description"
            value={post.description}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          이미지 변경
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        {post.image && (
          <div style={{ textAlign: "center" }}>
            <img src={post.image} alt="미리보기" style={{ maxWidth: "300px", borderRadius: "8px" }} />
          </div>
        )}

        <button type="submit">✅ 수정 완료</button>
      </form>
    </div>
  );
}
