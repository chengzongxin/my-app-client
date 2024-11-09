export interface BlogPost {
  id: number;
  title: string;
  content: string;
  summary: string;
  coverImage?: string;
  categoryIds: number[];
  tags: string[];
  authorId: number;
  author: {
    name: string;
    avatarUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
  likes: number;
  views: number;
  comments: number;
  status: 'draft' | 'published';
}

export interface BlogComment {
  id: number;
  postId: number;
  content: string;
  parentId?: number;
  authorId: number;
  author: {
    name: string;
    avatarUrl?: string;
  };
  createdAt: string;
  replies?: BlogComment[];
}

export interface CreateBlogRequest {
  title: string;
  content: string;
  summary: string;
  categoryIds: number[];
  tags: string[];
  status: 'draft' | 'published';
}

export interface UpdateBlogRequest extends Partial<CreateBlogRequest> {
  id: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  postCount?: number;
} 