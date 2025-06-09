// api/statistics.js
const express = require('express');
const path = require('path');
const router = express.Router();

// 简单的内存数据存储 (生产环境应使用数据库)
const statistics = {
  pageViews: 0,
  apiCalls: {
    total: 0,
    imageGenerator: 0,
    chatService: 0,
    modelService: 0,
    apiTest: 0
  },
  visitors: {
    total: 0,
    uniqueIPs: new Set()
  },
  requestsLog: [] // 存储最近100个请求
};

// 中间件：记录API请求
function trackApiCall(apiName) {
  return (req, res, next) => {
    // 增加总计数
    statistics.apiCalls.total++;

    // 增加特定API计数
    if (statistics.apiCalls[apiName] !== undefined) {
      statistics.apiCalls[apiName]++;
    }

    // 记录请求信息
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // 添加到访问者统计
    if (!statistics.visitors.uniqueIPs.has(ip)) {
      statistics.visitors.uniqueIPs.add(ip);
      statistics.visitors.total++;
    }

    // 记录请求
    const requestInfo = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.originalUrl,
      ip: ip,
      apiName: apiName
    };

    // 保留最近100个请求
    statistics.requestsLog.unshift(requestInfo);
    if (statistics.requestsLog.length > 100) {
      statistics.requestsLog.pop();
    }

    next();
  };
}

// 中间件：记录页面访问
function trackPageView(req, res, next) {
  statistics.pageViews++;
  next();
}

// 获取统计数据
router.get('/data', (req, res) => {
  // 处理唯一访问者数量
  const uniqueVisitors = statistics.visitors.uniqueIPs.size;

  // 创建可以安全JSON序列化的统计对象
  const safeStats = {
    pageViews: statistics.pageViews,
    apiCalls: statistics.apiCalls,
    visitors: {
      total: statistics.visitors.total,
      unique: uniqueVisitors
    },
    requestsLog: statistics.requestsLog.slice(0, 20) // 只返回最近20个记录
  };

  res.json(safeStats);
});

// 提供统计页面
router.get('/dashboard', (req, res) => {
  trackPageView(req, res, () => {
    res.sendFile(path.join(__dirname, '../public/stats.html'));
  });
});

module.exports = {
  router,
  trackApiCall,
  trackPageView
}; 