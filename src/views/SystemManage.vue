<template>
  <div>
    <div class="detail-table">
      <div class="detail-table-header">
        <span class="detail-table-header-name">系统信息</span>
      </div>
      <div class="detail-table-body">
        <DetailTableItem class="detail-table-body-item" name="设备引擎版本" style="width: 100%">
          <div class="engine-info">
            <!--<div class="engine-version">
              <template v-for="(item, index) in engineList">
                <span :key="index">{{item.engineTypeName}}</span>
              </template>
            </div>-->
            <el-button type="text" @click="engineUpdatePopShow = true" v-if="$store.getters.checkChangeAuth()">引擎升级</el-button>
            <el-button type="text" @click="checkVersion" v-if="$store.getters.checkChangeAuth()">版本检查</el-button>
            <el-button type="text" @click="versionPop" v-if="$store.getters.checkChangeAuth()">版本管理</el-button>
          </div>
        </DetailTableItem>
        <DetailTableItem class="detail-table-body-item" name="管理系统版本">
          <!--<div class="engine-info">
            <span class="engine-version">{{systemVersion}}</span>
            <el-button type="text" @click="systemUpdatePopShow = true" v-if="$store.getters.checkChangeAuth()">管理系统升级</el-button>
          </div>-->
          <div class="engine-info">
            <div class="engine-version">
              <span>前端: 1.1.0</span>
              <span>后台: {{systemVersion}}</span>
            </div>
            <el-button type="text" @click="systemUpdatePopShow = true" v-if="$store.getters.checkChangeAuth()">管理系统升级</el-button>
            <el-button type="text" @click="license" v-if="$store.getters.checkChangeAuth()">激活</el-button>
          </div>
        </DetailTableItem>
        <DetailTableItem class="detail-table-body-item" name="管理中心网络配置">
          <div class="engine-info">
            <div class="engine-version" style="text-align: left">
              <span>IP: {{systemParams.webIp}}</span>
              <span>端口: {{systemParams.webPort}}</span>
              <span>子网掩码: {{systemParams.webMask}}</span>
            </div>
            <el-button type="text" @click="netChangePop" v-if="$store.getters.checkChangeAuth()">修改</el-button>
          </div>
        </DetailTableItem>
        <DetailTableItem class="detail-table-body-item" name="运维信息">
          <div class="engine-info">
            <el-button type="text" @click="emailPopShow = true; emailAddShow = false" v-if="$store.getters.checkChangeAuth()">运维邮箱</el-button>
            <el-button type="text" @click="phonePopShow = true; phoneAddShow = false" v-if="$store.getters.checkChangeAuth()">运维电话</el-button>
          </div>
        </DetailTableItem>
        <DetailTableItem class="detail-table-body-item" name="推流最大码率">
          <div class="engine-info">
            <span class="engine-version">{{systemParams.encodeRateMax}}</span>
            <el-button type="text" @click="rateChangePop" v-if="$store.getters.checkChangeAuth()">修改</el-button>
          </div>
        </DetailTableItem>
        <DetailTableItem class="detail-table-body-item" name="NTP服务器">
          <div class="engine-info">
            <span class="engine-version">{{systemParams.ntpAddress}}</span>
            <el-button type="text" @click="ntpChangePop" v-if="$store.getters.checkChangeAuth()">修改</el-button>
          </div>
        </DetailTableItem>
        <DetailTableItem class="detail-table-body-item" name="公网IP">
          <div class="engine-info">
            <span class="engine-version">{{systemParams.extranetIp}}</span>
            <el-button type="text" @click="netIpChangePop" v-if="$store.getters.checkChangeAuth()">修改</el-button>
          </div>
        </DetailTableItem>
        <DetailTableItem class="detail-table-body-item" name="设备自主安装应用">
          <div class="engine-info">
            <span class="engine-version">{{systemParams.isAppAllow == 1 ? "是" : "否"}}</span>
            <el-button type="text" @click="appAllowChangePop" v-if="$store.getters.checkChangeAuth()">修改</el-button>
          </div>
        </DetailTableItem>
        <DetailTableItem class="detail-table-body-item" name="推流帧率">
          <div class="engine-info">
            <span class="engine-version">{{systemParams.framerate}}</span>
            <el-button type="text" @click="frameRateChangePop" v-if="$store.getters.checkChangeAuth()">修改</el-button>
          </div>
        </DetailTableItem>
        <DetailTableItem class="detail-table-body-item" name="媒体服务器外网地址">
          <div class="engine-info">
            <span class="engine-version">{{systemParams.mediaServerWan}}</span>
            <el-button type="text" @click="mediaServerWanChangePop" v-if="$store.getters.checkChangeAuth()">修改</el-button>
          </div>
        </DetailTableItem>
        <DetailTableItem class="detail-table-body-item" name="媒体服务器内网地址">
          <div class="engine-info">
            <span class="engine-version">{{systemParams.mediaServerLan}}</span>
            <el-button type="text" @click="mediaServerLanChangePop" v-if="$store.getters.checkChangeAuth()">修改</el-button>
          </div>
        </DetailTableItem>
      </div>
    </div>

    <div class="detail-table" v-if="sysLogInfo.success" style="margin-top: 10px">
      <div class="detail-table-header">
        <span class="detail-table-header-name">Syslog日志服务器配置</span>
        <!--<el-dropdown @command="handleCommand" v-if="$store.getters.checkChangeAuth()">
        <span class="detail-table-setting">
          设置<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="sysLog">参数设置</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>-->
      </div>
      <div class="detail-table-body">
        <DetailTableItem class="detail-table-body-item" name="日志输出方式">
          <div class="engine-info">
            <span class="engine-version">{{this.sysLogInfo.data.output | logOutput}}</span>
            <el-button type="text" @click="sysLogChangePop('output')" v-if="$store.getters.checkChangeAuth()">修改</el-button>
          </div>
        </DetailTableItem>
        <DetailTableItem class="detail-table-body-item" name="日志文件的大小">
          <div class="engine-info">
            <span class="engine-version">{{this.sysLogInfo.data.fileSize}}M</span>
            <el-button type="text" @click="sysLogChangePop('fileSize')" v-if="$store.getters.checkChangeAuth()">修改</el-button>
          </div>
        </DetailTableItem>
        <DetailTableItem class="detail-table-body-item" name="日志服务器的地址">
          <div class="engine-info">
            <span class="engine-version">{{this.sysLogInfo.data.udpServer}}</span>
            <el-button type="text" @click="sysLogChangePop('udpServer')" v-if="$store.getters.checkChangeAuth()">修改</el-button>
          </div>
        </DetailTableItem>
        <DetailTableItem class="detail-table-body-item" name="日志服务器的端口">
          <div class="engine-info">
            <span class="engine-version">{{this.sysLogInfo.data.udpPort}}</span>
            <el-button type="text" @click="sysLogChangePop('udpPort')" v-if="$store.getters.checkChangeAuth()">修改</el-button>
          </div>
        </DetailTableItem>
        <DetailTableItem class="detail-table-body-item" name="远程日志级别">
          <div class="engine-info">
            <span class="engine-version">{{this.sysLogInfo.data.remoteLevel | logLevel}}</span>
            <el-button type="text" @click="sysLogChangePop('remoteLevel')" v-if="$store.getters.checkChangeAuth()">修改</el-button>
          </div>
        </DetailTableItem>
        <DetailTableItem class="detail-table-body-item" name="日志级别">
          <div class="engine-info">
            <span class="engine-version">{{this.sysLogInfo.data.logLevel | logLevel}}</span>
            <el-button type="text" @click="sysLogChangePop('logLevel')" v-if="$store.getters.checkChangeAuth()">修改</el-button>
          </div>
        </DetailTableItem>
      </div>
    </div>
    <div class="detail-setting">
      <!--<el-button type="info" plain size="small" @click="sysLogChangePop">参数设置</el-button>-->
    </div>
    <!-- 引擎升级 -->
    <el-dialog title="引擎升级" :append-to-body="true"
               :close-on-click-modal="false" :show-close="false" top="15vh"
               :visible.sync="engineUpdatePopShow" width="500px">
      <div>
        <el-form ref="form" :model="engineUpdateExtraInfo" label-width="130px" label-position="left">
          <el-form-item size="mini" label="系统当前版本">
            <div style="display: flex;flex-direction: column;justify-content: flex-start">
              <template v-for="(item, index) in engineList">
                <span style="line-height: normal" :key="index">{{item.engineTypeName}}: {{item.versionName}}-{{item.versionCode}}</span>
              </template>
            </div>
          </el-form-item>
          <el-form-item size="mini" label="类型">
            <div class="item-input">
              <el-select v-model="engineUpdateExtraInfo.engineType" size="samll" placeholder="引擎版本">
                <el-option
                        v-for="item in engineOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item size="mini" label="版本号">
            <el-input v-model="engineUpdateExtraInfo.versionName"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="版本序号">
            <el-input v-model="engineUpdateExtraInfo.versionCode"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="升级文件">
            <el-upload
                    class="upload-demo"
                    ref="upload"
                    :headers="$store.getters.getHeaders"
                    :action="$uri.system.engineUpdate"
                    :data="engineUpdateExtraInfo"
                    accept="apk"
                    :limit="1"
                    :multiple="false"
                    :on-success="handleSuccess"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-upload="handleUploadEngine"
                    :on-progress="handleProgressEngine"
                    :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item size="mini" label="MD5">
            <el-input v-model="engineUpdateExtraInfo.md5"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="engineUploadTip" @click="submitUpload">确定</el-button>
            <el-button @click="engineUploadPopClose">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 日志参数设置 -->
    <el-dialog title="日志参数设置" :append-to-body="true" :visible.sync="logChangePopShow" width="500px" top="15vh">
      <div>
        <el-form ref="form" :model="sysLogChangeInfo" label-width="130px" label-position="left">
          <el-form-item size="mini" label="日志输出方式" :style="logItemShow('output')">
            <div class="item-input">
              <el-select v-model="sysLogChangeInfo.output" size="samll" placeholder="引擎版本">
                <el-option
                        v-for="item in logOutputOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item size="mini" label="日志级别" :style="logItemShow('logLevel')">
            <div class="item-input">
              <el-select v-model="sysLogChangeInfo.logLevel" size="samll" placeholder="日志级别">
                <el-option
                        v-for="item in logLevelOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item size="mini" label="远程日志级别" :style="logItemShow('remoteLevel')">
            <div class="item-input">
              <el-select v-model="sysLogChangeInfo.remoteLevel" size="samll" placeholder="远程日志级别">
                <el-option
                        v-for="item in logLevelOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item size="mini" label="日志文件大小" :style="logItemShow('fileSize')">
            <el-input v-model="sysLogChangeInfo.fileSize"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="日志服务器地址" :style="logItemShow('udpServer')">
            <el-input v-model="sysLogChangeInfo.udpServer"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="日志服务器端口" :style="logItemShow('udpPort')">
            <el-input v-model="sysLogChangeInfo.udpPort"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="sysLogChange">确定</el-button>
            <el-button @click="logChangePopShow = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 管理系统升级 -->
    <el-dialog title="管理系统升级" :append-to-body="true"
               :close-on-click-modal="false" :show-close="false" top="15vh"
               :visible.sync="systemUpdatePopShow" width="500px">
      <div>
        <el-form ref="form" :model="sysLogChangeInfo" label-width="130px" label-position="left">
          <el-form-item size="mini" label="系统当前版本">
            <span>{{systemVersion}}</span>
          </el-form-item>
          <el-form-item size="mini" label="升级文件">
            <el-upload
                    class="upload-demo"
                    ref="systemUpdate"
                    :headers="$store.getters.getHeaders"
                    :action="$uri.system.update"
                    :limit="1"
                    :multiple="false"
                    :on-success="handleSuccess2"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-upload="handleUploadSystem"
                    :on-progress="handleProgressSystem"
                    :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="systemUploadTip" @click="systemUpdate">确定</el-button>
            <el-button @click="systemUploadPopClose">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 机箱类型修改 -->
    <el-dialog title="机箱类型修改" :append-to-body="true" :visible.sync="caseTypeChangePopShow" width="500px" top="15vh">
      <div>
        <el-form ref="form" :model="caseTypeChangeInfo" label-width="130px" label-position="left">
          <el-form-item size="mini" label="机箱类型">
            <div class="item-input">
              <el-select v-model="caseTypeChangeInfo.paramValue" size="samll" placeholder="机箱类型">
                <el-option
                        v-for="item in caseTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="systemParamChange">确定</el-button>
            <el-button @click="caseTypeChangePopShow = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 网络配置 -->
    <el-dialog title="网络配置" :append-to-body="true" :visible.sync="netChangePopShow" width="500px" top="15vh">
      <div>
        <el-form ref="form" :model="netChangeInfo" label-width="130px" label-position="left">
          <el-form-item size="mini" label="IP">
            <el-input v-model="netChangeInfo.ip"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="端口">
            <el-input v-model="netChangeInfo.port"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="子网掩码">
            <el-input v-model="netChangeInfo.mask"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="netChange">确定</el-button>
            <el-button @click="netChangePopShow = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- ntp配置 -->
    <el-dialog title="NTP配置" :append-to-body="true" :visible.sync="ntpChangePopShow" width="500px" top="15vh">
      <div>
        <el-form ref="form" :model="ntpChangeInfo" label-width="130px" label-position="left">
          <el-form-item size="mini" label="IP/域名">
            <el-input v-model="ntpChangeInfo.ntpAddress"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="ntpChange">确定</el-button>
            <el-button @click="ntpChangePopShow = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 公网配置 -->
    <el-dialog title="公网配置" :append-to-body="true" :visible.sync="netIpChangePopShow" width="500px" top="15vh">
      <div>
        <el-form ref="form" :model="netIpChangeInfo" label-width="130px" label-position="left">
          <el-form-item size="mini" label="IP/域名">
            <el-input v-model="netIpChangeInfo.extranetIp"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="netIpChange">确定</el-button>
            <el-button @click="netIpChangePopShow = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 推流配置 -->
    <el-dialog title="推流配置" :append-to-body="true" :visible.sync="rateChangePopShow" width="500px" top="15vh">
      <div>
        <el-form ref="form" :model="rateChangeInfo" label-width="130px" label-position="left">
          <el-form-item size="mini" label="码率">
            <div class="test">
              <el-input type="number" v-model="rateChangeInfo.encodeRateMax">
                <div slot="suffix">kb/s</div>
              </el-input>
              <el-tooltip effect="dark" content="推流最大码率主要用于调节推流清晰度，根据网络实时进行适配，保证良好的推流体验，设置建议值1000-6000" placement="top-start">
                <i class="el-icon-question" style="margin-left: 5px" ></i>
              </el-tooltip>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="rateChange">确定</el-button>
            <el-button @click="rateChangePopShow = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 推流帧率配置 -->
    <el-dialog title="推流帧率配置" :append-to-body="true" :visible.sync="frameRateChangePopShow" width="500px" top="15vh">
      <div>
        <el-form ref="form" :model="frameRateChangeInfo" label-width="130px" label-position="left">
          <el-form-item size="mini" label="推流帧率">
            <div class="test">
              <el-input type="number" v-model="frameRateChangeInfo.framerate">
              </el-input>
              <el-tooltip effect="dark" content="推流帧率为应用推流时的最大帧数，建议值为1-60" placement="top-start">
                <i class="el-icon-question" style="margin-left: 5px" ></i>
              </el-tooltip>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="frameRateChange">确定</el-button>
            <el-button @click="frameRateChangePopShow = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 外网 -->
    <el-dialog title="媒体服务器外网地址" :append-to-body="true" :visible.sync="mediaServerWanChangePopShow" width="500px" top="15vh">
      <div>
        <el-form ref="form" :model="mediaServerWanChangeInfo" label-width="130px" label-position="left">
          <el-form-item size="mini" label="IP">
            <div class="test">
              <el-input v-model="mediaServerWanChangeInfo.mediaServerWan">
              </el-input>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="mediaServerWanChange">确定</el-button>
            <el-button @click="mediaServerWanChangePopShow = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 外网 -->
    <el-dialog title="媒体服务器内网地址" :append-to-body="true" :visible.sync="mediaServerLanChangePopShow" width="500px" top="15vh">
      <div>
        <el-form ref="form" :model="mediaServerLanChangeInfo" label-width="130px" label-position="left">
          <el-form-item size="mini" label="IP">
            <div class="test">
              <el-input v-model="mediaServerLanChangeInfo.mediaServerLan">
              </el-input>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="mediaServerLanChange">确定</el-button>
            <el-button @click="mediaServerLanChangePopShow = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 设备自主安装应用配置 -->
    <el-dialog title="设备自主安装应用配置" :append-to-body="true" :visible.sync="appAllowChangePopShow" width="500px" top="15vh">
      <div>
        <el-form ref="form" :model="appAllowChangeInfo" label-width="150px" label-position="left">
          <el-form-item size="mini" label="设备自主安装应用">
            <el-switch
                    v-model="appAllowChangeInfo.isAppAllow"
                    active-value="1"
                    inactive-value="0">
            </el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="appAllowChange">确定</el-button>
            <el-button @click="appAllowChangePopShow = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 引擎版本配置 -->
    <el-dialog title="引擎版本管理" :append-to-body="true" :visible.sync="versionPopShow" width="500px" top="15vh">
      <div>
        <el-form ref="form" :model="versionAddInfo" label-width="130px" label-position="left">
          <el-button type="primary" size="small" @click="versionAddShow = true" v-if="!versionAddShow">新增版本</el-button>
          <div v-if="versionAddShow" style="padding: 0 0 0 10px;display: flex;">
            <el-form :inline="true" size="small" :model="versionAddInfo">
              <el-form-item size="mini" label="引擎编码">
                <el-input type="text" style="width: 80px" placeholder="数字" show-word-limit
                          maxlength="4" v-model="versionAddInfo.code"></el-input>
              </el-form-item>
              <el-form-item size="mini" label="引擎版本">
                <el-input type="text" style="width: 148px" placeholder="数字/字母" show-word-limit
                          maxlength="20" v-model="versionAddInfo.content"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="versionAdd">确定</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div style="display: flex;flex-direction: column;border-top: thin solid gray; margin-top: 10px;max-height: 400px;overflow-y: auto">
            <template v-for="(item, index) in versionInfoList">
              <div style="display: flex;flex-direction: row;justify-content: space-between;padding: 5px 10px;" :key="index">
                <div style="display: flex;justify-content: start;align-items: center;width: 150px">引擎编码：{{item.code}}</div>
                <div style="display: flex;justify-content: start;align-items: center;width: 150px">引擎版本：{{item.content}}</div>
                <el-button type="text" @click="versionDelete(item.code)">删除</el-button>
              </div>
            </template>
          </div>
        </el-form>
      </div>
    </el-dialog>
    <!-- 邮箱配置 -->
    <el-dialog title="邮箱配置" :append-to-body="true" :visible.sync="emailPopShow" width="500px" top="15vh">
      <div>
        <el-form ref="form" :model="emailAddInfo" label-width="130px" label-position="left">
          <el-form-item size="mini" label="">
            <el-button type="text" @click="emailAddShow = true" v-if="!emailAddShow">新增邮箱</el-button>
          </el-form-item>
          <el-form-item size="mini" label="运维邮箱">
            <div style="display: flex;flex-direction: column;max-height: 400px;overflow-y: auto">
              <template v-for="(item, index) in emailList">
                <div style="display: flex;flex-direction: row;justify-content: space-between">
                  <span :key="index">{{item}}</span>
                  <el-button type="text" @click="emailDel(index)">删除</el-button>
                </div>
              </template>
            </div>
          </el-form-item>
          <el-form-item size="mini" label="新增邮箱" v-if="emailAddShow">
            <el-input v-model="emailAddInfo.email"></el-input>
          </el-form-item>
          <el-form-item  v-if="emailAddShow">
            <el-button type="primary" @click="emailAdd">确定</el-button>
            <el-button @click="emailPopShow = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 用户配置 -->
    <el-dialog title="电话配置" :append-to-body="true" :visible.sync="phonePopShow" width="500px" top="15vh">
      <div>
        <el-form ref="form" :model="phoneAddInfo" label-width="130px" label-position="left">
          <el-form-item size="mini" label="">
            <el-button type="text" @click="phoneAddShow = true" v-if="!phoneAddShow">新增电话</el-button>
          </el-form-item>
          <el-form-item size="mini" label="运维电话">
            <div style="display: flex;flex-direction: column;max-height: 400px;overflow-y: auto">
              <template v-for="(item, index) in phoneList">
                <div style="display: flex;flex-direction: row;justify-content: space-between">
                  <span :key="index">{{item}}</span>
                  <el-button type="text" @click="phoneDel(index)">删除</el-button>
                </div>
              </template>
            </div>
          </el-form-item>
          <el-form-item size="mini" label="新增电话" v-if="phoneAddShow">
            <el-input v-model="phoneAddInfo.phone"></el-input>
          </el-form-item>
          <el-form-item  v-if="phoneAddShow">
            <el-button type="primary" @click="phoneAdd">确定</el-button>
            <el-button @click="phonePopShow = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import DetailTableItem from "@/components/DetailTableItem2"
  export default {
    name: "SystemManage",
    components: {
      DetailTableItem
    },
    data () {
      return {
        engineUpdatePopShow: false,
        versionPopShow: false,
        versionInfoList: [],
        versionAddShow: false,
        versionAddInfo: {
          code: '',
          content: ''
        },
        logChangePopShow: false,
          systemUpdatePopShow: false,
        caseTypeChangePopShow: false,
        engineUploadTip: false,
        systemUploadTip: false,
        emailPopShow: false,
        emailAddShow: false,
        phonePopShow: false,
        phoneAddShow: false,
        emailAddInfo: {
          email: ""
        },
        phoneAddInfo: {
          phone: ""
        },
        caseTypeChangeInfo: {
          id: 0,
          paramName: "",
          paramValue: ""
        },
        netChangePopShow: false,
        netChangeInfo: {
          ip: "",
          port: "",
          mask: ""
        },
        ntpChangePopShow: false,
        ntpChangeInfo: {
          ntpAddress: ""
        },
        netIpChangePopShow: false,
        netIpChangeInfo: {
          extranetIp: ""
        },
        rateChangePopShow: false,
        rateChangeInfo: {
          encodeRateMax: ""
        },
        appAllowChangePopShow: false,
        appAllowChangeInfo: {
          isAppAllow: "0"
        },
        frameRateChangePopShow: false,
        frameRateChangeInfo: {
          framerate: ""
        },
        mediaServerLanChangePopShow: false,
        mediaServerLanChangeInfo: {
          mediaServerLan: ""
        },
        mediaServerWanChangePopShow: false,
        mediaServerWanChangeInfo: {
          mediaServerWan: ""
        },
        caseInfo: {},
        list: [],
        engineList: [],
        engineUpdateExtraInfo: {
          engineType: "",
          versionName: "",
          versionCode: "",
          md5: ""
        },
        sysLogInfo: {
          success: false,
          data: {}
        },
        sysLogChangeInfo: {
          id: 0,
          output: "",
          logLevel: "",
          remoteLevel: "",
          fileSize: "",
          udpServer: "",
          udpPort: ""
        },
        logItem: "",
        logLevelOptions: [
          {
            label: "EMERG",
            value: 0
          }, {
            label: "ALERT",
            value: 1
          }, {
            label: "CRIT",
            value: 2
          }, {
            label: "ERROR",
            value: 3
          }, {
            label: "WARNING",
            value: 4
          }, {
            label: "NOTICE",
            value: 5
          }, {
            label: "INFO",
            value: 6
          }, {
            label: "DEBUG",
            value: 7
          }
        ],
        logOutputOptions: [
          {
            label: "关闭全部日志输出",
            value: 0
          }, {
            label: "仅输出到本地文件",
            value: 2
          }, {
            label: "仅输出到服务器",
            value: 4
          }
        ],
        caseTypeOptions: [
          {
            label: "32路",
            value: "0"
          }, {
            label: "80路",
            value: "1"
          }
        ],
        systemParams: {
          webIp: "",
          webMask: "",
          caseType: "",
          email: "",
          phone: "",
          ntpAddress: "",
          encodeRateMax: "",
          extranetIp: "",
          isAppAllow: "",
          framerate: ""
        },
        systemParamIds: {
          webIp: "",
          webPort: "",
          webMask: "",
          caseType: "",
          email: "",
          phone: "",
          ntpAddress: "",
          encodeRateMax: "",
          extranetIp: "",
          isAppAllow: "",
          framerate: "",
          mediaServerWan: "",
          mediaServerLan: ""
        },
        systemVersion: ""
      }
    },
    computed: {
      engineOptions () {
        let list = []
        this.engineList.forEach(v => {
          list.push({
            label: v.engineTypeName,
            value: v.engineType
          })
        })
        return list
      },
      emailList () {
        let email = this.systemParams.email
        return email ? email.split(",") : []
      },
      phoneList () {
        let email = this.systemParams.phone
        return email ? email.split(",") : []
      }
    },
    filters: {
      logOutput (val) {
        switch (val) {
          case 0: return "关闭全部日志输出"
          case 2: return "仅输出到本地文件"
          case 4: return "仅输出到服务器"
          default: return "未知"
        }
      },
      logLevel (val) {
        switch (val) {
          case 0: return "EMERG"
          case 1: return "ALERT"
          case 2: return "CRIT"
          case 3: return "ERROR"
          case 4: return "WARNING"
          case 5: return "NOTICE"
          case 6: return "INFO"
          case 7: return "DEBUG"
          default: return "未知"
        }
      },
      caseTypeFilter (val) {
        switch (val) {
          case "0": return "32路"
          case "1": return "80路"
        }
      }
    },
    methods: {
      license() {
        this.$store.commit(this.$mutation.LICENSE_UPDATE, true)
      },
      logItemShow(item) {
        return this.logItem === item ? {} : {"display": "none"}
      },
      versionPop () {
        let that = this
        that.versionAddShow = false
        that.$post(that.$uri.system.engineCodeList).then(res => {
          if (res.success) {
            that.versionInfoList = res.list
            that.versionPopShow = true
          } else {
            that.$message.error("获取信息失败，" + res.message)
          }
        })
      },
      versionAdd () {
        let that = this
        if (!/^[0-9]{1,4}$/.test(that.versionAddInfo.code) || !/^[0-9a-zA-Z_]{1,20}$/.test(that.versionAddInfo.content)) {
          that.$message.error("请按正确的格式输入参数")
          return
        }
        that.$post(that.$uri.system.engineCodeAdd, that.versionAddInfo).then(res => {
          if (res.success) {
            that.$message.success("添加引擎版本成功")
            that.versionAddShow = false
            that.versionAddInfo = {code:'', content: ''}
            that.$post(that.$uri.system.engineCodeList).then(res => {
              if (res.success) {
                that.versionInfoList = res.list
              } else {
                that.$message.error("获取信息失败，" + res.message)
              }
            })
          } else {
            that.$message.error("添加失败，错误信息：" + res.message + "，错误码： " + res.code)
          }
        })
      },
      versionDelete (code) {
        let that = this
        this.$confirm('删除后引擎版本将无法识别，是否继续?', '提示', {
          confirmButtonText: '确定',
          confirmButtonClass: 'confirm-btn-yellow',
          iconClass: 'el-icon-c-yellow',
          cancelButtonText: '取消'
        }).then(() => {
          that.$post(that.$uri.system.engineCodeDelete, {code}).then(res => {
            if (res.success) {
              that.$message.success("删除成功")
              for (let i in that.versionInfoList) {
                if (that.versionInfoList[i].code === code) {
                  that.versionInfoList.splice(i, 1)
                  break
                }
              }
            } else {
              that.$message.error("删除失败，错误信息：" + res.message + "，错误码：" + res.code)
            }
          })
        }).catch(() => {})
      },
      emailAdd () {
        let emailStr = this.emailAddInfo.email
        let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+(\.[a-zA-Z]{2,4}){1,2}$/;
        if (!reg.test(emailStr)) {
          this.$message.error("邮箱格式不正确")
          return
        }
        let that = this
        let list = that.systemParams.email ? that.systemParams.email.split(",") : []
        list.push(that.emailAddInfo.email)
        that.$post(that.$uri.system.paramSave, {
          id: that.systemParamIds.email,
          paramName: "email",
          paramValue: list.join(",")
        }).then(res => {
          that.$message.success("添加成功")
          that.emailAddShow = false
          that.emailAddInfo.email = ""
          that.getSystemParamList()
        })
      },
      emailDel (index) {
        let that = this
        let list = that.systemParams.email ? that.systemParams.email.split(",") : []
        list.splice(index, 1)
        that.$post(that.$uri.system.paramSave, {
          id: that.systemParamIds.email,
          paramName: "email",
          paramValue: list.join(",")
        }).then(res => {
          that.$message.success("删除成功")
          that.getSystemParamList()
        })
      },
      phoneAdd () {
        let emailStr = this.phoneAddInfo.phone
        let reg = /^1[3|4|5|8][0-9]\d{4,8}$/;
        if (!reg.test(emailStr)) {
          this.$message.error("手机格式不正确")
          return
        }
        let that = this
        let list = that.systemParams.phone ? that.systemParams.phone.split(",") : []
        list.push(that.phoneAddInfo.phone)
        that.$post(that.$uri.system.paramSave, {
          id: that.systemParamIds.phone,
          paramName: "phone",
          paramValue: list.join(",")
        }).then(res => {
          that.$message.success("添加成功")
          that.phoneAddShow = false
          that.phoneAddInfo.phone = ""
          that.getSystemParamList()
        })
      },
      phoneDel (index) {
        let that = this
        let list = that.systemParams.phone ? that.systemParams.phone.split(",") : []
        list.splice(index, 1)
        that.$post(that.$uri.system.paramSave, {
          id: that.systemParamIds.phone,
          paramName: "phone",
          paramValue: list.join(",")
        }).then(res => {
          that.$message.success("删除成功")
          that.getSystemParamList()
        })
      },
      /* 修改设备池信息 */
      saveCaseInfo () {
        let that = this
        that.$post(that.$uri.device.caseInfoSave, that.caseInfo).then(res => {
          that.networkPopShow = false
          that.nodePopShow = false
          that.remarkPopShow = false
          that.$message.success("修改成功")
          // 把修改保存到store
          that.$store.commit(that.$mutation.CASE_DETAIL, that.caseInfo)
          // 刷新数据
          this.list = this.$store.getters.detailTableList
        })
      },
      /* 网络设置 */
      networkSet () {
        this.saveCaseInfo()
      },
      /* 网络设置弹窗 */
      networkSetPop () {
        this.networkPopShow = true
      },
      /* 分层设置 */
      nodeSet () {
        this.saveCaseInfo()
      },
      /* 分层设置弹窗 */
      nodeSetPop () {
        this.nodePopShow = true
      },
      /* 修改备注 */
      remarkChange () {
        this.saveCaseInfo()
      },
      /* 修改备注弹窗 */
      remarkChangePop () {
        this.remarkPopShow = true
      },
      /* 下拉菜单事件 */
      handleCommand (command) {
        switch (command) {
          case "sysLog": this.sysLogChangePop(); break;
        }
      },
      /* 获取引擎列表 */
      getEngineList () {
        let that = this
        that.$post(that.$uri.system.engineList, {}).then(res => {
          that.engineList = res.data
        })
      },
      /* 版本检查 */
      checkVersion () {
        this.$confirm("开始检查设备版本，低版本将自动升级？", "提示", {
          confirmButtonText: '确定',
          confirmButtonClass: 'confirm-btn-blue',
          iconClass: 'el-icon-c-blue',
          cancelButtonText: '取消'
        }).then( () => {
          let that = this
          that.$post(that.$uri.system.engineVersionCheck, {}).then(res => {
            that.$message.success("设备版本检查成功")
          })
        }).catch( () => {})
      },
      /* 上传文件 */
      submitUpload() {
        let that = this
        this.$post(that.$uri.system.engineCheckVersionCode, that.engineUpdateExtraInfo).then(res => {
          let msg = res.success ? "" : res.message
          msg += "\n如果确认无误，请点击确认按钮进行升级。"
          this.$confirm(msg, "提示", {
            confirmButtonText: '确定',
            confirmButtonClass: 'confirm-btn-blue',
            iconClass: 'el-icon-c-blue',
            cancelButtonText: '取消'
          }).then(() => {
            this.$refs.upload.submit();
          }).catch(() => {});
        })
      },
      handleProgressSystem (event, file, fileList) {
        if (!this.systemUploadTip) {
          this.$refs.systemUpdate.abort(file)
          this.$refs.systemUpdate.clearFiles()
        }
      },
      handleProgressEngine (event, file, fileList) {
        if (!this.engineUploadTip) {
          this.$refs.upload.abort(file)
          this.$refs.upload.clearFiles()
        }
      },
      handleSuccess(response, file, fileList) {
        if (response.success) {
          this.engineUpdatePopShow = false
          this.engineUpdatePopShow = false
          this.engineUploadTip = false
          this.$refs.upload.clearFiles()
          this.$message.success("升级成功")
        } else {
          console.log(response)
          this.$message.error(response.message)
          this.$refs.upload.clearFiles()
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleUploadSystem () {
        this.systemUploadTip = true
      },
      handleUploadEngine () {
        this.engineUploadTip = true
      },
      getSysLogParam () {
        let that = this
        that.$post(that.$uri.system.logGet, {}).then(res => {
          this.sysLogInfo = res
        })
      },
      /* 修改日志参数弹窗 */
      sysLogChangePop (item) {
        this.sysLogChangeInfo = {...this.sysLogInfo.data}
        this.logItem = item
        this.logChangePopShow = true
      },
      /* 修改日志参数 */
      sysLogChange () {
        let that = this
        that.$post(that.$uri.system.logSave, that.sysLogChangeInfo).then(res => {
          that.$message.success("修改成功")
          that.logChangePopShow = false
          that.getSysLogParam()
        })
      },
      /* 获取系统参数列表 */
      getSystemParamList () {
        let that = this
        that.$post(that.$uri.system.paramList, {}).then(res => {
          let a = {}
          let b = {}
          res.list.forEach(v => {
            a[v.paramName] = v.paramValue
            b[v.paramName] = v.id
          })
          that.systemParams = a
          that.systemParamIds = b
        })
      },
      /* 获取系统版本 */
      getSystemVersion () {
        let that = this
        that.$post(that.$uri.system.paramVersion, {}).then(res => {
          that.systemVersion = res.data
        })
      },
      /* 系统升级 */
      systemUpdate() {
        this.$refs.systemUpdate.submit();
      },
      handleSuccess2 (response, file, fileList) {
        if (response.success) {
          this.systemUpdatePopShow = false
          this.systemUpdatePopShow = false
          this.systemUploadTip = false
          this.$refs.systemUpdate.clearFiles()
          this.$message.success("升级成功")
        } else {
          console.log(response)
          this.$message.error(response.message)
          this.$refs.systemUpdate.clearFiles()
        }
      },
      systemUploadPopClose () {
        if (this.systemUploadTip) {
          this.$confirm("文件正在上传中，确定关闭弹窗？", "提示", {
            confirmButtonText: '确定',
            confirmButtonClass: 'confirm-btn-blue',
            iconClass: 'el-icon-c-blue',
            cancelButtonText: '取消'
          }).then( () => {
            this.systemUpdatePopShow = false
            this.systemUploadTip = false
            this.$refs.systemUpdate.clearFiles()
          }).catch( () => {})
        } else {
          this.systemUpdatePopShow = false
          this.systemUploadTip = false
          this.$refs.systemUpdate.clearFiles()
        }
      },
      engineUploadPopClose () {
        if (this.engineUploadTip) {
          this.$confirm("文件正在上传中，确定关闭弹窗？", "提示", {
            confirmButtonText: '确定',
            confirmButtonClass: 'confirm-btn-blue',
            iconClass: 'el-icon-c-blue',
            cancelButtonText: '取消'
          }).then( () => {
            this.engineUpdatePopShow = false
            this.engineUploadTip = false
            this.$refs.upload.clearFiles()
          }).catch( () => {})
        } else {
          this.engineUpdatePopShow = false
          this.engineUploadTip = false
          this.$refs.upload.clearFiles()
        }
      },
      /* 修改系统参数 */
      systemParamChange () {
        let that = this
        that.$post(that.$uri.system.paramSave, that.caseTypeChangeInfo).then(res => {
          that.$message.success("修改成功")
          that.caseTypeChangePopShow = false
          that.getSystemParamList()
        })
      },
      /* 修改机箱类型弹窗 */
      caseTypeChangePop () {
        this.caseTypeChangeInfo.id = this.systemParamIds.caseType
        this.caseTypeChangeInfo.paramName = "caseType"
        this.caseTypeChangeInfo.paramValue = this.systemParams.caseType
        this.caseTypeChangePopShow = true
      },
      /* 修改网络配置弹窗 */
      netChangePop () {
        this.netChangeInfo.ip = this.systemParams.webIp
        this.netChangeInfo.port = this.systemParams.webPort
        this.netChangeInfo.mask = this.systemParams.webMask
        this.netChangePopShow = true
      },
      /* 修改网络配置 */
      async netChange () {
        let that = this
        this.caseTypeChangeInfo.id = this.systemParamIds.webIp
        this.caseTypeChangeInfo.paramName = "webIp"
        this.caseTypeChangeInfo.paramValue = this.netChangeInfo.ip
        let res1 = await that.$post(that.$uri.system.paramSave, that.caseTypeChangeInfo)
        this.caseTypeChangeInfo.id = this.systemParamIds.webPort
        this.caseTypeChangeInfo.paramName = "webPort"
        this.caseTypeChangeInfo.paramValue = this.netChangeInfo.port
        let res2 = await that.$post(that.$uri.system.paramSave, that.caseTypeChangeInfo)
        this.caseTypeChangeInfo.id = this.systemParamIds.webMask
        this.caseTypeChangeInfo.paramName = "webMask"
        this.caseTypeChangeInfo.paramValue = this.netChangeInfo.mask
        that.$post(that.$uri.system.paramSave, that.caseTypeChangeInfo).then(res => {
          that.$message.success("修改成功")
          that.netChangePopShow = false
          that.getSystemParamList()
        })
      },
      /* 修改ntp配置弹窗 */
      ntpChangePop () {
        this.ntpChangeInfo.ntpAddress = this.systemParams.ntpAddress
        this.ntpChangePopShow = true
      },
      /* 修改ntp配置 */
      ntpChange () {
        let that = this
        if (!/^(?=^.{3,255}$)[a-z0-9][-a-z0-9]{0,62}(\.[a-z0-9][-a-z0-9]{0,62})+(\.[a-z]{2,3})$/.test(this.ntpChangeInfo.ntpAddress)
          && !/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(this.ntpChangeInfo.ntpAddress)) {
          that.$message.error("请输入正确的ip或域名")
          return
        }
        this.caseTypeChangeInfo.id = this.systemParamIds.ntpAddress
        this.caseTypeChangeInfo.paramName = "ntpAddress"
        this.caseTypeChangeInfo.paramValue = this.ntpChangeInfo.ntpAddress
        that.$post(that.$uri.system.paramSave, that.caseTypeChangeInfo).then(res => {
          that.$message.success("修改成功")
          that.ntpChangePopShow = false
          that.getSystemParamList()
        })
      },
      /* 修改公网配置弹窗 */
      netIpChangePop () {
        this.netIpChangeInfo.extranetIp = this.systemParams.extranetIp
        this.netIpChangePopShow = true
      },
      /* 修改公网配置 */
      netIpChange () {
        let that = this
        if (!/^(?=^.{3,255}$)[a-z0-9][-a-z0-9]{0,62}(\.[a-z0-9][-a-z0-9]{0,62})+(\.[a-z]{2,3})(:\d{2,6})?$/.test(this.netIpChangeInfo.extranetIp)
          && !/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(:\d{2,6})?$/.test(this.netIpChangeInfo.extranetIp)) {
          that.$message.error("请输入正确的ip或域名")
          return
        }
        this.caseTypeChangeInfo.id = this.systemParamIds.extranetIp
        this.caseTypeChangeInfo.paramName = "extranetIp"
        this.caseTypeChangeInfo.paramValue = this.netIpChangeInfo.extranetIp
        that.$post(that.$uri.system.paramSave, that.caseTypeChangeInfo).then(res => {
          if (res.success) {
            that.$message.success("修改成功")
            that.netIpChangePopShow = false
            that.getSystemParamList()
            that.$store.commit(that.$mutation.OREKI_IP, that.netIpChangeInfo.extranetIp)
          }
        })
      },
      /* 修改推流配置弹窗 */
      rateChangePop () {
        this.rateChangeInfo.encodeRateMax = this.systemParams.encodeRateMax
        this.rateChangePopShow = true
      },
      /* 修改推流配置 */
      rateChange () {
        let that = this
        let rate = parseInt(this.rateChangeInfo.encodeRateMax)
        if (!/^[0-9]+$/.test(this.rateChangeInfo.encodeRateMax) || (rate < 1000 || rate > 6000)) {
          that.$message.error("请输入1000-6000的整数")
          return
        }
        this.caseTypeChangeInfo.id = this.systemParamIds.encodeRateMax
        this.caseTypeChangeInfo.paramName = "encodeRateMax"
        this.caseTypeChangeInfo.paramValue = rate
        that.$post(that.$uri.system.paramSave, that.caseTypeChangeInfo).then(res => {
          that.$message.success("修改成功")
          that.rateChangePopShow = false
          that.getSystemParamList()
        })
      },
      /* 修改设备自主安装配置弹窗 */
      appAllowChangePop () {
        this.appAllowChangeInfo.isAppAllow = this.systemParams.isAppAllow
        this.appAllowChangePopShow = true
      },
      /* 修改设备自主安装配置 */
      appAllowChange () {
        let that = this
        this.caseTypeChangeInfo.id = this.systemParamIds.isAppAllow
        this.caseTypeChangeInfo.paramName = "isAppAllow"
        this.caseTypeChangeInfo.paramValue = this.appAllowChangeInfo.isAppAllow
        that.$post(that.$uri.system.paramSave, that.caseTypeChangeInfo).then(res => {
          that.$message.success("修改成功")
          that.appAllowChangePopShow = false
          that.getSystemParamList()
        })
      },
      /* 修改推流帧率弹窗 */
      frameRateChangePop () {
        this.frameRateChangeInfo.framerate = this.systemParams.framerate
        this.frameRateChangePopShow = true
      },
      /* 修改推流帧率配置 */
      frameRateChange () {
        let that = this
        let rate = parseInt(this.frameRateChangeInfo.framerate)
        if (!/^[0-9]+$/.test(this.frameRateChangeInfo.framerate) || (rate < 1 || rate > 60)) {
          that.$message.error("请输入1-60的整数")
          return
        }
        this.caseTypeChangeInfo.id = this.systemParamIds.framerate
        this.caseTypeChangeInfo.paramName = "framerate"
        this.caseTypeChangeInfo.paramValue = rate
        that.$post(that.$uri.system.paramSave, that.caseTypeChangeInfo).then(res => {
          that.$message.success("修改成功")
          that.frameRateChangePopShow = false
          that.getSystemParamList()
        })
      },
      /* 修改推流帧率弹窗 */
      mediaServerWanChangePop () {
        this.mediaServerWanChangeInfo.mediaServerWan = this.systemParams.mediaServerWan
        this.mediaServerWanChangePopShow = true
      },
      /* 修改推流帧率配置 */
      mediaServerWanChange () {
        let that = this
        this.caseTypeChangeInfo.id = this.systemParamIds.mediaServerWan
        this.caseTypeChangeInfo.paramName = "mediaServerWan"
        this.caseTypeChangeInfo.paramValue = this.mediaServerWanChangeInfo.mediaServerWan
        that.$post(that.$uri.system.paramSave, that.caseTypeChangeInfo).then(res => {
          that.$message.success("修改成功")
          that.mediaServerWanChangePopShow = false
          that.getSystemParamList()
        })
      },
      /* 修改推流帧率弹窗 */
      mediaServerLanChangePop () {
        this.mediaServerLanChangeInfo.mediaServerLan = this.systemParams.mediaServerLan
        this.mediaServerLanChangePopShow = true
      },
      /* 修改推流帧率配置 */
      mediaServerLanChange () {
        let that = this
        this.caseTypeChangeInfo.id = this.systemParamIds.mediaServerLan
        this.caseTypeChangeInfo.paramName = "mediaServerLan"
        this.caseTypeChangeInfo.paramValue = this.mediaServerLanChangeInfo.mediaServerLan
        that.$post(that.$uri.system.paramSave, that.caseTypeChangeInfo).then(res => {
          that.$message.success("修改成功")
          that.mediaServerLanChangePopShow = false
          that.getSystemParamList()
        })
      }
    },
    created () {
      this.getEngineList()
      this.getSysLogParam()
      this.getSystemParamList()
      this.getSystemVersion()
    }
  };
</script>

<style lang="less" scoped>

  .detail-table {
    .detail-table-header {
      padding-left: 12px;
      background: #f5f6fa;
      border-bottom: 1px solid #ebeef5;
      border-left: 4px solid #6d7781;
      cursor: pointer;
      height: 38px;
      -webkit-transition: border-bottom-color 0.3s;
      transition: border-bottom-color 0.3s;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .detail-table-header-name {
        line-height: 38px;
        color: #303133;
        font-size: 13px;
        font-weight: 500;
        outline: 0;
        text-align: left;
      }
      .detail-table-setting {
        font-size: 12px;
        color: #606266;
        margin-right: 10px;
      }
    }
    .detail-table-body {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      .detail-table-body-item {
        flex-grow: 1;
        width: 40%;
        .engine-info {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          .engine-version {
            display: flex;
            flex-direction: column;
            padding: 0 10px;
            span {
              color: #333;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
  .detail-setting {
    margin-top: 20px;
    text-align: left;
  }
  .test {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
  }

</style>