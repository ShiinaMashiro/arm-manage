<template>
  <div class="dev-list">
    <div class="preview-bar" style="position: fixed; top: 130px; width: 100%; z-index: 2000;background-color: white;height: 60px;border-bottom: 1px solid #efefef">
      <div class="preview-bar-operate">
        <div style="border-right: thin solid #ddd;padding: 0 10px 0 0; margin-right: 10px">
          <el-button type="primary" size="small" v-if="$store.getters.checkChangeAuth()" @click="$router.push('/home/group/dev/manage')">增减设备</el-button>
        </div>
        <el-checkbox v-model="allChecked" @change="allCheckedChange" style="margin-right: 10px">全选</el-checkbox>
        <el-dropdown  @command="handleCommand">
            <el-button size="small">
              批量操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :disabled="!hasSelect" command="startApk">启动应用</el-dropdown-item>
            <el-dropdown-item :disabled="!hasSelect" command="stopApk">停止应用</el-dropdown-item>
            <el-dropdown-item :disabled="!hasSelect" command="reboot">重启设备</el-dropdown-item>
            <el-dropdown-item :disabled="!hasSelect" command="home">一键HOME</el-dropdown-item>
            <el-dropdown-item :disabled="!hasSelect" command="recover">恢复出厂设置</el-dropdown-item>
            <el-dropdown-item v-if="!viewMode" :disabled="!hasSelect || !snapshotComplete" command="snapshot">刷新截图</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button v-if="$isEnable($enableKey.sync)" type="info" size="small" plain :disabled="!hasSelect" style="margin-left: 10px" @click="devSync()">云机同步</el-button>
        <el-button v-if="$isEnable($enableKey.ipProxy)" type="primary" size="small" :disabled="!hasSelect" style="margin-left: 10px" @click="ipStartPop()">切换IP</el-button>
        <el-button v-if="$isEnable($enableKey.ipProxy)" type="primary" size="small" :disabled="!hasSelect" style="margin-left: 10px" @click="ipClose()">关闭IP代理</el-button>
        <el-button v-if="$isEnable($enableKey.live)" type="primary" size="small" :disabled="!hasSelect" style="margin-left: 10px" @click="liveManage()">多路直播</el-button>
        <el-button v-if="$isEnable($enableKey.remoteCamera)" type="primary" size="small" :disabled="!hasSelect" style="margin-left: 10px" @click="openLocalVideo()">本地视频导入</el-button>
      </div>

      <div class="preview-bar-operate" v-if="false">
        <div style="padding: 0 10px 0 0; margin-right: 10px">
          <el-button type="primary" size="small" @click="$router.push('/home/group/dev/manage')">增减设备</el-button>
        </div>
        <el-button type="primary" size="small"  :disabled="multipleSelection.length === 0" @click="rebootDevBatch" v-if="$store.getters.checkChangeAuth()">重启</el-button>
      </div>
      <div style="margin-right: 420px">
        <span style="font-size: 14px">切换视图：</span>
        <el-button type="text" :disabled="!viewMode" @click="changeMode(false)">预览图</el-button>
        <el-button type="text" :disabled="viewMode"  @click="changeMode(true)">列表</el-button>
      </div>
    </div>

    <div @keyup.enter="changeMode($store.state.groupDevShowMode)"  style="margin-top: 70px;text-align: left">
      <el-input size="mini" placeholder="输入云机IP/备注操作 搜索" v-model="queryParam" style="width: 320px">
        <el-button slot="append" icon="el-icon-search" @click="changeMode($store.state.groupDevShowMode)"></el-button>
      </el-input>
      <span style="font-size: 13px;margin-left: 10px">预览图缩放:</span>
      <el-select size="mini" v-model="scaleMode" placeholder="请选择" style="margin-left: 10px;width: 100px">
        <el-option label="不缩放" :value="100"></el-option>
        <el-option label="50%" :value="50"></el-option>
        <el-option label="75%" :value="75"></el-option>
        <el-option label="150%" :value="150"></el-option>
      </el-select>
      <span style="font-size: 13px;margin-left: 10px">多开窗口:</span>
      <el-select size="mini" v-model="displayMode" placeholder="请选择" style="margin-left: 10px;width: 100px">
        <el-option label="平铺" :value="0"></el-option>
        <el-option label="堆叠" :value="1"></el-option>
      </el-select>
      <span style="font-size: 13px;margin-left: 10px">截图刷新间隔:</span>
      <el-select size="mini" v-model="snapshotTime" placeholder="请选择" style="margin-left: 10px;width: 100px">
        <el-option label="不刷新" :value="0"></el-option>
        <el-option label="10秒" :value="10"></el-option>
        <el-option label="20秒" :value="20"></el-option>
        <el-option label="30秒" :value="30"></el-option>
        <el-option label="60秒" :value="60"></el-option>
      </el-select>
    </div>

    <div class="device-case-dev border-all" v-if="viewMode" style="margin-top: 20px">
      <el-table ref="multipleTable" :data="info.list" size="mini" :header-cell-style="{backgroundColor: '#efefef'}" :row-key="rowKey" @row-click="checkRow" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" header-align="center" :selectable="isCommonCard"></el-table-column>
        <el-table-column prop="id" label="ID" min-width="50px">
          <template slot-scope="scope">
            {{scope.row.cardType === 1 ? scope.row.id : "分层"}}
          </template>
        </el-table-column>
        <el-table-column prop="slotNo" label="槽位号"></el-table-column>
        <el-table-column prop="deviceIp" label="设备IP"></el-table-column>
        <el-table-column prop="deviceNo" label="设备编号"></el-table-column>
        <el-table-column prop="version" label="设备版本" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="softinstalled" label="应用安装数量"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span :style="scope.row | statusClassFilter">
            {{scope.row | statusStr}}
          </span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="disk" label="空间">
          <template slot-scope="scope">
            {{scope.row.disk}}/{{scope.row.diskSd}}
          </template>
        </el-table-column>
        <el-table-column min-width="150px" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" :disabled="scope.row.deviceStatus !== 0" @click="initDev(scope.row.deviceIp)"
                       v-if="($store.getters.checkChangeAuth() || !$store.state.isAdmin) && scope.row.cardType !== 2">恢复出厂</el-button>
            <el-button type="text" size="small" slot="reference" @click="groupDevPop(scope.row.deviceIp)"
                       v-if="$store.state.isAdmin && scope.row.cardType !== 2">分组</el-button>
            <el-button type="text" size="small" :disabled="scope.row.deviceStatus !== 0" slot="reference"
                       @click="deviceWindowOpen(scope.row.id, scope.row.deviceNo)"
                       v-if="($store.getters.checkChangeAuth() || !$store.state.isAdmin) && scope.row.cardType !== 2">控制</el-button>
            <el-button type="text" size="mini" @click="changeRemarkPop(scope.row.id, scope.row.remark)">修改备注</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="list-bottom">
        <div class="list-bottom-btn"></div>
        <el-pagination
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="page.startPage"
                :page-sizes="[20, 50, 100]"
                :page-size="page.limit"
                layout="total, sizes, prev, pager, next"
                :total="info.total">
        </el-pagination>
      </div>
      <Drawer title="设备分组" :visible.sync="groupDevPopShow" @handClick="groupDev">
      <!--<el-dialog title="设备分组" :append-to-body="true" :visible.sync="groupDevPopShow"  width="500px" top="15vh">-->
        <el-select v-model="groupInfo.groupId" placeholder="请选择">
          <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
          </el-option>
        </el-select>
       <!-- <div slot="footer" class="dialog-footer">
          <el-button @click="groupDevPopShow = false">取 消</el-button>
          <el-button type="primary" @click="groupDev">确 定</el-button>
        </div>-->
      </Drawer>
      <Drawer title="手动添加" :visible.sync="addDevicePopShow" @handClick="addDev">
      <!--<el-dialog title="手动添加" :append-to-body="true" :visible.sync="addDevicePopShow" width="500px" top="15vh">-->
        <div>
          <el-form ref="form" :model="addDevInfo" label-width="130px" label-position="left">
            <el-form-item size="mini" label="分层处理器IP">
              <el-select v-model="addDevInfo.caseId" placeholder="请选择">
                <el-option
                        v-for="item in addDevOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" label="备用处理器IP">
              <el-input v-model="addDevInfo.deviceIp"></el-input>
            </el-form-item>
            <!--<el-form-item>
              <el-button type="primary" @click="addDev">确定</el-button>
              <el-button @click="addDevicePopShow = false">取消</el-button>
            </el-form-item>-->
          </el-form>
        </div>
      </Drawer>
    </div>
    <div class="preview-main" v-else  style="margin-top: 0px;">
      <template v-for="(item, index) in info.list">
        <div :key="item.id" class="snapshot-main" :style="{'margin-right': '15px', 'margin-top': '20px', border: aaa === index ? '1px solid #409eff' : '1px solid #f6f6f6'}">
          <el-tooltip class="item" effect="dark" :content="$isEnable($enableKey.adb) ? (item.deviceIp + ' adb端口：' + adbPortFilter(item)) : item.deviceIp" placement="top-start">
          <div style="text-align: left;display: flex;flex-direction: row;justify-content: space-between;" class="snapshot-main-head">
            <el-checkbox v-model="test[index]"  @change="itemCheckedChange"
                         :style="{width: scaleMode === 50 ? '30px' : '50px'}"
                         style="flex-grow: 1;overflow: hidden; white-space: nowrap;">
                <span style="font-size: 11px;overflow: hidden;width: 100%">{{scaleMode === 50 ? item.id : (item.remark || item.id)}}</span>
            </el-checkbox>
            <span :style="item | statusClassFilter" style="padding-right: 5px;font-size: 11px;display: flex;justify-content: center;align-items: center">
              {{getStatus(item.deviceIp)}}
            </span>
          </div>
          </el-tooltip>
          <div class="snapshot-main-img" style="position: relative;" @mouseenter="mouseEnter(index)"
               @mouseleave="mouseLeave(index)">
            <div v-show="aaa === index && scaleMode !== 50" style="position: absolute;left: 0;top: 5px;z-index: 1111;display: flex;flex-direction: column;align-items: flex-start;">
              <div style="margin-bottom: 5px"><el-button type="primary" size="mini" @click="rebootOneOne(item.deviceIp)">重启云机</el-button></div>
              <div style="margin-bottom: 5px"><el-button type="primary" size="mini" @click="downloadSnapshot(index)">下载截图</el-button></div>
              <div style="margin-bottom: 5px"><el-button type="primary" size="mini" @click="showQrCode(item.deviceIp)">云机识别码</el-button></div>
              <div v-if="$isEnable($enableKey.adb)" style="margin-bottom: 5px"><el-button type="primary" size="mini" @click="adbOpt(item.deviceIp, 1)">打开ADB</el-button></div>
              <div v-if="$isEnable($enableKey.adb)" style="margin-bottom: 5px"><el-button type="primary" size="mini" @click="adbOpt(item.deviceIp, 0)">关闭ADB</el-button></div>
              <div style="margin-bottom: 5px"><el-button type="primary" size="mini" @click="changeRemarkPop(item.id, item.remark)">修改备注</el-button></div>
            </div>
            <el-popover
                    placement="right"
                    :disabled="scaleMode !== 50"
                    v-model="popover[item.deviceIp]">
              <el-image slot="reference"
                        @click="deviceWindowOpen(item.id, item.deviceNo, item.deviceIp)"
                        @mouseover="popover[item.deviceIp] = true"
                        @mouseout="popover[item.deviceIp] = false"
                        v-loading="snapshotImgLoading[item.deviceIp]"
                        element-loading-text="拼命加载中"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.8)"
                        :style="{width: imgWidth + 'px'}"
                        :src="statusImg(item.deviceStatus) || snapshotImg[item.deviceIp] || ''"
                        fit="cover"></el-image>
              <el-image
                        v-loading="snapshotImgLoading[item.deviceIp]"
                        element-loading-text="拼命加载中"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.8)"
                        style="width: 288px"
                        :src="statusImg(item.deviceStatus) || snapshotImg[item.deviceIp] || ''"
                        fit="cover"></el-image>
            </el-popover>

            <div v-if="$isEnable($enableKey.ipProxy)" style="font-size: 12px;text-align: left;padding: 0 5px;margin-top: -5px;
            height: 18px;display: flex;flex-direction: row;justify-content: flex-start;align-items: center">
              IP：{{(scaleMode === 50 ? (item.proxyIp ? '开' : '') : item.proxyIp ) || '关'}}</div>
          </div>
        </div>
      </template>
    </div>

    <Drawer :title="isApkStart ? '启动应用' : '停止应用'" :visible.sync="apkStartStopShow" @handClick="startStopApk()">
      <div>
        <el-form ref="form" size="mini" label-width="130px" label-position="left">
          <el-form-item size="mini" label="分组应用列表：">
            <!--<el-select v-model="startStopAppid" placeholder="请选择">
              <el-option
                      v-for="item in groupAppList"
                      :key="item.appId"
                      :label="item.appName + ' ' + item.versionName"
                      :value="item.appId">
              </el-option>
            </el-select>-->
          </el-form-item>
          <el-table
                  size="mini"
                  highlight-current-row
                  :data="groupAppList"
                  @current-change="handleCurrentChange"
                  style="width: 100%">
            <el-table-column
                    prop="appName"
                    label="应用名称">
            </el-table-column>
            <el-table-column
                    prop="versionName"
                    label="版本">
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </Drawer>

    <!-- 切换IP弹窗 -->
    <Drawer title="切换IP" :visible.sync="ipStartPopShow" @handClick="ipStart">
      <div style="font-size: 12px;">
        <div style="font-size: 14px;font-weight: 600">已选云机：</div>
        <div style="width: 100%;word-wrap: break-word;">{{ipStartInfo.msg}}</div>
        <br/>
        <div style="font-size: 14px;font-weight: 600">选择IP：</div>
        <div>切换方式：
          <el-radio-group v-model="ipStartInfo.method" size="mini">
            <el-radio-button :label="1">随机</el-radio-button>
            <el-radio-button :label="2">指定IP</el-radio-button>
          </el-radio-group>
        </div>
        <div v-if="ipStartInfo.method === 2">
          <el-table
                  :data="ipList"
                  size="mini"
                  highlight-current-row
                  @current-change="handleCurrentChangeIp"
                  style="width: 100%">
            <el-table-column prop="name" label="名称" ></el-table-column>
            <el-table-column prop="ip" label="IP" ></el-table-column>
            <el-table-column prop="connectionLast" label="剩余连接数" ></el-table-column>
          </el-table>
        </div>
      </div>
    </Drawer>

    <!-- 修改备注弹窗 -->
    <Drawer title="修改备注" :visible.sync="changeRemarkPopShow" @handClick="changeRemark">
      <el-form size="mini">
        <el-form-item label="云机ID：">{{changeRemarkInfo.id}}</el-form-item>
        <el-form-item label="备注名称："><el-input v-model="changeRemarkInfo.remark"></el-input></el-form-item>
      </el-form>
    </Drawer>

    <!-- 多路直播设置弹窗 -->
    <Drawer title="多路直播" :visible.sync="liveManagePopShow" @handClick="live">
      <div>
        <el-form ref="form" size="mini" label-width="160px" label-position="left">
          <el-form-item size="mini" label="媒体服务器外网地址：">
            <div v-if="!livePopInfo.mediaAddressWanSet">
              {{livePopInfo.mediaAddressWan}}
              <el-button type="text" size="mini" @click="livePopInfo.mediaAddressWanSet = true">设置</el-button></div>
            <div v-else>
              <el-input v-model="livePopInfo.mediaAddressWanNew"></el-input>
              <el-button type="primary" size="mini" @click="changeWan">确定</el-button>
              <el-button size="mini" @click="livePopInfo.mediaAddressWanSet = false">取消</el-button>
            </div>
          </el-form-item>
          <el-form-item size="mini" label="媒体服务器内网地址：">
            <div v-if="!livePopInfo.mediaAddressLanSet">
              {{livePopInfo.mediaAddressLan}}
              <el-button type="text" size="mini" @click="livePopInfo.mediaAddressLanSet = true">设置</el-button></div>
            <div v-else>
              <el-input v-model="livePopInfo.mediaAddressLanNew"></el-input>
              <el-button type="primary" size="mini" @click="changeLan">确定</el-button>
              <el-button size="mini" @click="livePopInfo.mediaAddressLanSet = false">取消</el-button>
            </div>
          </el-form-item>
          <el-form-item size="mini" label="RTMP URL地址："></el-form-item>
          <div style="width: 100%; min-height: 200px; max-height: 400px;display: flex;flex-direction: column;font-size: 12px;border: thin solid;padding: 5px;overflow-y: auto">
            <div style="display: flex;flex-direction: row;font-size: 14px">
              <div style="width: 60%;text-align: center">RTMP服务器地址</div>
              <div style="text-align: center">推流密钥</div>
            </div>
            <div v-for="(item, index) in livePopInfo.urlList"  style="display: flex;flex-direction: row"
                 :key="item.id" :style="{backgroundColor: livePopInfo.checked === index ? '#ddd' : 'white', padding: '2px'}"
                 @click="checkUrl(index)">
              <div style="width: 60%">rtmp://{{livePopInfo.mediaAddressWan}}</div>
              <div>{{item.secretKey}}</div>
            </div>
          </div>
          <div style="display: flex;flex-direction: row;padding: 10px 0">
            <el-button type="primary" size="mini" @click="createUrl">生成URL</el-button>
            <el-button type="primary" size="mini" @click="copyAddress">复制地址</el-button>
            <el-button type="primary" size="mini" @click="copyKey">复制密钥</el-button>
            <el-button type="danger" size="mini" @click="delUrl">删除URL</el-button>
          </div>
        </el-form>
      </div>
    </Drawer>

    <el-drawer
            ref="sync"
            :visible.sync="devSyncShow"
            :append-to-body="true"
            size="100%"
            direction="rtl"
            :show-close="false"
            :destroy-on-close="true"
            :before-close="handleSyncClose">
      <div slot="title" style="display: flex;flex-direction: row;justify-content: flex-start;align-items: flex-end;margin-bottom: -10px;padding-top: 10px">
        <div style="font-size: 20px;font-weight: 600;min-width: 120px;color: black;padding-right: 50px">云机同步操作</div>
        <div style="font-size: 12px;min-width: 400px">
          <div>1.同步云机数不要超过30台，否则很有可能发生卡顿情况。同步过程中发生部分云机画面延迟时，可直接操作云机。</div>
          <div style="margin-top: 5px">2.自主安装的应用会影响到同步操作，如发生不同步的情况，可直接操作云机。</div>
        </div>
        <div style="flex-grow: 1;text-align: right">
          <el-button type="primary" style="width: 80px" size="mini" @click="$refs.sync.closeDrawer()">退出同步</el-button>
        </div>
      </div>
      <DeviceSync style="border-top: thin solid #ddd" :devList="devSyncList" :deviceStatusStr="deviceStatusStr" @fail="devSyncShow = false"></DeviceSync>
    </el-drawer>

    <el-drawer
            ref="sync2"
            :visible.sync="liveSyncShow"
            :append-to-body="true"
            size="100%"
            direction="rtl"
            :show-close="false"
            :destroy-on-close="true"
            :before-close="handleLiveSyncClose">
      <div slot="title" style="display: flex;flex-direction: row;justify-content: flex-start;align-items: flex-end;margin-bottom: -10px;padding-top: 10px">
        <div style="font-size: 20px;font-weight: 600;min-width: 120px;color: black;padding-right: 50px">多路直播</div>
        <div style="font-size: 12px;min-width: 400px">
          <div v-if="liveSyncShow">RTMP URL：{{livePopInfo.mediaAddressWan + '/' + livePopInfo.urlList[livePopInfo.checked].secretKey}}</div>
          <div style="margin-top: 5px">多路直播页面拥有云机同步的功能，如果视频卡顿丢帧，请控制视频文件大小或检查网络。</div>
        </div>
        <div style="flex-grow: 1;text-align: right">
          <el-button type="primary" style="width: 80px" size="mini" @click="$refs.sync2.closeDrawer()">退出</el-button>
        </div>
      </div>
      <DeviceSync style="border-top: thin solid #ddd"
                  v-if="liveSyncShow"
                  :live="true"
                  :devList="devSyncList" :deviceStatusStr="deviceStatusStr"
                  :address="livePopInfo.mediaAddressWan"
                  :secretKey="livePopInfo.urlList[livePopInfo.checked].secretKey"
                  @fail="devSyncShow = false"></DeviceSync>
    </el-drawer>

    <el-dialog
            title="云机识别码"
            :visible.sync="qrCodeShow"
            :modal="false"
            width="400px">
            <!--<img :src="qrCodeUrl"/>-->
            <el-image v-if="qrCodeShow"
              :src="qrCodeUrl"
              fit="cover"></el-image>
            <div style="display: flex;flex-direction: column">
              <div style="display: flex;flex-direction: column">
                <div v-if="!mediaServerWan && !wanSetShow" style="color: red">
                  媒体服务器外网地址暂未设置!
                  <el-button type="text" size="mini" @click="wanSetShow = true" style="margin-left: 10px">快速设置</el-button>
                </div>
                <div v-if="wanSetShow" style="display: flex;justify-content: center;align-items: center">
                  <span>媒体服务器外网地址：</span>
                  <el-input size="mini" v-model="wanNew" style="width: 120px;margin-right: 10px"></el-input>
                  <el-button type="text" size="mini" @click="wanSet">确定</el-button>
                </div>
                <div>远程虚拟相机apk下载地址：<el-button type="text" size="mini">点击下载</el-button></div>
              </div>

            </div>
    </el-dialog>
  </div>
</template>

<script>
  import Drawer from '@/components/Drawer'
  import DeviceSync from '@/components/DeviceSync'
  import DeviceSync2 from '@/components/DeviceSync2'
export default {
  name: "GroupListDevShow",
  components: {Drawer, DeviceSync, DeviceSync2},
  data () {
    return {
      mediaServerWan: 'null',
      wanSetShow: false,
      wanId: 0,
      wanNew: '',
      arCodeIp: '',
      devSyncShow: false,
      devSyncList: [],
      apkStartStopShow: false,
      isApkStart: false,
      startStopAppid: null,
      startStopApp: null,
      groupAppList: [],
      adbPort:{},
      snapFail: require('../assets/snapfail.png'),
      snapNotUpdate: require('../assets/notupdate.png'),
      snapError: require('../assets/snaperror.png'),
      snapRestart: require('../assets/snaprestart.png'),
      snapshotImg: {},
      snapshotImgLoading: {},
      deviceStatusStr: {},
      downloadHref: '',
      filename: '',
      qrCodeShow: false,
      qrCodeUrl: '',
      aaa: -1,
      test: [],
      oprShowList: [],
      allChecked: false,
      viewMode: false, // true为列表，false为预览
      snapshotSuccess: false,
      popover: {},
      info: {
        success: false,
        list: [],
        total: 0
      },
      page: { // 分页参数
        startPage: 1,
        limit: 20
      },
      oldLimit: 20,
      multipleSelection: [], // 选中的对象列表
      groupDevPopShow: false, // 是否显示分组弹窗
      formLabelWidth: '120px',
      groupInfo: {
        groupId: '',
        deviceIp: ''
      },
      options: [],
      addDevicePopShow: false, // 显示手动添加弹窗
      addDevInfo: {
        caseId: "",
        deviceIp: ""
      },
      advancedShow: false,
      searchOptions: {
        status: [
          {
            label: "正常",
            value: 0
          }, {
            label: "未更新",
            value: 1
          }, {
            label: "应用安装中",
            value: 2
          }, {
            label: "故障",
            value: 3
          }, {
            label: "预启动",
            value: 4
          }, {
            label: "清理中",
            value: 5
          }, {
            label: "升级中",
            value: 6
          }, {
            label: "应用结束中",
            value: 7
          }
        ],
        space: [
          {
            label: "充足",
            value: 0
          }, {
            label: "不足",
            value: 1
          }
        ],
        version: []
      },
      timeoutId: 0,
      // ip
      ipStartInfo: {
        ips: [],
        proxyId: null,
        msg: '',
        method: 1,
        last: 0
      },
      ipList: [],
      ipStartPopShow: false,
      liveManagePopShow: false,
      livePopInfo: {
        mediaAddressWan: '',
        mediaAddressWanName: '',
        mediaAddressWanNew: '',
        mediaAddressWanId: -1,
        mediaAddressWanSet: false,
        mediaAddressLan: '',
        mediaAddressLanName: '',
        mediaAddressLanNew: '',
        mediaAddressLanId: -1,
        mediaAddressLanSet: false,
        urlList: [],
        checked: 0
      },
      liveSyncShow: false,
      displayMode: 0,
      scaleMode: 100,
      imgWidth: 144,
      snapshotTime: 10,
      snapshotAutoId: null,
      // remark
      changeRemarkPopShow: false,
      changeRemarkInfo: {
        id: 0,
        remark: ''
      },
      queryParam: ''
    }
  },
  computed: {
    addDevOptions () {
      return [
        {
          label: "分层处理器",
          value: 0
        }, ...this.options
      ]
    },
    hasSelect() {
      if (this.viewMode) {
        return this.multipleSelection.length > 0
      } else {
        for (let i = 0; i < this.test.length; i++) {
          if (this.test[i] === true) {
            return true
          }
        }
        return false
      }
    },
    imgUrl() {
      return this.snapshotSuccess ? '.jpg?temp=' + new Date().getTime() : ''
    },
    selectIps() {
      let ips = []
      if (this.viewMode) {
        this.multipleSelection.forEach(dev => {
          ips.push(dev.deviceIp)
        })
      } else {
        for (let i = 0; i < this.info.list.length; i++) {
          if (this.test[i] === true) {
            ips.push(this.info.list[i].deviceIp)
          }
        }
      }
      return ips
    },
    snapshotComplete() {
      let success = false
      for (let k in this.snapshotImgLoading) {
        success = success || this.snapshotImgLoading[k]
      }
      return !success
    }
  },
  watch: {
    snapshotTime() {
      this.snapshotAuto()
    },
    displayMode(n) {
      this.$store.commit(this.$mutation.DISPLAY_MODE, n)
    },
    scaleMode(n) {
      this.imgWidth = 144 * n / 100
    }
  },
  methods: {
    wanSet() {
      this.$post(this.$uri.system.paramSave, {
        id: this.wanId,
        paramName: 'mediaServerWan',
        paramValue: this.wanNew
      }).then(res => {
        if (res.success) {
          this.mediaServerWan = this.wanNew
          this.wanSetShow = false
          this.$post(this.$uri.device.qrCode, {deviceIp: this.qrCodeIp}).then(res => {
            this.qrCodeUrl = res.data
          })
        } else {
          this.$message.error('修改失败')
        }
      })
    },
    snapshotAuto() {
      if (this.snapshotAutoId) {
        clearInterval(this.snapshotAutoId)
      }
      if (this.snapshotTime > 0) {
        this.snapshotAutoId = setInterval(this.snapshotAll, this.snapshotTime * 1000)
      }
    },
    copyAddress() {
      if (!this.livePopInfo.urlList[this.livePopInfo.checked]) {
        this.$message.error('未选择URL')
        return
      }
      this.$copyText('rtmp://' + this.livePopInfo.mediaAddressWan).then(res => {
        this.$message.success("复制成功")
      }, res => {
        this.$message.error("复制失败")
      })
    },
    copyKey() {
      if (!this.livePopInfo.urlList[this.livePopInfo.checked]) {
        this.$message.error('未选择URL')
        return
      }
      this.$copyText(this.livePopInfo.urlList[this.livePopInfo.checked].secretKey).then(res => {
        this.$message.success("复制成功")
      }, res => {
        this.$message.error("复制失败")
      })
    },
    createUrl() {
      if (!this.livePopInfo.mediaAddressWan || !this.livePopInfo.mediaAddressLan) {
        this.$message.warning('请先设置媒体服务器地址')
        return
      }
      let that = this
      that.$post(that.$uri.live.add).then(res => {
        if (res.success) {
          that.$message.success('生成成功')
          that.getUrlList()
        } else {
          that.$message.error('生成失败')
        }
      })
    },
    delUrl() {
      let that = this
      that.$post(that.$uri.live.del, {id: that.livePopInfo.urlList[that.livePopInfo.checked].id}).then(res => {
        if (res.success) {
          that.$message.success('删除成功')
          that.getUrlList()
        } else {
          that.$message.error('删除失败')
        }
      })
    },
    live() {
      if (!this.livePopInfo.urlList[this.livePopInfo.checked]) {
        this.$message.error('未选择URL')
        return
      }
      let devs = []
      if (this.viewMode) {
        devs = this.multipleSelection
      } else {
        for (let i = 0; i < this.info.list.length; i++) {
          if (this.test[i] === true) {
            devs.push(this.info.list[i])
          }
        }
      }
      if (devs.length < 2) {
        this.$message.warning('请选择2台以上的设备')
        return
      }
      this.devSyncList = devs
      this.liveSyncShow = true
    },
    checkUrl(id) {
      this.livePopInfo.checked = id
    },
    changeLan() {
      this.$confirm("媒体服务器内网地址修改后，原有地址将失效并自动将RTMP服务器更换为新的地址，请及时更换直播工具的RTMP服务器地址。", "提示", {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirm-btn-blue',
        iconClass: 'el-icon-c-blue',
        cancelButtonText: '取消'
      }).then( () => {
        let that = this
        that.$post(that.$uri.system.paramSave, {
          id: that.livePopInfo.mediaAddressLanId,
          paramName: that.livePopInfo.mediaAddressLanName,
          paramValue: that.livePopInfo.mediaAddressLanNew,
        }).then(res => {
          if (res.success) {
            that.livePopInfo.mediaAddressLan = that.livePopInfo.mediaAddressLanNew
            that.livePopInfo.mediaAddressLanSet = false
          } else {
            that.$message.error('修改失败')
          }
        })
      }).catch( () => {})
    },
    changeWan() {
      this.$confirm("媒体服务器外网地址修改后，原有地址将失效并自动将RTMP服务器更换为新的地址，请及时更换直播工具的RTMP服务器地址。", "提示", {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirm-btn-blue',
        iconClass: 'el-icon-c-blue',
        cancelButtonText: '取消'
      }).then( () => {
        let that = this
        that.$post(that.$uri.system.paramSave, {
          id: that.livePopInfo.mediaAddressWanId,
          paramName: that.livePopInfo.mediaAddressWanName,
          paramValue: that.livePopInfo.mediaAddressWanNew,
        }).then(res => {
          if (res.success) {
            that.livePopInfo.mediaAddressWan = that.livePopInfo.mediaAddressWanNew
            that.livePopInfo.mediaAddressWanSet = false
          } else {
            that.$message.error('修改失败')
          }
        })
      }).catch( () => {})
    },
    handleCurrentChange(row) {
      this.startStopAppid = row.appId
      this.startStopApp = row
    },
    handleCurrentChangeIp(row) {
      this.ipStartInfo.proxyId = row.id
      this.ipStartInfo.last = row.connectionLast
    },
    handleSyncClose(done) {
      let that = this
      this.$confirm('退出同步？')
        .then(_ => {
          that.devSyncList = []
          done();
        })
        .catch(_ => {});
    },
    handleLiveSyncClose(done) {
      let that = this
      this.$confirm('确定退出？')
        .then(_ => {
          that.devSyncList = []
          done();
        })
        .catch(_ => {});
    },
    devSync() {
      let devs = []
      if (this.viewMode) {
        devs = this.multipleSelection
      } else {
        for (let i = 0; i < this.info.list.length; i++) {
          if (this.test[i] === true) {
            devs.push(this.info.list[i])
          }
        }
      }
      if (devs.length < 2) {
        this.$message.warning('请选择2台以上的设备')
        return
      }
      this.devSyncList = devs
      this.devSyncShow = true

    },
    ipStartPop() {
      let devs = []
      if (this.viewMode) {
        devs = this.multipleSelection
      } else {
        for (let i = 0; i < this.info.list.length; i++) {
          if (this.test[i] === true) {
            devs.push(this.info.list[i])
          }
        }
      }

      let ips = []
      let msgs = []
      devs.forEach(dev => {
        ips.push(dev.deviceIp)
        msgs.push(dev.id + '(' + dev.deviceIp + ')')
      })
      this.ipStartInfo.ips = ips
      this.ipStartInfo.msg = msgs.join('，')
      let that = this
      that.$post(that.$uri.ipProxy.list).then(res => {
        if (res.success) {
          let list = res.list.filter(i => {
            return i.isUsable === 1
          })
          list.sort((a, b) => {
            return b.connectionLast - a.connectionLast
          })
          that.ipList = list
        }
      })
      this.ipStartPopShow = true
    },
    ipStart() {
      console.log(this.ipStartInfo)
      if (this.ipStartInfo.method === 2 && this.ipStartInfo.ips.length > this.ipStartInfo.last) {
        this.$confirm("当前剩余连接数不足以分配所选云机，请增加ip最大连接数，或者减少选择云机。", "剩余连接数不足", {
          confirmButtonText: '关闭',
          confirmButtonClass: 'confirm-btn-red',
          iconClass: 'el-icon-c-red',
          cancelButtonText: '取消',
          showCancelButton: false
        }).then( () => {

        }).catch( () => {})
        return
      }

      let allLast = 0
      if (this.ipStartInfo.method === 1) {
        this.ipList.forEach(ip => {
          allLast += ip.connectionLast
        })
      }

      if (this.ipStartInfo.method === 1 && this.ipStartInfo.ips.length > allLast) {
        this.$confirm("当前剩余连接数不足以分配所选云机，请增加ip最大连接数，或者减少选择云机。", "剩余连接数不足", {
          confirmButtonText: '关闭',
          confirmButtonClass: 'confirm-btn-red',
          iconClass: 'el-icon-c-red',
          cancelButtonText: '取消',
          showCancelButton: false
        }).then( () => {

        }).catch( () => {})
        return
      }

      let proxyIdList = []
      if(this.ipStartInfo.method === 1) {
        this.ipList.forEach(ip => {
          for (let i = 0; i< ip.connectionLast; i++) {
            proxyIdList.push(ip.id)
          }
        })
        console.log('xxxxxxxx')
        console.log(proxyIdList)
      }

      let that = this
      let proxyId = this.ipStartInfo.proxyId
      this.ipStartInfo.ips.forEach(ip => {
        if (this.ipStartInfo.method === 1) {
          let index = Math.floor((Math.random() * proxyIdList.length))
          proxyId = proxyIdList[index]
          proxyIdList.splice(index, 1)
          console.log(proxyId)
        }
        that.$post(that.$uri.device.startProxy, {deviceIp: ip, proxyId}).then(res => {
          /*if (!res.success){
            that.$message.error(res.msg)
          }*/
        })
      })
      this.$message.success("开始切换IP...")
      this.ipStartPopShow = false
    },
    ipClose() {
      this.$confirm("确定关闭IP代理？", "提示", {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirm-btn-blue',
        iconClass: 'el-icon-c-blue',
        cancelButtonText: '取消',
      }).then( () => {
        let devs = []
        if (this.viewMode) {
          devs = this.multipleSelection
        } else {
          for (let i = 0; i < this.info.list.length; i++) {
            if (this.test[i] === true) {
              devs.push(this.info.list[i])
            }
          }
        }

        let that = this
        devs.forEach(dev => {
          that.$post(that.$uri.device.stopProxy, {deviceIp: dev.deviceIp}).then(res => {
            if (!res.success){
              that.$message.error(res.msg)
            }
          })
        })
        that.$message.success("开始关闭IP代理...")
      }).catch( () => {})

    },
    openLocalVideo() {
      console.log(this.multipleSelection)
      let ses = []
      for (let i = 0; i < this.info.list.length; i++) {
        if (this.test[i] === true) {
          ses.push(this.info.list[i])
        }
      }
      ses.forEach(dev => {
        this.deviceWindowOpen(dev.id, dev.deviceNo, dev.deviceIp)
      })
      this.$parent.selectShow = true
      this.$parent.$nextTick().then(() => {
        let localId = new Date().getTime()
        this.$parent.video.id = localId
        this.$parent.video.many = true
        this.$parent.video.players = []
        ses.forEach(dev => {
          this.$parent.video.players.push('ref' + dev.id)
          this.$parent.$refs['ref' + dev.id][0].localId = localId
        })
        let index = this.$store.state.deviceWindowMode.length + this.$store.state.videoInfo.length + this.$store.state.cameraInfo.length
        this.$parent.video.left = 288 * (index % Math.floor(document.documentElement.clientWidth / 288))
        this.$parent.video.top = 80 * Math.floor(index / Math.floor(document.documentElement.clientWidth / 288))
        document.getElementById('selectFile').click()
      })
    },
    liveManage () {
      let that = this
      that.$post(that.$uri.system.paramGet, {paramName: 'mediaServerLan'}).then(res => {
        if (res.success) {
          that.livePopInfo.mediaAddressLanId = res.data.id
          that.livePopInfo.mediaAddressLan = res.data.paramValue
          that.livePopInfo.mediaAddressLanName = res.data.paramName
        }
      })

      that.$post(that.$uri.system.paramGet, {paramName: 'mediaServerWan'}).then(res => {
        if (res.success) {
          that.livePopInfo.mediaAddressWanId = res.data.id
          that.livePopInfo.mediaAddressWan = res.data.paramValue
          that.livePopInfo.mediaAddressWanName = res.data.paramName
        }
      })

      this.getUrlList()
      that.liveManagePopShow = true

    },
    getUrlList() {
      let that = this
      that.$post(that.$uri.live.list).then(res => {
        if (res.success) {
          that.livePopInfo.urlList = res.list
        }
      })
    },
    getGroupAppList() {
      let that = this
      that.$post(that.$uri.apk.apkList, {
        apkStatus: 1,
        groupId: that.$store.state.groupInfo.id
      }).then(res => {
        that.groupAppList = res.list
      })
    },
    startStopApk() {
      if (!this.startStopAppid) {
        this.$message.warning('请选择应用')
        return
      }

      if (!this.startStopApp.activity) {
        this.$confirm("您选择的应用（" + this.startStopApp.appName + "）在上传后无法识别类名，无法一键启动，需要补充类名后进行？", "提示", {
          confirmButtonText: '去补充',
          confirmButtonClass: 'confirm-btn-blue',
          iconClass: 'el-icon-c-blue',
          cancelButtonText: '取消',
        }).then( () => {
          this.$store.commit(this.$mutation.APP_DETAIL, this.startStopApp)
          this.$router.push("/home/app/detail")
        })
        return
      }

      let uri = this.isApkStart ? this.$uri.device.startApp  : this.$uri.device.stopApp
      let that = this
      that.$post(uri, {
        deviceIps: that.selectIps,
        appId: that.startStopAppid
      }).then(res => {
        if (res.success) {
          that.$message.success(that.isApkStart ? '启动应用成功' : '停止应用成功')
          that.apkStartStopShow = false
        } else {
          that.$message.error(that.isApkStart ? '启动应用失败' : '停止应用失败')
        }
      })
    },
    handleCommand(command) {
      console.log(command)
      switch (command) {
        case 'reboot': this.rebootOne(); break
        case 'home': this.homeOne(); break
        case 'recover': this.recoverOne(); break
        case 'snapshot': this.snapshotOne(); break
        case 'startApk':
          this.apkStartStopShow = true
          this.getGroupAppList()
          this.isApkStart = true
          break
        case 'stopApk':
          this.apkStartStopShow = true
          this.getGroupAppList()
          this.isApkStart = false
          break
      }
    },
    adbOpt(deviceIp, on) {
      let that = this
      that.$post(that.$uri.device.turnAdb, {deviceIp, on}).then(res => {
        if (res.success) {
          that.$message.success((on === 1 ? '开启' : '关闭') + '成功！')
        } else {
          that.$message.error((on === 1 ? '开启' : '关闭') + '失败！' + res.message)
        }
      })
    },
    changeRemarkPop(id, remark) {
      this.changeRemarkInfo.id = id
      this.changeRemarkInfo.remark = remark
      this.changeRemarkPopShow = true
    },
    changeRemark() {
      let that = this
      that.changeRemarkInfo.remark = that.changeRemarkInfo.remark.trim()
      if (that.changeRemarkInfo.remark.length > 10) {
        that.$message.warning('备注不能超过10个字')
        return
      }
      that.$post(that.$uri.device.changeRemark, that.changeRemarkInfo).then(res => {
        if (res.success) {
          that.$message.success('修改成功')
          that.changeRemarkPopShow = false
          that.changeMode(that.$store.state.groupDevShowMode)
        } else {
          that.$message.error('修改失败')
        }
      })
    },
    statusImg(status) {
      return status === 1 ? this.snapNotUpdate :
        (status === 3 ? this.snapError : null)
    },
    downloadSnapshot(index) {
      let that = this
      that.$post(that.$uri.device.snapshot, {deviceIp: [that.info.list[index].deviceIp], isSave: 1}).then(res => {
        if (res.success) {
          that.downloadHref = '/snapshot/' + that.info.list[index].deviceNo + '.png?temp=' + Math.random()
          that.filename = that.info.list[index].deviceNo + '.png'
          let a = document.createElement('a')
          a.href = that.downloadHref
          a.download = that.filename
          a.click()
        }
      })
    },
    showQrCode(ip) {
      let that = this
      this.qrCodeIp = ip
      that.$post(that.$uri.device.qrCode, {deviceIp: ip}).then(res => {
        that.qrCodeUrl = res.data
        that.qrCodeShow = true
      })

      that.$post(that.$uri.system.paramGet, {paramName: 'mediaServerWan'}).then(res => {
        if (res.success) {
          that.wanId = res.data.id
          that.mediaServerWan = res.data.paramValue
          console.log(that.mediaServerWan)
        }
      })
    },
    getImgUrl(no) {
      return '/snapshot/' + no + '.jpg?temp=' + new Date().getTime()
    },
    itemCheckedChange(checked) {
      if (!checked) {
        this.allChecked = false
      }
    },
    rebootOne() {
      this.$confirm("重启设备会导致当前应用缓存丢失，是否继续？", "提示", {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirm-btn-red',
        iconClass: 'el-icon-c-red',
        cancelButtonText: '取消'
      }).then( () => {
        let that = this
        that.$post(that.$uri.device.deviceReboot, {deviceIps: that.selectIps}).then(res => {
          this.$message.success("重启完成")
        })
      }).catch( () => {})
    },
    rebootOneOne(ip) {
      this.$confirm("重启设备会导致当前应用缓存丢失，是否继续？", "提示", {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirm-btn-red',
        iconClass: 'el-icon-c-red',
        cancelButtonText: '取消'
      }).then( () => {
        let that = this
        that.$post(that.$uri.device.deviceReboot, {deviceIps: [ip]}).then(res => {
          this.$message.success("重启完成")
        })
      }).catch( () => {})
    },
    homeOne() {
      this.$confirm("所有设备返回桌面，是否继续？", "提示", {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirm-btn-red',
        iconClass: 'el-icon-c-red',
        cancelButtonText: '取消'
      }).then( () => {
        let that = this
        that.$post(that.$uri.device.backHome, {deviceIps: that.selectIps}).then(res => {
          this.$message.success("返回成功")
          setTimeout(() => {
            this.snapshotOne()
          }, 1000)

        })
      }).catch( () => {})
    },
    recoverOne() {
      this.$confirm("恢复出厂后设备的应用和数据都会被清除， 是否继续？", "提示", {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirm-btn-red',
        iconClass: 'el-icon-c-red',
        cancelButtonText: '取消'
      }).then( () => {
        let that = this
        that.selectIps.forEach(ip => {
          that.$post(that.$uri.device.deviceRestore, {deviceIp: ip}).then(res => {
            that.$message.success("恢复出厂命令已发送")
          })
        })
      }).catch( () => {})
    },
    snapshotOne() {
      let that = this
      that.snapshotSuccess = false
      that.selectIps.forEach(ip => {
        that.$set(that.snapshotImgLoading, ip, true)
        that.$post(that.$uri.device.snapshot, {deviceIp: ip, isSave: 0}).then(res => {
          if (res.success) {
            that.$set(that.snapshotImg, ip, res.data)
          }
          that.$set(that.snapshotImgLoading, ip, false)
        })
      })
    },
    snapshotAll() {
      let that = this
      that.snapshotSuccess = false
      that.info.list.forEach(d => {
        let ip = d.deviceIp
        that.$set(that.snapshotImgLoading, ip, true)
        that.$post(that.$uri.device.snapshot, {deviceIp: ip, isSave: 0}).then(res => {
          if (res.success) {
            that.$set(that.snapshotImg, ip, res.data)
          }
          that.$set(that.snapshotImgLoading, ip, false)
        })
      })
    },
    getStatus(ip) {
      let name = this.deviceStatusStr[ip]
      if (this.scaleMode === 50 && name.length > 2) {
        return ''
      }
      return name
    },
    mouseEnter(index) {
      this.aaa = index
    },
    mouseLeave(index) {
      this.aaa = -1
    },
    /* 切换视图模式 */
    changeMode(mode) {
      this.snapshotSuccess = false
      this.viewMode = mode
      this.$store.commit(this.$mutation.GROUP_DEV_SHOW_MODE, mode)
      if (!this.viewMode) {
        this.allChecked = false
        this.oldLimit = this.page.limit
        let p = {
          limit: 1000,
          startPage: 1
        }
        let that = this
        that.$post(that.$uri.device.deviceList, {...p, groupId: that.$store.state.groupInfo.id, queryParam: that.queryParam}).then(res => {
          that.info = res
          that.test = []
          that.info.list.forEach(v => {
            that.popover[v.deviceIp] = false
            if (that.adbPort[v.caseNo] == null) {
              that.adbPort[v.caseNo] = 0
              that.$post(that.$uri.device.caseInfoByCaseNo, {caseNo: v.caseNo}).then(res => {
                if (res.success) {
                  that.adbPort[v.caseNo] = res.data.adbPort
                } else {
                  that.adbPort[v.caseNo] = null
                }
              })
            }

            that.test.push(false)
            that.oprShowList.push(false)
            that.deviceStatusStr[v.deviceIp] = that.statusStrM(v)

            that.$post(that.$uri.device.snapshot, {deviceIp: v.deviceIp, isSave: 0}).then(res => {
              if (res.success) {
                that.$set(that.snapshotImg, v.deviceIp, res.data)
              }
            })
          })
        })
      } else {
        // this.page.limit = this.oldLimit
        this.getDeviceList()
      }
    },
    allCheckedChange(checked) {
      if (!this.viewMode) {
        for (let i = 0; i < this.test.length; i++) {
          this.test.splice(i, 1, checked)
        }
      } else {
        this.$refs.multipleTable.toggleAllSelection()
      }
    },
    /* 表单击行事件 */
    checkRow(r, c ,e) {
      this.$refs.multipleTable.toggleRowSelection(r)
    },
    /* 获取设备列表 */
    getDeviceList () {
      let that = this
      that.$post(that.$uri.device.deviceList, {...that.page, groupId: that.$store.state.groupInfo.id, queryParam: that.queryParam}).then(res => {
        that.$set(this, 'info', res)
        // that.info = res
        console.log(res)
        that.test = []
        that.info.list.forEach(v => {
          that.test.push(false)
          that.oprShowList.push(false)
          // that.snapshotImg[v.deviceIp] = ''
          that.deviceStatusStr[v.deviceIp] = that.statusStrM(v)
        })
      })
    },
    /* 获取设备列表 */
    getDeviceList2Refresh () {
      let that = this
      let p = this.page
      if (!this.viewMode) {
        p = {
          limit: 1000,
          startPage: 1
        }
      }
      that.$post(that.$uri.device.deviceList, {...p, groupId: that.$store.state.groupInfo.id, queryParam: that.queryParam}).then(res => {
        that.info.list.forEach(v => {
          res.list.forEach(i => {
            if (v.id === i.id) {
              v.deviceStatus = i.deviceStatus
              v.isFlow = i.isFlow
              v.proxyIp = i.proxyIp
            }
            if (v.id === i.id && v.deviceStatus === 1 && i.deviceStatus !== 1) {
              setTimeout(() => {
                that.$post(that.$uri.device.snapshot, {deviceIp: v.deviceIp, isSave: 0}).then(res => {
                  if (res.success) {
                    that.$set(that.snapshotImg, v.deviceIp, res.data)
                  }
                })
              }, 1000)
            }
          })
        })
        res.list.forEach(i => {
            that.$set(that.deviceStatusStr, i.deviceIp, that.statusStrM(i))
        })
      })
    },
    /* 推流 */
    /*
    h5Test (deviceNo) {
      let tempwindow = window.open()
      tempwindow.location = this.$store.getters.h5TestUrl(deviceNo)
    },
    */
    deviceWindowOpen (id, deviceNo, ip) {
      if (!this.$isEnable(this.$enableKey.flowSync) && this.$store.state.deviceWindowMode.length > 0) {
        return
      }

      let hasSign = false
      this.$store.state.deviceWindowMode.forEach(mode => {
        if (id === mode.id) {
          hasSign = true
        }
      })
      if (hasSign) {
        this.$message.warning('当前云机的推流窗口已打开')
        return
      }
      this.$store.commit(this.$mutation.DEVICE_WINDOW_SHOW_MODE, {
        show: true,
        mode: {
          show: true,
          id,
          deviceNo,
          ip: ip
        }
      });
    },
    isCommonCard (row, index) {
      // return row.cardType === 1
      return true
    },
    rowKey (row) {
      return row.id
    },
    /* 当前页改变 */
    currentChangeHandle (val) {
      this.page.startPage = val
      this.getDeviceList()
    },
    /* 每页条数改变 */
    sizeChangeHandle (val) {
      this.page.limit = val
      this.getDeviceList()
    },
    /* 获取选中的数据 */
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    /* 删除设备 */
    async deleteDev (deviceIp) {
      let that = this
      await that.$post(that.$uri.device.deviceDelete, {deviceIp})
    },
    /* 批量删除设备 */
    deleteDevBatch () {
      this.$confirm("删除设备会导致设备恢复出厂设置，清除数据，是否继续？", "提示", {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirm-btn-red',
        iconClass: 'el-icon-c-red',
        cancelButtonText: '取消'
      }).then( () => {
        let deviceIps = []
        this.multipleSelection.forEach(v => {
          deviceIps.push(v.deviceIp)
        })
        let that = this
        that.$post(that.$uri.device.deviceDelete, {deviceIps}).then(res => {
          this.$message.success("删除完成")
          this.getDeviceList()
        })
      }).catch( () => {})
    },
    /* 设备重启 */
    async rebootDev (deviceIp) {
      let that = this
      await that.$post(that.$uri.device.deviceReboot, {deviceIp})
    },
    /* 设备批量重启 */
    rebootDevBatch () {
      this.$confirm("重启设备会导致当前应用缓存丢失，是否继续？", "提示", {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirm-btn-red',
        iconClass: 'el-icon-c-red',
        cancelButtonText: '取消'
      }).then( () => {
        let deviceIps = []
        this.multipleSelection.forEach(v => {
          deviceIps.push(v.deviceIp)
        })
        let that = this
        that.$post(that.$uri.device.deviceReboot, {deviceIps}).then(res => {
          this.$message.success("重启完成")
          this.getDeviceList()
        })
      }).catch( () => {})
    },
    /* 恢复出厂设置 */
    initDev (deviceIp) {
      this.$confirm("恢复出厂后设备的应用和数据都会被清除， 是否继续？", "提示", {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirm-btn-red',
        iconClass: 'el-icon-c-red',
        cancelButtonText: '取消'
      }).then( () => {
        let that = this
        that.$post(that.$uri.device.deviceRestore, {deviceIp}).then(res => {
          that.$message.success("恢复出厂设置成功")
        })
      }).catch( () => {})
    },
    /* 设备回收 */
    recoverDev (deviceIp) {
      let that = this
      that.$post(that.$uri.device.deviceRecover, {deviceIp}).then(res => {
        that.$message.success("回收成功")
      })
    },
    /* 获得分组信息 */
    getGroupList () {
      let that = this
      that.$post(that.$uri.group.list, {}).then(res => {
        let options = []
        res.list.forEach(v => {
          options.push({
            value: v.id,
            label: v.groupName
          })
        })
        this.options = options
      })
    },
    /* 设备分组 */
    groupDev () {
      let that = this
      that.$post(that.$uri.device.deviceGrouping, that.groupInfo).then(res => {
        that.$message.success("分组成功")
        this.groupDevPopShow = false
      })
    },
    /* 弹出分组弹框 */
    groupDevPop (deviceIp) {
      this.groupDevPopShow = true
      this.groupInfo.deviceIp = deviceIp
    },
    /* 获取所有引擎版本信息 */
    getEngineVersion () {
      let that = this
      that.$post(that.$uri.system.engineList, {}).then(res => {
        let list = []
        res.data.forEach(v => {
          list.push({
            label: v.engineTypeName,
            value: v.engineType
          })
        })
        that.searchOptions.version = list
      })
    },
    /* 手动添加设备 */
    addDev () {
      let that = this
      that.$post(that.$uri.device.addDevice, that.addDevInfo).then(res => {
        that.$message.success("添加成功")
        that.addDevicePopShow = false
      })
    },
    /* 10s刷新一次数据 */
    refreshDevList () {
      if (this.$route.meta.refresh) {
        this.getDeviceList2Refresh()
        this.timeoutId = setTimeout(() => {
          this.refreshDevList()
        }, 5000)
      }
    },
    statusStrM (row) {
      if (row.isFlow === 1 && row.deviceStatus === 0) return "推流中"
      switch (row.deviceStatus) {
        case 0: return "";
        case 1: return "未更新";
        case 2: return "应用安装中";
        case 3: return "故障";
        case 4: return "预启动";
        case 5: return "清理中";
        case 6: return "升级中";
        case 7: return "应用结束中";
      }
    },
    adbPortFilter (row) {
      let port = this.adbPort[row.caseNo] || 0
      let num1 = parseInt(row.slotNo.substr(0, row.slotNo.indexOf('.')))
      let num2 = parseInt(row.slotNo.substr(row.slotNo.indexOf('.') + 1))
      return port + num1 * 2 + num2
    },
    statusClass (row) {
      console.log(row.id)
      console.log(row.isFlow)
      console.log(row.deviceStatus)
      if (row.isFlow === 1 && row.deviceStatus === 0) return {color: "green"}
      switch (row.deviceStatus) {
        case 0: return {color: "#333"};
        case 3: return {color: "red"};
        default: return {color: "#eab820"}
      }
    }
  },
  filters: {
    statusStr (row) {
      if (row.isFlow === 1 && row.deviceStatus === 0) return "推流中"
      switch (row.deviceStatus) {
        case 0: return "正常";
        case 1: return "未更新";
        case 2: return "应用安装中";
        case 3: return "故障";
        case 4: return "预启动";
        case 5: return "清理中";
        case 6: return "升级中";
        case 7: return "应用结束中";
      }
    },
    statusStrPre (row) {
      if (row.isFlow === 1 && row.deviceStatus === 0) return "推流中"
      switch (row.deviceStatus) {
        case 0: return "";
        case 1: return "未更新";
        case 2: return "应用安装中";
        case 3: return "故障";
        case 4: return "预启动";
        case 5: return "清理中";
        case 6: return "升级中";
        case 7: return "应用结束中";
      }
    },
    statusClassFilter (row) {
      if (row.isFlow === 1 && row.deviceStatus === 0) return {color: "green"}
      switch (row.deviceStatus) {
        case 0: return {color: "#333"};
        case 3: return {color: "red"};
        default: return {color: "#eab820"}
      }
    }
  },
  mounted () {
    this.displayMode = this.$store.state.displayMode
    this.changeMode(this.$store.state.groupDevShowMode)
    this.getGroupList()
    this.getEngineVersion()
    this.refreshDevList()
    this.snapshotAuto()
  },
  beforeDestroy() {
    clearTimeout(this.timeoutId)
    clearInterval(this.snapshotAutoId)
  }
};
</script>

<style lang="less" scoped>
  .dev-list {
    .preview-bar {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      .preview-bar-operate {
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
      }
      .preview-bar-cut {
        font-size: 16px;
      }
    }
    .preview-main {
      display: flex;
      flex-direction: row;
      /*justify-content: space-between;*/
      flex-wrap: wrap;
      .snapshot-main {
        /*border: 1px solid #f6f6f6;*/
        background-color: #f6f6f6;

        border-radius: 0px;
        .snapshot-main-head {
          padding: 0 5px;
          width: 100%;
        }
        .snapshot-main-img {

        }
      }
      #snapshot-main :hover {
        border: 1px solid #409eff;
        border-radius: 6px;
      }
    }
    .preview-main :after {
      content: '';
      /*width: 200px;*/
    }
    .dev-list-search {
      width: 100%;
      display: flex;
      flex-direction: column;
      .search-btn {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .search-advanced {
        display: flex;
        flex-direction: column;
        .search-main {
          margin-top: 10px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          flex-wrap: wrap;
          .search-main-item {
            width: 24%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            /*flex-grow: 1;*/
            padding: 5px 10px;
            span {
              font-size: 12px;
            }
            .item-input {
              width: 180px;
            }
          }
        }
        .search-btn {
          padding: 0 10px;
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          align-items: center;
        }
      }
    }
    .device-case-dev {
      margin-top: 10px;
      .list-bottom {
        padding: 10px 8px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .list-bottom-btn {
          display: flex;
          flex-direction: row;
        }
      }
    }
  }
</style>
