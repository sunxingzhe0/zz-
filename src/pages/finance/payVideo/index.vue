<template>
  <div class="search">
    <!-- 查询 -->
    <Form :model="searchForm" :label-width="80">
      <Row>
        <Col span="6">
          <FormItem label="视频单价：">
            <Input
              number
              style="width: 65px"
              type="text"
              v-model="searchForm['x_v:vedio_price']"
              placeholder="最低价"
            />——
            <Input
              number
              @on-blur="priceBlur"
              style="width: 65px"
              type="text"
              v-model="searchForm['d_v:vedio_price']"
              placeholder="最高价"
            />
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="付费人数：">
            <Select
              v-model="searchForm['p_v:pay_count']"
              style="width: 200px"
              @on-change="payPersonChange"
            >
              <Option
                v-for="item in peopleList"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem></Col
        >

        <Col span="8">
          <FormItem label="日期：">
            <DatePicker
              type="datetimerange"
              @on-change="dateChange"
              :value="datePay"
              placeholder="请选择日期"
              style="width: 280px"
            ></DatePicker>
          </FormItem>
        </Col>
        <Col span="4">
          <Button type="success" @click="clearFormBtn" style="margin: 0 20px"
            ><Icon type="ios-aperture" />&nbsp;重置</Button
          >
          <Button type="primary" icon="ios-search" @click="searchFormBtn"
            >搜索</Button
          >
        </Col>
        <!-- <div style="text-align:right;margin-right:40px;padding-bottom:20px"> -->

        <!-- </div> -->
      </Row>
    </Form>
    <div class="card">
      <Card style="width: 140px; margin-right: 20px">
        <div style="text-align: center">
          <p>付费视频总数</p>
          <p>{{ count }}</p>
        </div>
      </Card>
      <Card style="width: 140px; margin-right: 20px">
        <div style="text-align: center">
          <p>付费总次数</p>
          <p>{{ count_rs }}</p>
        </div>
      </Card>
      <Card style="width: 140px; margin-right: 20px">
        <div style="text-align: center">
          <p>视频付费总金额</p>
          <p>{{ count_je }}</p>
        </div>
      </Card>
    </div>
    <!-- 表格 -->
    <div class="table">
      <Table border :columns="payColumns" :data="payTableData">
        <!-- 封面 -->
        <template slot-scope="{ row, index }" slot="vedio_cover">
          <viewer>
            <img style="width: 40px; height: 40px" :src="row.vedio_cover" />
          </viewer>
        </template>

        <!-- 操作 -->
        <template slot-scope="{ row, index }" slot="action">
          <Button
            type="primary"
            ghost
            style="margin-right: 10px"
            @click="detailBtn(row)"
            >详情</Button
          >
        </template>
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
    <Modal v-model="modalLook" fullscreen :closable="false">
      <p
        slot="header"
        style="text-align: left; cursor: pointer"
        @click="backClick"
      >
        <Icon type="md-arrow-round-back" /> 返回
      </p>
      <div class="payVisible">
        <div>
          <Row>
            <Col span="12">
              <p style="font-size: 20px; margin-bottom: 15px">视频信息</p>
              <Row>
                <Col span="7"
                  >视频标题：<span>{{ detailForm.vedio_title }}</span></Col
                >
                <Col span="7"
                  >视频单价：<span>{{ detailForm.vedio_price }}</span></Col
                >
              </Row>
              <Row>
                <Col span="7"
                  >发布时间：<span>{{ detailForm.add_time }}</span></Col
                >
                <Col span="7"
                  >视频ID：<span>{{ detailForm.vedio_id }}</span></Col
                >
              </Row>
              <Row>
                <Col span="7"
                  >用户昵称：<span>{{ detailForm.nickname }}</span></Col
                >
                <Col span="7"
                  >用户ID：<span>{{ detailForm.uid }}</span></Col
                >
              </Row>
              <p style="font-size: 20px; margin-bottom: 15px">付费信息</p>
              <Row>
                <Col span="7"
                  >视频总收入：<span
                    >{{ detailForm.income_total }}/钻石</span
                  ></Col
                >
                <Col span="7"
                  >付费人数：<span>{{ detailForm.pay_count }}/人</span></Col
                >
              </Row>
              <p style="font-size: 20px; margin-bottom: 15px">付费用户</p>
              <Table border :columns="detailColumns" :data="detailTableData">
                <template slot-scope="{ row, index }" slot="money1">{{
                  Math.round(Number(row.money) * 100)
                }}</template>
              </Table>
              <!-- 分页 -->
              <div class="page">
                <Page
                  :total="totalDetail"
                  :current.sync="exchangeFrom2.page"
                  show-elevator
                  show-sizer
                  show-total
                  @on-change="pageChange2"
                  @on-page-size-change="pageSizeChange2"
                  :page-size="exchangeFrom2.limit"
                />
              </div>
            </Col>
            <Col span="12">
              <Card>
                <video-player
                  v-if="flagVideo"
                  class="video-player vjs-custom-skin"
                  ref="videoPlayer"
                  :playsinline="true"
                  :options="playerOptions"
                >
                </video-player>
                <span v-if="!flagVideo">暂无视频播放哦~</span>
                <p style="text-align: center; margin-top: 15px">
                  <Button type="primary" @click="closePreview">暂停播放</Button>
                </p>
                <!--  <iframe :src="videoSrc" scrolling="no" style="width:500px;height:500px" allowfullscreen="true"></iframe> -->
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      <p slot="footer"></p>
    </Modal>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import { payListApi, payListDetailApi } from "@/api/finance";
import { formatDate } from "@/common/date.js";
import Setting from "@/setting";
export default {
  components: {},
  data() {
    return {
      videoSrc: "",
      vedio_id: "",
      spinShow: true,
      total: 0,
      totalDetail: 0,
      count: 0, //付费视频总人数
      count_rs: 0, //付费总人数
      count_je: 0, //付费总金额
      exchangeFrom: {
        page: 1,
        limit: 10,
      },
      exchangeFrom2: {
        page: 1,
        limit: 10,
      },
      modalLook: false, //查看弹框
      modalInform: false, //封禁弹框
      //付费人数
      //付费人数最高最低
      peopleList: [
        {
          value: "desc",
          label: "最高",
        },
        {
          value: "asc",
          label: "最低",
        },
      ],
      refuseForm: {
        closure_period: "", //封禁期限
        closure_reasons: "", //封禁原因
      },
      //详情表单
      detailForm: {
        vedio_url: "",
      },
      // 搜索
      searchForm: {
        "x_v:vedio_price": "", //最低价
        "d_v:vedio_price": "", //最高价
        "p_v:pay_count": "", //人数
      },
      datePay: [], //日期
      //表格
      payColumns: [
        {
          title: "视频ID",
          key: "vedio_id",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "视频标题",
          key: "vedio_title",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "封面",
          key: "vedio_cover",
          slot: "vedio_cover",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 180,
          title: "发布时间",
          key: "add_time",
          align: "center",
          className: "table-head-style",
          render: (h, params) => {
            return h(
              "div",
              formatDate(
                new Date(params.row.add_time * 1000),
                "yyyy-MM-dd hh:mm:ss"
              )
              // Date是后台时间戳参数字段
              // 'yyyy-MM-dd hh:mm' 对应的时间格式 2018-12-21 18:46
              // 格式可以自行修改，例如 'yyyy-MM-dd' -> 2018-12-21,  'yyyy-MM' -> 2018-12
            );
          },
        },
        {
          title: "视频单价/钻石",
          key: "vedio_price",
          align: "center",
          className: "table-head-style",
        },

        {
          title: "用户昵称",
          key: "nickname",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "用户ID",
          key: "uid",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "视频付费人数/人",
          key: "pay_count",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "视频总收入/钻石",
          key: "income_total",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 120,
          title: "操作",
          key: "action",
          slot: "action",
          align: "center",
          className: "table-head-style",
        },
      ],
      flagVideo: true,
      payTableData: [],
      //查看表格
      detailColumns: [
        {
          title: "用户ID",
          key: "uid",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "用户昵称",
          key: "buy_nickname",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "支付时间",
          key: "create_time",
          align: "center",
          className: "table-head-style",
        },
        // {
        //   title: "支付状态",
        //   key: "order_status_str",
        //   align: "center",
        //   className: "table-head-style",
        // },
        {
          title: "钻石",
          key: "money",
          slot: "money1",
          align: "center",
          className: "table-head-style",
        },
      ],
      detailTableData: [],
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
    this.getPayList();
    if (this.playerOptions.sources[0].src === "") {
      this.flagVideo = false;
    } else {
      this.flagVideo = true;
    }
  },
  mounted() {},
  methods: {
    //获取付费视频列表
    getPayList() {
      // var x_v:vedio_price =this.searchForm.x_v:vedio_price.toFixed(2)
      // const d_v:vedio_price = this.searchForm.d_v:vedio_price.toFixed(2)
      payListApi({
        ...this.exchangeFrom,
        ...this.searchForm,
        "e_v:is_pay": 1,
        "e:is_del": 0,
        "x_v:add_time": this.datePay[0]
          ? Date.parse(this.datePay[0]) / 1000
          : "",
        "d_v:add_time": this.datePay[1]
          ? Date.parse(this.datePay[1]) / 1000
          : "",
      })
        .then((res) => {
          this.total = res.data.count;
          this.payTableData = res.data.list;
          this.payTableData.forEach((item) => {
            item.vedio_cover = Setting.url(item.vedio_cover);
          });
          this.count = res.data.count;
          this.count_rs = res.data.count_rs;
          this.count_je = res.data.count_je;
          this.spinShow = false;
        })
        .catch((err) => {});
    },
    //获取详情---视频支付记录
    getDetail(videoID) {
      payListDetailApi({
        ...this.exchangeFrom2,
        "e:m:vedio_id": videoID,
        "c:m:pay_uid": "E:0",
        "o:m:id": "DESC",
      }).then((res) => {
        this.detailTableData = res.data.list;
        this.totalDetail = res.data.count;
      });
    },
    //最高价事件
    priceBlur() {
      if (
        this.searchForm["x_v:vedio_price"] > this.searchForm["d_v:vedio_price"]
      ) {
        this.searchForm["d_v:vedio_price"] = "";
        this.$Message.warning("最低价不能高于最高价！");
      }
    },
    //付费人数change事件
    payPersonChange(e) {
      this.searchForm["p_v:pay_count"] = e;
      this.getPayList();
    },
    //日期change事件
    dateChange(e) {
      this.datePay = e;
    },
    //   查看
    detailBtn(row) {
      this.vedio_id = row.vedio_id;
      this.detailForm = JSON.parse(JSON.stringify(row));
      this.playerOptions.sources[0].src = Setting.url(
        this.detailForm.vedio_url
      );
      console.log(this.playerOptions.sources[0].src, "101");
      if (this.playerOptions.sources[0].src === "") {
        this.flagVideo = false;
      } else {
        this.flagVideo = true;
      }
      // this.videoSrc = this.detailForm.vedio_url;
      this.detailForm.add_time = formatDate(
        new Date(this.detailForm.add_time * 1000),
        "yyyy-MM-dd hh:mm:ss"
      );
      this.getDetail(row.vedio_id);
      this.modalLook = true;
    },
    //关闭视频并返回上一级
    closePreview() {
      this.$refs.videoPlayer.player.pause(); // 暂停
    },
    // 确认封禁
    informConfirm() {
      if (this.refuseForm.closure_period === "") {
        return this.$Message.warning("封禁时间不能为空！");
      } else if (this.refuseForm.closure_reasons === "") {
        return this.$Message.warning("封禁原因不能为空！");
      }
    },
    //重置
    clearFormBtn() {
      this.searchForm = {
        "x_v:vedio_price": "", //最低价
        "d_v:vedio_price": "", //最高价
        "p_v:pay_count": "", //人数
      };
      this.datePay = [];
      this.getPayList();
    },
    backClick() {
      if (this.flagVideo == true) {
        this.$refs.videoPlayer.player.pause(); // 暂停
      }
      this.modalLook = false;
    },
    //搜索
    searchFormBtn() {
      this.getPayList();
    },
    // 分页
    pageChange(index) {
      this.exchangeFrom.page = index;
      this.getPayList();
    },
    pageSizeChange(index) {
      this.exchangeFrom.limit = index;
      this.getPayList();
    },
    // 分页2
    pageChange2(index) {
      this.exchangeFrom2.page = index;
      this.getDetail(this.vedio_id);
    },
    pageSizeChange2(index) {
      this.exchangeFrom2.limit = index;
      this.getDetail(this.vedio_id);
    },
  },
};
</script>

<style scoped>
/deep/.ivu-page-options-elevator {
  margin-left: 12px;
}
.video-player {
  /* width: 200px; */
}
.payVisible {
  padding: 0 20px;
}
.card {
  display: flex;
  padding-left: 20px;
}

.diamondTable {
  width: 500px;
}
.ivu-col-span-7,
.ivu-col-span-10 {
  margin-bottom: 24px;
}
.user {
  font-size: 18px;
}
.manageVisible,
.wors,
.diamond {
  margin-left: 60px;
}
.title {
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
}
.btn {
  width: 300px;
  display: flex;
  justify-content: space-between;
  padding: 10px 10px;
}
.audit {
  margin: 10px 0 0 0;
}
>>> .ivu-table th.table-head-style {
  background: #f2f2f2 !important;
  color: #333;
}
.search {
  background-color: #fff;
  margin: 0 0 20px 0;
  padding: 20px 10px 0 20px;
}
.table {
  background-color: #fff;
  padding: 20px;
}
/deep/.ivu-select-single .ivu-select-selection {
  width: 117px;
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
}
</style>
