<template>
  <div id="index">
    <mt-header title="标题过长会隐藏后面的内容啊哈哈哈哈">
      <router-link to="/" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button icon="more" slot="right"></mt-button>
    </mt-header>
    <mt-cell v-for="(item,index) in navList" :key="index" :title="item" is-link></mt-cell>
    <router-view></router-view>
  </div>
</template>

<script>
  import { Grid, GridItem } from 'vux'
export default {
  name: 'hello',
  components: {
    Grid,
    GridItem
  },
  data () {
    return {
      navList: [
        {title: '人员管理',path: ''},
        {title: '车辆管理',path: ''},
        {title: '计划管理',path: ''},
        {title: '司磅管理',path: ''},
        {title: '检验管理',path: ''},
        {title: '仓储管理',path: ''}
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  #index {
    width: 100%;
    height: 100%;
    font-size: 0.4rem;
    .weui-grid{
      height: 2rem !important;
    }
    a{
      text-decoration: none;
    }
  }
</style>
