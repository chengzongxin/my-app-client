# React + TypeScript 项目开发指南

本项目使用 Create React App 作为脚手架工具，React 作为前端框架，TypeScript 作为开发语言，展示了一个现代化前端项目的完整开发流程。

## 技术栈

- React 18
- TypeScript 5
- Create React App
- ESLint
- Prettier
- React Router
- Ant Design

## 项目创建步骤

### 1. 初始化项目

首先需要确保当前目录为空目录，如果目录不为空，需要先清空目录。然后执行以下命令：

```bash
npx create-react-app . --template typescript
```

注意：如果当前目录不为空，需要先删除所有文件（包括隐藏文件），可以使用以下命令：
```bash
rm -rf .* *
```

### 2. 安装项目依赖

项目创建完成后，需要安装必要的依赖包：

```bash
npm install antd @ant-design/icons react-router-dom @types/react-router-dom axios @types/axios
```

这些依赖包的作用：
- antd: UI 组件库
- @ant-design/icons: Ant Design 图标库
- react-router-dom: 路由管理
- axios: HTTP 请求库

### 3. 项目结构设置

创建以下目录结构：

```
src/
  ├── components/     # 可复用组件
  ├── pages/         # 页面组件
  ├── routes/        # 路由配置
  ├── services/      # API 服务
  ├── utils/         # 工具函数
  ├── hooks/         # 自定义 hooks
  ├── types/         # TypeScript 类型定义
  └── assets/        # 静态资源
```

在 Windows 系统中，执行以下命令创建目录：

```bash
mkdir src\components
mkdir src\pages
mkdir src\routes
mkdir src\services
mkdir src\utils
mkdir src\hooks
mkdir src\types
mkdir src\assets
```

### 4. 配置文件设置

创建 .prettierrc 文件，用于代码格式化配置：

```json
{
  "semi": true,
  "tabWidth": 2,
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

### 5. 路由配置

在 src/routes 目录下创建 index.tsx 文件，配置路由：

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import About from '../pages/About';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
```

### 6. 基础组件创建

创建以下基础组件：

1. Layout 组件 (src/components/Layout/index.tsx)
2. Home 页面 (src/pages/Home/index.tsx)
3. About 页面 (src/pages/About/index.tsx)

这些组件将构成我们应用的基本框架。

### 7. 修改入口文件

更新 App.tsx 文件，使用路由配置：

```tsx
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
```

这里我们：
1. 引入了路由配置
2. 使用 Ant Design 的 ConfigProvider 配置中文语言
3. 将路由配置作为根组件渲染

### 8. 配置全局样式

更新 src/index.css 文件，添加全局样式：

1. 引入 Ant Design 的样式重置
2. 设置基础字体和平滑渲染
3. 配置布局相关的样式
4. 确保页面占满全屏高度

### 9. 运行项目

在完成以上所有配置后，我们可以启动项目：

```bash
npm start
```

启动后，浏览器会自动打开 http://localhost:3000，你将看到项目的首页。

### 10. 项目功能说明

本项目实现了以下功能：

1. 基础路由系统
   - 首页 (/)
   - 关于页面 (/about)

2. 统一的布局组件
   - 顶部导航栏
   - 内容区域
   - 页脚

3. Ant Design 组件使用示例
   - Layout 布局
   - Typography 排版
   - Card 卡片
   - Space 间距

4. TypeScript 类型支持
   - 组件类型声明
   - 路由配置类型