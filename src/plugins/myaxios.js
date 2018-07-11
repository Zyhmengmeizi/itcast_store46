import axios from 'axios';

const MyAxios = {};
MyAxios.install = function (Vue) {
  const instance = axios.create({
    baseURL: 'http://localhost:8888/api/private/v1/'
  });
  instance.interceptors.request.use(function (config) {
    // 发送之前要做的处理
    // console.log('拦截器', config);
    // console.log(config.headers);
    // console.log(config.url);
    // 判断当前请求的地址是否是login
    if (config.url.toLowerCase() !== 'login') {
      const token = sessionStorage.getItem('token');
      // 如果请求的地址不是login，设置token
      config.headers.Authorization = token;
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

  // 添加响应的拦截器
  instance.interceptors.response.use(function (response) {
    
    return response;
  }, function (error) {
    return Promise.reject(error);
  });
  Vue.prototype.$http = instance;
};

export default MyAxios;
