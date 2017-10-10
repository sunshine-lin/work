/**
 *
 * @authors Your Name (you@example.org)
 * @date    2017-08-07 15:24:20
 * @version $Id$
 */
import axios from 'axios'

/*
* 车辆管理
*/

// 删除车辆信息
function deleteCar(param) {
  return axios.delete('/carManagement/deleteCar' + turn ({
      'carId': param.carId
    }))
}

// 获取车辆list
function findCarList (param) {
  return axios.get('/carManagement/findCarList',{params:{
    'rec.carId': param.rec.carId,
    'rec.carNum': param.rec.carNum,
    'rec.lastWeightTime': param.rec.lastWeightTime,
    'rec.type': param.rec.type,
    'rec.driver': param.rec.driver
  }})
}

// 获取车辆公司list
function findPageFirmList (param) {
  return axios.get('/carManagement/findPageFirmList')
}

// 记录分页数据
function getPageCarList(param) {
  return axios.get('/carManagement/getPageCarList',{params:{
      'carId': param.carId,
      'carNum': param.carNum,
      'type': param.type,
      'driver': param.driver,
      'starDate': param.starDate,
      'endDate': param.endDate,
      'pageNumber': param.pageNumber,
      'pageSize': param.pageSize,
      'orderType': param.orderType,
      'sort': param.sort,
      'order': param.order
    }})
}

// 保存车辆
function saveCar(param) {
  return axios.post('/carManagement/saveCar',
    {
      'rec.carNum': param.rec.carNum,
      'rec.phones': param.rec.phones,
      'rec.carLoadWeight': param.rec.carLoadWeight,
      'rec.carRegisterWeight': param.rec.carRegisterWeight,
      'rec.carAverageWeight': param.rec.carAverageWeight,
      'rec.carWeightNum': param.rec.carWeightNum,
      'rec.carSize': param.rec.carSize,
      'rec.lastWeightTime': param.rec.lastWeightTime,
      'rec.type': param.rec.type,
      'rec.driver': param.rec.driver
    })
}

// 批量保存车辆
function saveCars(param) {
  return axios.post('/carManagement/saveCars',
    {})
}

// 修改车辆信息
function updateCar(param) {
  return axios.put('/carManagement/updateCar',
    {
      'rec.carId': param.rec.carId,
      'rec.carNum': param.rec.carNum,
      'rec.phones': param.rec.phones,
      'rec.carLoadWeight': param.rec.carLoadWeight,
      'rec.carRegisterWeight': param.rec.carRegisterWeight,
      'rec.carAverageWeight': param.rec.carAverageWeight,
      'rec.carWeightNum': param.rec.carWeightNum,
      'rec.carSize': param.rec.carSize,
      'rec.lastWeightTime': param.rec.lastWeightTime,
      'rec.type': param.rec.type,
      'rec.driver': param.rec.driver
    })
}

export default {
  deleteCar,
  findCarList,
  findPageFirmList,
  getPageCarList,
  saveCar,
  saveCars,
  updateCar
}

