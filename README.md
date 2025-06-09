# 绢花3D模型查看器实现指南

本项目实现了一个前后端分离的3D模型查看系统，前端使用Vue.js和Three.js，后端使用Node.js提供API接口。

## 项目结构

- **前端**：提供3D查看器逻辑和UI界面
- **后端**：提供3D模型文件API

## 前端项目设置

### 安装依赖

```bash
cd silk-flower-app
npm install
```

### 配置API地址

创建或编辑`.env.development`文件：

```
VITE_API_URL=http://localhost:3000
```

### 启动开发服务器

```bash
npm run dev
```

## 后端项目设置

### 准备工作

```bash
cd silk-flower-app-backend
npm init -y
npm install express cors
```

### 创建目录结构

```bash
mkdir -p private/3d
```

### 复制模型文件

将模型文件复制到`private/3d`目录：
- `red.fbx` - 暗色主题使用
- `pink.fbx` - 亮色主题使用

### 启动后端服务器

```bash
node server.js
```

## 测试系统

1. 启动后端：`node server.js`
2. 启动前端：`npm run dev`
3. 在浏览器访问前端应用，点击"3D模型"查看效果

## 实现细节

### 前端

- 3D查看器逻辑位于`src/assets/index3d.js`
- 使用Three.js加载和显示3D模型
- 通过iframe引入3D查看器到Vue应用中

### 后端

- 提供API接口`/api/3d/:filename`获取模型文件
- 支持主题切换（暗色主题→red.fbx，亮色主题→pink.fbx）
- 通过CORS允许前端访问

## 注意事项

- 确保后端API地址配置正确
- 3D模型文件必须放在后端的`private/3d`目录下
- 如果遇到CORS问题，检查后端CORS配置 