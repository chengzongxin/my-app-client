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

### 11. 用户登录功能开发

#### 11.1 添加登录相关类型定义

在 src/types 目录下创建 user.ts：

```typescript
export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  username: string;
  name: string;
  email: string;
  token: string;
  lastLoginTime: string;
}

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  lastLoginTime: string;
}
```

#### 11.2 添加 API 服务

在 src/services 目录下创建 api.ts，用于处理 HTTP 请求。

#### 11.3 创建登录页面

在 src/pages/Login 目录下创建 index.tsx，实现登录表单：
- 支持用户名/邮箱登录
- 密码输入框（带密码明文切换）
- 登录按钮（带加载状态）
- 表单验证
- 登录成功后重定向到首页

#### 11.4 更新布组件

更新 Layout 组件，添加以下功能：
- 顶部导航栏添加用户信息显示
- 添加用户下拉菜单
- 实现退出登录功能
- 导航菜单高亮当前页面

主要更新包括：
1. 使用 Dropdown 组件显示用户菜单
2. 添加退出登录功能
3. 使用 Link 组件优化导航
4. 响应式布局优化

### 12. 安全性和优化

#### 12.1 API 请求优化

更新 API 服务，添加以下功能：
1. 请求拦截器
   - 自动添加 token 到请求头
   - 统一处理请求配置

2. 响应拦截器
   - 处理 token 过期情况
   - 统一处理错误信息
   - 自动跳转到登录页

主要优化包括：
- 统一的错误处理
- 自动的 token 管理
- 登录状态维护
- 全局消息提示

#### 12.2 安全性考虑

1. Token 管理
   - 使用 localStorage 存储 token
   - token 过期自动处理
   - 退出时清除 token

2. 路由保护
   - 私有路由守卫
   - 未登录自动跳转
   - 登录状态维护

3. 用户会话
   - 用户信息本地存储
   - 会话状态管理
   - 自动登出机制

### 13. 用户管理功能

#### 13.1 用户列表页面

在 src/pages/Users 目录下创建用户管理页面，实现以下功能：
- 用户列表展示
- 分页功能
- 搜索功能
- 用户状态管理
- 用户信息编辑

主要功能包括：
1. 表格展示用户信息
2. 分页和搜索
3. 状态切换
4. 编辑用户信息