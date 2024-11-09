import React, { useState, useEffect } from 'react';
import { Table, Card, Space, Button, Input, message, Switch, Modal, Form } from 'antd';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';
import type { User } from '../../types/user';
import { userApi } from '../../services/api';
import type { TablePaginationConfig } from 'antd/es/table';

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

  // 获取用户列表
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getUsers({
        page: pagination.current,
        size: pagination.pageSize,
        search: searchText,
      });
      setUsers(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      console.error('获取用户列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize, searchText]);

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

  const columns = [
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

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
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
          pagination={pagination}
          onChange={(newPagination) => handleTableChange(newPagination)}
        />
      </Card>

      <Modal
        title="编辑用户"
        open={!!editingUser}
        onOk={handleEditSubmit}
        onCancel={() => setEditingUser(null)}
      >
        <Form form={form} layout="vertical">
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