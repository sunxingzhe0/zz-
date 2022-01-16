<template>
  <div class="search">
    <!-- 查询 -->
    <div style="padding-left:20px">
      时间选择：
    <DatePicker type="datetimerange" @on-change="timeChange" :value="timeDate"  format="yyyy-MM-dd HH:mm" placeholder="请选择开始时间和结束时间" style="width: 320px"></DatePicker>
    <Button style="margin-left:20px"   type="success" @click="bornClick">生成用户</Button>
    </div>

    <!-- 表格 -->
    <div class="table">
      <Table border :columns="payColumns" :data="payTableData">
        <!-- 导出 -->
         <template slot-scope="{ row, index }" slot="action">
           <Button style="margin-left:20px"  icon="ios-download-outline" type="success" @click="exportClick(row)">导出</Button>
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
    <!-- 生成用户对话框 -->
    <Modal
        v-model="modalBorn"
        @on-ok="confirmBornClick"
        @on-cancel="modalBorn=false">
        <p slot="header" style="text-align:center">生成用户</p>
        <div>
          <span style="color:red">*</span>&emsp;<Input style="width:140px" v-model="bornNum" number></Input>
          &nbsp;<span>*可输入区间[1~100]</span>
        </div>
    </Modal>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import { userGeneratedApi,userGeneratedNumApi} from "@/api/user";
import { formatDate } from "@/common/date.js";
export default {
  components: {},
  data() {
    return {
      modalBorn:false,
      bornNum:2,
      spinShow:true,
      total: 0,
      timeDate:[],
      exchangeFrom: {
        page: 1,
        limit: 10,
      },
      // 搜索
      searchForm: {
       
      },
      //表格
      payColumns: [
        {
          width: 80,
          title: "id",
          key: "id",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "生成时间",
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
          title: "数量",
          key: "num",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          className: "table-head-style",
        },
       
      ],
      payTableData: [],
    
     
    };
  },
  created() {
      this.getUserGeneratedLis()
  },
  mounted() {},
  methods: {
    //获取生成用户记录列表
    getUserGeneratedLis(){
        this.spinShow = true
        userGeneratedApi({
            ...this.exchangeFrom,
            'x:add_time':this.timeDate[0]?Date.parse(this.timeDate[0]) / 1000: "",
            'd:add_time':this.timeDate[1]?Date.parse(this.timeDate[1]) / 1000: ""
        }).then(res=>{
            this.total = res.data.count
            this.payTableData = res.data.list
            this.spinShow = false
        })
    },
    // 事间change事件
    timeChange(e){
        this.timeDate = e
        this.getUserGeneratedLis()
    },
    //生成用户
    bornClick(){
      this.modalBorn = true
    },
    confirmBornClick(){
      if(!this.bornNum){
        return this.$Message.warning("请输入生成的数量！")
      }
      if(this.bornNum<1||this.bornNum>100){
        return this.$Message.warning("输入的数量规定在[1~100]区间！")
      }
      userGeneratedNumApi({
        num:this.bornNum
      }).then(res=>{
        this.$Message.success(res.msg)
        this.getUserGeneratedLis()
        this.modalBorn = false
        this.bornNum = 2
      }).catch(err=>{
        this.$Message.warning(err.msg)
      })
    },
    //导出
    exportClick(row){
        this.$Modal.confirm({
                    title: '确定要导出生成用户吗？',
                    onOk: () => {
                        // console.log(`${location.origin}/adminapi/user/user?export=${1}e:user_type=${'generate'}e:gid=${1}`,'popopo');
                        window.location.href = `${location.origin}/adminapi/user/user?export=1&e:user_type=generate&e:gid=${row.id}`
                        // console.log(`${location.origin}/adminapi/user/user?export=${1}e:user_type=${'generate'}e:gid=${row.id}`);
                    },
                    onCancel: () => {
                        this.$Message.info('已取消！');
                    }
                });
        
    },

    // 分页
    pageChange(index) {
      this.exchangeFrom.page = index;
      this.getUserGeneratedLis()
    },
    pageSizeChange(index) {
      this.exchangeFrom.limit = index;
      this.getUserGeneratedLis()
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
