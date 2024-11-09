import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../services/api';
import { LoginRequest } from '../../types/user';

const { Title } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: LoginRequest) => {
    try {
      setLoading(true);
      const response = await userApi.login(values);
      // 保存 token 到 localStorage
      localStorage.setItem('token', response.token);
      // 保存用户信息
      localStorage.setItem('user', JSON.stringify(response));
      message.success('登录成功！');
      navigate('/'); // 登录成功后跳转到首页
    } catch (error: any) {
      message.error(error.response?.data?.message || '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f2f5' 
    }}>
      <Card style={{ width: 400, padding: '24px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
          用户登录
        </Title>
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名或邮箱' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名/邮箱" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="密码" 
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 