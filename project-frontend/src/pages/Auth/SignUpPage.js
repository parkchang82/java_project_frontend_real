import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // state 모두 date로 통일
  const [name, setName] = useState('');
  const [date, setDate] = useState(''); // 🔹 생년월일
  const [gender, setGender] = useState('');

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!gender) {
      alert('성별을 입력해주세요.');
      return;
    }

    try {
      // 🔹 API 전송 시도
      const response = await api.post('/api/signup', {
        email,
        password,
        name,
        date, // 🔹 date로 통일
        gender
      });

      console.log(response.data);
      alert('✅ 회원가입 성공!');
      navigate('/login');

    } catch (error) {
      console.error('회원가입 실패:', error);

      if (error.response?.status === 409) {
        alert('⚠ 이미 존재하는 이메일입니다.');
      } else {
        alert('❌ 서버 오류 발생');
      }
    }
  };

  return (
    <div className="auth-container">
      <h1>회원가입</h1>
      <form onSubmit={handleSignUp} className="auth-form">
        
        <div className="auth-form-group">
          <label>이름</label>
          <input type="text" value={name}
            onChange={(e) => setName(e.target.value)} 
            placeholder="홍길동" required />
        </div>

        <div className="auth-form-group">
          <label>생년월일</label>
          <input type="text" value={date}
            onChange={(e) => setDate(e.target.value)} 
            placeholder="YYYY-MM-DD" required />
        </div>

        <div className="auth-form-group">
          <label>성별</label>
          <input type="text" value={gender}
            onChange={(e) => setGender(e.target.value)} 
            placeholder="남자 / 여자" required />
        </div>

        <div className="auth-form-group">
          <label>이메일</label>
          <input type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="example@email.com" required />
        </div>

        <div className="auth-form-group">
          <label>비밀번호</label>
          <input type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <div className="auth-form-group">
          <label>비밀번호 확인</label>
          <input type="password" value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>

        <button className="auth-button" type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default SignUpPage;
