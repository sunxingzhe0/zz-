<template>
  <div class="video-page">
    <div class="search">
      <!-- 查询 -->
      <Form :model="searchForm" :label-width="80">
        <Row>
          <div style="margin: 0 0 10px 20px">
            <Button
              @click="auditButtonClick(0)"
              :type="auditButtonType === 0 ? 'primary' : 'default'"
              style="margin-right: 10px"
              >待审核</Button
            >
            <Button
              @click="auditButtonClick(1)"
              :type="auditButtonType === 1 ? 'primary' : 'default'"
              style="margin-right: 10px"
              >已通过</Button
            >
            <Button
              @click="auditButtonClick(2)"
              :type="auditButtonType === 2 ? 'primary' : 'default'"
              >未通过</Button
            >
          </div>
        </Row>
        <Row>
          <Col span="4">
            <FormItem label="合集标题：">
              <Input
                type="text"
                v-model="searchForm['e:t:title_new']"
                placeholder="请输入合集标题"
              />
            </FormItem>
          </Col>

          <Col span="4">
            <FormItem label="合集ID：">
              <Input
                type="text"
                v-model="searchForm['e:t:id']"
                placeholder="请输入合集 ID"
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
                v-model="searchForm['e:t:uid']"
                placeholder="请输入用户ID"
              />
            </FormItem>
          </Col>
          <Button type="primary" style="margin-left: 20px" @click="clearClick">
            <Icon type="ios-aperture" />重置</Button
          >
          <Button
            style="margin: 0 20px"
            type="primary"
            icon="ios-search"
            @click="searchClick"
            >搜索</Button
          >

          <Button type="success" class="more" @click="showSearchBtn()"
            >{{ flagType ? "展开" : "收起"
            }}<Icon :type="flagType ? 'md-arrow-dropup' : 'md-arrow-dropright'"
          /></Button>
        </Row>
        <Row v-if="!flagType">
          <Col span="6">
            <FormItem label="合集类型：">
              <Button
                @click="videoButtonClick(3)"
                :type="payButtonType === 3 ? 'primary' : 'default'"
                style="margin-right: 10px"
                >全部</Button
              >
              <Button
                @click="videoButtonClick(1)"
                :type="payButtonType === 1 ? 'primary' : 'default'"
                style="margin-right: 10px"
                >新建</Button
              >
              <Button
                @click="videoButtonClick(0)"
                :type="payButtonType === 0 ? 'primary' : 'default'"
                >修改</Button
              >
            </FormItem>
          </Col>

          <div>
            <Button
              v-if="auditButtonType !== 1 && auditButtonType !== 2"
              style="margin-left: 20px"
              type="warning"
              @click="batchAuditClick"
              >批量审核拒绝</Button
            >
            <Button
              v-if="auditButtonType !== 1"
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
        <!-- 封面图 -->
        <template slot-scope="{ row, index }" slot="total_cover_new">
          <viewer>
            <img style="width: 40px; height: 40px" :src="row.total_cover_new" />
          </viewer>
        </template>

        <!-- 发布时间 -->
        <template slot-scope="{ row, index }" slot="add_time">
          {{ row.add_time | formatDate }}
        </template>
        <!-- 类型 -->
        <template slot-scope="{ row, index }" slot="new">
          <span v-if="row.title === '' || row.title === row.title_new"
            >新建</span
          >
          <span v-if="row.title !== '' && row.title !== row.title_new"
            >修改</span
          >
        </template>
        <!-- 审核状态 -->
        <template slot-scope="{ row, index }" slot="status">
          <span v-if="row.status === 0" style="color: #008ef0">审核中</span>
          <span v-if="row.status === 1" style="color: #34a30a">审核通过</span>
          <span v-if="row.status === 2" style="color: red">审核不通过</span>
        </template>

        <!-- 操作 -->
        <template slot-scope="{ row, index }" slot="action">
          <!-- <Button v-if="row.status!==1" type="primary" @click="auditStatusClick(row)">审核</Button -->
          <!-- >&nbsp; -->
          <a
            v-if="row.status !== 1"
            type="warning"
            style="margin-right: 10px"
            @click="videoProcessClick(row)"
            >通过</a
          >
          <Divider v-if="row.status !== 1" type="vertical" />
          <a
            v-if="row.status !== 1 && row.status !== 2"
            type="warning"
            style="margin-right: 10px"
            @click="videoRefuseClick(row)"
            >拒绝</a
          >

          <a
            style="color: red"
            type="error"
            v-if="row.status === 1"
            @click="delVideoClick(row)"
            >删除</a
          >
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

    <!-- 拒绝原因弹框 -->
    <Modal v-model="auditVisibleReson" width="380">
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
        v-model="refuseForm.reason"
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
      <div></div>

      <div slot="footer" style="text-align: center">
        <Button type="warning" @click="auditVisibleReson = false">取消</Button>
        <Button type="success" @click="confirmResonValue">确认</Button>
      </div>
    </Modal>
    <!-- 批量拒绝原因弹框 -->
    <Modal v-model="auditVisibleBatch" width="380">
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
        v-model="refuseForm.reason"
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
      <div></div>

      <div slot="footer" style="text-align: center">
        <Button type="warning" @click="auditVisibleBatch = false">取消</Button>
        <Button type="success" @click="confirmResonBatch">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { combineAuditApi, AuditConfigApi, delConfigApi } from "@/api/audit";
import { collectionTotalApi } from "@/api/collection";
import { videoSortApi } from "@/api/user";
import { refuseListApi } from "@/api/setting";
import { formatDate } from "@/common/date.js";
import Setting from "@/setting";
export default {
  components: {},
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
      flagVideo: true,
      singleVideoId: "", //拒绝单个id
      auditButtonType: 0,
      payButtonType: 3,
      batchDelID: [],
      delValue: true,
      definedValue: false,
      backList: [], //拒绝理由选择
      total: 0,
      spinShow: false, //loadding
      statusID: 0, //修改状态的ID
      refuseVlue: "", //拒绝原因
      refuseForm: {
        reason: "",
      }, //拒绝表单
      checkTypeVisible: false, //查看视频类型弹框
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
        "e:t:title_new": "", //合集标题
        "e:t:id": "", //合集ID
        "k:u:nickname": "", //用户昵称
        "e:t:uid": "", //用户ID
      },
      //表格
      videoColumns: [
        {
          minWidth: 60,
          title: "序号",
          type: "selection",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth: 100,
          title: "合集ID",
          key: "id",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth: 100,
          title: "合集封面",
          slot: "total_cover_new",
          key: "total_cover_new",
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
          minWidth: 100,
          title: "合集简介",
          key: "desc_new",
          align: "center",
          className: "table-head-style",
          render: (h, params) => {
            if (!params.row.desc_new) return h("span", "暂无签名");
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
          minWidth: 100,
          title: "用户昵称",
          key: "nickname",
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
          minWidth: 160,
          title: "用户提交时间",
          key: "add_time",
          slot: "add_time",
          align: "center",
          className: "table-head-style",
          sortable: true,
          sortType: "desc",
        },

        {
          minWidth: 100,
          title: "审核状态",
          key: "status",
          slot: "status",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth: 200,
          title: "类型",
          slot: "new",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth: 160,
          title: "操作",
          fixed: "right",
          slot: "action",
          align: "center",
          className: "table-head-style",
        },
      ],
      videoData: [],
    };
  },
  created() {
    this.getCombineAuditLis(); //合集列表
    // this.getVideoList(); //视频列表
    this.getRefuse();
  },
  mounted() {},
  methods: {
    // 12----30 获取合集列表
    getCombineAuditLis() {
      let Type = this.payButtonType === 3 ? "" : this.payButtonType;
      collectionTotalApi({
        ...this.exchangeFrom,
        ...this.searchForm,
        "e:t:status": this.auditButtonType,
        is_new: Type,
      }).then((res) => {
        this.total = res.data.count;
        this.videoData = res.data.list;
        this.videoData.forEach((item) => {
          item.total_cover_new = Setting.url(item.total_cover_new);
        });
      });
    },

    //获取拒绝理由
    getRefuse() {
      AuditConfigApi({
        gid: 77,
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
    auditButtonClick(num) {
      this.auditButtonType = num;
      this.exchangeFrom.page = 1;
      this.exchangeFrom.limit = 10;
      this.getCombineAuditLis();
    },

    //查询
    searchClick() {
      this.getCombineAuditLis();
      console.log(this.searchForm, "查询参数");
    },
    //删除---针对已通过的出现
    delVideoClick(row) {
      this.$Modal.confirm({
        title: "确定要删除这条数据吗？",
        onOk: () => {
          delConfigApi({
            id: row.id,
          })
            .then((res) => {
              this.$Message.success(res.msg);
              this.getCombineAuditLis(); //视频列表
            })
            .catch((err) => {
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
        "e:t:title_new": "", //合集标题
        "e:t:id": "", //合集ID
        "k:u:nickname": "", //用户昵称
        "e:t:uid": "", //用户ID
      };
      this.auditButtonType = 0;
      this.payButtonType = 3;
      this.exchangeFrom = {
        page: 1,
        limit: 10,
      };
      this.getCombineAuditLis();
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

    //批量拒绝
    confirmResonBatch() {
      if (!this.refuseForm.reason) {
        return this.$Message.warning("请选择一个拒绝理由！");
      }

      let reason =
        this.refuseForm.reason == "自定义"
          ? this.refuseVlue
          : this.refuseForm.reason;
      combineAuditApi({
        id: this.batchDelID,
        reason: reason,
        status: 2,
      }).then((res) => {
        this.$Message.success(res.msg);
        this.auditVisibleBatch = false;
        this.getCombineAuditLis();
        this.refuseForm = {
          "u:check_reason": "",
        };
        this.batchDelID = [];
        this.refuseVlue = "";
      });
    },
    // 单个通过
    videoProcessClick(row) {
      this.$Modal.confirm({
        title: "是否允许该合集通过并发布？",
        onOk: () => {
          combineAuditApi({
            status: 1,
            id: row.id,
          })
            .then((res) => {
              this.$Message.success(res.msg);
              this.getCombineAuditLis();
            })
            .catch((err) => {
              this.$Message.warning(err.msg);
            });
        },
        onCancel: () => {
          this.$Message.info("已取消");
        },
      });
    },
    //单个拒绝
    videoRefuseClick(row) {
      this.singleVideoId = row.id;
      this.auditVisibleReson = true;
    },
    confirmResonValue() {
      console.log(this.refuseForm.reason);
      if (!this.refuseForm.reason) {
        return this.$Message.warning("请选择一个拒绝理由！");
      }

      let reason =
        this.refuseForm.reason === "自定义"
          ? this.refuseVlue
          : this.refuseForm.reason;

      combineAuditApi({
        id: this.singleVideoId,
        reason: reason,
        status: 2,
      }).then((res) => {
        this.$Message.success(res.msg);
        this.auditVisibleReson = false;
        this.getCombineAuditLis();
        this.refuseForm = {
          "u:check_reason": "",
        };
        this.refuseVlue = "";
      });
    },
    //批量通过
    batchProcessClick() {
      this.batchDelID = this.$refs.selection
        .getSelection()
        .map((item, index) => {
          return item.id;
        });
      if (this.batchDelID.length < 2) {
        return this.$Message.warning("请至少选择2条数据！");
      }
      this.$Modal.confirm({
        title: "是否允许该合集通过并发布？",
        onOk: () => {
          combineAuditApi({
            id: this.batchDelID,
            status: 1,
          }).then((res) => {
            this.$Message.success(res.msg);
            this.getCombineAuditLis();
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
          return item.id;
        });
      if (this.batchDelID.length < 2) {
        return this.$Message.warning("请至少选择2条数据！");
      }
      this.auditVisibleBatch = true;
    },
    //合集类型
    videoButtonClick(num) {
      this.payButtonType = num;
      this.getCombineAuditLis();
    },
    // 分页
    pageChange(index) {
      this.exchangeFrom.page = index;
      this.getCombineAuditLis(); //视频列表
    },
    pageSizeChange(index) {
      this.exchangeFrom.limit = index;
      this.getCombineAuditLis(); //视频列表
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
/deep/.ivu-tree {
  display: flex !important;
}
</style>
