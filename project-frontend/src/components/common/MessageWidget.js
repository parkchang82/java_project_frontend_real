import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MessageWidget.css'; // 또는 './components/common/MessageWidget.css'
import { IoMdArrowBack, IoMdSend } from 'react-icons/io';

const API_URL = '/api/messages'; 

// (중요) 실제로는 이 ID를 Redux나 Context API에서 가져와야 합니다.
const CURRENT_USER_ID = 1; 

const MessageWidget = ({ onClose }) => {
  const [view, setView] = useState('list'); 
  
  // [수정] currentChatPartner가 {id, name, email}을 갖도록 변경
  const [currentChatPartner, setCurrentChatPartner] = useState(null); 

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // [수정] newReceiverId -> newReceiverEmail
  const [newReceiverEmail, setNewReceiverEmail] = useState('');
  const [newMessageContent, setNewMessageContent] = useState('');

  // --- API 호출 함수 ---

  // 1. (list) 내 대화 목록 불러오기
  const fetchConversations = () => {
    axios.get(`${API_URL}/conversations`)
      .then(res => {
        setConversations(res.data);
      })
      .catch(err => console.error("대화 목록 로딩 실패:", err));
  };

  // 2. (chat) 특정 사용자와의 대화 내역 불러오기
  // [수정] partner 객체에 email 포함
  const fetchMessages = (partner) => { // partner는 {id, name, email}
    axios.get(`${API_URL}/conversation/${partner.id}`)
      .then(res => {
        setMessages(res.data);
        setCurrentChatPartner(partner); // 파트너 정보(email 포함) 저장
        setView('chat'); 
      })
      .catch(err => console.error("메시지 로딩 실패:", err));
  };

  // 3. (chat) 메시지 전송 (답장 기능) [버그 수정됨]
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      // [수정] receiverId -> receiverEmail
      // 백엔드가 Email만 받으므로, state에 저장된 파트너의 email을 전송
      receiverEmail: currentChatPartner.email,
      content: newMessage
    };

    axios.post(API_URL, messageData) 
      .then(res => {
        setMessages([...messages, res.data]);
        setNewMessage('');
      })
      .catch(err => console.error("메시지 전송 실패:", err));
  };

  // 4. (new) 새 쪽지 전송 [요청 사항 적용]
  const handleSendNewMessage = (e) => {
    e.preventDefault();
    if (!newReceiverEmail.trim() || !newMessageContent.trim()) { 
      alert("이메일과 내용을 모두 입력하세요.");
      return;
    }

    const messageData = {
      receiverEmail: newReceiverEmail, 
      content: newMessageContent
    };

    axios.post(API_URL, messageData)
      .then(res => {
        // 전송 성공 시 응답 DTO에서 이메일 정보도 가져옴
        const partner = {
          id: res.data.receiverId,
          name: res.data.receiverName,
          email: res.data.receiverEmail // 1단계에서 DTO에 추가한 이메일
        };

        fetchMessages(partner); // 해당 유저와의 'chat' 뷰로 바로 이동
        setNewReceiverEmail(''); 
        setNewMessageContent('');
      })
      .catch(err => {
        console.error("새 메시지 전송 실패:", err);
        alert("메시지 전송에 실패했습니다. (이메일 주소 확인)");
      });
  };

  // --- 뷰 변경 핸들러 ---

  // [수정] 대화 목록 클릭 시 상대방의 email도 함께 저장
  const onConversationClick = (convo) => {
    // convo 객체는 1단계에서 수정한 DTO가 옴 (email 포함)
    const isSender = convo.senderId === CURRENT_USER_ID;
    
    const partner = {
      id: isSender ? convo.receiverId : convo.senderId,
      name: isSender ? convo.receiverName : convo.senderName,
      email: isSender ? convo.receiverEmail : convo.senderEmail // 상대방 이메일
    };
    
    fetchMessages(partner);
  };

  // 뒤로가기 버튼
  const handleBackToList = () => {
    setView('list');
    setCurrentChatPartner(null);
    setMessages([]);
    fetchConversations();
  };

  // 'list' 뷰일 때 대화 목록 로드
  useEffect(() => {
    if (view === 'list') {
      fetchConversations();
    }
  }, [view]);


  // --- 렌더링 ---

  // 헤더 렌더링 (동일)
  const renderHeader = () => (
    <div className="widget-header">
      {view !== 'list' && (
        <button className="close-btn" onClick={handleBackToList} style={{ fontSize: '1.2rem' }}>
          <IoMdArrowBack />
        </button>
      )}
      <h4>
        {view === 'list' && '쪽지함'}
        {view === 'chat' && currentChatPartner?.name}
        {view === 'new' && '새 쪽지 보내기'}
      </h4>
      <button className="close-btn" onClick={onClose}>&times;</button>
    </div>
  );

  // 바디 렌더링
  const renderBody = () => {

    // 1. 대화 목록 뷰 (동일)
    if (view === 'list') {
      return (
        <div className="conversation-list">
          <button className="widget-button" onClick={() => setView('new')}>
            + 새 쪽지 보내기
          </button>
          <ul>
            {conversations.length === 0 && <p>대화 내역이 없습니다.</p>}
            {conversations.map(convo => (
              <li key={convo.messageId} onClick={() => onConversationClick(convo)}>
                <strong>
                  {convo.senderId === CURRENT_USER_ID ? convo.receiverName : convo.senderName}
                </strong>
                <p>{convo.content}</p>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    // 2. 새 쪽지 뷰 [요청 사항 적용]
    if (view === 'new') {
      return (
        <form className="new-message-form" onSubmit={handleSendNewMessage}>
          <input 
            type="email" // [수정] email 타입
            placeholder="받는 사람 이메일 (Email)" // [수정]
            value={newReceiverEmail} // [수정]
            onChange={(e) => setNewReceiverEmail(e.target.value)} // [수정]
          />
          <textarea
            placeholder="메시지 내용을 입력하세요..."
            value={newMessageContent}
            onChange={(e) => setNewMessageContent(e.target.value)}
          />
          <button type="submit" className="widget-button">전송</button>
        </form>
      );
    }

    // 3. 대화창 뷰 (동일)
    if (view === 'chat') {
      return (
        <div className="chat-window">
          <div className="chat-messages">
            {messages.map(msg => (
              <div 
                key={msg.messageId}
                className={`message-bubble ${msg.senderId === CURRENT_USER_ID ? 'sent' : 'received'}`}
              >
                {msg.content}
              </div>
            ))}
          </div>
          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input 
              type="text"
              placeholder="메시지 입력..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit"><IoMdSend /></button>
          </form>
        </div>
      );
    }
  };

  // 최종 반환 (동일)
  return (
    <div className="message-widget">
      {renderHeader()}
      <div className="widget-body">
        {renderBody()}
      </div>
    </div>
  );
};

export default MessageWidget;