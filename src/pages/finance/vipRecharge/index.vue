<template>
  <div class="search">
    <!-- 查询 -->
    <Form :model="searchForm" :label-width="80">
      <Row>
       
        <Col span="4">
          <FormItem label="用户昵称：">
            <Input
              type="text"
              v-model="searchForm['k:u:nickname']"
              placeholder="请输入用户昵称"
            /> </FormItem
        ></Col>
        <Col span="4">
          <FormItem label="用户ID：">
            <Input
              type="text"
              v-model="searchForm['e:h:uid']"
              placeholder="请输入用户ID"
            />
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="手机号：">
            <Input
              type="text"
              v-model="searchForm['e:u:phone']"
              placeholder="请输入手机号"
            />
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="充值套餐：">
            <Select
              @on-change="comboChange"
              v-model="searchForm['e:h:viptype']"
            >
              <Option
                v-for="item in comTypeList"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
        </Col>
         <Col span="4">
          <FormItem label="充值类型：">
            <Select
              @on-change="typeIsChange"
              v-model="searchForm['e:h:pay_type']"
            >
              <Option
                v-for="item in rechargeTypeList"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
        </Col>
         <Col span="4">
          <FormItem label="支付状态：">
            <Select
              @on-change="orderIsChange"
              v-model="searchForm['e:h:status']"
            >
              <Option
                v-for="item in statusList"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="日期：">
            <DatePicker
              type="datetimerange"
              @on-change="dateChange"
              :value="datePay"
              placeholder="请输入开始时间和结束时间"
              style="width: 280px"
            ></DatePicker>
          </FormItem>
        </Col>
        <Col span="4">
          <Button type="success" @click="clearFormBtn" style="margin: 0 5px"
            >重置</Button
          >
          <Button type="primary" @click="searchFormBtn">搜索</Button>
        </Col>
        <!-- <div style="text-align:right;margin-right:40px;padding-bottom:20px"> -->

        <!-- </div> -->
      </Row>
    </Form>

    <!-- 表格 -->
    <div class="table">
      <Table border :columns="payColumns" :data="payTableData">
        <!-- 支付金额 -->
         <template slot-scope="{ row, index }" slot="price">
           ￥{{row.price}}
        </template>
         <!-- 充值套餐 -->
         <template slot-scope="{ row, index }" slot="viptype">
            <span v-if="row.viptype===2">7天会员</span>
            <span v-if="row.viptype===3">一个月会员</span>
            <span v-if="row.viptype===4">3个月会员</span>
            <span v-if="row.viptype===5">12个月会员</span>
        </template>
        <!-- 充值类型 -->
         <template slot-scope="{ row, index }" slot="pay_type">
            <span v-if="row.pay_type===0">后台充值</span>
            <span v-if="row.pay_type===1">钻石</span>
            <span v-if="row.pay_type===2">微信</span>
            <span v-if="row.pay_type===3">支付宝</span>
        </template>
        <!-- 支付状态 -->
         <template slot-scope="{ row, index }" slot="status">
            <span v-if="row.status===0">支付中</span>
            <span v-if="row.status===1">支付完成</span>
            <span v-if="row.status===2">支付失败</span>
        </template>
        <!-- 操作 -->
        <template slot-scope="{ row, index }" slot="action">
          <Button
            type="primary"
            ghost
            style="margin-right: 10px"
            @click="detailBtn(row)"
            >查看</Button
          >
          <!-- <Button
          v-if="row.order_status!==3"
            type="primary"
            ghost
            style="margin-right: 10px"
            @click="returnBtn(row)"
            >退款</Button
          > -->
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
    <!-- 已退款查看弹框 -->
    <Modal v-model="modalLook" :closable="false" width="400">
      <p slot="header" style="text-align: center; cursor: pointer">查看</p>
      <p class="title">状态：<span v-if="detailForm.status===0">支付中</span>
      <span v-if="detailForm.status===1">支付完成</span>
      <span v-if="detailForm.status===2">失败</span>
      </p>
      <p class="title">用户信息</p>
      <Row>
        <Col span="12">用户昵称：<span>{{detailForm.nickname}}</span></Col>
        <Col span="12">用户ID：<span>{{detailForm.uid}}</span></Col>
      </Row>
      <Row>
        <Col span="12">手机号：<span>{{detailForm.phone}}</span></Col>
      </Row>
      <p class="title">支付信息</p>
      <Row>
        <Col span="12">充值时间<span>{{detailForm.create_time}}</span></Col>
      </Row>
      <Row>
        <Col span="12">支付金额：<span>{{detailForm.price}}</span></Col>
        <Col span="12">充值套餐：<span v-if="detailForm.viptype===2">7天会员</span>
            <span v-if="detailForm.viptype===3">一个月会员</span>
            <span v-if="detailForm.viptype===4">3个月会员</span>
            <span v-if="detailForm.viptype===5">12个月会员</span>
            <span v-if="detailForm.viptype===0">暂无数据</span>
        </Col>

      </Row>
      <div v-if="detailForm.order_status===3">
          <p class="title">退款信息</p>
      <Row>
        <Col span="12">退款到账：<span>{{detailForm.price}}</span></Col>
      </Row>
      <!-- <Row>
        <Col span="12">退还钻石数：<span>{{ parseInt(detailForm.money)*100 }}</span></Col>
      </Row> -->
      </div>
      

      <p slot="footer" style="text-align: center; cursor: pointer">
        <Button type="primary" ghost @click="modalLook = false">确认</Button>
      </p>
    </Modal>
    <!-- 退款弹框 -->
    <Modal v-model="modalReturn" :closable="false" width="400">
      <p slot="header" style="text-align: center; cursor: pointer">退款</p>
      <p class="title">状态：<span>充值成功</span></p>
      <p class="title">用户信息</p>
      <Row>
        <Col span="12">用户昵称：<span>{{returnForm.nickname}}</span></Col>
        <Col span="12">用户ID：<span>{{returnForm.uid}}</span></Col>
      </Row>
      <Row>
        <Col span="12">手机号：<span>{{returnForm.phone}}</span></Col>
      </Row>
      <p class="title">支付信息</p>
      <Row>
        <Col span="12">充值时间：<span>{{returnForm.create_time}}</span></Col>
        <Col span="12">支付金额：<span>{{returnForm.price}}</span></Col>
      </Row>
      <Row>
        <Col span="12">充值套餐：
            <span v-if="returnForm.viptype===2">7天会员</span>
            <span v-if="returnForm.viptype===3">一个月会员</span>
            <span v-if="returnForm.viptype===4">3个月会员</span>
            <span v-if="returnForm.viptype===5">12个月会员</span>
            <span v-if="returnForm.viptype===0">暂无数据</span>
        </Col>
      </Row>
      <p class="title">退款信息：<span>{{returnForm.nickname}}</span></p>
      <Row>
        <Col span="12">退款到账：<span>{{returnForm.price}}</span></Col>
      </Row>
      <p slot="footer" style="display: flex; justify-content: space-between">
        <Button type="primary" @click="modalReturn = false">取消</Button>
        <Button type="primary" @click="confirmReturnBtn">确认退款</Button>
      </p>
    </Modal>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import { rechargeViplistApi,payRecordReturnApi } from "@/api/finance";
import { formatDate } from "@/common/date.js";
export default {
  components: {},
  data() {
    return {
      spinShow:true,
      total: 0,
      exchangeFrom: {
        page: 1,
        limit: 10,
      },
      modalLook: false, //查看弹框
      modalReturn: false, //退款弹框
      detailForm:{},//查看表单
      returnForm:{},//退款表单
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
        "k:u:nickname": "", //用户昵称
        "e:h:uid": "", //用户ID
        "e:u:phone": "", //手机号
        "e:h:viptype":"",//充值套餐
        "e:h:pay_type":"",//充值类型
        "e:h:status":"",//支付状态
      },
      datePay: [], //日期
      //付费状态
      statusList: [
        {
          value: 0,
          label: "支付中",
        },
        {
          value: 1,
          label: "支付完成",
        },
        {
          value: 2,
          label: "支付失败",
        },
      ],
      //充值套餐
      comTypeList:[
         {
          value: 2,
          label: "7天会员",
        },
        {
          value: 3,
          label: "1个月会员",
        },
        {
          value: 4,
          label: "3个月会员",
        },
        {
          value: 5,
          label: "12个月会员",
        },
      ],
      //充值状态
      rechargeStatusList: [
        {
          value: 1,
          label: "充值中",
        },
        {
          value: 2,
          label: "充值成功",
        },
        {
          value: 3,
          label: "充值失败",
        },
      ],
      //充值类型
      rechargeTypeList: [
        {
          value: 0,
          label: "后台充值",
        },
        {
          value: 1,
          label: "钻石",
        },
        {
          value: 2,
          label: "微信",
        },
        {
          value: 3,
          label: "支付宝",
        },
      ],
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
          minWidth: 130,
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
          width: 180,
          title: "充值时间",
          key: "create_time",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 100,
          title: "支付金额",
          key: "price",
          slot:"price",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 100,
          title: "充值套餐",
          key: "viptype",
          slot: "viptype",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 130,
          title: "充值类型",
          key: "pay_type",
          slot: "pay_type",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 130,
          title: "支付状态",
          key: "status",
          slot: "status",
          align: "center",
          className: "table-head-style",
        },
        
        {
          width: 160,
          title: "操作",
          fixed: "right",
          key: "action",
          slot: "action",
          align: "center",
          className: "table-head-style",
        },
      ],
      payTableData: [],
      //查看表格
      detailColumns: [
        {
          title: "时间",
          key: "addTime",
          align: "center",
          className: "table-head-style",
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
     
    };
  },
  created() {
    this.getRechargeList();
  },
  mounted() {},
  methods: {
    //获取充值记录列表
    getRechargeList() {
      this.spinShow = true
      rechargeViplistApi({
        ...this.exchangeFrom,
        ...this.searchForm,
        "x:h:create_time": this.datePay[0]? Date.parse(this.datePay[0]) / 1000: "",
        "d:h:create_time": this.datePay[1]? Date.parse(this.datePay[1]) / 1000: "",
      }).then((res) => {
        this.total = res.data.count;
        this.payTableData = res.data.list;
        this.spinShow = false
      });
    },
    //退款操作
    returnAction(id){
      this.spinShow = true
      payRecordReturnApi({
        e_id:id,
        field:"order_status",
        value:3
      }).then(res=>{
        this.$Message.success(res.msg)
        this.modalReturn = false
        this.getRechargeList()
        this.spinShow = false
      }).catch(err=>{
        this.$Message.warning(err.msg)
      })
    },
    //日期change事件
    dateChange(e) {
      this.datePay = e;
    },
    //   查看
    detailBtn(row) {
      this.detailForm = row
      this.modalLook = true;
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
        "k:u:nickname": "", //用户昵称
        "e:h:uid": "", //用户ID
        "e:u:phone": "", //手机号
        "e:h:viptype":"",//充值套餐
        "e:h:pay_type":"",//充值类型
        "e:h:status":"",//支付状态
      };
      this.datePay = []; //日期
      this.getRechargeList();
    },
    //搜索
    searchFormBtn() {
      this.getRechargeList();
    },
    //支付套餐change事件
    comboChange(e){
      this.searchForm['e:h:viptype'] = e
      this.getRechargeList();
    },
    //支付状态change事件
    orderIsChange(e) {
      this.searchForm["e:h:status"] = e;
      this.getRechargeList();
    },
   
    //充值类型
    typeIsChange(e) {
      this.searchForm["e:h:pay_type"] = e;
      this.getRechargeList();
    },
    //退款
    returnBtn(row) {
      this.returnForm = row
      this.modalReturn = true;
    },
    //确认退款
    confirmReturnBtn() {
      this.returnAction(this.returnForm.id)
    },
    // 分页
    pageChange(index) {
      this.exchangeFrom.page = index;
      this.getRechargeList()
    },
    pageSizeChange(index) {
      this.exchangeFrom.limit = index;
      this.getRechargeList()
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

.diamondTable {
  width: 500px;
}
.ivu-col-span-8,
.ivu-col-span-10,.ivu-col-span-12 {
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
