import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import api from "../api/axios";

export default function PostCreatePage() {
  const navigate = useNavigate();

  // ✅ 로그인 여부 확인
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/");
    }
  }, [navigate]);

  // ✅ 상태값 정의
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // ✅ 이미지 업로드 미리보기
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); // base64 인코딩된 이미지
    };
    reader.readAsDataURL(file);
  };

  // ✅ 게시글 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/api/posts",
        {
          title,
          description,
          category,
          image: imagePreview, // ✅ base64 이미지 본문에 포함
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("게시글 등록 성공!");
      navigate("/posts");
    } catch (err) {
      console.error("글 등록 오류:", err);
      alert("글 등록 실패");
    }
  };

  return (
    <div className="postcreate-container">
      <h1 className="logo-title">코디 작성하기</h1>

      <form className="post-form" onSubmit={handleSubmit}>
        <label>
          상황 선택
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
          />
        </label>

        <label>
          설명
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="코디 설명을 입력하세요"
            required
          />
        </label>

        <label>
          사진 업로드
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        {imagePreview && (
          <div className="image-preview">
            <img
              src={imagePreview}
              alt="미리보기"
              style={{ width: "200px", marginTop: "1rem" }}
            />
          </div>
        )}

        <button type="submit">작성 완료</button>
      </form>
    </div>
  );
}
