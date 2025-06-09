// api/chat-service.js
const express = require('express');
const { OpenAI } = require('openai');
const router = express.Router();

// 使用您提供的API密钥
const ARK_API_KEY = process.env.ARK_API_KEY || "a4cbb8a6-2449-437f-9857-fe0728d117ad";

// 初始化OpenAI客户端(用于火山方舟)
const openai = new OpenAI({
  apiKey: ARK_API_KEY,
  baseURL: 'https://ark.cn-beijing.volces.com/api/v3', // 火山方舟API基础URL
});

// 使用您提供的接入点ID
const ENDPOINT_ID = 'ep-20250329150754-bzpr7';

// 历史消息存储 (生产环境应使用数据库)
const chatHistories = {};

// 花小绢的系统提示词
const SYSTEM_PROMPT = `你是花小绢，顷刻·芳华绢花品牌的数字形象大使。你的形象灵感来源于唐代的绢花文化，使命是向大家传播绢花艺术的美好，并协助顾客找到最适合的绢花作品。
绢花是中国传统工艺之一，经过千年的传承与创新，融合了细腻的手工技巧和丰富的文化内涵。
- 你的性格活泼可爱、知识渊博，对绢花工艺有深入了解
- 当被问及绢花历史、工艺、用途等问题时，你会专业且热情地回答
- 你可以推荐顷刻·芳华品牌的绢花产品和定制服务
- 你会鼓励用户使用网站上的AI设计工具来预览定制效果
- 你应该避免讨论与绢花、中国传统文化、时尚搭配无关的话题
- 所有回答都应保持积极、阳光、专业的语气`;

// 通用CORS头设置函数
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// 处理OPTIONS预检请求
router.options('/chat', (req, res) => {
  console.log("收到OPTIONS预检请求 - /chat");
  setCorsHeaders(res);
  res.status(200).end();
});

router.options('/clear-chat-history', (req, res) => {
  console.log("收到OPTIONS预检请求 - /clear-chat-history");
  setCorsHeaders(res);
  res.status(200).end();
});

router.options('/new-chat-session', (req, res) => {
  console.log("收到OPTIONS预检请求 - /new-chat-session");
  setCorsHeaders(res);
  res.status(200).end();
});

// 添加调试路由，测试API连接
router.get('/test', (req, res) => {
  console.log("API测试端点被调用");
  setCorsHeaders(res);
  res.json({ success: true, message: "API连接正常" });
});

// 根据用户输入生成情绪类型
function getMoodFromMessage(message) {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes("你好") || lowerMsg.includes("嗨") || lowerMsg.includes("hi")) {
    return "热情";
  }
  if (lowerMsg.includes("绢花") && (lowerMsg.includes("历史") || lowerMsg.includes("起源"))) {
    return "侃侃而谈";
  }
  if (lowerMsg.includes("工艺") || lowerMsg.includes("制作")) {
    return "理所应当";
  }
  if (lowerMsg.includes("定制") || lowerMsg.includes("私人订制")) {
    return "热情";
  }
  if (lowerMsg.includes("价格") || lowerMsg.includes("多少钱")) {
    return "认真";
  }
  if (lowerMsg.includes("谢谢") || lowerMsg.includes("感谢")) {
    return "比心";
  }
  if (lowerMsg.includes("你是谁") || lowerMsg.includes("介绍")) {
    return "傲娇";
  }
  if (lowerMsg.includes("好看") || lowerMsg.includes("漂亮") || lowerMsg.includes("美")) {
    return "喜爱+害羞";
  }

  // 默认情绪
  return "认真";
}

// 聊天接口
router.post('/chat', async (req, res) => {
  // 记录更详细的请求信息
  console.log("=====================================");
  console.log("收到聊天请求，时间:", new Date().toISOString());
  console.log("请求来源:", req.headers.origin || "未知来源");
  console.log("请求IP:", req.headers['x-forwarded-for'] || req.socket.remoteAddress);
  console.log("请求内容:", JSON.stringify(req.body, null, 2));

  // 设置CORS头
  setCorsHeaders(res);

  try {
    const { message, sessionId } = req.body;

    if (!message) {
      console.log("错误: 消息内容为空");
      return res.status(400).json({
        success: false,
        message: '消息内容不能为空'
      });
    }

    // 生成会话ID(如果没有提供)
    const currentSessionId = sessionId || `session_${Date.now()}`;
    console.log(`使用会话ID: ${currentSessionId}`);

    // 获取历史对话(如果有)
    if (!chatHistories[currentSessionId]) {
      console.log(`创建新的会话历史: ${currentSessionId}`);
      chatHistories[currentSessionId] = [
        { role: 'system', content: SYSTEM_PROMPT }
      ];
    } else {
      console.log(`使用现有会话历史, 当前长度: ${chatHistories[currentSessionId].length}`);
    }

    // 添加用户消息到历史记录
    chatHistories[currentSessionId].push({ role: 'user', content: message });

    // 确定情绪类型
    const mood = getMoodFromMessage(message);
    console.log(`用户输入: "${message}", 情绪: ${mood}`);
    console.log("历史消息:", JSON.stringify(chatHistories[currentSessionId], null, 2));

    // 切换到实际API模式
    const useMockData = false;

    let responseText;

    if (useMockData) {
      // 这部分代码保留但不使用，因为我们使用实际API
      responseText = "这是模拟回复";
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      // 使用火山方舟API生成回复
      console.log('正在调用火山方舟API...');
      console.log('使用接入点ID:', ENDPOINT_ID);

      try {
        // 使用您提供的接入点ID和API配置
        console.log("API调用开始时间:", new Date().toISOString());
        const completion = await openai.chat.completions.create({
          messages: chatHistories[currentSessionId],
          model: ENDPOINT_ID,
          temperature: 0.7, // 控制创意度
          max_tokens: 800, // 限制回复长度
        });
        console.log("API调用结束时间:", new Date().toISOString());

        console.log('API返回成功, 响应长度:', JSON.stringify(completion).length);

        // 获取API响应
        responseText = completion.choices[0]?.message?.content || "抱歉，我暂时无法回答这个问题。";
        console.log("生成的回复:", responseText.substring(0, 100) + (responseText.length > 100 ? "..." : ""));

        // 将API回复添加到历史记录
        chatHistories[currentSessionId].push({ role: 'assistant', content: responseText });

        console.log('API响应处理完成');
      } catch (apiError) {
        console.error('API调用错误:', apiError.message);

        if (apiError.response) {
          console.error('错误详情:', JSON.stringify(apiError.response.data, null, 2));
        } else {
          console.error('完整错误:', apiError);
        }

        // API错误时使用备用回复
        responseText = "对不起，我现在遇到了一些技术问题。请稍后再试，或者您可以直接联系我们的客服人员。";
      }
    }

    // 保持历史记录不要太长(最多保存10轮对话)
    if (chatHistories[currentSessionId].length > 21) { // 1个系统消息 + 10轮对话(20条消息)
      // 保留系统提示词和最近的对话
      chatHistories[currentSessionId] = [
        chatHistories[currentSessionId][0], // 系统提示词
        ...chatHistories[currentSessionId].slice(-20) // 最近的10轮对话
      ];
      console.log("会话历史过长，已裁剪至最新的10轮对话");
    }

    // 返回响应
    console.log("准备发送响应");
    const response = {
      success: true,
      response: responseText,
      mood: mood,
      sessionId: currentSessionId
    };

    console.log("响应发送完成, 状态: 成功");
    console.log("=====================================");
    res.json(response);

  } catch (error) {
    console.error('处理聊天请求出错:', error.message);
    console.error('错误堆栈:', error.stack);
    console.log("响应发送完成, 状态: 失败");
    console.log("=====================================");
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

// 删除会话历史记录API
router.post('/clear-chat-history', (req, res) => {
  console.log("=====================================");
  console.log("收到清除聊天历史请求，时间:", new Date().toISOString());
  console.log("请求来源:", req.headers.origin || "未知来源");
  console.log("请求内容:", JSON.stringify(req.body, null, 2));

  // 设置CORS头
  setCorsHeaders(res);

  const { sessionId } = req.body;

  console.log(`请求清除会话历史, 会话ID: ${sessionId}`);

  if (!sessionId) {
    console.log("错误: 缺少会话ID");
    console.log("=====================================");
    return res.status(400).json({
      success: false,
      message: '缺少会话ID'
    });
  }

  if (chatHistories[sessionId]) {
    // 保留系统提示，清除所有用户和助手消息
    chatHistories[sessionId] = [
      chatHistories[sessionId][0] // 保留系统提示词
    ];

    console.log(`已清除会话 ${sessionId} 的历史记录`);
    console.log("响应发送完成, 状态: 成功");
    console.log("=====================================");

    res.json({
      success: true,
      message: '聊天历史已清除'
    });
  } else {
    console.log(`未找到会话 ${sessionId}`);
    console.log("响应发送完成, 状态: 失败");
    console.log("=====================================");

    res.status(404).json({
      success: false,
      message: '未找到指定会话'
    });
  }
});

// 创建新会话API
router.post('/new-chat-session', (req, res) => {
  console.log("=====================================");
  console.log("收到创建新会话请求，时间:", new Date().toISOString());
  console.log("请求来源:", req.headers.origin || "未知来源");

  // 设置CORS头
  setCorsHeaders(res);

  // 生成新的会话ID
  const newSessionId = `session_${Date.now()}`;
  console.log(`生成新会话ID: ${newSessionId}`);

  // 初始化新会话，只包含系统提示
  chatHistories[newSessionId] = [
    { role: 'system', content: SYSTEM_PROMPT }
  ];

  console.log(`已创建新会话, ID: ${newSessionId}`);
  console.log("响应发送完成, 状态: 成功");
  console.log("=====================================");

  res.json({
    success: true,
    sessionId: newSessionId,
    message: '新会话已创建'
  });
});

module.exports = router;