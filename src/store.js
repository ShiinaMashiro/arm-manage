import Vue from "vue";
import Vuex from "vuex";
import * as mutation from "./mutation-types"
import * as action from "./action-types"
import router from "./router"

Vue.use(Vuex);

const vm = new Vue()

let busSideItems = [
  {
    src: "group",
    name: "分组列表",
    authorCode: "_09",
    queryAuthor: "_0901_",
    path: '/home/group/list',
    sceneList: [
      {
        name: "组内设备",
        path: "/home/group/dev",
        author: "_0201_",
        queryAuthor: "3_2-1",
        updateAuthor: "3_3-0",
      }, {
        name: "应用管理",
        path: "/home/group/app/manage",
        author: "_0201_",
        queryAuthor: "3_4-1",
        updateAuthor: "3_4-0",
      }
    ]
  },{
    src: "app",
    name: "应用列表",
    authorCode: "_09",
    queryAuthor: "_0901_",
    path: '/home/app/list',
    sceneList: [
      {
        name: "应用上传",
        path: "/home/app/upload",
        author: "_0301_"
      },{
        name: "应用详情",
        path: "/home/app/detail",
        author: "_0301_"
      }, {
        name: "所属分组",
        path: "/home/app/group",
        author: "_0301_"
      }
    ]
  },{
    src: "log",
    name: "文件分发",
    authorCode: "_09",
    queryAuthor: "_0901_",
    path: '/home/file/list',
    sceneList: [
      {
        name: "新增文件",
        path: "/home/file/add",
        author: "_0201_",
        queryAuthor: "4_1-1",
        updateAuthor: "4_1-0",
      }, {
        name: "文件分发",
        path: "/home/file/issue",
        author: "_0201_",
        queryAuthor: "4_2-1",
        updateAuthor: "4_2-0",
      }
    ]
  }
]

let sideItems = [
  {
    src: "overview",
    name: "预览",
    authorCode: "_09",
    queryAuthor: "_0901_",
    path: '/home/overview'
  },{
    src: "dev",
    name: "设备管理",
    guide: true,
    authorCode: "_02",
    queryAuthor: "_0201_",
    updateAuthor: "_0200_",
    children: [
      {
        name: "设备池",
        path: '/home/deviceCase',
        author: '_0201_',
        queryAuthor: "1-1",
        updateAuthor: "1-0",
        isAdmin: true,
        sceneList: [
          {
            name: "设备池详情",
            path: "/home/deviceCaseDetail",
            author: "_0201_",
            queryAuthor: "1_1-1",
            updateAuthor: "1_1-0",
          }, {
            name: "池内设备",
            path: "/home/deviceCaseDev",
            author: "_0201_",
            queryAuthor: "1_2-1",
            updateAuthor: "1_2-0",
          }
        ]
      },
      {
        name: "设备列表",
        path: '/home/deviceList',
        author: '_0201_',
        queryAuthor: "2-1",
        updateAuthor: "2-0",
      },
      {
        name: "分组列表",
        path: '/home/group/list',
        author: '_0201_',
        queryAuthor: "3-1",
        updateAuthor: "3-0",
        sceneList: [
          {
            name: "增减设备",
            path: "/home/group/dev/manage",
            author: "_0201_",
            queryAuthor: "3_1-1",
            updateAuthor: "3_1-0",
          }, {
            name: "组内设备",
            path: "/home/group/dev",
            author: "_0201_",
            queryAuthor: "3_2-1",
            updateAuthor: "3_3-0",
          }/*, {
            name: "权限控制",
            path: "/home/group/auth",
            author: "_0201_",
            queryAuthor: "3_3-1",
            updateAuthor: "3_3-0",
          }*/, {
            name: "应用管理",
            path: "/home/group/app/manage",
            author: "_0201_",
            queryAuthor: "3_4-1",
            updateAuthor: "3_4-0",
          }
        ]
      },
      {
        name: "文件分发",
        path: '/home/file/list',
        author: '_0201_',
        queryAuthor: "4-1",
        updateAuthor: "4-0",
        sceneList: [
          {
            name: "新增文件",
            path: "/home/file/add",
            author: "_0201_",
            queryAuthor: "4_1-1",
            updateAuthor: "4_1-0",
          }, {
            name: "文件分发",
            path: "/home/file/issue",
            author: "_0201_",
            queryAuthor: "4_2-1",
            updateAuthor: "4_2-0",
          }
        ]
      }
    ]
  }, {
    src: "app",
    name: "应用管理",
    guide: true,
    authorCode: "_03",
    queryAuthor: "_0301_",
    updateAuthor: "_0300_",
    children: [
      {
        name: "应用列表",
        path: '/home/app/list',
        author: '_0301_',
        queryAuthor: "5-1",
        updateAuthor: "5-0",
        sceneList: [
          {
            name: "应用上传",
            path: "/home/app/upload",
            author: "_0301_"
          },{
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
        author: "_0300_",
        queryAuthor: "6-1",
        updateAuthor: "6-0",
      }, {
        name: "应用监控",
        path: "/home/app/monitor",
        author: "_0300_",
        queryAuthor: "7-1",
        updateAuthor: "7-0",
      }
    ]
  }, {
    src: "log",
    name: "日志管理",
    guide: true,
    authorCode: "_05",
    queryAuthor: "_0501_",
    updateAuthor: "_0500_",
    children: [
      {
        name: "操作日志",
        path: '/home/log/operation',
        author: '_0501_',
        queryAuthor: "8-1",
        updateAuthor: "8-0",
      },
      {
        name: "调度日志",
        path: '/home/log/dispatch',
        author: '_0501_',
        queryAuthor: "9-1",
        updateAuthor: "9-0",
      },
      {
        name: "分组日志",
        path: '/home/log/group',
        author: '_0501_',
        queryAuthor: "10-1",
        updateAuthor: "10-0",
      },
      {
        name: "运维日志",
        path: '/home/log/ops',
        author: '_0501_',
        queryAuthor: "0511-1",
        updateAuthor: "0511-0",
      }
    ]
  }, {
    src: "user",
    name: "用户管理",
    guide: true,
    authorCode: "_01",
    queryAuthor: "_0101_",
    updateAuthor: "_0100_",
    children: [
      {
        name: "用户列表",
        path: '/home/user/list',
        author: '_0101_',
        queryAuthor: "11-1",
        updateAuthor: "11-0",
      },
      {
        name: "用户组列表",
        path: '/home/user/group/list',
        author: '_0101_',
        queryAuthor: "12-1",
        updateAuthor: "12-0",
      }
    ]
  }, {
    src: "system",
    name: "系统管理",
    guide: true,
    authorCode: "_00",
    queryAuthor: "_0001_",
    updateAuthor: "_0000_",
    children: [
      {
        name: "系统信息",
        path: '/home/system',
        author: '_0001_',
        queryAuthor: "13-1",
        updateAuthor: "13-0",
      },
      {
        name: "日志服务器配置",
        path: '/home/system/log',
        author: '_0001_',
        queryAuthor: "14-1",
        updateAuthor: "14-0",
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
    save: false,
    token: '',
    authority: '_0000_,_0001_,_0100_,_0101_,_0200_,_0201_,_0300_,_0301_,_0400_,_0401_,_0500_,_0501_'
  },
  isAdmin: false,
  isAdminRoot: false,
  caseInfo: {
    id: 0,
    caseNo: "",
    initialPort: 0,
    adbPort: 0,
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
  busSideItems: busSideItems,
  loginTimeout: false,
  logGroupId: '',
  groupDevShowMode: false, // true为列表，false为预览

 /* deviceWindowMode: {
    show: false,
    id: 0,
    deviceNo: 0,
    ip: ''
  },*/
  deviceWindowMode: [],
  sideInfo: {
    item: null,
    child: null,
    scene: null
  },
  needLicense: false,
  licenseUpdate: false,
  devSyncInfo: {
    mainDev: '',
    syncDevs: []
  },
  latelyPages: [],
  normalPageInfo: {},
  helpIndex: 0,
  groupName: '',
  devInfo: {
    deviceNum: 0,
    badNum: 0,
    streamNum: 0
  },
  ssh: {
    start: false,
    show: false,
  },
  loginNow: true
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
      console.log(caseInfo)
      for (let v in caseInfo) {
        if (typeof v === "number") {
          caseInfo[v] = v + ""
        }
      }
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
          name: funList[i].title,
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
      if (mode.show) {
        state.deviceWindowMode.push(mode.mode)
      } else {
        state.deviceWindowMode.splice(state.deviceWindowMode.indexOf(mode.mode), 1)
      }
      /*state.deviceWindowMode.show = mode.show;
      if (mode.id && mode.deviceNo) {
        state.deviceWindowMode.id = mode.id;
        state.deviceWindowMode.deviceNo = mode.deviceNo;
        state.deviceWindowMode.ip = mode.ip;
      }*/
    },
    /* 设置设备控制窗口状态 */
    [mutation.DEVICE_SYNC_SHOW_MODE] (state, mode) {
      console.log(mode);
        state.devSyncInfo.mainDev = mode.mainDev;
        state.devSyncInfo.syncDevs = mode.syncDevs;
    },
    /* 设置sideItem信息 */
    [mutation.SIDE_INFO] (state, sideInfo) {
      state.sideInfo = sideInfo
      sessionStorage.setItem('sideInfo', JSON.stringify(sideInfo))
    },
    /* 设置用户管理员状态 */
    [mutation.IS_ADMIN_ROOT] (state, isAdminRoot) {
      state.isAdminRoot = isAdminRoot
      sessionStorage.setItem('isAdminRoot', JSON.stringify(isAdminRoot))
    },
    /* 设置用户管理员状态 */
    [mutation.IS_ADMIN] (state, isAdmin) {
      state.isAdmin = isAdmin
      sessionStorage.setItem('isAdmin', JSON.stringify(isAdmin))
    },
    /* 设置是否需要激活系统 */
    [mutation.IS_NEED_LICENSE] (state, needLicense) {
      state.needLicense = needLicense
      sessionStorage.setItem('needLicense', JSON.stringify(needLicense))
    },
    /*  */
    [mutation.LICENSE_UPDATE] (state, licenseUpdate) {
      state.licenseUpdate = licenseUpdate
      // sessionStorage.setItem('licenseUpdate', JSON.stringify(licenseUpdate))
    },
    /*  */
    [mutation.HELP_INDEX] (state, index) {
      state.helpIndex = index
      // sessionStorage.setItem('licenseUpdate', JSON.stringify(licenseUpdate))
    },
    /*  */
    [mutation.VISIT_PAGE] (state, page) {
      let repeatBool = false
      state.latelyPages.forEach(p => {
        if (p.path === page.path) {
          repeatBool = true
        }
      })
      if (!repeatBool) {
        if (state.latelyPages.length < 4) {
          state.latelyPages.push(page)
        } else {
          state.latelyPages.splice(0, 1)
          state.latelyPages.push(page)
        }
      }

      if (!state.normalPageInfo[page.path]) {
        state.normalPageInfo[page.path] = {
          name: page.name,
          path: page.path,
          weight: 0
        }
      }
      state.normalPageInfo[page.path].weight ++
      sessionStorage.setItem('latelyPages', JSON.stringify(state.latelyPages))
      sessionStorage.setItem('normalPageInfo', JSON.stringify(state.normalPageInfo))
    },
    /*  */
    [mutation.ENABLE_IP_PROXY] (state) {
      state.sideItems[5].children.push({
        name: "IP代理",
        path: '/home/system/ipproxy',
        author: '_0001_',
        queryAuthor: "31-1",
        updateAuthor: "31-0",
      })
      // sessionStorage.setItem('licenseUpdate', JSON.stringify(licenseUpdate))
    },
    [mutation.ENABLE_CMD_FORWARD] (state) {
      state.sideItems[1].children.push({
        name: "命令转发",
        path: '/home/cmdForward',
        author: '_0002_',
        queryAuthor: "32-1",
        updateAuthor: "32-0",
        sceneList: [
          {
            name: "转发记录",
            path: "/home/forwardRecord",
            author: "_0201_",
            queryAuthor: "32_1-1",
            updateAuthor: "32_1-0",
          }
        ]
      })
      // sessionStorage.setItem('licenseUpdate', JSON.stringify(licenseUpdate))
    },
    [mutation.ENABLE_DEV_MASTER] (state) {
      if (!state.isAdmin) {
        state.busSideItems[0].sceneList.push({
          name: "备份管理",
          path: '/home/group/devMaster',
          author: '_0201_',
        })
        state.busSideItems[0].sceneList.push({
          name: "新建备份",
          path: '/home/group/devMaster/new',
          author: '_0201_',
        })
        return
      }

      state.sideItems[2].children.push({
        name: "备份管理",
        path: '/home/app/devMaster',
        author: '_0003_',
        queryAuthor: "33-1",
        updateAuthor: "33-0",
        sceneList: [
          {
            name: "新建备份",
            path: "/home/app/devMaster/new",
            author: "_0301_",
            queryAuthor: "33_1-1",
            updateAuthor: "33_1-0",
          }
        ]
      })

      state.sideItems[1].children[2].sceneList.push({
        name: "备份管理",
        path: '/home/group/devMaster',
        author: '_0201_',
      })
      state.sideItems[1].children[2].sceneList.push({
        name: "新建备份",
        path: '/home/group/devMaster/new',
        author: '_0201_',
      })
      console.log(state.sideItems)
      // sessionStorage.setItem('licenseUpdate', JSON.stringify(licenseUpdate))
    },
    [mutation.DEV_INFO] (state, info) {
      state.devInfo = info
      sessionStorage.setItem('devInfo', JSON.stringify(info))
    },
    [mutation.SSH_INFO] (state, ssh) {
      state.ssh = ssh
    },
    [mutation.LOGIN_NOW] (state, loginNow) {
      state.loginNow = loginNow
      sessionStorage.setItem('loginNow', JSON.stringify(loginNow))
    },
  },
  actions: {
    /* 登陆 */
    [action.LOGIN] ({commit, state}, loginInfo) {
      let that = vm
      that.$post(that.$uri.login.login, loginInfo).then(res => {
        res.data.save = loginInfo.save
        commit(mutation.LOGIN_INFO, res.data)
        /*if (res.data.isFirstLogin == 1){
          commit(mutation.GUIDE, 1)
        }*/
        commit(mutation.LOGIN_NOW, true)
        commit(mutation.IS_ADMIN_ROOT, res.data.groupId === 1)
        commit(mutation.IS_ADMIN, res.data.groupType === 1)
        router.push(res.data.groupType === 1 ? "/home" : '/home/group/list')
        /*that.$post(that.$uri.user.groupInfo, {id: res.data.groupId}).then(res => {
          if (res.success) {
            commit(mutation.IS_ADMIN, res.data.groupType === 1)
            router.push(res.data.groupType === 1 ? "/home" : '/home/group/list')
          }
        })*/
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
    },
    /* 跳转帮助文档 */
    [action.GO_FUN] ({commit}, funTitle) {
      let that = vm
      that.$post(that.$uri.help.funList, {}).then(r => {
        if (r.success) {
          commit(mutation.FUN, r.list)
          let index = -1
          for(let i = 0; i < r.list.length; i++) {
            if (r.list[i].title === funTitle) {
              index = i
              break
            }
          }
          if (index !== -1) {
            commit(mutation.HELP_INDEX, index)
            router.push("/home/help/fun/show?index=" + index)
          }
        }
      })
    }
  },
  getters: {
    /* 检查是否有当前模块的修改权限 */
    checkChangeAuth: (state) => () => {
      if(state.isAdminRoot) {
        return true
      }
      let auth = 'oreki'
      if (state.sideInfo.child) {
        auth = state.sideInfo.child.updateAuthor
      }
      return state.userInfo.authority.indexOf(auth) !== -1
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
    groupAuthList (state) {
      let optList = []
      let viewList = []
      state.sideItems.forEach(side => {
        let opt = {
          id: side.updateAuthor,
          query: side.queryAuthor,
          label: side.name,
        }
        let view = {
          id: side.queryAuthor,
          label: side.name,
        }

        if (side.children) {
          opt.children = []
          view.children = []

          side.children.forEach(child => {
            opt.children.push({
              id: side.updateAuthor + ',' + child.updateAuthor,
              query: side.queryAuthor + ',' + child.queryAuthor,
              label: child.name
            })

            view.children.push({
              id: side.queryAuthor + ',' + child.queryAuthor,
              label: child.name
            })
          })
        }

        if(side.name) {
          if(side.updateAuthor) {
            optList.push(opt)
          }
          viewList.push(view)
        }
      })

      return {
        optData: optList,
        viewData: viewList
      }
    },
    /* 获取权限过滤后的展示信息 */
    authorItems (state) {
      let list = []
      if (state.isAdminRoot && vm.$isEnable(vm.$enableKey.webSsh)) {
        state.sideItems[5].children.push({
          name: "SSH",
          path: '/home/system/ssh',
          author: '_0001_',
          queryAuthor: "15-1",
          updateAuthor: "15-0",
        })
        return state.sideItems
      }

      if (!state.isAdmin) {
        return state.busSideItems
      }

      state.sideItems.forEach(i => {
        if (state.userInfo.authority.indexOf(i.authorCode) !== -1) {
          list.push(i)

          let children = i.children
          if (children) {
            for(let j = children.length-1; j>=0; j--){
              if(state.userInfo.authority.indexOf(children[j].queryAuthor) === -1){
                children.splice(j,1);
              }
            }
          }
        }
      })
      return list
    },
    isChildren: (state) => (path) => {
      let page = null
      state.sideItems.forEach(side => {
        if (side.children) {
          side.children.forEach(child => {
            if (child.path === path) {
              page = {
                name: child.name,
                path: child.path
              }
            }
          })
        }
      })
      return page
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
    },
    /* 判断引导弹窗是否显示 */
    isGuideShow: (state) => (popNum) => {
      return state.guide === popNum
    },
    latelyPages(state) {
      return state.latelyPages.slice(0, state.latelyPages.length).reverse()
    },
    normalPages(state) {
      let list = []
      for (let key in state.normalPageInfo) {
        list.push(state.normalPageInfo[key])
      }
      return list.slice(0, list.length > 4 ? 4 : list.length).sort((a1, a2) => { return a2.weight - a1.weight})
    },
    /* 获取设备池详情页面所需的list */
    detailTableList (state) {
      let list = []

      return list
    }
  }
});
