<template>
  <div class="">
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
            <FormItem label="评论内容：">
              <Input
                type="text"
                v-model="searchForm.comment_content"
                placeholder="请输入评论内容"
              />
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="用户昵称：">
              <Input
                type="text"
                v-model="searchForm.nickname"
                placeholder="请输入用户昵称"
              /> </FormItem
          ></Col>

          <Col span="4">
            <FormItem label="用户ID：">
              <Input
                type="text"
                v-model="searchForm.uid"
                placeholder="请输入用户ID"
              />
            </FormItem>
          </Col>
         
          <Col span="7">
            <FormItem label="评论时间：">
              <Date-picker
                @on-change="timeChange"
                :value="timeArr"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择评论时间"
                style="width: 220px"
              ></Date-picker>
            </FormItem>
          </Col>
          <div
            style="text-align: right; margin-right: 40px; padding-bottom: 20px"
          >
            <Button
              type="success"
              @click="clearFormBtn"
              style="margin-right: 20px"
              ><Icon type="ios-aperture" />&nbsp;重置</Button
            >
            <Button type="primary" icon="ios-search" @click="searchFormBtn"
              >搜索</Button
            >
          </div>
        </Row>
      </Form>
    </div>
    <!-- 表格 -->
    <div class="table">
      <Table border :columns="commentColumns" :data="conmentTableData">
        <template slot-scope="{ row, index }" slot="action">
          <Button
           v-if="row.status!== 1"
            type="success"
            style="margin-right: 10px"
            @click="commentAudit(row)"
            >审核通过</Button
          >
          <Button
           v-if="row.status!== 2"
            type="warning"
            style="margin-right: 10px"
            @click="refuseAudit(row)"
            >审核拒绝</Button
          >
          <Button
            v-if="row.status !== 0"
            type="primary"
            @click="refuseLook(row)"
            >查看</Button
          >
        </template>
        <!-- 审核状态 -->
        <template slot-scope="{ row, index }" slot="status">
          <span v-if="row.status === 0">待审核</span>
          <span v-if="row.status === 1">已通过</span>
          <span v-if="row.status === 2">未通过</span>
        </template>
        <!-- 审核理由 -->
        <template slot-scope="{ row, index }" slot="check_reason">
          <span v-if="row.status === 0">待审核---暂无理由</span>
          <span v-if="row.status === 1">已通过---无理由</span>
          <Tooltip placement="top" v-if="row.status === 2">
            <span style="color: red">{{row.check_reason}}</span>
            <div slot="content">
              {{ row.check_reason }}
            </div>
          </Tooltip>
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
    <!-- 评论审核弹框 -->
    <Modal v-model="auditVisible">
      <div slot="header" style="text-align: center; font-size: 18px">
        评论审核
      </div>
      <p style="text-align: center; padding: 20px 0; font-size: 20px">
        是否通过该条评论
      </p>
      <div slot="footer" style="text-align: center">
        <Button type="warning" @click="cancelAuditBtn">取消</Button>
        <Button type="success" @click="confirmAuditBtn">确认</Button>
      </div>
    </Modal>
    <!-- 评论拒绝弹框 -->
    <Modal v-model="refuseVisible">
      <div slot="header" style="text-align: center; font-size: 18px">拒绝</div>
      <p> <span style="color:red">*</span> 请填写拒绝原因</p>
      <Input
        v-model="refuseValue"
        style="padding: 20px 0"
        type="textarea"
        :rows="4"
        placeholder=""
      />
      <div slot="footer" style="text-align: center">
        <Button type="warning" @click="refuseVisible = false">取消</Button>
        <Button type="success" @click="confirRefuseBtn">确认</Button>
      </div>
    </Modal>
    <!-- 查看弹框 -->
    <Modal v-model="checkVisible" >
      <div slot="header" style="text-align: center; font-size: 18px">查看</div>
      <p class="checkForm">
        评论ID：<span>{{ checkForm.id }}</span>
      </p>
      <p class="checkForm">
        评论内容：<br /><span>{{ checkForm.comment_content }}</span>
      </p>
      <p class="checkForm">
        用户呢称：<span>{{ checkForm.nickname }}</span>
      </p>
      <p class="checkForm">
        用户ID：<span>{{ checkForm.uid }}</span>
      </p>
      <p class="checkForm">
        评论时间：<span>{{ checkForm.add_time }}</span>
      </p>
      <p class="checkForm">
        评论状态：<span v-if="checkForm.status === 1">已通过</span>
        <span v-if="checkForm.status === 2">未通过</span>
      </p>
      <p class="checkForm" v-if="checkForm.status === 2">
        未通过原因：<br /><span>{{ checkForm.check_reason }}</span>
      </p>
      <div slot="footer" style="text-align: center">
        <Button type="warning" @click="checkVisible = false">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  commentAuditListApi,
  conmentAuditStatusApi,
  conmentRefuseStatusApi,
} from "@/api/audit";
import { formatDate } from "@/common/date.js";
export default {
  components: {},
  data() {
    return {
      auditButtonType:0,
      total: 0,
      spinShow:true,//加载
      id: "", //审核ID
      refuseValue: "", //拒绝原因值
      auditVisible: false, //审核弹框
      refuseVisible: false, //拒绝弹框
      checkVisible: false, //查看弹框
      //分页参数
      exchangeFrom: {
        page: 1,
        limit: 10,
      },
      //查询表单
      searchForm: {
        status: 0, //审核状态
        comment_content: "", //评论内容
        nickname: "", //用户昵称
        uid: "", //用户ID
      },
      timeArr: [], //评论时间
      //查看表单
      checkForm: {},
      //表格
      commentColumns: [
        {
          width: 110,
          title: "评论ID",
          // slot: "id",
          key: "id",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 120,
          title: "用户昵称",
          key: "nickname",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 110,
          title: "用户ID",
          key: "uid",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 120,
          title: "评论内容",
          key: "comment_content",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 200,
          title: "评论时间",
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
          title: "审核理由",
          key: "check_reason",
          slot: "check_reason",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 110,
          title: "审核状态",
          key: "status",
          slot: "status",
          align: "center",
          className: "table-head-style",
        },

        {
          width: 170,
          title: "操作",
          fixd:'right',
          slot: "action",
          key: "comment_id",
          align: "center",
          className: "table-head-style",
        },
      ],
      conmentTableData: [],
    };
  },
  created() {
    this.getCommentLis(); //评论列表
  },
  mounted() {},
  methods: {
    //获取评论审核列表start_time  end_time
    getCommentLis() {
      commentAuditListApi({
        ...this.exchangeFrom, //分页
        ...this.searchForm,
        start_time: this.timeArr[0],
        end_time: this.timeArr[1],
      }).then((res) => {
        this.conmentTableData = res.data.list;
        this.total = res.data.count
        this.spinShow = false
      });
    },
    //清空
    clearFormBtn() {
      (this.searchForm = {
        status: "", //审核状态
        comment_content: "", //评论内容
        nickname: "", //用户昵称
        uid: "", //用户ID
      }),
        (this.timeArr = []), //评论时间
        (this.exchangeFrom = {
          page: 1,
          limit: 10,
        });
      this.getCommentLis(); //评论列表
    },
    //事件选择事件
    timeChange(e) {
      this.timeArr = e;
    },
    //搜索
    searchFormBtn() {
      this.getCommentLis();
    },
    //审核
    commentAudit(row) {
      this.id = row.id;
      this.auditVisible = true;
    },
    auditButtonClick(num){
      this.auditButtonType = num
      this.searchForm.status = num
      // this.searchForm.status = num===0?"":num
      this.getCommentLis();
    },
    //审核取消
    cancelAuditBtn() {
      this.auditVisible = false;
    },
    //审核确认通过
    confirmAuditBtn() {
      //发送请求
      conmentAuditStatusApi({
        status: 1,
        id: this.id,
      }).then((res) => {
        this.$Message.success(res.msg);
        this.getCommentLis(); //刷新
        this.auditVisible = false;
      });
    },
    //拒绝
    refuseAudit(row) {
      this.id = row.id;
      this.refuseVisible = true;
    },
    //拒绝确认
    confirRefuseBtn() {
      conmentRefuseStatusApi({
        status: 2,
        id: this.id,
        check_reason: this.refuseValue,
      }).then((res) => {
        this.$Message.success(res.msg);
        this.getCommentLis(); //刷新
        this.refuseVisible = false;
        this.refuseValue = ""
      }).catch(err=>{
        this.$Message.warning(err.msg)
      });
      console.log(this.refuseValue, "拒绝原因值");
    },
    //查看
    refuseLook(row) {
      this.checkForm = JSON.parse(JSON.stringify(row));
      this.checkForm.add_time = formatDate(
        new Date(this.checkForm.add_time * 1000),
        "yyyy-MM-dd hh:mm:ss"
      );
      this.checkVisible = true;
    },
    // 分页
    pageChange(index) {
      this.exchangeFrom.page = index;
      this.getCommentLis()
    },
    pageSizeChange(index) {
      this.exchangeFrom.limit = index;
      this.getCommentLis()
    },
  },
};
</script>

<style scoped>
.checkForm {
  margin-top: 12px;
  padding-left: 20px;
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
}
</style>
