// api/test-routes.js
const express = require('express');
const { OpenAI } = require('openai');
const router = express.Router();
const axios = require('axios');

// 使用环境变量存储API密钥(测试用)
const ARK_API_KEY = process.env.ARK_API_KEY || "a4cbb8a6-2449-437f-9857-fe0728d117ad";

// 初始化OpenAI客户端(用于火山方舟)
const openai = new OpenAI({
    apiKey: ARK_API_KEY,
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3', // 火山方舟API基础URL
});

// 聊天接入点ID
const CHAT_ENDPOINT_ID = 'ep-20250329150754-bzpr7';

// API测试路由
router.get('/', async (req, res) => { // 修改为根路径，将对应/api/test
    const results = {
        api_status: "运行中",
        tests: {
            local_api: { status: "成功", message: "本地API服务正常" },
            chat_api: { status: "等待测试", message: "未测试" },
            image_api: { status: "等待测试", message: "未测试" },
            model_api: { status: "等待测试", message: "未测试" }
        }
    };

    // 测试chat API连接
    try {
        console.log("测试火山方舟聊天API连接");

        // 尝试简单的API调用
        const testResponse = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: '你是一个测试助手' },
                { role: 'user', content: '请回复"API连接测试成功"' }
            ],
            model: CHAT_ENDPOINT_ID,
            max_tokens: 20,
        });

        if (testResponse && testResponse.choices && testResponse.choices.length > 0) {
            results.tests.chat_api = {
                status: "成功",
                message: "火山方舟聊天API连接正常",
                response: testResponse.choices[0].message.content
            };
        }
    } catch (error) {
        console.error("聊天API测试失败:", error.message);
        results.tests.chat_api = {
            status: "失败",
            message: `火山方舟聊天API连接失败: ${error.message}`,
            error: error.response ? error.response.data : null
        };
    }

    // 测试3D模型API
    try {
        console.log("测试3D模型API");

        // 使用axios测试本地模型API
        const testUrl = `http://localhost:${process.env.PORT || 3000}/api/3d/test`;
        const modelResponse = await axios.get(testUrl);

        results.tests.model_api = {
            status: "成功",
            message: "3D模型API连接正常",
            response: typeof modelResponse.data === 'string' ? modelResponse.data : JSON.stringify(modelResponse.data)
        };
    } catch (error) {
        console.error("3D模型API测试失败:", error.message);
        results.tests.model_api = {
            status: "失败",
            message: `3D模型API连接失败: ${error.message}`
        };
    }

    // 返回所有测试结果
    res.json(results);
});

// 单独测试火山方舟聊天API
router.get('/chat-api', async (req, res) => {
    try {
        console.log("测试火山方舟聊天API连接");

        // 尝试简单的API调用
        const testResponse = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: '你是一个测试助手' },
                { role: 'user', content: '请回复"API连接测试成功"' }
            ],
            model: CHAT_ENDPOINT_ID,
            max_tokens: 20,
        });

        res.json({
            success: true,
            message: "火山方舟聊天API连接成功",
            response: testResponse.choices[0].message.content
        });

    } catch (error) {
        console.error("API测试失败:", error.message);

        res.status(500).json({
            success: false,
            message: `火山方舟API连接失败: ${error.message}`,
            error: error.response ? error.response.data : null
        });
    }
});

// 单独测试3D模型API
router.get('/model-api', async (req, res) => {
    res.json({
        success: true,
        message: "3D模型API测试路由工作正常",
        note: "如果你能看到这个消息，说明模型API路由已正确加载"
    });
});

module.exports = router; 