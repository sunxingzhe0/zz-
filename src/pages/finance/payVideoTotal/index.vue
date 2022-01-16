<template>
  <div class="search">
    <!-- 查询 -->
    <div class="header">
        <span>日期选择：</span>
        <DatePicker type="datetimerange" @on-change="dateChange" :value="datePay" format="yyyy-MM-dd" placeholder="开始时间-结束时间" style="width: 300px"></DatePicker>
        <Button icon="ios-search" type="primary" style="margin-left:15px" @click="searchClick">搜索</Button>

    </div>
    <!-- 表格 -->
    <div class="table">
      <Table border :columns="payColumns" :data="payTableData">
        <!-- 封面 -->
        <!-- <template slot-scope="{ row, index }" slot="vedio_cover">
          <viewer>
            <img style="width: 40px; height: 40px" :src="row.vedio_cover" />
          </viewer>
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
 
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import { payVideoCountApi } from "@/api/finance";
import { formatDate } from "@/common/date.js";
export default {
  components: {},
  data() {
    return {
     
      spinShow: true,
      total: 0,
     
      exchangeFrom: {
        page: 1,
        limit: 10,
      },
      
      // 搜索
      searchForm: {
     
      },
      datePay: [], //日期
      //表格
      payColumns: [
        {
          width: 180,
          title: "日期",
          key: "date",
          align: "center",
          className: "table-head-style",
           render: (h, params) => {
            return h(
              "div",
              formatDate(
                new Date(params.row.date * 1000),
                "yyyy-MM-dd"
              )
              // Date是后台时间戳参数字段
              // 'yyyy-MM-dd hh:mm' 对应的时间格式 2018-12-21 18:46
              // 格式可以自行修改，例如 'yyyy-MM-dd' -> 2018-12-21,  'yyyy-MM' -> 2018-12
            );
          },
        },
        {
          title: "视频付费次数合计",
          key: "time_vedio_pay",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "视频付费次数(会员)",
          key: "",
          align: "center",
          className: "table-head-style",
        },
      
        {
          title: "视频付费次数(非会员)",
          key: "",
          align: "center",
          className: "table-head-style",
        },

        {
          title: "视频购买人数合计",
          key: "count_vedio_pay",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "视频购买人数合计(会员)",
          key: "",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "视频购买人数合计(非会员)",
          key: "",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "付费总合计(钻石)",
          key: "time_recharge",
          align: "center",
          className: "table-head-style",
        },
       {
          title: "会员付费合计(钻石)",
          key: "",
          align: "center",
          className: "table-head-style",
        },
         {
          title: "非会员付费合计(钻石)",
          key: "",
          align: "center",
          className: "table-head-style",
        },
         {
          title: "服务费合计(钻石)",
          key: "total_vedio_service",
          align: "center",
          className: "table-head-style",
        },
         {
          title: "作者收入合计(钻石)",
          key: "total_vedio_income",
          align: "center",
          className: "table-head-style",
        },
      ],
      payTableData: [],
    
     
    };
  },
  created() {
      this.getPayVideoTotalLis()
  },
  mounted() {},
  methods: {
    //获取视频付费统计
    getPayVideoTotalLis(){
        this.spinShow= true
        payVideoCountApi({
            ...this.exchangeFrom,
            'x:date':this.datePay[0]?Date.parse(this.datePay[0] +" 00:00:00") / 1000: "",
            'd:date':this.datePay[1]?Date.parse(this.datePay[1] +" 23:59:59") / 1000: "",
        }).then(res=>{
            this.total = res.data.count
            this.payTableData = res.data.list
            // console.log(this.payTableData,'this.payTableData');
            this.spinShow= false
        })
    },
    // 时间change事件
    dateChange(e){
        this.datePay = e
    },
    // 搜索
    searchClick(){
        this.getPayVideoTotalLis()
    },
    // 分页
    pageChange(index) {
      this.exchangeFrom.page = index;
      this.getPayVideoTotalLis();
    },
    pageSizeChange(index) {
      this.exchangeFrom.limit = index;
      this.getPayVideoTotalLis();
    },

  },
};
</script>

<style scoped>
/deep/.ivu-page-options-elevator{
  margin-left: 12px;
}
.header{
    margin-left: 20px;
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
