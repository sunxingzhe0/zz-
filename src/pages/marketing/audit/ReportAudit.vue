<template>
  <div class="video-page">
    <div class="search">
      <!-- 查询 -->
      <div style="border-bottom: 1px solid #ccc">
        <!-- <Button
          @click="statusButton(0)"
          :type="typeColor === 0 ? 'primary' : 'default'"
          style="margin-right: 10px"
          >未被举报({{ noReportTotal }})</Button
        > -->
        <Button
          @click="statusButton(1)"
          :type="typeColor === 1 ? 'primary' : 'default'"
          style="margin-right: 10px"
          >待处理({{ WaitReportTotal }})</Button
        >
        <Button
          @click="statusButton(2)"
          :type="typeColor === 2 ? 'primary' : 'default'"
          >已处理({{ endReportTotal }})</Button
        >
      </div>
      <div style="display: flex; margin-top: 20px">
        <div class="item">
          <span>视频名称：</span>
          <Input
            clearable
            style="width: 120px"
            v-model="searchForm['k:v:vedio_title']"
            placeholder="请输入视频名称"
          />
        </div>
        <div class="item">
          <span>手机号：</span>
          <Input
            clearable
            style="width: 120px"
            v-model="searchForm['e:u:phone']"
            placeholder="请输入手机号"
          />
        </div>
        <div class="item">
          <span>用户昵称：</span>
          <Input
            clearable
            style="width: 120px"
            v-model="searchForm['k:u:nickname']"
            placeholder="请输入用户昵称"
          />
        </div>
        <div class="item">
          <span>用户ID：</span>
          <Input
            clearable
            style="width: 120px"
            v-model="searchForm['e:v:uid']"
            placeholder="请输入用户ID"
          />
        </div>
        <div class="item">
          <span>排序方式：</span>
          <Select
            @on-change="sortChange"
            v-model="searchForm['o:v:vedio_id']"
            style="width: 200px"
          >
            <Option
              v-for="item in sortList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </div>
        <Button icon="ios-search" type="primary" @click="searchBtn()"
          >搜索</Button
        >
      </div>
    </div>
    <div class="table">
      <!-- 表格 -->
      <Table border :columns="videoColumns" :data="videoData">
        <!-- 封面图 -->
        <template slot-scope="{ row, index }" slot="img">
          <viewer v-for="(item, index) in row.img" :key="index">
            <img style="width: 40px; height: 40px" :src="item" />
          </viewer>
        </template>
        <!-- 举报原因 -->
        <!-- <template slot-scope="{ row, index }" slot="del_reason">
          {{ row.del_reason ? row.del_reason : "暂无数据" }}
        </template> -->
        <!-- 是否被删除 -->
        <template slot-scope="{ row, index }" slot="is_del">
          {{ row.is_del === 0 ? "未被删除" : "已被删除" }}
        </template>
        <!-- 视频类型 -->
        <template slot-scope="{ row, index }" slot="vedio_type">
          <div style="text-align: left" v-html="row.category_str">
            {{ row.category_str }}
          </div>
          <!-- <Button type="text" style="color:blue" @click="checkTypeClick(row)">查看</Button> -->
        </template>
        <!-- 举报状态 -->
        <template slot-scope="{ row, index }" slot="report_status">
          <span v-if="row.report_status === 0">未被举报</span>
          <span v-if="row.report_status === 1">待处理</span>
          <span v-if="row.report_status === 2">已处理</span>
        </template>

        <!-- 查看 -->
        <template slot-scope="{ row, index }" slot="action">
          <Button @click="detailBtn(row)" type="primary" ghost>查看</Button>
        </template>
        <!-- 操作 -->
        <!-- <template slot-scope="{ row, index }" slot="action">
          <Button
            v-if="row.status !== 1"
            type="primary"
            @click="auditStatusClick(row)"
            >{{ row.status === 0 ? "审核" : "重新审核" }}</Button>&nbsp;
          <Button type="primary" @click="preview(row)">预览</Button>
        </template> -->
      </Table>
      <!-- 分页 -->
      <div class="page">
        <Page
          :total="total"
          :current.sync="exchangeFrom.page"
          show-elevator
          show-sizer
          show-total
          @on-change="pageChange"
          @on-page-size-change="pageSizeChange"
          :page-size="exchangeFrom.limit"
        />
      </div>
    </div>
    <!-- 查看弹框 -->
    <Modal v-model="detaiActionVisible" width="860">
      <div slot="header" style="text-align: center; font-size: 18px">
        查看举报
      </div>
      <div class="topMsg">
        <p style="font-size: 15px; color: #333; margin-bottom: 20px">
          被举报用户信息
        </p>
        <Row style="margin-bottom: 20px">
          <Col span="7">用户昵称：{{ detailMsgForm.nickname }}</Col>
          <Col span="7">用户ID：{{ detailMsgForm.uid }}</Col>
        </Row>
        <Row>
          <Col span="7">手机号：{{ detailMsgForm.phone }}</Col>
          <Col span="7">被举报视频ID：{{ detailMsgForm.vedio_id }}</Col>
          <Col span="7"
            ><Button type="primary" @click="detaiVideoVisible = true"
              >预览视频</Button
            ></Col
          >
        </Row>
      </div>

      <div class="table">
        <p style="font-size: 15px; color: #333; margin-bottom: 4px">举报记录</p>
        <!-- 表格 -->
        <Table border :columns="detailColumns" :data="detailData">
          <!-- 处理举报时间 -->
          <template slot-scope="{ row, index }" slot="handling_time">
            <!-- {{row.handling_time==0?'待处理':formatDate(
                new Date(row.handling_time * 1000),
                "yyyy-MM-dd hh:mm:ss"
              )}} -->
          </template>
          <template slot-scope="{ row, index }" slot="img">
            <span v-if="row.img.length === 0">暂无图片</span>
            <viewer v-else v-for="(item, index) in row.img" :key="index">
              <img style="width: 40px; height: 40px" :src="item" />
            </viewer>
          </template>
        </Table>
        <!-- 分页 -->
        <div class="page">
          <Page
            :total="total2"
            :current.sync="exchangeFrom2.page"
            show-elevator
            show-sizer
            show-total
            @on-change="pageChange2"
            @on-page-size-change="pageSizeChange2"
            :page-size="exchangeFrom2.limit"
          />
        </div>
      </div>
      <div slot="footer" style="text-align: center">
        <p
          style="
            font-size: 15px;
            color: #333;
            margin-bottom: 20px;
            text-align: left;
          "
        >
          处理结果: <span v-if="detailMsgForm.report_status === 1">待处理</span>
          <span v-if="detailMsgForm.report_status === 2">已处理</span>
        </p>
        <Button
          type="warning"
          v-if="detailMsgForm.report_status === 1"
          @click="closeBannedClick"
          >关闭此举报</Button
        >
        <Button
          type="success"
          v-if="detailMsgForm.report_status === 1"
          @click="bannedClick"
          >删除视频并封禁用户</Button
        >
        <Button
          type="success"
          v-if="detailMsgForm.report_status === 1"
          @click="warnClick"
          >删除视频并警告</Button
        >
      </div>
      <Spin size="large" fix v-if="spinShow2"></Spin>
    </Modal>
    <!-- 预览视频弹框 -->
    <Modal
      v-model="detaiVideoVisible"
      width="500"
      :mask-closable="false"
      :closable="false"
    >
      <div slot="header" style="text-align: center; font-size: 18px">
        预览视频
      </div>
      <video-player
        v-if="flagVideo"
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions"
      >
      </video-player>
      <span v-if="!flagVideo">暂无视频播放哦~</span>
      <!-- <iframe :src="videoSrc" scrolling="no" sandbox="allow-downloads" style="width:500px;height:500px" allowfullscreen="true"></iframe> -->

      <div slot="footer" style="text-align: center">
        <Button type="success" @click="closePreview">关闭</Button>
      </div>
    </Modal>
    <!-- 封禁用户 -->
    <Modal v-model="bannedVisible" width="400">
      <div slot="header" style="text-align: center; font-size: 18px">
        封禁用户
      </div>
      <p>
        <span style="color: red">*</span> 封禁天数：<Input
          style="width: 100px"
          Number
          v-model="blocked_day"
        ></Input
        >&nbsp;天
      </p>
      <p
        style="
          margin-top: 20px;
          margin-bottom: 10px;
          font-size: 15px;
          color: #333;
        "
      >
        <span style="color: red">*</span>拒绝理由
      </p>
      <RadioGroup
        true-value
        @on-change="refuseChange"
        v-model="season"
        vertical
      >
        <p v-for="(item, index) in backList" :key="index">
          <Radio :label="item.label"></Radio>
        </p>
        <Radio label="自定义"></Radio>
      </RadioGroup>
      <Input
        v-if="definedValue"
        v-model="refuseVlue"
        type="textarea"
        :rows="4"
        placeholder=""
      />

      <div slot="footer" style="text-align: center">
        <Button type="warning" @click="bannedVisible = false">取消</Button>
        <Button type="success" @click="confirmResonValue">确认</Button>
      </div>
    </Modal>
    <!-- 警告用户 -->
    <Modal v-model="warnVisible" width="400">
      <div slot="header" style="text-align: center; font-size: 18px">
        警告用户
      </div>

      <p style="font-size: 14px; margin-bottom: 10px">
        <span style="color: red"> *</span>警告理由
      </p>

      <RadioGroup true-value @on-change="WarnChange" v-model="season2" vertical>
        <p v-for="(item, index) in backWarnList" :key="index">
          <Radio :label="item.label"></Radio>
        </p>
        <Radio label="自定义"></Radio>
      </RadioGroup>
      <Input
        v-if="definedValue2"
        v-model="refuseVlue2"
        type="textarea"
        :rows="4"
        placeholder=""
      />

      <div slot="footer" style="text-align: center">
        <Button type="warning" @click="warnVisible = false">取消</Button>
        <Button type="success" @click="confirmWarnBtn">确认</Button>
      </div>
    </Modal>
    <!-- 查看视频类型 -->
    <Modal v-model="checkTypeVisible">
      <p slot="header" style="text-align: center; cursor: pointer">
        查看视频分类
      </p>
      <div>
        <div style="display: flex">
          视频分类： <Tree :data="treeData"></Tree>
        </div>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="success" @click="checkTypeVisible = false">关闭</Button>
      </div>
    </Modal>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import {
  reportVideoApi,
  reportVideoDetailApi,
  bannedResonApi,
  bannedActionApi,
} from "@/api/audit";
import { videoSortApi } from "@/api/user";
import { refuseListApi } from "@/api/setting";
import { formatDate } from "@/common/date.js";
import Setting from "@/setting";
export default {
  components: {},
  data() {
    return {
      spinShow2: false,
      flagVideo: true,
      checkTypeVisible: false,
      treeData: [
        {
          expand: true,
          title: "parent 1",
          children: [
            {
              title: "parent 1-0",
              expand: true,
              children: [
                {
                  title: "1-0-1",
                },
                {
                  title: "1-0-2",
                },
              ],
            },
            {
              title: "parent 1-1",
              expand: true,
              children: [
                {
                  title: "1-1-1",
                },
              ],
            },
          ],
        },
      ],
      definedValue: false,
      definedValue2: false, //自定义理由输入框
      refuseVlue: "", //自定义理由
      refuseVlue2: "",
      backList: [], //封禁
      backWarnList: [], //警告
      blocked_day: "", //封禁天数
      season: "", //处理理由
      season2: "",
      typeColor: 1,
      total: 0,
      total2: 0,
      noReportTotal: 0, //统计状态信息
      WaitReportTotal: 0,
      endReportTotal: 0,
      detailID: "",
      detaiActionVisible: false, //查看弹框
      bannedVisible: false, //封禁弹框
      warnVisible: false, //警告弹框
      detaiVideoVisible: false,
      detailMsgForm: {}, //被举报用户信息
      spinShow: true, //loadding
      searchForm: {
        "k:v:vedio_title": "", //视频标题
        "e:u:phone": "", //手机号
        "e:v:uid": "", //用户ID
        "k:u:nickname": "", //昵称
        "e:v:report_status": 1, //举报状态
        "o:v:vedio_id": "DESC", //排列顺序
      },
      //分页参数
      exchangeFrom: {
        page: 1,
        limit: 10,
      },
      exchangeFrom2: {
        page: 1,
        limit: 10,
      },
      //排序方式
      sortList: [
        {
          value: "DESC",
          label: "降序",
        },
        {
          value: "ASC",
          label: "升序",
        },
      ],

      //表格
      videoColumns: [
        {
          width: 60,
          title: "序号",
          type: "index",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth: 100,
          title: "视频ID",
          key: "vedio_id",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth: 100,
          title: "视频名称",
          key: "vedio_title",
          align: "center",
          className: "table-head-style",
          render: (h, params) => {
            if (!params.row.vedio_title) return h("span", "暂无视频标题");
            else {
              return h("div", [
                h(
                  "span",
                  {
                    style: {
                      display: "inline-block",
                      width: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    },
                    domProps: { title: params.row.vedio_title },
                    on: {
                      click: (e) => {
                        e.stopPropagation();
                      },
                    },
                  },
                  params.row.vedio_title
                ),
              ]);
            }
          },
        },
        {
          minWidth: 120,
          title: "被举报用户昵称",
          key: "nickname",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth: 120,
          title: "被举报用户ID",
          key: "uid",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth: 120,
          title: "被举报用户手机号",
          key: "phone",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth: 100,
          title: "被举报次数",
          key: "report_count",
          align: "center",
          className: "table-head-style",
        },

        // {
        //   minWidth: 100,
        //   title: "举报原因",
        //   key: "del_reason",
        //   slot: "del_reason",
        //   align: "center",
        //   className: "table-head-style",
        // },
        {
          minWidth: 100,
          title: "是否被删除",
          key: "is_del",
          slot: "is_del",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth: 200,
          title: "视频类型",
          align: "center",
          slot: "vedio_type",
          className: "table-head-style",
        },
        {
          minWidth: 100,
          title: "状态",
          key: "report_status",
          align: "center",
          slot: "report_status",
          className: "table-head-style",
        },
        {
          minWidth: 160,
          title: "操作",
          slot: "action",
          align: "center",
          className: "table-head-style",
        },
      ],
      videoData: [],
      //查看表格
      detailColumns: [
        {
          title: "举报时间",
          key: "update_time",
          align: "center",
          className: "table-head-style",
          render: (h, params) => {
            return h(
              "div",
              formatDate(
                new Date(params.row.update_time * 1000),
                "yyyy-MM-dd hh:mm:ss"
              )
              // Date是后台时间戳参数字段
              // 'yyyy-MM-dd hh:mm' 对应的时间格式 2018-12-21 18:46
              // 格式可以自行修改，例如 'yyyy-MM-dd' -> 2018-12-21,  'yyyy-MM' -> 2018-12
            );
          },
        },
        {
          title: "举报原因",
          key: "reason",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "举报图片",
          key: "img",
          slot: "img",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "提交用户昵称",
          key: "nickname",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "提交用户ID",
          key: "uid",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "提交用户手机",
          key: "phone",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "处理时间",
          key: "handling_time",
          align: "center",
          className: "table-head-style",
          render: (h, params) => {
            if (params.row.handling_time === 0) return h("span", "待处理");
            else {
              return h(
                "div",
                formatDate(
                  new Date(params.row.handling_time * 1000),
                  "yyyy-MM-dd hh:mm:ss"
                )
                // Date是后台时间戳参数字段
                // 'yyyy-MM-dd hh:mm' 对应的时间格式 2018-12-21 18:46
                // 格式可以自行修改，例如 'yyyy-MM-dd' -> 2018-12-21,  'yyyy-MM' -> 2018-12
              );
            }
          },
        },
      ],
      detailData: [],
      //视频
      videoSrc: "",
      //视频
      playerOptions: {
        // playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        controls: true, //是否显示控制条
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "1:1", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            // type: "application/x-mpegURL", // 类型
            src: "", // url地址
          },
        ],
        poster: "", // 封面地址
        notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true, // 是否显示全屏按钮
        },
      },
    };
  },
  created() {
    this.getReportLis();
    this.getBannedReson(); //获取封禁理由
    this.getWarnReson(); //获取警告理由
    this.getReportWaitNum();
    this.getReportEndNum();
    if (this.playerOptions.sources[0].src === "") {
      this.flagVideo = false;
    } else {
      this.flagVideo = true;
    }
  },
  mounted() {},
  methods: {
    //获取举报视频列表
    getReportLis() {
      this.spinShow = true;
      reportVideoApi({
        ...this.exchangeFrom,
        ...this.searchForm,
      }).then((res) => {
        this.total = res.data.count;
        this.videoData = res.data.list;
        this.spinShow = false;
      });
    },
    //获取封禁理由
    getBannedReson() {
      bannedResonApi({
        status: 1,
        gid: 73,
      }).then((res) => {
        this.backList = res.data.list.map((item, index) => {
          return {
            value: item.id,
            label: item.content,
          };
        });
      });
    },
    //获取警告理由
    getWarnReson() {
      bannedResonApi({
        status: 1,
        gid: 74,
      }).then((res) => {
        this.backWarnList = res.data.list.map((item, index) => {
          return {
            value: item.id,
            label: item.content,
          };
        });
      });
    },
    //获取举报记录列表
    getDetailList(id) {
      this.spinShow2 = true;
      reportVideoDetailApi({
        "e:r:vedio_id": id,
        "o:r:id": this.searchForm["o:v:vedio_id"],
      }).then((res) => {
        this.total2 = res.data.count;
        this.detailData = res.data.list;
        this.detailData.forEach((item) => {
          item.img = item.img.map((item2) => {
            return Setting.url(item2);
          });
        });
        console.log(this.detailData, "03");
        this.spinShow2 = false;
      });
    },
    //获取视频类型
    checkTypeClick(row) {
      this.checkTypeVisible = true;
      videoSortApi({
        category: row.category,
      }).then((res) => {
        this.treeData = this.filterData(res.data);
      });
    },
    //处理数据
    filterData(data) {
      return Object.entries(data).map((val) => {
        return {
          expand: false,
          title: val[0],
          children:
            typeof val[1] === "object"
              ? this.filterData(val[1])
              : [
                  {
                    expand: true,
                    title: val[1],
                  },
                ],
        };
      });
    },
    //状态按钮事件
    statusButton(num) {
      this.searchForm["e:v:report_status"] = num;
      this.getReportButton(num);
    },
    //获取状态数据
    getReportButton(num) {
      this.typeColor = num;
      reportVideoApi({
        ...this.exchangeFrom,
        ...this.searchForm,
        "e:v:report_status": num,
      }).then((res) => {
        this.total = res.data.count;
        this.videoData = res.data.list;
        this.spinShow = false;
      });
    },

    //获取待处理举报数量
    getReportWaitNum() {
      reportVideoApi({
        "e:v:report_status": 1,
      }).then((res) => {
        this.WaitReportTotal = res.data.count;
        this.spinShow = false;
      });
    },
    //获取已处理举报数量
    getReportEndNum() {
      reportVideoApi({
        "e:v:report_status": 2,
      }).then((res) => {
        this.endReportTotal = res.data.count;
        this.spinShow = false;
      });
    },
    //排序方式change事件
    sortChange(e) {
      this.searchForm["o:v:vedio_id"] = e;
      this.getReportLis();
    },
    //搜索
    searchBtn() {
      this.getReportLis();
    },
    //查看
    detailBtn(row) {
      // this.videoSrc = row.vedio_url;
      this.playerOptions.sources[0].src = Setting.url(row.vedio_url);
      if (this.playerOptions.sources[0].src === "") {
        this.flagVideo = false;
      } else {
        this.flagVideo = true;
      }
      this.detailMsgForm = row;
      this.detailID = row.vedio_id;
      this.getDetailList(row.vedio_id);
      this.detaiActionVisible = true;
    },
    closePreview() {
      if (this.flagVideo) {
        this.$refs.videoPlayer.player.pause(); // 暂停
      }
      this.detaiVideoVisible = false;
    },
    //封禁操作
    bannedClick() {
      this.bannedVisible = true;
    },
    //封禁change
    refuseChange(e) {
      if (e === "自定义") {
        this.definedValue = true;
      } else {
        this.definedValue = false;
      }
    },
    //警告change
    WarnChange(e) {
      if (e === "自定义") {
        this.definedValue2 = true;
      } else {
        this.definedValue2 = false;
      }
    },
    //确认封禁
    confirmResonValue() {
      if (!this.blocked_day) {
        return this.$Message.warning("请输入封禁天数！");
      }
      if (!this.season) {
        return this.$Message.warning("请选择拒绝理由!");
      }
      if (this.season === "自定义" && !this.refuseVlue) {
        return this.$Message.warning("请填写自定义理由!");
      }
      let season = this.season === "自定义" ? this.refuseVlue : this.season;
      let blocked_day = this.blocked_day * 24 * 60 * 60;
      bannedActionApi({
        vedio_id: this.detailID,
        season: season,
        blocked_day: blocked_day,
        is_del: 1,
      })
        .then((res) => {
          this.$Message.success(res.msg);
          this.bannedVisible = false;
          this.detaiVideoVisible = false;
          this.detaiActionVisible = false;
          this.getReportLis();
          this.getReportWaitNum();
          this.getReportEndNum();
          this.refuseVlue = "";
          this.blocked_day = "";
          this.season = "";
        })
        .catch((err) => {
          this.$Message.warning(err.msg);
        });
    },
    //关闭此举报
    closeBannedClick() {
      bannedActionApi({
        vedio_id: this.detailID,
      })
        .then((res) => {
          this.$Message.success(res.msg);
          this.bannedVisible = false;
          this.detaiVideoVisible = false;
          this.detaiActionVisible = false;
          this.getReportLis();
          this.getReportWaitNum();
          this.getReportEndNum();
        })
        .catch((err) => {
          this.$Message.warning(err.msg);
        });
    },
    //警告
    warnClick() {
      this.warnVisible = true;
    },
    //确人警告
    confirmWarnBtn() {
      if (!this.season2) {
        return this.$Message.warning("请选择拒绝理由!");
      }
      if (this.season2 === "自定义" && !this.refuseVlue2) {
        return this.$Message.warning("请填写自定义理由!");
      }
      let season = this.season2 === "自定义" ? this.refuseVlue2 : this.season2;
      bannedActionApi({
        vedio_id: this.detailID,
        season: season,
        is_del: 1,
      })
        .then((res) => {
          this.$Message.success(res.msg);
          this.warnVisible = false;
          this.detaiVideoVisible = false;
          this.detaiActionVisible = false;
          this.getReportLis();
          this.getReportWaitNum();
          this.getReportEndNum();
          this.refuseVlue2 = "";
          this.season2 = "";
        })
        .catch((err) => {
          this.$Message.warning(err.msg);
        });
    },
    // 分页
    pageChange(index) {
      this.exchangeFrom.page = index;
      this.getReportLis();
    },
    pageSizeChange(index) {
      this.exchangeFrom.limit = index;
      this.getReportLis();
    },
    // 分页
    pageChange2(index) {
      this.exchangeFrom.page = index;
      this.getDetailList(this.detailID);
    },
    pageSizeChange2(index) {
      this.exchangeFrom.limit = index;
      this.getDetailList(this.detailID);
    },
  },
};
</script>

<style scoped>
.item {
  margin-right: 24px;
}
.search {
  background-color: #fff;
  margin: 0 0 20px 0;
  padding: 20px 10px 20px 20px;
}
.table {
  background-color: #fff;
  padding: 20px;
}
>>> .ivu-table th.table-head-style {
  background: #f2f2f2 !important;
  color: #333;
}

/deep/.ivu-select-single .ivu-select-selection {
  width: 112px;
}
/deep/.ivu-form .ivu-form-item-label {
  padding: 10px 0px 10px 0;
}
.more {
  margin-right: 20px;
}
.more:hover {
  cursor: pointer;
}
/deep/.ivu-select-default {
  width: 100px !important;
}
.page {
  text-align: right;
  padding-bottom: 40px;
}
</style>
