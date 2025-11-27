import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import postsApi from '../../api/postsApi';
import './Study.css';

function StudyWritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔥 글 생성 (POST /posts)
      const response = await postsApi.createPost({
        title,
        content,
      });

      if (response.status === 200 || response.status === 201) {
        alert("스터디 글이 등록되었습니다!");
        navigate('/study'); 
      } else {
        alert("등록 실패");
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류 발생");
    }
  };

  return (
    <div className="study-page-container">
      <h1>스터디 글쓰기</h1>
      <form onSubmit={handleSubmit} className="study-page-form">

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
          <button type="submit" className="study-page-button">등록</button>
          <button
            type="button"
            className="study-page-button cancel"
            onClick={() => navigate('/study')}
          >
            취소
          </button>
        </div>

      </form>
    </div>
  );
}

export default StudyWritePage;
