<template>
  <div class="home-page">
    <!-- <Row style="padding: 0px  20px">用户数据</Row> -->
    <Row style="padding: 20px">
      <Col span="4">
        <Card :bordered="false" style="color: #000">
          <p style="font-size: 15px">今日新增用户数</p>
          <p style="font-size: 17px; font-weight: 550; padding: 10px 0">
            {{ userCountData.count_xz }}
          </p>
          <p>昨日：{{ userCountData.count_xz_zt }}</p>
        </Card>
      </Col>
      <Col span="4" offset="2">
        <Card :bordered="false" style="color: #000">
          <p style="font-size: 15px">今日活跃用户数</p>
          <p style="font-size: 17px; font-weight: 550; padding: 10px 0">
            {{ userCountData.count_hy }}
          </p>
          <p>昨日：{{ userCountData.count_hy_zt }}</p>
        </Card>
      </Col>
      <Col span="4" offset="2">
        <Card :bordered="false" style="color: #000">
          <p style="font-size: 15px">累计用户总数</p>
          <p style="font-size: 17px; font-weight: 550; padding: 10px 0">
            {{ userCountData.count }}
          </p>
        </Card>
      </Col>
    </Row>
    <!-- 视频数据 -->
    <div>
      <Row style="padding: 20px">
        <Col span="7">
          <p style="font-size: 13px; color: #000">
            视频数据&emsp;付费率（付费视频人数/总付费视频数）=<span
              >{{
                (userVideoData.count_rs / userVideoData.count_sp).toFixed(2)
              }}%</span
            >
          </p>
        </Col>
        <Col span="14" offset="2">
          <DatePicker
            @on-change="videoTimeChange"
            type="datetimerange"
            :value="videoData"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择开始时间与结束时间"
            style="width: 300px"
          ></DatePicker>
          &emsp;<Button type="primary" @click="confirmVideoBtn">确认</Button>
        </Col>
      </Row>
      <Row style="padding: 20px">
        <Col span="2">
          <Card style="width: 140px; text-align: center; color: #333">
            <p style="font-size: 13px">付费视频人数</p>
            <p style="padding-top: 5px">{{ userVideoData.count_rs }}</p>
          </Card>
        </Col>
        <Col span="2" offset="2">
          <Card style="width: 140px; text-align: center; color: #333">
            <p style="font-size: 13px">总付费视频数</p>
            <p style="padding-top: 5px">{{ userVideoData.count_sp }}</p>
          </Card>
        </Col>
      </Row>
    </div>
    <!-- 用户留存 -->
    <div>
      <Row style="padding: 20px">
        <Col span="7">
          <p style="font-size: 13px; color: #000">用户留存</p>
        </Col>
        <!-- <Col span="14" offset="2">
          <DatePicker
          @on-change="userTimeChange"
          :value="userDate"
            type="date"
            format="yyyy-MM-dd"
            placeholder="请选择日期"
            style="width: 150px"
          ></DatePicker>
          &emsp;<Button type="primary" @click="confirmRetentDate">确认</Button>
        </Col> -->
      </Row>
      <Row style="padding: 20px">
        <Col span="4">
          <Card style="width: 140px; text-align: center; color: #333">
            <p style="font-size: 13px">7日前注册用户留存率</p>
            <p style="padding-top: 5px">{{ userRetentData.lcl7 }}%</p>
          </Card>
        </Col>
        <Col span="4">
          <Card style="width: 140px; text-align: center; color: #333">
            <p style="font-size: 13px">15日前注册用户留存率</p>
            <p style="padding-top: 5px">{{ userRetentData.lcl15 }}%</p>
          </Card>
        </Col>
      </Row>
      <Row style="padding: 20px">
        <Col span="10">
          <Card style="width: 140px; text-align: center; color: #333">
            <p style="font-size: 13px">30日前注册用户留存率</p>
            <p style="padding-top: 5px">{{ userRetentData.lcl30 }}%</p>
          </Card>
        </Col>
        <Col span="11" style="margin-top: -120px">
          <Card style="width:320px;text-align:center;margin-top:-19px">
            <p slot="title" style="height:40px;text-align:center">
              <DatePicker
              :options="options"
                @on-change="userTimeChange"
                :value="userDate"
                type="date"
                format="yyyy-MM-dd"
                placeholder="请选择日期"
                style="width: 150px"
              ></DatePicker>
              &emsp;<Button type="primary" @click="confirmRetentDate"
                >确认</Button
              >
            </p>
            <i-circle
              :size="180"
              :trail-width="1"
              :stroke-width="2"
              :percent="userRetentDate.lcl"
              stroke-linecap="square"
              stroke-color="#FF9636"
            >
              <div class="demo-Circle-custom">
                <p>{{ Number(userRetentDate.day)-1===0?'今':Number(userRetentDate.day)-1 }}日前注册用户留存率</p>

                <span>
                  <i>{{ userRetentDate.lcl }}%</i></span
                >
              </div>
            </i-circle>
          </Card>
        </Col>
      </Row>
    </div>
    <!-- 财务数据 -->
    <div>
      <Row style="padding: 20px">
        <Col span="20">
          <span style="font-size: 13px; color: #000">财务数据</span> &emsp;
          <DatePicker
            @on-change="finaceDateChange"
            :value="finaceDate"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder=""
            style="width: 300px"
          ></DatePicker>
          &emsp;<Button type="primary" @click="finaceConfirm">确认</Button>
        </Col>
      </Row>
      <Row style="padding: 20px">
        <Col span="4">
          <Card
            style="
              width: 140px;
              text-align: center;
              background-color: #2c89ec;
              color: #fff;
            "
          >
            <p style="font-size: 13px">付费视频总金额</p>
            <p style="padding-top: 5px">{{ finaceList.pay_sum }}</p>
          </Card>
        </Col>
        <Col span="4">
          <Card
            style="
              width: 140px;
              text-align: center;
              background-color: #38bdc5;
              color: #fff;
            "
          >
            <p style="font-size: 13px">提现总金额</p>
            <p style="padding-top: 5px">{{ finaceList.withdraw_sum }}</p>
          </Card>
        </Col>
      </Row>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import {
  userCountApi,
  userVideoApi,
  userRetentionApi,
  userRetentDateApi,
  userFinanceApi,
} from "@/api/index";

export default {
  components: {},
  data() {
    return {
       options: {
         disabledDate (userDate) {
             return userDate && userDate.valueOf() >= new Date();
         }
     },//禁止选未来
      userCountData: {},
      userVideoData: {},
      userRetentData: {},
      videoData: [],
      finaceDate: [],
      userDate: "",
      userRetentDate: {}, //自定义时间
      finaceList: {},
      spinShow: false,
    };
  },
  created() {
    this.userDate = this.$moment(new Date()).format("YYYY-MM-DD");
    this.getUserCount();
    this.getUserVideoCount();
    this.getUserRetention();
    this.getUserRetentDate();
    this.getFinaceData();
  },
  mounted() {},
  methods: {
    //获取首页用户统计
    getUserCount() {
      userCountApi().then((res) => {
        this.userCountData = res.data;
        this.spinShow = false;
      });
    },
    //获取首页视频数据统计
    getUserVideoCount() {
      userVideoApi({
        x_create_time: this.videoData[0] ? this.videoData[0] : "",
        d_create_time: this.videoData[1] ? this.videoData[1] : "",
      }).then((res) => {
        this.userVideoData = res.data;
        this.spinShow = false;
      });
    },
    //获取首页用户留存数据
    getUserRetention() {
      userRetentionApi().then((res) => {
        this.userRetentData = res.data;
        this.spinShow = false;
      });
    },
    //获取留存率-自定义日期
    getUserRetentDate() {
      userRetentDateApi({
        date: this.userDate,
      }).then((res) => {
        this.userRetentDate = res.data;
        this.userRetentDate.lcl = Number(this.userRetentDate.lcl);
        this.spinShow = false;
      });
    },
    //获取财务数据
    getFinaceData() {
      userFinanceApi({
        x_create_time: this.finaceDate[0] ? this.finaceDate[0] : "",
        d_create_time: this.finaceDate[1] ? this.finaceDate[1] : "",
      })
        .then((res) => {
          this.finaceList = res.data;
          this.spinShow = false;
        })
        .catch((err) => {
          this.$Message.warning(err.msg);
        });
    },
    //视频时间选择事件
    videoTimeChange(e) {
      this.videoData = e;
    },
    finaceDateChange(e) {
      this.finaceDate = e;
    },
    userTimeChange(e) {
      this.userDate = e;
    },
    // 视频数据确认
    confirmVideoBtn() {
      this.spinShow = true;
      this.getUserVideoCount();
    },
    //留存率自定义时间确认
    confirmRetentDate() {
      this.spinShow = true;
      this.getUserRetentDate();
    },
    finaceConfirm() {
      this.spinShow = true;
      this.getFinaceData();
    },
  },
};
</script>

<style lang="less">
.home-page {
  //   margin-top: 20px;
  background-color: #fff;
}
.demo-Circle-custom {
  & h1 {
    color: #3f414d;
    font-size: 28px;
    font-weight: normal;
  }
  & p {
    color: #657180;
    font-size: 14px;
    margin: 10px 0 15px;
  }
  & span {
    display: block;
    padding-top: 15px;
    color: #657180;
    font-size: 14px;
    &:before {
      content: "";
      display: block;
      width: 50px;
      height: 1px;
      margin: 0 auto;
      background: #e0e3e6;
      position: relative;
      top: -15px;
    }
  }
  & span i {
    font-style: normal;
    color: #3f414d;
  }
}
</style>
