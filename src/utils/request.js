import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基础地址
  timeout: 60000, // 超时时间
}) // 创建一个新的axios实例
// 成功1 失败2
// 请求拦截器
service.interceptors.request.use((config) => {
  // 注入token
  //  this.$store.getters
  // store.getters.token => 请求头里面
  if (store.getters.token) {
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, (error) => {
  // 失败执行promise
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use((response) => {
  // axios默认包裹了data
  // 判断是不是Blob格式
  if (response.data instanceof Blob) return response.data //返回blob对象
  const { data, message, success } = response.data //默认json格式
  if (success) {
    return data
  } else {
    Message({ type: 'error', message })
    return Promise.reject(new Error(message))
  }
}, async (error) => {
  Message({ type: "warning", message: 'token超时' })
  //token过期或者超时
  if (error.response.status === 401) {
    await store.dispatch('user/logout')//调用退出登录
    router.push('/login')// 跳转到登录页
    return Promise.reject(error)
  }
  // error.message
  Message({ type: 'error', message: error.message })
  return Promise.reject(error)
})
export default service
