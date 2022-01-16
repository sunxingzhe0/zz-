<template>
  <div class="search">
    <!-- 查询 -->
    <Form :model="searchForm" :label-width="80">
      <div style="display: flex">
        <FormItem label="用户名：">
          <Input
            style="width: 120px"
            type="text"
            v-model="searchForm.real_name"
            placeholder="请输入用户"
          />
        </FormItem>

        <FormItem label="用户ID：">
          <Input
            style="width: 120px"
            type="text"
            v-model="searchForm.uid"
            placeholder="请输入用户ID"
          />
        </FormItem>
        <FormItem label="手机号：">
          <Input
          style="width: 120px"
            type="text"
            v-model="searchForm.phone"
            placeholder="请输入手机号"
          />
        </FormItem>
        <FormItem label="日期：">
          <DatePicker
            type="datetimerange"
            @on-change="dateChange"
            :value="datePay"
            placeholder="请选择日期"
            style="width: 280px"
          ></DatePicker>
        </FormItem>
        <Button type="success" @click="clearFormBtn" style="margin: 0 5px"
          >重置</Button
        >
        <Button type="primary" @click="searchFormBtn">搜索</Button>
        <Button
          type="primary"
          ghost
          @click="exportFormBtn"
          style="margin: 0 5px"
          >导出</Button
        >
        <!-- <div style="text-align:right;margin-right:40px;padding-bottom:20px"> -->

        <!-- </div> -->
      </div>
    </Form>
    <div class="card">
      <Card style="width: 140px; margin-right: 20px">
        <div style="text-align: center">
          <p>提现总金额</p>
          <p><span style="color: red">￥</span>{{ card.total_amount }}</p>
        </div>
      </Card>
      <Card style="width: 140px; margin-right: 20px">
        <div style="text-align: center">
          <p>提现笔数</p>
          <p>{{ card.total_count }}</p>
        </div>
      </Card>
    </div>
    <!-- 表格 -->
    <div class="table">
      <Table border :columns="payColumns" :data="payTableData">
        <!-- 支付方式 -->
        <template slot-scope="{ row, index }" slot="withdraw_type">
          <span v-if="row.withdraw_type === 1">支付宝</span>
          <span v-if="row.withdraw_type === 2">银行卡</span>
        </template>
        <!-- 支付状态 -->
        <template slot-scope="{ row, index }" slot="status">
          <span>已支付</span>
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
    <Modal v-model="modalLook" :closable="false" width="400">
      <p slot="header" style="text-align: center; cursor: pointer">查看</p>
      <p class="title">
        审核人：<span>{{ detailForm.account }}</span>
      </p>
      <p class="title">用户信息</p>
      <Row>
        <Col span="12"
          >用户昵称：<span>{{ detailForm.nickname }}</span></Col
        >
        <Col span="12"
          >用户ID：<span>{{ detailForm.uid }}</span></Col
        >
      </Row>
      <Row>
        <Col span="12"
          >手机号：<span>{{ detailForm.phone }}</span></Col
        >
      </Row>
      <p class="title">审核信息</p>
      <Row>
        <Col span="12"
          >支付方式：<span v-if="detailForm.withdraw_type === 1">支付宝</span
          ><span v-if="detailForm.withdraw_type === 2">银行卡</span></Col
        >
        <Col span="12"
          >账号：<span>{{ detailForm.account_number }}</span></Col
        >
      </Row>
      <Row>
        <Col span="12"
          >提现总金额：<span>{{ detailForm.money }}</span></Col
        >
        <Col span="12"
          >提现手续费：<span
            >{{ detailForm.service_charge_percentage }}%</span
          ></Col
        >
      </Row>
      <Row>
        <Col span="12"
          >申请提现金额：<span>{{ detailForm.total_money }}</span></Col
        >
        <Col span="12"
          >申请时间：<span>{{ detailForm.add_time }}</span></Col
        >
      </Row>
      <p class="title">平台信息</p>
      <Row>
        <Col span="12"
          >平台支付方式：<span>{{ detailForm.pay_mode }}</span></Col
        >
        <Col span="12"
          >账号：<span>{{ detailForm.account_number }}</span></Col
        >
      </Row>
      <Row>
        <Col span="12"
          >到账核实金额：<span>{{ detailForm.total_money }}</span></Col
        >
        <Col span="12">支付状态：<span>已支付</span></Col>
      </Row>
      <Row>
        <Col span="12"
          >平台到账金额：<span>{{ detailForm.withdrawal_amount }}</span></Col
        >
      </Row>
      <p slot="footer" style="text-align: center; cursor: pointer">
        <Button type="primary" ghost @click="modalLook = false">确认</Button>
      </p>
    </Modal>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import {} from "@/api/user";
import { withdrawalListApi } from "@/api/audit";
import { formatDate } from "@/common/date.js";
export default {
  components: {},
  data() {
    return {
      total: 0,
      spinShow: true,
      exchangeFrom: {
        page: 1,
        limit: 10,
      },
      modalLook: false, //查看弹框
      modalInform: false, //封禁弹框
      //卡片数据
      card: {},
      //付费人数
      //付费人数最高最低
      peopleList: [
        {
          value: 0,
          label: "最高",
        },
        {
          value: 1,
          label: "最低",
        },
      ],
      refuseForm: {
        closure_period: "", //封禁期限
        closure_reasons: "", //封禁原因
      },
      // 搜索
      searchForm: {
        real_name: "", //用户昵称
        uid: "", //用户ID
        phone: "", //手机号
      },
      //export
      exportForm: {
        "k_w:real_name": "", //用户名
        "e_w:uid": "", //用户ID
        "e_w:phone": "", //手机号
        "x_w:examine_time": "", //开始时间
        "d_w:examine_time": "", //结束时间
      },
      datePay: [], //日期
      //查看弹框表单
      detailForm: {},
      //表格
      payColumns: [
        {
          width: 80,
          title: "序号",
          type: "index",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 130,
          title: "用户名",
          key: "real_name",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 130,
          title: "用户昵称",
          key: "nickname",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 110,
          title: "用户ID",
          key: "uid",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 140,
          title: "手机号",
          key: "phone",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 110,
          title: "支付方式",
          key: "withdraw_type",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 130,
          title: "提现账号",
          key: "withdraw_account",
          align: "center",
          className: "table-head-style",
        },

        {
          width: 100,
          title: "提现总金额",
          key: "money",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 150,
          title: "申请时间",
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
          width: 90,
          title: "提现实际金额",
          key: "total_money",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 90,
          title: "平台支付方式",
          key: "pay_mode",
          slot: "pay_mode",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 120,
          title: "平台支付账号",
          key: "account_number",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 90,
          title: "支付状态",
          key: "status",
          slot: "status",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 90,
          title: "平台到账金额",
          key: "withdrawal_amount",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 120,
          title: "操作",
          fixed: "right",
          key: "action",
          slot: "action",
          align: "center",
          className: "table-head-style",
        },
      ],
      payTableData: [
        {
          avatar: "",
        },
      ],
      //查看表格
      detailColumns: [
        {
          title: "时间",
          key: "addTime",
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
          title: "举报内容",
          key: "addTime",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "举报图片",
          key: "addTime",
          align: "center",
          className: "table-head-style",
        },
      ],
      detailTableData: [],
      //视频
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            // type: "video/mp4", // 类型
            src: "", // url地址
          },
        ],
        poster: "", // 封面地址
        // notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
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
    this.getDetailList();
  },
  mounted() {},
  methods: {
    //获取提现明细列表
    getDetailList() {
      withdrawalListApi({
        ...this.exchangeFrom,
        status: 2,
        ...this.searchForm,
        start_time: this.datePay[0],
        end_time: this.datePay[1],
      }).then((res) => {
        this.payTableData = res.data.list;
        this.card = res.data.total;
        this.total = res.data.count;
        this.spinShow = false;
      });
    },
    //日期change事件
    dateChange(e) {
      this.datePay = e;
    },
    //   查看
    detailBtn(row) {
      this.detailForm = JSON.parse(JSON.stringify(row));
      this.detailForm.add_time = formatDate(
        new Date(this.detailForm.add_time * 1000),
        "yyyy-MM-dd hh:mm:ss"
      );
      this.modalLook = true;
    },
    //导出
    exportFormBtn() {
      this.exportForm["k_w:real_name"] = this.searchForm.real_name? this.searchForm.real_name : "";
      this.exportForm["e_w:uid"] = this.searchForm.uid? this.searchForm.uid : "";
      this.exportForm["e_w:phone"] = this.searchForm.phone? this.searchForm.phone : "";
      this.exportForm["x_w:examine_time"] = this.datePay[0]? this.datePay[0]:"";
      this.exportForm["d_w:examine_time"] = this.datePay[1]? this.datePay[1]: "";
  console.log(this.exportForm,'kjkj');
      this.$Modal.confirm({
        title: "确定要导出列表数据吗？",
        onOk: () => {
        //  var aa=
         window.location.href =
            `${location.origin}/adminapi/examine/withdrawal/list?` +
            "export=" +1 
            +"&k_w:real_name=" +
            this.exportForm["k_w:real_name"] +
            "&e_w:uid=" +
            this.exportForm["e_w:uid"] +
            "&e_w:phone=" +
             this.exportForm['e_w:phone'] +
            "&x_w:examine_time=" +
            this.exportForm["x_w:examine_time"] +
            "&d_w:examine_time=" +
             this.exportForm["d_w:examine_time"];
            //  console.log(aa,'lklk');
          // this.$Message.success('已导出');
          //   // window.location.href =`${location.origin}/adminapi/marketing/redeem?export=` + 1;
        },
        onCancel: () => {
          this.$Message.info("已取消");
        },
      });
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
        nickname: "", //用户名
        uid: "", //用户ID
        phone: "", //手机号
      };
      this.datePay = []; //日期
      this.getDetailList();
    },
    //搜索
    searchFormBtn() {
      this.getDetailList();
    },
    // 分页
    pageChange(index) {
      this.exchangeFrom.page = index;
    },
    pageSizeChange(index) {
      this.exchangeFrom.limit = index;
    },
  },
};
</script>



<style scoped>
/deep/.ivu-page-options-elevator{
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
.ivu-col-span-8,
.ivu-col-span-12 {
  margin-bottom: 10px;
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
