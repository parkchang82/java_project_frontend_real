// src/api/roomsApi.js
import api from "./api";

const roomsApi = {
  getRoom: (id) => api.get(`/rooms/${id}`),

  joinRoom: (id, username) =>
    api.post(`/rooms/${id}/join`, { username }),

  getMyRooms: (username) =>
    api.get(`/rooms/my-schedule?username=${username}`),
};

export default roomsApi;
