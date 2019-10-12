import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import DeviceCase from "./views/DeviceCase.vue";
import DeviceCaseDetail from "./views/DeviceCaseDetail.vue";
import DeviceCaseDev from "./views/DeviceCaseDev.vue";
import DeviceList from "./views/DeviceList.vue";
import AppList from "./views/AppList.vue";
import AppListDetail from "./views/AppListDetail.vue";
import AppListGroup from "./views/AppListGroup.vue";
import AppRecover from "./views/AppRecover.vue";
import LogOperation from "./views/LogOperation.vue";
import LogDispatch from "./views/LogDispatch.vue";
import GroupList from "./views/GroupList.vue";
import GroupListAppManage from "./views/GroupListAppManage.vue";
import GroupListDevManage from "./views/GroupListDevManage.vue";
import GroupListDevShow from "./views/GroupListDevShow.vue";
import UserList from "./views/UserList.vue";
import UserGroupList from "./views/UserGroupList.vue";
import SystemManage from "./views/SystemManage.vue";
import Forward from "./views/Forward.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "login",
      component: Login
    }, {
      path: "/home",
      name: "home",
      component: Home,
      children: [
        {
          path: "deviceCase",
          name: "设备池列表",
          component: DeviceCase,
          meta: {
            changeAuth: "_0200_"
          }
        }, {
          path: "deviceCaseDetail",
          name: "设备池信息",
          component: DeviceCaseDetail,
          meta: {
            c2c: true,
            changeAuth: "_0200_"
          }
        }, {
          path: "deviceCaseDev",
          name: "池内设备",
          component: DeviceCaseDev,
          meta: {
            c2c: true,
            changeAuth: "_0200_",
            refresh: true
          }
        }, {
          path: "deviceList",
          name: "设备列表",
          component: DeviceList,
          meta: {
            changeAuth: "_0200_",
            refresh: true
          }
        }, {
          path: "app/list",
          name: "应用列表",
          component: AppList,
          meta: {
            changeAuth: "_0300_"
          }
        }, {
          path: "app/detail",
          name: "应用详情",
          component: AppListDetail,
          props: true,
          meta: {
            c2c: true,
            changeAuth: "_0300_"
          }
        }, {
          path: "app/group",
          name: "所属分组",
          component: AppListGroup,
          meta: {
            c2c: true,
            changeAuth: "_0300_"
          }
        }, {
          path: "app/recover",
          name: "应用恢复",
          component: AppRecover,
          meta: {
            changeAuth: "_0300_"
          }
        }, {
          path: "log/operation",
          name: "操作日志",
          component: LogOperation,
          meta: {
            changeAuth: "_0500_"
          }
        }, {
          path: "log/dispatch",
          name: "调度日志",
          component: LogDispatch,
          meta: {
            changeAuth: "_0500_"
          }
        }, {
          path: "group/list",
          name: "分组列表",
          component: GroupList,
          meta: {
            changeAuth: "_0400_"
          }
        }, {
          path: "group/dev/manage",
          name: "设备管理",
          component: GroupListDevManage,
          meta: {
            c2c: true,
            changeAuth: "_0400_"
          }
        }, {
          path: "group/dev",
          name: "组内设备",
          component: GroupListDevShow,
          meta: {
            c2c: true,
            changeAuth: "_0400_",
            refresh: true
          }
        }, {
          path: "group/app/manage",
          name: "应用管理",
          component: GroupListAppManage,
          meta: {
            c2c: true,
            changeAuth: "_0400_"
          }
        }, {
          path: "user/list",
          name: "用户管理",
          component: UserList,
          meta: {
            changeAuth: "_0100_"
          }
        }, {
          path: "user/group/list",
          name: "用户组管理",
          component: UserGroupList,
          meta: {
            changeAuth: "_0100_"
          }
        }, {
          path: "system",
          name: "系统管理",
          component: SystemManage,
          meta: {
            changeAuth: "_0000_"
          }
        }
      ]
    }
  ]
});
