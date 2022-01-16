<template>
  <div class="">
    <!-- 搜索 -->
    <div class="search">
      <!-- 查询 -->

      <DatePicker
        @on-change="dayChange"
        :value="valueDay"
        format="yyyy-MM-dd"
        type="daterange"
        placeholder="请选择开始时间和结束时间"
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
        <span>上次统计时间：{{statusTime}}</span> 
      <Button @click="nowTotalClick(0)" style="margin:0 10px 0 25px">当前统计</Button> 
      <Button @click="nowTotalClick(1)">重新统计</Button> 
      </div> 
    <!-- 表格 -->
    <div class="table">
      <!-- 表格 -->
      <Table border :columns="activeColumns" :data="activeData">
        <template slot-scope="{ row, index }" slot="detail">
          <Button
            style="margin-left: 20px"
            icon="ios-search"
            type="success"
            @click="lookClick(row)"
            >查看</Button
          >
        </template>
      <!-- 苹果 -->
      <template slot-scope="{ row, index }" slot="ios_down">
          <span>{{ Number(row.ios_down) + Number(row.other_down) }}</span>
        </template>
        
        <template slot-scope="{ row, index }" slot="ios_reg">
          <span>{{ Number(row.ios_reg) + Number(row.other_reg) }}</span>
        </template>
        <!-- 下载次数合计 -->
        <template slot-scope="{ row, index }" slot="total1">
          <span>{{ Number(row.android_down) + Number(row.ios_down) + Number(row.other_down) }}</span>
        </template>
        <!-- 下载次数合计 -->
        <template slot-scope="{ row, index }" slot="totalCount">
          <span>{{ Number(row.android_reg) + Number(row.ios_reg)+ Number(row.other_reg) }}</span>
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
    <!-- 查看渠道数据 -->
    <Modal v-model="modalLook" @on-cancel="cancelChannelModel" fullscreen>
      <p slot="header" style="color: #333; text-align: center;font-size:18px">查看详情</p>
      <div class="searchModel">	
          <Button @click="userSortClick('DESC')" :type="userSortFlag==='DESC'?'success':'default'">倒序</Button>
          <Button style="margin-left:15px" @click="userSortClick('ASC')" :type="userSortFlag==='ASC'?'success':'default'">升序</Button>
          <Button style="margin-left:25px" type="success" @click="exportClick2">导出EXCEL</Button>
      </div>

      <div style="text-align: center">
        <p style="text-align: left;font-size:15px;margin-bottom:10px">{{ modelDate }}</p>
        <Table border :columns="lookColumns" :data="lookData">
           <template slot-scope="{ row, index }" slot="chanelAvatar">
            <viewer>
              <img style="width: 40px; height: 40px" :src="row.avatar" />
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
      <p slot="footer"></p>
      <Spin size="large" fix v-if="spinShow2"></Spin>
    </Modal>
  </div>
</template>
<script>
import { appdownListApi, appdownChannelApi,chanelNAmeListApi,hanfSelfTotalApi} from "@/api/active";
import { formatDate } from "@/common/date.js";

export default {
  data() {
    return {
      spinShow2:false,
      statusTime:'',//手动统计时间
      detaiRowDate:"",
      userSortFlag:'DESC',
      modelChanel:'',
      modelDate: "", //日期
      spinShow: true,
      total: 0,
      total2:0,
      exchangeFrom2: {
        page: 1,
        limit: 10,
      },
      exchangeFrom: {
        page: 1,
        limit: 10,
      },
      modalLook: false, //渠道数据弹框
      valueDay: [], //日活跃
      model2: "DESC", //排列方式

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
      ChanelType:[],
      activeData: [], //表格
      lookData: [],
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
          minWidth:100,
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
           minWidth:100,
          title: "下载页访问量(pv)",
          key: "android_pv",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth:100,
          title: "下载页访问用户数(uv)",
          key: "android_uv",
          align: "center",
          className: "table-head-style",
        },
        {
           minWidth:100,
          title: "安卓下载次数",
          key: "android_down",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth:100,
          title: "安卓注册量",
          key: "android_reg",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth:100,
          title: "h5下载次数",
          key: "ios_down",
          slot:"ios_down",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth:100,
          title: "h5注册量",
          key: "ios_reg",
          slot:"ios_reg",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth:100,
          title: "下载次数合计",
          slot: "total1",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth:100,
          title: "注册量合计",
          slot: "totalCount",
          align: "center",
          className: "table-head-style",
        },

        {
          minWidth:140,
          title: "查看详情",
          fixed: "right",
          slot: "detail",
          align: "center",
          className: "table-head-style",
        },
      ],
      //查看表格
      lookColumns: [
        {
           minWidth:60,
          title: "渠道ID",
          key: "channel_id",
          align: "center",
          className: "table-head-style",
        },
        {
           minWidth:100,
          title: "渠道名称",
          key: "channel_str",
          align: "center",
          className: "table-head-style",
        },
        {
           minWidth:100,
          title: "用户昵称",
          key: "nickname",
          align: "center",
          className: "table-head-style",
        },
        {
           minWidth:60,
          title: "用户ID",
          key: "uid",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth:80,
          title: "用户头像",
          slot:"chanelAvatar",
          align: "center",
          className: "table-head-style",
        },
         {
            minWidth:100,
          title: "用户签名",
          key: "autograph",
          align: "center",
          className: "table-head-style",
           render: (h, params) => {
            if (!params.row.autograph) return h("span", "暂无签名");
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
                    domProps: { title: params.row.autograph },
                    on: {
                      click: (e) => {
                        e.stopPropagation();
                      },
                    },
                  },
                  params.row.autograph
                ),
              ]);
            }
          },

        },
         {
            minWidth:60,
          title: "钻石数",
          key: "now_money",
          align: "center",
          className: "table-head-style",
        },
         {
            minWidth:60,
          title: "上级ID",
          key: "spread_uid",
          align: "center",
          className: "table-head-style",
        },
         {
            minWidth:60,
          title: "邀请人数",
          key: "count_invitee",
          align: "center",
          className: "table-head-style",
        },
         {
            minWidth:100,
          title: "注册时间",
          key: "add_time",
          render: (h, params) => {
          if (params.row.add_time===0) return h("span", "暂无数据");
          else{
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
          }
          },
          
          align: "center",
          className: "table-head-style",
        },
         {
           minWidth:100,
          title: "最后一次登陆时间",
          key: "last_time",
          align: "center",
          className: "table-head-style",
           render: (h, params) => {
          if (params.row.last_time===0) return h("span", "暂无数据");
          else{
              return h(
          "div",
          formatDate(
            new Date(params.row.last_time * 1000),
            "yyyy-MM-dd hh:mm:ss"
          )
          // Date是后台时间戳参数字段
          // 'yyyy-MM-dd hh:mm' 对应的时间格式 2018-12-21 18:46
          // 格式可以自行修改，例如 'yyyy-MM-dd' -> 2018-12-21,  'yyyy-MM' -> 2018-12
          );
          }
          },
        },
         {
           minWidth:100,
          title: "最后一次登录IP",
          key: "last_ip",
          align: "center",
          className: "table-head-style",
        },
         {
            minWidth:100,
          title: "cookies",
          key: "",
          align: "center",
          className: "table-head-style",
        },
         {
           minWidth:100,
          title: "操作系统",
          key: "last_os",
          align: "center",
          className: "table-head-style",
        },
         {
            minWidth:100,
          title: "登录设备",
          key: "last_device",
          align: "center",
          className: "table-head-style",
        },
         {
            minWidth:100,
          title: "设备号",
          key: "last_device_no",
          align: "center",
          className: "table-head-style",
        },
      ],
    };
  },
  created() {
    this.getChanelList();//获取渠道名称
    // this.valueDay[0] = this.$moment().startOf("month").format("YYYY-MM-DD");
    //获取当前月的最后一天
    // this.valueDay[1] = this.$moment().endOf("month").format("YYYY-MM-DD");
    
    this.getAppDownLis();
    
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
    //获取注册统计列表
    getAppDownLis() {
       
      appdownListApi({
        ...this.exchangeFrom,
        "x:date": this.valueDay[0] ? Date.parse(this.valueDay[0] + " 00:00:00") / 1000 : "",
        "d:date": this.valueDay[1] ? Date.parse(this.valueDay[1] + " 23:59:59") / 1000 : "",
        "o:date": this.model2,
        "channel_id":this.modelChanel||this.modelChanel===0?this.modelChanel:""
      }).then((res) => {
        this.total = res.data.count;
        this.activeData = res.data.list;
        this.statusTime = res.data.stats_time==0?'暂无': formatDate(
            new Date(res.data.stats_time * 1000),
            "yyyy-MM-dd hh:mm:ss"
          )
        this.spinShow = false;
      });
    },
    //获取渠道访问统计
    getDetailTable(date) {
      this.detaiRowDate = date
      let rowDate = formatDate(new Date(this.detaiRowDate * 1000), "yyyy-MM-dd")
      let chanelDate = []
      chanelDate[0] =  rowDate +" 00:00:00"
      chanelDate[1] =  rowDate +" 23:59:59"
      // console.log(chanelDate);
      this.spinShow = true
      this.spinShow2 = true
      appdownChannelApi({
        ...this.exchangeFrom2,
        "o:add_time":this.userSortFlag,
        "x:add_time":this.detaiRowDate?Date.parse(chanelDate[0]) / 1000 : "",
        "d:add_time":this.detaiRowDate?Date.parse(chanelDate[1]) / 1000 : "",
        "e:channel_id":this.modelChanel||this.modelChanel==0?this.modelChanel:""
      }).then((res) => {
        this.total2 = res.data.count
        this.lookData = res.data.list
         this.spinShow = false
         this.spinShow2 = false
      });
    },
    //日期change事件
    dayChange(e) {
      this.valueDay = e;
      this.exchangeFrom.page = 1

      this.getAppDownLis()
    },
    // 渠道change事件
    chanelChange(e){
      this.modelChanel = e
      this.getAppDownLis()
    },
    //搜索
    searchClick() {
      this.getAppDownLis();
    },
    //导出
    exportClick() {
      this.$Modal.confirm({
        title: "确定要导出列表数据吗？",
        onOk: () => {
          let date1 = this.valueDay[0]
            ? Date.parse(this.valueDay[0] + " 00:00:00") / 1000
            : "";
          let date2 = this.valueDay[1]
            ? Date.parse(this.valueDay[1] + " 23:59:59") / 1000
            : "";
          // console.log(`${location.origin}/adminapi/statistic/user/down_list?export=${1}&x:date=${date1}&d:date=${date2}&o:date=${this.model2}&channel_id=${this.modelChanel}`,'ppp');
          window.location.href = `${location.origin}/adminapi/statistic/user/down_list?export=${1}&x:date=${date1}&d:date=${date2}&o:date=${this.model2}&channel_id=${this.modelChanel}`;
        },
        onCancel: () => {
          this.$Message.info("已取消");
        },
      });
    },
    // 导出
    exportClick2(){
        this.$Modal.confirm({
        title: "确定要导出列表数据吗？",
        onOk: () => {
          
      let rowDate = formatDate(new Date(this.detaiRowDate * 1000), "yyyy-MM-dd")
      let chanelDate = []
      chanelDate[0] =  rowDate +" 00:00:00"
      chanelDate[1] =  rowDate +" 23:59:59"
      let StartDate = this.detaiRowDate?Date.parse(chanelDate[0]) / 1000 : ""
      let EndtDate = this.detaiRowDate?Date.parse(chanelDate[1]) / 1000 : ""

          // console.log(`${location.origin}/adminapi/user/user?o:add_time=${this.userSortFlag}x:add_time=${StartDate}d:add_time=${EndtDate}`,'ppp');
          window.location.href = `${location.origin}/adminapi/user/user?export=${1}&o:add_time=${this.userSortFlag}&x:add_time=${StartDate}&d:add_time=${EndtDate}`;
        },
        onCancel: () => {
          this.$Message.info("已取消");
        },
      });
    },
    //查看
    lookClick(row) {
      this.modelDate = formatDate(new Date(row.date * 1000), "yyyy-MM-dd");
      this.getDetailTable(row.date);
      this.modalLook = true;
    },
     // 查看渠道排序
    userSortClick(text){
      this.userSortFlag = text
      this.getDetailTable(this.detaiRowDate)
    },
    cancelChannelModel(){
      this.exchangeFrom2.page = 1
      this.exchangeFrom2.limit = 10
      this.detaiRowDate = ''
      this.lookData = []
      this.modalLook = false
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
                this.getAppDownLis()
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
      this.getAppDownLis(); //列表
    },
    pageSizeChange(index) {
      this.exchangeFrom.limit = index;
      this.getAppDownLis(); //列表
    },
    // 分页
    pageChange2(index) {
      this.exchangeFrom2.page = index;
       this.getDetailTable(this.detaiRowDate); //列表
    },
    pageSizeChange2(index) {
      this.exchangeFrom2.limit = index;
       this.getDetailTable(this.detaiRowDate);//列表
    },
  },
};
</script>
<style scoped >

.search {
  display: flex;
  background-color: #fff;
  /* margin: 0 0 20px 0; */
  padding: 20px 10px 15px 20px;
}
.search2{
  margin: 0 0 20px 0;
  display: flex;
  padding-left: 20px;
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
.searchModel{
  padding-bottom: 10px;
}
</style>
