import React from 'react';
import AppRoutes from './routes';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <AppRoutes />
    </ConfigProvider>
  );
};

export default App;
