import React, { useState, useEffect, useCallback } from 'react';
import { 
  Card, Space, Input, Tag, Button, Row, Col, Typography, 
  Skeleton, Empty, message 
} from 'antd';
import { 
  EyeOutlined, LikeOutlined, MessageOutlined, 
  EditOutlined, PlusOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { blogApi } from '../../services/blog';
import type { BlogPost } from '../../types/blog';
import BlogArchive from '../../components/BlogArchive';
import TagCloud from '../../components/TagCloud';

const { Search } = Input;
const { Title, Paragraph } = Typography;

interface TagWithCount {
  name: string;
  count: number;
}

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>();
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await blogApi.getPosts({
        page: 1,
        size: 10,
        tag: selectedTag,
        search: searchText,
      });
      setPosts(response?.data || []);
    } catch (error) {
      console.error('获取博客列表失败:', error);
      message.error('获取博客列表失败');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedTag, searchText]);

  const fetchTags = async () => {
    try {
      const response = await blogApi.getTags();
      const tagStrings = Array.isArray(response) ? response : [];
      const tagsWithCount = tagStrings.map((tag: string) => ({
        name: tag,
        count: posts.filter(post => post.tags.includes(tag)).length
      }));
      setTags(tagsWithCount);
    } catch (error) {
      console.error('获取标签失败:', error);
      setTags([]);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [posts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleTagClick = (tagName: string) => {
    setSelectedTag(tagName === selectedTag ? undefined : tagName);
  };

  return (
    <Row gutter={24}>
      <Col xs={24} md={16}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2}>博客文章</Title>
            </Col>
            <Col>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => navigate('/blog/new')}
              >
                写文章
              </Button>
            </Col>
          </Row>

          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Search
              placeholder="搜索文章"
              allowClear
              enterButton
              onSearch={handleSearch}
              style={{ maxWidth: 400 }}
            />

            <Space wrap>
              {Array.isArray(tags) && tags.map(tag => (
                <Tag
                  key={`tag-${tag.name}`}
                  color={tag.name === selectedTag ? 'blue' : undefined}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleTagClick(tag.name)}
                >
                  {`${tag.name} (${tag.count})`}
                </Tag>
              ))}
            </Space>
          </Space>

          {loading ? (
            <Space direction="vertical" style={{ width: '100%' }}>
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <Skeleton active />
                </Card>
              ))}
            </Space>
          ) : posts.length > 0 ? (
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {posts.map(post => (
                <Card
                  key={post.id}
                  hoverable
                  onClick={() => navigate(`/blog/${post.id}`)}
                  cover={
                    post.coverImage && (
                      <img
                        alt={post.title}
                        src={post.coverImage}
                        style={{ height: 200, objectFit: 'cover' }}
                      />
                    )
                  }
                >
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Title level={4}>{post.title}</Title>
                    <Paragraph ellipsis={{ rows: 2 }}>{post.summary}</Paragraph>
                    
                    <Space wrap>
                      {post.tags.map(tag => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </Space>

                    <Row justify="space-between" align="middle">
                      <Col>
                        <Space>
                          <span>
                            <EyeOutlined /> {post.views}
                          </span>
                          <span>
                            <LikeOutlined /> {post.likes}
                          </span>
                          <span>
                            <MessageOutlined /> {post.comments}
                          </span>
                        </Space>
                      </Col>
                      <Col>
                        <Space align="center">
                          <img
                            src={post.author.avatarUrl}
                            alt={post.author.name}
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                            }}
                          />
                          <span>{post.author.name}</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </Space>
                      </Col>
                    </Row>
                  </Space>
                </Card>
              ))}
            </Space>
          ) : (
            <Empty description="暂无文章" />
          )}
        </Space>
      </Col>
      <Col xs={24} md={8}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {Array.isArray(tags) && (
            <TagCloud 
              tags={tags}
              selectedTag={selectedTag}
              onTagClick={handleTagClick}
            />
          )}
          {Array.isArray(posts) && posts.length > 0 && (
            <BlogArchive posts={posts} />
          )}
        </Space>
      </Col>
    </Row>
  );
};

export default BlogList; 