import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { userApi } from '../../services/api';
import { LoginRequest } from '../../types/user';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // 组件加载时从 localStorage 获取保存的用户名
  useEffect(() => {
    const savedUsername = localStorage.getItem('savedUsername');
    if (savedUsername) {
      form.setFieldsValue({ username: savedUsername });
    }
  }, [form]);

  const onFinish = async (values: LoginRequest & { remember?: boolean }) => {
    const { remember, ...loginData } = values;
    try {
      setLoading(true);
      const response = await userApi.login(loginData);
      
      // 如果选择了记住账号，保存用户名
      if (remember) {
        localStorage.setItem('savedUsername', loginData.username || '');
      } else {
        localStorage.removeItem('savedUsername');
      }

      // 保存 token 和用户信息
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
      message.success('登录成功！');
      navigate('/');
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
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
          initialValues={{ remember: true }}
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

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>记住账号</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Text>还没有账号？</Text>
            <Link to="/register"> 立即注册</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;