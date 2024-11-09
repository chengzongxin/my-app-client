import React from 'react';
import { Layout as AntLayout, Menu, Dropdown, Button, message } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import type { MenuProps } from 'antd';

const { Header, Content, Footer } = AntLayout;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    message.success('退出登录成功');
    navigate('/login');
  };

  const items: MenuProps['items'] = [
    {
      key: 'username',
      label: <span>{user?.name || '用户'}</span>,
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
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/" style={{ color: 'white' }}>首页</Link>
          <Link to="/about" style={{ color: 'white' }}>关于</Link>
          <Dropdown menu={{ items }} placement="bottomRight">
            <Button type="text" icon={<UserOutlined />} style={{ color: 'white' }}>
              {user?.name || '用户'}
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