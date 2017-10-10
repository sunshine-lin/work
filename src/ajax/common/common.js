/**
 *
 * @authors Your Name (you@example.org)
 * @date    2017-08-07 15:24:20
 * @version $Id$
 */
import axios from 'axios'
import qs from 'qs';
/*
* 设置二维码
*/

// 保存二维码设置
function saveQrcodeSet(param) {
  const params = postData(param, "rec");
  axios.post('/codeManagement/saveOrUpdateQRCode', params).then((response) => {
    if (response.data.code === 200) {
      this.$message({
        message: '设置二维码成功',
        type: 'success',
      });
    }
  })
}

// 获取二维码设置的信息
function findQrcodeSet (en_name) {
  let obj = null;
  axios.get('/codeManagement/findQRcode',{params:{
    'en_name': en_name,
  }}).then((response) => {
     if (response.data.code === 200) {
       // alert(response.data.body);
       obj =  response.data.body;
     }
   })
  console.log("ooo",obj);
  return obj;
}
// post 发送数据 转成 URLSearchParams()对象;
function postData (obj, pre) {
  let params = {};
  if (pre) {f
    for (let key in obj) {
      if (obj[key] || obj[key] == 0) {
        params[pre + '.' + key] = obj[key]
      }
    }
  } else {
    for (let key in obj) {
      if (obj[key] || obj[key] == 0) {
        params[key] = obj[key]
      }
    }
  }
  return qs.stringify(params)
}
export default {
  saveQrcodeSet,
  findQrcodeSet,

}

