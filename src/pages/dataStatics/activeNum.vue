<template>
  <div class="">
    <!-- 搜索 -->
    <div class="search">
      <!-- 查询 -->

      <Select
        @on-change="dateChange"
        v-model="model1"
        style="
          width: 200px;
          text-align: center;
          width: 100px;
          margin-right: 20px;
        "
      >
        <Option
          style="text-align: center"
          v-for="item in activeType"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}</Option
        >
      </Select>
      <!-- //日活跃 -->
      <DatePicker
        @on-change="dayChange"
        :value="valueDate"
        format="yyyy-MM-dd"
        type="daterange"
        placeholder="请选择开始日期和结束日期"
        style="width: 200px"
      ></DatePicker>

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
      <Button
        style="margin-left: 20px"
        icon="ios-search"
        type="success"
        @click="exportClick"
        >导出Excel</Button
      >
    </div>
      <div  class="search search2">
        <span>上次统计时间：{{statusTime==0?'暂无':statusTime|formatDate2}}</span> 
      <Button @click="nowTotalClick(0)" style="margin:0 10px 0 25px">当前统计</Button> 
      <Button @click="nowTotalClick(1)">重新统计</Button> 
      </div> 
    <!-- 表格 -->
    <div class="table">
      <!-- 表格 -->
      <Table border :columns="activeColumns" :data="activeData">
         <template slot-scope="{ row, index }" slot="dateChange">
          <span v-if="model1=='week'" v-html="row.datestr"></span>
          <span v-else>{{row.date | formatDate}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="rate-30">
          <span v-if="row.count_active!=0">{{((row.count_active_30/ row.count_active)*100).toFixed(2)}}%</span>
          <span v-else>0.00%</span>
        </template>
        <template slot-scope="{ row, index }" slot="rate-60">
          <span v-if="row.count_active!=0">{{((row.count_active_60/ row.count_active)*100).toFixed(2) }}%</span>
           <span v-else>0.00%</span>
        </template>
        <template slot-scope="{ row, index }" slot="rate-120">
          <span v-if="row.count_active!=0">{{((row.count_active_120/ row.count_active)*100).toFixed(2) }}%</span>
          <span v-else>0.00%</span>
        </template>
        <template slot-scope="{ row, index }" slot="rate-240">
          <span v-if="row.count_active!=0">{{((row.count_active_240/ row.count_active)*100).toFixed(2) }}%</span>
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
import { chanelNAmeListApi,userActiveDateApi,userActiveMonthApi, userActiveWeekApi,hanfSelfTotalApi} from "@/api/active";
import {formatDate} from '@/utils/validate'
export default {
  filters: {
            formatDate(time) {
                if (time !== 0) {
                    let date = new Date(time * 1000)
                    return formatDate(date, 'yyyy-MM-dd')
                }
            },
             formatDate2(time) {
                if (time !== 0) {
                    let date = new Date(time * 1000)
                    return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
                }
            }
        },
  data() {
    return {
      statusTime:0,
      modelChanel:'',
      ChanelType:[],
      spinShow:true,
      total: 0, //统计
      exchangeFrom: {
        page: 1,
        limit: 10,
      },
      valueDate: [], //日活跃

      model1: "date", //活跃方式
      model2: "DESC", //排列方式
      activeType: [
        {
          value: "date",
          label: "日活跃",
        },
        {
          value: "week",
          label: "周活跃",
        },
        {
          value: "month",
          label: "月活跃",
        },
      ],
      sortType: [
        {
          value: "ASC",
          label: "升序",
        },
        {
          value: "DESC",
          label: "降序",
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
           width: 97,
          title: "日期",
          key: "date",
          slot:"dateChange",
          align: "center",
          className: "table-head-style",
        
        },
        {
          width: 90,
          title: "活跃用户数(30分钟)",
          key: "count_active_30",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 90,
          title: "用户活跃率(30分钟)",
          slot:"rate-30",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 90,
          title: "活跃用户数(60分钟)",
          key: "count_active_60",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "用户活跃率(60分钟)",
         slot:"rate-60",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "活跃用户数(120分钟)",
          key: "count_active_120",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "用户活跃率(120分钟)",
         slot:"rate-120",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "活跃用户数(240分钟)",
          key: "count_active_240",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "用户活跃率(240分钟)",
          slot:"rate-240",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 90,
          title: "充值金额",
          key: "time_recharge",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 90,
          title: "充值人数",
          key: "count_recharge",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 90,
          title: "当周总用户数",
          key: "count_active",
          align: "center",
          className: "table-head-style",
        },
      ],
      val: "",
    };
  },
  created() {
    //获取某年第几周
    // let date = new Date("2021-02-28");
    // console.log(date,'kkk');
    // this.getWeekInYear(date);
    // //获取当前月的第一天
    // this.valueDate[0] = this.$moment().startOf("month").format("YYYY-MM-DD");
    // //获取当前月的最后一天
    // this.valueDate[1] = this.$moment().endOf("month").format("YYYY-MM-DD");
    this.getChanelList()
    this.getUserStaticsLis();
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
    //获取用户活跃统计接口---日
    getUserStaticsLis() {
      console.log(this.model1, "判断时间格式");
      userActiveDateApi({
        ...this.exchangeFrom,
        // type: this.model1,
        "x:date": this.valueDate[0] ? Date.parse(this.valueDate[0] +" 00:00:00") / 1000 : "",
        "d:date": this.valueDate[1] ? Date.parse(this.valueDate[1] +" 23:59:59") / 1000 : "",
        "o:date": this.model2,
        "e:channel_id":this.modelChanel||this.modelChanel===0?this.modelChanel:"",
      }).then((res) => {
        this.total = res.data.count;
        this.activeData = res.data.list;
        this.statusTime = res.data.stats_time
        this.spinShow = false
      
      });
    },
    //月
    getUserMonthLis() {
      userActiveMonthApi({
        ...this.exchangeFrom,
        "x:date": this.valueDate[0] ? Date.parse(this.valueDate[0] +" 00:00:00") / 1000 : "",
        "d:date": this.valueDate[1] ? Date.parse(this.valueDate[1] +" 23:59:59") / 1000 : "",
        "o:date": this.model2,
        "e:channel_id":this.modelChanel||this.modelChanel===0?this.modelChanel:"",
      }).then((res) => {
        this.total = res.data.count;
        this.activeData = res.data.list;
        this.statusTime = res.data.stats_time
        this.spinShow = false
 
      });
    },
    //周
    getUserWeekLis() {
      userActiveWeekApi({
        ...this.exchangeFrom,
        "x:date": this.valueDate[0] ? Date.parse(this.valueDate[0] +" 00:00:00") / 1000 : "",
        "d:date": this.valueDate[1] ? Date.parse(this.valueDate[1] +" 23:59:59") / 1000 : "",
        "o:date": this.model2,
        "e:channel_id":this.modelChanel||this.modelChanel===0?this.modelChanel:"",
      }).then((res) => {
        this.total = res.data.count;
        this.activeData = res.data.list;
        this.statusTime = res.data.stats_time
        this.spinShow = false
 
      });
    },
  
      // 渠道change事件
    chanelChange(e){
      this.modelChanel = e
        if(this.model1=="date"){
        this.getUserStaticsLis()
      }else if(this.model1=="month"){
        this.getUserMonthLis()
      }else if(this.model1=="week"){
        this.getUserWeekLis()
      }
    },
    //日期活跃选择change事件
    dateChange(e) {
      this.model1 = e;
      this.exchangeFrom.page = 1
      // console.log(e,'jjjk');
      if(this.model1=="date"){
        this.getUserStaticsLis()
      }else if(this.model1=="month"){
        this.getUserMonthLis()
      }else if(this.model1=="week"){
        this.getUserWeekLis()
      }
    },
    //日活跃change
    dayChange(e) {
      this.valueDate = e;
      this.exchangeFrom.page = 1
      this.getUserStaticsLis()
    },
    //周活跃
    weekChange(e) {
      this.valueWeek = e;
      this.exchangeFrom.page = 1
      this.getUserWeekLis()
    },
    // 月活跃
    monthChange(e) {
      this.valueMonth = e;
      this.exchangeFrom.page = 1
      this.getUserMonthLis();
    },
    //搜索
    searchClick() {
      //判断当前选的活跃方式
       if(this.model1=="date"){
        this.getUserStaticsLis()
      }else if(this.model1=="month"){
        this.getUserMonthLis()
      }else if(this.model1=="week"){
        this.getUserWeekLis()
      }
    },
    //导出
    exportClick() {
      let startDate = this.valueDate[0] ? Date.parse(this.valueDate[0] +" 00:00:00") / 1000 : "";
       let endDate = this.valueDate[1] ? Date.parse(this.valueDate[1] +" 23:59:59") / 1000 : "";
      this.$Modal.confirm({
        title: "确定要导出列表数据吗？",
        
        onOk: () => {
           if(this.model1=="date"){
            //  console.log(`${location.origin}/adminapi/statistic/user/active_date_list?` +"export=" +1+"&o:date=" +this.model2 +"&x:date=" +startDate +"&d:date="+endDate+"&e:channel_id="+this.modelChanel,'11111');
                window.location.href =`${location.origin}/adminapi/statistic/user/active_date_list?` +"export=" +1+"&o:date=" +this.model2 +"&x:date=" +startDate +"&d:date="+endDate+"&e:channel_id="+this.modelChanel;
            }else if(this.model1=="month"){
              // console.log(`${location.origin}/adminapi/statistic/user/active_month_list?` +"export=" +1+"&o:date=" +this.model2 +"&x:date=" +startDate +"&d:date="+endDate+"&e:channel_id="+this.modelChanel,'11111');
              window.location.href =`${location.origin}/adminapi/statistic/user/active_month_list?` +"export=" +1+"&o:date=" +this.model2 +"&x:date=" +startDate +"&d:date="+endDate+"&e:channel_id="+this.modelChanel;
            }else if(this.model1=="week"){
              // console.log(`${location.origin}/adminapi/statistic/user/active_week_list?` +"export=" +1+"&o:date=" +this.model2 +"&x:date=" +startDate +"&d:date="+endDate+"&e:channel_id="+this.modelChanel,'11111');
              window.location.href =`${location.origin}/adminapi/statistic/user/active_week_list?` +"export=" +1+"&o:date=" +this.model2 +"&x:date=" +startDate +"&d:date="+endDate+"&e:channel_id="+this.modelChanel;
            }
         
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
                  if(this.model1=="date"){
                    this.getUserStaticsLis()
                  }else if(this.model1=="month"){
                    this.getUserMonthLis()
                  }else if(this.model1=="week"){
                    this.getUserWeekLis()
                  }
                  this.spinShow = false
                // this
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
        if(this.model1=="date"){
        this.getUserStaticsLis()
      }else if(this.model1=="month"){
        this.getUserMonthLis()
      }else if(this.model1=="week"){
        this.getUserWeekLis()
      }
    },
    pageSizeChange(index) {
      this.exchangeFrom.limit = index;
       if(this.model1=="date"){
        this.getUserStaticsLis()
      }else if(this.model1=="month"){
        this.getUserMonthLis()
      }else if(this.model1=="week"){
        this.getUserWeekLis()
      }
    },
  },
};
</script>
<style scoped lang="less">
.search {
  display: flex;
  background-color: #fff;
  padding: 20px 10px 15px 20px;
}
.search2{
  margin: 0 0 20px 0;
  display: flex;
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
