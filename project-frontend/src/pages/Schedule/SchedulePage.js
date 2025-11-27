import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Schedule.css';

function SchedulePage() {
  const [joinedStudies, setJoinedStudies] = useState([]);
  const [selectedStudyId, setSelectedStudyId] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [note, setNote] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem('username');

  // 📌 URL에서 roomId 가져오기
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roomIdFromUrl = params.get("roomId");

    if (roomIdFromUrl) {
      setSelectedStudyId(Number(roomIdFromUrl));
    }
  }, [location.search]);

  // 📌 참여 중인 스터디 목록 가져오기
  useEffect(() => {
    if (!username) {
      alert("로그인이 필요합니다.");
      navigate('/login');
      return;
    }

    api.get(`/rooms/my-schedule?username=${username}`)
      .then(res => {
        const mapped = res.data.map(room => ({
          ...room,
          title: room.name
        }));

        setJoinedStudies(mapped);

        // URL에 roomId 없을 경우 첫 번째 방 자동 선택
        if (!selectedStudyId && mapped.length > 0) {
          setSelectedStudyId(mapped[0].id);
        }
      })
      .catch(err => {
        console.error("🔥 참여중인 스터디 조회 실패:", err);
      });
  }, [username]);

  // 📌 선택된 방의 일정 가져오기
  useEffect(() => {
    // ❗ selectedStudyId null/undefined 일 때 호출 방지
    if (selectedStudyId === null || selectedStudyId === undefined) return;

    api.get(`/schedules?roomId=${selectedStudyId}`)
      .then(res => {
        // 서버에서 Lazy 로딩 문제 대비해 room은 사용 안 함
        const safeData = res.data.map(item => ({
          id: item.id,
          date: item.date,
          note: item.note,
          username: item.username
        }));

        setSchedules(safeData);
      })
      .catch(err => {
        console.error("🔥 일정 불러오기 실패:", err);
      });
  }, [selectedStudyId]);

  // 📌 일정 추가
  const handleAdd = () => {
    if (!note.trim()) {
      alert("메모를 입력해주세요.");
      return;
    }

    const body = {
      roomId: selectedStudyId,
      username: username,
      date: selectedDate.toISOString().slice(0, 10),
      note: note.trim()
    };

    api.post('/schedules', body)
      .then(res => {
        setSchedules(prev => [...prev, res.data]);
        setNote('');
      })
      .catch(err => {
        console.error("🔥 일정 추가 실패:", err);
        alert("일정 추가 중 오류가 발생했습니다.");
      });
  };

  // 📌 일정 삭제
  const handleDelete = (scheduleId) => {
    api.delete(`/schedules/${scheduleId}?username=${username}`)
      .then(() => {
        setSchedules(prev => prev.filter(s => s.id !== scheduleId));
      })
      .catch(err => {
        console.error("🔥 일정 삭제 실패:", err);
        alert("삭제 실패: 본인이 작성한 일정만 삭제할 수 있습니다.");
      });
  };

  return (
    <div className="schedule-container">
      <h1>📅 스터디 일정 관리</h1>

      {/* 참여중인 스터디 선택 */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontWeight: 'bold' }}>참여중인 스터디:&nbsp;</label>
        <select
          className="schedule-select"
          value={selectedStudyId || ''}
          onChange={(e) => setSelectedStudyId(Number(e.target.value))}
        >
          {joinedStudies.map(s => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
      </div>

      {/* 일정 입력 */}
      <div className="schedule-input">
        <DatePicker
          selected={selectedDate}
          onChange={(d) => setSelectedDate(d)}
          dateFormat="yyyy-MM-dd"
          className="date-picker-input"
        />

        <input
          type="text"
          placeholder="메모 입력"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button className="schedule-add-button" onClick={handleAdd}>
          추가
        </button>
      </div>

      {/* 일정 목록 */}
      <ul className="schedule-list">
        {schedules.length === 0 && <p>등록된 일정이 없습니다.</p>}

        {schedules.map((item) => (
          <li key={item.id} className="schedule-item">
            <span>{item.date}</span>
            <span>{item.note}</span>
            <button
              className="schedule-delete-button"
              onClick={() => handleDelete(item.id)}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SchedulePage;
