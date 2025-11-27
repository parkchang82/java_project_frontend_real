// src/api/schedulesApi.js
import api from "./api";

const schedulesApi = {
  // 특정 방 일정 가져오기
  getSchedules: (roomId) =>
    api.get(`/schedules?roomId=${roomId}`),

  // 일정 추가
  createSchedule: (data) =>
    api.post(`/schedules`, data),

  // 일정 삭제
  deleteSchedule: (id, username) =>
    api.delete(`/schedules/${id}?username=${username}`),
};

export default schedulesApi;
