<template>
  <!-- 提现审核 -->
  <div class="">
    <div class="search">
      <!-- 查询 -->
      <Form :model="searchForm" :label-width="80">
         <Row>
           <div style="margin:0 0 10px 20px">
            <Button @click="auditButtonClick(1)" :type="auditButtonType===1?'primary':'default'" style="margin-right:10px">待审核</Button>
            <Button @click="auditButtonClick(2)" :type="auditButtonType===2?'primary':'default'" style="margin-right:10px">已通过</Button>
            <Button @click="auditButtonClick(3)" :type="auditButtonType===3?'primary':'default'">未通过</Button>
           </div>
         </Row>
        <Row>
          <Col span="4">
            <FormItem label="用户昵称：">
              <Input
                type="text"
                v-model="searchForm.real_name"
                placeholder="请输入用户昵称"
              /> </FormItem
          ></Col>

          <Col span="4">
            <FormItem label="用户ID：">
              <Input
                type="text"
                v-model="searchForm.uid"
                placeholder="请输入用户ID"
              />
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="手机号：">
              <Input
                type="text"
                v-model="searchForm.phone"
                placeholder="请输入手机号"
              />
            </FormItem>
          </Col>
            <Col span="4">
            <FormItem label="帐号状态：">
              <Select v-model="searchForm.user_status" style="width: 200px">
                <Option
                  v-for="item in accountList"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</Option
                >
              </Select>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem label="申请时间：">
              <Date-picker
                @on-change="timeChange"
                :value="searchForm.value2"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择申请时间"
                style="width: 220px"
              ></Date-picker>
            </FormItem>
          </Col>
        

          <!-- <div style="text-align:right;margin-right:40px;padding-bottom:20px"> -->
        
          <!-- </div> -->
        </Row>
        <div style="text-align:right;margin: 0 60px 0 0">
            <Button type="success" @click="clearFormBtn" style="margin: 0 20px"
            ><Icon type="ios-aperture" />&nbsp;重置</Button
          >
          <Button type="primary" icon="ios-search" @click="searchFormBtn"
            >搜索</Button
          >
        </div>
      </Form>
    </div>
     <Spin size="large" fix v-if="spinShow"></Spin>
    <!-- 表格 -->
    <div class="table">
      <Table border :columns="withdrawColumns" :data="withdrawData">
        <!-- 审核 -->
        <template slot-scope="{ row, index }" slot="action">
          <Button
            type="primary"
            ghost
            style="margin-right: 10px"
            @click="auditClick(row)"
            >审核</Button
          >
          <Button
            v-if="row.status !== 1"
            type="primary"
            style="margin-right: 10px"
            @click="detailClick(row)"
            >查看</Button
          >
        </template>
        <!-- 审核状态 -->
        <template slot-scope="{ row, index }" slot="status">
          <span v-if="row.status === 1">待审核</span>
          <span v-if="row.status === 2">已通过</span>
          <span v-if="row.status === 3">未通过</span>
        </template>
        <!-- 账号状态 -->
        <template slot-scope="{ row, index }" slot="user_status">
          <span v-if="row.user_status === 1">正常</span>
          <span v-if="row.user_status === 0">禁止</span>
        </template>
        <!-- 拒绝理由 -->

        <template slot-scope="{ row, index }" slot="back_remark">
          <span v-if="row.status === 1">待审核-暂无拒绝理由</span>
          <span v-if="row.status === 2">已通过-无拒绝理由</span>
          <Tooltip placement="top">
            <span v-if="row.status === 3" style="color: red">
            {{ row.back_remark }}</span>
            <div slot="content">
             {{ row.back_remark }}
            </div>
          </Tooltip>
          
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

    <!-- 提现金额审核弹框 -->
    <Modal v-model="auditVisible">
      <div slot="header" style="text-align: center; font-size: 18px">
        申请处理
      </div>
      <p class="audit user">用户信息</p>
      <p class="audit">
        用户昵称：<span>{{ auditForm.real_name }}</span
        >&emsp;手机号：<span>{{ auditForm.phone }}</span>
      </p>
      <p class="audit">
        用户ID：<span>{{ auditForm.uid }}</span
        >&emsp;支付方式：<span>{{
          auditForm.auditForm === 1 ? "支付宝" : "银行卡"
        }}</span>
      </p>
      <p class="audit">
        帐号状态：<span>{{
          auditForm.user_status === 1 ? "正常" : "禁止"
        }}</span>
      </p>
      <p class="audit">
        支付宝账号：<span>{{ auditForm.withdraw_account }}</span>
      </p>
      <Divider dashed />
      <p class="audit">
        实际申请金额：<span>{{ auditForm.money }}</span
        >&emsp;手续费比例：<span
          >{{ auditForm.service_charge_percentage }}%</span
        >
      </p>
      <p class="audit">
        到账金额：￥<span>{{ auditForm.total_money }}</span>
      </p>
      <p style="color: red">*请填写到账核实金额</p>
      <Input
        v-model="auditForm.withdrawal_amount"
        placeholder="请输入到"
        style="width: 300px"
      />
      <p class="audit"><span style="color: red">*</span> 请选择平台支付方式</p>
      <Select
        :label-in-value="true"
        v-model="auditForm.pay_mode"
        @on-change="paymodeChange"
        style="width: 200px"
      >
        <Option
          v-for="item in payTypeList"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}</Option
        >
      </Select>
      <div>
        <RadioGroup
          v-model="auditForm.account_number"
          @on-change="payAcountChange"
        >
          <Radio
            v-for="item in payAccountList"
            :label="item.value"
            :key="item.value"
            >{{ item.label }}</Radio
          >
        </RadioGroup>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="warning" @click="refuseAuditBtn">拒绝</Button>
        <Button type="success" @click="confirmAuditBtn">确认转账</Button>
      </div>
    </Modal>
    <!-- 评论拒绝弹框 -->
    <Modal v-model="refuseVisible">
      <div slot="header" style="text-align: center; font-size: 18px">
        拒绝申请
      </div>
      <p><span style="color: red">*</span>请选择拒绝理由</p>
      <Select
        :label-in-value="true"
        v-model="back_remark"
        style="width: 200px"
        @on-change="backChange"
      >
        <Option
          v-for="item in backList"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}</Option
        >
      </Select>
      <div slot="footer" style="text-align: center">
        <Button type="warning" @click="refuseVisible = false">取消</Button>
        <Button type="success" @click="confirRefuseBtn">确认</Button>
      </div>
    </Modal>
    <!-- 查看审核弹框 -->
    <Modal v-model="detailVisible">
      <div slot="header" style="text-align: center; font-size: 18px">查看</div>
      <p class="audit user">用户信息</p>
      <p class="audit">
        用户昵称：<span>{{ detailForm.real_name }}</span
        >&emsp;手机号：<span>{{ detailForm.phone }}</span>
      </p>
      <p class="audit">
        用户ID：<span>{{ detailForm.uid }}</span
        >&emsp;支付方式：<span>{{
          detailForm.auditForm === 1 ? "支付宝" : "银行卡"
        }}</span>
      </p>
      <p class="audit">
        帐号状态：<span>{{
          detailForm.user_status === 1 ? "正常" : "禁止"
        }}</span>
      </p>
      <p class="audit">
        支付宝账号：<span>{{ detailForm.withdraw_account }}</span>
      </p>
      <Divider dashed />
      <p class="audit">
        实际申请金额：<span>{{ detailForm.money }}</span
        >&emsp;手续费比例：<span
          >{{ detailForm.service_charge_percentage }}%</span
        >
      </p>
      <p class="audit">
        到账金额：￥<span>{{ detailForm.total_money }}</span>
      </p>
      <p class="audit">
        提现申请状态：<span v-if="detailForm.status === 3">未通过</span>
        <span v-if="detailForm.status === 2">已通过</span>
      </p>
      <!-- 未通过 -->
      <p class="audit" v-if="detailForm.status === 3">
        未通过理由：<span>{{ detailForm.back_remark }}</span>
      </p>
      <!-- 已通过 -->
      <p class="audit" v-if="detailForm.status === 2">
        平台支付方式：<span v-if="detailForm.withdraw_type === 1">支付宝</span
        ><span v-if="detailForm.withdraw_type === 2">银行卡</span
        >&emsp;账号：<span>{{ detailForm.withdraw_account }}</span>
      </p>
      <p class="audit" v-if="detailForm.status === 2">
        支付状态：<span></span>
      </p>
      <p class="audit">
        审核人：<span>{{ detailForm.account }}</span>
      </p>
      <div slot="footer" style="text-align: center">
        <Button type="primary" @click="detailVisible = false">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  withdrawalListApi,
  patTypeApi,
  patTypeListApi,
  passAuditApi,
  refuseAuditApi,
  auditRefusesApi
} from "@/api/audit";
import { refuseListApi } from "@/api/setting";
import { formatDate } from "@/common/date.js";
export default {
  components: {},
  data() {
    return {
      auditButtonType:0,
      total: 0,
      spinShow:true,
      pay_mode: "", //支付方式传值
      value: "", //核实金额
      refuseValue: "", //拒绝原因值
      auditVisible: false, //审核弹框
      refuseVisible: false, //拒绝弹框
      detailVisible: false, //查看弹框
      backList: [], //拒绝理由
      back_remark: "", //拒绝理由
      back_remark_content: "",
      auditForm: {
        id: "", //平台审核ID
        withdrawal_amount: "", //平台到账金额
        pay_mode: "", //平台支付方式
      },
      payTypeList: [],
      payAccountList: [],
      //查看
      detailForm: {},
      //分页参数
      exchangeFrom: {
        page: 1,
        limit: 10,
      },
      //查询表单
      searchForm: {
        status: "", //审核状态
        user_status: "", //帐号状态
        phone: "", //手机号
        real_name: "", //用户昵称
        uid: "", //用户ID
        value2: [], //评论时间
      },
  
      //帐号状态列表
      accountList: [
        {
          value: 1,
          label: "正常",
        },
        {
          value: 2,
          label: "封禁中",
        },
      ],
      //表格
      withdrawColumns: [
        {
          width: 120,
          title: "用户昵称",
          key: "real_name",
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
          width: 120,
          title: "手机号",
          key: "phone",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "账号状态",
          key: "user_status",
          slot: "user_status",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "支付方式",
          key: "pay_mode",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 110,
          title: "申请提现金额",
          key: "total_money",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 110,
          title: "拒绝理由",
          key: "back_remark",
          slot: "back_remark",
          align: "center",
          className: "table-head-style",
        },

        {
          width: 200,
          title: "申请提现时间",
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
          title: "审核状态",
          key: "status",
          slot: "status",
          align: "center",
          className: "table-head-style",
        },

        {
          width: 160,
          title: "操作",
          slot: "action",
          key: "comment_id",
          align: "center",
          className: "table-head-style",
        },
      ],
      withdrawData: [],
    };
  },
  created() {
    this.getWithdrawalLis(); //提现审核列表
    this.getTypeLis(); //支付类型列表
    this.getRefuse();
  },
  mounted() {},
  methods: {
    //获取拒绝理由
    getRefuse() {
       auditRefusesApi({
        gid: 72,
        status: 1,
      }).then((res) => {
        this.backList = res.data.list.map((item) => {
          return {
            value: item.id,
            label: item.content,
          };
        });
      });
    },
    //获取支付类型列表
    getTypeLis() {
      patTypeListApi().then((res) => {
        this.payTypeList = res.data.map((item) => {
          return {
            value: item.pay_id,
            label: item.pay_mode,
          };
        });
      });
    },
    //获取提现审核列表
    getWithdrawalLis() {
      withdrawalListApi({
        ...this.exchangeFrom,
        real_name: this.searchForm.real_name,
        uid: this.searchForm.uid,
        phone: this.searchForm.phone,
        user_status: this.searchForm.user_status,
        status: this.searchForm.status,
        start_time: this.searchForm.value2[0] ? this.searchForm.value2[0] : "",
        end_time: this.searchForm.value2[1] ? this.searchForm.value2[1] : "",
      }).then((res) => {
        this.withdrawData = res.data.list;
        this.total = res.data.count;
        this.spinShow = false
      });
    },
    // 选择支付方式change事件
    paymodeChange(e) {
      this.pay_mode = e.label;
      patTypeApi({
        id: e.value,
        status: 1,
      }).then((res) => {
        this.payAccountList = res.data.map((item) => {
          return {
            value: item.account_id,
            label: item.account_number,
          };
        });
      });
    },
    //拒绝理由change事件
    backChange(e) {
      console.log(e, "拒绝");
      this.back_remark_content = e.label;
    },
    payAcountChange(e) {
      console.log(e, "单选");
    },
    //清空
    clearFormBtn() {
      (this.searchForm = {
        status: "", //审核状态
        user_status: "", //帐号状态
        phone: "", //手机号
        real_name: "", //用户昵称
        uid: "", //用户ID
        value2: [], //评论时间
      }),
        (this.exchangeFrom = {
          page: 1,
          limit: 10,
        }),
        this.getWithdrawalLis();
    },
    //事件选择事件
    timeChange(e) {
      this.searchForm.value2 = e;
      console.log(e, "时间");
    },
     auditButtonClick(num){
      this.auditButtonType = num
      this.searchForm.status = num
      this.getWithdrawalLis();
    },
    //搜索
    searchFormBtn() {
      this.getWithdrawalLis();
      console.log(this.searchForm, "参数");
    },
    //审核
    auditClick(row) {
      this.auditForm = JSON.parse(JSON.stringify(row));
      this.auditVisible = true;
      console.log(row, "审核");
    },
    //审核拒绝
    refuseAuditBtn() {
      this.refuseVisible = true;
    },
    //审核确认通过
    confirmAuditBtn() {
      if (this.auditForm.withdrawal_amount === "") {
        return this.$Message.warning("到账核实金额不能为空！");
      } else if (this.pay_mode === "") {
        return this.$Message.warning("请选择支付方式！");
      } else {
        //发送请求
        passAuditApi({
          id: this.auditForm.id,
          status: 2,
          withdrawal_amount: this.auditForm.withdrawal_amount,
          pay_mode: this.pay_mode,
          account_number: this.auditForm.account_number,
        }).then((res) => {
          this.$Message.success(res.msg);
          this.getWithdrawalLis();
          this.auditVisible = false;
        });
      }
    },

    //拒绝确认
    confirRefuseBtn() {
      if (!this.back_remark_content) {
        return this.$Message.warning("请选择拒绝理由！");
      }
      refuseAuditApi({
        id: this.auditForm.id,
        status: 3,
        back_remark: this.back_remark_content,
      })
        .then((res) => {
          this.$Message.success(res.msg);
          this.getWithdrawalLis();
          this.auditVisible = false;
          this.refuseVisible = false;
        })
        .catch((err) => {
          this.$Message.warning(err.msg);
        });
    },
    //查看
    detailClick(row) {
      this.detailForm = row;
      this.detailVisible = true;
    },
    // 分页
    pageChange(index) {
      this.exchangeFrom.page = index;
       this.getWithdrawalLis();
    },
    pageSizeChange(index) {
      this.exchangeFrom.limit = index;
       this.getWithdrawalLis();
    },
  },
};
</script>

<style scoped>
/deep/.ivu-page-options-elevator{
  margin-left: 12px;
}
.user {
  font-size: 18px;
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
  padding: 20px 10px 10px 20px;
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
