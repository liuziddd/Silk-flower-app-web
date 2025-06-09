// api/image-generator.js
const express = require('express');
const { OpenAI } = require('openai');
const router = express.Router();

// 使用环境变量存储API密钥(生产环境中建议这样做)
// 为了方便测试，这里直接设置变量
const ARK_API_KEY = process.env.ARK_API_KEY || "您的API密钥"; // 替换为您的实际API密钥

// 初始化OpenAI客户端(用于火山方舟)
const openai = new OpenAI({
  apiKey: ARK_API_KEY,
  baseURL: 'https://ark.cn-beijing.volces.com/api/v3', // 火山方舟API基础URL
});

// 模拟成功的返回结果(用于测试前端时)
function mockSuccessResponse(prompt) {
  // 随机选择一个示例图片URL
  const sampleImages = [
    "https://example.com/mock-image-1.jpg",
    "https://example.com/mock-image-2.jpg",
    "https://example.com/mock-image-3.jpg",
  ];
  const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];

  return {
    success: true,
    imageUrl: randomImage,
    rephraserResult: `这是基于您的提示'${prompt}'生成的模拟图像。在实际环境中，这里会返回真实的AI生成图像。`,
    requestId: `mock-${Date.now()}`
  };
}

// 文生图API接口
router.post('/generate-image', async (req, res) => {
  try {
    const { style, flowerType, colorTheme, description } = req.body;

    // 构建完整提示词
    const prompt = `${style}风格，精美的${colorTheme}色${flowerType}绢花，特写镜头，细致质感，精湛工艺，逼真质地，${description || ''}`;

    console.log('请求提示词:', prompt);

    // 切换到模拟模式(设为false使用实际API)
    const useMockData = true;

    if (useMockData) {
      // 返回模拟数据而不是实际调用API
      console.log('使用模拟数据模式，不会实际调用API');
      const mockResponse = mockSuccessResponse(prompt);

      // 添加2秒延迟模拟API调用时间
      setTimeout(() => {
        res.json(mockResponse);
      }, 2000);

      return;
    }

    // 以下代码使用火山方舟API生成图像
    try {
      console.log('正在调用火山方舟API...');

      // 这里需要确认火山方舟是否支持文生图功能
      // 如果支持，请使用正确的模型ID和API调用方式
      // 目前文档中未显示文生图示例，以下为常规调用方式

      const response = await openai.images.generate({
        model: "ep-20250329144652-jcmf8", // 请替换为正确的文生图模型ID
        prompt: prompt,
        n: 1, // 生成1张图片
        size: "1024x1024" // 图片尺寸
      });

      console.log('API响应:', JSON.stringify(response, null, 2));

      if (response && response.data && response.data.length > 0) {
        const imageUrl = response.data[0].url;

        res.json({
          success: true,
          imageUrl: imageUrl,
          rephraserResult: "",
          requestId: response.created
        });
      } else {
        throw new Error('API返回的数据格式不符合预期');
      }
    } catch (apiError) {
      console.error('API调用错误:', apiError);
      throw apiError;
    }

  } catch (error) {
    console.error('处理请求出错:', error.message);

    // 增强错误日志
    if (error.response) {
      console.error('错误状态码:', error.response.status);
      console.error('错误数据:', JSON.stringify(error.response.data, null, 2));
    }

    res.status(500).json({
      success: false,
      message: '图像生成失败',
      error: error.message,
      details: error.response ? error.response.data : undefined
    });
  }
});

module.exports = router;