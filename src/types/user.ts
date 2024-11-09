export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  name: string;
  email: string;
  password: string;
  status: number;
}

export interface LoginResponse {
  userId: number;
  username: string;
  name: string;
  email: string;
  token: string;
  lastLoginTime: string;
}

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  lastLoginTime: string;
} 