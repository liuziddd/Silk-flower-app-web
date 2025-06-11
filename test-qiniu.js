// test-qiniu.js - 测试七牛云配置是否正确
// 不使用dotenv，直接使用修改后的配置模块
const http = require('http');
const qiniuConfig = require('./api/qiniu-config');

console.log('=== 七牛云配置测试工具 ===');
console.log('注意：此工具不会显示实际密钥，只会检查配置是否有效\n');

// 检查配置模块
console.log('1. 检查七牛云配置:');
console.log(`   - 配置对象: ${qiniuConfig ? '有效' : '无效'}`);

// 检查密钥 - 只显示前几个字符
if (qiniuConfig.accessKey) {
    console.log(`   - Access Key: ${qiniuConfig.accessKey.substring(0, 4)}****`);
} else {
    console.log(`   - Access Key: 未设置`);
}

if (qiniuConfig.secretKey) {
    console.log(`   - Secret Key: ${qiniuConfig.secretKey.substring(0, 4)}****`);
} else {
    console.log(`   - Secret Key: 未设置`);
}

console.log(`   - 存储空间名称: ${qiniuConfig.bucket}`);
console.log(`   - CDN域名: ${qiniuConfig.cdnDomain}`);
console.log(`   - 模型配置: ${Object.keys(qiniuConfig.models).join(', ')}`);

// 测试CDN域名访问
console.log('\n2. 测试CDN域名可访问性:');
const testUrl = `http://${qiniuConfig.cdnDomain}/`;
console.log(`   正在测试CDN域名: ${testUrl}`);

http.get(testUrl, (res) => {
    const { statusCode } = res;

    if (statusCode !== 200) {
        console.log(`   ✗ CDN域名测试失败! 状态码: ${statusCode}`);
    } else {
        console.log(`   ✓ CDN域名可以访问! 状态码: ${statusCode}`);
    }

    // 测试模型URL
    console.log('\n3. 检查模型URL:');
    Object.keys(qiniuConfig.models).forEach(modelKey => {
        const url = qiniuConfig.getModelUrl(modelKey);
        console.log(`   - ${modelKey}: ${url}`);
    });

    console.log('\n测试完成! 请检查上述结果，确认配置是否正确。');
    console.log('如果一切正常，您可以运行服务器进行实际测试。');

}).on('error', (err) => {
    console.log(`   ✗ CDN域名测试失败! 错误: ${err.message}`);

    // 尽管DNS检查失败，仍然检查模型URL
    console.log('\n3. 检查模型URL (仅URL格式):');
    Object.keys(qiniuConfig.models).forEach(modelKey => {
        const url = qiniuConfig.getModelUrl(modelKey);
        console.log(`   - ${modelKey}: ${url}`);
    });

    console.log('\n测试完成，但存在一些问题！请检查CDN域名是否正确。');
}); 