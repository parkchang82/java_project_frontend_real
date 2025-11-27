import React from 'react';
import './ProfilePage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DeleteAccountPage() {
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (window.confirm('정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        await axios.delete('백엔드_서버_주소/api/profile');
        alert('회원 탈퇴 완료');
        navigate('/signup');
      } catch (error) {
        alert('회원 탈퇴 실패');
        console.error('회원 탈퇴 실패:', error.response ? error.response.data : error);
      }
    }
  };

  return (
    <div className="profile-container">
      <h1>회원 탈퇴</h1>
      <div className="profile-card">
        <p>계정 정보가 모두 삭제됩니다.</p>
        <button className="action-button delete" onClick={handleDeleteAccount}>
          회원 탈퇴
        </button>
      </div>
    </div>
  );
}

export default DeleteAccountPage;