import React, { useState, useEffect } from 'react';
import { 
  Card, Space, Typography, Button, Divider, Avatar, 
  Form, Input, message, Tag, Row, Col, Modal, Empty 
} from 'antd';
import { 
  LikeOutlined, LikeFilled, EyeOutlined, 
  MessageOutlined, EditOutlined, DeleteOutlined,
  SaveOutlined, CloseOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { blogApi } from '../../services/blog';
import type { BlogPost, BlogComment } from '../../types/blog';
import ReactMarkdown from 'react-markdown';
import Comment from '../../components/Comment';
import MDEditor from '@uiw/react-md-editor';

const { Title, Text } = Typography;

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const userString = localStorage.getItem('user');
  const currentUser = userString ? JSON.parse(userString) : null;

  const fetchPost = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await blogApi.getPost(parseInt(id));
      setPost(data);
      setEditContent(data.content);
      setEditTitle(data.title);
    } catch (error) {
      message.error('获取文章失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    if (!id) return;
    try {
      const data = await blogApi.getComments(parseInt(id));
      setComments(data);
    } catch (error) {
      console.error('获取评论失败:', error);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const handleLike = async () => {
    message.info('点赞功能暂未实现');
  };

  const handleComment = async () => {
    if (!id || !commentContent.trim()) return;
    try {
      setSubmitting(true);
      await blogApi.addComment({
        postId: parseInt(id),
        content: commentContent,
      });
      message.success('评论成功');
      setCommentContent('');
      fetchComments();
    } catch (error) {
      message.error('评论失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !post) return;
    try {
      await blogApi.deletePost(parseInt(id));
      message.success('删除成功');
      navigate('/blog');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSaveEdit = async () => {
    if (!id || !post) return;
    try {
      setLoading(true);
      await blogApi.updatePost(parseInt(id), {
        title: editTitle,
        content: editContent,
        categoryIds: post.categories.map(cat => cat.id),
        tags: post.tags.map(tag => tag.name),
        summary: editContent.slice(0, 200),
      });
      message.success('更新成功');
      setIsEditing(false);
      fetchPost();
    } catch (error) {
      message.error('更新失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    Modal.confirm({
      title: '确定要取消编辑吗？',
      content: '取消编辑后，所有修改都将丢失。',
      onOk: () => {
        setIsEditing(false);
        setEditContent(post?.content || '');
        setEditTitle(post?.title || '');
      },
    });
  };

  if (loading) {
    return <Card loading />;
  }

  if (!post) {
    return null;
  }

  const isAuthor = currentUser?.userId === post.author.id;

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Row justify="space-between" align="middle">
            <Col>
              {isEditing ? (
                <Input
                  size="large"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  style={{ 
                    fontSize: '24px',
                    fontWeight: 'bold',
                    border: 'none',
                    padding: '0',
                    marginBottom: '16px'
                  }}
                />
              ) : (
                <Title level={2}>{post.title}</Title>
              )}
            </Col>
            {isAuthor && (
              <Col>
                <Space>
                  {isEditing ? (
                    <>
                      <Button 
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleSaveEdit}
                        loading={loading}
                      >
                        保存
                      </Button>
                      <Button 
                        icon={<CloseOutlined />}
                        onClick={handleCancelEdit}
                      >
                        取消
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        type="primary" 
                        icon={<EditOutlined />}
                        onClick={() => setIsEditing(true)}
                      >
                        编辑
                      </Button>
                      <Button 
                        danger 
                        icon={<DeleteOutlined />}
                        onClick={handleDelete}
                      >
                        删除
                      </Button>
                    </>
                  )}
                </Space>
              </Col>
            )}
          </Row>

          <Space wrap>
            {post.tags.map(tag => (
              <Tag key={tag.id}>{tag.name}</Tag>
            ))}
          </Space>

          <Space split={<Divider type="vertical" />}>
            <Space>
              <Avatar src={post.author.avatarUrl} />
              <Text>{post.author.name}</Text>
            </Space>
            <Text>{new Date(post.createdAt).toLocaleDateString()}</Text>
            <Space>
              <EyeOutlined /> {post.viewCount}
              <Button 
                type="text" 
                icon={liked ? <LikeFilled /> : <LikeOutlined />}
                onClick={handleLike}
              >
                {post.likeCount}
              </Button>
              <MessageOutlined /> {comments.length}
            </Space>
          </Space>

          <Divider />

          {isEditing ? (
            <MDEditor
              value={editContent}
              onChange={value => setEditContent(value || '')}
              height={500}
              preview="edit"
            />
          ) : (
            <div className="markdown-content">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          )}
        </Space>
      </Card>

      <Card title={`评论 (${comments.length})`}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Form>
            <Form.Item>
              <Input.TextArea 
                rows={4} 
                value={commentContent}
                onChange={e => setCommentContent(e.target.value)}
                placeholder="写下你的评论..."
              />
            </Form.Item>
            <Form.Item>
              <Button 
                type="primary" 
                onClick={handleComment}
                loading={submitting}
                disabled={!commentContent.trim()}
              >
                发表评论
              </Button>
            </Form.Item>
          </Form>

          <Divider />

          {comments.length > 0 ? (
            comments.map(comment => comment && (
                <>
              <Comment 
                key={comment.id} 
                comment={{
                  id: comment.id,
                  postId: comment.postId,
                  content: comment.content,
                  parentId: comment.parentId || null,
                  user: {
                    id: comment.user?.id || 0,
                    username: comment.user?.username || '',
                    name: comment.user?.name || '匿名用户',
                    avatarUrl: comment.user?.avatarUrl
                  },
                  createdAt: comment.createdAt,
                  replyCount: comment.replies?.length || 0,
                  replies: comment.replies?.map(reply => reply && ({
                    id: reply.id,
                    postId: reply.postId,
                    content: reply.content,
                    parentId: reply.parentId || null,
                    user: {
                      id: reply.user?.id || 0,
                      username: reply.user?.username || '',
                      name: reply.user?.name || '匿名用户',
                      avatarUrl: reply.user?.avatarUrl
                    },
                    createdAt: reply.createdAt,
                    replyCount: 0,
                    replies: []
                  })).filter(Boolean)
                }}
                currentUserId={currentUser?.userId}
              />
              </>
            ))
          ) : (
            <Empty description="暂无评论" />
          )}
        </Space>
      </Card>
    </Space>
  );
};

export default BlogDetail;