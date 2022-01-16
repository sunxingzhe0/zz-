<template>
  <div class="refuse-page">
    <!-- 添加拒绝理由 -->
    <Button type="primary" class="addBtn" @click="addPayList">添加</Button>
    <!-- 表格 -->
    <div class="add">
      <Table border :columns="columns1" :data="data1">
        <template slot-scope="{ row, index }" slot="action">
          <Button
            type="primary"
            style="margin-right: 10px"
            @click="editClik(row)"
            >编辑</Button
          >
          <Button type="primary" @click="deiClick(row)">删除</Button>
        </template>
        <template slot-scope="{ row, index }" slot="status">
          <span v-if="row.status === 1">启用</span>
          <span v-if="row.status === 2">停用</span>
        </template>
      </Table>
      <Spin size="large" fix v-if="spinShow"></Spin>
      <!-- 分页 -->
      <div class="page">
        <Page
          :total="total"
          :current="pageData.page"
          show-elevator
          show-sizer
          show-total
          @on-change="pageChange"
          @on-page-size-change="pageSizeChange"
          :page-size="pageData.limit"
        />
      </div>
    </div>
    <!-- 添加 -->
    <Modal
      v-model="addVisible"
      title="添加银行卡"
      @on-ok="addClick"
      @on-cancel="addVisible = false"
    >
      <p style="margin-bottom: 10px">
        <span style="color: red">*</span>银行卡类型
      </p>
      <Select v-model="addForm.pay_id" style="width: 200px">
        <Option v-for="item in payList" :value="item.value" :key="item.value">{{
          item.label
        }}</Option>
      </Select>
      <p style="margin: 10px 0"><span style="color: red">*</span>银行卡账号</p>
      <Input
        v-model="addForm.account_number"
        placeholder="请输入账号"
        style="width: 300px"
      ></Input>
      <div style="margin-top: 20px">
        <Radio-group v-model="addForm.status">
          <Radio label="1">启用</Radio>
          <Radio label="2">停用</Radio>
        </Radio-group>
      </div>
    </Modal>
    <!-- 编辑 -->
    <Modal
      v-model="editVisible"
      title="编辑银行卡"
      @on-ok="editClick"
      @on-cancel="editVisible = false"
    >
     <p style="margin-bottom: 10px">
        <span style="color: red">*</span>银行卡类型
      </p>
      <Select v-model="addForm.pay_id" style="width: 200px">
        <Option v-for="item in payList" :value="item.value" :key="item.value">{{
          item.label
        }}</Option>
      </Select>
      <p style="margin: 10px 0"><span style="color: red">*</span>银行卡账号</p>
      <Input
        v-model="addForm.account_number"
        placeholder="请输入账号"
        style="width: 300px"
      ></Input>
      <div style="margin-top: 20px">
        <Radio-group v-model="addForm.status">
          <Radio label="1">启用</Radio>
          <Radio label="2">停用</Radio>
        </Radio-group>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  payAccountListApi,
  payAccountAddApi,
  payAccountEditApi,
  payAccountDelApi,
  payTypeListApi
} from "@/api/setting";
export default {
  components: {},
  data() {
    return {
      total: 0,
      spinShow:true,//加载
      payId: "", //支付方式ID
      addForm: {
        pay_id: "", //添加支付方式
        status: "1", //状态
        account_number: "", //账号
      },
      //类型选择
      payList: [],
      addVisible: false, //添加
      editVisible: false, //编辑
      //分页
      total: 0,
      pageData: {
        page: 1,
        limit: 10,
      },
      //表格
      // 表格
      columns1: [
        {
          title: "账号ID",
          key: "account_id",
          width: 100,
          align: "center",
          className: "table-head-style",
        },
        {
          title: "支付方式",
          key: "pay_mode",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "账号",
          key: "account_number",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "状态",
          key: "status ",
          slot: "status",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "操作",
          width: 170,
          key: "minimum_value ",
          slot: "action",
          align: "center",
          className: "table-head-style",
        },
      ],
      data1: [],
    };
  },
  created() {
    this.getSelectData()
    this.getPatAccountLis(); // 列表
  },
  mounted() {},
  methods: {
    // 获取类型选择框数据
    getSelectData(){
      payTypeListApi({}).then(res=>{
        this.payList = res.data.list.map((item)=>{
          return{
            value:item.pay_id,
            label:item.pay_mode,
          }
        })
      })
    },
    //支付类型列表
    getPatAccountLis() {
      payAccountListApi({
        ...this.pageData,
      }).then((res) => {
        this.data1 = res.data.list;
        this.total = res.data.count;
        this.spinShow = false
      });
    },
    //添加
    addPayList() {
      this.addVisible = true;
    },
    //编辑
    editClik(row) {
      this.payId = row.account_id;
      this.addForm = JSON.parse(JSON.stringify(row));
      this.addForm.status = JSON.stringify(row.status);
      this.editVisible = true;
    },
    addClick() {
      if (this.addForm.pay_mode === "") {
        return this.$Message.warning("支付类型不能为空！");
      } else if (this.addForm.account_number === "") {
        return this.$Message.warning("支付账号不能为空！");
      }
      payAccountAddApi({
        ...this.addForm,
      })
        .then((res) => {
          this.$Message.success(res.msg);
          this.getPatAccountLis();
          this.addForm = {
            pay_id: "", //添加支付方式
            status: "1", //状态
            account_number: "", //账号
          };
        })
        .catch((err) => {
          this.$Message.warning(err.msg);
        });
    },
    editClick() {
       if (this.addForm.pay_mode === "") {
        return this.$Message.warning("支付类型不能为空！");
      } else if (this.addForm.account_number === "") {
        return this.$Message.warning("支付账号不能为空！");
      }
      payAccountEditApi({
        account_number:this.addForm.account_number,
        pay_id:this.addForm.pay_id,
        status:this.addForm.status,
        id: this.payId,
      })
        .then((res) => {
          this.$Message.success(res.msg);
          this.getPatAccountLis();
          this.addForm = {
            pay_id: "", //添加支付方式
            status: "1", //状态
            account_number: "", //账号
          };
        })
        .catch((err) => {
          this.$Message.warning(err.msg);
        });
    },
    //删除
    deiClick(row) {
      this.$Modal.confirm({
        title: `确定要删除支付账号为（${row.account_number}）这条数据吗？`,
        onOk: () => {
          payAccountDelApi(row.account_id)
            .then((res) => {
              this.$Message.success("已删除！");
              this.getPatAccountLis();
            })
            .catch((err) => {
              this.$Message.warning(err.msg);
            });
        },
      });
    },
    // 分页
    pageChange(index) {
      this.pageData.page = index;
      this.getPatAccountLis();
    },
    pageSizeChange(index) {
      this.pageData.limit = index;
      this.getPatAccountLis();
    },
  },
};
</script>

<style scoped>
.page {
  text-align: right;
}
>>> .ivu-table th.table-head-style {
  background: #f2f2f2 !important;
  color: #333;
}
.addBtn {
  width: 80px;
  height: 40px;
  font-size: 24px;
}
.add {
  margin-top: 2rem;
}
.refuse-page {
  background-color: #fff;
  padding: 3rem 2rem;
}
</style>
