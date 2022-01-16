<template>
  <div class="refuse-page">
    <!-- 添加拒绝理由 -->
    <Button type="primary" class="addBtn" @click="addPayList">添加</Button>
    <!-- 表格 -->
    <!-- <Scroll :on-reach-bottom="handleReachBottom"> -->
      <div class="add">
        <vxe-table
          class="mt25"
          highlight-hover-row
          header-row-class-name="false"
          :tree-config="{ children: 'children' }"
          :data="tableData"
        >
          <vxe-table-column
            field="id"
            tree-node
            title="id"
            min-width="250"
          ></vxe-table-column>
          <vxe-table-column
            field="name"
            tree-node
            title="分类名称"
            min-width="250"
          ></vxe-table-column>

          <vxe-table-column field="is_show" title="状态" min-width="120" align="center">
            <template v-slot="{ row }">
            
                <span v-if="row.is_show===1" >显示</span>
                <span v-if="row.is_show===0">隐藏</span>
          
            </template>
          </vxe-table-column>
           <vxe-table-column field="sort" title="排序" min-width="120" align="center"></vxe-table-column>
          <vxe-table-column
            field="date"
            title="操作"
            width="250"
            fixed="right"
            align="center"
          >
            <template v-slot="{ row, index }">
              <a @click="edit(row)">编辑</a>
              <Divider type="vertical" />
              <a @click="del(row, '删除视频分类', index)">删除</a>
            </template>
          </vxe-table-column>
        </vxe-table>

        <Spin size="large" fix v-if="spinShow"></Spin>
        <!-- 分页
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
        </div> -->
      </div>
    <!-- </Scroll> -->
    <!-- 添加 -->
    <Modal
      v-model="addVisible"
      title="添加视频类型"
      @on-ok="addClick"
      @on-cancel="addVisible = false"
    >
      <span>父级类型：</span><Select filterable v-model="modelFatherId" style="width: 200px">
        <Option
          v-for="item in fatherList"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}</Option
        >
      </Select>
      <p style="margin-bottom: 10px;margin-top:10px" >
        <span style="color: red">*</span>视频类型：
         <Input
        v-model="addForm.u_name"
        placeholder="请输入视频类型名称"
        style="width: 300px"
      ></Input>
      </p>
      <p style="margin-bottom: 10px;margin-top:10px" >
        <span>排序：</span><InputNumber v-model="sortValue" controls-outside></InputNumber>
      </p>
     
      <div style="margin-top: 20px">
        <Radio-group v-model="addForm.u_is_show">
          <Radio label="1">启用</Radio>
          <Radio label="2">停用</Radio>
        </Radio-group>
      </div>
    </Modal>
    <!-- 编辑 -->
    <Modal
      v-model="editVisible"
      title="编辑视频类型"
      @on-ok="editClick"
      @on-cancel="editVisible = false"
    >
      <p style="margin-bottom: 10px">
         父级类型： <Select disabled   v-model="modelFatherId" style="width: 200px">
        <Option
          v-for="item in fatherList"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}</Option
        >
      </Select>
        
      </p>
      <div>
         <span style="color: red">*</span>视频类型
      <Input
        v-model="addForm.u_name"
        placeholder="请输入视频类型"
        style="width: 300px"
      ></Input>
      </div>
      <p style="margin-bottom: 10px;margin-top:10px" >
        <span>排序：</span><InputNumber v-model="addForm.sort" controls-outside></InputNumber>
      </p>
      <div style="margin-top: 20px">
        <Radio-group v-model="addForm.u_is_show">
          <Radio label="1">启用</Radio>
          <Radio label="0">停用</Radio>
        </Radio-group>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  videoTypeListApi,
  videoTypeAddApi,
  videoTypeDeleteApi,
} from "@/api/setting";
export default {
  name: "table-expand",
  props: {
    row: Object,
  },
  data() {
    return {
      sortValue:1,
      fatherList: [
        {
          value: 0,
          label: "New York",
        },
      ],
      modelFatherId:0,
      total: 0,
      spinShow: true, //加载
      payId: "", //支付方式ID
      addForm: {
        u_name: "", //视频类型名称
        u_is_show: "1", //状态
        sort:0,
      },
      addVisible: false, //添加
      editVisible: false, //编辑
      //分页
      total: 0,
      pageData: {
        page: 1,
        limit: 10,
      },
      //表格
    
      tableData: [],
    };
  },
  created() {
    this.getPatTypeLis(); // 列表
  },
  mounted() {},
  methods: {
    onchangeIsShow() {},
    //支付类型列表
    getPatTypeLis() {
      videoTypeListApi({
        ...this.pageData,

      }).then((res) => {
        this.tableData = res.data;
        this.fatherList = res.data.map((item,index)=>{
          return{
            value:item.id,
            label:item.name,
            pid:item.pid
          }
        })
        this.fatherList.unshift({
          value:0,
            label:'顶级菜单'
        })
        this.total = res.data.count;
        this.spinShow = false;
      });
    },
    //添加
    addPayList() {
      this.addVisible = true;
    },
    //编辑
    edit(row) {
      this.payId = row.id;
      this.addForm.u_name = JSON.parse(JSON.stringify(row.name));
      this.addForm.u_is_show = JSON.stringify(row.is_show);
      this.addForm.sort = Number(JSON.stringify(row.sort));
      this.modelFatherId=  this.modelFatherId===row.id?0:row.pid
      this.editVisible = true;
    },
    addClick() {
      if (this.addForm.u_name === "") {
        return this.$Message.warning("支付类型不能为空！");
      }
      videoTypeAddApi({
        ...this.addForm,
        u_pid:this.modelFatherId,
        u_sort:this.sortValue
      })
        .then((res) => {
          this.$Message.success(res.msg);
          this.getPatTypeLis();
          this.addForm.u_name = "";
        })
        .catch((err) => {
          this.$Message.warning(err.msg);
        });
    },
    editClick() {
      if (this.addForm.u_name === "") {
        return this.$Message.warning("支付类型不能为空！");
      }
      videoTypeAddApi({
        ...this.addForm,
        e_id: this.payId,
        u_pid:this.modelFatherId,
        u_sort:this.addForm.sort
      })
        .then((res) => {
          this.$Message.success(res.msg);
          this.getPatTypeLis();
          this.addForm.u_name = "";
        })
        .catch((err) => {
          this.$Message.warning(err.msg);
        });
    },
    //删除
    del(row) {
      this.$Modal.confirm({
        title: `确定要删除视频类型为（${row.name}）这条数据吗？`,
        onOk: () => {
          videoTypeDeleteApi({
            e_id: row.id,
          })
            .then((res) => {
              this.$Message.success("已删除！");
              this.getPatTypeLis();
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
      this.getPatTypeLis();
    },
    pageSizeChange(index) {
      this.pageData.limit = index;
      this.getPatTypeLis();
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
