import React, { useState, useEffect } from 'react'; // [추가] useState, useEffect 임포트
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios'; // [추가] axios 임포트
import api from './api/api';

// [추가] 3-2, 3-3에서 만든 컴포넌트들 임포트
import FloatingMessageIcon from './components/common/FloatingMessageIcon';
import MessageWidget from './components/common/MessageWidget';

import Header from './components/common/Header';
import Footer from './components/common/Footer';

import SignUpPage from './pages/Auth/SignUpPage';
import LoginPage from './pages/Auth/LoginPage';

import ProfilePage from './pages/Profile/ProfilePage';
import ChangePasswordPage from './pages/Profile/ChangePasswordPage';
import DeleteAccountPage from './pages/Profile/DeleteAccountPage';

import StudyListPage from './pages/Study/StudyListPage';
import StudyWritePage from './pages/Study/StudyWritePage';
import StudyDetailPage from './pages/Study/StudyDetailPage';
import StudyEditPage from './pages/Study/StudyEditPage';

import SchedulePage from './pages/Schedule/SchedulePage';

// [수정] 쪽지 기능이 없는 인증(Auth) 레이아웃
function AuthLayout({ children }) {
  return <div>{children}</div>;
}

// --- [수정] 쪽지 기능이 추가된 메인(Main) 레이아웃 ---
function MainLayout({ children }) {
  
  // [추가] 쪽지창 열림/닫힘 상태
  const [isWidgetOpen, setIsWidgetOpen] = useState(false); 
  // [추가] 안 읽은 메시지 개수 상태
  const [unreadCount, setUnreadCount] = useState(0);       

  // (중요!) 
  // 나중에 실제 로그인 여부를(Redux, Context API 등에서) 가져와야 합니다.
  // 지금은 테스트를 위해 'true'로 설정합니다.
  const isLoggedIn = true; 

  const API_URL = '/api/messages'; // (proxy 설정을 했다고 가정)

  // [추가] "실시간" 폴링(Polling) 기능
  useEffect(() => {
    // 1. 로그인 상태가 아니면 폴링을 시작하지 않음
    if (!isLoggedIn) return;

    // 2. 안 읽은 메시지 개수 가져오는 함수
    const fetchUnread = () => {
      axios.get(`${API_URL}/unread-count`) // [GET] /api/messages/unread-count
        .then(res => {
          setUnreadCount(res.data.count); // { "count": 5 } 형태
        })
        .catch(err => console.error("안 읽은 메시지 개수 로딩 실패:", err));
    };
    
    // 3. 즉시 1회 실행
    fetchUnread(); 

    // 4. 10초마다 반복 실행
    const interval = setInterval(fetchUnread, 10000); // 10000ms = 10초

    // 5. 컴포넌트가 사라질 때(unmount) 인터벌 정리
    return () => clearInterval(interval);

  }, [isLoggedIn]); // isLoggedIn 상태가 바뀔 때마다 다시 실행

  return (
    <>
      <Header />
      <main style={{ padding: '20px' }}>{children}</main>
      <Footer />

      {/* [추가] 로그인 상태일 때만 아이콘과 위젯을 렌더링 */}
      {isLoggedIn && (
        <>
          {/* 1. 플로팅 아이콘 */}
          <FloatingMessageIcon 
            unreadCount={unreadCount} 
            onClick={() => setIsWidgetOpen(true)} // 클릭 시 위젯 열기
          />

          {/* 2. 쪽지창 (열렸을 때만 렌더링) */}
          {isWidgetOpen && (
            <MessageWidget 
              onClose={() => setIsWidgetOpen(false)} // 닫기 버튼 클릭 시
            />
          )}
        </>
      )}
    </>
  );
}
// ---------------------------------------------------


function App() {
  return (
    <Router>
      <Routes>

        {/* --- 인증(Auth) 레이아웃 --- */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthLayout>
              <SignUpPage />
            </AuthLayout>
          }
        />

        {/* --- 메인(Main) 레이아웃 (쪽지 기능 포함) --- */}
        <Route
          path="/profile"
          element={
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          }
        />
        <Route
          path="/change-password"
          element={
            <MainLayout>
              <ChangePasswordPage />
            </MainLayout>
          }
        />
        <Route
          path="/delete-account"
          element={
            <MainLayout>
              <DeleteAccountPage />
            </MainLayout>
          }
        />
        <Route
          path="/study"
          element={
            <MainLayout>
              <StudyListPage />
            </MainLayout>
          }
        />
        <Route
          path="/study/write"
          element={
            <MainLayout>
              <StudyWritePage />
            </MainLayout>
          }
        />
        <Route
          path="/study/:id"
          element={
            <MainLayout>
              <StudyDetailPage />
            </MainLayout>
          }
        />
        <Route
          path="/study/edit/:id"
          element={
            <MainLayout>
              <StudyEditPage />
            </MainLayout>
          }
        />
        <Route
          path="/schedule"
          element={
            <MainLayout>
              <SchedulePage />
            </MainLayout>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
