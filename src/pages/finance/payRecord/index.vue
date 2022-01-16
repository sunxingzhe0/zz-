<template>
  <div class="search">
    <!-- 查询 -->
    <Form :model="searchForm" :label-width="80">
      <Row>
        <!-- <Col span="4">
          <FormItem label="付费状态：">
            <Select v-model="searchForm['e_m:order_status']" @on-change="statusChange">
              <Option
                v-for="item in statusList"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
        </Col> -->
        <Col span="4">
          <FormItem label="用户昵称：">
            <Input
              type="text"
              v-model="searchForm['k_u:nickname']"
              placeholder="请输入用户昵称"
            /> </FormItem
        ></Col>
        <Col span="4">
          <FormItem label="用户ID：">
            <Input
              type="text"
              v-model="searchForm['e_m:uid']"
              placeholder="请输入用户ID"
            />
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="手机号：">
            <Input
              type="text"
              v-model="searchForm['e_u:phone']"
              placeholder="请输入手机号"
            />
          </FormItem>
        </Col>
       
        <Col span="4">
          <FormItem label="视频标题：">
            <Input
              type="text"
              v-model="searchForm['k_v:vedio_title']"
              placeholder="请输入视频标题"
            />
          </FormItem>
        </Col>
         <Col span="4">
          <FormItem label="视频ID：">
            <Input
            style="width:130px"
              type="text"
              v-model="searchForm['e_m:vedio_id']"
              placeholder="请输入视频ID"
            />
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="日期：">
            <DatePicker
              type="datetimerange"
              @on-change="dateChange"
              :value="datePay"
              format="yyyy-MM-dd"
              placeholder="请选择日期"
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
        <!-- 封面 -->
        <template slot-scope="{ row, index }" slot="vedio_cover">
          <viewer>
            <img style="width: 40px; height: 40px" :src="row.vedio_cover" />
          </viewer>
        </template>
        <!-- 付费金额*100 -->
        <template slot-scope="{ row, index }" slot="money">
         {{Math.round(Number(row.money)*100 )}}
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
    <!-- 查看弹框 -->
    <Modal v-model="modalLook" :closable="false" width="400">
      <p slot="header" style="text-align: center; cursor: pointer">查看</p>
      <p class="title" v-if="checkForm.order_status===3">状态：已退款</p>
      <p class="title">支付（购买）用户信息</p>
      <Row>
        <Col span="14">支付者用户昵称：<span>{{checkForm.nickname}}</span></Col>
        <Col span="10">支付者用户ID：<span>{{checkForm.uid}}</span></Col>
      </Row>
      <Row>
        <Col span="24">支付者用户手机号：<span>{{checkForm.phone}}</span></Col>
      </Row>
       <Row>
        <!-- <Col span="10">支付方式：<span v-if="checkForm.withdraw_type===1">支付宝</span><span v-if="checkForm.withdraw_type===2">银行卡</span></Col> -->
        <Col span="10">账号：<span>{{checkForm.account}}</span></Col>
      </Row>
      <p class="title">视频信息</p>
      <p class="title">{{checkForm.vedio_title}}</p> 
      <p>
        
          <viewer>
            <img style="width: 100px; height: 100px" :src="checkForm.vedio_cover" />
          </viewer>
       
        
        </p> 
      <Row>
        <Col span="10">创作者昵称：<span>{{checkForm.v_nickname}}</span></Col>
        <Col span="10">创作者ID：<span>{{checkForm.vedio_title}}</span></Col>
      </Row>
      <Row>
        <Col span="10">视频ID：<span>{{checkForm.v_uid}}</span></Col>
        <Col span="14">发布时间：<span>{{checkForm.v_add_time}}</span></Col>
      </Row>
       <Row>
        <Col span="10">视频单价：<span>{{checkForm.vedio_price}}</span></Col>
      </Row>
      <p class="title">支付信息</p>
      <Row>
        <Col span="10">支付状态：<span v-if="checkForm.order_status===1">待支付</span>
        <span v-if="checkForm.order_status===2">订单已支付</span>
        <span v-if="checkForm.order_status===3">退款</span>
        </Col>
        <Col span="14">支付时间：<span>{{checkForm.update_time}}</span></Col>
      </Row>
       
      <Row>
        <Col span="10">支付金额：<span>{{Math.round(Number(checkForm.money)*100 )}}</span></Col>
        <Col span="10">服务费：<span>￥{{checkForm.service}}</span></Col>
      </Row>
       <Row>
        <Col span="10">作者收入<span>￥{{checkForm.income}}</span></Col>
      </Row>
      
      <p slot="footer" style="text-align: center; cursor: pointer">
        <Button type="primary" ghost @click="modalLook = false">确认</Button>
      </p>
    </Modal>
    <!-- 退款弹框 -->
     <Modal v-model="modalReturn" :closable="false" width="400">
      <p slot="header" style="text-align: center; cursor: pointer">退款</p>
      <p class="title">退款信息</p>
      <Row>
        <Col span="10">用户昵称：<span>{{checkForm.nickname}}</span></Col>
        <Col span="10">用户ID：<span>{{checkForm.uid}}</span></Col>
      </Row>
      <Row>
        <!-- <Col span="10">支付方式：<span>{{checkForm.nickname}}</span></Col> -->
        <Col span="10">账号：<span>{{checkForm.account}}</span></Col>
      </Row>
       <p class="title">退款金额：<span>{{checkForm.money}}</span></p>
      
      <p slot="footer" style="display: flex;justify-content:space-between;">
        <Button type="primary"  @click="modalReturn = false">取消</Button>
        <Button type="primary"  @click="confirmReturnBtn">确认退款</Button>
      </p>
    </Modal>
  </div>
</template>

<script>
import {payRecordlistApi,payRecordDetailApi,payRecordReturnApi} from "@/api/finance";
import { formatDate } from "@/common/date.js";
import Setting from "@/setting";
export default {
  components: {},
  data() {
    return {
      e_id:"",//退款id
      total: 0,
      exchangeFrom: {
        page: 1,
        limit: 10,
      },
      modalLook: false, //查看弹框
      modalReturn:false,//退款弹框
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
        'e_m:order_status':"",//付费状态
        'k_u:nickname': "", //用户昵称
        'e_m:uid': "", //用户ID
        'e_u:phone': "", //手机号
        'e_m:vedio_id':"",//视频ID
        'k_v:vedio_title':"",//视频标题
      },
        datePay: [], //日期
      //付费状态
      statusList:[
          {
              value:1,
              label:"待支付"
          },
          {
              value:2,
              label:"已支付"
          },
           {
              value:3,
              label:"退款"
          }
      ],
      //查看弹框表单
      checkForm:{},
      //表格
      payColumns: [
        {
          minWidth:60,
          title: "序号",
          key: "id",
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
          minWidth:100,
          title: "用户ID",
          key: "uid",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth: 140,
          title: "手机号",
          key: "phone",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth: 110,
          title: "视频ID",
          key: "vedio_id",
          align: "center",
          className: "table-head-style",
        },
          {
          minWidth: 110,
          title: "视频标题",
          key: "vedio_title",
          align: "center",
          className: "table-head-style",
        },
         {
          minWidth: 80,
          title: "封面",
          key: "vedio_cover",
          slot:"vedio_cover",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth: 180,
          title: "购买时间",
          key: "create_time",
          align: "center",
          className: "table-head-style",
        },
        // {
        //   width: 130,
        //   title: "支付状态",
        //   key: "order_status_str",
        //   align: "center",
        //   className: "table-head-style",
        // },

        {
          minWidth: 100,
          title: "支付金额",
          key: "money",
          slot:"money",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth:160,
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
      //视频
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            // type: "video/mp4", // 类型
            src: "", // url地址
          },
        ],
        poster: "", // 封面地址
        // notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true, // 是否显示全屏按钮
        },
      },
    };
  },
  created() {
    this.getPayRecod()
  },
  mounted() {},
  methods: {
    //获取记录列表
    getPayRecod(){
      payRecordlistApi({
        ...this.exchangeFrom,
        ...this.searchForm,
        // 'x_m:create_time':this.datePay[0]?Date.parse(this.datePay[0])/1000:'',
        // 'd_m:create_time':this.datePay[1]?Date.parse(this.datePay[1])/1000:'',
         'x_m:create_time':this.datePay[0]?this.datePay[0]+" 00:00:00":"",
        'd_m:create_time':this.datePay[1]?this.datePay[1]+" 23:59:59":"",
      }).then(res=>{
        this.payTableData = res.data.list
        this.payTableData.forEach(item=>{
          item.vedio_cover = Setting.url(item.vedio_cover)
        })
        this.total = res.data.count
      })
    },
    //获取列表详情
    getDetailLis(row){
      payRecordDetailApi({
        'e_m:id':row.id
      }).then(res=>{
        this.checkForm = {...row,...res.data}
        this.checkForm.vedio_cover = Setting.url(this.checkForm.vedio_cover)
        this.checkForm.v_add_time =  formatDate(
        new Date(this.checkForm.v_add_time * 1000),
        "yyyy-MM-dd hh:mm:ss"
      );
      })
    },
    //日期change事件
    dateChange(e) {
      this.datePay = e;
    },
    //   查看
    detailBtn(row) {
      this.getDetailLis(row)
      this.modalLook = true;
    },
     //退款
    returnBtn(row){
      this.e_id = row.id
      this.getDetailLis(row)
        this.modalReturn = true
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
        'e_m:order_status':"",//付费状态
        'k_u:nickname': "", //用户昵称
        'e_m:uid': "", //用户ID
        'e_u:phone': "", //手机号
        'e_m:vedio_id':"",//视频ID
        'k_v:vedio_title':"",//视频标题
      }
        this.datePay=[] //日期
        this.getPayRecod()
    },
    //搜索
    searchFormBtn() {
      this.getPayRecod()
      // console.log(this.searchForm,this.datePay, "搜索");
    },
    //状态change改变
    statusChange(e){
      this.searchForm['e_m:order_status'] = e
      this.getPayRecod()
    },
   
    //确认退款
    confirmReturnBtn(){
      payRecordReturnApi({
        e_id:this.e_id,
        field:'order_status',
        value:3,
      }).then(res=>{
        this.$Message.success(res.msg)
         this.modalReturn = false
         this.getPayRecod()
      }).catch(err=>{
        this.$Message.warning(err.msg)
      })
    },
    // 分页
    pageChange(index) {
      this.exchangeFrom.page = index;
      this.getPayRecod()
    },
    pageSizeChange(index) {
      this.exchangeFrom.limit = index;
      this.getPayRecod()
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
.ivu-col-span-10,
.ivu-col-span-14,
.ivu-col-span-24
 {
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
