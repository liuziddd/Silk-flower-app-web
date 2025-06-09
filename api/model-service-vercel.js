// api/model-service-vercel.js - Vercel部署的3D模型信息服务
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// 健康检查接口
router.get('/3d/health', (req, res) => {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.json({
        status: 'ok',
        message: '3D API服务信息版本正在运行',
        timestamp: new Date().toISOString(),
        deployment: 'vercel'
    });
});

// 3D模型信息接口
router.get('/3d/:filename', (req, res) => {
    const { filename } = req.params;
    console.log(`[3D API] 请求模型信息: ${filename}`);

    // 安全检查 - 只允许特定文件
    const allowedFiles = ['red.fbx', 'pink.fbx', 'model.glb'];
    if (!allowedFiles.includes(filename)) {
        console.log(`[3D API] 拒绝访问不允许的文件: ${filename}`);
        return res.status(403).json({
            success: false,
            message: '无权访问该资源'
        });
    }

    // 尝试读取模型信息文件
    const rootDir = path.resolve('./');
    const infoPath = path.join(rootDir, 'private', '3d', 'model.json');

    try {
        // 确保文件存在
        if (!fs.existsSync(infoPath)) {
            return res.status(404).json({
                success: false,
                message: '模型信息文件不存在',
                solution: '请检查部署是否正确包含模型信息文件'
            });
        }

        // 读取模型信息
        const fileContent = fs.readFileSync(infoPath, 'utf8');
        const modelInfo = JSON.parse(fileContent);

        // 找到对应文件的信息
        const fileInfo = modelInfo.models.find(m => m.filename === filename) || {};

        // 返回模型信息而不是实际文件
        res.json({
            success: true,
            message: 'Vercel部署不提供实际3D模型文件，仅提供模型信息',
            modelInfo: fileInfo,
            deployment: {
                environment: 'vercel',
                recommendations: modelInfo.deployment.recommendations,
                alternativeSolution: '请从专用存储服务或CDN加载模型文件'
            }
        });
    } catch (error) {
        console.error('读取模型信息时出错:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
            error: error.message
        });
    }
});

// 测试接口
router.get('/3d/test', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send('3D API信息服务测试成功! 注意：Vercel部署不提供实际3D模型文件，仅提供模型信息。');
});

module.exports = router; 