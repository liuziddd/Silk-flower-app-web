// api/model-service-vercel.js - Vercel部署的3D模型服务，重定向到七牛云存储
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const qiniuConfig = require('./qiniu-config');

// 健康检查接口
router.get('/3d/health', (req, res) => {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.json({
        status: 'ok',
        message: '3D API服务正在运行',
        timestamp: new Date().toISOString(),
        deployment: 'vercel',
        storage: '七牛云对象存储',
        storageType: 'qiniu'
    });
});

// 3D模型访问接口 - 重定向到七牛云存储链接
router.get('/3d/:filename', (req, res) => {
    const { filename } = req.params;
    console.log(`[3D API] 请求模型文件: ${filename}`);

    // 安全检查 - 只允许特定文件
    const allowedFiles = ['red.fbx', 'pink.fbx', 'model.glb'];
    if (!allowedFiles.includes(filename)) {
        console.log(`[3D API] 拒绝访问不允许的文件: ${filename}`);
        return res.status(403).json({
            success: false,
            message: '无权访问该资源'
        });
    }

    // 如果是预设模型，使用配置中的URL
    let modelKey = null;
    if (filename === 'red.fbx') {
        modelKey = 'red';
    } else if (filename === 'pink.fbx') {
        modelKey = 'pink';
    }

    if (modelKey && qiniuConfig.getModelUrl) {
        const modelUrl = qiniuConfig.getModelUrl(modelKey);
        if (modelUrl) {
            console.log(`[3D API Vercel] 重定向到七牛云URL: ${modelUrl}`);
            return res.redirect(modelUrl);
        }
    }

    // 如果找不到预设模型，尝试直接生成URL
    const directUrl = `https://${qiniuConfig.cdnDomain}/${filename}`;
    console.log(`[3D API Vercel] 重定向到直接URL: ${directUrl}`);
    res.redirect(directUrl);
});

// 测试接口
router.get('/3d/test', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send('3D API服务测试成功! 七牛云对象存储版本');
});

// 获取模型信息API，返回七牛云中模型的元数据
router.get('/3d/info/:modelKey', (req, res) => {
    const { modelKey } = req.params;

    // 检查是否是有效的模型键
    if (!qiniuConfig.models[modelKey]) {
        return res.status(404).json({
            success: false,
            message: '请求的模型不存在'
        });
    }

    const filename = qiniuConfig.models[modelKey];
    const modelUrl = qiniuConfig.getModelUrl(modelKey);

    // 返回模型元数据
    res.json({
        success: true,
        modelKey,
        filename,
        url: modelUrl,
        storage: '七牛云对象存储',
        contentType: 'application/octet-stream',
        accessType: '公开访问',
        environment: 'vercel'
    });
});

module.exports = router; 