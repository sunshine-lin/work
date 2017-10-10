/**
 *
 * @authors Your Name (you@example.org)
 * @date    2017-08-07 15:24:20
 * @version $Id$
 */
import axios from 'axios'

/*
*  检测管理模块
*/


/*
*   入库
* */

// 入库待检及检测记录 post
function getInspectionPending(params) {
  return axios.post('/checkManagement/getInspectionPending', params)
}

// 获取品种下拉get
function getVarietyList() {
  return axios.get('/checkManagement/getVarietyList')
}

// 保存检测结果
function saveCheckRecord(params) {
  return axios.post('/checkManagement/saveCheckRecord', params)
}


/*
*   出库
* */

// 记录分页数据post
function findPageCheckRecord(params) {
  return axios.post('/checkManagement/findPageCheckRecord', params)
}

// 删除检测记录post
function deleteCheckRecord(params) {
  return axios.post('/checkManagement/deleteCheckRecord', params)
}


//
/*
*   检测模板
* */

// 查询检测模版 get
function getCheckTemplate(params) {
  return axios.get('/checkManagement/getCheckTemplate',{params:params})
}

// 保存检测模版 post
function saveCheckTemplate(params) {
  return axios.post('/checkManagement/saveCheckTemplate',params)
}


// 删除检测模版 post
function deleteCheckTemplate(params) {
  return axios.post('/checkManagement/deleteCheckTemplate',params)
}

// 查询检测类型 get
function getTypeList() {
  return axios.get('/checkManagement/getTypeList')
}


// 查询检测项数据
function findCheckItemList() {
  return axios.get('/checkManagement/findCheckItemList')
}

// 删除检测检测项 post
function deleteCheckItme(params) {
  return axios.post('/checkManagement/deleteCheckItme',params)
}
/*
*   检验单
* */

// 检测详情post
function findCheckDetail(params) {
  return axios.post('/checkManagement/findCheckDetail',params)
}

export default {
  // 入库
  getInspectionPending,
  getVarietyList,
  saveCheckRecord,
  // 出库
  findPageCheckRecord,
  deleteCheckRecord,
  // 检验模板
  getCheckTemplate,
  saveCheckTemplate,
  deleteCheckTemplate,
  getTypeList,
  findCheckItemList,
  deleteCheckItme,
  // 检验单
  findCheckDetail

}

