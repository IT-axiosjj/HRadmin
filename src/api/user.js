import request from '@/utils/request'

// export const login = (data) => {
//   return request({
//     url: '/sys/login',
//     method: 'post',
//     data
//   })
// }

// 登录接口
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}
// 获取用户信息接口
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'get'
  })
}

// 更新密码
export function updatePassword(data) {
  return request({
    url: '/sys/user/updatePass',
    method: 'put',
    data
  })
}
