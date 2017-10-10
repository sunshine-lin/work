/**
 *
 * @authors Your Name (you@example.org)
 * @date    2017-08-07 15:24:20
 * @version $Id$
 */
import axios from 'axios'
/*
*   登录
* */

// 登录请求
function dologin(param) {
  return axios.post('/dologin', param)
}

// 退出登录
function outlogin() {
  return axios.post('/outlogin', {})
}

// 修改密码
function updatePass(param) {
  return axios.post('/updatePass', param)
}

export default {
  dologin,
  outlogin,
  updatePass
}
