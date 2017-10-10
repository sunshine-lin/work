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

// 获取仓库下拉get
function getStoreroomList() {
  return axios.get('/storeroom/getStoreroomList')
}

export default {
  getStoreroomList,

}

