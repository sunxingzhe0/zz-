<template>
  <div>
    <!-- 头部搜索 -->
    <div class="header">
      <Form :model="exchangeFrom" :label-width="80">
        <!-- 第一排 -->
        <Row :gutter="24">
          <Col span="6" style="">
            <div class="line">
              <div class="text-left">ID搜索</div>
              <Input
                clearable
                class="input"
                v-model="exchangeFrom.textSearch"
                :border="false"
                placeholder="请输入名称、会员ID、电话、流水号"
              />
            </div>
          </Col>
          <Col span="6">
            <div class="line">
              <div class="text-left">金额</div>
              <Input
                clearable
                class="input"
                v-model="exchangeFrom.minmoney"
                placeholder="请输入最小金额"
              />
            </div>
          </Col>
          <Col span="1" class="connect"> — </Col>
          <Col span="5">
            <div class="line">
              <Input
                @on-blur="moneyMaxBlur"
                clearable
                style="border: 1px"
                class="input"
                v-model="exchangeFrom.maxmoney"
                placeholder="请输入最大金额"
              />
            </div>
          </Col>
        </Row>
        <!-- 二排 -->
        <Row :gutter="24">
          <Col span="6">
            <div class="line">
              <div class="text-left">充值时间</div>
              <DatePicker
                @on-change="rechageVal"
                placement="left-start"
                class="input"
                :value="exchangeFrom.rechargeValue"
                format="yyyy/MM/dd"
                type="datetimerange"
                placeholder="请选择充值时间"
                style="width: 200px"
              ></DatePicker>
            </div>
          </Col>

          <Col span="6">
            <div class="line">
              <div class="text-left">充值方式</div>
              <Select
                @on-change="rechargeSelect"
                class="select"
                v-model="exchangeFrom.rechargeWayValue"
                clearable
                style="width: 100%"
              >
                <Option
                  v-for="item in rechargeWayVal"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</Option
                >
              </Select>
            </div>
          </Col>
        </Row>
      </Form>
      <!-- 头部按钮 -->
      <Row class="search-button">
        <Button type="info" @click="searchRecharge">查询</Button>
        <Button type="info" @click="resetRecharge">重置</Button>
      </Row>
      <!-- 表格 -->
    </div>
    <div class="table" style="text-align: center">
      <Table ref="selection" border :columns="columns1" :data="rechargeData">
        <template slot-scope="{ row, index }" slot="actionType">
          <Tag type="border" color="blue">{{row._recharge_type}}</Tag>
           <!-- <Tag type="border" color="blue" v-if="row._recharge_type == 'routine'">小程序</Tag>
          <Tag type="border" color="blue" v-if="row._recharge_type == 'weixin'">公众号</Tag> -->
          <!-- <Tag type="border" color="blue" v-else>其他</Tag> -->
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="instance(row)"
            >停用</Button
          >
        </template>
      </Table>
      <Spin size="large" fix v-if="spinShow"></Spin>
      <!-- 分页 -->
      <div class="page">
        <Page
          :total="total"
          :current="formValidate.page"
          show-elevator
          show-sizer
          show-total
          @on-change="pageChange"
          @on-page-size-change="pageSizeChange"
          :page-size="formValidate.limit"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { rechargeList } from "@/api/redeem";
export default {
  components: {},
  data() {
    return {
      spinShow: true, //loadding
      exchangeFrom: {
        rechargeValue: [], //充值时间
        textSearch: "",
        minmoney: "",
        maxmoney: "",
        rechargeWayValue: "all",
      },
      rechargeWayVal: [
        {
          value: "all",
          label: "全部",
        },
        {
          value: "redeem",
          label: "兑换卡充值",
        },
        // {
        //   value: "zifu",
        //   label: "支付宝",
        // },
        // {
        //   value: "yinhangka",
        //   label: "银行卡",
        // },
        {
          value: "routine",
          label: "小程序充值",
        },
         {
          value: "weixin",
          label: "公众号充值",
        },
      ],

      columns1: [
        {
          type: "selection",
          width: 55,
        },
        {
          width: 100,
          title: "充值记录ID",
          key: "id",
          align: "center",
        },
         {
          width: 100,
          title: "会员ID",
          key: "uid",
          align: "center",
        },
        {
          title: "会员名称",
          key: "nickname",
          align: "center",
        },
        {
          title: "会员电话",
          key: "phone",
          align: "center",
        },
        {
          title: "充值金额",
          key: "price",
          align: "center",
        },
        {
          title: "充值方式",
          key: "_recharge_type",
          align: "center",
          slot: "actionType",
        },
        {
          title: "充值时间",
          key: "_add_time",
          align: "center",
        },
        {
          title: "支付流水号",
          key: "order_id",
          align: "center",
        },
      ],
      rechargeData: [],
      total: 0,
      formValidate: {
        page: 1,
        limit: 10,
      },
      statu: "停用",
    };
  },
  computed: {},
  created() {
    this.getRechargeLis();
  },
  methods: {
    //处理时间格式
    //时间格式转换
    dateFormat: function (time) {
      var date = new Date(time);
      var year = date.getFullYear();
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var seconds =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // 拼接
      return year + "/" + month + "/" + day;
      // return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    },
    //获取充值列表
    getRechargeLis() {
      (this.spinShow = true); //loadding
      // let data = this.exchangeFrom.rechargeValue[0]== undefined || this.exchangeFrom.rechargeValue[0]==""? "": this.dateFormat(this.exchangeFrom.rechargeValue[0])+" "+"00:00:00" +"-" 
      // +this.dateFormat(this.exchangeFrom.rechargeValue[1])+" "+"23:59:59";
      let data = this.exchangeFrom.rechargeValue[0]== undefined || this.exchangeFrom.rechargeValue[0]==""? "": this.dateFormat(this.exchangeFrom.rechargeValue[0])+"-" 
      +this.dateFormat(this.exchangeFrom.rechargeValue[1]);
      let recharge_type = this.exchangeFrom.rechargeWayValue=="all"?"": this.exchangeFrom.rechargeWayValue
      rechargeList({
        min_price: this.exchangeFrom.minmoney,
        max_price: this.exchangeFrom.maxmoney,
        nickname: this.exchangeFrom.textSearch,
        data: data,
        recharge_type: recharge_type,
        ...this.formValidate,
      }).then((res) => {
        (this.spinShow = false), //loadding
          (this.rechargeData = res.data.list);
        this.total = res.data.count;
      });
    },
    //重置
    resetRecharge() {
       (this.spinShow = true); //loadding
      (this.exchangeFrom = {
        rechargeValue: [], //充值时间
        textSearch: "",
        minmoney: "",
        maxmoney: "",
        rechargeWayValue: "all",
      }),
        (this.formValidate = {
          page: 1,
          limit: 10,
        });
      //重新获取列表
      this.getRechargeLis(); //loadding
    },
    //充值方式选择
    rechargeSelect(val) {
      this.rechargeWayValue = val;
      console.log(this.rechargeWayValue, "充值选择");
    },
    // 最大金额判断
    //失焦事件
    moneyMaxBlur() {
      var maxMoney = parseInt(this.exchangeFrom.maxmoney);
      var minMoney = parseInt(this.exchangeFrom.minmoney);
      if (maxMoney < minMoney) {
        this.$Message.warning("最大值不能小于最小值哦！");
        this.exchangeFrom.maxmoney = "";
      }
    },
    //充值时间事件
    rechageVal(val) {
      this.exchangeFrom.rechargeValue = val;
      // console.log(this.rechargeValue,'充值时间')
    },

    // 表格全选全不选
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    //查询
    searchRecharge() {
        this.formValidate.page = 1;
      this.formValidate.limit = 10;
      this.$set(this.formValidate, 'page', 1)
      this.getRechargeLis()
     
    },
    // 分页
    pageChange(index) {
      this.formValidate.page = index;
      this.getRechargeLis();
    },
    pageSizeChange(index) {
      this.formValidate.limit = index;
      this.getRechargeLis();
    },
  },
};
</script>

<style scoped>
/*头部th*/
/deep/ .ivu-table-header th {
  color: #333;
  font-weight: bold;
  background-color: #f2f2f2 !important;
  /* border: none; */
}
.header {
  box-sizing: border-box;
  background: #ffff;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.page {
  text-align: center;
}
.table {
  margin: 2rem 0;
  background-color: #fff;
  padding: 2.5rem 1rem;
}
.search-button {
  text-align: left;
  margin-top: 4rem;
}
.search-button button {
  margin-right: 2rem;
  width: 9rem;
  height: 3.5rem;
  text-align: center;
}
.search-button button:nth-child(odd) {
  background-color: #0093ff;
}
.search-button button:nth-child(odd):hover {
  background-color: #00bdb6;
}
.search-button button:nth-child(even) {
  background-color: #fbfbfb;
  color: #555555;
  border-color: #c9c9c9;
}
.search-button button span {
  font-size: 15px;
}
.ivu-row:not(:last-child) {
  margin-bottom: 1.5rem;
}
.line {
  display: flex;
  border: 1px solid #d7d7d7;
  border-radius: 5px;
}
.line .text-left {
  flex: 0 0 30%;
  border-right: 1px solid #d7d7d7;
  font-size: 1.1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;
  color: #a2a2a2;
  border-right: 1px solid #d7d7d7;
}
.icon {
  flex: 0.3%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.line > .input {
  flex: 1;
  border: 0 !important;
  padding: 0.3rem 0.5rem !important;
}
.enTime >>> .ivu-input {
  padding: 1.6rem 0.8rem !important;
}
.enTime >>> .ivu-input-prefix {
  top: 5px;
}
/deep/ .ivu-input:focus {
  box-shadow: none;
}

.input >>> .ivu-input {
  border: 0 !important;
  padding: 0.34rem 0.5rem !important;
}
.input >>> .ivu-select-single .ivu-select-selection {
  border: 0;
  padding: 0.45rem 0.5rem;
}

.select >>> .ivu-select-selection {
  border: 0;
  padding: 0.3rem 0.5rem;
  height: 3.34rem;
}
/deep/.ivu-layout-content {
  padding: 0 !important;
  height: calc(100% - 80px);
  overflow: auto;
}
.connect {
  width: 0.9rem;
  height: 40px;
  line-height: 40px;
  text-align: center;
  padding: 0 !important;
}
</style>
