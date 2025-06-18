// src/pages/PostDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import "../App.css";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/");
      return;
    }

    (async () => {
      try {
        const res = await api.get(`/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPost(res.data.post);

        // 토큰에서 userId 추출
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUser(payload.userId);
      } catch (err) {
        console.error("게시글 조회 실패:", err);
        alert("게시글을 불러오지 못했습니다.");
        navigate("/posts");
      }
    })();
  }, [id, navigate]);

  if (!post) return <div>⏳ 게시글을 불러오는 중...</div>;

  // ===== 필수 수정 부분 =====
  // author가 객체({_id, username})이면 분리
  const authorDisplay =
    typeof post.author === "object" && post.author !== null
      ? post.author.username
      : post.author || "알 수 없음";
  const authorId =
    typeof post.author === "object" && post.author !== null
      ? post.author._id
      : post.author;
  // =========================

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await api.delete(
        `/api/posts/${id}/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPost(res.data.post);
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
      alert("댓글 삭제 실패");
    }
  };

  // 댓글 등록 핸들러
  const handleAddComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await api.post(
        `/api/posts/${id}/comments`,
        { content: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPost(res.data.post);
      setCommentText("");
    } catch (err) {
      console.error("댓글 등록 실패:", err);
      alert("댓글 등록 중 오류 발생");
    }
  };

  // 댓글 수정 시작
  const handleEditComment = (commentId, content) => {
    setEditIndex(commentId);
    setEditContent(content);
  };

  // 댓글 수정 저장
  const handleSaveEdit = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await api.patch(
        `/api/posts/${id}/comments/${editIndex}`,
        { content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPost(res.data.post);
      setEditIndex(null);
      setEditContent("");
    } catch (err) {
      console.error("댓글 수정 실패:", err);
      alert("댓글 수정 실패");
    }
  };

  // 게시글 삭제
  const handleDeletePost = async () => {
    if (!window.confirm("정말 게시글을 삭제하시겠습니까?")) return;
    const token = localStorage.getItem("token");
    try {
      await api.delete(`/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("게시글이 삭제되었습니다.");
      navigate("/posts");
    } catch (err) {
      console.error("게시글 삭제 실패:", err);
      alert("게시글 삭제 중 오류 발생");
    }
  };

  return (
    <div className="post-detail-container">
      <div className="post-box">
        <h1 className="post-title-main">{post.title}</h1>
        {/* authorDisplay로 문자열만 렌더링 */}
        <div className="post-meta">
          ✍️ {authorDisplay} | 🗓 {post.date?.substring(0, 10)} | 📁 {post.category}
        </div>
        <hr className="post-divider" />
        {post.image && (
          <img
            src={post.image}
            alt="첨부 이미지"
            className="post-detail-image"
          />
        )}
        <div className="post-description">{post.description}</div>

        {/* 작성자일 때만 수정/삭제 버튼 */}
        {currentUser === authorId && (
          <div className="post-actions">
            <Link to={`/posts/${id}/edit`} className="edit-btn">
              ✏️ 수정하기
            </Link>
            <button onClick={handleDeletePost} className="delete-btn">
              🗑 삭제하기
            </button>
          </div>
        )}

        <hr className="post-divider" />
        <div className="comments-section">
          <h3>💬 댓글</h3>
          {post.comments?.length > 0 ? (
            post.comments.map((c) => (
              <div key={c._id} className="comment">
                {editIndex === c._id ? (
                  <>
                    <input
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="edit-comment-input"
                    />
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={handleSaveEdit}>💾 저장</button>
                      <button onClick={() => setEditIndex(null)}>
                        ❌ 취소
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="comment-header"
                      style={{ fontWeight: "bold", marginBottom: "0.25rem" }}
                    >
                      ✍️ <span style={{ color: "#333" }}>{c.author}</span> | 🗓 {c.date?.substring(0, 10)}
                    </div>
                    <p style={{ marginLeft: "1rem" }}>{c.content}</p>
                    {/* 댓글 삭제 버튼 */}
                    {currentUser === c.author && (
                      <button
                        onClick={() => handleDeleteComment(c._id)}
                        className="comment-delete-btn"
                      >
                        삭제
                      </button>
                    )}
                  </>
                )}
              </div>
            ))
          ) : (
            <p style={{ color: "#666" }}>아직 댓글이 없습니다.</p>
          )}

          {/* 댓글 입력 폼 */}
          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              placeholder="댓글을 입력하세요"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />
            <button type="submit">댓글 작성</button>
          </form>
        </div>
      </div>
    </div>
  );
}
