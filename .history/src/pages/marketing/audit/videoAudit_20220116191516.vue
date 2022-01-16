<template>
  <div class="video-page">
    <div class="search">
      <!-- 查询 -->
      <Form :model="searchForm" :label-width="80">
         <Row>
           <div style="margin:0 0 10px 20px">
            <Button @click="auditButtonClick(0)" :type="auditButtonType===0?'primary':'default'" style="margin-right:10px">待审核</Button>
            <Button @click="auditButtonClick(1)" :type="auditButtonType===1?'primary':'default'" style="margin-right:10px">已通过</Button>
            <Button @click="auditButtonClick(2)" :type="auditButtonType===2?'primary':'default'">未通过</Button>
           </div>
         </Row>
        <Row>
          <Col span="4">
            <FormItem label="视频标题：">
              <Input
                type="text"
                v-model="searchForm['k:v:vedio_title']"
                placeholder="请输入视频标题"
              />
            </FormItem>
          </Col>

          <Col span="4">
            <FormItem label="视频ID：">
              <Input
                type="text"
                v-model="searchForm['e:v:vedio_id']"
                placeholder="请输入视频ID"
              />
            </FormItem>
          </Col>

          <Col span="4">
            <FormItem label="用户昵称：">
              <Input
                type="text"
                v-model="searchForm['k:u:nickname']"
                placeholder="请输入用户昵称"
              /> </FormItem
          ></Col>

          <Col span="4">
            <FormItem label="用户ID：">
              <Input
                type="text"
                v-model="searchForm['e:v:uid']"
                placeholder="请输入用户ID"
              />
            </FormItem>
          </Col>
          <Button type="primary" style="margin-left: 20px" @click="clearClick">
            <Icon type="ios-aperture" />重置</Button
          >
          <Button
            style="margin:0 20px"
            type="primary"
            icon="ios-search"
            @click="searchClick"
            >搜索</Button
          >
         
            <Button type="success" class="more" @click="showSearchBtn()"
              >{{ flagType ? "展开" : "收起"
              }}<Icon
                :type="flagType ? 'md-arrow-dropup' : 'md-arrow-dropright'"
            /></Button>
        
        </Row>
        <Row v-if="!flagType">
          <Col span="6">
            <FormItem label="视频类型：">
                <Button @click="videoButtonClick(3)" :type="payButtonType===3?'primary':'default'" style="margin-right:10px">全部</Button>
                <Button @click="videoButtonClick(0)" :type="payButtonType===0?'primary':'default'" style="margin-right:10px">免费</Button>
                <Button @click="videoButtonClick(1)" :type="payButtonType===1?'primary':'default'">付费</Button>
            </FormItem>
          </Col>
         
          <div>
            <Button
            v-if="auditButtonType!==1&&auditButtonType!==2"
            style="margin-left: 20px"
            type="warning"
            @click="batchAuditClick"
            >批量审核拒绝</Button
            >
            <Button
             v-if="auditButtonType!==1"
            style="margin-left: 20px"
            type="warning"
            @click="batchProcessClick"
            >批量审核通过</Button
            >
          </div>
         
        </Row>
      </Form>
    </div>
    <div class="table">
      <!-- 表格 -->
      <Table ref="selection" border :columns="videoColumns" :data="videoData">
        <!-- 视频类型 -->
        <template slot-scope="{ row, index }" slot="vedio_type">
            <!-- <Button type="text" style="color:blue" @click="checkTypeClick(row)">查看</Button> -->
          <div style="text-align:left" v-html="row.category_str">{{row.category_str}}</div>
          <!-- <Button type="text" style="color: #008ef0" @click="workSortClick(row)"
            >查看</Button
          > -->
        </template>

        <!-- 封面图 -->
        <template slot-scope="{ row, index }" slot="vedio_cover">
          <viewer>
            <img style="width: 40px; height: 40px" :src="row.vedio_cover" />
          </viewer>
        </template>
        <!-- 审核理由 -->
        <template slot-scope="{ row, index }" slot="check_reason">
          <span v-if="row.status === 0">待审核(暂无理由)</span>
          <span v-if="row.status === 1">已通过(无理由)</span>
          <Tooltip placement="top">
            <span v-if="row.status === 2" style="color: red">{{
              row.check_reason ? row.check_reason : "已拒绝---未写理由"
            }}</span>
            <div slot="content">
              <p>{{ row.check_reason }}</p>
            </div>
          </Tooltip>
        </template>

        <!-- 审核状态 -->
        <template slot-scope="{ row, index }" slot="status">
          <span v-if="row.status === 0">待审核</span>
          <span v-if="row.status === 1">已通过</span>
          <span v-if="row.status === 2">未通过</span>
        </template>
       
        <!-- 操作 -->
        <template slot-scope="{ row, index }" slot="action">
          <!-- <Button v-if="row.status!==1" type="primary" @click="auditStatusClick(row)">审核</Button -->
          <!-- >&nbsp; -->
          <a v-if="row.status!==1" type="warning"  style="margin-right: 10px" @click="videoProcessClick(row)">通过</a>
          <Divider v-if="row.status!==1" type="vertical" />
          <a v-if="row.status!==1&&row.status!==2" type="warning"  style="margin-right: 10px" @click="videoRefuseClick(row)">拒绝</a>
          <Divider v-if="row.status!==1&&row.status!==2" type="vertical" />
          <a type="primary" @click="preview(row)">预览</a>
          <Divider v-if="row.status===1" type="vertical" />
          <a style="color:red" type="error" v-if="row.status===1"  @click="delVideoClick(row)">删除</a>
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

    <!-- 视频预览弹框 -->
    <Modal  v-model="videoLookVisible" :mask-closable="false" :closable="false">
      <p slot="header">预览视频</p>
      <!-- 340---mov -->
     
      <video-player v-if="flagVideo" class="video-player vjs-custom-skin" 
        ref="videoPlayer" 
        :playsinline="true" 
        withCredentials: true
        :options="playerOptions">
      </video-player>
      <span v-if="!flagVideo">暂无视频播放哦~</span>
      <p slot="footer" style="text-align:center"><Button type="primary" @click="closePreview">关闭</Button></p>
      <!--  <iframe :src="videoSrc" scrolling="no"  style="width:500px;height:500px" allowfullscreen="true"></iframe> -->
    </Modal>
   
    <!-- 拒绝原因弹框 -->
    <Modal v-model="auditVisibleReson"  width="380">
      <div slot="header" style="text-align: center; font-size: 18px">拒绝</div>
      <p
        style="
          margin-top: 20px;
          margin-bottom: 10px;
          font-size: 15px;
          color: #333;
        "
      >
        <span style="color: red">*</span>拒绝理由
      </p>
      <RadioGroup
        true-value
        @on-change="refuseChange"
        v-model="refuseForm['u:check_reason']"
        vertical
      >
        <p v-for="(item, index) in backList" :key="index">
          <Radio :label="item.label"></Radio>
        </p>
        <Radio label="自定义"></Radio>
      </RadioGroup>
      <Input
        v-if="definedValue"
        v-model="refuseVlue"
        type="textarea"
        :rows="4"
        placeholder=""
      />
      <div>
        <Checkbox v-model="refuseForm['u:is_del']" @on-change="refuseDelChange"
          >同时删除视频</Checkbox
        >
      </div>

      <div slot="footer" style="text-align: center">
        <Button type="warning" @click="auditVisibleReson=false">取消</Button>
        <Button type="success" @click="confirmResonValue">确认</Button>
      </div>
    </Modal>
    <!-- 批量拒绝原因弹框 -->
    <Modal v-model="auditVisibleBatch"  width="380">
      <div slot="header" style="text-align: center; font-size: 18px">拒绝</div>
      <p
        style="
          margin-top: 20px;
          margin-bottom: 10px;
          font-size: 15px;
          color: #333;
        "
      >
        <span style="color: red">*</span>拒绝理由
      </p>
      <RadioGroup
        true-value
        @on-change="refuseChange"
        v-model="refuseForm['u:check_reason']"
        vertical
      >
        <p v-for="(item, index) in backList" :key="index">
          <Radio :label="item.label"></Radio>
        </p>
        <Radio label="自定义"></Radio>
      </RadioGroup>
      <Input
        v-if="definedValue"
        v-model="refuseVlue"
        type="textarea"
        :rows="4"
        placeholder=""
      />
      <div>
        <Checkbox v-model="refuseForm['u:is_del']" @on-change="refuseDelChange"
          >同时删除视频</Checkbox
        >
      </div>

      <div slot="footer" style="text-align: center">
        <Button type="warning" @click="auditVisibleBatch = false">取消</Button>
        <Button type="success" @click="confirmResonBatch">确认</Button>
      </div>
    </Modal>
     <!-- 查看视频类型 -->
    <Modal v-model="checkTypeVisible" :closable="false">
      <p slot="header" style="text-align: center; cursor: pointer">查看视频分类</p>
      <div>
        <div style="display: flex">
       视频分类： <Tree :data="treeData"></Tree>
      </div>
      </div>
      <div slot="footer" style="text-align: center">
      
        <Button type="success" @click="checkTypeVisible=false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  videoAuditListApi,
  videoAuditStatusApi,
  videoAuditReasonApi,
  auditRefusesApi,
} from "@/api/audit";
import {videoSortApi} from "@/api/user";
import { refuseListApi } from "@/api/setting";
import { formatDate } from "@/common/date.js";
import Setting from "@/setting";
export default {
  components: {},
  data() {
    return {
      flagVideo:true,
      singleVideoId:"",//拒绝单个id
      treeData:[],
      videoSrc:"",
      auditButtonType:0,
      payButtonType:3,
      batchDelID: [],
      delValue: true,
      definedValue: false,
      backList: [], //拒绝理由选择
      total: 0,
      spinShow: true, //loadding
      statusID: 0, //修改状态的ID
      refuseVlue: "", //拒绝原因
      refuseForm: {
        "u:check_reason": "",
        "u:is_del": false,
      }, //拒绝表单
      checkTypeVisible:false,//查看视频类型弹框
      auditVisibleFirst: false, //第一次审核弹框
      auditVisibleRefuse: false, //再次审核拒绝的视频
      auditVisibleReson: false, //输入拒绝原因弹框
      auditVisibleBatch: false, //批量拒绝
      vedio: "", //视频
      videoLookVisible: false, //预览
      flagType: false, //展开剩余查询
      //分页参数
      exchangeFrom: {
        page: 1,
        limit: 10,
      },
      //查询表单
      searchForm: {
        'k:v:vedio_title': "", //视频标题
        'e:v:vedio_id': "", //视频ID
        'k:u:nickname': "", //用户昵称
        'e:v:uid': "", //用户ID
        // status: 0, //审核状态
        'e:v:status':0,//待审核
        // is_pay: "",
        'e:v:is_pay':"",//是否免费
      },
      //表格
      videoColumns: [
        {
          width: 60,
          title: "序号",
          type: "selection",
          align: "center",
          className: "table-head-style",
        },
        {
          width:100,
          title: "视频ID",
          key: "vedio_id",
          align: "center",
          className: "table-head-style",
        },
        {
          width:100,
          title: "用户ID",
          key: "uid",
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
          width:100,
          title: "视频封面",
          slot: "vedio_cover",
          key: "vedio_cover",
          align: "center",
          className: "table-head-style",
        },
         {
          minWidth:200,
          title: "视频类型",
          key:"category_str",
          slot: "vedio_type",
          align: "center",
          className: "table-head-style",
         
        },
        {
          width:100,
          title: "视频价格",
          key: "vedio_price",
          align: "center",
          className: "table-head-style",
        },
        {
          width:100,
          title: "用户昵称",
          key: "nickname",
          align: "center",
          className: "table-head-style",
        },
        

        {
          width: 100,
          title: "审核理由",
          key: "check_reason",
          align: "center",
          slot: "check_reason",
          className: "table-head-style",
        },
        {
          width: 160,
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
          width: 100,
          title: "人工审核状态",
          key: "status",
          slot: "status",
          align: "center",
          className: "table-head-style",
        },
        
        {
          width: 160,
          title: "操作",
          fixed: "right",
          slot: "action",
          align: "center",
          className: "table-head-style",
        },
      ],
      videoData: [],
      //视频
      playerOptions: {
        // playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        controls: true, //是否显示控制条
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '1:1', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
            // type: "application/x-mpegURL", // 类型
            src: ''// url地址
        }],
        poster: '', // 封面地址
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
            timeDivider: true, // 当前时间和持续时间的分隔符
            durationDisplay: true, // 显示持续时间
            remainingTimeDisplay: false, // 是否显示剩余时间功能
            fullscreenToggle: true // 是否显示全屏按钮
        }
      }
    };
  },
  created() {
    this.getVideoList(); //视频列表
    this.getRefuse();
     if(this.playerOptions.sources[0].src===''){
      this.flagVideo=false
      }else{
        this.flagVideo = true
      }
  },
  mounted() {},
  methods: {
    //   获取视频列表数据
    getVideoList() {
      videoAuditListApi({
        page: this.exchangeFrom.page,
        limit: this.exchangeFrom.limit,
        ...this.searchForm,
        'e:v:is_del':'0',
      }).then((res) => {
        this.total = res.data.count;
        this.videoData = res.data.list;
        this.videoData.forEach(item=>{
          item.vedio_cover = Setting.url(item.vedio_cover)
        })
        this.spinShow = false;
      });
    },
    //获取拒绝理由
    getRefuse() {
      auditRefusesApi({
        gid: 72,
        status: 1,
      }).then((res) => {
        this.backList = res.data.list.map((item) => {
          return {
            value: item.id,
            label: item.content,
          };
        });
      });
    },
    //审核状态事件
    auditButtonClick(num){
      this.auditButtonType = num
       this.searchForm['e:v:status'] = num;
       this.exchangeFrom.page = 1
       this.exchangeFrom.limit = 10
      this.getVideoList();
    },
    //视频类型事件
    videoButtonClick(num){
      this.payButtonType = num
      this.searchForm['e:v:is_pay']= num===3?"":num;
      this.exchangeFrom.page=1
      this.exchangeFrom.limit=10
      this.getVideoList();
    },
    //获取视频类型
    checkTypeClick(row){
      this.checkTypeVisible = true
      videoSortApi({
        category:row.category
      }).then(res=>{
          this.treeData = this.filterData(res.data);
      })
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
    //查询
    searchClick() {
      this.getVideoList();
      console.log(this.searchForm, "查询参数");
    },
    //删除---针对已通过的出现
    delVideoClick(row){
        if (row.is_pay === 1) {
        return this.$Message.warning("付费视频不能删除！");
      }
      this.$Modal.confirm({
        title: "确定要删除这条数据吗？",
        onOk: () => {
          videoAuditReasonApi({
            "u:is_del": 1,
            "e:vedio_id": row.vedio_id,
          }).then((res) => {
            this.$Message.success(res.msg);
            this.getVideoList(); //视频列表
          }).catch(err=>{
             this.$Message.warning(res.msg);
          });
        },
        onCancel: () => {
          this.$Message.info("已取消！");
        },
      });
    },
    //清空
    clearClick() {
      this.searchForm = {
       'k:v:vedio_title': "", //视频标题
        'e:v:vedio_id': "", //视频ID
        'k:u:nickname': "", //用户昵称
        'e:v:uid': "", //用户ID
        'e:v:status':0,//待审核
        'e:v:is_pay':"",//是否免费
      };
      this.payButtonType = 3
      this.auditButtonType = 0
      this.exchangeFrom = {
        page: 1,
        limit: 10,
      };
      this.getVideoList();
    },
    //预览
    preview(row) {
      // this.playerOptions.sources[0].src = 'http://121.43.230.79/uploads/vedio/test/output.m3u8'
      this.playerOptions.sources[0].src = row.vedio_url;
       if(this.playerOptions.sources[0].src===''){
      this.flagVideo=false
      }else{
        this.flagVideo = true
      }
      this.videoLookVisible = true;
    },
    //关闭预览
    closePreview(){
      if( this.flagVideo ==true){
        this.$refs.videoPlayer.player.pause() // 暂停
      }
      this.videoLookVisible = false
    },
    //展开
    showSearchBtn() {
      this.flagType = !this.flagType;
      console.log("展开");
    },
   
    // 选择拒绝理由change事件
    refuseChange(e) {
      if (e === "自定义") {
        this.definedValue = true;
      } else {
        this.definedValue = false;
      }
    },
    //删除change事件
    refuseDelChange(e) {
      this.refuseForm["u:is_del"] = e;
    },
    // //取消填写原因
    // cancelResonValue() {
    //   this.refuseForm = {
    //     "u:check_reason": "",
    //     "u:is_del": false,
    //   };
    //   this.refuseVlue = "";
    //   this.auditVisibleReson = false;
    //   this.getVideoList();
    // },
    // //确认拒绝原因
    // confirmResonValue() {
    //   if (!this.refuseForm["u:check_reason"]) {
    //     return this.$Message.warning("请选择一个拒绝理由！");
    //   }

    //   let reason =
    //     this.refuseForm["u:check_reason"] == "自定义"
    //       ? this.refuseVlue
    //       : this.refuseForm["u:check_reason"];
    //   let del = this.refuseForm["u:is_del"] ? 2 : '';

    //   videoAuditReasonApi({
    //     "e:vedio_id": this.statusID,
    //     "u:check_reason": reason,
    //     "u:is_del": del,
    //     "u:status": 2,
    //   }).then((res) => {
    //     this.$Message.success(res.msg);
    //     this.auditVisibleReson = false;
    //     this.auditVisibleRefuse = false;
    //     this.getVideoList();
    //     this.refuseForm = {
    //       "u:check_reason": "",
    //       "u:is_del": false,
    //     };
    //     this.refuseVlue = "";
    //   });
    // },
    //批量拒绝
    confirmResonBatch() {
      if (!this.refuseForm["u:check_reason"]) {
        return this.$Message.warning("请选择一个拒绝理由！");
      }

      let reason =
        this.refuseForm["u:check_reason"] == "自定义"
          ? this.refuseVlue
          : this.refuseForm["u:check_reason"];
      let del = this.refuseForm["u:is_del"] ? 2 : '';
      videoAuditReasonApi({
        "i:vedio_id": this.batchDelID,
        "u:check_reason": reason,
        "u:is_del": del,
        "u:status": 2,
      }).then((res) => {
        this.$Message.success(res.msg);
        this.auditVisibleBatch = false;
        this.getVideoList();
        this.refuseForm = {
          "u:check_reason": "",
          "u:is_del": false,
        };
        this.batchDelID = [];
        this.refuseVlue = "";
      });
    },
    // 单个通过
    videoProcessClick(row){
      this.$Modal.confirm({
          title: '确定要通过吗？',
          onOk: () => {
              videoAuditStatusApi({
                'u:status':1,
                'e:vedio_id':row.vedio_id
              }).then(res=>{
                this.$Message.success(res.msg)
                this.getVideoList()
              }).catch(err=>{
                this.$Message.warning(err.msg)
              })
          },
          onCancel: () => {
              this.$Message.info('已取消');
          }
      });
    },
    //单个拒绝
    videoRefuseClick(row){
      this.singleVideoId = row.vedio_id
      this.auditVisibleReson = true
    },
    confirmResonValue() {
      if (!this.refuseForm["u:check_reason"]) {
        return this.$Message.warning("请选择一个拒绝理由！");
      }

      let reason =
        this.refuseForm["u:check_reason"] == "自定义"
          ? this.refuseVlue
          : this.refuseForm["u:check_reason"];
      let del = this.refuseForm["u:is_del"] ? 2 : '';

      videoAuditReasonApi({
        "e:vedio_id": this.singleVideoId,
        "u:check_reason": reason,
        "u:is_del": del,
        "u:status": 2,
      }).then((res) => {
        this.$Message.success(res.msg);
        this.auditVisibleReson = false;
        this.getVideoList();
        this.refuseForm = {
          "u:check_reason": "",
          "u:is_del": false,
        };
        this.refuseVlue = "";
      });
    },
    //批量通过
    batchProcessClick() {
      this.batchDelID = this.$refs.selection
        .getSelection()
        .map((item, index) => {
          return item.vedio_id;
        });
      if (this.batchDelID.length < 2) {
        return this.$Message.warning("请至少选择2条数据！");
      }
      this.$Modal.confirm({
        title: "确定要审核通过所选的数据吗？",
        onOk: () => {
          videoAuditReasonApi({
            'u:status': 1,
            'i:vedio_id': this.batchDelID,
          }).then((res) => {
            this.$Message.success(res.msg);
            this.getVideoList();
          });
        },
        onCancel: () => {
          this.$Message.info("已取消！");
        },
      });
    },
    //批量审核
    batchAuditClick() {
      this.batchDelID = this.$refs.selection
        .getSelection()
        .map((item, index) => {
          return item.vedio_id;
        });
      if (this.batchDelID.length < 2) {
        return this.$Message.warning("请至少选择2条数据！");
      }
      this.auditVisibleBatch = true;
    },
    // 分页
    pageChange(index) {
      this.exchangeFrom.page = index;
      this.getVideoList(); //视频列表
    },
    pageSizeChange(index) {
      this.exchangeFrom.limit = index;
      this.getVideoList(); //视频列表
    },
  },
};
</script>

<style scoped>
.search {
  background-color: #fff;
  margin: 0 0 20px 0;
  padding: 20px 10px 0 20px;
}
.table {
  background-color: #fff;
  padding: 20px;
}
>>> .ivu-table th.table-head-style {
  background: #f2f2f2 !important;
  color: #333;
}

/deep/.ivu-select-single .ivu-select-selection {
  width: 112px;
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
  padding-bottom: 40px;
}
/deep/.ivu-tree{
  display: flex!important;
}
</style>
