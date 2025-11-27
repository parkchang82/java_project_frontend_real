import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/login", {
        email: email,
        password: password
      });

      if (res.data.success) {
        // ▼▼▼▼▼ 여기 딱 한 줄만 추가됨 (기존 로직 영향 X) ▼▼▼▼▼
        localStorage.setItem("username", email); 
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
        
        localStorage.setItem("accessToken", res.data.accessToken); // 기존 토큰 저장 유지
        alert("로그인 성공 ✅");
        navigate("/profile");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("이메일 또는 비밀번호가 잘못되었습니다 ❌");
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <h1>로그인</h1>
      <form onSubmit={handleLogin} className="auth-form">
        <div className="auth-form-group">
          <label>이메일</label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="auth-form-group">
          <label>비밀번호</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="auth-button" type="submit">로그인</button>
        <button type="button" className="auth-button" style={{ marginTop: "10px" }} onClick={() => navigate("/signup")}>
          회원가입
        </button>
      </form>
    </div>
  );
}

export default LoginPage;