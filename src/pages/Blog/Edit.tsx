import React, { useState, useEffect, useCallback } from 'react';
import { 
  Card, Form, Input, Button, Space, message, 
  Select, Divider, Modal 
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { blogApi } from '../../services/blog';
import type { CreateBlogRequest, BlogPost, Category } from '../../types/blog';

const BlogEdit: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryForm] = Form.useForm();

  useEffect(() => {
    fetchCategories();
    fetchTags();
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const post = await blogApi.getPost(parseInt(id!));
      form.setFieldsValue({
        title: post.title,
        categoryId: post.categoryIds?.[0],
        tags: post.tags,
      });
      setContent(post.content);
    } catch (error) {
      message.error('获取文章失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const data = await blogApi.getTags();
      setTags(data);
    } catch (error) {
      console.error('获取标签失败:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await blogApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('获取分类失败:', error);
    }
  };

  const handleSubmit = async (values: any) => {
    if (!content.trim()) {
      message.error('请输入文章内容');
      return;
    }

    try {
      setLoading(true);
      const postData: CreateBlogRequest = {
        ...values,
        content,
        status: 'published',
        categoryIds: values.categoryId ? [values.categoryId] : [],
        tags: values.tags || [],
        summary: content.slice(0, 200), // 使用内容前200个字符作为摘要
      };

      if (id) {
        await blogApi.updatePost(parseInt(id), postData);
        message.success('更新成功');
      } else {
        await blogApi.createPost(postData);
        message.success('发布成功');
      }
      navigate('/blog');
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      const values = await categoryForm.validateFields();
      setCategoryLoading(true);
      await blogApi.createCategory(values);
      message.success('分类添加成功');
      setShowCategoryModal(false);
      categoryForm.resetFields();
      fetchCategories(); // 重新获取分类列表
    } catch (error) {
      message.error('添加分类失败');
    } finally {
      setCategoryLoading(false);
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ background: '#fff', padding: '24px' }}
      >
        <Form.Item
          name="title"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input 
            size="large"
            placeholder="请输入文章标题" 
            bordered={false}
            style={{ fontSize: '24px' }}
          />
        </Form.Item>

        <Space style={{ marginBottom: 16 }} size="large">
          <Form.Item
            name="categoryId"
            style={{ marginBottom: 0 }}
          >
            <Select
              placeholder="选择分类（可选）"
              style={{ width: 200 }}
              allowClear
              options={categories.map(cat => ({ 
                label: cat.name, 
                value: cat.id 
              }))}
              dropdownRender={menu => (
                <div>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <Space style={{ padding: '0 8px 4px' }}>
                    <Button
                      type="link"
                      icon={<PlusOutlined />}
                      onClick={() => setShowCategoryModal(true)}
                    >
                      添加新分类
                    </Button>
                  </Space>
                </div>
              )}
            />
          </Form.Item>

          <Form.Item
            name="tags"
            style={{ marginBottom: 0 }}
          >
            <Select
              mode="tags"
              style={{ width: 300 }}
              placeholder="输入标签（可选）"
              options={tags.map(tag => ({ label: tag, value: tag }))}
            />
          </Form.Item>
        </Space>

        <Form.Item
          required
          style={{ marginBottom: 16 }}
        >
          <MDEditor
            value={content}
            onChange={value => setContent(value || '')}
            height={600}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
            >
              {id ? '更新' : '发布'}
            </Button>
            <Button onClick={() => navigate('/blog')}>
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <Modal
        title="添加新分类"
        open={showCategoryModal}
        onOk={handleAddCategory}
        onCancel={() => setShowCategoryModal(false)}
        confirmLoading={categoryLoading}
      >
        <Form form={categoryForm} layout="vertical">
          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="分类描述"
            rules={[{ required: true, message: '请输入分类描述' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入分类描述" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default BlogEdit; 