<template>
  <div style="padding-bottom: 40px">
    <div class="info-view">
      <div class="info-view-title">设备引擎升级</div>
      <div class="info-view-main">
        <span class="info-view-item" style="font-size: 12px">检查当前版本并对设备引擎进行升级</span>

        <div class="info-view-item" style="align-items: flex-start;height: auto">
          <span style="height: 30px;line-height: 30px">当前引擎版本：</span>
          <div style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start">
            <div style="display: flex;flex-direction: column;align-items: flex-start;">
              <template v-for="(item, index) in engineList">
                <span :key="index" style="height: 30px;display: flex;align-items: center">{{item.engineTypeName}} - {{item.versionCode}}</span>
              </template>
            </div>
          </div>
        </div>

        <div class="info-view-item-btn">
          <el-button size="small" type="primary" @click="engineUpdatePopShow = true" v-if="$store.getters.checkChangeAuth()">引擎升级</el-button>
          <el-button size="small" type="primary" @click="checkVersion()" v-if="$store.getters.checkChangeAuth()">版本检查</el-button>
          <el-button size="small" type="primary" @click="engineUpdateRecordPop">升级记录</el-button>
        </div>
      </div>
    </div>

    <div class="info-view">
      <div class="info-view-title">设备引擎版本管理</div>
      <div class="info-view-main">
        <span class="info-view-item" style="font-size: 12px">设备引擎版本对应的引擎版本</span>
        <div class="info-view-item" style="align-items: flex-start;height: auto">
          <span style="height: 30px;line-height: 30px">当前版本编码：</span>
          <div style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start">
            <div v-for="(version, index) in engineVersionList" :key="index" style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;height: 30px">
              <span v-if="!enginePopShow">{{'引擎编码：' + version.code + '   引擎版本：' + version.content}}</span>
              <div v-else style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                引擎编码：<el-input :disabled="true" size="mini" v-model="engineVersionList[index].code" style="width: 80px;margin-right: 10px"></el-input>
                引擎版本：<el-input size="mini" v-model="engineVersionList[index].content" style="width: 80px"></el-input>
                <i v-if="engineVersionAddList.length === 0 && (index + 1) === engineVersionList.length" class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="versionAddList()">&#xe631;</i>
                <i class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="versionDelList(index)">&#xe630;</i>
              </div>
            </div>
            <div v-for="(version, index) in engineVersionAddList" style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;height: 30px">
              <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                 引擎编码：<el-input size="mini" v-model="version.code" style="width: 80px;margin-right: 10px"></el-input>
                 引擎版本：<el-input size="mini" v-model="version.content" style="width: 80px;"></el-input>
                <i v-if="engineVersionAddList.length === (index + 1)" class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="versionAddList()">&#xe631;</i>
                <i class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="versionAddDelList(index)">&#xe630;</i>
              </div>
            </div>
          </div>
        </div>
        <div class="info-view-item-btn">
          <el-button size="small" type="primary" v-if="!enginePopShow && $store.getters.checkChangeAuth()" @click="enginePopShow = true">设置</el-button>
          <el-button size="small" type="primary" v-if="enginePopShow" @click="versionAdd()">完成</el-button>
          <el-button size="small" type="info" v-if="enginePopShow" @click="versionAddCancel()">取消</el-button>
        </div>
      </div>
    </div>

    <div class="info-view">
      <div class="info-view-title">数据库备份恢复</div>
      <div class="info-view-main">
        <span class="info-view-item" style="font-size: 12px">备份数据库文件，并从数据库文件中恢复</span>
        <span class="info-view-item" style="font-size: 12px">当前数据库版本：{{systemVersion}}</span>
        <div class="info-view-item-btn">
          <el-button size="small" type="primary" v-if="$store.getters.checkChangeAuth()" @click="backupDatabase">备份</el-button>
          <el-button size="small" type="primary" v-if="$store.getters.checkChangeAuth()" @click="recoverDatabasePop">从数据库文件恢复</el-button>
        </div>
      </div>
    </div>

    <div class="info-view">
      <div class="info-view-title">管理系统升级</div>
      <div class="info-view-main">
        <span class="info-view-item" style="font-size: 12px">检查当前版本并对管理系统进行升级</span>
        <div class="info-view-item">
          <span>前端版本：</span>
          <span>2.0.0</span>
        </div>
        <div class="info-view-item">
          <span>后台版本：</span>
          <span>{{systemVersion}}</span>
        </div>
        <div class="info-view-item-btn">
          <el-button size="small" type="primary" @click="systemUpdatePopShow = true" v-if="$store.getters.checkChangeAuth()">升级</el-button>
        </div>
      </div>
    </div>
    <div v-if="sysInfo" class="info-view" @keyup.enter="saveSysInfo(changePopInfo)">
      <div class="info-view-title">系统网络设置</div>
      <div class="info-view-main">
        <span class="info-view-item" style="font-size: 12px">配置管理中心网络及远程相机服务网络</span>
        <div class="info-view-item">
          <span>管理中心网络IP<span v-show="changePopShow" style="color: red;">*</span>：</span>
          <span v-if="!changePopShow">{{sysInfo.webIp}}</span>
          <div v-else>
            <el-input size="mini" v-model="changePopInfo.webIp" :style="{width: '150px', border: checkInfo.webIp ? '1px solid red' : ''}"></el-input>
            <span v-show="checkInfo.webIp" style="color: red;padding-left: 10px">请输入有效的公网IP地址。</span>
          </div>
        </div>
        <div class="info-view-item">
          <span>管理中心网络端口<span v-show="changePopShow" style="color: red;">*</span>：</span>
          <span v-if="!changePopShow">{{sysInfo.webPort}}</span>
          <div v-else>
            <el-input size="mini" v-model="changePopInfo.webPort" :style="{width: '150px', border: checkInfo.webPort ? '1px solid red' : ''}"></el-input>
            <span v-show="checkInfo.webPort" style="color: red;padding-left: 10px">请输入有效的网络端口号。</span>
          </div>
        </div>
        <div class="info-view-item">
          <span>管理中心网络子网掩码<span v-show="changePopShow" style="color: red;">*</span>：</span>
          <span v-if="!changePopShow">{{sysInfo.webMask}}</span>
          <div v-else>
            <el-input size="mini" v-model="changePopInfo.webMask" :style="{width: '150px', border: checkInfo.webMask ? '1px solid red' : ''}"></el-input>
            <span v-show="checkInfo.webMask" style="color: red;padding-left: 10px">请输入有效的子网掩码。</span>
          </div>
        </div>
        <div class="info-view-item">
          <span>公网IP<span v-show="changePopShow" style="color: red;">*</span>：</span>
          <span v-if="!changePopShow">{{sysInfo.extranetIp}}</span>
          <div v-else>
            <el-input size="mini" v-model="changePopInfo.extranetIp" :style="{width: '150px', border: checkInfo.extranetIp ? '1px solid red' : ''}"></el-input>
            <span v-show="checkInfo.extranetIp" style="color: red;padding-left: 10px">请输入有效的公网IP地址。</span>
          </div>
        </div>
        <div class="info-view-item">
          <span>NTP服务器地址：</span>
          <span v-if="!changePopShow">{{sysInfo.ntpAddress}}</span>
          <el-input v-else size="mini" v-model="changePopInfo.ntpAddress" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item">
          <span>媒体服务器外网地址：</span>
          <span v-if="!changePopShow">{{sysInfo.mediaServerWan}}</span>
          <el-input v-else size="mini" v-model="changePopInfo.mediaServerWan" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item">
          <span>媒体服务器内网地址：</span>
          <span v-if="!changePopShow">{{sysInfo.mediaServerLan}}</span>
          <el-input v-else size="mini" v-model="changePopInfo.mediaServerLan" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item-btn">
          <el-button size="small" type="primary" v-if="!changePopShow && $store.getters.checkChangeAuth()" @click="changePop()">设置</el-button>
          <el-button size="small" type="primary" v-if="changePopShow" @click="saveSysInfo(changePopInfo)">保存</el-button>
          <el-button size="small" type="info" v-if="changePopShow" @click="changePopShow = false">取消</el-button>
        </div>
      </div>
    </div>
    <div v-if="sysInfo" class="info-view" @keyup.enter="saveSysInfo(changePopInfo)">
      <div class="info-view-title">默认推流参数</div>
      <div class="info-view-main">
        <span class="info-view-item" style="font-size: 12px">配置应用默认推流参数</span>
        <div class="info-view-item">
          <span>推流最小码率<span v-show="streamPopShow" style="color: red;">*</span>：</span>
          <span v-if="!streamPopShow">{{sysInfo.encodeRateMin}} kb/s<el-tooltip placement="top" style="padding: 0 5px">
            <div slot="content" style="max-width: 400px">
              调整云机推流时画面的最小码率，需输入100~8000的数字，默认为1000，必须小于等于推流最大码率。
            </div>
            <i class="el-icon-question"></i>
          </el-tooltip></span>
          <div v-else>
            <el-input size="mini" v-model="changePopInfo.encodeRateMin" :style="{width: '150px', border: checkInfo.encodeRateMin ? '1px solid red' : ''}"></el-input>
            <el-tooltip placement="top" style="padding: 0 5px">
              <div slot="content" style="max-width: 400px">
                调整云机推流时画面的最小码率，需输入100~8000的数字，默认为1000，必须小于等于推流最大码率。
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
            <span v-show="checkInfo.encodeRateMin" style="color: red;padding-left: 10px">请输入大于100并且小于推流最大码率和8000的数值。</span>
          </div>
        </div>
        <div class="info-view-item">
          <span>推流最大码率<span v-show="streamPopShow" style="color: red;">*</span>：</span>
          <span v-if="!streamPopShow">{{sysInfo.encodeRateMax}} kb/s<el-tooltip placement="top" style="padding: 0 5px">
            <div slot="content" style="max-width: 400px">
              调整云机推流时画面的最打码率，需输入1000~40000的整数，默认为2000，必须大于等于推流最小码率。
            </div>
            <i class="el-icon-question"></i>
          </el-tooltip></span>
          <div v-else>
            <el-input size="mini" v-model="changePopInfo.encodeRateMax" :style="{width: '150px', border: checkInfo.encodeRateMax ? '1px solid red' : ''}"></el-input>
            <el-tooltip placement="top" style="padding: 0 5px">
              <div slot="content" style="max-width: 400px">
                调整云机推流时画面的最打码率，需输入1000~40000的整数，默认为2000，必须大于等于推流最小码率。
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
            <span v-show="checkInfo.encodeRateMax" style="color: red;padding-left: 10px">请输入大于1000和最小推流码率并且小于40000的数值。</span>
          </div>
        </div>
        <div class="info-view-item">
          <span>推流帧率<span v-show="streamPopShow" style="color: red;">*</span>：</span>
          <span v-if="!streamPopShow">{{sysInfo.framerate}}<el-tooltip placement="top" style="padding: 0 5px">
            <div slot="content" style="max-width: 400px">
              调整云机推流时画面的帧率，需输入1-60的整数，默认为30。
            </div>
            <i class="el-icon-question"></i>
          </el-tooltip></span>
          <div v-else>
            <el-input size="mini" v-model="changePopInfo.framerate" :style="{width: '150px', border: checkInfo.framerate ? '1px solid red' : ''}"></el-input>
            <el-tooltip placement="top" style="padding: 0 5px">
              <div slot="content" style="max-width: 400px">
                调整云机推流时画面的帧率，需输入1-60的整数，默认为30。
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
            <span v-show="checkInfo.framerate" style="color: red;padding-left: 10px">请输入1-60的整数。</span>
          </div>
        </div>
        <div class="info-view-item">
          <span>摄像头上行帧率<span v-show="streamPopShow" style="color: red;">*</span>：</span>
          <span v-if="!streamPopShow">{{sysInfo.cameraUpFrameRate}}<el-tooltip placement="top" style="padding: 0 5px">
            <div slot="content" style="max-width: 400px">
              调整云机本地摄像头同步时的上行帧率，需输入1-60的整数，默认为30。
            </div>
            <i class="el-icon-question"></i>
          </el-tooltip></span>
          <div v-else>
            <el-input size="mini" v-model="changePopInfo.cameraUpFrameRate" :style="{width: '150px', border: checkInfo.cameraUpFrameRate ? '1px solid red' : ''}"></el-input>
            <el-tooltip placement="top" style="padding: 0 5px">
              <div slot="content" style="max-width: 400px">
                调整云机本地摄像头同步时的上行帧率，需输入1-60的整数，默认为30。
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
            <span v-show="checkInfo.cameraUpFrameRate" style="color: red;padding-left: 10px">请输入1-60的整数。</span>
          </div>
        </div>
        <div class="info-view-item">
          <span>摄像头上行码率<span v-show="streamPopShow" style="color: red;">*</span>：</span>
          <span v-if="!streamPopShow">{{sysInfo.cameraUpCodeRate}} kb/s<el-tooltip placement="top" style="padding: 0 5px">
            <div slot="content" style="max-width: 400px">
              调整云机本地摄像头同步时的上行码率，需输入1000~40000的整数，默认为2000。
            </div>
            <i class="el-icon-question"></i>
          </el-tooltip></span>
          <div v-else>
            <el-input size="mini" v-model="changePopInfo.cameraUpCodeRate" :style="{width: '150px', border: checkInfo.cameraUpCodeRate ? '1px solid red' : ''}"></el-input>
            <el-tooltip placement="top" style="padding: 0 5px">
              <div slot="content" style="max-width: 400px">
                调整云机本地摄像头同步时的上行码率，需输入1000~40000的整数，默认为2000。
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
            <span v-show="checkInfo.cameraUpCodeRate" style="color: red;padding-left: 10px">请输入1000~40000的整数。</span>
          </div>
        </div>
        <div class="info-view-item">
          <span>推流音频开关：</span>
          <el-switch v-if="!streamPopShow" v-model="sysInfo.isVolume" :active-value="'1'" :inactive-value="'2'"
                     :disabled="true" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          <el-switch v-else size="mini" v-model="changePopInfo.isVolume" :active-value="'1'" :inactive-value="'2'"
                     active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </div>
        <div class="info-view-item-btn">
          <el-button size="small" type="primary" v-if="!streamPopShow && $store.getters.checkChangeAuth()" @click="streamPop()">设置</el-button>
          <el-button size="small" type="primary" v-if="streamPopShow" @click="saveSysInfo(changePopInfo)">保存</el-button>
          <el-button size="small" type="info" v-if="streamPopShow" @click="streamPopShow = false">取消</el-button>
        </div>
      </div>
    </div>
    <div v-if="sysInfo" class="info-view">
      <div class="info-view-title">运维信息</div>
      <div class="info-view-main">
        <span class="info-view-item" style="font-size: 12px">配置运维邮箱和电话，接受预警信息</span>
        <div class="info-view-item" style="align-items: flex-start;height: auto">
          <span style="height: 30px;line-height: 30px">运维邮箱：</span>
          <div style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start">
            <div v-for="(email, index) in emailList" :key="index" style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;height: 30px">
              <span v-if="!emailPopShow">{{email}}</span>
              <div v-else style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                <el-input size="mini" v-model="emailList[index]" style="width: 150px"></el-input>
                <i v-if="(index + 1) === emailList.length" class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="emailAdd()">&#xe631;</i>
                <i v-if="emailList.length !== 1" class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="deleteEmail(index)">&#xe630;</i>
              </div>
            </div>
            <!--<div style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;height: 30px">
              <div v-if="emailPopShow" style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                <el-input size="mini" v-model="emailAddValue" style="width: 150px"></el-input><i class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="emailAdd()">&#xe631;</i>
              </div>
            </div>-->
          </div>
        </div>
        <div class="info-view-item-btn">
          <el-button size="small" type="primary" v-if="!emailPopShow && $store.getters.checkChangeAuth()" @click="emailPop()">设置</el-button>
          <el-button size="small" type="primary" v-if="emailPopShow" @click="emailAddSave()">保存</el-button>
          <el-button size="small" type="info" v-if="emailPopShow" @click="emailCancel()">取消</el-button>
        </div>
        <div class="info-view-item" style="align-items: flex-start;height: auto">
          <span style="height: 30px;line-height: 30px">运维电话：</span>
          <div style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start">
            <div v-for="(phone, index) in phoneList" :key="index" style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;height: 30px">
              <span v-if="!phonePopShow">{{phone}}</span>
              <div v-else style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                <el-input size="mini" v-model="phoneList[index]" style="width: 150px"></el-input>
                <i v-if="(index + 1) === phoneList.length" class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="phoneAdd()">&#xe631;</i>
                <i v-if="phoneList.length !== 1" class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="deletePhone(index)">&#xe630;</i>
              </div>
            </div>
            <!--<div style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;height: 30px">
              <div v-if="phonePopShow" style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                <el-input size="mini" v-model="phoneAddValue" style="width: 150px"></el-input><i class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="phoneAdd()">&#xe631;</i>
              </div>
            </div>-->
          </div>
        </div>
        <div class="info-view-item-btn">
          <el-button size="small" type="primary" v-if="!phonePopShow && $store.getters.checkChangeAuth()" @click="phonePop()">设置</el-button>
          <el-button size="small" type="primary" v-if="phonePopShow" @click="phoneAddSave()">保存</el-button>
          <el-button size="small" type="info" v-if="phonePopShow" @click="phoneCancel()">取消</el-button>
        </div>
      </div>
    </div>
    <div v-if="licenseInfo" class="info-view">
      <div class="info-view-title">License信息</div>
      <div class="info-view-main">
        <span class="info-view-item" style="font-size: 12px">查看和管理您的license凭证</span>
        <div class="info-view-item">
          <span>license码：</span>
          <span>{{licenseInfo.code}}</span>
        </div>
        <div class="info-view-item">
          <span>有效期：</span>
          <span>{{licenseInfo.seconds | secondsFilter}}</span>
        </div>
        <div class="info-view-item">
          <span>设备数量：</span>
          <span>{{licenseInfo.deviceNum}}</span>
        </div>
        <div class="show-item" style="text-align: left;margin-top: 10px">配套服务：</div>
        <div v-if="licenseInfo.service" style="display: flex;flex-direction: row;flex-wrap: wrap;width: 430px">
          <div class="show-item-child" v-for="(item,index) in serviceList">{{item}}<i :class="[licenseInfo.service.indexOf(index) === -1 ? 'el-icon-error' : 'el-icon-success']" :style="{color: licenseInfo.service.indexOf(index) === -1 ? 'red' : 'green'}"></i></div>
        </div>
        <div class="info-view-item-btn">
          <el-button size="small" type="primary" v-if="$store.getters.checkChangeAuth()" @click="license()">升级</el-button>
        </div>
      </div>
    </div>

    <!-- 引擎升级 -->
    <Drawer title="引擎升级" :visible.sync="engineUpdatePopShow" @handClick="submitUpload" :before-close="engineUploadPopClose">
      <div v-if="engineUpdatePopShow">
        <el-form ref="form" :model="engineUpdateExtraInfo" label-width="130px" label-position="left">
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
          <el-form-item size="mini" label="升级文件">
            <el-upload
                    class="upload-demo"
                    ref="upload"
                    :headers="$store.getters.getHeaders"
                    :action="$uri.system.engineUpdate"
                    :data="engineUpdateExtraInfo"
                    :file-list="fileList"
                    accept="apk"
                    :limit="1"
                    :multiple="false"
                    :on-change="handleChange"
                    :on-success="handleSuccess"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-upload="handleUploadEngine"
                    :on-progress="handleProgressEngine"
                    :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item size="mini" label="版本号" v-if="fileList.length">
            <el-input v-model="engineUpdateExtraInfo.versionName"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="版本序号" v-if="fileList.length">
            <el-input v-model="engineUpdateExtraInfo.versionCode"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="MD5" v-if="fileList.length">
            <el-input v-model="engineUpdateExtraInfo.md5"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </Drawer>

    <!-- 引擎升级记录 -->
    <Drawer title="升级记录" :visible.sync="engineUpdateRecordPopShow" :opt="false">
      <div v-if="engineUpdateRecordPopShow">
        <el-form ref="form" size="mini" label-width="130px" label-position="left" style="display: flex;flex-direction: column;height: 100%">
          <div style="font-size: 16px;margin-bottom: 5px;margin-top: 10px">当前引擎版本</div>
          <div style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start">
            <div style="display: flex;flex-direction: column;align-items: flex-start;font-size: 14px;color: #606266">
              <template v-for="(item, index) in engineList">
                <span :key="index" style="height: 26px;display: flex;align-items: center">{{item.engineTypeName}} - {{item.versionCode}}</span>
              </template>
            </div>
          </div>
          <div style="width: 100%;border-bottom: 1px solid #ddd;margin-top: 10px"></div>
          <div style="font-size: 16px;margin-bottom: 5px;margin-top: 10px">升级记录</div>
          <template v-for="record in updateRecordList">
            <el-form-item label="升级时间：" style="margin-bottom: 8px!important;" label-width="90px">{{record.updateTime || formatDateTime}}</el-form-item>
            <el-form-item label="升级版本：" style="margin-bottom: 8px!important;" label-width="90px">{{record.versionName}}</el-form-item>
            <el-form-item label="升级文件：" style="margin-bottom: 8px!important;" label-width="90px">{{record.fileName}}</el-form-item>
            <el-form-item label="升级详情：" style="margin-bottom: 8px!important;" label-width="90px">当前已升级{{record.upgradeNum}}路，
              未升级<span style="color: red">{{record.notUpgradeNum}}</span>路。
              <el-button type="text" size="mini" style="margin-left: 10px;display: inline" @click="engineUpdateRecordDetailPop(record)">查看详情</el-button>
            </el-form-item>
            <div style="width: 100%;border-bottom: 1px solid #ddd;margin-top: 10px"></div>
          </template>

        </el-form>
      </div>
    </Drawer>

    <!-- 引擎升级记录详情 -->
    <Drawer title="升级记录详情" :visible.sync="engineUpdateRecordDetailPopShow" :opt="false">
      <div v-if="engineUpdateRecordDetailPopShow">
        <el-form ref="form" size="mini" label-width="130px" label-position="left" style="display: flex;flex-direction: column;height: 100%">
          <el-form-item label="升级时间：" style="margin-bottom: 8px!important;" label-width="90px">{{record.updateTime || formatDateTime}}</el-form-item>
          <el-form-item label="升级版本：" style="margin-bottom: 8px!important;" label-width="90px">{{record.versionName}}</el-form-item>
          <el-form-item label="升级文件：" style="margin-bottom: 8px!important;" label-width="90px">{{record.fileName}}</el-form-item>
          <el-form-item label="升级详情：" style="margin-bottom: 8px!important;" label-width="90px">当前已升级{{record.upgradeNum}}路，
            未升级<span style="color: red">{{record.notUpgradeNum}}</span>路。
          </el-form-item>
          <div style="width: 100%;border-bottom: 1px solid #ddd;margin-top: 10px"></div>
          <div style="font-size: 16px;margin-bottom: 5px;margin-top: 10px">未升级设备</div>
          <div style="display: flex;justify-content: stretch;font-size: 14px;color: #606266">
            <div style="width: 25%">设备池ID</div>
            <div style="width: 20%">槽位号</div>
            <div style="width: 30%">设备IP</div>
            <div style="width: 25%">所属分组</div>
          </div>
          <div style="display: flex;justify-content: stretch;font-size: 14px;padding: 2px 0" v-for="detail in detailNotUpdateList">
            <div style="width: 25%">{{detail.caseNo}}</div>
            <div style="width: 20%">{{detail.slotNo}}</div>
            <div style="width: 30%">{{detail.deviceIp}}</div>
            <div style="width: 25%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis">{{detail.groupName}}</div>
          </div>
          <el-button type="text" size="mini" style="text-align: left;margin-top: 5px" @click="completeShow = !completeShow">{{completeShow ? '&#9650点击收起已升级设备列表' : '&#9660点击查看已升级设备列表'}}</el-button>
          <transition name="el-zoom-in-top">
            <div v-show="completeShow">
              <div style="font-size: 16px;margin-bottom: 5px;margin-top: 10px">已升级设备</div>
              <div style="display: flex;justify-content: stretch;font-size: 14px;color: #606266">
                <div style="width: 25%">设备池ID</div>
                <div style="width: 20%">槽位号</div>
                <div style="width: 30%">设备IP</div>
                <div style="width: 25%">所属分组</div>
              </div>
              <div style="display: flex;justify-content: stretch;font-size: 14px;padding: 2px 0" v-for="detail in detailUpdateList">
                <div style="width: 25%">{{detail.caseNo}}</div>
                <div style="width: 20%">{{detail.slotNo}}</div>
                <div style="width: 30%">{{detail.deviceIp}}</div>
                <div style="width: 25%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis">{{detail.groupName}}</div>
              </div>
            </div>
          </transition>


        </el-form>
      </div>
    </Drawer>

    <!-- 管理系统升级 -->
    <Drawer title="管理系统升级" :visible.sync="systemUpdatePopShow" @handClick="systemUpdate" :before-close="systemUploadPopClose">
    <!--<el-dialog title="管理系统升级" :append-to-body="true"
               :close-on-click-modal="false" :show-close="false" top="15vh"
               :visible.sync="systemUpdatePopShow" width="500px">-->
      <div>
        <el-form ref="form" label-width="130px" label-position="left">
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
          <!--<el-form-item>
            <el-button type="primary" :disabled="systemUploadTip" @click="systemUpdate">确定</el-button>
            <el-button @click="systemUploadPopClose">取消</el-button>
          </el-form-item>-->
        </el-form>
      </div>
    </Drawer>

    <Drawer title="数据库恢复" :visible.sync="recoverDatabasePopShow" @handClick="recoverDatabase">
      <div v-if="recoverDatabasePopShow" style="font-size: 13px">
        <div style="margin-bottom: 20px">当前管理端版本：{{systemVersion}}</div>
        <div>请选择需要恢复的数据库文件</div>
        <div style="margin: 10px 0 20px 0;color: red;font-size: 12px">不同管理端版本的数据库恢复会造成系统不稳定，当前仅支持同管理端版本数据库进行恢复。</div>
        <el-table :data="databaseBackupList" ref="databaseBackupTable" size="mini" max-height="500px" :highlight-current-row="true"
                  class="database-table"
                  @current-change="rowClickHandle" :row-class-name="rowClassName">
          <el-table-column prop="systemVersion" label="版本"></el-table-column>
          <el-table-column prop="createTime" label="备份日期" :formatter="databaseBackupDateFormat"></el-table-column>
        </el-table>
      </div>
    </Drawer>
  </div>
</template>

<script>
  import Drawer from '@/components/Drawer'
  let that
  export default {
    name: "SystemSetting",
    components: {
      Drawer
    },
    data() {
      return {
        serviceList: ['命令转发','IP代理池搭建','设备大师','虚拟定位','ADB调试','远程虚拟相机','多开远程控制窗口','电商多路直播','音视频导入云机','安全手机服务'],
        recoverDatabasePopShow: false,
        databaseBackupList: [],
        recoverId: null,
        sysInfo: null,
        checkInfo: null,
        regexMap: {
          webIp: /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/,
          webMask: /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/,
          email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
          phone: /^1\d{10}$/,
          // ntpAddress: '/^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)($|(?!\\.$)\\.)){4}$/',
          encodeRateMax: /^([1-3]\d{3,4}|[4-9]\d{3})$/,
          extranetIp: /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/,
          framerate: /^([0-5]\d|60|[1-9])$/,
          // mediaServerWan: '/^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)($|(?!\\.$)\\.)){4}$/',
          // mediaServerLan: '/^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)($|(?!\\.$)\\.)){4}$/',
          webPort: /^[0-9]{1,5}$/,
          encodeRateMin: /^([1-7][0-9]{2,3}|[89]\d{2})$/,
          cameraUpFrameRate: /^([0-5]\d|60|[1-9])$/,
          cameraUpCodeRate: /^([1-3]\d{3,4}|[4-9]\d{3})$/,
          isVolume: /^[12]$/
        },
        idInfo: null,
        changePopShow: false,
        streamPopShow: false,
        emailPopShow: false,
        emailList: [],
        emailAddValue: '',
        phonePopShow: false,
        phoneList: [],
        phoneAddValue: '',
        changePopInfo: null,
        licenseInfo: null,
        systemVersion: '',
        engineVersionList: [],
        engineVersionDelList: [],
        engineVersionAddList: [],
        enginePopShow: false,
        versionAddInfo: {
          code: '',
          content: ''
        },
        engineUpdatePopShow: false,
        engineUploadTip: false,
        engineList: [],
        engineUpdateExtraInfo: {
          engineType: "",
          versionName: "",
          versionCode: "",
          md5: ""
        },
        systemUpdatePopShow: false,
        fileList: [],
        engineUpdateRecordPopShow: false,
        updateRecordList: [],
        updateRecordDetail: [],
        engineUpdateRecordDetailPopShow: false,
        record: null,
        completeShow: false
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
        console.log("dddsdfadf")
        return list
      },
      detailUpdateList() {
        return this.updateRecordDetail.filter(d => {
          return d.isUpgrade > 0
        })
      },
      detailNotUpdateList() {
        return this.updateRecordDetail.filter(d => {
          return d.isUpgrade === 0
        })
      },
    },
    watch: {
      fileList() {
        if (this.fileList.length) {
          console.log(this.fileList[0])
          let name = this.fileList[0].name
          let s = name.lastIndexOf('_')
          let e = name.lastIndexOf('.')
          let version = name.substr(s + 1, e - s - 1)
          this.engineUpdateExtraInfo.versionCode = version
          this.engineUpdateExtraInfo.versionName = version
        }
      }
    },
    filters: {
      secondsFilter (s) {
        if (s === -1) {
          return '永久'
        }
        let time = ''
        let day = parseInt(s/(60 * 60 * 24))
        if (day > 0) {
          time += day + '天'
        }
        s = s - day * (60 * 60 * 24)
        let hour = parseInt(s/(60 * 60))
        if (hour > 0) {
          time += hour + '小时'
        }
        return time
      }
    },
    methods: {
      handleProgressSystem (event, file, fileList) {
        if (!this.systemUploadTip) {
          this.$refs.systemUpdate.abort(file)
          this.$refs.systemUpdate.clearFiles()
        }
      },
      handleUploadSystem () {
        this.systemUploadTip = true
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
            this.fileList = []
          }).catch( () => {})
        } else {
          this.engineUpdatePopShow = false
          this.engineUploadTip = false
          this.$refs.upload.clearFiles()
          this.fileList = []
        }
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
      handleProgressEngine (event, file, fileList) {
        if (!this.engineUploadTip) {
          this.$refs.upload.abort(file)
          this.$refs.upload.clearFiles()
        }
      },
      handleChange(file, fileList) {
        this.fileList = fileList
      },
      handleSuccess(response, file, fileList) {
        if (response.success) {
          this.engineUpdatePopShow = false
          this.engineUpdatePopShow = false
          this.engineUploadTip = false
          this.$refs.upload.clearFiles()
          this.fileList = []
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
      handleUploadEngine () {
        this.engineUploadTip = true
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
      engineUpdateRecordPop() {
        let that = this
        that.$post(that.$uri.system.updateRecord).then(res => {
          if (res.success) {
            that.updateRecordList = res.list
            that.engineUpdateRecordPopShow = true
          }
        })
      },
      engineUpdateRecordDetailPop(record) {
        let that = this
        that.$post(that.$uri.system.updateRecordDetail).then(res => {
          if (res.success) {
            that.updateRecordDetail = res.list
            that.record = record
            that.completeShow = false
            that.engineUpdateRecordDetailPopShow = true
          }
        })
      },
      deleteVersion(index) {
        let that = this
        this.$confirm('删除后引擎版本将无法识别，是否继续?', '提示', {
          confirmButtonText: '确定',
          confirmButtonClass: 'confirm-btn-yellow',
          iconClass: 'el-icon-c-yellow',
          cancelButtonText: '取消'
        }).then(() => {
          that.$post(that.$uri.system.engineCodeDelete, {code: that.engineVersionList[index].code}).then(res => {
            if (res.success) {
              that.$message.success("删除成功")
              that.engineVersionList.splice(index, 1)
            } else {
              that.$message.error("删除失败，错误信息：" + res.message + "，错误码：" + res.code)
            }
          })
        }).catch(() => {})
      },
      versionAddList() {
        this.engineVersionAddList.push({
          code: '',
          content: ''
        })
      },
      versionDelList(index) {
        this.engineVersionDelList.push(this.engineVersionList[index])
        this.engineVersionList.splice(index, 1)
      },
      versionAddDelList(index) {
        this.engineVersionAddList.splice(index, 1)
      },
      versionAdd () {
        let that = this
        for (let i = 0; i < this.engineVersionAddList.length; i++) {
          if (!/^[0-9]{1,4}$/.test(this.engineVersionAddList[i].code) || !/^[0-9a-zA-Z_]{1,20}$/.test(this.engineVersionAddList[i].content)) {
            that.$message.error("请按正确的格式输入参数")
            return
          }
        }

        this.engineVersionList.forEach(version => {
          that.$post(that.$uri.system.engineCodeChange, version).then(res => {
            if (res.success) {
              this.getEngineVersionList()
              this.getEngineList()
            } else {
              // that.$message.error("添加失败，错误信息：" + res.message + "，错误码： " + res.code)
            }
          })
        })

        this.engineVersionAddList.forEach(version => {
          that.$post(that.$uri.system.engineCodeAdd, version).then(res => {
            if (res.success) {
              this.getEngineVersionList()
              this.getEngineList()
            } else {
              // that.$message.error("添加失败，错误信息：" + res.message + "，错误码： " + res.code)
            }
          })
          this.engineVersionAddList = []
        })

        this.engineVersionDelList.forEach(version => {
          that.$post(that.$uri.system.engineCodeDelete, version).then(res => {
            if (res.success) {
              this.getEngineVersionList()
              this.getEngineList()
            } else {
              // that.$message.error("删除失败，错误信息：" + res.message + "，错误码： " + res.code)
            }
          })
          this.engineVersionDelList = []
        })
        this.$message.success("修改完成")
        this.enginePopShow = false
      },
      versionAddCancel() {
        this.enginePopShow = false
        this.getEngineVersionList()
        this.engineVersionAddList = []
        this.engineVersionDelList = []
      },
      backupDatabase() {
        this.$loading()
        this.$post(this.$uri.database.backup).then(res => {
          if (res.success) {
            this.$message.success('备份成功')
          } else {
            this.$message.error('备份失败')
          }
        }).finally(() => {
          this.$loading().close()
        })
      },
      recoverDatabasePop() {
        this.$post(this.$uri.database.list).then(res => {
          if (res.success) {
            this.databaseBackupList = res.list
            this.recoverDatabasePopShow = true
            this.$nextTick().then(() => {
              let res = this.databaseBackupList.filter(backup => backup.systemVersion === this.systemVersion)
              if (res.length) {
                this.recoverId = res[0].id
                this.$refs.databaseBackupTable.setCurrentRow(res[0])
              }
            })
          } else {
            this.$message.error('系统异常')
          }
        })
      },
      recoverDatabase() {
        if (!this.recoverId) {
          this.$message.error('未选择备份记录')
          return
        }
        this.$loading()
        this.$post(this.$uri.database.restore, {id: this.recoverId}).then(res => {
          if (res.success) {
            this.$message.success('恢复成功')
            this.recoverDatabasePopShow = false
          } else {
            this.$message.error('恢复失败')
          }
        }).finally(() => {
          this.$loading().close()
        })
      },
      rowClickHandle(n, o) {
        if (n.systemVersion !== this.systemVersion) {
          this.$refs.databaseBackupTable.setCurrentRow(o)
        } else {
          this.recoverId = n.id
        }
      },
      rowClassName({row}) {
        return row.systemVersion === this.systemVersion ? 'click' : 'not-click'
      },
      databaseBackupDateFormat(r, c, cv, index) {
        return this.$formatDate(new Date(r.createTime))
      },
      getEngineVersionList() {
        that.$post(that.$uri.system.engineCodeList).then(res => {
          if (res.success) {
            that.engineVersionList = res.list
          }
        })
      },
      license() {
        this.$store.commit(this.$mutation.LICENSE_UPDATE, true)
      },
      getSystemVersion() {
        that.$post(that.$uri.system.paramVersion, {}).then(res => {
          that.systemVersion = res.data
        })
      },
      getSysInfo() {
        that.$post(that.$uri.system.paramList, {}).then(res => {
          if (res.success) {
            let idInf = {}
            let paramInf = {}
            let checkInf = {}
            res.list.forEach(item => {
              idInf[item.paramName] = item.id
              paramInf[item.paramName] = item.paramValue
              checkInf[item.paramName] = false
            })
            that.sysInfo = paramInf
            that.checkInfo = checkInf
            that.idInfo = idInf
            that.emailList = that.sysInfo.email.split(',')
            that.phoneList = that.sysInfo.phone.split(',')
          }
        })
      },
      getLicenseInfo() {
        that.$post(that.$uri.system.licenseGet, {}).then(res => {
          if (res.success) {
            that.licenseInfo = res.data
          }
        })
      },
      changePop() {
        that.changePopInfo = JSON.parse(JSON.stringify(that.sysInfo))
        that.changePopShow = true
      },
      streamPop() {
        that.changePopInfo = JSON.parse(JSON.stringify(that.sysInfo))
        that.streamPopShow = true
      },
      saveSysInfo(info) {
        console.log(info)
        let sign = true
        let ps = []
        for (let key in info) {
          if (info[key] !== that.sysInfo[key]) {
            let temp = {
              id: that.idInfo[key],
              paramName: key,
              paramValue: info[key]
            }
            if (that.regexMap[temp.paramName] && !that.regexMap[temp.paramName].test(temp.paramValue)) {
              console.log(temp.paramValue)
              sign = false
              that.checkInfo[temp.paramName] = true
            } else if (key === 'encodeRateMax') {
              if (parseInt(info[key]) < parseInt(info['encodeRateMin'])) {
                console.log('max')
                console.log(info[key])
                console.log(info['encodeRateMin'])

                sign = false
                that.checkInfo[temp.paramName] = true
              }
            } else if (key === 'encodeRateMin') {
              if (parseInt(info[key]) > parseInt(info['encodeRateMax'])) {
                console.log('min')
                console.log(info[key])
                console.log(info['encodeRateMax'])
                sign = false
                that.checkInfo[temp.paramName] = true
              }
            }
            ps.push(temp)
          }
        }
        if (sign) {
          let aps = []
          ps.forEach(t => {
            aps.push(that.$post(that.$uri.system.paramSave, t))
          })
          Promise.all(aps).then().catch().finally(() => {
            that.getSysInfo()
            that.changePopShow = false
            that.streamPopShow = false
          })
        }
      },
      deleteEmail(index) {
        that.emailList.splice(index, 1)
      },
      deletePhone(index) {
        that.phoneList.splice(index, 1)
      },
      emailPop() {
        that.emailList = that.sysInfo.email.split(',')
        that.emailPopShow = true
      },
      emailAdd() {
        that.emailList.push('')
      },
      emailAddSave() {
        let check = false
        that.emailList.forEach(phone => {
          if (!that.regexMap.email.test(phone)) {
            check = true
          }
        })
        if (check) {
          that.$message.warning("请输入有效的邮箱地址")
          return
        }
        let temp = {
          id: that.idInfo.email,
          paramName: 'email',
          paramValue: that.emailList.join(',')
        }
        that.$post(that.$uri.system.paramSave, temp).then(res => {
          if (res.success) {
            that.$message.success("修改成功")
            that.getSysInfo()
            that.emailPopShow = false
          } else {
            that.$message.error("修改失败")
          }
        })
      },
      phonePop() {
        that.phoneList = that.sysInfo.phone.split(',')
        that.phonePopShow = true
      },
      phoneAdd() {
        that.phoneList.push('')
      },
      phoneCancel() {
        that.getSysInfo()
        that.phonePopShow = false
      },
      emailCancel() {
        that.getSysInfo()
        that.emailPopShow = false
      },
      phoneAddSave() {
        let check = false
        that.phoneList.forEach(phone => {
          if (!that.regexMap.phone.test(phone)) {
            check = true
          }
        })
        if (check) {
          that.$message.warning("请输入有效的手机号")
          return
        }
        let temp = {
          id: that.idInfo.phone,
          paramName: 'phone',
          paramValue: that.phoneList.join(',')
        }
        that.$post(that.$uri.system.paramSave, temp).then(res => {
          if (res.success) {
            that.$message.success("修改成功")
            that.getSysInfo()
            that.phonePopShow = false
          } else {
            that.$message.error("修改失败")
          }
        })
      }
    },
    beforeCreate() {
      that = this
    },
    mounted() {
      that.getSysInfo()
      that.getLicenseInfo()
      that.getSystemVersion()
      that.getEngineVersionList()
      that.getEngineList()
    }
  };
</script>

<style lang="less" scoped>
  .info-view {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 10px;
    border-bottom: 1px solid #E1E6EB;
    .info-view-title {
      text-align: left;
      font-size: 14px;
      font-weight: 600;
      padding: 5px 10px;
    }
    .info-view-main {
      padding: 10px 10px 10px 120px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      align-items: left;
      justify-content: flex-start;
      .info-view-item {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        padding: 2px 0;
        height: 30px;
      }
      .info-view-item-btn {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 5px 0;
      }
    }
  }

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

  .database-table /deep/ .not-click {
    background-color: #F5F7FA;
  }
  .database-table /deep/ .click {

  }

  .show-item-child {
    font-size: 12px;
    width: 140px;
    padding: 3px 30px 3px 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    i {
      font-size: 16px;
    }
  }
</style>