import React from 'react';
import { Typography, Card } from 'antd';

const { Title, Paragraph } = Typography;

const About: React.FC = () => {
  return (
    <div>
      <Title level={2}>关于我们</Title>
      <Card>
        <Paragraph>
          这是一个示例项目，展示了如何使用 React 和 TypeScript 构建现代化的前端应用。
        </Paragraph>
        <Paragraph>
          项目采用了组件化开发的方式，使用 Ant Design 作为 UI 组件库，React Router 
          进行路由管理，展示了一个完整的前端项目结构。
        </Paragraph>
      </Card>
    </div>
  );
};

export default About; 