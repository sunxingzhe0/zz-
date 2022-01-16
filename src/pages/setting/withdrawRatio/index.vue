<template>
  <div class="refuse-page">
    <!-- 添加拒绝理由 -->
    <Button type="primary" class="addBtn" @click="addRatioBtn">添加</Button>
    <!-- 表格 -->
    <div class="add">
      <p>价格区间请勿重复;正确设置例如:区间0-500,501-1000,1001-10000</p>
      <Table border :columns="columns1" :data="data1">
        <template slot-scope="{ row, index }" slot="action1">
          <Button type="primary" @click="editRatioBtn(row)">编辑</Button>&nbsp;
          <Button type="primary" @click="delRatioBtn(row.withdrawal_id)">删除</Button>
        </template>
        <template slot-scope="{ row, index }" slot="ratioRange">
          {{ row.minimum_value }}-{{ row.maximum_value }}
        </template>
        <template slot-scope="{ row, index }" slot="ratioStatus">
          <span v-if="row.status === 1">启用</span>
          <span v-if="row.status === 2">禁止</span>
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
    <!-- 添加区间弹框 -->
    <Modal v-model="addRatioVisible" title="比例设置" @on-ok="addRatioLis" @on-cancel="cancel">
      <p>价格区间</p>
      <Form ref="formInline" :model="ratioform" inline>
        <Form-item>
          <Input
            style="width: 120px"
            type="text"
            v-model="ratioform.minimum_value"
            placeholder="最低"
          ></Input>
          ----
          <Input
            style="width: 120px"
            type="text"
            v-model="ratioform.maximum_value"
            placeholder="最高"
          ></Input>
        </Form-item>
        <Form-item>
          <p style="width: 400px">手续费比例</p>
          <Input
            style="width: 120px"
            type="text"
            v-model="ratioform.service_charge"
            placeholder="比例"
          ></Input
          >%
        </Form-item>
        <Form-item>
          <Radio-group v-model="ratioform.status">
            <Radio label="1">启用</Radio>
            <Radio label="2">停用</Radio>
          </Radio-group>
        </Form-item>
      </Form>
    </Modal>
    <!-- 编辑区间弹框 -->
    <Modal v-model="editRatioVisible" title="比例设置" @on-ok="editRatioLis" @on-cancel="cancel">
      <p>价格区间</p>
      <Form ref="formInline" :model="ratioform" inline>
        <Form-item>
          <Input
            style="width: 120px"
            type="text"
            v-model="ratioform.minimum_value"
            placeholder="最低"
          ></Input>
          ----
          <Input
            style="width: 120px"
            type="text"
            v-model="ratioform.maximum_value"
            placeholder="最高"
          ></Input>
        </Form-item>
        <Form-item>
          <p style="width: 400px">手续费比例</p>
          <Input
            style="width: 120px"
            type="text"
            v-model="ratioform.service_charge"
            placeholder="比例"
          ></Input
          >%
        </Form-item>
        <Form-item>
          <Radio-group v-model="ratioform.status">
            <Radio label="1">启用</Radio>
            <Radio label="2">禁止</Radio>
          </Radio-group>
        </Form-item>
      </Form>
    </Modal>
  </div>
</template>

<script>
import {
  withdrawalAddApi,
  withdrawalListApi,
  withdrawalEditApi,
  withdrawalDelApi
} from "@/api/setting";
export default {
  components: {},
  data() {
    return {
      addRatioVisible: false, //添加区间弹框
      editRatioVisible: false, //编辑区间弹框
      spinShow: true, //loadding
      total: 0, //分页共计
      //分页
      pageData: {
        page: 1,
        limit: 10,
      },
      ratioform: {
        minimum_value: "", //最低区间
        maximum_value: "", //最高区间
        service_charge: "", //比例
        status: "1", //状态
      },
      // 表格
      columns1: [
        {
          title: "ID号",
          key: "withdrawal_id",
          width: 60,
          align: "center",
          className: "table-head-style",
        },
        {
          title: "比例区间",
          key: "minimum_value ",
          slot: "ratioRange",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "手续费比例(%)",
          key: "service_charge",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "状态",
          key: "status",
          slot: "ratioStatus",
          align: "center",
          className: "table-head-style",
        },

        {
          width: 190,
          title: "操作",
          slot: "action1",
          align: "center",
          fixed: "right",
          className: "table-head-style",
        },
      ],
      data1: [],
    };
  },
  created() {
    // 列表
    this.getWithDrawalData();
  },
  mounted() {},
  methods: {
    //回去提现比例列表
    getWithDrawalData() {
      withdrawalListApi({
        page: this.pageData.page,
        limit: this.pageData.limit,
      }).then((res) => {
        this.data1 = res.data.list;
        this.total = res.data.count;
        this.spinShow = false;
      });
    },
    //添加区间按钮
    addRatioBtn() {
      this.addRatioVisible = true;
    },
    //添加列表
    addRatioLis() {
      withdrawalAddApi({
        ...this.ratioform,
      }).then((res) => {
        this.$Message.success(res.msg);
        this.getWithDrawalData();
        this.ratioform = {
          minimum_value: "", //最低区间
          maximum_value: "", //最高区间
          service_charge: "", //比例
          status: "1", //状态
        };
      });
      console.log(this.ratioform, "表单值");
    },
    //编辑列表
    editRatioLis() {
      withdrawalEditApi({
        id: this.ratioform.withdrawal_id,
        ...this.ratioform,
      }).then((res) => {
        this.$Message.success(res.msg);
        this.ratioform = {
          minimum_value: "", //最低区间
          maximum_value: "", //最高区间
          service_charge: "", //比例
          status: "1", //状态
        };
        this.getWithDrawalData(); //刷新
        
      });
    },
    //编辑区间按钮
    editRatioBtn(row) {
      this.ratioform = JSON.parse(JSON.stringify(row));
      this.ratioform.status = JSON.stringify(row.status);
      this.editRatioVisible = true;
    },
    //取消弹框
    cancel(){
       this.ratioform = {
          minimum_value: "", //最低区间
          maximum_value: "", //最高区间
          service_charge: "", //比例
          status: "1", //状态
        };
    },
    //删除区间按钮
    delRatioBtn(id) {
      console.log(id,'kkk')
       this.$Modal.confirm({
        title: "删除",
        content: `<p>确定要删除这条数据吗？"</p>`,
        onOk: () => {
         withdrawalDelApi(id)
        .then((res) => {
          this.getWithDrawalData(); //刷新
          this.spinShow = false;
          this.$Message.success(res.msg);
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
        },
        onCancel: () => {
          this.$Message.info("点击了取消");
        },
      });
     
    },

    // 分页
    pageChange(index) {
      this.pageData.page = index;
      this.getWithDrawalList();
    },
    pageSizeChange(index) {
      this.pageData.limit = index;
      this.getWithDrawalList();
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
