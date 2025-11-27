// src/api/postsApi.js
import api from "./api";

const postsApi = {
  getPosts: () => api.get("/posts"),
  getPostById: (id) => api.get(`/posts/${id}`),
  createPost: (data) => api.post("/posts", data),
  updatePost: (id, data) => api.put(`/posts/${id}`, data),
  deletePost: (id) => api.delete(`/posts/${id}`),
};

export default postsApi;
