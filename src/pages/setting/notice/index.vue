<template>
  <div class="search">
    <div class="header-search">
      <div class="time">
        <div>
          <span>发布时间：</span>
          <DatePicker
            clearable
            type="datetimerange"
            placeholder="开始日期——结束日期"
            style="width: 320px"
            format="yyyy-MM-dd"
            :value="noticeDate"
            @on-change="noticeDateChange"
          ></DatePicker>
        </div>
        <div class="time2">
          <span>公告ID：</span>
          <Input
            @on-enter="searchClick"
            v-model="noticeID"
            placeholder=""
            clearable
            style="width: 300px"
          />
        </div>
      </div>
      <Button @click="createClick" type="primary" style="margin: 20px 0"
        >创建公告</Button
      >
      <div class="time sort">
        <Button
          @click="sortClick('DESC')"
          :type="sortFlag === 'DESC' ? 'primary' : 'default'"
          style="margin-right: 20px"
          >倒序</Button
        >
        <Button
          @click="sortClick('ASC')"
          :type="sortFlag === 'ASC' ? 'primary' : 'default'"
          >正序</Button
        >
      </div>
    </div>
    <Table ref="selection" border :columns="activeColumns" :data="activeData">
      <template slot-scope="{ row, index }" slot="imgPic">
          <viewer>
            <img style="width: 40px; height: 40px" :src="row.img" />
          </viewer>
        </template>
      <template slot-scope="{ row, index }" slot="add_time">
        {{ row.add_time | formatDate }}
      </template>
      
      <template slot-scope="{ row, index }" slot="end_time">
        {{ row.end_time | formatDate }}
      </template>
      <template slot-scope="{ row, index }" slot="start_time">
        {{ row.start_time | formatDate }}
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button
          @click="editClick(row)"
          type="primary"
          style="margin-right: 10px"
          >编辑</Button
        >
        <Button type="error" @click="delClick(row)">删除</Button>
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
    <!-- 创建公告弹框 -->
    <Modal v-model="creatVisible" @on-cancel="creatVisibleCancel">
      <p slot="header" style="text-align: center">{{ title }}</p>
      <div style="margin-bottom: 40px;display:flex">
        <span><span style="color: red">*</span> 公告内容：</span>
        <!-- <Upload
          ref="upload"
          :action="fileUrl"
          :before-upload="handleBeforeUploadImg"
          :show-upload-list="false"
          :headers="header"
          class="mr20"
          style="margin: 1px 0 0 3px; display: inline"
        > -->
          <div style="display: flex; just-cotent: center; align-items: center">
            <div  class="upload" v-if="!picUrl">
               <ImgCutter
                style="margin-left: 20px"
                :isModal="true"
                ref="imgCutterModal"
                @cutDown="cutDown"
                :crossOrigin="true"
                crossOriginHeader
                :sizeChange="true"
                :originalGraph="true"
                :toolBoxOverflow="false"
                >
                <!-- rate="1:1" -->
                 <span style="font-size:120px;margin-right:20px;color: #9f9f9f" slot="open">+</span>
                </ImgCutter>
            </div>
            <img class="upload" v-if="picUrl" :src="picUrl" />
            <ImgCutter
                v-if="picUrl"
                style="margin-left: 20px"
                :isModal="true"
                ref="imgCutterModal"
                @cutDown="cutDown"
                :crossOrigin="true"
                crossOriginHeader
                :sizeChange="true"
                :originalGraph="true"
                :toolBoxOverflow="false"
                >
                 <!-- rate="1:1" -->
                 <Button type="primary" slot="open">更换图片</Button>
                </ImgCutter>
          </div>
        <!-- </Upload> -->
      </div>
      <div>
        <span style="color: red">*</span> 公告时间：
        <DatePicker
          type="datetimerange"
          placeholder="开始日期——结束日期"
          style="width: 320px"
          format="yyyy-MM-dd"
          :value="createNoticeDate"
          @on-change="creatDateChange"
        ></DatePicker>
      </div>
      <p slot="footer">
        <Button @click="cancelClick" type="default">取消</Button>
        <Button @click="sureClick" type="primary">发布</Button>
      </p>
    </Modal>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
import ImgCutter from "vue-img-cutter";
import {
  billboardLIsApi,
  billboardAddApi,
  billboardDelApi,
} from "@/api/notice";
import { getCookies } from "@/libs/util";
import axios from "axios";
import Setting from "@/setting";
import { formatDate } from "@/common/date.js";
export default {
  components: {
    ImgCutter,
  },
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
        spinShow:false,
        noticeIDS:"",
      title: "创建公告",
      fileImg: [],
      filesImg: [],
      picUrl: "",
      createNoticeDate: [], //创建公告时间
      total: 0,
      exchangeFrom: {
        page: 1,
        limit: 10,
      },
      sortFlag: "DESC", //排序
      noticeID: "", //公告ID
      noticeDate: [], //公告时间
      creatVisible: false,
      header: {},
      fileUrl: Setting.apiBaseURL + "/file/upload/multipleSliceFile",
      activeColumns: [
        // {
        //   type: "selection",
        //   width: 60,
        //   align: "center",
        //   className: "table-head-style",
        // },
        {
          width: 80,
          title: "公告ID",
          key: "id",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth: 120,
          title: "公告开始时间",
          key: "start_time",
          slot: "start_time",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth: 120,
          title: "公告结束时间",
          key: "end_time",
          slot: "end_time",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth: 100,
          title: "公告内容",
          slot: "imgPic",
          key:"img",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth: 100,
          title: "发布时间",
          key: "add_time",
          slot: "add_time",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth: 100,
          title: "操作",
          slot: "action",
          align: "center",
          className: "table-head-style",
        },
      ],
      activeData: [{}],
    };
  },
  created() {
    this.getBillboardList();
  },
  watch: {},
  mounted() {
    this.getToken();
  },
  methods: {
    //获取公告列表
    getBillboardList() {
        this.spinShow = true
      let start = this.noticeDate[0]
        ? Date.parse(this.noticeDate[0] + " 00:00:00") / 1000
        : "";
      let end = this.noticeDate[1]
        ? Date.parse(this.noticeDate[1] + " 23:59:59") / 1000
        : "";
      billboardLIsApi({
        ...this.exchangeFrom,
        "o:id": this.sortFlag,
        "e:id": this.noticeID,
        "x:add_time": start, //开始时间
        "d:add_time": end, //结束时间
      }).then((res) => {
        this.total = res.data.count;
        this.activeData = res.data.list;
        this.spinShow = false
      });
    },
    //发布时间change事件
    noticeDateChange(e) {
      this.noticeDate = e;
      //   console.log(this.noticeDate[0]+"\xa0"+"00:00:00",'this.noticeDate[0]+"00:00:00"');
      this.getBillboardList();
      //   console.log( this.noticeDate,'noticeDate');
    },
    //公告id回车事件
    searchClick() {
      this.getBillboardList();
    },
    getToken() {
      this.header["Authori-zation"] = "Bearer " + getCookies("token");
    },
    // 排序
    sortClick(text) {
      this.sortFlag = text;
      this.getBillboardList();
    },
    handleBeforeUploadImg(file) {
      this.fileImg.push(file);
      // console.log(that.file.length, "查找");
      let formData = new FormData();
      for (var i = 0; i < this.fileImg.length; i++) {
        // that.file[i].name = that.file[i].name.replace('.mp4','.m3u8')
        formData.append("file[]", this.fileImg[i]); // 文件对象
      }

      console.log(formData.getAll("file[]"), "lengh");
      this.filesImg = formData;
      // console.log(this.files.getAll("file[]"), "formData0909");

      axios({
        url: Setting.apiBaseURL + `/file/upload/multipleSliceFile`,
        method: "post",
        headers: {
          "Authori-zation": "Bearer " + getCookies("token"),
          "Content-Type": "multipart/form-data",
        },
        //参数
        data: this.filesImg,
      }).then((res) => {
        if (res.data.status === 400) {
          this.$Message.warning(res.data.data.message);
        } else {
          this.picUrl = res.data.data.url;
          if (this.picUrl) {
            this.openView();
          }
        }
      });
      return false;
    },
    creatDateChange(e) {
      this.createNoticeDate = e;
    },
    //创建公告
    createClick() {
      this.title = "创建公告";
      this.creatVisible = true;
    },
    //取消
    cancelClick(){
        this.picUrl = ""
        this.createNoticeDate =[]
        this.creatVisible = false
    },
    //发布公告
    sureClick() {
      if (!this.picUrl) {
        return this.$Message.warning("请上传图片内容！");
      }
      if (this.createNoticeDate.length === 0) {
        return this.$Message.warning("请选择公告时间！");
      }
      let statTime = this.createNoticeDate[0]
        ? Date.parse(this.createNoticeDate[0] + " 00:00:00") / 1000
        : "";
      let endTime = this.createNoticeDate[1]
        ? Date.parse(this.createNoticeDate[1] + " 23:59:59") / 1000
        : "";
      if (this.title === "创建公告") {
        billboardAddApi({
          "u:img": this.picUrl,
          "u:start_time": statTime,
          "u:end_time": endTime,
        })
          .then((res) => {
            this.$Message.success(res.msg);
            this.getBillboardList();
            this.creatVisible = false;
            this.picUrl = "";
            this.createNoticeDate = [];
          })
          .catch((err) => {
            this.$Message.warning(err.msg);
          });
      } else if (this.title === "编辑公告") {
        billboardAddApi({
          "e:id": this.noticeIDS,
          "u:img": this.picUrl,
          "u:start_time": statTime,
          "u:end_time": endTime,
        })
          .then((res) => {
            this.$Message.success(res.msg);
            this.getBillboardList();
            this.creatVisible = false;
            this.picUrl = "";
            this.createNoticeDate = [];
          })
          .catch((err) => {
            this.$Message.warning(err.msg);
          });
      }
    },
    editClick(row) {
      let start = formatDate(new Date(Number(row.start_time) * 1000), 'yyyy-MM-dd');
      let end = formatDate(new Date(Number(row.end_time) * 1000), 'yyyy-MM-dd');
      let date = start +","+ end
      date = date.split(",")
      this.createNoticeDate = date
      this.title = "编辑公告";
      this.picUrl = row.img;
      this.noticeIDS = row.id
      this.creatVisible = true;
    },
    delClick(row) {
      this.$Modal.confirm({
        title: "确定要删除吗？",
        onOk: () => {
          billboardDelApi({
            id: row.id,
          })
            .then((res) => {
              this.$Message.success(res.msg);
              this.getBillboardList();
            })
            .catch((err) => {
              this.$Message.warning(err.msg);
            });
        },
        onCancel: () => {
          this.$Message.info("Clicked cancel");
        },
      });
    },
    // 分页
    pageChange(index) {
      this.exchangeFrom.page = index;
      this.getBillboardList(); //列表
    },
    pageSizeChange(index) {
      this.exchangeFrom.limit = index;
      this.getBillboardList(); //列表
    },
    cutDown(e) {
      let file = [];
      file.push(e.file);
      const formData = new FormData();
      for (var i = 0; i < file.length; i++) {
        // that.file[i].name = that.file[i].name.replace('.mp4','.m3u8')
        formData.append("file[]", file[file.length - 1]); // 文件对象
      }

      console.log(formData.getAll("file[]"), "之后");

      // this.files = formData;
      // formData.append('file[]', blob)
      // console.log(formData.getAll("file[]"),'000');
      // uploadImg(formData).then(() => {
      //   this.$Message.success('Upload success~')
      // })
      let files = formData;
      axios({
        url: Setting.apiBaseURL + `/file/upload/multipleSliceFile`,
        method: "post",
        headers: {
          "Authori-zation": "Bearer " + getCookies("token"),
          "Content-Type": "multipart/form-data",
        },
        //参数
        data: files,
      }).then((res) => {
        if (res.data.status === 400) {
          this.$Message.warning(res.data.data.message);
        } else {
          this.picUrl = res.data.data.url;
        }
      });
    },
    // 传入name，src name中必须包含后缀名
    openView() {
      // 传入name，src name中必须包含后缀名
      // https://img0.baidu.com/it/u=1745397029,2362331324&fm=15&fmt=auto
      // uploadMethod(file).then((res)=>{
         console.log(1111,'file');
        this.$refs.imgCutterModal.handleOpen({
        name: "image.jpg",
        
        src: this.picUrl ? this.picUrl : "",
      });
      // console.log(res,'res');
	   
	// });
      
    },
    // 创建公告弹框取消
    creatVisibleCancel(){
        this.picUrl = "",
        this.createNoticeDate = []
        this.creatVisible = false
    },
    handleCroped(blob) {
      console.log(blob, "lllkkk");
      let aee = new File([blob], "111.jpg", { type: blob.type });
      console.log(aee, "aee");
      let file = [];
      file.push(aee);

      const formData = new FormData();
      for (var i = 0; i < file.length; i++) {
        // that.file[i].name = that.file[i].name.replace('.mp4','.m3u8')
        formData.append("file[]", file[file.length - 1]); // 文件对象
      }

      console.log(formData.getAll("file[]"), "之后");

      // this.files = formData;
      // formData.append('file[]', blob)
      // console.log(formData.getAll("file[]"),'000');
      // uploadImg(formData).then(() => {
      //   this.$Message.success('Upload success~')
      // })
      let files = formData;
      axios({
        url: Setting.apiBaseURL + `/file/upload/multipleSliceFile`,
        method: "post",
        headers: {
          "Authori-zation": "Bearer " + getCookies("token"),
          "Content-Type": "multipart/form-data",
        },
        //参数
        data: files,
      }).then((res) => {
        if (res.data.status === 400) {
          this.$Message.warning(res.data.data.message);
        } else {
          this.createCollecForm.pic = res.data.data.url;
        }
      });
    },
  },
};
</script>

<style scoped>
.upload {
  width: 200px;
  height: 200px;
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
}
.sort {
  margin-bottom: 20px;
}
.time {
  display: flex;
}
.time2 {
  margin-left: 40px;
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
.page {
  text-align: right;
  padding-bottom: 20px;
  margin-right: 20px;
}
>>> .ivu-table th.table-head-style {
  background: #f2f2f2 !important;
  color: #333;
}
</style>
