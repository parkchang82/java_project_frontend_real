import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import postsApi from '../../api/postsApi';
import roomsApi from '../../api/roomsApi';
import './Study.css';

function StudyDetailPage() {
  const { id } = useParams(); // postId
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  // 🔥 글 상세 조회: /posts/{id}
  useEffect(() => {
    const load = async () => {
      try {
        const response = await postsApi.getPostById(id);
        setPost(response.data); // title, content, roomId 포함
      } catch (err) {
        console.error(err);
        alert("글을 불러올 수 없습니다.");
      }
    };
    load();
  }, [id]);

  if (!post) return <p>존재하지 않는 글입니다.</p>;

  // 🔥 참여하기 기능
  const handleJoin = async () => {
    const username = localStorage.getItem("username");

    if (!username) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!window.confirm("이 스터디에 참여하시겠습니까?")) return;

    try {
      const roomId = post.roomId; // 글이 가진 roomId 사용

      if (!roomId) { 
        alert("스터디 방 ID가 유효하지 않습니다. 잠시 후 다시 시도하거나 관리자에게 문의하세요.");
        console.error("Room ID is invalid:", post);
        return; // 유효하지 않으면 여기서 함수 종료
      }
      const response = await roomsApi.joinRoom(roomId, username);
      const message = response.data;

      if (message === "참여 완료") {
        alert("🎉 참여가 완료되었습니다! 일정 관리 페이지로 이동합니다.");
        navigate(`/schedule?roomId=${roomId}`);
      } else {
        alert(message);
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  // 🔥 삭제 기능
  const handleDelete = async () => {
    if (!window.confirm("삭제하시겠습니까?")) return;

    try {
      await postsApi.deletePost(id);
      alert("삭제 완료!");
      navigate("/study");
    } catch (err) {
      console.error(err);
      alert("삭제 실패: 본인 글만 삭제할 수 있습니다 ❌");
    }
  };

  return (
    <div className="study-page-container">
      <h1 className="study-detail-title">{post.title}</h1>
      <p style={{ whiteSpace: 'pre-line', marginBottom: '20px' }}>
        {post.content}
      </p>

      <div className="button-group">
        <button
          className="study-page-button cancel"
          onClick={() => navigate('/study')}
        >
          뒤로가기
        </button>

        {/* 참여하기 버튼 */}
        <button
          className="study-page-button join"
          onClick={handleJoin}
          style={{ backgroundColor: '#4CAF50', color: 'white', marginRight: '10px' }}
        >
          참여하기
        </button>

        <button
          className="study-page-button edit"
          onClick={() => navigate(`/study/edit/${id}`)}
        >
          수정하기
        </button>

        <button
          className="study-page-button delete"
          onClick={handleDelete}
        >
          삭제하기
        </button>
      </div>
    </div>
  );
}

export default StudyDetailPage;
