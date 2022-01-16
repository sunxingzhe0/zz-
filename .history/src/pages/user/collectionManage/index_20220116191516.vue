<template>
  <div class="collection">
    <div class="search" style="padding: 20px 0">
      <span>审核状态：</span>
      <Button
        @click="statusBtnClick(3)"
        :type="falgStatus === 3 ? 'primary' : 'default'"
        >全部合集</Button
      >
      <Button
        @click="statusBtnClick(0)"
        :type="falgStatus === 0 ? 'primary' : 'default'"
        >待审核</Button
      >
      <Button
        @click="statusBtnClick(1)"
        :type="falgStatus === 1 ? 'primary' : 'default'"
        >已通过</Button
      >
      <Button
        @click="statusBtnClick(2)"
        :type="falgStatus === 2 ? 'primary' : 'default'"
        >未通过</Button
      >
       <span style="margin-left:56px">合集类型：</span>
      <Button
        @click="typeBtnClick(3)"
        :type="typeStatus === 3 ? 'primary' : 'default'"
        >全部</Button
      >
      <Button
        @click="typeBtnClick(1)"
        :type="typeStatus === 1 ? 'primary' : 'default'"
        >新建</Button
      >
      <Button
        @click="typeBtnClick(0)"
        :type="typeStatus === 0 ? 'primary' : 'default'"
        >修改</Button
      >
    </div>
   
    <div style="display: flex; align-items: center;margin-bottom:10px">
      <Button @click="createClick" type="primary" style="margin-right: 10px"
        >创建合集</Button
      >
      <Button type="success" @click="sortClick">{{sortText}}</Button>
      <Button style="margin-left:10px" type="error" @click="someDelClick">批量删除</Button>
    </div>
    <!-- 合集列表渲染 -->
    <div class="transition-container">
      <div
        class="item"
        v-for="(item, index) in items"
        :key="index"
        @mouseenter="enter(item, index)"
        @mouseleave="leave(item, index)"
        :draggable="draggable"
        @dragstart="handleDragStart($event, item)"
        @dragover.prevent="handleDragOver($event, item)"
        @dragenter="handleDragEnter($event, item)"
        @dragend="handleDragEnd($event, item)"
        @click="chooseNav(item)"
      >
        <div class="trans-btn">
          <Checkbox
              v-model="item.hasSelected"
              @on-change="chooseSingle(item)"
          ></Checkbox>
          <div class="left">
            <img :src="item.total_cover_new" alt="" />
            <p class="workNum">{{ item.vedio_count }}个作品</p>
          </div>
          <div class="content" @click="detailClick(item)">
            <p style="font-size: 17px; color: #000">
              {{ item.title_new }}
              <span style="margin-left: 10px;color: rgb(159 159 159);font-size: 14px;"
                >合集ID：{{ item.id }}</span
              >
            </p>
            <div
              style="
                width: 600px;
                font-size: 14px;
                color: #000;
                padding-bottom: 15px;
              "
            >
              {{ item.desc_new }}
            </div>
            <div style="font-size: 14px; color: #000">
              <span>播放&nbsp;{{ item.play_count }}</span
              >&emsp; <span>收藏&nbsp;{{ item.collect_count }}</span
              >&emsp;
              <span v-if="item.status === 0" style="color: #008ef0">
               审核中
              </span>
              <span v-if="item.status === 1" style="color: #34a30a">
                审核通过
              </span>
              <span v-if="item.status === 2" style="color: #f01a02">
                审核不通过
              </span>
              <span>{{ item.add_time | formatDate }}</span>
            </div>
          </div>
          <div class="right">
            <!-- 修改合集 -->
            <p  v-if="index === ishow" style="margin:0 0 7px 100px">可拖拽调整排序<Icon style="color:#000;font-size:18px;transform:rotate(90deg)" type="md-swap" /></p>
            <Button
              v-if="index === ishow&&item.status!==0"
              type="primary"
              style="margin-right: 10px"
              @click="editItem(item, index)"
              >修改合集</Button
            >
            <!-- 删除合集 -->
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

    <!-- 创建弹框  -->
    <Modal
      v-model="modalCreate"
      @on-cancel="createCancelClick"
      footer-hide
      :mask-closable="false"
      width="600"
    >
      <p slot="header" style="text-align: center; cursor: pointer">
        {{ modelTitle }}
      </p>
      <div class="createForm">
        <div class="form">
          <div class="left">
            <div class="top">
              <p style="color: #000; font-size: 15px">
                合集标题<span style="color: red">*</span>
              </p>
              <Input
              show-word-limit
                :maxlength="20"
                v-model="createCollecForm.title"
                placeholder="请输入合集的标题"
                style="width: 300px"
              ></Input
              >&nbsp;
            </div>
            <div>
              <p style="color: #000; font-size: 15px">
                合集简介<span style="color: red">*</span>
              </p>
              <Input
              show-word-limit
                :maxlength="80"
                type="textarea"
                :rows="4"
                v-model="createCollecForm.desc"
                placeholder="请输入合集简介"
                style="width: 300px"
              ></Input
              >&nbsp;
            </div>
            <div class="save">
              <Button
                @click="saveCreateClick"
                type="primary"
                style="margin: 15px 15px 0 0"
                >保存资料</Button
              >
              <Button
                @click="createCancelClick"
                type="default"
                style="margin: 15px 15px 0 0"
                >取消</Button
              >
            </div>
          </div>
        </div>
        <div class="right" style="margin-right: 20px">
          <p style="color: #000; font-size: 15px; margin-bottom: 5px">
            合集封面<span style="color: red">*</span>
          </p>
          
          <p v-if="createCollecForm.pic" class="btnChange" @click="openView">替换合集封面</p>
          <ImgCutter
             :sizeChange="true"
             :originalGraph="true"
              rate="1:1"
            :isModal="true"
            ref="imgCutterModal"
            @cutDown="cutDown"
            :crossOrigin="true"
            crossOriginHeader
          >
          <img v-if="createCollecForm.pic" slot="open" :src="createCollecForm.pic" alt="" />
          <Icon style="font-size:140px" v-else slot="open" type="ios-images-outline" />
          </ImgCutter>
        </div>
      </div>
    </Modal>
    <!-- 创建合集弹框(详情) -->
    <Modal v-model="modal11" fullscreen footer-hide title="">
      <p
        slot="header"
        style="text-align: left; cursor: pointer"
        @click="modal11 = false"
      >
        <Icon type="md-arrow-round-back" /> 返回
      </p>
      <p style="font-size: 16px; color: #000">合集详情</p>
      <div style="height:600px">
        <!-- 创建合集------添加作品 -->
        <p style="font-size: 16px; color: #000; margin:0 0 10px 20px">
          <span>全部作品({{workDetailTotal}})</span
          ><Button
            @click="addWorksClick"
            type="primary"
            style="margin-left: 10px"
            >添加作品</Button
          >
          <Button @click="setSortDetailClick" style="margin-left: 10px" type="success">{{sortText2}}</Button>
        </p>
        <div class="allWorks detailallWorks">
          <div
            class="item"
            v-for="(item, index) in itemWork"
            :key="index"
            @mouseenter="enter2(item, index)"
            @mouseleave="leave2(item, index)"
            :draggable="draggable2"
            @dragstart="handleDragStart2($event, item)"
            @dragover.prevent="handleDragOver2($event, item)"
            @dragenter="handleDragEnter2($event, item)"
            @dragend="handleDragEnd2($event, item)"
            @click="chooseNav2(item)"
          >
            <div class="trans-btn box">
              <div class="left">
                <img :src="item.vedio_cover" alt="" />
                <p class="workNum">{{ item.vedio_time }}</p>
              </div>
              <div class="content">
                <p style="font-size: 17px; color: #000">
                  第{{ index+1 }}集
                </p>
                <p style="font-size: 14px; color: #000; padding-bottom: 15px">
                  {{ item.vedio_title }}
                </p>
                <div style="font-size: 14px; color: #000">
                  <span>播放&nbsp;{{ item.play_count }}</span
                  >&emsp; <span>收藏&nbsp;{{ item.like_count }}</span
                  >&emsp;
                  <span v-if="item.status === 0" style="color: #008ef0">
                    待审核
                  </span>
                  <span v-if="item.status === 1" style="color: #34a30a">
                    已通过
                  </span>
                  <span v-if="item.status === 2" style="color: #f01a02">
                    未通过
                  </span>
                  <span>{{ item.time }}</span>
                </div>
              </div>
              <div class="right">
                <p
                  v-if="index === ishow"
                  style="color: #000; margin-bottom: 10px"
                >
                  可拖拽调整排序
                  <Icon style="color:#000;font-size:18px;transform:rotate(90deg)" type="md-swap" />
                </p>
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
      <p slot="header" style="text-align: center">添加作品</p>
      <p style="font-size: 15px; color: #000;margin-bottom: 10px;">作品列表({{titoalWork}})</p>
      <div class="search searchWork">
        <span>查找作品</span>&nbsp;
        <Input @on-enter="searchEndWork" clearable  v-model="searchWorkModel" style="width: 300px" placeholder="输入作品标题查找作品" />
      </div>
      <div style="margin-bottom: 10px;font-size:15px">
        <Checkbox @on-change="changeWorkClick" v-model="single">只看可添加作品</Checkbox>
      </div>
      <div class="contentDtail">
        <div
          class="detailAddWorkLis"
          v-for="(item, index) in detailAddWorkLis"
          :key="index"
        >
          <div class="left">
            <img
              style="width: 100px; height: 100px"
              :src="item.vedio_cover"
              alt=""
              srcset=""
            />
            <p>{{item.vedio_time}}</p>
          </div>
          <div class="content">
            <div style="font-size: 16px; color: #000; margin-bottom: 25px;width:259px;word-break: break-word;">
              {{item.vedio_title}}
            </div>
            <p>发布于{{item.add_time | formatDate }}</p>
          </div>
          <div class="right addCollect">
            <Button @click="adddetailWorks(item)" type="primary" v-if="item.total_id===''">+添加</Button>
            <span v-if="item.total_id!=='' && item.total_id!== totalId">在其他合集</span>
            <Button @click="deldetailWorks(item)" type="error" v-if="item.total_id===totalId">移除</Button>
          </div>
        </div>
        <p style="text-align: center">没有更多作品了~</p>
      </div>
      <p slot="footer" style="text-align: center">
        <Button @click="modalAdd=false" type="primary">关闭</Button>
      </p>
    </Modal>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <!-- 替换封面弹框弹框 -->
    <!-- <Modal v-model="modalReplace">
      <p
        slot="header"
        style="text-align: left;"
        
      >
      </p>
      <Card>
          <div class="cropper-example cropper-first">
            <cropper
              :src="exampleImageSrc"
              crop-button-text="确认提交"
              @on-crop="handleCroped"
            ></cropper>
          </div>
        </Card>
    </Modal> -->
  </div>
</template>

<script>
import ImgCutter from "vue-img-cutter";
import {
  collectionTotalApi,
  creatCollecApi,
  delCollecApi,
  sortCollecApi,
  collectionVideoApi,
  detailSortApi,
  detailVideoDeltApi,
  addWorksApi,
  delWorksApi
} from "@/api/collection";
import { getCookies } from "@/libs/util";
import axios from "axios";
import Setting from "@/setting";
import Cropper from "@/components/cropper";
import { formatDate } from "@/common/date.js";
export default {
  name: "transition",
  props: {
    dataSource: Array,
    btn: Boolean,
  },
  name: "cropper_page",
  components: {
    Cropper,
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
      delArrID:[],//批量删除
      draggable:false,
      draggable2:false,
      workDetailTotal:0,//合集详情--全部作品
      searchWorkModel:"",//查找作品
      titoalWork:0,//作品列表数量
      sortText:"设置排序",//拖动排序设置
      sortText2:"设置排序",
      totalId:'',//获取合集视频列表
      typeStatus:3,//合集类型
      falgStatus: 3, //审核状态
      modelTitle: "创建合集", //自定义标题
      modalCreate: false, //创建弹框
      uid: "", //用户ID
      spinShow: false,
      exampleImageSrc: "",
      modalReplace: false, //替换封面
      single: false, //只看可添加作品
      // 创建合集表单
      createCollecForm: {
        title: "", //标题
        desc: "", //简介
        pic: "", //合集封面
      },
      modal11: false, //创建合集详情弹框
      modalAdd: false, //添加作品弹框
      ishow: null, //移除按钮
      //   btn:true,
      //   合集
      items: [
        // {
        //   pic: "http://121.43.230.79/uploads/cover/20211221/87d5b13b3705ba176ee4c272c9b54641.jpg", //图片
        //   workNum: 99, //多少个作品
        //   totalTitle: "合集标题", //合集标题
        //   totalProdoce: "合集简介", //合集简介
        //   palyNum: 2345, //播放量
        //   likesNum: 2345, //收藏量
        //   status: 1, //审核状态
        //   time: "2021年12月21日 11:12",
        //   key: "2",
        //   delBtnDis: false,
        // },
        // {
        //   pic: "http://121.43.230.79:10002/2021-12-20/341505665a434239a8c766b37c6b1e0a.jpeg", //图片
        //   workNum: 99, //多少个作品
        //   totalTitle: "合集标题", //合集标题
        //   totalProdoce: "合集简介", //合集简介
        //   palyNum: 2345, //播放量
        //   likesNum: 2345, //收藏量
        //   status: 0, //审核状态
        //   time: "2021年12月21日 11:12",
        //   key: "2",
        //   delBtnDis: false,
        // },
        // {
        //   pic: "", //图片
        //   workNum: 99, //多少个作品
        //   totalTitle: "合集标题", //合集标题
        //   totalProdoce: "合集简介", //合集简介
        //   palyNum: 2345, //播放量
        //   likesNum: 2345, //收藏量
        //   status: 2, //审核状态
        //   time: "2021年12月21日 11:12",
        //   key: "2",
        // },
      ],
      //作品
      itemWork: [
        // {
        //   pic: "http://121.43.230.79/uploads/cover/20211221/87d5b13b3705ba176ee4c272c9b54641.jpg", //图片
        //   workNum: "00:00", //多少个作品
        //   totalTitle: "第一集", //合集标题
        //   totalProdoce: "合集简介", //合集简介
        //   palyNum: 2345, //播放量
        //   likesNum: 2345, //收藏量
        //   status: 1, //审核状态
        //   time: "2021年12月21日 11:12",
        //   key: "2",
        //   delBtnDis: false,
        // },
        // {
        //   pic: "http://121.43.230.79:10002/2021-12-20/341505665a434239a8c766b37c6b1e0a.jpeg", //图片
        //   workNum: 99, //多少个作品
        //   totalTitle: "合集标题", //合集标题
        //   totalProdoce: "合集简介", //合集简介
        //   palyNum: 2345, //播放量
        //   likesNum: 2345, //收藏量
        //   status: 0, //审核状态
        //   time: "2021年12月21日 11:12",
        //   key: "2",
        //   delBtnDis: false,
        // },
        // {
        //   pic: "", //图片
        //   workNum: 99, //多少个作品
        //   totalTitle: "合集标题", //合集标题
        //   totalProdoce: "合集简介", //合集简介
        //   palyNum: 2345, //播放量
        //   likesNum: 2345, //收藏量
        //   status: 2, //审核状态
        //   time: "2021年12月21日 11:12",
        //   key: "2",
        // },
      ],
      //作品列表详情
      detailAddWorkLis: [
        { id: 1 },
        { id: 1 },
        { id: 1 },
        { id: 1 },
        { id: 1 },
        { id: 2 },
      ],
      dragging2: null,
    };
  },
  created() {
    let uid1 = this.$route.query.row;
    this.uid = this.$route.query.row;
    if (uid1 !== "") {
      this.getCollectionTotalLis(uid1);
    }
  },
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
  mounted() {
    this.getToken();
  },
  methods: {
    getHMS(time) {
      const hour = parseInt(time / 3600) < 10 ? '0' + parseInt(time / 3600) : parseInt(time / 3600)
      const min = parseInt(time % 3600 / 60) < 10 ? '0' + parseInt(time % 3600 / 60) : parseInt(time % 3600 / 60)
      const sec = parseInt(time % 3600 % 60) < 10 ? '0' + parseInt(time % 3600 % 60) : parseInt(time % 3600 % 60)
      return  min + ':' + sec
    },

    getToken() {
      this.header["Authori-zation"] = "Bearer " + getCookies("token");
    },
    //获取合集----列表total
    getCollectionTotalLis(uid1) {
      let status = this.falgStatus === 3 ? "" : this.falgStatus;
      let type = this.typeStatus === 3?"":this.typeStatus
      this.spinShow = true;
      collectionTotalApi({
        "e:t:status": status,
        "is_new":type,
        "e:t:uid": uid1,
      }).then((res) => {
        this.items = res.data.list
        this.items.forEach((i)=>{
            i.hasSelected = false
            i.total_cover_new = Setting.url(i.total_cover_new)
        })
        this.spinShow = false;
      });
    },
    //获取合集视频列表
    getCollectVideoLis(totalId){
          collectionVideoApi({
            page:1,
            limit:1000,
            "e:l:total_id":totalId,
            "e:v:is_del":0,
            "e:v:uid":this.uid
          }).then(res=>{
            this.workDetailTotal = res.data.count
            this.itemWork = res.data.list
            this.itemWork.forEach((item,index)=>{
            item.vedio_time = this.timeFormat(item.vedio_time)
            item.vedio_cover = Setting.url(item.vedio_cover)
          })
          })
    },
    //获取不在合集里的视频列表
    getClolecOtherVideo(){
      let checked = this.single?1:''
      collectionVideoApi({
        page:1,
        limit:1000,
        "e:v:is_del":0,
        "k:v:vedio_title":this.searchWorkModel,
        "n:l:id":checked,
        "e:v:uid":this.uid
      }).then(res=>{
        this.titoalWork = res.data.count
        this.detailAddWorkLis = res.data.list
        this.detailAddWorkLis.forEach((item,index)=>{
          item.vedio_time = this.timeFormat(item.vedio_time)
          item.vedio_cover = Setting.url(item.vedio_cover)
        })

      })
    },
    handleCroped(blob) {
      //  console.log(blob,'lllkkk');
      //   let aee = new File([blob], blob.name, {type: blob.type});
      //   console.log(aee,'aee');
      // let file =[]
      // file.push(blob);

      // const formData = new FormData()
      //  for (var i = 0; i < file.length; i++) {
      //   // that.file[i].name = that.file[i].name.replace('.mp4','.m3u8')
      //   formData.append("file[]", file[file.length - 1]); // 文件对象
      // }

      // console.log(formData.getAll("file[]"),'lengh');

      // this.files = formData;
      // formData.append('file[]', blob)
      // console.log(formData.getAll("file[]"),'000');
      // uploadImg(formData).then(() => {
      //   this.$Message.success('Upload success~')
      // })
      const formData = new FormData();
      formData.append("croppedImg", blob);
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
        } else {
        }
      });
    },
    //   合集拖拽
    handleDragStart(e, item) {
      this.dragging = item;
    },
    handleDragEnd() {
      this.dragging = null;
      this.$emit("hasChanged", this.items);
      console.log(this.items,'this.items');
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
    // 删除合集
    deleteItem(item, index) {
      this.$Modal.confirm({
        title: "确定要移除合集吗？",
        // content: '<p></p>',
        onOk: () => {
          delCollecApi({
            id: item.id,
          })
            .then((res) => {
              this.$Message.warning(res.msg);
              this.getCollectionTotalLis(this.uid);
            })
            .catch((err) => {
              this.$Message.warning(err.msg);
            });
        },
        onCancel: () => {
          this.$Message.info("点击了取消");
        },
      });
      this.$emit("deleteItem", item, index);
    },
    // 修改合集
    editItem(item, index) {
      this.collecId = item.id;
      console.log(item, "修改");
      this.modelTitle = "修改合集";
      this.createCollecForm.title = item.title_new;
      this.createCollecForm.desc = item.desc_new;
      this.createCollecForm.pic = Setting.url( item.total_cover_new);
      this.createCollecForm.pic = Setting.url( this.createCollecForm.pic)
      this.modalCreate = true;
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
          detailVideoDeltApi({
            "e:vedio_id":item.vedio_id
          }).then(res=>{
            this.$Message.success(res.msg)
            this.getCollectVideoLis(this.totalId)
          }).catch(err=>{
            this.$Message.warning(err.msg)
          })
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
    addWorksClick() {
      this.getClolecOtherVideo()
      this.modalAdd = true;
    },
    //替换合集封面
    replaceClick() {
      this.modalReplace = true;
    },
    cutDown(e) {
      console.log(e.file);
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
          this.createCollecForm.pic = res.data.data.url;
          this.createCollecForm.pic  = Setting.url(this.createCollecForm.pic )   
        }
      });
    },
    // 传入name，src name中必须包含后缀名
    openView() {
      // 传入name，src name中必须包含后缀名
      // https://img0.baidu.com/it/u=1745397029,2362331324&fm=15&fmt=auto
      this.$refs.imgCutterModal.handleOpen({
        name: "image.jpg",
        src: this.createCollecForm.pic ? this.createCollecForm.pic : "",
      });
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
    // 创建合集
    createClick() {
      this.modelTitle = "创建合集";
      this.modalCreate = true;
    },
    //保存----添加合集
    saveCreateClick() {
      if (!this.uid) {
        return this.$Message.warning("用户id不存在！");
      }
      if (!this.createCollecForm.title) {
        return this.$Message.warning("请填写合集标题！");
      }
      if (!this.createCollecForm.desc) {
        return this.$Message.warning("请填写用户简介！");
      }
      if (!this.createCollecForm.pic) {
        return this.$Message.warning("请选择合集封面！");
      }
      if (this.modelTitle === "创建合集") {
        creatCollecApi({
          "u:uid": this.uid, //用户id
          "u:title": this.createCollecForm.title, //合集标题
          "u:title_new": this.createCollecForm.title, //合集标题
          "u:desc": this.createCollecForm.desc, //合集简介
          "u:desc_new": this.createCollecForm.desc, //合集简介
          "u:total_cover": this.createCollecForm.pic, //合集封面
          "u:total_cover_new": this.createCollecForm.pic, //合集封面
        })
          .then((res) => {
            this.$Message.success(res.msg);
            this.getCollectionTotalLis(this.uid);
            this.modalCreate = false;
            this.createCollecForm = {
              title: "", //标题
              desc: "", //简介
              pic: "", //合集封面
            };
          })
          .catch((err) => {
            this.$Message.warning(err.msg);
          });
      } else if (this.modelTitle === "修改合集") {
        creatCollecApi({
          "e:id": this.collecId, //合集id
          "u:uid": this.uid, //用户id
          "u:title": this.createCollecForm.title, //合集标题
          "u:title_new": this.createCollecForm.title, //合集标题
          "u:desc": this.createCollecForm.desc, //合集简介
          "u:desc_new": this.createCollecForm.desc, //合集简介
          "u:total_cover": this.createCollecForm.pic, //合集封面
          "u:total_cover_new": this.createCollecForm.pic, //合集封面
        })
          .then((res) => {
            this.$Message.success(res.msg);
            this.getCollectionTotalLis(this.uid);
            this.modalCreate = false;
            this.createCollecForm = {
              title: "", //标题
              desc: "", //简介
              pic: "", //合集封面
            };
          })
          .catch((err) => {
            this.$Message.warning(err.msg);
          });
      }
    },
    // 取消创建合集
    createCancelClick() {
      this.modalCreate = false;
      this.createCollecForm = {
        title: "", //标题
        desc: "", //简介
        pic: "", //合集封面
      };
    },
    //详情
    detailClick(item) {
      this.totalId = item.id
      if(item.status ===0){
        return this.$Message.warning("该合集正在审核，不允许修改!")
      }
      this.getCollectVideoLis(item.id)
      this.modal11 = true;
    },
    //审核状态
    statusBtnClick(mun) {
      this.falgStatus = mun;
      this.getCollectionTotalLis(this.uid);
    },
    // 合集类型
    typeBtnClick(text){
      this.typeStatus = text
      this.getCollectionTotalLis(this.uid);
    },
    //排序
    sortClick(){
      this.sortText = "完成排序"
      this.draggable = !this.draggable
      let newItems = []
     newItems = this.items.map(item=>{
        return item.id
      })
      if(!this.draggable){
         sortCollecApi({
        tid:newItems
      }).then(res=>{
        this.$Message.success(res.msg)
        this.getCollectionTotalLis(this.uid)
        this.sortText = "设置排序"
        this.draggable = false
      }).catch(err=>{
        this.$Message.warning(err.msg)
      })
      }
     
    },
    //添加作品change事件
    changeWorkClick(e){
      this.single = e
      this.getClolecOtherVideo()
    },
    //查找作品
    searchEndWork(){
      this.getClolecOtherVideo()
    },
    //合集详情---设置排序
    setSortDetailClick(){
      this.sortText2 = "完成排序"
      this.draggable2 =!this.draggable2
      let newItemArrId = this.itemWork.map(item=>{
        return item.l_id
      })
      newItemArrId = newItemArrId.toString()
      console.log(newItemArrId,'l_id');
      if(!this.draggable2){
        detailSortApi({
          "e:id":this.totalId,
          "u:field_id":newItemArrId
        }).then(res=>{
          this.$Message.success(res.msg)
          this.getCollectVideoLis(this.totalId)
          this.sortText2 = "设置排序"
          this.draggable2 = false
        }).catch(err=>{
          this.$Message.warning(err.msg)
        })

      }
    },
    //合集添加视频
    adddetailWorks(item){
      addWorksApi({
        "vid":item.vedio_id,
        tid:this.totalId
      }).then(res=>{
        this.$Message.success(res.msg)
        this.getClolecOtherVideo()
        this.getCollectVideoLis(this.totalId)
      }).catch(err=>{
        this.$Message.warning(err.msg)
      })
    },
    //合集移除视频
    deldetailWorks(item){
      delWorksApi({
          "e:vedio_id":item.vedio_id
      }).then(res=>{
        this.$Message.success(res.msg)
        this.getClolecOtherVideo()
        this.getCollectVideoLis(this.totalId)
      }).catch(err=>{
        this.$Message.warning(err.msg)
      })
      
    },
    // 批量移除
    someDelClick(){
      if(this.delArrID.length<2){
        return this.$Message.warning("至少要选两条数据！")
      }
       delCollecApi({
            id: this.delArrID,
      })
      .then((res) => {
        this.$Message.warning(res.msg);
        this.getCollectionTotalLis(this.uid);
      })
      .catch((err) => {
        this.$Message.warning(err.msg);
      });
    },
    //全选全部选
     // 全选全部选
    chooseSingle(item) {
      var self = this;
      self.hasAllChecked = true;
      self.items.forEach((ele) => {
        if (!ele.hasSelected) self.hasAllChecked = false;
      });
      let delArrItem = self.items.filter((val)=>{
        return val.hasSelected ===true
      })
      this.delArrID = delArrItem.map(item=>{
        return item.id
      })
      // console.log(this.delArrID,'选中的数据');
    },
    
    timeFormat(time){
      let newTime,hour,minite,seconds;
      if(time >= 3600){
      hour = parseInt(time/3600) < 10 ? '0' + parseInt(time/3600) : parseInt(time/3600) ;
      minite = parseInt(time%60/60) < 10 ? '0' + parseInt(time%60/60):parseInt(time%60/60);
      seconds = time%3600 < 10 ? '0' + time%3600 : time%3600;
      newTime = hour + ':' + minite + ':' + seconds;
      }else if(time >= 60 && time < 3600){
      minite = parseInt(time/60) < 10 ? '0' + parseInt(time/60) : parseInt(time/60);
      seconds = time%60 < 10 ? '0' + time%60 : time%60;
      newTime = minite + ':' + seconds;
      }else if(time < 60 ){
      seconds = time < 10 ? '0' + time : time;
      newTime = '00:'+ seconds;
      }
      return newTime;
      }

  },
};
</script>

<style scoped>
.cropper-example {
  height: 400px;
}
.btnChange:hover {
  cursor: pointer;
}
/* 作品列表详情 */
.detailAddWorkLis {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ebe8e8;
}
.contentDtail {
  height: 440px;
  overflow-y: auto;
  /* background-color: pink; */
}
.contentDtail .left {
  flex: 0 0 22%;
  position: relative;
}
.contentDtail .left p {
  position: absolute;
  bottom: 2px;
  width: 100px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  text-align: center;
  line-height: 22px;
}
.contentDtail .content {
  flex: 1;
}
.search {
  padding: 5px 0;
}
.searchWork{
  padding-bottom: 10px;
}
.transition-container {
  height: 460px;
  overflow-y: auto;
  background-color: #fff;
}
.allWorks {
  height: 300px;
  overflow-y: auto;
  background-color: #fff;
}
.detailallWorks{
  height: 599px;
  padding: 0 22px;
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
  background-color: #fbfbfb;
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
  flex: 0 0 20%;
}
.addCollect{
  margin-right:21px
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
  padding-bottom: 0;
  /* border-bottom: 1px solid #ccc; */
  /* justify-content: space-between; */
  /* align-items: center; */
}
.box:hover{
  box-shadow: 2px 2px 8px #c8c8c8;
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
  flex: 1;
  padding-left: 59px;
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
  bottom: 78px;
  width: 158px;
  line-height: 28px;
  text-align: center;
}
.createForm .save {
  margin-bottom: 10px;
}
.allWorks .right {
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
