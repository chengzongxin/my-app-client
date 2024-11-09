import axios from 'axios';
import { message } from 'antd';
import { LoginRequest, LoginResponse, User, RegisterRequest } from '../types/user';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // token 过期或无效
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      message.error('登录已过期，请重新登录');
      window.location.href = '/login';
    }
    const errorMessage = error.response?.data?.message || '请求失败，请稍后重试';
    message.error(errorMessage);
    return Promise.reject(error);
  }
);

export const userApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/users/login', data);
    return response.data;
  },

  getUsers: async (params: { page: number; size: number; search?: string }) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  updateUserStatus: async (userId: number, status: number) => {
    const response = await api.patch(`/users/${userId}/status`, { status });
    return response.data;
  },

  updateUser: async (userId: number, data: Partial<User>) => {
    const response = await api.put(`/users/${userId}`, data);
    return response.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await api.post('/users', data);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/users/all');
    return response.data;
  },

  // 更新用户头像
  updateAvatar: async (userId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/users/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 获取用户信息
  getUserInfo: async (userId: number) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
};

export default api; 