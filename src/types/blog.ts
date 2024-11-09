export interface BlogPost {
  id: number;
  title: string;
  content: string;
  summary: string;
  coverImage?: string;
  authorId: number | null;
  author: {
    id: number;
    username: string;
    name: string;
    email: string;
    avatarUrl?: string;
    // ... 其他作者字段
  };
  status: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  categories: Array<{
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface BlogComment {
  id: number;
  postId: number;
  content: string;
  parentId?: number;
  authorId: number;
  user: {
    id: number;
    username: string;
    name: string;
    avatarUrl?: string;
  };
  createdAt: string;
  replies?: BlogComment[];
  replyCount?: number;
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

export interface CreateCommentRequest {
  postId: number;
  content: string;
  parentId?: number;
} 