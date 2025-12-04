import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios'; // API 모듈 import

function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  // 기본 이미지 설정
  const DEFAULT_IMAGE = '/assets/images/default_profile.png';
  const [profileImage, setProfileImage] = useState(DEFAULT_IMAGE);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 💡 백엔드 서버 주소 (이미지 불러올 때 필요)
  const BASE_URL = "https://java-project-backend-real.onrender.com";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/profile'); 
        const userData = response.data;
        setUser(userData);

        // 💡 [추가됨] DB에 저장된 프로필 이미지가 있으면 불러오기
        if (userData.profileImage) {
           // DB에는 "/images/uuid_파일.jpg"로 저장되어 있으므로 앞에 주소를 붙임
           setProfileImage(`${BASE_URL}${userData.profileImage}`);
        }
      } catch (err) {
        console.error("프로필 정보 불러오기 실패:", err);
        setError("정보를 불러오는데 실패했습니다.");
        if (err.response && err.response.status === 401) {
          alert("로그인 세션이 만료되었습니다.");
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // 💡 [수정됨] 파일 선택 시 바로 서버로 업로드
  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // 1. 전송할 데이터 만들기
      const formData = new FormData();
      formData.append('file', file);

      try {
        // 2. 서버로 전송 (user.id가 필요함)
        // 백엔드 컨트롤러 주소: /api/users/{id}/profile-image
        const response = await api.post(`/api/users/${user.id}/profile-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // 3. 성공 시 화면 이미지 즉시 교체
        // 서버가 리턴해준 경로(예: /images/abc.jpg)에 URL 붙여서 설정
        const newImageUrl = `${BASE_URL}${response.data}`;
        setProfileImage(newImageUrl);
        alert("프로필 이미지가 변경되었습니다.");

      } catch (err) {
        console.error("이미지 업로드 실패:", err);
        alert("이미지 업로드 중 오류가 발생했습니다.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    alert('로그아웃 되었습니다.');
    navigate('/login');
  };
  
  const handlePasswordSubmit = async (e) => { 
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
        await api.post('/api/change-password', {
            currentPassword,
            newPassword
        });
        alert('비밀번호가 성공적으로 변경되었습니다!');
        setIsModalOpen(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    } catch (err) {
        alert(err.response?.data?.message || '비밀번호 변경 실패');
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error}</div>;
  if (!user) return <div>사용자 정보가 없습니다.</div>;

  return (
    <div className="profile-container">
      <h1>내 프로필</h1>
      <div className="profile-card">
        <div className="profile-info">
          <div className="profile-image-wrapper">
            {/* 💡 이미지 경로에 에러가 나면 기본 이미지로 대체하는 코드 추가 */}
            <img 
                src={profileImage} 
                alt="프로필" 
                className="profile-image"
                onError={(e) => e.target.src = DEFAULT_IMAGE} 
            />
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
            {user.date && <p><strong>생년월일:</strong> {user.date}</p>}
            {user.gender && <p><strong>성별:</strong> {user.gender}</p>}
          </div>
        </div>
        <div className="profile-actions">
          <button className="action-button" onClick={() => setIsModalOpen(true)}>
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

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>비밀번호 변경</h2>
            <form onSubmit={handlePasswordSubmit}>
              <input 
                type="password" 
                placeholder="현재 비밀번호" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required 
              />
              <input 
                type="password" 
                placeholder="새 비밀번호" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required 
              />
              <input 
                type="password" 
                placeholder="새 비밀번호 확인" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
              <div className="modal-actions">
                <button type="submit" className="action-button">변경</button>
                <button type="button" className="action-button cancel" onClick={() => setIsModalOpen(false)}>취소</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
