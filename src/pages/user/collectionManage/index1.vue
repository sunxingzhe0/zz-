<template>
  <div class="collection">
    <div class="search" style="padding: 20px 0">
      <Button type="primary">全部合集</Button>
      <Button type="default">待审核</Button>
      <Button type="default">已发布</Button>
      <Button type="default">未通过</Button>
    </div>
    <div style="display: flex; align-items: center">
      <Button type="primary" style="margin-right: 10px">创建合集</Button>
      <div>设置排序</div>
    </div>
    <div class="transition-container">
      <div
        class="item"
        v-for="(item, index) in items"
        :key="index"
        @mouseenter="enter(item, index)"
        @mouseleave="leave(item, index)"
        draggable="true"
        @dragstart="handleDragStart($event, item)"
        @dragover.prevent="handleDragOver($event, item)"
        @dragenter="handleDragEnter($event, item)"
        @dragend="handleDragEnd($event, item)"
        @click="chooseNav(item)"
      >
        <div class="trans-btn">
          <div class="left">
            <img :src="item.pic" alt="" />
            <p class="workNum">{{ item.workNum }}个作品</p>
          </div>
          <div class="content">
            <p style="font-size: 17px; color: #000">{{ item.totalTitle }}</p>
            <p style="font-size: 14px; color: #000; padding-bottom: 15px">
              {{ item.totalProdoce }}
            </p>
            <div style="font-size: 14px; color: #000">
              <span>播放&nbsp;{{ item.palyNum }}</span
              >&emsp; <span>收藏&nbsp;{{ item.likesNum }}</span
              >&emsp;
              <span v-if="item.status === 0"> 待审核 </span>
              <span v-if="item.status === 1"> 已发布 </span>
              <span v-if="item.status === 2"> 未通过 </span>
              <span>{{ item.time }}</span>
            </div>
          </div>
          <div class="right">
            <Button
              v-if="index === ishow"
              type="error"
              style="margin-right: 10px"
              @click="deleteItem(item, index)"
              >删除合集</Button
            >
          </div>
        </div>
      </div>
    </div>

    
    <!-- 创建合集弹框 -->
    <Modal v-model="modal11" fullscreen footer-hide title="">
      <p
        slot="header"
        style="text-align: left; cursor: pointer"
        @click="modal11 = false"
      >
        <Icon type="md-arrow-round-back" /> 返回
      </p>
      <p style="font-size: 18px; color: #000">合集详情</p>
      <div class="createForm">
        <div class="form">
          <div class="left">
            <div class="top">
              <p style="color: #000; font-size: 15px">
                合集标题<span style="color: red">*</span>
              </p>
              <Input
                v-model="value"
                placeholder="请输入合集的标题"
                style="width: 300px"
              ></Input
              >&nbsp;<span>0/20</span>
            </div>
            <div>
              <p style="color: #000; font-size: 15px">
                合集简介<span style="color: red">*</span>
              </p>
              <Input
                type="textarea"
                :rows="4"
                v-model="value"
                placeholder="请输入合集的标题"
                style="width: 300px"
              ></Input
              >&nbsp;<span>0/80</span>
            </div>
             <div class="save">
                <Button type="primary"  style="margin:15px 15px 0 0">保存资料</Button>
                <Button type="default" style="margin:15px 15px 0 0">取消</Button>
            </div> 
          </div>
        </div>
        <div class="right">
          <p style="color: #000; font-size: 15px; margin-bottom: 5px">
            合集封面<span style="color: red">*</span>
          </p>
          <img
            src="http://121.43.230.79:10002/2021-12-20/341505665a434239a8c766b37c6b1e0a.jpeg"
            alt=""
          />
          <p class="btnChange" @click="replaceClick">替换合集封面</p>
        </div>
      
      </div>
      
      <div>
        <!-- 创建合集------添加作品 -->
        <p style="font-size:16px;color:#000;margin-left:20px"><span>全部作品(2)</span><Button @click="addWorksClick" type="primary" style="margin-left:10px">添加作品</Button></p>
        <div class="allWorks">
          <div
            class="item"
            v-for="(item, index) in itemWork"
            :key="index"
            @mouseenter="enter2(item, index)"
            @mouseleave="leave2(item, index)"
            draggable="true"
            @dragstart="handleDragStart2($event, item)"
            @dragover.prevent="handleDragOver2($event, item)"
            @dragenter="handleDragEnter2($event, item)"
            @dragend="handleDragEnd2($event, item)"
            @click="chooseNav2(item)"
          >
            <div class="trans-btn box">
              <div class="left">
                <img :src="item.pic" alt="" />
                <p class="workNum">{{ item.workNum }}</p>
              </div>
              <div class="content">
                <p style="font-size: 17px; color: #000">
                  {{ item.totalTitle }}
                </p>
                <p style="font-size: 14px; color: #000; padding-bottom: 15px">
                  {{ item.totalProdoce }}
                </p>
                <div style="font-size: 14px; color: #000">
                  <span>播放&nbsp;{{ item.palyNum }}</span
                  >&emsp; <span>收藏&nbsp;{{ item.likesNum }}</span
                  >&emsp;
                  <span v-if="item.status === 0"> 待审核 </span>
                  <span v-if="item.status === 1"> 已发布 </span>
                  <span v-if="item.status === 2"> 未通过 </span>
                  <span>{{ item.time }}</span>
                </div>
              </div>
              <div class="right">
                  <p v-if="index === ishow" style="color:#000;margin-bottom:10px">可拖拽调整排序</p>
                <Button
                  v-if="index === ishow"
                  type="error"
                  style="margin-right: 18px"
                  @click="deleteItem2(item, index)"
                  >从合集中移除</Button
                >
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </Modal>
    <!-- 添加作品弹框 -->
     <!-- 创建合集弹框 -->
    <Modal v-model="modalAdd" width="600">
      <p
        slot="header"
        style="text-align: center;"
      >
      添加作品
      </p>
      <p style="font-size:16px;color:#000">作品列表</p>
      <div class="search">
          <span>查找作品</span>&nbsp;
          <Input style="width:300px" placeholder="输入作品标题查找作品"/>
      </div>
      <div style="margin-bottom:4px">
       <Checkbox v-model="single" >只看可添加作品</Checkbox>   
      </div>
      <div class="contentDtail">
          <div class="detailAddWorkLis" v-for="(item,index) in detailAddWorkLis" :key="index">
              <div class="left">
                  <img style="width:100px;height:100px" src="http://121.43.230.79:10002/2021-12-20/341505665a434239a8c766b37c6b1e0a.jpeg" alt="" srcset="">
                  <p>00:30</p>
              </div>
              <div class="content">
                <p style="font-size:16px;color:#000;margin-bottom:25px">合集简介</p>
                <p>发布于2020年12月21日  10:01</p>
              </div>
              <div class="right">
                  <Button type="primary">+添加</Button>
              </div>
          </div>
          <p style="text-align:center">没有更多作品了~</p>
      </div>
      <p slot="footer" style="text-align:center"><Button type="primary">关闭</Button></p>
    </Modal>
    <!-- <Spin size="large" fix v-if="spinShow"></Spin> -->
    <!-- 替换封面弹框弹框 -->
    <Modal v-model="modalReplace" fullscreen footer-hide title="">
      <p
        slot="header"
        style="text-align: left;"
        
      >
      </p>
      <!-- <Card>
          <div class="cropper-example cropper-first">
            <cropper
              :src="exampleImageSrc"
              crop-button-text="确认提交"
              @on-crop="handleCroped"
            ></cropper>
          </div>
        </Card> -->
    </Modal>
  </div>
</template>

<script>
import {} from "@/api/user";
import {} from "@/api/audit";
import Cropper from '@/components/cropper'
import { formatDate } from "@/common/date.js";
export default {
  name: "transition",
  props: {
    dataSource: Array,
    btn: Boolean,
  },
  //  name: 'cropper_page',
  // components: {
  //   Cropper
  // },
  data() {
    return {
      exampleImageSrc: '',
        modalReplace:true,//替换封面
      single:false,//只看可添加作品
      value: "",
      modal11: true,//创建合集弹框
      modalAdd:true,//添加作品弹框
      ishow: null, //移除按钮
      //   btn:true,
    //   合集
      items: [
        {
          pic: "http://121.43.230.79/uploads/cover/20211221/87d5b13b3705ba176ee4c272c9b54641.jpg", //图片
          workNum: 99, //多少个作品
          totalTitle: "合集标题", //合集标题
          totalProdoce: "合集简介", //合集简介
          palyNum: 2345, //播放量
          likesNum: 2345, //收藏量
          status: 1, //审核状态
          time: "2021年12月21日 11:12",
          key: "2",
          delBtnDis: false,
        },
        {
          pic: "http://121.43.230.79:10002/2021-12-20/341505665a434239a8c766b37c6b1e0a.jpeg", //图片
          workNum: 99, //多少个作品
          totalTitle: "合集标题", //合集标题
          totalProdoce: "合集简介", //合集简介
          palyNum: 2345, //播放量
          likesNum: 2345, //收藏量
          status: 0, //审核状态
          time: "2021年12月21日 11:12",
          key: "2",
          delBtnDis: false,
        },
        {
          pic: "", //图片
          workNum: 99, //多少个作品
          totalTitle: "合集标题", //合集标题
          totalProdoce: "合集简介", //合集简介
          palyNum: 2345, //播放量
          likesNum: 2345, //收藏量
          status: 2, //审核状态
          time: "2021年12月21日 11:12",
          key: "2",
        },
      ],
      //作品
      itemWork:[
        {
          pic: "http://121.43.230.79/uploads/cover/20211221/87d5b13b3705ba176ee4c272c9b54641.jpg", //图片
          workNum: '00:00', //多少个作品
          totalTitle: "第一集", //合集标题
          totalProdoce: "合集简介", //合集简介
          palyNum: 2345, //播放量
          likesNum: 2345, //收藏量
          status: 1, //审核状态
          time: "2021年12月21日 11:12",
          key: "2",
          delBtnDis: false,
        },
        {
          pic: "http://121.43.230.79:10002/2021-12-20/341505665a434239a8c766b37c6b1e0a.jpeg", //图片
          workNum: 99, //多少个作品
          totalTitle: "合集标题", //合集标题
          totalProdoce: "合集简介", //合集简介
          palyNum: 2345, //播放量
          likesNum: 2345, //收藏量
          status: 0, //审核状态
          time: "2021年12月21日 11:12",
          key: "2",
          delBtnDis: false,
        },
        {
          pic: "", //图片
          workNum: 99, //多少个作品
          totalTitle: "合集标题", //合集标题
          totalProdoce: "合集简介", //合集简介
          palyNum: 2345, //播放量
          likesNum: 2345, //收藏量
          status: 2, //审核状态
          time: "2021年12月21日 11:12",
          key: "2",
        },
      ],
      //作品列表详情
      detailAddWorkLis:[
          {id:1},
          {id:1},
          {id:1},
          {id:1},
          {id:1},
          {id:2}
      ],
      dragging2: null,
    };
  },
  created() {},
  watch: {
    dataSource(val) {
      // this.items = val;
    },
    dragging(val) {
      if (this.dataSource.includes(val)) {
        this.dragging = val;
      } else {
        this.dragging = null;
      }
    },
  },
  methods: {
     handleCroped (blob) {
      const formData = new FormData()
      formData.append('croppedImg', blob)
      // uploadImg(formData).then(() => {
      //   this.$Message.success('Upload success~')
      // })
    },
    //   合集拖拽
    handleDragStart(e, item) {
      this.dragging = item;
    },
    handleDragEnd() {
      this.dragging = null;
      this.$emit("hasChanged", this.items);
    },
    // 首先把div变成可以放置的元素，即重写dragenter/dragover
    handleDragOver(e) {
      e.dataTransfer.dropEffect = "move"; // e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
    },
    handleDragEnter(e, item) {
      if (this.dragging) {
        e.dataTransfer.effectAllowed = "move"; // 为需要移动的元素设置dragstart事件
        if (item === this.dragging) {
          return;
        }
        const newItems = [...this.items];
        console.log(newItems);
        const src = newItems.indexOf(this.dragging);
        const dst = newItems.indexOf(item);
        newItems.splice(dst, 0, ...newItems.splice(src, 1));
        this.items = newItems;
      }
    },
    chooseNav(val) {
      this.$emit("selectItem", val);
    },
    deleteItem(item, index) {
      this.$Modal.confirm({
        title: "确定要移除合集吗？",
        // content: '<p></p>',
        onOk: () => {
          this.$Message.info("点击了确定");
        },
        onCancel: () => {
          this.$Message.info("点击了取消");
        },
      });
      this.$emit("deleteItem", item, index);
    },
    editor(item, index) {
      this.$emit("editorItem", item, index);
    },
    // 鼠标移入
    enter(item, index) {
      // console.log(index,item,',index');
      this.ishow = index;
    },
    // // 鼠标移出
    leave(item, index) {
      this.ishow = null;
    },
    // 作品拖拽    
    handleDragStart2(e, item) {
      this.dragging2 = item;
    },
    handleDragEnd2() {
      this.dragging2 = null;
      this.$emit("hasChanged", this.itemWork);
    },
    // 首先把div变成可以放置的元素，即重写dragenter/dragover
    handleDragOver2(e) {
      e.dataTransfer.dropEffect = "move"; // e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
    },
    handleDragEnter2(e, item) {
      if (this.dragging2) {
        e.dataTransfer.effectAllowed = "move"; // 为需要移动的元素设置dragstart事件
        if (item === this.dragging2) {
          return;
        }
        const newItems = [...this.itemWork];
        console.log(newItems);
        const src = newItems.indexOf(this.dragging2);
        const dst = newItems.indexOf(item);
        newItems.splice(dst, 0, ...newItems.splice(src, 1));
        this.itemWork = newItems;
      }
    },
    chooseNav2(val) {
      this.$emit("selectItem", val);
    },
    deleteItem2(item, index) {
      this.$Modal.confirm({
        title: "确定要移除合集吗？",
        // content: '<p></p>',
        onOk: () => {
          this.$Message.info("点击了确定");
        },
        onCancel: () => {
          this.$Message.info("点击了取消");
        },
      });
      this.$emit("deleteItem", item, index);
    },
    editor2(item, index) {
      this.$emit("editorItem", item, index);
    },
    // 鼠标移入
    enter2(item, index) {
      // console.log(index,item,',index');
      this.ishow = index;
    },
    // // 鼠标移出
    leave2(item, index) {
      this.ishow = null;
    },
    // 添加作品
    addWorksClick(){
        this.modalAdd = true
    },
    //替换合集封面
    replaceClick(){
        this.modalReplace = true
    }
  },
};
</script>

<style scoped>
.cropper-example{
  height: 400px;
}
.btnChange:hover{
    cursor: pointer;
}
/* 作品列表详情 */
.detailAddWorkLis{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 5px;
    border-bottom: 1px solid #ebe8e8;
}
.contentDtail{
    height: 440px;
    overflow-y: auto;
    /* background-color: pink; */
}
.contentDtail .left{
    flex: 0 0 22%;
    position: relative;
}
.contentDtail .left p{
    position: absolute;
    bottom: 2px;
    width: 100px;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    text-align: center;
    line-height: 22px;
}
.contentDtail .content{
    flex: 1;
}
.search{
    padding: 5px 0;
}
.transition-container {
  height: 460px;
  overflow-y: auto;
  background-color: #fff;
}
.allWorks{
  height: 300px;
  overflow-y: auto;
  background-color: #fff;
}
.trans-btn {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin-top: 10px; */
}
.trans-btn:hover {
  cursor: pointer;
  /* border: 1px solid #ccc; */
  background-color: #dcdcdc;
}

.trans-btn .left {
  flex: 0 0 10%;
  position: relative;
}
.trans-btn .left .workNum {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100px;
  bottom: 5px;
  line-height: 22px;
  text-align: center;
  color: #fff;
}
.trans-btn .right Button {
  width: 100px;
  height: 30px;
  border-radius: 20px;
}
.trans-btn .right {
  flex: 0 0 10%;
}
.trans-btn .content {
  flex: 1;
}
.trans-btn .left img {
  position: relative;
  width: 100px;
  height: 100px;
}
.trans-btn .content p {
  padding-bottom: 4px;
}
.search Button {
  margin-right: 10px;
}

/* 创建合集 */
.createForm {
  display: flex;
  padding: 10px 20px;
  padding-bottom:0;
  border-bottom: 1px solid #ccc;
  /* justify-content: space-between; */
  /* align-items: center; */
}
.box:hover{
    box-shadow: 5px 2px 6px rgb(165, 162, 162);
}
.createForm .form {
  flex: 0 0 30%;
}
.createForm .form .left .top {
  margin-bottom: 15px;
}
.createForm .form .left div p {
  margin-bottom: 5px;
}
.createForm .right {
  position: relative;
}
.createForm .right img {
  width: 157px;
  height: 162px;
  border: 9px solid #e9e9e9;
}
.createForm .right .btnChange {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  bottom: 41px;
  width: 157px;
  line-height: 28px;
  text-align: center;
}
.createForm .save{
    margin-bottom: 10px;
}
.allWorks .right{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}
.ivu-col-span-5,
.ivu-col-span-10 {
  margin-bottom: 10px;
}

>>> .ivu-table th.table-head-style {
  background: #f2f2f2 !important;
  color: #333;
}
.collection {
  padding: 20px;
  background-color: #fff;
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
