//axios二次封装
import axios from 'axios';
import { ElMessage } from 'element-plus';
// 创建axios实例,可以设置基础路径和超时
const request = axios.create({
    baseURL: '/api',
    timeout: 5000
});


// 请求拦截器
request.interceptors.request.use(
    config => {
        // 添加请求头
        config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return config;
    }
)

// 响应拦截器
request.interceptors.response.use(
    response => {
        // 处理响应数据
        return response;
    }, error => {
        let status = error.response.status;
        switch (status) {
            case 401:
                ElMessage.error('未授权，请重新登录');
                break;
            case 403:
                ElMessage.error('拒绝访问');
                break;
            case 404:
                ElMessage.error('请求错误,未找到该资源');
                break;
        }
        // 处理响应错误
        ElMessage.error(error.message);
        return Promise.reject(error);
    }
)

export default request;