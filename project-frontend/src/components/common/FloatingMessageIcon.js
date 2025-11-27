import React from 'react';
import './FloatingMessageIcon.css'; // 방금 만든 CSS 임포트
import { MdChat } from 'react-icons/md'; // 3-1에서 설치한 react-icons 라이브러리

/**
 * @param {function} onClick 아이콘 클릭 시 실행될 함수 (부모가 전달)
 * @param {number} unreadCount 안 읽은 메시지 개수 (부모가 전달)
 */
const FloatingMessageIcon = ({ onClick, unreadCount }) => {
  return (
    <div className="fab-container" onClick={onClick}>
      <div className="fab-icon">

        {/* 아이콘 (MdChat 대신 다른 아이콘 사용 가능) */}
        <MdChat /> 

        {/* 안 읽은 메시지 개수가 0보다 크면 배지 표시 */}
        {unreadCount > 0 && (
          <div className="fab-badge">
            {/* 9개보다 많으면 9+로 표시 */}
            {unreadCount > 9 ? '9+' : unreadCount} 
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingMessageIcon;