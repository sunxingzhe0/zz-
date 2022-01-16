<template>
  <div class="">
    <!-- 搜索 -->
    <div class="search">
      <!-- 查询 -->
        <div style="display:flex">
            <div class="sarchItem">
                视频单价：<Input clearable  number v-model="searchForm['x:v:vedio_price']" style="width:80px" placeholder="最低价">
                </Input>-<Input clearable  @on-blur="priceBlur" number v-model="searchForm['d:v:vedio_price']" style="width:80px" placeholder="最高价">
                </Input>
            </div>
             <div class="sarchItem">
                视频ID：<Input clearable  v-model="searchForm['e:v:vedio_id']" style="width:160px" placeholder="请输入视频ID"></Input>
            </div>
            <div class="sarchItem">
                视频标题：<Input clearable  v-model="searchForm['k:v:vedio_title']" style="width:160px" placeholder="请输入视频标题"></Input>
            </div>
             <div class="sarchItem">
                手机号：<Input clearable  v-model="searchForm['e:u:phone']" style="width:160px" placeholder="请输入用户手机号"></Input>
            </div>
        </div>  
         <div style="display:flex">
            <div class="sarchItem">
                发布日期选择：<DatePicker clearable  @on-change="addTimeChange" :value="addTimeValue" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择开始时间-与结束时间" style="width: 320px"></DatePicker>
            </div>
            <Button style="" type="primary" icon="ios-search" @click="searchClick">搜索</Button>
        </div>  
        <div style="display:flex">
            收费类型：<Button @click="ispayClick(3)" :type="isPayFlag===3?'primary':'default'" style="margin-right:10px">全部</Button>
            <Button @click="ispayClick(0)" :type="isPayFlag===0?'primary':'default'" style="margin-right:10px">免费</Button>
            <Button @click="ispayClick(1)" :type="isPayFlag===1?'primary':'default'" >付费</Button>
        </div>
    </div>
    <!-- 表格 -->
    <div class="table">
      <!-- 表格 -->
      <Table border :columns="activeColumns" :data="activeData">
        <template slot-scope="{ row, index }" slot="category">
          <!-- <Button type="text" style="color: #008ef0" @click="workSortClick(row)"
            >查看</Button> -->
            <div style="text-align:left" v-html="row.category_str">{{row.category_str}}</div>
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
     <!-- 作品查看视频分类弹框 -->
    <Modal v-model="modalSort" :closable="false">
      <p slot="header" style="text-align: center; cursor: pointer">查看视频分类</p>
      <div>
        <div style="display: flex">
       视频分类： <Tree :data="treeData"></Tree>
      </div>
      </div>
     
    </Modal>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
import { videoDataApi } from "@/api/active";
import { videoSortApi } from "@/api/user";
import { formatDate } from "@/common/date.js";
export default {
  data() {
    return {
      isPayFlag:3,
      modalSort:false,
      spinShow:false,
      total: 0,
      treeData:[],
      exchangeFrom: {
        page: 1,
        limit: 10,
      },
      searchForm:{
        'x:v:vedio_price':'',//最低价
        'd:v:vedio_price':'',//最高价
        'e:v:vedio_id':'',//视频ID
        'k:v:vedio_title':'',//标题
        'e:u:phone':'',//手机号
      },
      addTimeValue:[],
      activeData: [], //表格
      //表格
      activeColumns: [
        {
          width: 60,
          title: "视频ID",
          key: "vedio_id",
          align: "center",
          className: "table-head-style",
        },
        {
          width:100,
          title: "视频标题",
          key: "vedio_title",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 170,
          title: "发布时间",
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
          width:120,
          title: "视频单价(钻石)",
          key: "vedio_price",
          align: "center",
          className: "table-head-style",
        },
        {
          width:120,
          title: "用户手机号",
          key:"phone",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth:240,
          title: "视频分类",
          slot: "category",
          align: "center",
          className: "table-head-style",
        },
        {
          width:120,
          title: "视频购买人数",
          key:"pay_count",
          align: "center",
          className: "table-head-style",
        },
        {
          width:120,
          title: "付费合计(钻石)",
          key: "pay_total",
          align: "center",
          className: "table-head-style",
        },
        // {
        //   title: "服务费合计(钻石)",
        //   slot:"action7",
        //   align: "center",
        //   className: "table-head-style",
        // },
      //  {
      //     title: "作者收入(钻石)",
      //     key: "user_count_30",
      //     align: "center",
      //     className: "table-head-style",
      //   },
        // {
        //   title: "推送人数",
        //    slot:"action30",
        //   align: "center",
        //   className: "table-head-style",
        // },
        {
          width:120,
          title: "有效观看人数",
          key: "play_count",
          align: "center", 
          className: "table-head-style",
        },
        {
          width:100,
          title: "喜欢人数",
          key:"like_count",
          align: "center",
          className: "table-head-style",
        },
        // {
        //   title: "评论人数",
        //   slot:"comment_count",
        //   align: "center",
        //   className: "table-head-style",
        // },
        {
          width:100,
          fixed:'right',
          title: "评论条数",
          key:"comment_count",
          align: "center",
          className: "table-head-style",
        },
      ],
    };
  },
  created() {
    this.getVideoDataLis()
  },

  methods: {
    //获取视频数据列表
    getVideoDataLis(){
      this.spinShow = true
      videoDataApi({
        ...this.exchangeFrom,
        ...this.searchForm,
        'x:v:add_time':this.addTimeValue[0]?Date.parse(this.addTimeValue[0]) / 1000 : "",
        'd:v:add_time':this.addTimeValue[1]?Date.parse(this.addTimeValue[1]) / 1000 : "",
        'e:v:is_pay':this.isPayFlag===3?'':this.isPayFlag,
        'e:v:is_del':0
      }).then(res=>{
        this.total = res.data.count
        this.activeData = res.data.list
         this.spinShow = false
      })
    },
     //获取视频分类
    getVideoSortLis(row) {
      videoSortApi({
        category: row.category,
        // vedio_id:row.vedio_id
      }).then((res) => {
        this.treeData = this.filterData(res.data);
      });
    },
    ispayClick(num){
      this.isPayFlag = num
      this.exchangeFrom.page=1
      this.exchangeFrom.limit=10
      this.getVideoDataLis()
    },
    //查看
    workSortClick(row){
      this.getVideoSortLis(row);
      this.modalSort = true
    },
    //处理数据
    filterData(data) {
      return Object.entries(data).map((val) => {
        return {
          expand: false,
          title: val[0],
          children:typeof val[1] === "object"? this.filterData(val[1]):[
                  {
                    expand: true,
                    title: val[1],
                  },
                ],
        };
      });
    },
    //日期change选择
    addTimeChange(e){
      this.addTimeValue = e
    },
    //最高单价失焦事件
    priceBlur(){
      if(this.searchForm['d:v:vedio_price']<this.searchForm['x:v:vedio_price']){
        this.searchForm['d:v:vedio_price'] = ''
        this.$Message.warning("最高价格不能低于最低价格！")
      }
    },
    //搜索
    searchClick(){
      this.getVideoDataLis()
    },
    // 分页
    pageChange(index) {
      this.exchangeFrom.page = index;
      this.getVideoDataLis(); //列表
    },
    pageSizeChange(index) {
      this.exchangeFrom.limit = index;
      this.getVideoDataLis(); //列表
    },
  },
};
</script>
<style scoped lang="less">
.sarchItem{
    margin:0 18px 15px 0;
}
.search {
  background-color: #fff;
  margin: 0 0 20px 0;
  padding: 20px 10px 15px 20px;
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
