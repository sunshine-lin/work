import Vue from 'vue'
import Router from 'vue-router'
import components from './components'

Vue.use(Router)
const router = new Router({
  base: __dirname,
  mode: 'history',
  routes: [
    {
      path: '/Login',
      name: 'Login',
      meta: {title: '登录'},
      component: components.Login
    },
    {
      path: '*',
      name: 'NotFound',
      meta: {title: '404'},
      component: components.NotFound
    },
    {
      path: '/',
      name: 'Index',
      redirect: {name: 'PeopleInfomation'},
      meta: {title: ''},
      component: components.Index,
      children: [
        {
          path: '/NoPer',
          name: 'NoPer',
          meta: {title: '无权限'},
          component: components.NoPer
        },
        {
          path: 'General',
          name: 'General',
          meta: {title: '概况'},
          component: components.General,
        },
        /* 人员管理模块 */
        // 人员信息
        {
          path: 'People/PeopleInfomation',
          name: 'PeopleInfomation',
          meta: {title: '人员信息'},
          component: components.PeopleInfomation,
        },
        // 部门管理
        {
          path: 'People/DepartmentManagement',
          name: 'DepartmentManagement',
          meta: {title: '部门管理'},
          component: components.DepartmentManagement,
        },
        // 人员角色
        {
          path: 'People/PeopleJurisdiction',
          name: 'PeopleJurisdiction',
          meta: {title: '人员角色'},
          component: components.PeopleJurisdiction,
        },
        {
          path: 'Car/CarManagement',
          name: 'CarManagement',
          meta: {title: '车辆管理'},
          component: components.CarManagement,
        },
        {
          path: 'Car/CarManagement/CarDetail',
          name: 'CarDetail',
          meta: {title: '车辆详情'},
          component: components.CarDetail,
        },
        {
          path: 'Car/CompanyManagement',
          name: 'CompanyManagement',
          meta: {title: '公司管理'},
          component: components.CompanyManagement,
        },
        {
          path: 'PLan/PlanManagement',
          name: 'PlanManagement',
          meta: {title: '计划管理'},
          component: components.PlanManagement,
        },
        {
          path: 'PlanManagement/PlanDetails',
          name: 'PlanDetails',
          meta: {title: '计划详情'},
          component: components.PlanDetails,
        },
        {
          path: 'Plan/PlanList',
          name: 'PlanList',
          meta: {title: '计划列表'},
          component: components.PlanList,
        },
        {
          path: 'Plan/PlanList/PlanListDetails',
          name: 'PlanListDetails',
          meta: {title: '进出编号-计划详情'},
          component: components.PlanListDetails,
        },
        // 司磅管理
        {
          path: 'Weight/WeightManagement',
          name: 'WeightManagement',
          meta: {title: '司磅管理'},
          redirect: {name: 'WeightManagementIncomplete'},
          component: components.WeightManagement,
          children:[
              {
                path: 'WeightManagementIncomplete',
                name: 'WeightManagementIncomplete',
                meta: {title: '司磅管理未完成'},
                component: components.WeightManagementIncomplete,
              },
              {
                path: 'WeightManagementCompleted',
                name: 'WeightManagementCompleted',
                meta: {title: '司磅管理已完成'},
                component: components.WeightManagementCompleted,
              }
            ]
        },
        /* 检测管理*/
        // 入库检测管理
        {
          path: 'inspect/InStorageManagement',
          name: 'InspectInManagement',
          meta: {title: '入库检测管理'},
          redirect: {name: 'InspectInUnfinished'},
          component: components.InspectManagement,
          children:[
            {
              path: 'Unfinished',
              name: 'InspectInUnfinished',
              meta: {title: '入库未完成'},
              component: components.InspectInUnfinished,
            },
            {
              path: 'Finished',
              name: 'InspectInFinished',
              meta: {title: '入库已完成'},
              component: components.InspectInFinished,
            },
          ]
        },
        // 出库检测管理
        {
          path: 'inspect/OutStorageManagement',
          name: 'InspectOutManagement',
          meta: {title: '出库检测管理'},
          redirect: {name: 'InspectOutUnfinished'},
          component: components.InspectManagement,
          children:[
            {
              path: 'Unfinished',
              name: 'InspectOutUnfinished',
              meta: {title: '出库未完成'},
              component: components.InspectOutUnfinished,
            },
            {
              path: 'Finished',
              name: 'InspectOutFinished',
              meta: {title: '出库已完成'},
              component: components.InspectOutFinished,
            },
          ]
        },
        // 检验单
        {
          path: 'inspect/InspectSheet',
          name: 'InspectSheet',
          meta: {title: '出库检验单'},
          component: components.InspectSheet,
        },
        {
          path: 'inspect/InspectTemplate',
          name: 'InspectTemplate',
          meta: {title: '检验管理模板'},
          component: components.InspectTemplate,
        },
        {
          path: 'Storage',
          name: 'StorageManagement',
          meta: {title: '仓储管理'},
          component: components.StorageManagement,
        },
        {
          path: 'StorageManagement/StorageDetails',
          name: 'StorageDetails',
          meta: {title: '仓库详情'},
          component: components.StorageDetails,
        },
        {
          path: 'Device',
          name: 'Device',
          meta: {title: '设备管理'},
          component: components.Device,
        }
      ]
    }
  ]
});
// 路由拦截
router.beforeEach((to, from, next) => {
  if (sessionStorage.hasOwnProperty('loginName')) {
    next()
  } else if (to.name === 'Login') {
    next()
  } else {
    next('/login')
  }
});
// 更改title内容
router.afterEach(route => {
  let titleName = route.meta.title;
  let eleTitle = document.getElementsByTagName('title')[0];
  eleTitle.innerHTML = titleName
});

export default router
