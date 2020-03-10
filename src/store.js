import Vue from "vue";
import Vuex from "vuex";
import * as mutation from "./mutation-types"
import * as action from "./action-types"
import router from "./router"

Vue.use(Vuex);

const vm = new Vue()

let sideItems = [
  {
    src: "dev",
    name: "设备管理",
    authorCode: "_02",
    queryAuthor: "_0201_",
    updateAuthor: "_0200_",
    children: [
      {
        name: "设备池",
        path: '/home/deviceCase',
        author: '_0201_',
        sceneList: [
          {
            name: "设备池详情",
            path: "/home/deviceCaseDetail",
            author: "_0201_"
          }, {
            name: "池内设备",
            path: "/home/deviceCaseDev",
            author: "_0201_"
          }
        ]
      },
      {
        name: "设备列表",
        path: '/home/deviceList',
        author: '_0201_'
      },
      {
        name: "分组列表",
        path: '/home/group/list',
        author: '_0201_',
        sceneList: [
          {
            name: "新增设备",
            path: "/home/group/dev/manage",
            author: "_0201_"
          }, {
            name: "组内设备",
            path: "/home/group/dev",
            author: "_0201_"
          }, {
            name: "权限控制",
            path: "/home/group/auth",
            author: "_0201_"
          }, {
            name: "应用管理",
            path: "/home/group/app/manage",
            author: "_0201_"
          }
        ]
      }
    ]
  }, {
    src: "app",
    name: "应用管理",
    authorCode: "_03",
    queryAuthor: "_0301_",
    updateAuthor: "_0300_",
    children: [
      {
        name: "应用列表",
        path: '/home/app/list',
        author: '_0301_',
        sceneList: [
          {
            name: "应用详情",
            path: "/home/app/detail",
            author: "_0301_"
          }, {
            name: "所属分组",
            path: "/home/app/group",
            author: "_0301_"
          }
        ]
      }, {
        name: "应用恢复",
        path: "/home/app/recover",
        author: "_0300_"
      }, {
        name: "应用监控",
        path: "/home/app/monitor",
        author: "_0300_"
      }
    ]
  }, /*{
      src: "group",
      name: "分组管理",
      authorCode: "_04",
      queryAuthor: "_0401_",
      updateAuthor: "_0400_",
      children: [
        {
          name: "分组列表",
          path: '/home/group/list',
          author: '_0401_',
          sceneList: [
            {
              name: "设备管理",
              path: "/home/group/dev/manage",
              author: "_0401_"
            }, {
              name: "组内设备",
              path: "/home/group/dev",
              author: "_0401_"
            }, {
              name: "应用管理",
              path: "/home/group/app/manage",
              author: "_0401_"
            }
          ]
        }
      ]
    },*/ {
    src: "log",
    name: "日志管理",
    authorCode: "_05",
    queryAuthor: "_0501_",
    updateAuthor: "_0500_",
    children: [
      {
        name: "操作日志",
        path: '/home/log/operation',
        author: '_0501_'
      },
      {
        name: "调度日志",
        path: '/home/log/dispatch',
        author: '_0501_'
      },
      {
        name: "分组日志",
        path: '/home/log/group',
        author: '_0501_'
      }
    ]
  }, {
    src: "user",
    name: "用户管理",
    authorCode: "_01",
    queryAuthor: "_0101_",
    updateAuthor: "_0100_",
    children: [
      {
        name: "用户列表",
        path: '/home/user/list',
        author: '_0101_'
      },
      {
        name: "用户组列表",
        path: '/home/user/group/list',
        author: '_0101_'
      }
    ]
  }, {
    src: "system",
    name: "系统管理",
    authorCode: "_00",
    queryAuthor: "_0001_",
    updateAuthor: "_0000_",
    children: [
      {
        name: "系统信息",
        path: '/home/system',
        author: '_0001_'
      }
    ]
  }
]

const state = {
  loginState: false,
  loginForwardPath: "/home",
  h5TestUrl: "http://oreki/mosico/player/index?appkey=ffffccec3c124642967fe476cef558c4&appid=0&requestUrl=oreki" +
    "/mosico/player/bootstrap&reportUrl=oreki/mosico/player/terminate&ljyip=shino",
  orekiIp: "",
  webIp: "",
  userInfo: {
    id: 0,
    username: '',
    token: '',
    authority: '_0000_,_0001_,_0100_,_0101_,_0200_,_0201_,_0300_,_0301_,_0400_,_0401_,_0500_,_0501_'
  },
  caseInfo: {
    id: 0,
    caseNo: "",
    initialPort: 0,
    route: "",
    netmask: "",
    dns: "",
    isStatus: 0,
    isLock: 1,
    nodeIp: "",
    nodeIpBak: "",
    remark: "",
    deviceNum: 0,
    deviceNumIsDistributed: 0,
    deviceNumIsFault: 0,
    ntpAddress: ""
  },
  appInfo: {
    id: "",
    appId: ""
  },
  groupInfo: {
    id: 0
  },
  fun: null,
  funList: [],
  changeFun: null,
  guide: 0,
  sideCheck: 0,
  sceneCheck: 0,
  sceneChildCheck: 0,
  sideItems: sideItems,
  loginTimeout: false,
  logGroupId: '',
  groupDevShowMode: true, // true为列表，false为预览

  deviceWindowMode: {
    show: false,
    id: 0,
    deviceNo: 0
  },
}

let admin = {
  src: "admin",
  name: "后台管理",
  authorCode: "_00",
  queryAuthor: "_0001_",
  updateAuthor: "_0000_",
  children: [
    {
      name: "FAQ",
      path: '/home/faq',
      author: '_0001_'
    }, {
      name: "功能介绍大类",
      path: '/home/fun/class',
      author: '_0001_'
    }, {
      name: "功能介绍",
      path: '/home/fun',
      author: '_0001_',
      sceneList: [
        {
          name: "添加功能介绍",
          path: "/home/fun/add",
          author: "_0001_"
        }, {
          name: "修改功能介绍",
          path: "/home/fun/change",
          author: "_0001_"
        }
      ]
    }
  ]
}

let help = {
  src: "",
  name: "",
  authorCode: "_00",
  queryAuthor: "_0001_",
  updateAuthor: "_0000_",
  children: [
    {
      name: "FAQ",
      path: '/home/help/faq',
      author: '_0200_'
    }, {
      name: "功能介绍",
      path: '/home/help/fun',
      author: '_0200_',
      sceneList: [
        {
          name: "功能介绍文档",
          path: "/home/help/fun/show",
          author: "_0200_"
        }
      ]
    }
  ]
}

// state.sideItems.push(admin)
state.sideItems.push(help)

for (let item in state) {
  sessionStorage.getItem(item) ? state[item] = JSON.parse(sessionStorage.getItem(item)) : false;
}
console.log(state)
export default new Vuex.Store({
  state,
  mutations: {
    /* 登陆成功保存登陆信息 */
    [mutation.LOGIN_INFO] (state, user) {
      if (user.id !== state.userInfo.id) {
        state.sideCheck = -1
      }
      state.userInfo = user
      sessionStorage.setItem('userInfo', JSON.stringify(user))
    },
    /* 查看设备池详情跳转时保存信息 */
    [mutation.CASE_DETAIL] (state, caseInfo) {
      state.caseInfo = caseInfo
      sessionStorage.setItem('caseInfo', JSON.stringify(caseInfo))
    },
    /* 保存查看详情的appId */
    [mutation.APP_DETAIL] (state, appInfo) {
      state.appInfo = appInfo
      sessionStorage.setItem('appInfo', JSON.stringify(appInfo))
    },
    /* 保存要操作的分组的信息 */
    [mutation.GROUP_DETAIL] (state, groupInfo) {
      state.groupInfo = groupInfo
      sessionStorage.setItem('groupInfo', JSON.stringify(groupInfo))
    },
    /* 保存sideBar的checked */
    [mutation.SIDE_CHECK] (state, checked) {
      state.sideCheck = checked
      state.sceneCheck = 0
      state.sceneChildShow = false
      state.sceneChildCheck = 0
      sessionStorage.setItem('sideCheck', JSON.stringify(checked))
    },
    /* 保存mainScene的checked */
    [mutation.SCENE_CHECK] (state, data) {
      console.log("scene")
      console.log(data)
      data.scene ? state.sceneChildCheck = data.checked : state.sceneCheck = data.checked
      sessionStorage.setItem(data.scene ? 'sceneChildCheck' : 'sceneCheck', JSON.stringify(data.checked))
    },
    /* 保存token过期回到登陆界面前的路由 */
    [mutation.LOGIN_FORWARD_PATH] (state, path) {
      state.loginForwardPath = path
      sessionStorage.setItem('loginForwardPath', JSON.stringify(path))
    },
    /* 保存oreki——ip */
    [mutation.OREKI_IP] (state, ip) {
      state.orekiIp = ip
      sessionStorage.setItem('orekiIp', JSON.stringify(ip))
    },
    /* 保存web——ip */
    [mutation.WEB_IP] (state, ip) {
      state.webIp = ip
      sessionStorage.setItem('webIp', JSON.stringify(ip))
    },
    /* 保存fun */
    [mutation.FUN] (state, funList) {
      state.funList = funList
      let sceneList = []
      for (let i in funList) {
        sceneList.push({
          name: funList[i].title + "功能介绍",
          path: "/home/help/fun/show?index=" + i,
          author: "_0200_"
        })
      }
      help.children[1].sceneList = sceneList
      /*if (state.sideItems.indexOf(admin) >= 0) {
        state.sideItems = [...sideItems, ]
      }*/
      sessionStorage.setItem('funList', JSON.stringify(funList))
    },
    /* 保存change fun */
    [mutation.CHANGE_FUN] (state, fun) {
      state.changeFun = fun
      // sessionStorage.setItem('changeFun', JSON.stringify(fun))
    },
    /* 保存guide */
    [mutation.GUIDE] (state, guide) {
      state.guide = guide
      console.log("guide:" + guide)
    },
    /* 特殊进入 */
    [mutation.MANAGE] (state, t) {
      state.sideItems = [...sideItems, admin]
      console.log("manage")
    },
    /* 登录过期 */
    [mutation.LOGIN_TIMEOUT] (state, timeout) {
      state.loginTimeout = timeout
    },
    /* 保存跳转到分组日志的分组id */
    [mutation.LOG_GROUP_ID] (state, id) {
      state.logGroupId = id
    },
    /* 保存显示模式 */
    [mutation.GROUP_DEV_SHOW_MODE] (state, mode) {
      state.groupDevShowMode = mode
      sessionStorage.setItem('groupDevShowMode', JSON.stringify(mode))
    },
    /* 设置设备控制窗口状态 */
    [mutation.DEVICE_WINDOW_SHOW_MODE] (state, mode) {
      console.log(mode);
      state.deviceWindowMode.show = mode.show;
      if (mode.id && mode.deviceNo) {
        state.deviceWindowMode.id = mode.id;
        state.deviceWindowMode.deviceNo = mode.deviceNo;
      }
    },
  },
  actions: {
    /* 登陆 */
    [action.LOGIN] ({commit, state}, loginInfo) {
      let that = vm
      that.$post(that.$uri.login.login, loginInfo).then(res => {
        commit(mutation.LOGIN_INFO, res.data)
        if (res.data.isFirstLogin == 1){
        // if (true){
          commit(mutation.GUIDE, 1)
        }
        router.push("/home")
      })
    },
    /* 查看设备池详情 */
    [action.GO_CASE_DETAIL] ({commit}, caseInfo) {
      for (let v in caseInfo) {
        if (typeof v === "number") {
          caseInfo[v] = v + ""
        }
      }
      commit(mutation.CASE_DETAIL, caseInfo)
      commit(mutation.SIDE_CHECK, 0)
      // commit(mutation.SCENE_CHECK, 0)
      router.push("/home/deviceCaseDetail")
    },
    /* 查看设备列表 */
    [action.GO_CASE_DEV] ({commit}, caseInfo) {
      for (let v in caseInfo) {
        if (typeof v === "number") {
          caseInfo[v] = v + ""
        }
      }
      commit(mutation.CASE_DETAIL, caseInfo)
      commit(mutation.SIDE_CHECK, 0)
      // commit(mutation.SCENE_CHECK, 0)
      router.push("/home/deviceCaseDev")
    }
  },
  getters: {
    /* 检查是否有当前模块的修改权限 */
    checkChangeAuth: (state) => () => {
      let route = router.currentRoute
      if (!route.meta || !route.meta.changeAuth) {
        return true
      }
      return state.userInfo.authority.indexOf(route.meta.changeAuth) !== -1
    },
    /* 获取推流链接 */
    h5TestUrl: (state) => (deviceId) => {
      let url = state.h5TestUrl + "&deviceId=" + deviceId
      url = url.split("oreki").join(state.orekiIp || state.webIp)
      let shinoIp = (state.orekiIp || state.webIp) === state.webIp ? "0.0.0.0" : state.orekiIp
      if (shinoIp.indexOf(":") > 0) {
        shinoIp = shinoIp.substr(0,shinoIp.indexOf(":"))
      }
      return url.split("shino").join(shinoIp)
    },
    /* 获取推流地址 */
    shinoIp: (state) => () => {
      let shinoIp = (state.orekiIp || state.webIp) === state.webIp ? "0.0.0.0" : state.orekiIp
      if (shinoIp.indexOf(":") > 0) {
        shinoIp = shinoIp.substr(0,shinoIp.indexOf(":"))
      }
      return shinoIp;
    },
    /* 获取权限过滤后的展示信息 */
    authorItems (state) {
      let list = []
      state.sideItems.forEach(i => {
        if (state.userInfo.authority.indexOf(i.authorCode) !== -1) {
          list.push(i)
        }
      })
      return list
    },
    /* 获取scene list */
    sceneList (state) {
      console.log("sceneList")
      console.log(state)
      console.log(state.sideCheck)
      console.log(state.sceneCheck)
      console.log(state.sceneChildCheck)
      console.log(state)
      return state.sideItems[state.sideCheck].children[state.sceneCheck].sceneList
    },
    /* 获取scene list */
    sceneName (state) {
      return state.sideItems[state.sideCheck].name
    },
    /* 获取请求头部 */
    getHeaders (state) {
      return {
        userId: state.userInfo.id,
        username: state.userInfo.username,
        token: state.userInfo.token
      }
    },
    /* 判断用户是否有权限 */
    checkChildAuthor: (state) => (authorCode) => {
      return state.userInfo.authority.indexOf(authorCode) !== -1
    },/* 判断引导弹窗是否显示 */
    isGuideShow: (state) => (popNum) => {
      return state.guide == popNum
    },
    /* 获取设备池详情页面所需的list */
    detailTableList (state) {
      let list = []
      list.push({
        name: 'ID',
        value: state.caseInfo.id
      })
      list.push({
        name: '设备池编号',
        value: state.caseInfo.caseNo
      })
      list.push({
        name: '初始端口',
        value: state.caseInfo.initialPort
      })
      list.push({
        name: '网关',
        value: state.caseInfo.route
      })
      list.push({
        name: '掩码',
        value: state.caseInfo.netmask
      })
      list.push({
        name: 'DNS',
        value: state.caseInfo.dns
      })
      list.push({
        name: '是否有状态',
        value: state.caseInfo.isStatus ? "有" : "无"
      })
      list.push({
        name: 'IP是否锁定',
        value: state.caseInfo.isLock == 1 ? "否" : "是"
      })
      list.push({
        name: '分层处理器IP',
        value: state.caseInfo.nodeIp
      })
      list.push({
        name: '备用分层处理器IP',
        value: state.caseInfo.nodeIpBak
      })
      list.push({
        name: '备注',
        value: state.caseInfo.remark
      })
      list.push({
        name: '设备数量',
        value: state.caseInfo.deviceNum
      })
      list.push({
        name: '受控设备数量',
        value: state.caseInfo.deviceNumIsDistributed
      })
      list.push({
        name: '故障设备数量',
        value: state.caseInfo.deviceNumIsFault
      })
      list.push({
        name: 'NTP服务器地址',
        value: state.caseInfo.ntpAddress
      })
      list.forEach(v => {
        v.value += ''
      })
      return list
    }
  }
});
