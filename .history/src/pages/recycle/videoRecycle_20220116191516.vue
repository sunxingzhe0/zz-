<template>
  <div class="">
    <!-- 搜索 -->
    <div class="search">
      <!-- 查询 -->
      <div style="display: flex">
        <div class="sarchItem">
          视频标题：<Input
            clearable
            v-model="searchForm['k:v:vedio_title']"
            style="width: 160px"
            placeholder="请输入视频标题"
          ></Input>
        </div>
        <div class="sarchItem">
          视频ID：<Input
            clearable
            v-model="searchForm['e:v:vedio_id']"
            style="width: 160px"
            placeholder="请输入视频ID"
          ></Input>
        </div>
        <div class="sarchItem">
          作者ID：<Input
            clearable
            v-model="searchForm['e:v:uid']"
            style="width: 160px"
            placeholder="请输入作者ID"
          ></Input>
        </div>
      </div>
      <div style="display: flex">
        <div class="sarchItem">
          作者手机号：<Input
            clearable
            v-model="searchForm['e:u:phone']"
            style="width: 160px"
            placeholder="请输入作者手机号"
          ></Input>
        </div>
        <div class="sarchItem">
          作者昵称：<Input
            clearable
            v-model="searchForm['k:u:nickname']"
            style="width: 160px"
            placeholder="请输入作者昵称"
          ></Input>
        </div>
        <div class="sarchItem">
          视频资源状态：
          <Button
            @click="delStatusClick('E:0')"
            :type="delFlag === 'E:0' ? 'warning' : 'default'"
            style="margin-right: 15px"
            >全部</Button
          >
          <Button
            @click="delStatusClick('e:2')"
            :type="delFlag === 'e:2' ? 'warning' : 'default'"
            style="margin-right: 15px"
            >已清除</Button
          >
          <Button
            @click="delStatusClick('e:1')"
            :type="delFlag === 'e:1' ? 'warning' : 'default'"
            >未清除</Button
          >
        </div>
      </div>
      <div style="display: flex">
        <Button type="error" style="margin-right: 15px" @click="batchDel"
          >批量清除</Button
        >
        <Button type="primary" icon="ios-search" @click="searchClick"
          >搜索</Button
        >
      </div>
    </div>
    <!-- 表格 -->
    <div class="table">
      <!-- 表格 -->
      <Table ref="selection" border :columns="activeColumns" :data="activeData">
        <template slot-scope="{ row, index }" slot="vedio_cover">
          <viewer>
            <img
              v-if="row.vedio_cover !== ''"
              style="width: 40px; height: 40px"
              :src="row.vedio_cover"
            />
            <span v-else>暂无封面</span>
          </viewer>
        </template>

        <!-- 资源状态 -->
        <template slot-scope="{ row, index }" slot="is_del">
          <span v-if="row.is_del === 0">未被清除</span>
          <span v-if="row.is_del === 1"></span>
          <span v-if="row.is_del === 2">已清除</span>
          <Button v-if="row.is_del !== 2" type="error" @click="del(row)"
            >清除</Button
          >
        </template>
        <!-- 发布时间 -->
        <template slot-scope="{ row, index }" slot="add_time">
          <!-- <span v-if="row.del2_time===0"></span>  -->
          <span>{{ Number(row.add_time) | formatDate }}</span>
        </template>
        <!-- 清除时间 -->
        <template slot-scope="{ row, index }" slot="del2_time">
          <span v-if="row.del2_time === 0" style="color: #ff9300"
            >还未清除</span
          >
          <span v-else>{{ row.del2_time | formatDate }}</span>
        </template>
        <!-- 删除时间 -->
        <template slot-scope="{ row, index }" slot="del1_time">
          <span v-if="row.del1_time === 0">0</span>
          <span v-else>{{ row.del1_time | formatDate }}</span>
        </template>
        <!-- 操作 -->
        <template slot-scope="{ row, index }" slot="action">
          <Button
            v-if="row.is_del != 2"
            style="color: #008ef0; textdecoration: underline"
            type="text"
            ghost
            @click="PreviewVideo(row)"
            >预览视频</Button
          >
          <span v-else>暂无操作</span>
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
    <!-- 视频预览弹框 -->
    <Modal v-model="videoLookVisible" :mask-closable="false" :closable="false">
      <p slot="header">预览视频</p>
      <video-player
        v-if="flagVideo"
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions"
      >
      </video-player>
      <span v-if="!flagVideo">暂无视频播放哦~</span>
      <p slot="footer" style="text-align: center">
        <Button type="primary" @click="closePreview">关闭</Button>
      </p>
      <!--  <iframe :src="videoSrc" scrolling="no"  style="width:500px;height:500px" allowfullscreen="true"></iframe> -->
    </Modal>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
import { videoDataApi,videoRecycleDelApi} from "@/api/active";
// import { formatDate } from "@/common/date.js";
import { formatDate } from '@/utils/validate';
import Setting from "@/setting";
export default {
   filters: {
            formatDate (time) {
                if (time !== 0) {
                    let date = new Date(time * 1000)
                    return formatDate(date, 'yyyy-MM-dd hh:mm')
                }
            }
        },
  data() {
    return {
      ossUrl:"",
      flagVideo:true,
      delFlag:'e:1',
      videoSrc:'',
      batchDelID:[],//批量ID
      videoLookVisible:false,
      spinShow:false,
      total: 0,
      exchangeFrom: {
        page: 1,
        limit: 10,
      },
      //搜索
      searchForm:{
        'k:v:vedio_title':"",//视频标题
        'e:v:vedio_id':"",//视频ID
        'e:v:uid':"",//作者ID
        'e:u:phone':"",//作者手机号
        'k:u:nickname':"",//作者昵称
        'c:v:is_del':"E:0",//全部
      },
      activeData: [], //表格
      //表格
     activeColumns: [
       {
          type: "selection",
          width: 60,
          align: "center",
          className: "table-head-style",
        },
        {
          width: 60,
          title: "视频ID",
          key: "vedio_id",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "视频标题",
          key: "vedio_title",
          align: "center",
          className: "table-head-style",
           render: (h, params) => {
            if (!params.row.vedio_title) return h("span", "暂无标题");
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
                    domProps: { title: params.row.vedio_title },
                    on: {
                      click: (e) => {
                        e.stopPropagation();
                      },
                    },
                  },
                  params.row.vedio_title
                ),
              ]);
            }
          },
        },
        {
          title: "作者ID",
          key: "uid",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "作者手机号",
          key: "phone",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "作者昵称",
          key:"nickname",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "视频封面",
          key: "vedio_cover",
          slot:"vedio_cover",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "发布时间",
          key:"add_time",
          slot:'add_time',
          align: "center",
          className: "table-head-style",
        },
       
         {
          title: "入站时间",
          slot: "del1_time",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "清除资源时间",
          slot: "del2_time",
          align: "center",
          className: "table-head-style",
        },
         {
          title: "视频资源状态",
          slot:"is_del",
          align: "center",
          className: "table-head-style",
        },
        
        {
          width:140,
          fixed:'right',
          title: "操作",
          slot:"action",
          align: "center",
          className: "table-head-style",
        },
      ],
       playerOptions: {
        // playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        controls: true, //是否显示控制条
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '1:1', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
            // type: "application/x-mpegURL", // 类型
            src: ''// url地址
        }],
        poster: '', // 封面地址
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
            timeDivider: true, // 当前时间和持续时间的分隔符
            durationDisplay: true, // 显示持续时间
            remainingTimeDisplay: false, // 是否显示剩余时间功能
            fullscreenToggle: true // 是否显示全屏按钮
        }
      }
    };
  },
  created() {
      this.getRecycleLis()
       if(this.playerOptions.sources[0].src===''){
      this.flagVideo=false
      }else{
        this.flagVideo = true
      }
  },

  methods: {
    //预览视频
    closePreview(){
      if( this.flagVideo==true){ this.$refs.videoPlayer.player.pause()}
     
      this.videoLookVisible = false
    },
    //获取回收站列表
    getRecycleLis(){
      this.spinShow = true
      // console.log(this.delFlag,'排序')
      if(this.delFlag==='e:1'){
         videoDataApi({
        ...this.exchangeFrom,
        ...this.searchForm,
        'c:v:is_del':this.delFlag,//全部
        'o:v:del1_time':'DESC',//倒序
      }).then(res=>{
          this.total = res.data.count
          this.activeData = res.data.list
          this.activeData.forEach(item=>{
            item.vedio_cover=Setting.url(item.vedio_cover);
          })
          this.spinShow = false
      })
      }else if(this.delFlag==='e:2'){
          videoDataApi({
        ...this.exchangeFrom,
        ...this.searchForm,
        'c:v:is_del':this.delFlag,//全部
        'o:v:del2_time':'DESC',//倒序
      }).then(res=>{
          this.total = res.data.count
          this.activeData = res.data.list
          this.spinShow = false
      })
      }else{
           videoDataApi({
        ...this.exchangeFrom,
        ...this.searchForm,
        'c:v:is_del':this.delFlag,//全部
        'o:v:vedio_id':'DESC',//倒序
      }).then(res=>{
          this.total = res.data.count
          this.activeData = res.data.list
          this.spinShow = false
      })
      }
     
    },
    //预览视频
    PreviewVideo(row){
      this.playerOptions.sources[0].src = row.vedio_url;
       if(this.playerOptions.sources[0].src===''){
      this.flagVideo=false
      }else{
        this.flagVideo = true
      }
      this.videoLookVisible = true
    },
    //资源状态搜索
    delStatusClick(status){
      this.delFlag = status
      this.exchangeFrom.page=1,
      this.exchangeFrom.limit=10
      this.getRecycleLis()
    },
    //删除
    del(row){
       this.$Modal.confirm({
            title: '确定要清除吗',
            onOk: () => {
                videoRecycleDelApi({
                    'e:vedio_id':row.vedio_id
                }).then(res=>{
                    this.$Message.success(res.msg)
                    this.getRecycleLis()
                }).catch(err=>{
                  this.$Message.warning("文件服务器出错，不予删除!")
                })
            },
            onCancel: () => {
                this.$Message.info('已取消');
            }
        });
    },
    //批量删除
    batchDel(){
       this.batchDelID = this.$refs.selection.getSelection().map((item, index) => {
          return item.vedio_id;
        });
         if (this.batchDelID.length < 2) {
        return this.$Message.warning("请至少选择2条数据！");
      }
      this.$Modal.confirm({
        title: "确定要清除吗？",
        onOk: () => {
          videoRecycleDelApi({
           'i:vedio_id': this.batchDelID,
          }).then((res) => {
            this.$Message.success(res.msg);
            this.getRecycleLis();
          }).catch(err=>{
            this.$Message.warning(err.msg)
          });
        },
        onCancel: () => {
          this.$Message.info("已取消！");
        },
      });
    },
    searchClick(){
      this.getRecycleLis()
    },
    // 分页
    pageChange(index) {
      this.exchangeFrom.page = index;
      this.getRecycleLis(); //列表
    },
    pageSizeChange(index) {
      this.exchangeFrom.limit = index;
      this.getRecycleLis(); //列表
    },
  },
};
</script>
<style scoped lang="less">
.sarchItem {
  margin: 0 18px 15px 0;
}
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
