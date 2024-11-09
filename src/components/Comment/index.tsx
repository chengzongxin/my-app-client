import React, { useState } from 'react';
import { Avatar, Space, Typography, Button, Input, message, Popconfirm } from 'antd';
import { DeleteOutlined, CommentOutlined, UserOutlined } from '@ant-design/icons';
import { blogApi } from '../../services/blog';

const { Text } = Typography;
const { TextArea } = Input;

interface CommentUser {
  id: number;
  username: string;
  name: string;
  avatarUrl?: string;
}

interface CommentData {
  id: number;
  postId: number;
  content: string;
  parentId: number | null;
  user: CommentUser;
  createdAt: string;
  replyCount?: number;
  replies?: CommentData[];
}

interface CommentProps {
  comment: CommentData;
  onDelete?: () => void;
  onReply?: () => void;
  currentUserId?: number;
}

const Comment: React.FC<CommentProps> = ({ 
  comment, 
  onDelete, 
  onReply,
  currentUserId 
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<CommentData[]>(comment.replies || []);

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    try {
      setSubmitting(true);
      await blogApi.addComment({
        postId: comment.postId,
        content: replyContent,
        parentId: comment.id,
      });
      message.success('回复成功');
      setReplyContent('');
      setShowReplyInput(false);
      
      // 重新获取回复列表
      const newReplies = await blogApi.getCommentReplies(comment.id);
      setReplies(newReplies);
      onReply?.();
    } catch (error) {
      message.error('回复失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await blogApi.deleteComment(comment.id);
      message.success('删除成功');
      onDelete?.();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const loadReplies = async () => {
    try {
      const data = await blogApi.getCommentReplies(comment.id);
      setReplies(data);
      setShowReplies(true);
    } catch (error) {
      message.error('获取回复失败');
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        {comment.user?.avatarUrl ? (
          <Avatar src={comment.user.avatarUrl} />
        ) : (
          <Avatar icon={<UserOutlined />} />
        )}
        <div style={{ flex: 1 }}>
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <Space>
              <Text strong>{comment.user?.name || '匿名用户'}</Text>
              <Text type="secondary">
                {new Date(comment.createdAt).toLocaleString()}
              </Text>
            </Space>
            <Text>{comment.content}</Text>
            <Space>
              <Button 
                type="text" 
                icon={<CommentOutlined />}
                onClick={() => setShowReplyInput(!showReplyInput)}
              >
                回复
              </Button>
              {currentUserId === comment.user?.id && (
                <Popconfirm
                  title="确定要删除这条评论吗？"
                  onConfirm={handleDelete}
                >
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />}
                  >
                    删除
                  </Button>
                </Popconfirm>
              )}
            </Space>

            {showReplyInput && (
              <div style={{ marginTop: 8 }}>
                <TextArea
                  rows={2}
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  placeholder="写下你的回复..."
                />
                <Space style={{ marginTop: 8 }}>
                  <Button 
                    type="primary" 
                    size="small"
                    onClick={handleReply}
                    loading={submitting}
                  >
                    发表回复
                  </Button>
                  <Button 
                    size="small"
                    onClick={() => {
                      setShowReplyInput(false);
                      setReplyContent('');
                    }}
                  >
                    取消
                  </Button>
                </Space>
              </div>
            )}

            {comment.replyCount && comment.replyCount > 0 && !showReplies && (
              <Button 
                type="link" 
                onClick={loadReplies}
              >
                查看 {comment.replyCount} 条回复
              </Button>
            )}

            {showReplies && replies.length > 0 && (
              <div style={{ marginLeft: 32, marginTop: 16 }}>
                {replies.map(reply => (
                  <Comment
                    key={reply.id}
                    comment={reply}
                    currentUserId={currentUserId}
                    onDelete={() => loadReplies()}
                    onReply={() => loadReplies()}
                  />
                ))}
              </div>
            )}
          </Space>
        </div>
      </div>
    </div>
  );
};

export default Comment;