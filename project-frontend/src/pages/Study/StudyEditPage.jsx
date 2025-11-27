import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import postsApi from "../../api/postsApi";
import "./Study.css";

function StudyEditPage() {
  const { id } = useParams(); // postId
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // ✨ 기존 글 불러오기
  useEffect(() => {
    const load = async () => {
      try {
        const response = await postsApi.getPostById(id);
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (err) {
        console.error(err);
        alert("글을 불러올 수 없습니다.");
      }
    };
    load();
  }, [id]);

  // ✨ 글 수정 제출
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await postsApi.updatePost(id, {
        title,
        content,
      });

      alert("수정 완료!");
      navigate(`/study/${id}`);
    } catch (err) {
      console.error(err);
      alert("수정 실패: 본인 글만 수정할 수 있습니다 ❌");
    }
  };

  return (
    <div className="study-page-container">
      <h1>스터디 글 수정</h1>

      <form onSubmit={handleUpdate} className="study-page-form">
        <div className="study-page-form-group">
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="study-page-form-group">
          <label>내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="15"
            required
          />
        </div>

        <div className="button-group">
          <button type="submit" className="study-page-button">수정 완료</button>
          <button
            type="button"
            className="study-page-button cancel"
            onClick={() => navigate(`/study/${id}`)}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default StudyEditPage;
