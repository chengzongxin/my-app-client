import React, { useState, useEffect, useCallback } from 'react';
import { 
  Card, Space, Input, Tag, Button, Row, Col, Typography, 
  Skeleton, Empty, message, Pagination 
} from 'antd';
import { 
  EyeOutlined, LikeOutlined, MessageOutlined, 
  EditOutlined, PlusOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { blogApi } from '../../services/blog';
import type { BlogPost, Category } from '../../types/blog';
import BlogArchive from '../../components/BlogArchive';
import CategoryList from '../../components/CategoryList';

const { Search } = Input;
const { Title, Paragraph } = Typography;

interface TagData {
  id: number;
  name: string;
  createdAt: string;
}

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>();
  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await blogApi.getPosts({
        page: pagination.current,
        size: pagination.pageSize,
        categoryId: selectedCategory,
        search: searchText,
      });
      
      setPosts(response || []);
      setPagination(prev => ({
        ...prev,
        total: response?.length || 0,
      }));
    } catch (error) {
      console.error('获取博客列表失败:', error);
      message.error('获取博客列表失败');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, selectedCategory, searchText]);

  const fetchCategories = async () => {
    try {
      const response = await blogApi.getCategories();
      setCategories(response);
    } catch (error) {
      console.error('获取分类失败:', error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId === selectedCategory ? undefined : categoryId);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize || prev.pageSize,
    }));
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
          </Space>

          {loading ? (
            <Space direction="vertical" style={{ width: '100%' }}>
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <Skeleton active />
                </Card>
              ))}
            </Space>
          ) : posts && posts.length > 0 ? (
            <>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {posts.map(post => (
                  <Card
                    key={post.id}
                    hoverable
                    onClick={() => navigate(`/blog/${post.id}`)}
                  >
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      <Title level={4}>{post.title}</Title>
                      <Paragraph ellipsis={{ rows: 2 }}>{post.summary}</Paragraph>
                      
                      <Space wrap>
                        {post.tags && post.tags.map(tag => (
                          <Tag key={tag.id}>{tag.name}</Tag>
                        ))}
                      </Space>

                      <Row justify="space-between" align="middle">
                        <Col>
                          <Space>
                            <span>
                              <EyeOutlined /> {post.viewCount || 0}
                            </span>
                            <span>
                              <LikeOutlined /> {post.likeCount || 0}
                            </span>
                            <span>
                              <MessageOutlined /> {post.commentCount || 0}
                            </span>
                          </Space>
                        </Col>
                        <Col>
                          <Space align="center">
                            {post.author?.avatarUrl && (
                              <img
                                src={post.author.avatarUrl}
                                alt={post.author.name}
                                style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                }}
                              />
                            )}
                            <span>{post.author?.name}</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </Space>
                        </Col>
                      </Row>
                    </Space>
                  </Card>
                ))}
              </Space>
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePageChange}
                showSizeChanger
                showQuickJumper
                showTotal={total => `共 ${total} 条记录`}
              />
            </>
          ) : (
            <Empty description="暂无文章" />
          )}
        </Space>
      </Col>
      <Col xs={24} md={8}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <CategoryList 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryClick={handleCategoryClick}
          />
          {posts.length > 0 && (
            <BlogArchive posts={posts} />
          )}
        </Space>
      </Col>
    </Row>
  );
};

export default BlogList; 