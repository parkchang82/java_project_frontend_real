import React, { useState } from 'react'; // useState를 import 합니다.
import './ProfilePage.css';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const navigate = useNavigate();

  // 임시 데이터
  const user = {
    name: '홍길동',
    email: 'hong@example.com',
    joinDate: '2025-09-27'
  };

  // 👇 1. 프로필 이미지 관리를 위한 useState 추가
  // 초기값으로 임시 데이터의 이미지 URL을 사용합니다.
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');

  // 👇 2. 이미지 파일이 선택됐을 때 실행될 함수 추가
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // 선택한 이미지 파일을 브라우저에서만 보이는 임시 URL로 만들어서 상태를 업데이트합니다.
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    alert('로그아웃 되었습니다.');
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <h1>내 프로필</h1>
      <div className="profile-card">
        <div className="profile-info">
        
          {/* 👇 3. 이미지 업로드 UI 추가 */}
          <div className="profile-image-wrapper">
            <img src={profileImage} alt="프로필" className="profile-image" />
            <label htmlFor="profileImageUpload" className="image-upload-button">
              ✏️
            </label>
            <input 
              id="profileImageUpload"
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              style={{ display: 'none' }} 
            />
          </div>

          <div className="info-text">
            <p><strong>이름:</strong> {user.name}</p>
            <p><strong>이메일:</strong> {user.email}</p>
            <p><strong>가입일:</strong> {user.joinDate}</p>
          </div>
        </div>
        <div className="profile-actions">
          <button className="action-button" onClick={() => navigate('/change-password')}>
            비밀번호 변경
          </button>
          <button className="action-button logout" onClick={handleLogout}>
            로그아웃
          </button>
          <button className="action-button delete" onClick={() => navigate('/delete-account')}>
            회원 탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;