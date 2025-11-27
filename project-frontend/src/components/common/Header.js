import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/images/study.jpg'; // 👈 확장자를 .jpg로 최종 수정했습니다.

const Header = () => {
  return (
    <header className="header-container">
      <div className="header-left">
        <Link to="/profile" className="header-logo">
          <img src={logo} alt="S&C Study & Connect Logo" />
        </Link>
        <nav className="header-nav">
          <Link to="/profile">프로필</Link>
          <Link to="/study">스터디</Link>
          <Link to="/schedule">일정 관리</Link>
        </nav>
      </div>

      <div className="header-center">
        <input 
          type="text" 
          placeholder="관심있는 스터디를 검색해보세요" 
          className="search-input" 
        />
      </div>

      <div className="header-right">

      </div>
    </header>
  );
};

export default Header;