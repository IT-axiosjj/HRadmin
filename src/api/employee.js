import request from '@/utils/request'
/**
 * 获取员工列表
 * params查询参数
 */

export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    method: 'GET',
    params
  })
}
/**
 * 导出员工的excel
 */
export function exportEmployee() {
  return request({
    url: '/sys/user/export',
    // 改变接收数据的类型
    responseType: 'blob',//使用blob接收二进制文件流
  })
}
/**
 * 下载员工导入末班
 */

export function getExportemplate() {
  return request({
    url: '/sys/user/import/template',
    responseType: 'blob'//二进制流
  })
}
/**
 * 上传用户excel
 */
export function uploadExcel(data) {
  return request({
    url: '/sys/user/import',
    method: 'post',
    data//form-data类型 上传文件类型
  })
}
/**
 * 删除员工
 */
export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}
/**
 * 新增员工
 */
export function addEmployee(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}
/**
 * 获取员工详情
 */
export function getEmployeeDetail(id) {
  return request({
    url: `/sys/user/${id}`,
  })
}
/**
 * 更新员工
 */
export function updateEmployee(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}
/**
 * 获取可用的角色
 */
export function getEnableRoleList() {
  return request({
    url: '/sys/role/list/enabled'
    // 默认请求方式是get可以不写
  })
}
/**
 * 分配员工角色
 *
 */
export function assignRole(data) {
  return request({
    url: '/sys/user/assignRoles',
    method: 'put',
    data
  })
}
