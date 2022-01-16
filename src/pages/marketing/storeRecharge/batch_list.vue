<template>
  <div>
    <!-- 头部搜索 -->
    <div class="header">
      <Form :model="exchangeFrom" :label-width="80">
        <!-- 第一排 -->
        <Row :gutter="24">
          <Col span="7" style="">
            <div class="line">
              <div class="text-left">批次ID搜索</div>
              <Input
                clearable
                class="input"
                v-model="exchangeFrom.textSearch"
                :border="false"
                placeholder="请输入ID"
              />
            </div>
          </Col>

          <Col span="7">
            <div class="line">
              <div class="text-left">充值时间</div>
              <DatePicker
                @on-change="rechageVal"
                placement="left-start"
                class="input"
                :value="exchangeFrom.rechargeValue"
                format="yyyy/MM/dd HH:mm:ss"
                type="datetimerange"
                placeholder="请选择充值时间"
                style="width: 200px"
              ></DatePicker>
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
          <Tag type="border" color="blue" v-if="row.type == '0'">金额</Tag>
          <Tag type="border" color="blue" v-if="row.type == '1'">商品</Tag>
        </template>
        <template slot-scope="{ row, index }" slot="actionState">
          <span v-if="row.isopen == '0'">未启用</span>
          <span v-if="row.isopen == '1'">已启用</span>
          <!-- {{row.isopen}} -->
          <!-- <view v-if="row.isopen=='1'"> 已启用</view>
           <view v-if="row.isopen=='0'"> 未启用</view> -->
        </template>

        <!-- </template> -->
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
import { getBatchList } from "@/api/redeem";
export default {
  components: {},
  data() {
    return {
      spinShow: false, //loadding
      exchangeFrom: {
        rechargeValue: [], //充值时间
        textSearch: "",
      },
      columns1: [
        {
          type: "selection",
          width: 55,
        },
        {
          width: 100,
          title: "批次ID",
          key: "id",
          align: "center",
        },
        {
          width: 150,
          title: "卡名",
          key: "name",
          align: "center",
          render:(h, params) => {
          return h('div', [
            h('span', {
              style: {display: 'inline-block', 
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap'},
              domProps: {title: params.row.name},
              on:{click:(e) => { e.stopPropagation();}}
            }, params.row.name)
          ]);
        } 
        },
        {
          width:80,
          title: "生成数量",
          key: "count",
          align: "center",
        },
        {
          width:150,
          title: "生成期",
          key: "add_time",
          align: "center",
        },
        {
          title: "类型",
          key: "type",
          align: "center",
          slot: "actionType",
        },
        {
          title: "兑换金额",
          key: "money",
          align: "center",
        },

        {
          title: "商品名称",
          key: "store_name",
          align: "center",
          width: 150,
          render:(h, params) => {
          return h('div', [
            h('span', {
              style: {display: 'inline-block', 
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap'},
              domProps: {title: params.row.store_name},
              on:{click:(e) => { e.stopPropagation();}}
            }, params.row.store_name)
          ]);
        } 
        },
        {
          title: "商品规格",
          key: "suk",
          align: "center",
        },
        {
          width:150,
          title: "有效期",
          key: "start_time",
          align: "center",
        },
        {
          title: "状态",
          key: "isopen",
          align: "center",
          slot: "actionState",
        },
      ],
      rechargeData: [],
      total: 0,
      formValidate: {
        page: 1,
        limit: 10,
      },
    };
  },
  computed: {},
  created() {
    this.batchListData();
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
      return year + "-" + month + "-" + day;
      // return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    },
    //    获取兑换卡批次列表
    batchListData() {
      (this.spinShow = true), //loadding
        console.log(111);
      let begin_time =
        this.exchangeFrom.rechargeValue[0]=="" ||this.exchangeFrom.rechargeValue[0]==undefined
          ?"": this.dateFormat(this.exchangeFrom.rechargeValue[0]) +"\xa0" +"00:00:00";

      let end_time =
        this.exchangeFrom.rechargeValue[0]=="" ||this.exchangeFrom.rechargeValue[0]==undefined
          ?"": this.dateFormat(this.exchangeFrom.rechargeValue[1]) +"\xa0" +"23:59:59" ;
      getBatchList({
        id: this.exchangeFrom.textSearch,
        begin_time: begin_time,
        end_time: end_time,
        ...this.formValidate,
      }).then((res) => {
        (this.spinShow = false), //loadding
          (this.rechargeData = res.data.data);
        this.total = res.data.count;
      });
    },

    //充值时间事件
    rechageVal(val) {
      this.exchangeFrom.rechargeValue = val;
      // console.log(this.rechargeValue,'充值时间')
    },

    //查询
    searchRecharge() {
      this.exchangeFrom.page = 1;
      this.exchangeFrom.limit = 10;
      this.$set(this.formValidate, 'page', 1)
      this.batchListData()
    },
    //重置
    resetRecharge() {
      this.exchangeFrom = {
        rechargeValue: [], //充值时间
        textSearch: "",
      };
      this.batchListData();
    },
    // 分页
    pageChange(index) {
      this.formValidate.page = index;
      this.batchListData();
    },
    pageSizeChange(index) {
      this.formValidate.limit = index;
      this.batchListData();
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
