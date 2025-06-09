// api/model-service.js - 3D模型资源访问接口
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// 健康检查接口 - 放在具体文件路由前面，避免被覆盖
router.get('/3d/health', (req, res) => {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.json({
        status: 'ok',
        message: '3D API服务正在运行',
        timestamp: new Date().toISOString()
    });
});

// 简单测试接口 - 返回纯文本
router.get('/3d/test', (req, res) => {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    res.setHeader('Content-Type', 'text/plain');
    res.send('3D API测试响应成功！');
});

// 3D模型访问接口
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

    // 构建文件路径 - 指向私有目录
    const rootDir = path.resolve('./');
    const filePath = path.join(rootDir, 'private', '3d', filename);
    console.log(`[3D API] 尝试访问文件路径: ${filePath}`);

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
        console.log(`[3D API] 文件不存在: ${filePath}`);
        return res.status(404).json({
            success: false,
            message: '请求的模型文件不存在'
        });
    }

    try {
        const stat = fs.statSync(filePath);
        const fileSize = stat.size;

        // 设置CORS头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');
        res.setHeader('Accept-Ranges', 'bytes');

        // 根据文件扩展名设置不同的Content-Type
        const fileExt = path.extname(filename).toLowerCase();

        if (fileExt === '.fbx') {
            res.setHeader('Content-Type', 'application/octet-stream');
        } else if (fileExt === '.glb') {
            res.setHeader('Content-Type', 'model/gltf-binary');
        } else {
            res.setHeader('Content-Type', 'application/octet-stream');
        }

        // 检查是否为范围请求
        const range = req.headers.range;
        if (range) {
            // 解析Range头
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            // 计算实际发送的内容大小
            const chunksize = (end - start) + 1;

            // 创建文件流
            const fileStream = fs.createReadStream(filePath, { start, end });

            // 设置范围响应头
            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Content-Length': chunksize,
                'Content-Disposition': `inline; filename="${filename}"`,
                'Cache-Control': 'public, max-age=86400' // 缓存1天
            });

            // 发送部分内容
            fileStream.pipe(res);
        } else {
            // 正常请求 - 发送整个文件
            res.setHeader('Content-Length', fileSize);
            res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
            res.setHeader('Cache-Control', 'public, max-age=86400'); // 缓存1天

            // 发送文件
            fs.createReadStream(filePath).pipe(res);
        }
    } catch (error) {
        console.error('发送3D模型文件时出错:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
            error: error.message
        });
    }
});

module.exports = router; 