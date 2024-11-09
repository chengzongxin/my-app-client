import React from 'react';
import { Layout as AntLayout } from 'antd';
import { Outlet } from 'react-router-dom';

const { Header, Content, Footer } = AntLayout;

const Layout: React.FC = () => {
  return (
    <AntLayout>
      <Header style={{ color: 'white' }}>React TypeScript Demo</Header>
      <Content style={{ padding: '24px', minHeight: 'calc(100vh - 130px)' }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center' }}>©2024 Created by React + TypeScript</Footer>
    </AntLayout>
  );
};

export default Layout; 