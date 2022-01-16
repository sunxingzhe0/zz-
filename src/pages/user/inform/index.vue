<template>
  <div class="search">
    <!-- 查询 -->
    <Form :model="searchForm" :label-width="80">
      <div class="dispose">
        <Button
          @click="disposeClick(3)"
          :type="disposeFlag === 3 ? 'primary' : 'default'"
          style="margin-right: 15px"
          >全部</Button
        >
        <Button
          @click="disposeClick('e:1')"
          :type="disposeFlag === 'e:1' ? 'primary' : 'default'"
          style="margin-right: 15px"
          >待处理</Button
        >
        <Button
          @click="disposeClick('e:2')"
          :type="disposeFlag === 'e:2' ? 'primary' : 'default'"
          >已处理</Button
        >
      </div>
      <Row>
        <Col span="4">
          <FormItem label="手机号：">
            <Input
              type="text"
              v-model="searchForm['e:phone']"
              placeholder="请输入手机号"
            />
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="用户昵称：">
            <Input
              type="text"
              v-model="searchForm['k:nickname']"
              placeholder="请输入用户昵称"
            /> </FormItem
        ></Col>

        <Col span="4">
          <FormItem label="用户ID：">
            <Input
              type="text"
              v-model="searchForm['e:uid']"
              placeholder="请输入用户ID"
            />
          </FormItem>
        </Col>

        <!-- <div style="text-align:right;margin-right:40px;padding-bottom:20px"> -->
        <Button type="success" @click="clearFormBtn" style="margin: 0 20px"
          ><Icon type="ios-aperture" />&nbsp;重置</Button
        >
        <Button type="primary" icon="ios-search" @click="searchFormBtn"
          >搜索</Button
        >
        <Button
          @click="sortClick('DESC')"
          :type="sortFlag === 'DESC' ? 'success' : 'default'"
          style="margin: 0 15px"
          >倒序排列</Button
        >
        <Button
          @click="sortClick('ASC')"
          :type="sortFlag === 'ASC' ? 'success' : 'default'"
          >正序排列</Button
        >
        <!-- </div> -->
      </Row>
      <div></div>
    </Form>
    <!-- 表格 -->
    <div class="table">
      <Table border :columns="infoColumns" :data="infoTableData">
        <!-- 头像 -->
        <template slot-scope="{ row, index }" slot="avatar">
          <viewer>
            <img style="width: 40px; height: 40px" :src="row.avatar" />
          </viewer>
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
    <Modal v-model="modalLook" width="900px">
      <p style="text-align: center; font-size: 20px">查看举报</p>
      <p style="font-weight: 550">举报用户信息</p>
      <Row>
        <Col span="10"
          >用户昵称：<span>{{ lookMsg.nickname }}</span></Col
        >
        <Col span="10"
          >用户ID：<span>{{ lookMsg.uid }}</span></Col
        >
      </Row>
      <Row>
        <Col span="10"
          >手机号：<span>{{ lookMsg.phone }}</span></Col
        >
      </Row>
      <Row>
        <Col span="5"
          >被举报次数：<span>{{ lookMsg.count }}</span></Col
        >
      </Row>
      <!-- <p style="font-weight:550">提交用户信息</p>
      <Row>
        <Col span="5"
          >用户昵称：<span>{{ lookMsg.nickname }}</span></Col
        >
        <Col span="5"
          >用户ID：<span>{{ lookMsg.uid }}</span></Col
        >
      </Row>
      <Row>
        <Col span="5"
          >手机号：<span>{{ lookMsg.phone }}</span></Col
        >
      </Row> -->
      <p style="font-weight: 550">举报记录</p>
      <div style="height: 500px; overflow-y: auto; overflow-x: hidden">
        <Table border :columns="detailColumns" :data="detailTableData">
          <template slot-scope="{ row, index }" slot="complain_images">
            <div style="display: flex; justify-content: space-around">
              <viewer v-for="(item, index) in row.complain_images" :key="index">
                <img style="width: 40px; height: 40px" :src="item" />
              </viewer>
            </div>
          </template>
          <template slot-scope="{ row, index }" slot="statusResult">
            <span v-if="row.status === 0">待处理</span>
            <span v-if="row.status === 1">已处理</span>
          </template>
        </Table>
        <div class="page">
          <Page
            :total="totalRecord"
            :current.sync="recordFrom.page"
            show-elevator
            show-sizer
            show-total
            @on-change="pageChange2"
            @on-page-size-change="pageSizeChange2"
            :page-size="recordFrom.limit"
          />
        </div>
      </div>
      <div slot="footer" style="text-align: center">
        <Button
          type="primary"
          @click="closeBannedClick"
          v-if="lookMsg.complain_status === 1"
          >关闭此举报</Button
        >
        <Button
          type="primary"
          @click="bannedClick"
          v-if="lookMsg.complain_status === 1"
          >封禁</Button
        >
        <Button
          type="primary"
          @click="warnClick"
          v-if="lookMsg.complain_status === 1"
          >警告</Button
        >
      </div>
    </Modal>

    <!-- 封禁用户 -->
    <Modal v-model="bannedVisible" :closable="false" width="400">
      <div slot="header" style="text-align: center; font-size: 18px">
        封禁用户
      </div>
      <p>
        <span style="color: red">*</span> 封禁天数：<Input
          style="width: 100px"
          Number
          v-model="blocked_day"
        ></Input
        >&nbsp;天
      </p>
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
        v-model="season"
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

      <div slot="footer" style="text-align: center">
        <Button type="warning" @click="bannedVisible = false">取消</Button>
        <Button type="success" @click="confirmResonValue">确认</Button>
      </div>
    </Modal>
    <!-- 警告用户 -->
    <Modal v-model="warnVisible" :closable="false" width="400">
      <div slot="header" style="text-align: center; font-size: 18px">
        警告用户
      </div>

      <p style="font-size: 14px; margin-bottom: 10px">
        <span style="color: red"> *</span>警告理由
      </p>

      <RadioGroup true-value @on-change="WarnChange" v-model="season2" vertical>
        <p v-for="(item, index) in backWarnList" :key="index">
          <Radio :label="item.label"></Radio>
        </p>
        <Radio label="自定义"></Radio>
      </RadioGroup>
      <Input
        v-if="definedValue2"
        v-model="refuseVlue2"
        type="textarea"
        :rows="4"
        placeholder=""
      />

      <div slot="footer" style="text-align: center">
        <Button type="warning" @click="warnVisible = false">取消</Button>
        <Button type="success" @click="confirmWarnBtn">确认</Button>
      </div>
    </Modal>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import {
  informUserLisApi,
  informRecordApi,
  informhandleApi,
  userBanApi,
  cateApi,
} from "@/api/user";
import { bannedResonApi } from "@/api/audit";
import { formatDate } from "@/common/date.js";
import Setting from "@/setting";
export default {
  components: {},
  data() {
    return {
      warnVisible: false, //警告弹框
      bannedVisible: false, //封禁弹框
      definedValue: false,
      definedValue2: false,
      refuseVlue: "", //自定义理由
      backList: [], //封禁
      backWarnList: [], //警告
      season: "", //处理理由
      season2: "", //警告
      blocked_day: "", //封禁天数
      detailID: "", //关闭此举报id
      sortFlag: "DESC", //排列方式
      disposeFlag: 3, //处理状态
      spinShow: true,
      total: 0,
      totalRecord: 0, //查看分页
      lookMsg: {
        count: 0,
        uid: "",
        nickname: "",
      }, //查看弹框基本信息
      lookMsg2: {},
      recordFrom: {
        page: 1,
        limit: 10,
      },
      exchangeFrom: {
        page: 1,
        limit: 10,
      },
      modalLook: false, //查看弹框
      refuseForm: {
        uid: "",
        closure_period: "", //封禁期限
        closure_reasons: "", //封禁原因
      },
      // 搜索
      searchForm: {
        "e:phone": "",
        "k:nickname": "",
        "e:uid": "",
      },
      //表格
      infoColumns: [
        {
          width: 80,
          title: "序号",
          type: "index",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "用户昵称",
          key: "nickname",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "用户ID",
          key: "uid",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "手机号",
          key: "phone",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "用户签名",
          key: "autograph",
          align: "center",
          className: "table-head-style",
          render: (h, params) => {
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
          },
        },
        {
          title: "用户头像",
          key: "avatar",
          slot: "avatar",
          align: "center",
          className: "table-head-style",
        },

        {
          width: 180,
          title: "操作",
          key: "action",
          slot: "action",
          align: "center",
          className: "table-head-style",
        },
      ],
      infoTableData: [
        {
          avatar: "",
          avatars: [],
        },
      ],
      //查看表格
      detailColumns: [
        // {
        //   width:100,
        //   fixed:'left',
        //   title: "被举报人昵称",
        //   key: "nickname",
        //   align: "center",
        //   className: "table-head-style",
        // },
        // {
        //   width:80,
        //   title: "被举报人id",
        //   key: "uid",
        //   align: "center",
        //   className: "table-head-style",
        // },
        // {
        //   width:100,
        //   title: "被举报人电话",
        //   key: "phone",
        //   align: "center",
        //   className: "table-head-style",
        // },
        // {
        //   width:100,
        //   title: "被举报人签名",
        //   key: "autograph",
        //   align: "center",
        //   className: "table-head-style",
        //   render: (h, params) => {
        //     return h("div", [
        //       h(
        //         "span",
        //         {
        //           style: {
        //             display: "inline-block",
        //             width: "100%",
        //             overflow: "hidden",
        //             textOverflow: "ellipsis",
        //             whiteSpace: "nowrap",
        //           },
        //           domProps: { title: params.row.autograph },
        //           on: {
        //             click: (e) => {
        //               e.stopPropagation();
        //             },
        //           },
        //         },
        //         params.row.autograph
        //       ),
        //     ]);
        //   },
        // },
        {
          width: 180,
          title: "举报时间",
          key: "created_at",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 100,
          title: "举报原因",
          key: "complain_desc",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 100,
          title: "举报图片",
          key: "complain_images",
          slot: "complain_images",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 100,
          title: "处理时间",
          key: "updated_at",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 100,
          title: "处理结果",
          key: "status",
          slot: "statusResult",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 100,
          fixed: "right",
          title: "提交人昵称",
          key: "sub_nickname",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 100,
          fixed: "right",
          title: "提交人id",
          key: "sub_uid",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 100,
          fixed: "right",
          title: "提交人电话",
          key: "sub_phone",
          align: "center",
          className: "table-head-style",
        },
      ],
      detailTableData: [],
    };
  },
  created() {
    this.getInformList();
    this.getBannedReson(); //获取封禁理由
    this.getWarnReson(); //获取警告理由
  },
  mounted() {},
  methods: {
    //获取举报管理列表
    getInformList() {
      let complainStatus = this.disposeFlag === 3 ? "E:0" : this.disposeFlag;
      informUserLisApi({
        ...this.exchangeFrom,
        ...this.searchForm,
        "c:complain_status": complainStatus,
        "o:add_time": this.sortFlag,
      }).then((res) => {
        this.infoTableData = res.data.list;
        this.infoTableData.forEach((item, index) => {
          item.avatar = Setting.url(item.avatar);
          // item.complain_images = item.complain_images.split(",");
        });
        this.total = res.data.count;
        this.spinShow = false;
      });
    },
    //获取查看记录弹框列表
    getRecordList(uid) {
      this.spinShow = true;
      informRecordApi({
        ...this.recordFrom,
        "e:c:uid": uid,
      }).then((res) => {
        this.lookMsg.count = res.data.count;
        this.detailTableData = res.data.list;
        this.detailTableData.forEach((item, index) => {
          item.complain_images = item.complain_images.split(",").map((v) => {
            return Setting.url(v);
          });
        });
        this.totalRecord = res.data.count;
        this.spinShow = false;
        console.log(this.detailTableData, "02");
      });
    },
    //获取封禁理由
    getBannedReson() {
      bannedResonApi({
        status: 1,
        gid: 73,
      }).then((res) => {
        this.backList = res.data.list.map((item, index) => {
          return {
            value: item.id,
            label: item.content,
          };
        });
      });
    },
    //获取警告理由
    getWarnReson() {
      bannedResonApi({
        status: 1,
        gid: 74,
      }).then((res) => {
        this.backWarnList = res.data.list.map((item, index) => {
          return {
            value: item.id,
            label: item.content,
          };
        });
      });
    },
    //待处理已处理状态
    disposeClick(num) {
      this.disposeFlag = num;
      this.getInformList();
    },
    //排列方式
    sortClick(sort) {
      this.sortFlag = sort;
      this.getInformList();
    },
    //   查看
    detailBtn(row) {
      this.detailID = row.uid;
      this.lookMsg = row;
      this.getRecordList(row.uid);
      this.modalLook = true;
    },

    // 确认封禁
    informConfirm() {
      if (this.refuseForm.closure_period === "") {
        return this.$Message.warning("封禁时间不能为空！");
      } else if (this.refuseForm.closure_reasons === "") {
        return this.$Message.warning("封禁原因不能为空！");
      } else {
        userBanApi({
          ...this.refuseForm,
        })
          .then((res) => {
            this.$Message.success(res.msg);
            this.modalInform = false;
            this.refuseForm = {
              uid: "",
              closure_period: "", //天数
              closure_reasons: "", //原因
            };
            this.getInformList();
          })
          .catch((err) => {
            this.$Message.warning(res.msg);
          });
      }
    },
    //重置
    clearFormBtn() {
      this.searchForm = {
        "e:phone": "",
        "k:nickname": "",
        "e:uid": "",
      };
      this.disposeFlag = 1;
      this.getInformList();
    },
    //搜索
    searchFormBtn() {
      this.getInformList();
    },
    // 分页
    pageChange(index) {
      this.exchangeFrom.page = index;
      this.getInformList();
    },
    pageSizeChange(index) {
      this.exchangeFrom.limit = index;
      this.getInformList();
    },
    //关闭此举报
    closeBannedClick() {
      informhandleApi({
        uid: this.detailID,
      })
        .then((res) => {
          this.$Message.success(res.msg);
          this.modalLook = false;
          this.getInformList();
        })
        .catch((err) => {
          this.$Message.warning(err.msg);
        });
    },
    //封禁操作1208
    bannedClick() {
      this.bannedVisible = true;
    },
    //封禁change
    refuseChange(e) {
      if (e === "自定义") {
        this.definedValue = true;
      } else {
        this.definedValue = false;
      }
    },
    //确认封禁
    confirmResonValue() {
      if (!this.blocked_day) {
        return this.$Message.warning("请输入封禁天数！");
      }
      if (!this.season) {
        return this.$Message.warning("请选择拒绝理由!");
      }
      if (this.season === "自定义" && !this.refuseVlue) {
        return this.$Message.warning("请填写自定义理由!");
      }
      let season = this.season === "自定义" ? this.refuseVlue : this.season;
      let blocked_day = this.blocked_day * 24 * 60 * 60;
      informhandleApi({
        uid: this.detailID,
        season: season,
        blocked_day: blocked_day,
      })
        .then((res) => {
          this.$Message.success(res.msg);
          this.bannedVisible = false;
          this.modalLook = false;
          this.getInformList();
          this.refuseVlue = "";
          this.blocked_day = "";
          this.season = "";
        })
        .catch((err) => {
          this.$Message.warning(err.msg);
        });
    },
    //警告change
    WarnChange(e) {
      if (e === "自定义") {
        this.definedValue2 = true;
      } else {
        this.definedValue2 = false;
      }
    },
    //警告
    warnClick() {
      this.warnVisible = true;
    },
    //确人警告
    confirmWarnBtn() {
      if (!this.season2) {
        return this.$Message.warning("请选择拒绝理由!");
      }
      if (this.season2 === "自定义" && !this.refuseVlue2) {
        return this.$Message.warning("请填写自定义理由!");
      }
      let season = this.season2 === "自定义" ? this.refuseVlue2 : this.season2;
      informhandleApi({
        uid: this.detailID,
        season: season,
      })
        .then((res) => {
          this.$Message.success(res.msg);
          this.warnVisible = false;
          this.modalLook = false;
          this.getInformList();
          this.refuseVlue2 = "";
          this.season2 = "";
        })
        .catch((err) => {
          this.$Message.warning(err.msg);
        });
    },
    // 查看分页
    pageChange2(index) {
      this.recordFrom.page = index;
      this.getRecordList(this.lookMsg.uid);
    },
    pageSizeChange2(index) {
      this.recordFrom.limit = index;
      this.getRecordList(this.lookMsg.uid);
    },
  },
};
</script>

<style scoped>
/deep/.ivu-page-options-elevator {
  margin-left: 12px;
}
.dispose {
  margin-left: 20px;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ccc;
}
.diamondTable {
  width: 500px;
}
.ivu-col-span-5,
.ivu-col-span-10 {
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
