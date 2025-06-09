// vercel-setup.js - Vercel无服务器环境下的API入口
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const imageGeneratorRoutes = require('./image-generator');
const chatServiceRoutes = require('./chat-service');
const statistics = require('./statistics');
const modelServiceRoutes = require('./model-service-vercel');

const app = express();

// 设置环境标记
process.env.VERCEL = 'true';

// 启用CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 解析JSON请求体
app.use(bodyParser.json());

// 提供静态文件访问
app.use('/public', express.static(path.join(process.cwd(), 'public')));

// 使用统计中间件跟踪请求
app.use('/api/image-generator', statistics.trackApiCall('imageGenerator'));
app.use('/api/chat', statistics.trackApiCall('chatService'));
app.use('/api/3d', statistics.trackApiCall('modelService'));

// 使用API路由
app.use('/api', imageGeneratorRoutes);
app.use('/api', chatServiceRoutes);
app.use('/api', modelServiceRoutes);
app.use('/api/statistics', statistics.router);

// 添加API状态检查端点
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        environment: 'vercel',
        timestamp: new Date().toISOString(),
        message: '花小绢API服务运行正常'
    });
});

// 处理错误
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: err.message
    });
});

// 导出Vercel无服务器函数
module.exports = app; 