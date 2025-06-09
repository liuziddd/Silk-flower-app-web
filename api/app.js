// app.js - Express应用入口文件
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const imageGeneratorRoutes = require('./api/image-generator');
const chatServiceRoutes = require('./api/chat-service'); // 新增聊天服务路由
const modelServiceRoutes = require('./api/model-service'); // 新增3D模型资源服务路由
const testRoutes = require('./api/test-routes'); // 新增API测试路由
const statistics = require('./api/statistics'); // 统计模块

const app = express();

// 启用CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // 允许前端应用访问，生产环境可配置为您的Vercel域名
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 解析JSON请求体
app.use(bodyParser.json());

// 提供静态文件访问
app.use(express.static(path.join(__dirname, 'public')));

// 使用统计中间件跟踪请求
app.use('/api/image-generator', statistics.trackApiCall('imageGenerator'));
app.use('/api/chat', statistics.trackApiCall('chatService'));
app.use('/api/3d', statistics.trackApiCall('modelService'));
app.use('/api/test', statistics.trackApiCall('apiTest'));

// 使用API路由
app.use('/api', imageGeneratorRoutes);
app.use('/api', chatServiceRoutes); // 添加聊天服务路由
app.use('/api', modelServiceRoutes); // 添加3D模型服务路由
app.use('/api/test', testRoutes); // 添加测试路由，注意这里是/api/test
app.use('/api/statistics', statistics.router); // 添加统计API路由

// 处理错误
app.use((err, req, res, next) => {
  console.error('服务器错误:', err.stack);

  // 检查是否已经发送了响应头
  if (res.headersSent) {
    return next(err);
  }

  // 针对不同类型的错误返回适当的响应
  if (err.code === 'ENOENT') {
    res.status(404).json({
      success: false,
      message: '请求的资源不存在',
      error: err.message
    });
  } else {
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: err.message
    });
  }
});

// 添加后台管理路由
app.get('/admin', (req, res) => {
  // 跟踪页面访问
  statistics.trackPageView(req, res, () => {
    // 重定向到统计仪表板
    res.redirect('/api/statistics/dashboard');
  });
});

// 添加根路由（欢迎页面）
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>花小绢绢花 - API服务</title>
      <style>
        body {
          font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
          background-color: #18181b;
          color: #e4e4e7;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          padding: 20px;
          text-align: center;
        }
        h1 {
          color: #f472b6;
          margin-bottom: 20px;
        }
        p {
          margin: 10px 0;
          max-width: 600px;
        }
        a {
          color: #c026d3;
          text-decoration: none;
          border: 1px solid #c026d3;
          padding: 10px 20px;
          border-radius: 5px;
          margin-top: 30px;
          display: inline-block;
          transition: all 0.3s;
        }
        a:hover {
          background-color: #c026d3;
          color: white;
        }
      </style>
    </head>
    <body>
      <h1>花小绢绢花 - 后端API服务</h1>
      <p>这是花小绢绢花品牌的后端API服务。此服务为前端应用提供必要的数据支持和功能。</p>
      <p>API状态: <strong style="color:#10b981">在线运行中</strong></p>
      <p>API服务: 
        <span style="margin-right: 10px;">图像生成</span>
        <span style="margin-right: 10px;">聊天服务</span>
        <span style="color:#f472b6">3D模型资源</span>
      </p>
      <p>服务器时间: ${new Date().toLocaleString('zh-CN')}</p>
      <div style="display: flex; gap: 10px;">
        <a href="/admin" style="margin-right: 10px;">访问管理后台</a>
        <a href="/api/test" style="border: 1px solid #10b981; color: #10b981;">API测试</a>
      </div>
    </body>
    </html>
  `);
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`后台管理界面: http://localhost:${PORT}/admin`);
  console.log(`3D模型健康检查: http://localhost:${PORT}/api/3d/health`);
  console.log(`3D模型API示例: http://localhost:${PORT}/api/3d/red.fbx`);
  console.log(`API测试工具: http://localhost:${PORT}/api/test`);
  console.log(`火山API测试: http://localhost:${PORT}/api/test/chat-api`);
});