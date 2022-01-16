<template>
    <div class="article-manager">
        <div class="i-layout-page-header">
          <div class="i-layout-page-header">
            <span class="ivu-page-header-title">{{title}}</span>
            <div>
              <Tabs v-model="currentTab" @on-click="changeTab">
                <TabPane :icon="item.icon" :label="item.label" :name="item.value.toString()" v-for="(item,index) in headerList" :key="index"/>
              </Tabs>
            </div>
          </div>
        </div>
        <Card :bordered="false" dis-hover class="ivu-mt fromBox">
            <Tabs type="card" v-model="childrenId" v-if="headerChildrenList.length" @on-click="changeChildrenTab">
                <TabPane :label="item.label" :name="item.id.toString()" v-for="(item,index) in headerChildrenList" :key="index"></TabPane>
            </Tabs>
            <!-- 手写站点配置 -->
          
            <div style="position:relative">

                <form-create  :option="option"  :rule="rules" @on-submit="onSubmit" v-if="rules.length!==0">111</form-create>
            </div>
            <div class="site" v-if="childrenId==81">
                修改奖励钻石数量需同时修改图片上的数量
            </div>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </Card>
        <!-- 图片预览 -->
   <Modal v-model="modal2" footer-hide width="616">
        <div>
            <img style="width:560px" :src="previewPic" alt="">
        </div>
    </Modal>
    </div>
</template>

<script>
    import formCreate from '@form-create/iview'
    import { headerListApi, dataFromApi } from '@/api/setting'
    import request from '@/libs/request'
    import { getCookies } from "@/libs/util";
    import Setting from "@/setting";
    import axios from "axios";
    export default {
        name: 'setting_setSystem',
        components: { formCreate: formCreate.$form() },
        data () {
            return {
                previewPic:"",
                modal2:false,//图片预览框
                uploadForm:{
                    sitename:"",//站点名称
                    siteStatus:'1',
                    siteHttp:"",//网站地址
                    AppIloadHttp:"",//安卓APP下载地址
                    IOSloadHttp:"",//苹果APP下载地址
                    inviteHttp:"",//邀请页地址
                    forceStatus:"0",//强制手机号登录
                },
                
                picBackBigUrl:"",//后台大logo预览地址
                picBackBigUrl4:"",//后台登录页预览地址
                picUrl6:"",//后台小logo
                 picUrl7:"",//移动端logo
                 picUrl8:"",//用户默认头像
                 picUrl9:"",//个人中心封面
                fileUrl: Setting.apiBaseURL + "/file/upload/multipleSliceFile",
                header: {},
                fileImg4:[],//后台登录页传参文件
                backBigfileImg:[],//后台大logo传参文件
                fileImg6:[],//后台小logo传参
                fileImg7:[],//移动端logo
                fileImg8:[],//用户默认头像
                fileImg9:[],//个人封面
                flagNum:null,
                rules: [],
                option: {
                    form: {
                        labelWidth: 185
                    },
                  submitBtn:{
                      col:{
                        span:3,
                        push:3
                      }
                  },
                    global: {
                        upload: {
                            props: {
                                onSuccess (res, file) {
                                    if (res.status === 200) {
                                        file.url = res.data.src
                                    } else {
                                        this.$Message.error(res.msg)
                                    }
                                }
                            }
                        },
                      frame:{
                        props:{
                          closeBtn:false,
                          okBtn:false
                        }
                      }
                    }
                },
                spinShow: false,
                FromData: null,
                currentTab: '',
                headerList: [],
                headerChildrenList: [],
                childrenId: '',
                title: ''
            }
        },
        created () {
            this.getAllData()
        },
        watch: {
            $route (to, from) {
                this.headerChildrenList = []
                this.getAllData()
            },
            childrenId () {
                this.getFrom()
            }
        },
        mounted() {
            this.getToken();
        },
        methods: {
          
            getToken() {
                this.header["Authori-zation"] = "Bearer " + getCookies("token");
            },
             handleSuccess(res) {},
           
            // 后台登录页
            handleBeforeBackBigImg4(file) {
            //    console.log(file);
               this.fileImg4.push(file);
                let formData = new FormData();
                for (var i = 0; i < this.fileImg4.length; i++) {
                    // that.file[i].name = that.file[i].name.replace('.mp4','.m3u8')
                    formData.append("file[]", this.fileImg4[i]); // 文件对象
                }
                this.fileImg4 = formData
                  axios({
                        url: Setting.apiBaseURL + `/file/upload/multipleSliceFile`,
                        method: "post",
                        headers: {
                        "Authori-zation": "Bearer " + getCookies("token"),
                        "Content-Type": "multipart/form-data",
                        },
                        //参数
                        data: this.fileImg4,
                    }).then((res) => {
                        if (res.data.status === 400) {
                        this.$Message.warning(res.data.data.message);
                        } else {
                        this.picBackBigUrl4 = res.data.data.url;
                        
                        }
                    });
                    return false;
            },
                // 后台大logo
            handleBeforeBackBigImg(file) {
            //    console.log(file);
               this.backBigfileImg.push(file);
                let formData = new FormData();
                for (var i = 0; i < this.backBigfileImg.length; i++) {
                    // that.file[i].name = that.file[i].name.replace('.mp4','.m3u8')
                    formData.append("file[]", this.backBigfileImg[i]); // 文件对象
                }
                this.backBigfileImg = formData
                  axios({
                        url: Setting.apiBaseURL + `/file/upload/multipleSliceFile`,
                        method: "post",
                        headers: {
                        "Authori-zation": "Bearer " + getCookies("token"),
                        "Content-Type": "multipart/form-data",
                        },
                        //参数
                        data: this.backBigfileImg,
                    }).then((res) => {
                        if (res.data.status === 400) {
                        this.$Message.warning(res.data.data.message);
                        } else {
                        this.picBackBigUrl = res.data.data.url;
                        
                        }
                    });
                    return false;
            },
            // 后台小logo
            handleBeforeUploadImg6(file) {
            //    console.log(file);
               this.fileImg6.push(file);
                let formData = new FormData();
                for (var i = 0; i < this.fileImg6.length; i++) {
                    // that.file[i].name = that.file[i].name.replace('.mp4','.m3u8')
                    formData.append("file[]", this.fileImg6[i]); // 文件对象
                }
                this.fileImg6 = formData
                  axios({
                        url: Setting.apiBaseURL + `/file/upload/multipleSliceFile`,
                        method: "post",
                        headers: {
                        "Authori-zation": "Bearer " + getCookies("token"),
                        "Content-Type": "multipart/form-data",
                        },
                        //参数
                        data: this.fileImg6,
                    }).then((res) => {
                        if (res.data.status === 400) {
                        this.$Message.warning(res.data.data.message);
                        } else {
                        this.picUrl6 = res.data.data.url;
                        
                        }
                    });
                    return false;
            },
             // 移动端logo
            handleBeforeUploadImg7(file) {
            //    console.log(file);
               this.fileImg7.push(file);
                let formData = new FormData();
                for (var i = 0; i < this.fileImg7.length; i++) {
                    // that.file[i].name = that.file[i].name.replace('.mp4','.m3u8')
                    formData.append("file[]", this.fileImg7[i]); // 文件对象
                }
                this.fileImg7 = formData
                  axios({
                        url: Setting.apiBaseURL + `/file/upload/multipleSliceFile`,
                        method: "post",
                        headers: {
                        "Authori-zation": "Bearer " + getCookies("token"),
                        "Content-Type": "multipart/form-data",
                        },
                        //参数
                        data: this.fileImg7,
                    }).then((res) => {
                        if (res.data.status === 400) {
                        this.$Message.warning(res.data.data.message);
                        } else {
                        this.picUrl7 = res.data.data.url;
                        
                        }
                    });
                    return false;
            },
              // 用户默认头像
            handleBeforeUploadImg8(file) {
            //    console.log(file);
               this.fileImg8.push(file);
                let formData = new FormData();
                for (var i = 0; i < this.fileImg8.length; i++) {
                    // that.file[i].name = that.file[i].name.replace('.mp4','.m3u8')
                    formData.append("file[]", this.fileImg8[i]); // 文件对象
                }
                this.fileImg8 = formData
                  axios({
                        url: Setting.apiBaseURL + `/file/upload/multipleSliceFile`,
                        method: "post",
                        headers: {
                        "Authori-zation": "Bearer " + getCookies("token"),
                        "Content-Type": "multipart/form-data",
                        },
                        //参数
                        data: this.fileImg8,
                    }).then((res) => {
                        if (res.data.status === 400) {
                        this.$Message.warning(res.data.data.message);
                        } else {
                        this.picUrl8 = res.data.data.url;
                        
                        }
                    });
                    return false;
            },
            //个人封面
             handleBeforeUploadImg9(file) {
            //    console.log(file);
               this.fileImg9.push(file);
                let formData = new FormData();
                for (var i = 0; i < this.fileImg9.length; i++) {
                    // that.file[i].name = that.file[i].name.replace('.mp4','.m3u8')
                    formData.append("file[]", this.fileImg9[i]); // 文件对象
                }
                this.fileImg9 = formData
                  axios({
                        url: Setting.apiBaseURL + `/file/upload/multipleSliceFile`,
                        method: "post",
                        headers: {
                        "Authori-zation": "Bearer " + getCookies("token"),
                        "Content-Type": "multipart/form-data",
                        },
                        //参数
                        data: this.fileImg9,
                    }).then((res) => {
                        if (res.data.status === 400) {
                        this.$Message.warning(res.data.data.message);
                        } else {
                        this.picUrl9 = res.data.data.url;
                        
                        }
                    });
                    return false;
            },
            //预览----后台大LoGo
            previewClick(){
                this.previewPic =  this.picBackBigUrl
                this.modal2 = true
            },
            //预览----后台登录页
            previewClick4(){
                this.previewPic =  this.picBackBigUrl4
                this.modal2 = true
            },
             //预览----后台大LoGo
            previewClick6(){
                this.previewPic =  this.picUrl6
                this.modal2 = true
            },
           
              //预览----移动端LoGo
            previewClick7(){
                this.previewPic =  this.picUrl7
                this.modal2 = true
            },
               //预览----用户默认头像
            previewClick8(){
                this.previewPic =  this.picUrl8
                this.modal2 = true
            },
               //预览----个人中心封面
            previewClick9(){
                this.previewPic =  this.picUrl9
                this.modal2 = true
            },
            childrenList () {
                let that = this
                that.headerList.forEach(function (item) {
                    if (item.value.toString() === that.currentTab) {
                      if(item.children === undefined){
                        that.childrenId = item.id;
                        that.headerChildrenList=[];
                      } else {
                        that.headerChildrenList = item.children
                        that.childrenId = item.children.length ? item.children[0].id.toString() : ''
                      }
                    }
                })
            },
            // 头部tab
            getHeader () {
                this.spinShow = true
                return new Promise((resolve, reject) => {
                    let tab_id = this.$route.params.tab_id;
                    let data = {
                        type: this.$route.params.type ? this.$route.params.type : 0,
                        pid: tab_id ? tab_id : 0
                    }
                    headerListApi(data).then(async res => {
                        let config = res.data.config_tab
                        this.headerList = config
                        this.currentTab = config[0].value.toString()
                        this.childrenList()
                        resolve(this.currentTab)
                        this.spinShow = false
                    }).catch(err => {
                        this.spinShow = false
                        this.$Message.error(err)
                    })
                })
            },
            // 表单
            getFrom () {
                this.spinShow = true
                return new Promise((resolve, reject) => {
                    let ids = ''
                    if (this.$route.params.type === '3') {
                        ids = this.$route.params.tab_id
                    } else {
                        if (this.childrenId) {
                            ids = this.childrenId
                        } else {
                            ids = this.currentTab
                        }
                    }
                    let data = {
                        tab_id: Number(ids)
                    }
                    let logistics = 'freight/config/edit_basics',agent = 'agent/config/edit_basics',
                        integral = 'marketing/integral_config/edit_basics',sms = 'serve/sms_config/edit_basics',
                        config = 'setting/config/edit_basics';
                    let url = this.$route.name === 'setting_logistics'?logistics:this.$route.name === 'setting_distributionSet'?
                        agent:this.$route.name === 'setting_message'?sms:this.$route.name === 'setting_setSystem'?config:integral;
                    dataFromApi(data,url).then(async res => {
                        this.spinShow = false
                        if (res.data.status === false) {
                            return this.$authLapse(res.data)
                        }
                        this.FromData = res.data
                        this.rules = res.data.rules
                        this.title = res.data.title
                    }).catch(res => {
                        this.spinShow = false
                        this.$Message.error(res.msg)
                    })
                })
            },
            async getAllData () {
                if (this.$route.params.type !== '3') {
                    await this.getHeader()
                } else {
                    this.headerList = []
                    this.getFrom()
                }
            },
            // 选择
            changeTab () {
                this.childrenList()
            },
            // 二级选择
            changeChildrenTab (name) {
                this.childrenId = name
                this.flagNum = name
                console.log(this.flagNum,'llll');
            },
            // 提交表单 group
            onSubmit (formData) {
                request({
                    url: this.FromData.action,
                    method: this.FromData.method,
                    data: formData
                }).then(res => {
                    this.$Message.success(res.msg)
                }).catch(res => {
                    this.$Message.error(res.msg)
                })
            }
        }
    }
</script>

<style scoped lang="stylus">
/deep/.ivu-icon-md-cloud-upload:before{
    color: #008EF0;
}
.site{
   position: absolute;
    top: 207px;
    left: 281px;
    color: red;
}
.leftItem{
    width:138px;
    text-align: right;
    font-size:13px;
    margin-right:15px
}
.pic{
    width:60px;
    height:60px;
    display:flex;
    justify-content: center;
    align-items: center;
    border:1px solid #c0ccda;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 2px 2px 5px #d7d5d5;
}
.preview{
   display:flex;
}
.previewClick{
    color:#008EF0;
    margin-left:6px;
    margin-top:34px;
    cursor: pointer;
}
 .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
.item{
    display:flex;
    justify-content: left;
    align-items: center;
    padding-bottom: 16px
}
  .ivu-tabs{
    margin-bottom: 18px;
  }
.fromBox{
    min-height 600px;
}
</style>
