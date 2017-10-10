
import Vue from 'vue'
import App from './App'
import router from './router'

/*
*   引入jquery
* */
import './assets/js/jquery.min.js'

/*
引入reset.css 重置原始样式 iconfont字体图标
*/
import '@/assets/css/reset.css'
import '@/assets/font/iconfont.css'

/*
*   全局引入mintUI
* */
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)

/*
*   全局引入vux
* */
// import Vux from 'vux'
// Vue.use(Vux)

/*
引入 全局配置 公共组件 自定义过滤器 自定义命令 全局方法
*/
import '@/assets/vue/axios.js'
import '@/assets/vue/config.js'
import '@/assets/vue/globalComonents.js'
import '@/assets/vue/filters.js'
import '@/assets/vue/directives.js'
import '@/assets/vue/prototype.js'

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
