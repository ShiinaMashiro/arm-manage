import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/LoginNew.vue";
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
import SystemManage from "./views/SystemSetting.vue";
import Manage from "./views/Manage.vue";
import FunClass from "./views/FunClass.vue";
import Fun from "./views/Fun.vue";
import FunAdd from "./views/FunAdd.vue";
import FunChange from "./views/FunChange.vue";
import FAQ from "./views/FAQ.vue";
import AppMonitor from "./views/AppMonitor.vue";
import HelpFAQ from "./views/HelpFAQ.vue";
import HelpFun from "./views/HelpFun.vue";
import HelpFunShow from "./views/HelpFunShow.vue";
import LogGroup from "./views/LogGroup.vue";
import GroupListAuth from "./views/GroupListAuth.vue";
import LogSetting from "./views/LogSetting.vue";
import FileList from "./views/FileList.vue";
import FileAdd from "./views/FileAdd.vue";
import FileIssue from "./views/FileIssue.vue";
import AppUpload from "./views/AppUpload.vue";
import Overview from "./views/Overview.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "login",
      component: Login
    }, {
      path: "/manage",
      name: "后台管理",
      component: Manage,
      meta: {
        changeAuth: "_0000_"
      }
    }, {
      path: "/home",
      name: "home",
      component: Home,
      children: [
        {
          path: "overview",
          name: "预览",
          component: Overview,
        },{
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
          path: "app/upload",
          name: "应用上传",
          component: AppUpload,
          meta: {
            changeAuth: "_0300_"
          }
        }, {
          path: "app/monitor",
          name: "应用监控",
          component: AppMonitor,
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
          path: "log/group",
          name: "分组日志",
          component: LogGroup,
          meta: {
            changeAuth: "_0500_"
          }
        }, {
          path: "group/list",
          name: "分组列表",
          component: GroupList,
          meta: {
            changeAuth: "_0200_"
          }
        }, {
          path: "group/auth",
          name: "权限控制",
          component: GroupListAuth,
          meta: {
            c2c: true,
            changeAuth: "_0200_"
          }
        }, {
          path: "group/dev/manage",
          name: "设备管理",
          component: GroupListDevManage,
          meta: {
            c2c: true,
            changeAuth: "_0200_"
          }
        }, {
          path: "group/dev",
          name: "组内设备",
          component: GroupListDevShow,
          meta: {
            c2c: true,
            changeAuth: "_0200_",
            refresh: true
          }
        }, {
          path: "group/app/manage",
          name: "应用管理",
          component: GroupListAppManage,
          meta: {
            c2c: true,
            changeAuth: "_0200_"
          }
        }, {
          path: "file/list",
          name: "文件列表",
          component: FileList,
          meta: {
            changeAuth: "_0200_"
          }
        }, {
          path: "file/add",
          name: "新增文件",
          component: FileAdd,
          meta: {
            c2c: true,
            changeAuth: "_0200_"
          }
        }, {
          path: "file/issue",
          name: "文件分发",
          component: FileIssue,
          meta: {
            c2c: true,
            changeAuth: "_0200_"
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
        }, {
          path: "system/log",
          name: "日志服务器管理",
          component: LogSetting,
          meta: {
            changeAuth: "_0000_"
          }
        }, {
          path: "faq",
          name: "FAQ",
          component: FAQ,
          meta: {
            changeAuth: "_0000_"
          }
        }, {
          path: "fun/class",
          name: "功能介绍大类",
          component: FunClass,
          meta: {
            changeAuth: "_0000_"
          }
        }, {
          path: "fun",
          name: "功能介绍",
          component: Fun,
          meta: {
            changeAuth: "_0000_"
          }
        }, {
          path: "fun/add",
          name: "添加功能介绍",
          component: FunAdd,
          meta: {
            c2c: true,
            changeAuth: "_0000_"
          }
        },{
          path: "fun/change",
          name: "修改功能介绍",
          component: FunChange,
          meta: {
            c2c: true,
            changeAuth: "_0000_"
          }
        }, {
          path: "help/faq",
          name: "FAQ",
          component: HelpFAQ,
          meta: {
            changeAuth: "_0200_"
          }
        }, {
          path: "help/fun",
          name: "功能介绍",
          component: HelpFun,
          meta: {
            changeAuth: "_0200_"
          }
        }, {
          path: "help/fun/show",
          name: "功能介绍展示",
          component: HelpFunShow,
          meta: {
            c2c: true,
            fun: true,
            changeAuth: "_0200_"
          }
        }
      ]
    }
  ]
});
