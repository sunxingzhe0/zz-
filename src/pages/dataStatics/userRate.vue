<template>
  <div class="">
    <!-- 搜索 -->
    <div class="search">
      <!-- 查询 -->

      <div style="margin-left: 20px">
        <span>时间选择：</span>
        <!-- //日活跃 -->
        <DatePicker
          @on-change="dayChange"
          :value="valueDay"
          format="yyyy-MM-dd"
          type="daterange"
          placeholder="请选择开始时间和结束时间"
          style="width: 200px"
        ></DatePicker>
      </div>

      <div style="margin-left: 20px">
        <span>排列方式：</span>
        <Select v-model="model2" style="width: 120px">
          <Option
            v-for="item in sortType"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </div>
       <!-- 渠道搜索 -->
      <div style="margin-left: 20px">
        <span>渠道：</span>
        <Select clearable filterable @on-change="chanelChange" v-model="modelChanel" style="width: 200px">
          <Option
            v-for="item in ChanelType"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </div>
      <Button
        style="margin-left: 20px"
        icon="ios-search"
        type="primary"
        @click="searchClick"
        >搜索</Button
      >
    </div>
     <div  class="search search2">
        <span>上次统计时间：{{statusTime}}</span> 
      <Button @click="nowTotalClick(0)" style="margin:0 10px 0 25px">当前统计</Button> 
      <Button @click="nowTotalClick(1)">重新统计</Button> 
      </div> 
    <!-- 表格 -->
    <div class="table">
      <!-- 表格 -->
      <Table border :columns="activeColumns" :data="activeData">
        
         <template slot-scope="{ row, index }" slot="addRate">
          <span v-if="row.count_add!=0">{{((row.count_recharge / row.count_add)*100).toFixed(2)}}%</span>
          <span v-else>0.00%</span>
        </template>
         <template slot-scope="{ row, index }" slot="action2">
          <span v-if="row.count_add!=0">{{((row.count_keep_1 / row.count_add)*100).toFixed(2)}}%</span>
          <span v-else>0.00%</span>
        </template>
        <template slot-scope="{ row, index }" slot="action3">
          <span v-if="row.count_add!=0">{{((row.count_keep_3 / row.count_add)*100).toFixed(2)}}%</span>
          <span v-else>0.00%</span>
        </template>
        <!-- 充值总金额/充值用户数 -->
        <template slot-scope="{ row, index }" slot="action7">
          <span v-if="row.count_add!=0">{{((row.count_keep_7 / row.count_add)*100).toFixed(2)}}%</span>
          <span v-else>0.00%</span>
        </template>
             <!-- 充值总金额/日活跃用户数 -->
        <template slot-scope="{ row, index }" slot="action30">
          <span v-if="row.count_add!=0">{{((row.count_keep_30 / row.count_add)*100).toFixed(2)}}%</span>
          <span v-else>0.00%</span>
        </template>
        <template slot-scope="{ row, index }" slot="action90">
          <span v-if="row.count_add!=0">{{((row.count_keep_90 / row.count_add)*100).toFixed(2)}}%</span>
          <span v-else>0.00%</span>
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
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
import { userRateListApi,chanelNAmeListApi,hanfSelfTotalApi} from "@/api/active";
import { formatDate } from "@/common/date.js";
export default {
  data() {
    return {
      statusTime:'',//手动统计时间
      modelChanel:'',
      ChanelType:[],
      spinShow:true,
      total: 0,
      exchangeFrom: {
        page: 1,
        limit: 10,
      },
      valueDay: [], //日活跃
      model2: "DESC", //排列方式
      sortType: [
        {
          value: "ASC",
          label: "正序",
        },
        {
          value: "DESC",
          label: "倒序",
        },
      ],
      activeData: [], //表格
      //表格
     activeColumns: [
        {
          width: 60,
          title: "序号",
          type: "index",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "日期",
          key: "date",
          align: "center",
          className: "table-head-style",
          render: (h, params) => {
          if (params.row.date===0) return h("span", "暂无数据");
          else{
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
          }
          },
        },
        {
          title: "新增用户数",
          key: "count_add",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "新增充值用户数",
          key: "count_recharge",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "新增充值转化率",
          slot: "addRate",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "次日留存用户数",
          key: "count_keep_1",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "次日后留存率",
          slot:"action2",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "三日后留存用户数",
          key: "count_keep_3",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "三日后留存率",
          slot:"action3",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "七日后留存用户数",
          key: "count_keep_7",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "七日后留存率",
          slot:"action7",
          align: "center",
          className: "table-head-style",
        },
       {
          title: "三十日后留存用户数",
          key: "count_keep_30",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "三十日后留存率",
           slot:"action30",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "九十日后留存用户数",
          key: "count_keep_90",
          align: "center", 
          className: "table-head-style",
        },
        {
          title: "九十日后留存率",
          slot:"action90",
          align: "center",
          className: "table-head-style",
        },
      ],
    };
  },
  created() {
    this.getChanelList()
    this.getPayRateLis();
    // //获取当前月的第一天
    // this.valueDay[0] = this.$moment().startOf('month').format('YYYY-MM-DD');
    // //获取当前月的最后一天
    // this.valueDay[1] = this.$moment().endOf('month').format('YYYY-MM-DD')
  },

  methods: {
      // 获取渠道名称
    getChanelList(){
      chanelNAmeListApi({
          status: 1,
          gid: 67,
      }).then(res=>{
        
        this.ChanelType = res.data.list.map(item=>{
          return{
            value:item.id,
            label:item.name
          }
        })
         this.ChanelType.unshift({
          value:0,
          label:"官方渠道"
        })
        // console.log(this.ChanelType,'res');
      })
    },
    //获取付费率充值率接口
    getPayRateLis() {
      userRateListApi({
        ...this.exchangeFrom,
        type: "retention",
        "x:date": this.valueDay[0] ? Date.parse(this.valueDay[0] +" 00:00:00") / 1000 : "",
        "d:date": this.valueDay[1] ? Date.parse(this.valueDay[1] +" 23:59:59") / 1000 : "",
        "o:date": this.model2,
        "e:channel_id":this.modelChanel||this.modelChanel===0?this.modelChanel:""
      }).then((res) => {
        this.total = res.data.count;
        this.activeData = res.data.list;
         this.statusTime = res.data.stats_time==0?'暂无': formatDate(
            new Date(res.data.stats_time * 1000),
            "yyyy-MM-dd hh:mm:ss"
          )
        this.spinShow  = false
      });
    },
    //时间change事件
    dayChange(e) {
      this.valueDay = e;
    },
       // 渠道change事件
    chanelChange(e){
      this.modelChanel = e
      this.getPayRateLis()
    },
    //搜索
    searchClick() {
      this.getPayRateLis()
    },
    //导出
    exportClick() {
      this.$Modal.confirm({
        title: "确定要导出列表数据吗？",
        onOk: () => {
          //  var aa=
          //  window.location.href =
          //     `${location.origin}/adminapi/examine/withdrawal/list?` +
          //     "export=" +1
          //     +"&k_w:real_name=" +
          //     this.exportForm["k_w:real_name"] +
          //     "&e_w:uid=" +
          //     this.exportForm["e_w:uid"] +
          //     "&e_w:phone=" +
          //      this.exportForm['e_w:phone'] +
          //     "&x_w:examine_time=" +
          //     this.exportForm["x_w:examine_time"] +
          //     "&d_w:examine_time=" +
          //      this.exportForm["d_w:examine_time"];
          //  console.log(aa,'lklk');
          // this.$Message.success('已导出');
          //   // window.location.href =`${location.origin}/adminapi/marketing/redeem?export=` + 1;
        },
        onCancel: () => {
          this.$Message.info("已取消");
        },
      });
    },
    // 手动统计
    nowTotalClick(num){
      this.spinShow = true
      this.$Modal.confirm({
          title: num==0?'确定要当前统计？':'确定要重新统计？',
          onOk: () => {
              hanfSelfTotalApi({
                re:num
              }).then(res=>{
                this.$Message.warning(res.msg)
                this.getPayRateLis()
                this.spinShow = false
              }).catch(err=>{
                this.$Message.warning(err.msg)
                this.spinShow = false
              })
          },
          onCancel: () => {
              this.$Message.info('Clicked cancel');
              this.spinShow = false
          }
      });
        
    },
    // 分页
    pageChange(index) {
      this.exchangeFrom.page = index;
      this.getPayRateLis(); //列表
    },
    pageSizeChange(index) {
      this.exchangeFrom.limit = index;
      this.getPayRateLis(); //列表
    },
  },
};
</script>
<style scoped lang="less">
.search {
  display: flex;
  background-color: #fff;
  // margin: 0 0 20px 0;
  padding: 20px 10px 15px 20px;
}
.search2{
  margin: 0 0 20px 0;
  display: flex;
  padding-left: 40px;
  align-items: center;
}
.table {
  background-color: #fff;
  padding: 20px;
}
.page {
  text-align: right;
  padding-bottom: 40px;
}
</style>
