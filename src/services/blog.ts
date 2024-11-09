import api from './api';
import type { BlogPost, BlogComment, CreateBlogRequest, Category, CreateCommentRequest } from '../types/blog';

export const blogApi = {
  // 获取博客列表
  getPosts: async (params: {
    page: number;
    size: number;
    tag?: string;
    categoryId?: number;
    search?: string;
  }) => {
    const response = await api.get('/posts', { params });
    return response.data;
  },

  // 获取博客详情
  getPost: async (id: number) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // 创建博客
  createPost: async (data: CreateBlogRequest) => {
    const response = await api.post('/posts', data);
    return response.data;
  },

  // 更新博客
  updatePost: async (id: number, data: Partial<CreateBlogRequest>) => {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  },

  // 删除博客
  deletePost: async (id: number) => {
    await api.delete(`/posts/${id}`);
  },

  // 获取文章评论列表
  getComments: async (postId: number) => {
    const response = await api.get(`/comments/post/${postId}`);
    return response.data;
  },

  // 创建评论
  addComment: async (data: CreateCommentRequest) => {
    const response = await api.post('/comments', data);
    return response.data;
  },

  // 删除评论
  deleteComment: async (commentId: number) => {
    await api.delete(`/comments/${commentId}`);
  },

  // 获取评论回复
  getCommentReplies: async (commentId: number) => {
    const response = await api.get(`/comments/${commentId}/replies`);
    return response.data;
  },

  // 获取评论数量
  getCommentCount: async (postId: number) => {
    const response = await api.get(`/comments/post/${postId}/count`);
    return response.data;
  },

  // 获取分类列表
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // 创建分类
  createCategory: async (data: { name: string; description: string }) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  // 获取标签列表
  getTags: async () => {
    const response = await api.get('/tags');
    return response.data;
  },

  // 创建标签
  createTag: async (name: string) => {
    const response = await api.post(`/tags?name=${encodeURIComponent(name)}`);
    return response.data;
  },

  // 上传文件
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('directory', 'images');
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 更新分类
  updateCategory: async (id: number, data: { name: string; description: string }) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  // 删除分类
  deleteCategory: async (id: number) => {
    await api.delete(`/categories/${id}`);
  },
}; 