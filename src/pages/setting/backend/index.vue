<template>
  <div class="">
    <!-- 搜索 -->
    <div class="search">
      <div style="color:#333;font-size:16px">渠道管理：</div>
      <div style="margin-left:20px">
        官方下载地址：
        <Input
          v-model="adress1"
          placeholder="请输入下载地址"
          style="width: 300px;"
        /><Button type="primary" @click="saveClick" style="margin:20px 0 20px 20px;">保存</Button>
      </div>
      <Button type="primary" @click="addClick" style="margin-left:20px">新增</Button>
    </div>
    <!-- 表格 -->
    <div class="table">
      <!-- 表格 -->
      <Table border :columns="activeColumns" :data="activeData">
        <template slot-scope="{ row, index }" slot="adress">
          <span>{{ adress }}?channel={{ row.add_time }}{{ row.id }}</span>
          <Button type="primary" style="margin-left:20px"  v-copy="copyText" @click="copyClick(row)">复制</Button>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="error" @click="editClick(row)" style="margin-right:20px">编辑</Button>
          <Button type="error" @click="delClick(row.id)">删除</Button>
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
    <Modal v-model="modaladd" width="360">
      <p slot="header" style="color: #333; text-align: center">
        {{ title }}渠道
      </p>
      <div style="display:flex;just-content:left;align-items:center">
        <span style="color: red">*</span> 渠道名称：<Input
          v-model="addName"
          placeholder="请输入需要新增的渠道名称"
          style="width: 260px"
        />
      </div>
      <p slot="footer" style="color: #333; text-align: center">
        <Button type="primary" @click="modaladd = false">取消</Button>
        <Button type="primary" @click="confirmAdd">确定</Button>
      </p>
    </Modal>

  </div>
</template>
<script>
import {
  channelMannageApi,
  adressApi,
  channelAddApi,
  channelDeleteApi,
  channelEditApi,
  savaChanelApi
} from "@/api/setting";

export default {
  data() {
    return {
      adress1:"",
        copyText:"",
        exchangeFrom:{
            page:1,
            limit:10
        },
        total:0,
      editId:"",
      title: "", //弹框标题
      addName: "", //添加渠道名称
      modaladd: false,
      adress: "",
      name: ["app_down_page"],
      activeData: [], //表格
      lookData: [],
      //表格
      activeColumns: [
        {
          width: 60,
          title: "序号",
          type: "index",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 100,
          title: "渠道名称",
          key: "name",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "落地页地址",
          slot: "adress",
          align: "center",
          className: "table-head-style",
        },

        {
          width: 180,
          title: "删除",
          slot: "action",
          align: "center",
          className: "table-head-style",
        },
      ],
    };
  },
  created() {
    this.getChannelLis();
  },

  methods: {
    getChannelLis() {
      channelMannageApi({
          ...this.exchangeFrom,
        status: 1,
        page: 1,
        limit: 20,
        gid: 67,
      }).then((res) => {
        this.getAdressList();
        this.total = res.data.count
        this.activeData = res.data.list;
      });
    },
    getAdressList() {
      adressApi({
        name: this.name,
      }).then((res) => {
       this.adress1 = this.adress = JSON.parse(JSON.stringify(res.data.app_down_page));
      });
    },
    addClick() {
      this.title = "新增";
      this.modaladd = true;
    },
    confirmAdd() {
      if (this.addName === "") {
        return this.$Message.warning("请填写新增的渠道名称！");
      }
      if (this.title === "新增") {
        channelAddApi({
          gid: 67,
          name: this.addName,
          sort: 1,
          status: 1,
        })
          .then((res) => {
            this.$Message.success(res.msg);
            this.getChannelLis();
            this.modaladd = false;
          })
          .catch((err) => {
            this.$Message.warning(err.msg);
          });
      }else if(this.title === "编辑"){
          channelEditApi(this.editId,{
          gid: 67,
          name: this.addName,
          sort: 1,
          status: 1,
        })
          .then((res) => {
            this.$Message.success(res.msg);
            this.getChannelLis();
            this.modaladd = false;
            this.addName = ""
          })
          .catch((err) => {
            this.$Message.warning(err.msg);
          });
      }
    },
    //保存
    saveClick() {
        savaChanelApi({
            app_down_page:this.adress1
        }).then(res=>{
            this.$Message.success(res.msg)
            this.getChannelLis()
        }).catch(err=>{
            this.$Message.warning(err.msg)
        })
        
    },
    editClick(row) {
        this.editId = row.id
      this.title = "编辑";
      this.addName = row.name;
      this.modaladd = true;
    },
    delClick(id) {
      console.log(id);
      this.$Modal.confirm({
        title: "确定要删除这条数据吗？",
        onOk: () => {
          channelDeleteApi(id, {
            gid: 67,
            status: 1,
          })
            .then((res) => {
              this.$Message.success("删除成功！");
              this.getChannelLis();
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
    copyClick(row){
        this.copyText = this.adress+"?channel"+"="+row.add_time+row.id
        if(this.copyText){return this.$Message.success("复制成功！")}
    },
     // 分页
    pageChange(index) {
      this.exchangeFrom.page = index;
      this.getChannelLis(); //列表
    },
    pageSizeChange(index) {
      this.exchangeFrom.limit = index;
      this.getChannelLis(); //列表
    },
  },
};
</script>
<style scoped lang="less">
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
