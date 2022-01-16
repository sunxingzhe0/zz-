<template>
  <div class="">
    <!-- 搜索 -->
    <div class="search">
        <div style="margin-bottom:15px">
            <span>发布日期选择：</span>
             <Date-picker clearable @on-change="pushDateChange" format="yyyy-MM-dd" :value="timePush" type="datetimerange" placeholder="开始日期—结束日期" style="width: 300px"></Date-picker>
        </div>
        <div class="item" style="display:flex">
            <div class="itemSon">
                <span>合集ID：</span>
                 <Input clearable style="width:140px" v-model="searchForm.id" ></Input>
            </div>
             <div class="itemSon">
                <span>合集标题：</span>
                 <Input clearable style="width:140px" v-model="searchForm.title" ></Input>
            </div>
             <div class="itemSon">
                <span>用户ID：</span>
                 <Input clearable style="width:140px" v-model="searchForm.uid" ></Input>
            </div>
             <div class="itemSon">
                <span>用户手机号：</span>
                 <Input clearable style="width:140px" v-model="searchForm.phone" ></Input>
            </div>
            <Button @click="searchClick" icon="ios-search" type="primary">搜索</Button>
        </div>
    </div>
    <!-- 表格 -->
    <div class="table">
      <Table border :columns="activeColumns" :data="activeData">
       <!-- 发布时间add_time -->
        <template slot-scope="{ row, index }" slot="add_time">
          {{row.add_time | formatDate}}
        </template>

        <template slot-scope="{ row, index }" slot="action">
          <p style="text-align:center;font-size:15px">({{row.vedio_count}}集)</p>
          <a @click="detailClick(row)" style="color:#2d8cf0;text-decoration: underline;font-size:15px">查看</a>
        </template>
       
      </Table>
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
    <!-- 对话框 -->
     <Modal v-model="modalDetail" width="500"  :mask-closable="false">
        <p slot="header" style="text-align:center">合计视频</p>
       <p ><span>标题：</span>{{avisibleForm.title_new}}</p>
       <p style="padding:10px 0"><span>描述：</span>{{avisibleForm.desc_new}}</p>
       <Table border :columns="detailColumns" :data="detailData">
         <template slot-scope="{index}" slot="number">
            {{index+1}}
         </template>
       </Table>
       <p slot="footer" style="text-align:center">
         <Button type="primary" @click="modalDetail=false">关闭</Button>
       </p>
    </Modal>
   <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
import {collectionTotalApi,collectionVideoApi} from "@/api/collection";
import { formatDate } from "@/common/date.js";
export default {
   filters: {
    formatDate(time) {
      if (time !== 0) {
        let date = new Date(time * 1000);
        return formatDate(date, "yyyy-MM-dd hh:mm");
      }
    },
   },
  data() {
    return {
      avisibleForm:{},//弹框详情
      CollectID:"",
      collectUid:"",
      modalDetail:false,//对话框
      timePush:[],
      searchForm:{
        id:'',
        title:'',
        uid:'',
        phone:''
      },
      spinShow:false,
      total: 0, //统计
      exchangeFrom: {
        page: 1,
        limit: 10,
      },
        activeData: [
          {
            datestr:"标题"
          }
        ], //表格
      //   //表格
        activeColumns: [
        {
          minWidth: 100,
          title: "合集ID",
          key: "id",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth: 100,
          title: "合集标题",
          key: "title_new",
          align: "center",
          className: "table-head-style",
            render: (h, params) => {
            if (!params.row.title_new) return h("span", "暂无内容");
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
                    domProps: { title: params.row.title_new },
                    on: {
                      click: (e) => {
                        e.stopPropagation();
                      },
                    },
                  },
                  params.row.title_new
                ),
              ]);
            }
          },
        },
        {
          minWidth: 120,
          title: "合集简介",
          key: "desc_new",
          align: "center",
          className: "table-head-style",
           render: (h, params) => {
            if (!params.row.desc_new) return h("span", "暂无内容");
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
                    domProps: { title: params.row.desc_new },
                    on: {
                      click: (e) => {
                        e.stopPropagation();
                      },
                    },
                  },
                  params.row.desc_new
                ),
              ]);
            }
          },
        },
        {
          minWidth: 180,
          title: "发布时间",
          slot:"add_time",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth: 100,
          title: "用户ID",
          key: "uid",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth: 180,
          title: "用户手机号",
          key:"phone",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth: 100,
          title: "播放量",
          key: "play_count",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth: 100,
          title: "收藏量",
          key:"collect_count",
          align: "center",
          className: "table-head-style",
        },
        {
           minWidth: 100,
          title: "已更新集数",
          slot: "action",
          fixed:'right',
          align: "center",
          className: "table-head-style",
        },
        
      ],
      // 弹框表格
      detailColumns:[
        {
          minWidth: 60,
          title: "集数",
          slot:"number",
          align: "center",
          className: "table-head-style",
        },
         {
          minWidth: 100,
          title: "视频ID",
          key:"vedio_id",
          align: "center",
          className: "table-head-style",
        },
         {
          minWidth: 100,
          title:"视频标题",
          key: "vedio_title",
          align: "center",
          className: "table-head-style",
        },
      ],
      detailData:[],
    };
  },
  created() {
    this.getCombineDateLis();
  },

  methods: {
    //获取合集数据列表
    getCombineDateLis(){
      this.spinShow = true
       let start = this.timePush[0]
        ? Date.parse(this.timePush[0] + " 00:00:00") / 1000
        : "";
      let end = this.timePush[1]
        ? Date.parse(this.timePush[1] + " 23:59:59") / 1000
        : "";
      collectionTotalApi({
          ...this.exchangeFrom,
          "x:t:add_time":start,
          "d:t:add_time":end,
          "e:t:id":this.searchForm.id,
          "e:t:title_new":this.searchForm.title,
          "e:t:uid":this.searchForm.uid,
          "k:u:phone":this.searchForm.phone
      }).then(res=>{
        this.total = res.data.count
        this.activeData = res.data.list
        this.spinShow = false
      })
    },
    //获取合集视频列表
    getVideoList(){
      collectionVideoApi({
        page:1,
        limit:1000,
        "e:l:total_id":this.CollectID,//合集id
        "e:v:uid":this.collectUid,
        "e:v:is_del":0
      }).then(res=>{
        this.detailData = res.data.list
      })
    },
    // 发布时间change事件
    pushDateChange(e){
      this.timePush = e
      this.getCombineDateLis()
    },
   
  
    
   
    //搜索
    searchClick() {
      //判断当前选的活跃方式
      this.getCombineDateLis()
    },
  //  查看
  detailClick(row){
    this.avisibleForm = {...row}
    this.CollectID = row.id
    this.collectUid = row.uid
    this.getVideoList()
    this.modalDetail = true
  },
    // 分页
    pageChange(index) {
      this.exchangeFrom.page = index;
      this.getCombineDateLis(); //列表
    },
    pageSizeChange(index) {
      this.exchangeFrom.limit = index;
      this.getCombineDateLis(); //列表
    },
  },
};
</script>
<style scoped>
>>> .ivu-table th.table-head-style {
  background: #f2f2f2 !important;
  color: #333;
}
.search {
  background-color: #fff;
  margin: 0 0 20px 0;
  padding: 20px 10px 15px 20px;
}
.itemSon{
    padding-right: 25px;
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
