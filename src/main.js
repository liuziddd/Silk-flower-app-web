import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import axios from 'axios'
import "./assets/main.css"; // 此处必须存在，否则样式无法加载
import "./assets/theme.css"; // 引入主题CSS

// 初始化主题
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme-preference') || 'dark';
  document.documentElement.classList.add(savedTheme);
}

// 配置全局axios默认值
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// 添加请求拦截器用于调试和统计
axios.interceptors.request.use(function (config) {
  // 添加页面信息到请求头，用于统计
  config.headers = config.headers || {};
  config.headers['X-Page-Url'] = window.location.pathname;
  config.headers['X-Page-Referrer'] = document.referrer || 'direct';

  console.log('发送请求:', config.url);
  return config;
}, function (error) {
  console.error('请求错误:', error);
  return Promise.reject(error);
});

// 添加响应拦截器用于调试
axios.interceptors.response.use(function (response) {
  console.log('收到响应:', response.status);
  return response;
}, function (error) {
  console.error('响应错误:', error);
  return Promise.reject(error);
});

// 初始化主题
initTheme();

// 创建并挂载应用
const app = createApp(App)

// 配置全局API基础URL
app.config.globalProperties.$apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

app.mount('#app')