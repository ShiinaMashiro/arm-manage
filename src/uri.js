
export const uri = {
    login: { // 登陆模块
        login: { // 登陆
            path: '/login',
            notLogin: true
        },
        changePassword: '/saveChangePassword' // 修改密码
    },
    system: { // 系统管理模块
        update: '/system/updateSystem', // 管理系统升级接口
        engineUpdate: '/engine/update', // 设备引擎升级接口
        engineList: '/engine/list/', // 设备引擎列表
        engineVersionCheck: '/engine/checkDeviceEngineVersion', // 设备引擎版本检查
        engineCheckVersionCode: '/engine/checkVersionCode', // 设备引擎升级versionCode校验接口
        paramVersion: '/system/getSystemVersion', // 系统参数列表获取
        paramList: '/system/list', // 系统参数列表获取
        paramGet: '/system/edit', // 系统参数获取
        paramSave: '/system/saveEdit', // 系统参数修改
        logGet: '/syslog/edit/', // sysLog参数获取
        logSave: '/syslog/saveEdit', // sysLog参数修改
        engineCodeList: '/bmEngine/list', // 引擎编码表列表
        engineCodeInfo: '/bmEngine/edit', // 引擎编码信息
        engineCodeAdd: '/bmEngine/saveAdd', // 引擎编码新增
        engineCodeChange: '/bmEngine/saveEdit', // 引擎编码修改
        engineCodeDelete: '/bmEngine/delete', // 引擎编码删除
        license: '/system/activateLicense/', // license激活接口
        licenseGet: '/system/getLicense'
    },
    user: { // 用户管理模块
        list: '/user/list', // 用户信息列表
        groupList: '/userGroup/list', // 用户组信息列表
        infoGet: '/user/edit', // 用户信息
        add: '/user/saveAdd', // 用户新增
        infoSave: '/user/saveEdit', // 用户修改
        delete: '/user/delete', // 用户删除
        groupInfo: '/userGroup/edit', // 用户组信息
        groupAdd: '/userGroup/saveAdd', // 用户组新增
        groupInfoSave: '/userGroup/saveEdit', // 用户组修改
        groupDelete: '/userGroup/delete', // 用户组删除
        groupMerge: '/userGroup/saveGroupUserGroupMerge/', // 用户组关联分组
    },
    device: { // 设备管理模块
        caseList: '/case/list', // 设备池列表
        caseInfo: '/case/edit', // 设备池信息
        caseInfoByCaseNo: '/case/getByCaseNo', // 设备池信息
        caseInfoSave: '/case/saveEdit', // 设备池信息修改
        scanNode: '/case/scanNode', // 扫描分层处理器
        scanDevice: '/case/scanDevice', // 扫描设备
        addDevice: '/case/addDevice', // 手动添加设备
        caseDelete: '/case/delete', // 设备池删除
        deviceList: '/device/list', // 设备信息列表
        deviceInfo: '/device/edit', // 设备信息
        deviceReboot: '/device/reboot', // 设备重启
        deviceRecover: '/device/recover', // 设备回收
        deviceRestore: '/device/restore', // 设备恢复出厂设置
        deviceDelete: '/device/delete', // 设备删除
        deviceGrouping: '/device/grouping', //
        updateDeviceIp: '/case/updateDeviceIp', // 设备池IP修改
        snapshot: '/device/snapshot/', // 设备截图
        qrCode: '/device/idCode/', // 云机识别码
        backHome: '/device/home/', // 云机识别码
        turnAdb: '/device/turnAdb/', // 开关ADB
        startApp: '/device/startApp/', // 开关ADB
        stopApp: '/device/stopApp/', // 开关ADB
        sync: '/device/sync/', // 开关ADB
    },
    apk: { // 应用模块管理
        apkList: '/apk/list', // 应用信息列表
        apkInfo: '/apk/edit', // 应用信息
        apkInfoSave: '/apk/saveEdit', // 应用信息修改
        apkAdd: '/apk/saveAdd', // 应用新增
        apkDelete: '/apk/delete', // 应用删除
        apkGroupMerge: '/apk/saveApkGroupMerge', // 应用关联分组
        apkOff: '/apk/off', // 应用下架
        apkUp: '/apk/up', //应用上架
        apkMonitorDelete: '/apkIssued/delete', //应用安装监控信息删除
        apkMonitorDeleteAll: '/apkIssued/deleteAll', //应用安装监控信息全部删除
        apkMonitor: '/apkIssued/list' //应用安装监控信息列表
    },
    group: { // 分组管理模块
        list: '/group/list', // 分组信息列表
        info: '/group/edit', // 分组信息
        add: '/group/saveAdd', // 分组新增
        infoSave: '/group/saveEdit', // 分组修改
        delete: '/group/delete', // 分组删除
        deviceMerge: '/group/saveGroupDeviceMerge', // 分组关联设备
        apkMerge: '/group/saveGroupApkMerge', // 分组关联应用
        uploadConfigureFile: '/group/uploadConfigureFile' // 配置文件上传
    },
    log: { // 日志管理模块
        operationLog: '/log/operation', // 操作日志列表
        dispatchLog: '/log/dispatch', // 调度日志列表
        operationLogDelete: '/log/deleteOperation', // 操作日志删除
        dispatchLogDelete: '/log/deleteDispatch', // 调度日志删除
        groupLog: '/log/group', // 分组日志列表
        groupLogDelete: '/log/deleteGroup', // 分组日志删除
    },
    help: { // 帮助中心
        faqList: '/faq/list', // FAQ信息列表
        faqInfo: '/faq/edit', // FAQ信息
        faqAdd: '/faq/saveAdd', // FAQ信息新增
        faqModify: '/faq/saveEdit', // FAQ信息修改
        faqDelete: '/faq/delete', // FAQ信息删除
        funClassList: '/introductionCategory/list', // 功能介绍大类信息列表
        funClassInfo: '/introductionCategory/edit/', // 功能介绍大类信息
        funClassAdd: '/introductionCategory/saveAdd', // 功能介绍大类信息新增
        funClassModify: '/introductionCategory/saveEdit', // 功能介绍大类信息修改
        funClassDelete: '/introductionCategory/delete', // 功能介绍大类信息删除
        funList: '/introduction/list', // 功能介绍信息列表
        funInfo: '/introduction/edit', // 功能介绍信息
        funAdd: '/introduction/saveAdd', // 功能介绍信息新增
        funModify: '/introduction/saveEdit', // 功能介绍信息修改
        funDelete: '/introduction/delete', // 功能介绍信息删除
        funImgAdd: '/uploadFile', // 功能介绍信息图片增加
    },
    file: {
        fileList: '/fileIssue/list/', //文件信息列表
        fileInfo: '/fileIssue/edit/', //文件信息
        fileAdd: '/fileIssue/saveAdd/', //文件新增
        fileDel: '/fileIssue/delete/', //文件删除
        fileIssue: '/fileIssue/issue/', //文件分发
    }
}