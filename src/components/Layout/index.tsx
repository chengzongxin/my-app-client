import React, { useEffect, useState } from 'react';
import { Layout as AntLayout, Dropdown, Button, message, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { userApi } from '../../services/api';
import type { User } from '../../types/user';

const { Header, Content, Footer } = AntLayout;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userString = localStorage.getItem('user');
        if (userString) {
          const userData = JSON.parse(userString);
          const userInfo = await userApi.getUserInfo(userData.userId);
          setCurrentUser(userInfo);
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    message.success('退出登录成功');
    navigate('/login');
  };

  const items: MenuProps['items'] = [
    {
      key: 'username',
      label: <span>{currentUser?.name || '用户'}</span>,
      icon: <UserOutlined />,
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <AntLayout>
      <Header style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>
          React TypeScript Demo
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white' }}>首页</Link>
          <Link to="/users" style={{ color: 'white' }}>用户管理</Link>
          <Link to="/about" style={{ color: 'white' }}>关于</Link>
          <Dropdown menu={{ items }} placement="bottomRight">
            <Button 
              type="text" 
              style={{ 
                color: 'white',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {currentUser?.avatarUrl ? (
                <Avatar 
                  src={currentUser.avatarUrl} 
                  size={32}
                  style={{ marginRight: 8 }}
                />
              ) : (
                <UserOutlined style={{ fontSize: '20px' }} />
              )}
              {currentUser?.name || '用户'}
            </Button>
          </Dropdown>
        </div>
      </Header>
      <Content style={{ padding: '24px', minHeight: 'calc(100vh - 130px)' }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center' }}>©2024 Created by React + TypeScript</Footer>
    </AntLayout>
  );
};

export default Layout; 