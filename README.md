# React + TypeScript 博客系统

## 项目开发日志

### 1. 项目初始化
1. 使用 Create React App 创建项目
```bash
npx create-react-app my-app --template typescript
```

2. 安装必要依赖
```bash
npm install antd @ant-design/icons axios react-router-dom @uiw/react-md-editor react-markdown
```

### 2. 项目结构设计
```
src/
  ├── components/     # 可复用组件
  │   ├── Layout/    # 布局组件
  │   ├── Comment/   # 评论组件
  │   └── TagCloud/  # 标签云组件
  ├── pages/         # 页面组件
  │   ├── Blog/      # 博客相关页面
  │   ├── Login/     # 登录页面
  │   └── Register/  # 注册页面
  ├── services/      # API 服务
  ├── types/         # TypeScript 类型定义
  └── utils/         # 工具函数
```

### 3. 功能模块开发

#### 3.1 用户认证模块
- [x] 登录功能
- [x] 注册功能
- [x] Token 管理
- [x] 路由守卫

#### 3.2 博客管理模块
- [x] 文章列表
- [x] 文章创建
- [x] 文章编辑
- [x] 文章删除
- [x] Markdown 编辑器
- [x] 图片上传
- [x] 草稿保存

#### 3.3 评论系统
- [x] 评论列表
- [x] 发表评论
- [x] 回复评论
- [x] 删除评论

#### 3.4 分类管理
- [x] 分类列表
- [x] 创建分类
- [x] 编辑分类
- [x] 删除分类

#### 3.5 标签管理
- [x] 标签列表
- [x] 标签筛选
- [x] 标签统计

### 4. 项目亮点

1. 完整的类型定义
   - 使用 TypeScript 定义所有接口和类型
   - 严格的类型检查

2. 组件化开发
   - 可复用的组件设计
   - 组件间通信规范

3. 用户体验优化
   - 自动保存草稿
   - 图片粘贴上传
   - 响应式布局

4. 性能优化
   - 按需加载
   - 缓存处理
   - 防抖节流

### 5. 部署指南

#### 5.1 环境配置
创建生产环境配置文件 `.env.production`：
```bash
REACT_APP_API_BASE_URL=http://your-production-api-domain/api
```

#### 5.2 构建
```bash
npm run build
```

#### 5.3 Docker 部署
1. 创建 Dockerfile：
```dockerfile
# 构建阶段
FROM node:16 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. 创建 docker-compose.yml：
```yaml
version: '3'
services:
  web:
    build: .
    ports:
      - "80:80"
    environment:
      - REACT_APP_API_BASE_URL=http://your-api-domain/api
```

3. 部署命令：
```bash
# 使用 Docker 构建和运行
docker build -t my-react-app .
docker run -d -p 80:80 my-react-app

# 或使用 docker-compose
docker-compose up -d
```

### 6. 开发规范

#### 6.1 代码规范
- ESLint 配置
- Prettier 格式化
- TypeScript 规范

#### 6.2 提交规范
```bash
feat: 新功能
fix: 修复问题
docs: 文档修改
style: 代码格式修改
refactor: 代码重构
test: 测试用例修改
chore: 其他修改
```

### 7. 常见问题

1. 跨域问题处理
2. 图片上传配置
3. 路由配置说明
4. 权限控制说明

### 8. 后续优化计划

1. [ ] 添加单元测试
2. [ ] 优化打包体积
3. [ ] 添加 CI/CD 配置
4. [ ] 优化首屏加载速度
5. [ ] 添加数据可视化功能

## Windows 环境下的部署指南

### 1. 安装 Nginx

1. 下载 Nginx Windows 版本
   - 访问 [Nginx 官网](http://nginx.org/en/download.html)
   - 下载稳定版本（如 nginx/Windows-1.24.0）
   - 解压到指定目录（如 `C:\nginx`）

2. 启动 Nginx
   ```bash
   # 进入 Nginx 目录
   cd C:\nginx

   # 启动 Nginx
   start nginx

   # 停止 Nginx
   nginx -s stop

   # 重新加载配置
   nginx -s reload
   ```

### 2. 配置 Nginx

1. 编辑配置文件 `C:\nginx\conf\nginx.conf`：

```nginx
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  localhost;  # 或者你的域名

        # 前端项目目录
        root   C:/path/to/your/build;
        index  index.html;

        # 路由重写，支持前端路由
        location / {
            try_files $uri $uri/ /index.html;
        }

        # API 代理
        location /api {
            proxy_pass http://localhost:8080;  # 后端 API 地址
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # 静态资源缓存设置
        location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
            expires 7d;
            add_header Cache-Control "public, no-transform";
        }

        # 错误页面配置
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```

### 3. 部署步骤

1. 构建项目
```bash
npm run build
```

2. 复制构建文件
   - 将 `build` 目录下的所有文件复制到 Nginx 的网站目录（如 `C:\nginx\html`）
   - 或者在 nginx.conf 中指定你的构建目录路径

3. 启动或重启 Nginx
```bash
# 如果 Nginx 未启动，启动它
start nginx

# 如果 Nginx 已启动，重新加载配置
nginx -s reload
```

### 4. 常见问题处理

1. 端口占用问题
```bash
# 查看占用 80 端口的进程
netstat -ano | findstr :80

# 关闭占用端口的进程（PID 为上面命令查到的进程 ID）
taskkill /F /PID <PID>
```

2. 权限问题
   - 以管理员身份运行命令提示符
   - 确保 Nginx 进程有足够的文件访问权限

3. 路径问题
   - Windows 下路径使用正斜杠 `/` 或双反斜杠 `\\`
   - 确保路径不含中文字符

4. 日志查看
   - 错误日志：`C:\nginx\logs\error.log`
   - 访问日志：`C:\nginx\logs\access.log`

### 5. Nginx 常用命令

```bash
# 启动 Nginx
start nginx

# 停止 Nginx
nginx -s stop

# 重新加载配置
nginx -s reload

# 检查配置文件语法
nginx -t

# 查看 Nginx 版本
nginx -v
```

### 6. 性能优化建议

1. 启用 Gzip 压缩
```nginx
# 在 http 块中添加
gzip on;
gzip_min_length 1k;
gzip_comp_level 6;
gzip_types text/plain text/css text/javascript application/json application/javascript application/x-javascript application/xml;
gzip_vary on;
gzip_proxied any;
```

2. 配置缓存
```nginx
# 在 server 块中添加
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 7d;
    add_header Cache-Control "public, no-transform";
}
```

3. 配置日志格式
```nginx
# 在 http 块中添加
log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                '$status $body_bytes_sent "$http_referer" '
                '"$http_user_agent" "$http_x_forwarded_for"';
access_log logs/access.log main;
```

### 7. 安全配置建议

1. 隐藏 Nginx 版本信息
```nginx
# 在 http 块中添加
server_tokens off;
```

2. 配置 SSL（如果需要 HTTPS）
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate     /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # ... 其他配置
}
```

3. 添加安全头
```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-XSS-Protection "1; mode=block";
add_header X-Content-Type-Options "nosniff";
```

## 许可证

MIT License