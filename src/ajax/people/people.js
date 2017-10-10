/**
 *
 * @authors Your Name (you@example.org)
 * @date    2017-08-07 15:24:20
 * @version $Id$
 */
import axios from 'axios'

/*
* 人员管理模块
*/

/*
*   1,人员信息
* */

// 员工分页数据 post
function getAllEngineerInfo(params) {
  return axios.post('/account/getAllEngineerInfo', params)
}

// 添加/编辑用户 post
function addEngineerInfo(params) {
  return axios.post('/account/addEngineerInfo', params);
}

// 删除人员 get
function delEngineerInfo(params) {
  return axios.get('/account/delEngineerInfo', {params: params})
}

// 批量添加用户 post
function addEngineerInfoForBatch(params) {
  return axios.post('/account/addEngineerInfoForBatch', params)
}



/*
*   2,部门管理
* */

// 获取部门get
function getDepartments() {
  return axios.get('/account/getDepartments')
}

// 根据部门查询人员post
function getAccByDepartId(params) {
  return axios.post('/account/getAccByDepartId',params)
}

// 根据部门获取人员列表 get
function getAccountByPartId(params) {
  return axios.get('/account/getAccountByPartId', {params: params})
}

// 保存/编辑部门 post
function saveDepartment(params) {
  return axios.post('/account/saveDepartment', params)
}

// 删除部门 post
function delDepart(params) {
  return axios.post('/account/delDepart', params)
}

/*
*   3,人员角色
* */

// 获取角色分页 get
function getRolePage(params) {
  return axios.get('/account/getRolePage', {params})
}

// 新增或编辑角色 post
function addOrEditRoleInfo(params) {
  return axios.post('/account/addOrEditRoleInfo', params)
}

// 删除角色 post
function delRoleInfo(params) {
  return axios.post('/account/delRoleInfo', params)
}

// 获取角色 get
function getRole() {
  return axios.get('/account/getRole')
}

// 人员维护 post
function saveMemberMaintenance(params) {
  return axios.post('/account/saveMemberMaintenance', params)
}

// 权限维护 post
function savePermisRoleRelation(params) {
  return axios.post('/account/savePermisRoleRelation', params)
}

// 获取全部权限 get
function getPermission() {
  return axios.get('/account/getPermission')
}


/*
*   其他
* */

//根据权限查询人员get
function findAccByPermision(params) {
  return axios.get('/account/findAccByPermision', {params:params})
}


export default {
  addEngineerInfo,
  addOrEditRoleInfo,
  getAccByDepartId,
  getAllEngineerInfo,
  getDepartments,
  getRole,
  saveDepartment,
  saveMemberMaintenance,
  savePermisRoleRelation,
  addEngineerInfoForBatch,
  delEngineerInfo,
  findAccByPermision,
  getRolePage,
  delDepart,
  delRoleInfo,
  getPermission,
  getAccountByPartId
}

