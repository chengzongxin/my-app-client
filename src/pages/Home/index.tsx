import React from 'react';
import { Typography, Card, Space } from 'antd';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>首页</Title>
      <Card>
        <Paragraph>
          欢迎来到 React + TypeScript 示例项目！这是一个使用现代前端技术栈构建的应用。
        </Paragraph>
        <Paragraph>
          本项目使用了以下技术：
          <ul>
            <li>React 18</li>
            <li>TypeScript</li>
            <li>Ant Design</li>
            <li>React Router</li>
          </ul>
        </Paragraph>
      </Card>
    </Space>
  );
};

export default Home; 