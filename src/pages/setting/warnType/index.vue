<template>
  <div class="refuse-page">
    <!-- 添加拒绝理由 -->
    <Button type="primary" class="addBtn" @click="addReasonList">添加</Button>
    <!-- 表格 -->
    <div class="add">
      <Table border :columns="columns1" :data="data1">
        <template slot-scope="{ row, index }" slot="status">
          <span v-if="row.status === 1">启用</span>
          <span v-if="row.status === 2">停用</span>
        </template>
        <template slot-scope="{ row, index }" slot="action1">
          <Button type="primary" @click="editReasonList(row)">编辑</Button
          >&nbsp;
          <Button type="primary" @click="delReasonList(row)">删除</Button>
        </template>
      </Table>
      <Spin size="large" fix v-if="spinShow"></Spin>
      <!-- 分页 -->
      <div class="page">
        <Page
          :total="total"
          :current="addForm.page"
          show-elevator
          show-sizer
          show-total
          @on-change="pageChange"
          @on-page-size-change="pageSizeChange"
          :page-size="addForm.limit"
        />
      </div>
    </div>
    <!-- 添加弹框 -->
    <Modal
      v-model="addVisible"
      title="添加内容"
      @on-ok="add"
      @on-cancel="cancel"
    >
      <p>内容名称</p>
      <div style="padding: 10px">
        <Input
          v-model="addForm.content"
          placeholder=""
          style="width: 300px"
        />
      </div>
      <Radio-group v-model="addForm.status">
        <Radio label="1">启用</Radio>
        <Radio label="2">停用</Radio>
      </Radio-group>
    </Modal>
    <!-- 编辑弹框 -->
    <Modal
      v-model="editVisible"
      title="添加词条"
      @on-ok="edit"
      @on-cancel="cancel"
    >
      <p>词条名称</p>
      <div style="padding: 10px">
        <Input
          v-model="addForm.content"
          placeholder=""
          style="width: 300px"
        />
      </div>
      <Radio-group v-model="addForm.status">
        <Radio label="1">启用</Radio>
        <Radio label="2">停用</Radio>
      </Radio-group>
    </Modal>
  </div>
</template>

<script>
import {
  refuseAddApi,
  warnListApi,
  refuseEditApi,
  refuseDelListApi,
} from "@/api/setting";
export default {
  components: {},
  data() {
    return {
      editId:0,
      spinShow: true, //loadding
      total: 0, //分页共计
      addForm: {
        page: 1,
        limit: 10,
        content: "", //词条名称
        status: "1", //启用停用
      },

      addVisible: false, //添加弹框
      editVisible: false, //编辑弹框
      // 表格
      columns1: [
        {
          title: "序号",
          type: "index",
          width: 60,
          align: "center",
          className: "table-head-style",
        },
        {
          title: "编号",
          key: "id",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "内容",
          key: "content",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "状态",
          key: "status",
          slot: "status",
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
    this.refuseList();
  },
  mounted() {},
  methods: {
    //违规理由列表
    refuseList() {
      warnListApi({
        status: '',
        gid: 74,
        page: this.addForm.page,
        limit: this.addForm.limit,
      }).then((res) => {
        this.data1 = res.data.list;
        this.total = res.data.count;
        this.spinShow = false;
      });
    },
    //添加违规理由列表
    addRefuseList() {
      refuseAddApi({
        content: this.addForm.content,
        status: this.addForm.status,
        sort:1,
        gid: 74,
      })
        .then((res) => {
          this.refuseList(); //刷新违规理由列表
          this.spinShow = false;
          this.$Message.success(res.msg);
          this.addForm = {
            page: 1,
            limit: 10,
            content: "", //词条名称
            status: "1", //启用停用
          };
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
    //编辑违规理由列表
    editRefuseList() {
      refuseEditApi(this.editId,{
       gid: 74,
       sort: 1,
        content: this.addForm.content,
        status: this.addForm.status,
      })
        .then((res) => {
          this.refuseList(); //刷新违规理由列表
          this.addForm = {
            page: 1,
            limit: 10,
            content: "", //词条名称
            status: "1", //启用停用
          };
          this.spinShow = false;
          this.$Message.success(res.msg);
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
    //删除违规理由列表
    delRefuseList(id) {
      refuseDelListApi(id)
        .then((res) => {
          this.refuseList(); //刷新违规理由列表
          this.spinShow = false;
          this.$Message.success(res.msg);
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
    //添加
    addReasonList() {
      this.addVisible = true;
    },
    //编辑
    editReasonList(row) {
      this.editId = row.id
      this.editVisible = true;
      console.log(row, "编辑");
      this.addForm = JSON.parse(JSON.stringify(row));
      this.addForm.status = JSON.stringify(row.status);
    },
    //删除
    delReasonList(row) {
      this.$Modal.confirm({
        title: "删除",
        content: `<p>是否删除词条"${row.content}"</p>`,
        onOk: () => {
          this.delRefuseList(row.id);
           this.refuseList(); //刷新违规理由列表
        },
        onCancel: () => {
          this.$Message.info("点击了取消");
        },
      });
    },
    //确定添加词条
    add() {
      this.addRefuseList(); //添加违规理由列表
    },
    //编辑词条
    edit() {
      this.editRefuseList();
    },
    cancel() {
      this.addForm = {
        page: 1,
        limit: 10,
        content: "", //词条名称
        status: "1", //启用停用
      };
    },
    // 分页
    pageChange(index) {
      this.addForm.page = index;
      this.refuseList();
    },
    pageSizeChange(index) {
      this.addForm.limit = index;
      this.refuseList();
    },
  },
};
</script>

<style scoped>
>>>.ivu-tree {
    position: relative;
    display: flex!important;
}
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
