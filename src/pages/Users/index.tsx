import React, { useState, useEffect, useCallback } from 'react';
import { Table, Card, Space, Button, Input, message, Switch, Modal, Form, Upload } from 'antd';
import { EditOutlined, PlusOutlined, LoadingOutlined, UserOutlined } from '@ant-design/icons';
import type { User } from '../../types/user';
import { userApi } from '../../services/api';
import type { TablePaginationConfig } from 'antd/es/table';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';

const { Search } = Input;

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  // 获取用户列表
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userApi.getUsers({
        page: pagination.current,
        size: pagination.pageSize,
        search: searchText,
      });
      
      setUsers(response);
      setPagination(prev => ({
        ...prev,
        total: response.length,
      }));
    } catch (error) {
      console.error('获取用户列表失败:', error);
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchText]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusChange = async (userId: number, checked: boolean) => {
    try {
      await userApi.updateUserStatus(userId, checked ? 1 : 0);
      message.success(`用户状态已${checked ? '启用' : '禁用'}`);
      fetchUsers();
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setImageUrl(user.avatarUrl);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        await userApi.updateUser(editingUser.id, values);
        message.success('用户信息更新成功');
        setEditingUser(null);
        fetchUsers();
      }
    } catch (error) {
      message.error('更新失败');
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination({
      current: newPagination.current || 1,
      pageSize: newPagination.pageSize || 10,
      total: pagination.total,
    });
  };

  const handleUploadChange = async (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setUploadLoading(true);
      return;
    }
    
    if (info.file.status === 'done') {
      try {
        if (!editingUser) {
          message.error('请先选择要编辑的用户');
          return;
        }

        const file = info.file.originFileObj;
        if (!file) {
          message.error('文件上传失败');
          return;
        }

        const response = await userApi.updateAvatar(editingUser.id, file);
        setImageUrl(response.avatarUrl);
        message.success('头像更新成功');
        fetchUsers();
      } catch (error) {
        message.error('头像上传失败');
      } finally {
        setUploadLoading(false);
      }
    }
  };

  const uploadButton = (
    <div>
      {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传头像</div>
    </div>
  );

  const columns = [
    {
      title: '头像',
      dataIndex: 'avatarUrl',
      key: 'avatarUrl',
      render: (avatarUrl: string) => (
        avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt="avatar" 
            style={{ 
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              objectFit: 'cover'
            }} 
          />
        ) : (
          <UserOutlined style={{ fontSize: '32px' }} />
        )
      ),
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number, record: User) => (
        <Switch
          checked={status === 1}
          onChange={(checked) => handleStatusChange(record.id, checked)}
        />
      ),
    },
    {
      title: '最后登录时间',
      dataIndex: 'lastLoginTime',
      key: 'lastLoginTime',
      render: (lastLoginTime: string) => 
        lastLoginTime ? new Date(lastLoginTime).toLocaleString() : '-'
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: User) => (
        <Button 
          type="link" 
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          编辑
        </Button>
      ),
    },
  ];

  // 处理头像上传前的验证
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 格式的图片！');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片必须小于 2MB！');
      return false;
    }
    return true;
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card title="用户管理">
        <Space style={{ marginBottom: 16 }}>
          <Search
            placeholder="搜索用户"
            onSearch={handleSearch}
            style={{ width: 200 }}
          />
        </Space>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          onChange={(newPagination) => handleTableChange(newPagination)}
        />
      </Card>

      <Modal
        title="编辑用户"
        open={!!editingUser}
        onOk={handleEditSubmit}
        onCancel={() => {
          setEditingUser(null);
          setImageUrl(undefined);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="头像">
            <Upload
              name="file"
              listType="picture-card"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleUploadChange}
              customRequest={({ file, onSuccess }) => {
                setTimeout(() => {
                  onSuccess?.('ok');
                }, 0);
              }}
            >
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="avatar" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }} 
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default Users; 