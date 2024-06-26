import request from '@/utils/request'

/**
 * 获取组织架构数据
 */
export function getDepartment() {
  return request({
    url: '/company/department',
    method: 'GET'
  })
}

/**
 * 获取部门负责人的数据
 */
export function getManagerList() {
  return request({
    url: '/sys/user/simple'
  })
}
/**
 * 新增组织
 */
export function addDepartment(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}

/**
 * 获取部门详情
 */
export function getDepartmentDetail(id) {
  return request({
    // url: '/company/department/' + id
    url: `/company/department/${id}`
  })
}
/**
 * 更新部门详情
 */
export function updateDepartment(data) {
  return request({
    method: 'PUT',
    url: `/company/department/${data.id}`,
    data
  })
}
/**
 * 删除部门
 */
export function delDepaetment(id) {
  return request({
    method: 'DELETE',
    url: `/company/department/${id}`
  })
}
