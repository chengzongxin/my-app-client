import React, { useState, useEffect } from 'react';
import { 
  Card, Space, Typography, Button, Divider, Avatar, 
  Form, Input, message, Tag, Row, Col 
} from 'antd';
import { 
  LikeOutlined, LikeFilled, EyeOutlined, 
  MessageOutlined, EditOutlined, DeleteOutlined 
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { blogApi } from '../../services/blog';
import type { BlogPost, BlogComment } from '../../types/blog';
import ReactMarkdown from 'react-markdown';
import Comment from '../../components/Comment';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const userString = localStorage.getItem('user');
  const currentUser = userString ? JSON.parse(userString) : null;

  const fetchPost = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await blogApi.getPost(parseInt(id));
      setPost(data);
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

  const handleEdit = () => {
    if (!id) return;
    navigate(`/blog/edit/${id}`);
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

  if (loading) {
    return <Card loading />;
  }

  if (!post) {
    return null;
  }

  const isAuthor = currentUser?.userId === post.authorId;

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2}>{post.title}</Title>
            </Col>
            {isAuthor && (
              <Col>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<EditOutlined />}
                    onClick={handleEdit}
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

          <div className="markdown-content">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </Space>
      </Card>

      <Card title={`评论 (${comments.length})`}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Form>
            <Form.Item>
              <TextArea 
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

          {comments.map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </Space>
      </Card>
    </Space>
  );
};

export default BlogDetail; 