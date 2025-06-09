// build-frontend.js
// 这个脚本直接调用vite来构建前端，避免权限问题

const { build } = require('vite');

async function buildFrontend() {
    console.log('开始构建前端...');

    try {
        await build({
            root: '.',
            base: '/',
            build: {
                outDir: 'dist',
                emptyOutDir: true
            }
        });
        console.log('前端构建成功！');
    } catch (error) {
        console.error('构建过程中出错:', error);
        process.exit(1);
    }
}

buildFrontend(); 