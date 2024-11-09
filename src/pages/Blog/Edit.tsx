import React, { useState, useEffect, useCallback } from 'react';
import { 
  Card, Form, Input, Button, Space, message, 
  Select, Divider, Modal 
} from 'antd';
import { PlusOutlined, InfoCircleOutlined, SaveOutlined, SendOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { blogApi } from '../../services/blog';
import type { CreateBlogRequest, BlogPost, Category } from '../../types/blog';

interface TagData {
  id: number;
  name: string;
  createdAt: string;
}

interface DraftPost {
  title: string;
  content: string;
  categoryId?: number;
  tags?: string[];
  lastSaved: string;
}

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
      const response = await blogApi.getTags();
      const tagNames = (response as TagData[]).map(tag => tag.name);
      setTags(tagNames);
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

  // 处理粘贴事件
  const handlePaste = useCallback(async (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    const imageItem = Array.from(items).find(
      item => item.type.indexOf('image') !== -1
    );

    if (imageItem) {
      event.preventDefault();
      const file = imageItem.getAsFile();
      if (!file) return;

      const tempId = Date.now().toString();
      const tempText = `![Uploading ${file.name}...](pending-${tempId})`;

      try {
        setContent(prev => {
          const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement;
          if (!textarea) return prev;
          
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          return prev.slice(0, start) + tempText + prev.slice(end);
        });

        // 上传图片
        const response = await blogApi.uploadFile(file);
        
        setContent(prev => 
          prev.replace(
            tempText,
            `![${file.name}](${response.url})`
          )
        );

        message.success('图片上传成功');
      } catch (error) {
        message.error('图片上传失败');
        setContent(prev => prev.replace(tempText, ''));
      }
    }
  }, []);

  // 添加和移除粘贴事件监听器
  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  // 添加自动保存到本地的功能
  useEffect(() => {
    // 从本地存储加载草稿
    const loadDraft = () => {
      const draftString = localStorage.getItem('blog_draft');
      if (draftString) {
        const draft: DraftPost = JSON.parse(draftString);
        form.setFieldsValue({
          title: draft.title,
          categoryId: draft.categoryId,
          tags: draft.tags,
        });
        setContent(draft.content);
        message.info(`已加载上次保存的草稿（${new Date(draft.lastSaved).toLocaleString()}）`);
      }
    };

    // 只有在新建文章时才加载草稿
    if (!id) {
      loadDraft();
    }
  }, [form, id]);

  // 修改保存草稿功能
  const handleSaveDraft = async () => {
    try {
      const values = await form.validateFields();
      const draftData: DraftPost = {
        title: values.title || '',
        content: content,
        categoryId: values.categoryId,
        tags: values.tags,
        lastSaved: new Date().toISOString(),
      };

      localStorage.setItem('blog_draft', JSON.stringify(draftData));
      message.success('草稿已保存到本地');
    } catch (error) {
      message.error('保存草稿失败');
    }
  };

  // 修改发布函数，发布成功后清除草稿
  const handlePublish = async () => {
    if (!content.trim()) {
      message.error('请输入文章内容');
      return;
    }

    try {
      setLoading(true);
      const values = await form.validateFields();
      const postData: CreateBlogRequest = {
        ...values,
        content,
        status: 'published',
        categoryIds: values.categoryId ? [values.categoryId] : [],
        tags: values.tags || [],
        summary: content.slice(0, 200),
      };

      if (id) {
        await blogApi.updatePost(parseInt(id), postData);
        message.success('文章已更新并发布');
      } else {
        await blogApi.createPost(postData);
        message.success('文章已发布');
        // 发布成功后清除草稿
        localStorage.removeItem('blog_draft');
      }
      navigate('/blog');
    } catch (error) {
      message.error('发布失败');
    } finally {
      setLoading(false);
    }
  };

  // 添加自动保存功能
  useEffect(() => {
    if (!id) {  // 只在新建文章时自动保存
      const autoSaveTimer = setInterval(() => {
        const values = form.getFieldsValue();
        if (values.title || content) {  // 只有当有内容时才保存
          const draftData: DraftPost = {
            title: values.title || '',
            content: content,
            categoryId: values.categoryId,
            tags: values.tags,
            lastSaved: new Date().toISOString(),
          };
          localStorage.setItem('blog_draft', JSON.stringify(draftData));
          console.log('自动保存草稿成功:', new Date().toLocaleString());
        }
      }, 30000);  // 每30秒自动保存一次

      return () => clearInterval(autoSaveTimer);
    }
  }, [form, content, id]);

  return (
    <div style={{ 
      background: '#fff', 
      minHeight: 'calc(100vh - 180px)',
      padding: '24px',
      position: 'relative'
    }}>
      {/* 修改按钮组 */}
      <div style={{
        position: 'absolute',
        top: 24,
        right: 24,
        display: 'flex',
        gap: '12px',
        background: '#fff',
        padding: '12px 24px',
        borderRadius: '8px',
        zIndex: 100,
      }}>
        <Button 
          size="large"
          onClick={handleSaveDraft}
          icon={<SaveOutlined />}
          loading={loading}
        >
          保存草稿
        </Button>
        <Button 
          type="primary" 
          size="large"
          icon={<SendOutlined />}  // 使用发送图标
          onClick={handlePublish}
          loading={loading}
          style={{ padding: '0 32px' }}
        >
          发布文章
        </Button>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="title"
          rules={[{ required: true, message: '请输入标题' }]}
          style={{ marginBottom: 40 }}  // 增加标题和其他内容的���距
        >
          <Input 
            size="large"
            placeholder="请输入文章标题" 
            bordered={false}
            style={{ 
              fontSize: '28px',
              fontWeight: 'bold',
              padding: '8px 0'
            }}
          />
        </Form.Item>

        <Space style={{ marginBottom: 24 }} size="large">
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
              options={tags.map(tag => ({ 
                label: tag, 
                value: tag 
              }))}
            />
          </Form.Item>
        </Space>

        <Form.Item
          required
          style={{ marginBottom: 8 }}
        >
          <MDEditor
            value={content}
            onChange={value => setContent(value || '')}
            height={600}
            style={{ background: '#fff' }}
          />
        </Form.Item>

        <div style={{ 
          color: '#666', 
          fontSize: '13px', 
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <InfoCircleOutlined style={{ color: '#1890ff' }} />
          <span>提示：可以直接粘贴图片（Ctrl+V 或 Command+V）到编辑器中</span>
        </div>
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
    </div>
  );
};

export default BlogEdit; 