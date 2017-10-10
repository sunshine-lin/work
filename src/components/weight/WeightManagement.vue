<template>
  <div id="WeightManagement">
    <!--头部标题-->
    <g-header leftTitle="计量管理" headerTab set @set="settingVisible = true"
              :tabList="[
                {title: '未完成',path:'WeightManagementIncomplete'},
                {title: '已完成',path:'WeightManagementCompleted'}
              ]">
    </g-header>
    <!--主体内容-->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!--设置弹窗-->
    <g-setting :visible="settingVisible"
               @cancelBtnClick="settingVisible = false"
               @close="settingVisible = false"
               :setShowArr="setShowArr"
               :setAllArr="setAllArr"
               :setNameArr="setNameArr"
               @setShowArrChange="setShowArrChange">
    </g-setting>
  </div>
</template>

<script>
  export default {
    name: 'WeightManagement',
    props: {},
    components: {},
    data () {
      return{
        settingVisible: false,    // 设置参数开始
        setShowArr: [],
        setNameArr: [],
        setAllArr: [],           // 设置参数结束
      }
    },
    watch: {
      $route: {
        handler (newVal,oldVal) {
          if (newVal.name === 'WeightManagementIncomplete') {
            this.initSet()
          }
          if (newVal.name === 'WeightManagementCompleted') {
            this.initSet()
          }
        },
        deep: true
      }
    },
    created() {
      // 设置
      this.initSet()
    },
    methods: {
      // 设置回调
      setShowArrChange(arr) {
        this.setShowArr = arr;
        if (this.$route.name === 'WeightManagementIncomplete') {
          localStorage.setItem('WeightIncompleteSetShowArr', JSON.stringify(arr));
          this.$root.$emit('WeightIncompleteSetShowArr',this.setShowArr)
        } else {
          localStorage.setItem('WeightCompletedSetShowArr', JSON.stringify(arr));
          this.$root.$emit('WeightCompletedSetShowArr',this.setShowArr)
        }
        this.settingVisible = false;
      },
      initSet () {

        if (this.$route.name === 'WeightManagementIncomplete') {
          if (localStorage.hasOwnProperty('WeightIncompleteSetShowArr')) {
            this.setShowArr = JSON.parse(localStorage.getItem('WeightIncompleteSetShowArr'))
          } else {
            this.setShowArr = ['plan_name', 'plan_magnetic_code', 'variety_name', 'car_num', 'gross_weight', 'tare_weight','create_time','acc_name'];
          }
          this.setAllArr = ['plan_name', 'plan_magnetic_code', 'variety_name', 'car_num', 'gross_weight', 'tare_weight','create_time','acc_name'];
          this.setNameArr = ['计划名称', '进出编号', '品名', '车号', '毛重', '本次皮重','称重时间','司磅员']
          this.$root.$emit('WeightIncompleteSetShowArr',this.setShowArr)
        } else {
          if (localStorage.hasOwnProperty('WeightCompletedSetShowArr')) {
            this.setShowArr = JSON.parse(localStorage.getItem('WeightCompletedSetShowArr'))
          } else {
            this.setShowArr = ['plan_name', 'plan_magnetic_code', 'variety_name', 'car_num', 'gross_weight', 'tare_weight','create_time','acc_name'];
          }
          this.setAllArr = ['plan_name', 'plan_magnetic_code', 'variety_name', 'car_num', 'gross_weight', 'tare_weight','create_time','acc_name'];
          this.setNameArr = ['计划名称', '进出编号', '品名', '车号', '毛重', '本次皮重','过磅重', '称重时间','司磅员']
          this.$root.$emit('WeightCompletedSetShowArr',this.setShowArr)
        }

      }
    }
  }
</script>

<style rel="stylesheet" lang="scss">
  @import '../../assets/scss/main.scss';
  #WeightManagement {
    width: 100%;
    height: 100%;
  }
</style>
