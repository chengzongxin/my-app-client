import React from 'react';
import { Avatar, Space, Typography } from 'antd';
import type { BlogComment } from '../../types/blog';

const { Text } = Typography;

interface CommentProps {
  comment: BlogComment;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  return (
    <div style={{ display: 'flex', gap: '16px', padding: '12px 0' }}>
      <Avatar src={comment.author.avatarUrl} />
      <div style={{ flex: 1 }}>
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          <Space>
            <Text strong>{comment.author.name}</Text>
            <Text type="secondary">
              {new Date(comment.createdAt).toLocaleString()}
            </Text>
          </Space>
          <Text>{comment.content}</Text>
        </Space>
      </div>
    </div>
  );
};

export default Comment; 