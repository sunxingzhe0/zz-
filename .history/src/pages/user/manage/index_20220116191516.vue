<template>
  <div class="search">
    <!-- 查询 -->
    <Form :model="searchForm" :label-width="80">
      <div class="workButtonclass">
        <Button
          :type="isVideoFlag === 3 ? 'primary' : 'default'"
          style="margin-right: 10px"
          @click="isVideoBtn(3)"
          >全部</Button
        >
        <Button
          :type="isVideoFlag === 1 ? 'primary' : 'default'"
          style="margin-right: 10px"
          @click="isVideoBtn(1)"
          >有作品用户</Button
        >
        <Button
          :type="isVideoFlag === 0 ? 'primary' : 'default'"
          style="margin-right: 10px"
          @click="isVideoBtn(0)"
          >无作品用户</Button
        >
      </div>

      <Row style="display: flex">
        <Col>
          <FormItem label="用户状态：">
            <Select
              v-model="searchForm.status"
              @on-change="statusChange"
              style="width: 100px"
            >
              <Option
                v-for="item in userStatus"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col v-if="showTime">
          <FormItem label="封禁天数：">
            <Input style="width: 100px" v-model="searchForm.blocked_day" />
          </FormItem>
        </Col>
        <Col>
          <FormItem label="用户昵称：">
            <Input
              style="width: 100px"
              type="text"
              v-model="searchForm['k:nickname']"
              placeholder="请输入用户昵称"
            /> </FormItem
        ></Col>

        <Col>
          <FormItem label="用户ID：">
            <Input
              style="width: 100px"
              type="text"
              v-model="searchForm['e:uid']"
              placeholder="请输入用户ID"
            />
          </FormItem>
        </Col>
        <Col>
          <FormItem label="手机号：">
            <Input
              style="width: 100px"
              type="text"
              v-model="searchForm['e:phone']"
              placeholder="请输入手机号"
            />
          </FormItem>
        </Col>
        <!-- <Col>
          <FormItem label="是否上传过视频：">
            <Select
              v-model="searchForm.is_video"
              @on-change="isVideoChange"
              style="width: 100px"
            >
              <Option
                v-for="item in userisViseo"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
        </Col> -->

        <!-- <div style="text-align:right;margin-right:40px;padding-bottom:20px"> -->

        <Button type="success" @click="clearFormBtn" style="margin: 0 20px">
          <Icon type="ios-aperture" />&nbsp;重置</Button
        >
        <Button type="primary" icon="ios-search" @click="searchFormBtn"
          >搜索</Button
        >

        <!-- </div> -->
      </Row>
    </Form>
    <!-- 表格 -->
    <div class="table">
      <Table
        border
        :columns="columnsShow === 1 ? manageColumns : manageColumns2"
        :data="manageData"
      >
        <!-- 用户头像 -->
        <template slot-scope="{ row, index }" slot="avatar">
          <viewer>
            <img style="width: 40px; height: 40px" :src="row.avatar" />
          </viewer>
        </template>
        <!-- 用户签名 -->
        <!-- <template slot-scope="{ row, index }" slot="autograph">
          <Tooltip :content="row.autograph">
          </Tooltip>
        </template> -->
        <!-- 封禁期限 -->

        <!--  -->
        <template slot-scope="{ row, index }" slot="add_time">
          <viewer>
            <img style="width: 40px; height: 40px" :src="row.avatar" />
          </viewer>
        </template>
        <!-- 邀请明细 -->
        <template slot-scope="{ row, index }" slot="inviteDetail">
          <Button
            style="color: #00baf6"
            type="text"
            ghost
            @click="inviteDetail(row)"
            >查看</Button
          >
        </template>
        <!-- 解除封禁 -->

        <template slot-scope="{ row, index }" slot="action2">
          <Button
            v-if="searchForm.status === 0"
            type="primary"
            ghost
            style="margin-right: 10px"
            @click="relieveBtn(row)"
            >解除封禁</Button
          >
        </template>
        <!-- 审核 -->
        <template slot-scope="{ row, index }" slot="action">
          <div style="margin-bottom: 5px;font-size:15px" >
              <a
            v-if="searchForm.status === 1"
            type="primary"
            ghost
            style="margin: 11px 10px 0 0;text-decoration: underline;font-size:15px"
            @click="worksBtn(row)"
            >作品({{ row.vedio_count }})</a
          >
             
          <Divider type="vertical" />
            <a
            v-if="searchForm.status === 1"
            type="primary"
            ghost
            style="margin-right: 10px;text-decoration: underline;"
            @click="manageBtn(row)"
            >管理</a
          >
          </div>
         <div style="margin-bottom: 5px;font-size:15px">
           <a
           style="text-decoration: underline;"
            type="primary"
            v-if="searchForm.status === 1"
            ghost
            @click="jewelVipBtn(row)"
            >会员明细</a
          >
          <Divider type="vertical" />
          <a
          style="text-decoration: underline;margin-top: 11px"
            type="primary"
            v-if="searchForm.status === 1"
            ghost
            @click="jewelDetailBtn(row)"
            >钻石明细</a
          >
         </div>
         <div style="font-size:15px">
            <a
            style="text-decoration: underline;"
            type="primary"
            v-if="searchForm.status === 1"
            ghost
            @click="compilationsBtn(row)"
            >合集管理</a
          >
         </div>
        </template>
      </Table>
      <Spin size="large" fix v-if="spinShow"></Spin>
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
    <!-- 管理弹框 -->
    <Modal v-model="modal11" fullscreen footer-hide title="">
      <p slot="header" style="text-align: left; cursor: pointer" @click="back">
        <Icon type="md-arrow-round-back" /> 返回
      </p>
      <div class="manageVisible">
        <p class="title" style="font-weight: 550">基本信息</p>
        <div style="display: flex">
          <div style="flex: 0 0 50%">
            <Row>
              <Col span="10"
                >用户ID：<span>{{ manageForm.uid }}</span></Col
              >
              <Col span="10"
                >用户昵称：<span>{{ manageForm.nickname }}</span></Col
              >
            </Row>
            <Row>
              <Col span="10"
                >手机号：<span>{{ manageForm.phone }}</span></Col
              >
              <Col span="10"
                >性别：<span v-if="manageForm.sex === 1">男</span>
                <span v-if="manageForm.sex === 2">女</span></Col
              >
            </Row>
            <Row>
              <Col span="10"
                >注册时间：<span>{{ manageForm.add_time }}</span></Col
              >
              <Col span="10"
                >是否为会员：
                <span v-if="manageForm.vedio_user_type === 0">普通用户</span
                ><span v-if="manageForm.vedio_user_type === 1">vip用户</span>
              </Col>
            </Row>
            <Row>
              <Row>
                <Col span="18"
                  >个性签名：{{
                    manageForm.autograph ? manageForm.autograph : "暂未设置"
                  }}</Col
                >
              </Row>
              <Col span="10"
                >短视频ID号：<span>{{
                  manageForm.uuid ? manageForm.uuid : "暂无数据"
                }}</span></Col
              >
              <Col span="10"
                >地区：<span>{{
                  manageForm.city_str ? manageForm.city_str : "暂未设置"
                }}</span></Col
              >
            </Row>
            <Row>
              <Col span="10"
                >作品数量：<span>{{ manageForm.vedio_count }}</span></Col
              >
              <Col span="10"
                >粉丝数量：<span>{{ manageForm.fan_count }}</span></Col
              >
            </Row>
            <Row>
              <Col span="10"
                >获赞数量：<span>{{ manageForm.likes }}</span></Col
              >
              <Col span="10"
                >关注数量：<span>{{ manageForm.subscribe_count }}</span></Col
              >
            </Row>
            <Row>
              <Col span="18">喜欢视频的类型： <span v-if="manageForm.vedio_cate_str" v-html="manageForm.vedio_cate_str">{{manageForm.vedio_cate_str}}</span><span v-else>暂无数据</span></Col
              >
            </Row>
          </div>
          <div>
            <viewer>
              <img
                style="width: 150px; height: 150px; border: 8px solid #ccc"
                :src="manageForm.avatar"
              />
            </viewer>
          </div>
        </div>
        <Divider />
        <div style="height: 300px; overflow-y: auto; overflow-x: hidden">
          <p class="title" style="font-weight: 550">财务信息</p>
          <Row>
            <Col span="10"
              >钻石数量：<span>{{ manageForm.now_money }}</span></Col
            >
          </Row>
          <Row>
            <Col span="5"
              >已提现次数：<span>{{ manageForm.finance_count }}</span></Col
            >
            <Col span="5"
              >已提现金额：<span>￥{{ manageForm.finance_total }}</span></Col
            >
          </Row>
          <Row>
            <Col span="5"
              >作品钻石收入：<span>{{ manageForm.finance_profit }}</span></Col
            >
            <Col span="5"
              >消耗钻石数量：<span>{{
                manageForm.finance_consumption
              }}</span></Col
            >
          </Row>
          <Divider />
          <p class="title">
            封禁操作<span style="color: red; font-weight: 450">(请填完)</span>
          </p>
          <div style="color: #333">
            <span style="color: red">*</span> 封禁时间：&emsp;
            <Input
              @on-blur="timeBlur"
              style="width: 100px"
              number
              v-model="refuseForm.closure_time"
            />&nbsp;天
          </div>
          <div style="margin: 10px 0; color: #333">
            <span style="color: red">*</span>封禁原因：&emsp;
          </div>
          <div style="margin-left: 80px; margin-top: -30px">
            <RadioGroup
              true-value
              @on-change="refuseChange"
              v-model="refuseForm['u:check_reason']"
              vertical
            >
              <p v-for="(item, index) in backList" :key="index">
                <Radio :label="item.label"></Radio>
              </p>
              <Radio label="自定义"></Radio>
            </RadioGroup>
            <Input
              v-if="definedValue"
              v-model="refuseVlue"
              type="textarea"
              :rows="4"
              placeholder=""
            />
          </div>
          <div>
            <!-- <Checkbox v-model="refuseForm['u:is_del']" @on-change="refuseDelChange"
          >同时删除视频</Checkbox
        > -->
          </div>
          <div class="btn">
            <Button
              type="info"
              @click="modal11 = false"
              style="margin-right: 20px"
              >取消</Button
            >
            <!-- <div slot="footer" style="text-align: center">
            <Button type="warning" @click="auditVisibleReson=false">取消</Button>
            <Button type="success" @click="confirmResonBatch">确认</Button>
          </div> -->
            <Button type="primary" @click="confirmResonBatch">确认</Button>
            <!-- <Button type="primary" @click="userBanSave">保存</Button> -->
          </div>
        </div>
      </div>
    </Modal>
    <!-- 上传视频 -->
    <Modal
      style="z-index: 999999"
      v-model="modalVideo"
      @on-cancel="cancelUpload"
    >
      <p slot="header" style="text-align: center">{{ uploadTitle }}</p>
      <Form ref="formInline" :model="uploadVideoForm" style="margin-top: 10px">
        <div style="border-bottom: 1px solid #ccc; margin-bottom: 15px">
          <FormItem label="" prop="video_link">
            <span class="video_name">视频名称:{{ videoUrl }}</span>
            <Upload
              ref="upload"
              :action="fileUrl"
              :before-upload="handleBeforeUpload"
              :show-upload-list="false"
              :on-success="handleSuccess"
              :max-size="512000"
              :headers="header"
              class="mr20"
              style="margin: 1px 0 0 3px; display: inline"
            >
              <Button type="primary" icon="ios-cloud-upload-outline"
                >添加视频</Button
              >
            </Upload>
            <div class="dis_flex">
              <p class="width60">上传中：</p>
              <Progress
                :percent="progress"
                :stroke-width="5"
                v-if="progressDis"
              />
            </div>
            <div v-if="duration"><span>时长：</span>{{duration}}</div>
          </FormItem>
        </div>

        <div class="data_warp_box">
          <div class="uploadVideo">
            <span style="color: red">*</span>视频标题：
            <Input
              :maxlength="100"
              v-model="uploadVideoForm.vedio_title"
              show-word-limit
              type="textarea"
              placeholder="(*最多输入100字)"
              style="width: 200px"
            />
          </div>
          <!-- 裁剪 start-->

          <!-- 裁剪 end -->
          <div class="uploadVideo">
            <span style="color: red">*</span> 视频封面图：
            <Upload
              ref="uploadImg"
              :action="fileUrl"
              :before-upload="handleBeforeUploadImg"
              :show-upload-list="false"
              :on-success="handleSuccess"
              :headers="header"
              class="mr20"
              style="margin: 1px 0 0 3px; display: inline"
            >
              <Icon
                v-if="this.uploadVideoForm.picUrl === ''"
                size="32"
                type="md-cloud-upload"
              />
              <img
                style="width: 100px; height: 100px"
                v-if="this.uploadVideoForm.picUrl !== ''"
                :src="this.uploadVideoForm.picUrl"
              />
              <!-- <Button  v-if="this.uploadVideoForm.picUrl!==''" style="color:red" type="text" @click="delPicClick">删除</Button> -->
            </Upload>
             <a
             v-if="this.uploadVideoForm.picUrl !== ''"
              style="
                margin-top: 80px;
                text-decoration: underline;
                font-size: 14px;
                letter-spacing: 2px;
              "
              type="primary"
              @click="openView"
              >裁剪</a
            >
            <ImgCutter
             v-if="this.uploadVideoForm.picUrl !== ''"
             style="
                margin-top: 80px;
                
                font-size: 14px;
                letter-spacing: 2px;
              "
              :isModal="true"
              ref="imgCutterModal"
              @cutDown="cutDown"
              :crossOrigin="true"
              crossOriginHeader
            >
            <span slot="open" style="color:#008EF0;margin-left:20px;text-decoration: underline;cursor: pointer;cursor: pointer;">更换图片</span>
            </ImgCutter>
          </div>

          <!-- <div class="uploadVideo">
          允许下载：
            <Checkbox
              @on-change="downChange"
              v-model="uploadVideoForm.is_download"
            ></Checkbox>
          </div> -->
          <div class="uploadVideo">
            付费观看：
            <Checkbox
              @on-change="noFreeChange"
              v-model="uploadVideoForm.is_pay"
            ></Checkbox>
          </div>
          <!-- <div class="uploadVideo">
            选择位置：
            <Select
              @on-change="selectAdressChange"
              label-in-value
              :remote-method="remoteMethod1"
              v-model="formInlVideo.city"
              filterable
              style="width: 400px"
            >
              <Option
                style="width: 600px"
                v-for="(item, index) in cityList"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </div> -->
          <div class="uploadVideo">
            <span style="color: red">*</span>视频类型：
            <Tree :data="typeList" ref="tree" multiple show-checkbox></Tree>
          </div>
          <!-- 封面标题 -->
          <div class="uploadVideo textColor">
             <span style="color: red">*</span>封面标题：
             <Input style="width:140px" v-model="uploadCover.cover_title" :maxlength="7" placeholder="最多7个字"></Input>&emsp;
             <span>文字颜色：</span>
             <RadioGroup v-model="uploadCover.title_color">
                <Radio label="白色"></Radio>
                <Radio label="黑色"></Radio>
            </RadioGroup>
          </div>
          <!-- 封面显示集数 -->
           <div class="uploadVideo textColor">
             <span style="color: red">*</span>封面显示集数：
             <Input style="width:140px" v-model="uploadCover.cover_index" @on-keyup="numberBlur(uploadCover.coverNum)" number placeholder="只允许输入数字"></Input>&emsp;
             <span>文字颜色：</span>
             <RadioGroup v-model="uploadCover.index_color">
                <Radio label="白色"></Radio>
                <Radio label="黑色"></Radio>
            </RadioGroup>
          </div>
          <div class="uploadVideo" v-if="payDisplay">
            <span style="color: red">*</span>免费观看时间：
            <Input
              Number
              @on-blur="limitTimeBlur"
              style="width: 50px"
              v-model="limit_time1"
              placeholder=""
            />&emsp; <span class="timeHour">分</span>&emsp;
            <Input
              Number
              style="width: 50px"
              v-model="limit_time2"
            />&emsp;<span class="timeHour">秒</span>
          </div>
          <div class="uploadVideo" v-if="payDisplay">
            <span style="color: red">*</span>需支付的钻石：
            <Input
              Number
              style="width: 100px"
              v-model="uploadVideoForm.vedio_price"
              placeholder=""
            />
            <!-- 平台在支付的宣士忠收取X%服务费，您将获得XX钻石 -->
          </div>
          <div class="in_video">
            <!-- <video class="video_in" ref="video11" :src='uploadVideoForm.vedio_url'  controls object-fit=fill
           > </video> -->
           <video style="display:none"  @canplay="getDuration" ref="video" :src="uploadVideoForm.vedio_url" controls="controls" autoplay="false" height="720px"></video>
          </div>
        </div>
      </Form>
      <div slot="footer">
        <Button
          :disabled="disabledUploadBtn"
          type="primary"
          size="large"
          @click="confirmUpload"
          >上传</Button
        >
      </div>
    </Modal>
    <!-- 裁剪图片弹框 -->
    <Modal v-model="modalCrop" :closable="false" width="800">
      <p slot="header" style="text-align: center; cursor: pointer">图片裁剪</p>
      <div class="rc-cropper-canvas">
        <Col>
          <canvas id="pic"></canvas>
          <Button
            size="small"
            @click="cropImg()"
            class="rc-crop__iconCropCanvas"
            >裁剪</Button
          >
        </Col>
        <Col >
          <canvas :id="'pic' + 'after'"></canvas>
        </Col>
      </div>
    </Modal>
    <!-- 作品弹框 -->
    <Modal v-model="modal12" fullscreen footer-hide title="">
      <p
        slot="header"
        style="text-align: left; cursor: pointer"
        @click="modal12 = false"
      >
        <Icon type="md-arrow-round-back" /> 返回
      </p>
      <!-- 搜索 -->
      <div class="wors">
        <Form :model="worksForm" :label-width="80">
          <Row>
            <Col span="2">
              <Button
                @click="batchDelClick"
                type="error"
                style="margin-right: 10px"
                >批量删除</Button
              >
            </Col>
            <!-- 上架下架功能去掉，增加批量删除 -->
            <!-- <Col span="3">
              <Button
                type="success"
                @click="allTurnOffBtn(0)"
                style="margin-right: 10px"
                >下架</Button
              >
              <Button type="success" @click="allTurnOffBtn(1)">上架</Button>
            </Col> -->
            <Col span="2">
              <Button
                @click="isFristClass"
                type="primary"
                style="margin-right: 10px"
                >上传视频</Button
              >
            </Col>
            <Col span="4">
              <FormItem label="视频标题：">
                <Input
                  type="text"
                  v-model="worksForm['k:vedio_title']"
                  placeholder="请输入视频标题"
                />
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem label="视频ID：">
                <Input
                  type="text"
                  v-model="worksForm['e:vedio_id']"
                  placeholder="请输入视频ID"
                />
              </FormItem>
            </Col>
            <!-- 上架下架功能改为删除 -->
            <!-- <Col span="4">
              <FormItem label="状态：">
                <Select v-model="worksForm['e:is_show']" style="width: 100px">
                  <Option
                    v-for="item in statusList"
                    :value="item.value"
                    :key="item.value"
                    >{{ item.label }}</Option
                  >
                </Select>
              </FormItem>
            </Col> -->
            <Col span="4">
              <FormItem label="排序：">
                <Select v-model="worksForm['o:vedio_id']" style="width: 100px">
                  <Option
                    v-for="item in sortList"
                    :value="item.value"
                    :key="item.value"
                    >{{ item.label }}</Option
                  >
                </Select>
              </FormItem>
            </Col>
            <Button type="primary" @click="workSearchBtn">搜索</Button>
          </Row>
        </Form>
      </div>
      <!-- 表格 -->
      <Table
        @on-select-all="handleSelectAll"
        @on-select="handleSelectSelf"
        ref="selection"
        :columns="columnsWorks"
        :data="dataWorks"
        border
      >
        <!-- 视频封面 -->
        <template slot-scope="{ row, index }" slot="vedio_cover">
          <viewer>
            <img style="width: 40px; height: 40px" :src="row.vedio_cover" />
          </viewer>
        </template>
        <!-- 是否为付费视频 -->
        <template slot-scope="{ row, index }" slot="is_pay">
          <span v-if="row.is_pay === 0">否</span>
          <span v-if="row.is_pay === 1">是</span>
        </template>
        <!-- 下架上架需求改为删除1124 -->
        <!-- <template slot-scope="{ row, index }" slot="is_show">
          <span v-if="row.is_show === 0">已下架</span>
          <span v-if="row.is_show === 1">已上架</span>
        </template> -->
        <!-- 下架上架状态修改为审核状态 -->
        <template slot-scope="{ row, index }" slot="is_show">
          <span v-if="row.status === 0">待审核</span>
          <span v-if="row.status === 1">已通过</span>
          <span v-if="row.status === 2">未通过</span>
        </template>
        <!-- 发布时间 -->
        <template slot-scope="{ row, index }" slot="add_time">
          {{ row.add_time === 0 ? "暂无数据" : row.add_time }}
        </template>
        <template slot-scope="{ row, index }" slot="classify">
          <div style="text-align: left" v-html="row.category_str">
            {{ row.category_str }}
          </div>
          <!-- <Button type="text" style="color: #008ef0" @click="workSortClick(row)"
            >查看</Button
          > -->
        </template>
        <!-- 操作 -->
        <template slot-scope="{ row, index }" slot="action">
          <a type="primary" @click="priviewBtn(row)" style="margin-right: 10px"
            >预览</a
          >
          <Divider type="vertical" />
          <a type="primary" @click="editWorkBtn(row)" style="margin-right: 10px"
            >编辑</a
          >
          <Divider type="vertical" />
          <a
            @click="singleDelClick(row)"
            type="error"
            style="margin-right: 10px"
            >删除</a
          >
          <!-- <Divider type="vertical" />
          <a
            v-if="row.is_show === 1"
            type="primary"
            @click="soldOutBtn(row)"
            >下架</a
          >
          <a
            v-if="row.is_show === 0"
            type="primary"
            @click="soldpushBtn(row)"
            >上架</a
          > -->
        </template>
      </Table>
      <!-- 分页 -->
      <div class="page">
        <Page
          :total="totalWork"
          :current.sync="workPage.page"
          show-elevator
          show-sizer
          show-total
          @on-change="pageChange2"
          @on-page-size-change="pageSizeChange2"
          :page-size="workPage.limit"
        />
      </div>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Modal>
    <!-- 作品查看视频分类弹框 -->
    <Modal v-model="modalSort" :closable="false">
      <p slot="header" style="text-align: center; cursor: pointer">
        查看视频分类
      </p>
      <div>
        <div style="display: flex">
          视频分类： <Tree :data="treeData"></Tree>
        </div>
      </div>
    </Modal>
    <!-- 作品预览弹框 -->
    <Modal v-model="modalpreview" :closable="false" :mask-closable="false">
      <!-- <vueMiniPlayer ref="vueMiniPlayer" :video="videow" :mutex="true" @fullscreen="handleFullscreen" /> -->
      <video-player
        v-if="flagVideo"
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions"
      >
      </video-player>
      <span v-if="!flagVideo">暂无视频播放哦~</span>
      <!-- <iframe :src="modalpreview?videoSrc:''" scrolling="no" style="width:500px;height:500px" allowfullscreen="true"></iframe> -->
      <div slot="footer" style="text-align: center">
        <Button type="primary" size="large" @click="closePreview">关闭</Button>
      </div>
    </Modal>
    <!-- 钻石明细弹框 -->
    <Modal v-model="modal13" fullscreen footer-hide title="">
      <p
        slot="header"
        style="text-align: left; cursor: pointer"
        @click="modal13 = false"
      >
        <Icon type="md-arrow-round-back" /> 返回
      </p>
      <div class="diamond">
        <p class="title">钻石明细</p>
        <Row>
          <Col span="5"
            >用户ID：<span>{{ payForm.uid }}</span></Col
          >
          <Col span="5"
            >用户昵称：<span>{{ payForm.nickname }}</span></Col
          >
        </Row>
        <Row>
          <Col span="10"
            >手机号：<span>{{ payForm.phone }}</span></Col
          >
        </Row>
        <Row>
          <Col span="5"
            >钻石数量：<span>{{ payForm.now_money }}</span
            >&emsp;<Button type="primary" @click="payJewelBtn"
              >充值</Button
            ></Col
          >
        </Row>
        <p class="title">明细表</p>
        <Table
          class="diamondTable"
          :columns="columndetails"
          :data="dataDetail"
          border
        >
           <template slot-scope="{ row, index }" slot="num_money">
            {{ row.money }}
          </template>
        </Table>
        <!-- 分页 -->
        <div style="margin-top: 40px">
          <Page
            :total="totaldiamond"
            :current.sync="diamondPage.page"
            show-elevator
            show-sizer
            show-total
            :page-size-opts="[5, 10, 20]"
            @on-change="pageChange3"
            @on-page-size-change="pageSizeChange3"
            :page-size="diamondPage.limit"
          />
        </div>
      </div>
    </Modal>
    <!-- 充值弹框 -->
    <Modal v-model="modalPay" :closable="false" width="440">
      <p slot="header" style="text-align: center; cursor: pointer">钻石充值</p>
      <div class="cardPay">
        <div
          v-for="(item, index) in equipList"
          :key="index"
          style="
            text-align: center;
            width: 98px;
            height: 100px;
            display: inline-block;
            margin: 8px;
            color: #333;
            padding: 16px 5px;
            border: 1px solid #ccc;
            border-radius: 6px;
          "
          @click="switchTag(index, item)"
          :class="current === index ? 'active1' : ''"
        >
          <div
            class="recharge"
            @click="switchTag(index)"
            :style="{ color: current === index ? '#fff' : '' }"
          >
            <p style="margin-top: 10px; margin-bottom: 2px">
              ￥{{ item.price }}
            </p>
            <div>钻石{{ Number(item.give_money) }}</div>
          </div>
        </div>
      </div>
      <p style="margin: 20px 0 20px 20px">
        您已选择为用户
        <span style="color: #008ef0">“{{ user }}”</span>选择充值金额
        <span style="color: #008ef0">{{ money ? money : 0 }}元</span>
      </p>
      <p slot="footer" style="display: flex; justify-content: space-between">
        <Button type="info" @click="modalPay = false">取消充值</Button>
        <Button
          v-auth="['zsButton-recharge']"
          type="primary"
          @click="confirmRechargeBtn"
          >确认充值</Button
        >
      </p>
    </Modal>
    <!-- 会员明细弹框 -->
    <Modal v-model="modalVipUserVisble" fullscreen footer-hide title="">
      <p
        slot="header"
        style="text-align: left; cursor: pointer"
        @click="modalVipUserVisble = false"
      >
        <Icon type="md-arrow-round-back" /> 返回
      </p>
      <div class="diamond">
        <p class="title">会员明细</p>
        <Row>
          <Col span="5"
            >用户ID：<span>{{ vipUserForm.uid }}</span></Col
          >
          <Col span="5"
            >用户昵称：<span>{{ vipUserForm.nickname }}</span></Col
          >
        </Row>
        <Row>
          <Col span="10"
            >手机号：<span>{{ vipUserForm.phone }}</span></Col
          >
        </Row>
        <Row>
          <Col span="10"
            >会员到期时间：<span>{{ vipUserForm.vip_end_time }}</span
            >&emsp;<Button type="primary" @click="payJewelVipBtn"
              >充值</Button
            ></Col
          >
        </Row>
        <p class="title">明细表</p>
        <Table
          class="diamondTableVip"
          :columns="VipdetailsCloums"
          :data="dataVip"
          border
        >
          <template slot-scope="{ row, index }" slot="pay_type">
            <span v-if="row.pay_type === 0">后台充值</span>
            <span v-if="row.pay_type === 1">钻石</span>
            <span v-if="row.pay_type === 2">微信</span>
            <span v-if="row.pay_type === 3">支付宝</span>
          </template>
          <!-- <template slot-scope="{ row, index }" slot="viptype">
            <span v-if="row.viptype === 2">7天会员</span>
            <span v-if="row.viptype === 3">1个月会员</span>
            <span v-if="row.viptype === 4">3个月会员</span>
            <span v-if="row.viptype === 5">12个月会员</span>
          </template> -->
        </Table>
        <!-- 分页 -->
        <div style="margin-top: 40px">
          <Page
            :total="totalVipTable"
            :current.sync="vipPage.page"
            show-elevator
            show-sizer
            show-total
            :page-size-opts="[5, 10, 20]"
            @on-change="pageChange4"
            @on-page-size-change="pageSizeChange4"
            :page-size="vipPage.limit"
          />
        </div>
      </div>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Modal>
    <!-- 会员明细充值弹框 -->
    <Modal v-model="modalPayVip" :closable="false" width="440">
      <p slot="header" style="text-align: center; cursor: pointer">会员充值</p>
      <div class="cardPay">
        <div
          v-for="(item, index) in vipRechargeLis"
          :key="index"
          style="
            text-align: center;
            width: 98px;
            display: inline-block;
            margin: 0 28px 20px 0;
          "
          @click="switchTag2(index, item)"
          :class="current2 === index ? 'active2' : ''"
        >
          <div
            style="
              color: #333;
              background: #fff;
              padding: 24px 5px;
              margin-bottom: 9px;
              border: 1px solid #ccc;
            "
          >
            <div style="margin-bottom: 6px; font-weight: 550; font-size: 16px">
              {{ item.long }}{{ units[item.unit] }}
            </div>
            <del style="color: #949394">￥{{ item.old_price }}</del>
          </div>
          <div
            @click="switchTag2(index)"
            :style="{
              fontSize: '15px',
              fontWeight: '500',
              color: current2 === index ? '#fff' : 'black',
            }"
          >
            ￥{{ item.now_price }}元
          </div>
        </div>
      </div>
      <p style="margin: 20px 0 20px 20px">
        您已选择为用户
        <span style="color: #008ef0">“{{ userVip }}”</span>选择充值金额
        <span style="color: #008ef0">{{ moneyVip ? moneyVip : 0 }}元</span>
      </p>
      <p slot="footer" style="display: flex; justify-content: space-between">
        <Button type="info" @click="modalPayVip = false">取消充值</Button>
        <Button
          v-auth="['vipButton-recharge']"
          type="primary"
          @click="confirmuserVipBtn"
          >确认充值</Button
        >
      </p>
    </Modal>
    <!-- 选定视频一级分类弹框 -->
    <Modal v-model="fristTagModal" :closable="false" width="440">
      <p slot="header" style="text-align: center; cursor: pointer">标签</p>

      <div class="cardPay" style="height: 150px">
        <Checkbox-group v-model="socialBindData">
          <Checkbox :label="item.id" v-for="item in socialList" :key="item.id">
            <Icon :key="item.id"></Icon>
            <span>{{ item.title }}</span>
          </Checkbox>
        </Checkbox-group>
      </div>
      <p>
        <Tag color="#e76000" style="color: #e76000" type="dot"
          >小贴士：视频类型选择1级最多三个，二级最多3个</Tag
        >
      </p>
      <p slot="footer" style="display: flex; justify-content: space-between">
        <Button type="info" @click="fristTagModal = false">取消</Button>
        <Button
          v-auth="['vipButton-recharge']"
          type="primary"
          @click="confirmClass"
          >确认</Button
        >
      </p>
    </Modal>
    <!-- 邀请明细弹框 -->
    <Modal
      v-model="modalInvite"
      :mask-closable="false"
      :closable="false"
      width="600"
    >
      <p slot="header" style="text-align: center">邀请明细</p>
      <div style="margin-bottom: 30px">
        <span style="margin-right: 80px">累计邀请人数：{{ inviteCount }}</span>
        <span>累计获得钻石：{{total_money}}</span>
      </div>
      <Button
        @click="BenefitClick(1)"
        :type="BenefitFlag === 1 ? 'primary' : 'default'"
        style="margin-bottom: 10px"
        >邀请人数明细</Button
      >
      <Button
        @click="BenefitClick(2)"
        :type="BenefitFlag === 2 ? 'primary' : 'default'"
        style="margin-bottom: 10px; margin-left: 15px"
        >充值收益明细</Button
      >
      <div style="height: 300px; overflow-y: auto; overflow-x: hidden">
        <Table
          border
          :columns="BenefitFlag === 1 ? inviteColumns : inviteBenefitColumns"
          :data="inviteData"
        >
          <!-- 邀请用户 -->
          <template slot-scope="{ row, index }" slot="nickname">
            <p>{{ row.u_nickname }}</p>
            <p>{{ row.u_phone }}</p>
          </template>
          <!-- 收益类型 typeBenefit-->
          <template slot-scope="{ row, index }" slot="typeBenefit">
            <span v-if="row.type === 6">邀请注册收益</span>
            <span v-if="row.type === 7">充值钻石收益</span>
            <span v-if="row.type === 8">充值会员收益</span>
          </template>
          <!-- 收益邀请用户 -->
          <template slot-scope="{ row, index }" slot="u_nickname">
            <p>{{ row.u_nickname }}</p>
            <p>{{ row.u_phone }}</p>
          </template>
          <!-- 邀请明细奖励钻石 -->
           <template slot-scope="{ row, index }" slot="money7">
            <p>{{ row.money *100 }}</p>
          </template>
          <!-- 充值收益明细奖励钻石 -->
           <template slot-scope="{ row, index }" slot="money8">
            <p>{{ row.money *100 }}</p>
          </template>
        </Table>
      </div>
      <p slot="footer" style="text-align: center">
        <Button type="primary" @click="closeInviteClick"> 关闭</Button>
      </p>
      <!-- 分页 -->
      <div style="margin-top: 20px">
        <Page
          :total="inviteCount"
          :current.sync="InviteFrom.page"
          show-elevator
          show-sizer
          show-total
          @on-change="inviteChange"
          @on-page-size-change="inviteSizeChange"
          :page-size="InviteFrom.limit"
        />
      </div>
      <!-- 用户头像 -->
      <template slot-scope="{ row, index }" slot="avatar">
        <viewer>
          <img style="width: 40px; height: 40px" :src="row.avatar" />
        </viewer>
      </template>
        <Spin size="large" fix v-if="spinShow2"></Spin>
    </Modal>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import ImgCutter from "vue-img-cutter";
import "videojs-contrib-hls";
import { videoPlayer } from "vue-video-player";
import "video.js/dist/video-js.css";
import uploadPictures from "@/components/uploadPictures";
import Setting from "@/setting";
import { getCookies } from "@/libs/util";
import { userList } from "@/api/user";
import { videoTypeListApi } from "@/api/setting";
import { rechargeRecordlApi } from "@/api/finance";
import { formatDate } from "@/common/date.js";
import axios from "axios";
import {
  userBanApi,
  userMoneyApi,
  userWorksApi,
  turnoffWorksApi,
  relieveUserApi,
  diamondApi,
  diamondRechargeApi,
  userAdressApi,
  uoloadVedioApi,
  userWorksCopyApi,
  vipTableApi,
  vipTableMsgApi,
  uservipApi,
  videoSortApi,
  editUserVedioCate,
  rechargeBenefitApi,
  rechargeBenefitSApi,
  bannedApi,
} from "@/api/user";
import { videoAuditReasonApi } from "@/api/audit";
import { productGetTempKeysApi } from "@/api/product";
export default {
  components: { uploadPictures, videoPlayer,ImgCutter },
  // name: "cropper-canvas",
  // props: {
  //   data: {
  //     type: Object,
  //     default: () => {},
  //   },
  // },
  data() {
    return {
      spinShow2:false,
      duration:"",//视频时长
      uploadCover:{
        cover_title:"",//封面标题
        title_color:"白色",//封面颜色
        cover_index:null,//封面集数
        index_color:"白色",//集数颜色
      },//封面标题封面集数
    
      modalCrop: false, //图片裁剪
      // 裁剪组件的基础配置option

      // 防止重复提交
      loading: false,
      disabledUploadBtn: false, //上传视频禁止按钮
      refuseVlue: "", //拒绝原因
      definedValue: false,
      refuseForm: {
        "u:check_reason": "",
      }, //拒绝表单
      backList: [], //禁用理由
      flagVideo: true,
      // videow: {
      //       url: 'http://yun-live.oss-cn-shanghai.aliyuncs.com/record/yunlive/record/yunlive/meeting_1070/2020-11-25-09-27-59_2020-11-25-09-35-52.m3u8',
      //       cover: '',
      //       muted: false,
      //       loop: false,
      //       preload: 'auto',
      //       poster: '',
      //       volume: 1,
      //       autoplay: false
      //   },
      inviteID: "", //邀请明细id
      inviteCount: 0, //累计邀请人数
      //判断视频是否有一级分类
      fristClass: "",
      //一级分类弹框
      fristTagModal: false,
      //一级分类数据
      socialBindData: [],
      socialList: [],
      price: "",
      treeData: [
        {
          expand: true,
          title: "parent 1",
          children: [
            {
              title: "parent 1-0",
              expand: true,
              children: [
                {
                  title: "1-0-1",
                },
                {
                  title: "1-0-2",
                },
              ],
            },
            {
              title: "parent 1-1",
              expand: true,
              children: [
                {
                  title: "1-1-1",
                },
              ],
            },
          ],
        },
      ],
      isVideoFlag: 3,
      videoUrl: "",
      ossID: "",
      sortLookData: [], //查看视频分类
      oneSortLook: [], //一级查看视频分类
      payDisplay: false,
      longVip: "",
      unitVip: "",
      vipType: "",
      batchDelID: [], //批量删除ID
      progress: 50, //上传视频进度条
      progressDis: false,
      files: [],
      filesImg: [],
      file: [],
      fileImg: [],
      uploadTitle: "", //上传视频标题
      // getPicD: "",
      tableIndex: 0,
      gridPic: {
        xl: 6,
        lg: 8,
        md: 12,
        sm: 12,
        xs: 12,
      },
      gridBtn: {
        xl: 4,
        lg: 8,
        md: 8,
        sm: 8,
        xs: 8,
      },
      isChoice: "",
      modalPic: false,
      progress2: false,
      flagUplod: true,
      videoLink: "",
      progress: 89, // 进度条默认0
      upload: {
        videoIng: false, // 是否显示进度条；
      },
      formValidate: {
        image: "",
        type: "",
        video_link: "",
      },
      fileUrl: Setting.apiBaseURL + "/file/upload/multipleSliceFile",
      firstUrl: Setting.apiFirstURL,
      formInlVideo: {
        city: "", //位置
      },
      limit_time1: 1, //免费观看时间
      limit_time2: 0,

      // 上传视频表单
      uploadVideoForm: {
        vedio_url: "", //视频地址
        picUrl: "", //视频封面
        vedio_title: "", //视频标题
        // is_download: 0, //是否允许下载
        address: "", //地址
        lat: "", //地点
        lng: "", //地点
        province: "", //地点
        city: "", //地点
        district: "", //地点
        site: "", //地点
        category: [], //视频分类Id
        is_pay: 0, //是否需要付费
        limit_time: "", //免费观看时长（秒）
        vedio_price: "", //支付钻石数
      },
      header: {},
      formatImg: ["jpg", "jpeg", "png", "bmp", "gif"],
      formatVoice: ["mp3", "wma", "wav", "amr", "mp4"],
      diamondUid: "", //分页器传的用户ID
      diamondVipUid: "",
      user: "",
      money: "",
      userVip: "",
      moneyVip: "",
      give_money: "",
      current: "",
      current2: "",
      typeList: [],
      cityList: [],
      equipList: [
        { name: 1, number: 2 },
        { name: 1, number: 2 },
        { name: 1, number: 2 },
        { name: 1, number: 2 },
        { name: 1, number: 2 },
        { name: 1, number: 2 },
        // { name: 1, number: 2 },
      ],
      spinShow: true,
      columnsShow: 1,
      uidArrId: [], //多选ID
      uidArrIds: "",
      workUid: "", //作品uid
      modalpreview: false, //作品预览
      //作品
      worksForm: {
        "k:vedio_title": "", //视频简介
        "e:vedio_id": "", //视频ID
        "o:vedio_id": "DESC",
      },
      //作品状态
      statusList: [
        {
          value: 0,
          label: "下架",
        },
        {
          value: 1,
          label: "上架",
        },
      ],
      //排序
      sortList: [
        {
          value: "DESC",
          label: "降序",
        },
        {
          value: "ASC",
          label: "升序",
        },
      ],
      modalInvite: false, //邀请明细弹框
      modalVideo: false, //上传视频弹框
      modal11: false, //管理弹框
      modal12: false, //作品弹框
      modalSort: false, //视频分类查看弹框
      modal13: false, //钻石明细弹框
      modalVipUserVisble: false, //会员明细弹框
      modalPayVip: false, //会员明细充值弹框
      modalPay: false, //钻石充值弹框
      payForm: {}, //充值弹框表单
      vipUserForm: {}, //huoyuan
      total: 0,
      totalWork: 0, //作品分页
      totaldiamond: 0, //钻石明细
      totalVipTable: 0, //会员明细
      vipRechargeLis: [], //会员充值信息列表
      units: {
        year: "年",
        month: "个月",
        day: "天",
        hour: "小时",
        minute: "分钟",
        second: "秒",
      }, //会员充值单位
      showTime: false, //封禁
      //管理表单
      manageForm: {},
      //分页参数
      exchangeFrom: {
        page: 1,
        limit: 10,
      },
      //邀请明细分页
      InviteFrom: {
        page: 1,
        limit: 10,
      },
      total_money: 0, //累计钻石
      BenefitFlag: 1, //邀请明细按钮
      workPage: {
        page: 1,
        limit: 10,
      },
      //作品明细
      diamondPage: {
        page: 1,
        limit: 5,
      },
      //会员明细
      vipPage: {
        page: 1,
        limit: 5,
      },
      searchForm: {
        status: 1, //用户状态
        blocked_day: "", //封禁秒数
        "k:nickname": "", //用户昵称
        "e:uid": "", //用户ID
        "e:phone": "", //手机号码
      },
      //用户状态
      userStatus: [
        {
          value: 1,
          label: "正常用户",
        },
        {
          value: 0,
          label: "封禁用户",
        },
      ],
      //是否传过视频状态
      userisViseo: [
        {
          value: 1,
          label: "是",
        },
        {
          value: 0,
          label: "否",
        },
      ],
      // 封禁时长
      timeList: [
        {
          value: 1,
          label: "7天",
        },
        {
          value: 2,
          label: "14天",
        },
        {
          value: 3,
          label: "永久",
        },
      ],
      //管理封禁操作
      refuseForm: {
        uid: "",
        closure_time: "", //天数
        closure_reasons: "", //原因
      },
      //正常用户表格
      manageColumns: [
        {
          width: 60,
          title: "序号",
          type: "index",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 100,
          title: "用户昵称",
          key: "nickname",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 80,
          title: "用户ID",
          key: "uid",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 100,
          title: "手机号",
          key: "phone",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 80,
          title: "钻石数量",
          key: "now_money",
          align: "center",
          className: "table-head-style",
        },
        {
          minWidth: 100,
          title: "用户签名",
          key: "autograph",
          render: (h, params) => {
            if (!params.row.autograph) return h("span", "暂无签名");
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
                    domProps: { title: params.row.autograph },
                    on: {
                      click: (e) => {
                        e.stopPropagation();
                      },
                    },
                  },
                  params.row.autograph
                ),
              ]);
            }
          },

          align: "center",
          className: "table-head-style",
        },
        {
          width: 100,
          title: "用户头像",
          key: "avatar",
          slot: "avatar",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 80,
          title: "上级用户id",
          key: "spread_uid",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 160,
          title: "登陆时间",
          sortable: true,
          sortType: "desc",
          key: "last_time",
          align: "center",
          className: "table-head-style",
          render: (h, params) => {
            return h(
              "div",
              formatDate(
                new Date(params.row.last_time * 1000),
                "yyyy-MM-dd hh:mm:ss"
              )
              // Date是后台时间戳参数字段
              // 'yyyy-MM-dd hh:mm' 对应的时间格式 2018-12-21 18:46
              // 格式可以自行修改，例如 'yyyy-MM-dd' -> 2018-12-21,  'yyyy-MM' -> 2018-12
            );
          },
        },
        {
          width: 160,
          title: "注册时间",
          sortable: true,
          sortType: "desc",
          key: "create_time",
          slot: "add_time",
          align: "center",
          className: "table-head-style",
          render: (h, params) => {
            return h(
              "div",
              formatDate(
                new Date(params.row.add_time * 1000),
                "yyyy-MM-dd hh:mm:ss"
              )
              // Date是后台时间戳参数字段
              // 'yyyy-MM-dd hh:mm' 对应的时间格式 2018-12-21 18:46
              // 格式可以自行修改，例如 'yyyy-MM-dd' -> 2018-12-21,  'yyyy-MM' -> 2018-12
            );
          },
        },
        {
          width: 80,
          title: "邀请明细",
          slot: "inviteDetail",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 180,
          title: "操作",
          slot: "action",
          fixed: "right",
          align: "center",
          className: "table-head-style",
        },
      ],
      //封禁用户表格
      manageColumns2: [
        {
          width: 60,
          title: "序号",
          type: "index",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "用户昵称",
          key: "nickname",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "ID",
          key: "uid",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "手机号",
          key: "phone",
          align: "center",
          className: "table-head-style",
        },

        {
          title: "用户签名",
          key: "autograph",
          align: "center",
          className: "table-head-style",
          render: (h, params) => {
            if (!params.row.autograph) return h("span", "暂无签名");
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
                    domProps: { title: params.row.autograph },
                    on: {
                      click: (e) => {
                        e.stopPropagation();
                      },
                    },
                  },
                  params.row.autograph
                ),
              ]);
            }
          },
        },
        {
          title: "用户头像",
          key: "avatar",
          slot: "avatar",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "封禁原因",
          key: "closure_reasons",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "封禁开始",
          key: "blocked_time",
          align: "center",
          className: "table-head-style",
          render: (h, params) => {
            return h(
              "div",
              formatDate(
                new Date(params.row.blocked_time * 1000),
                "yyyy-MM-dd hh:mm:ss"
              )
              // Date是后台时间戳参数字段
              // 'yyyy-MM-dd hh:mm' 对应的时间格式 2018-12-21 18:46
              // 格式可以自行修改，例如 'yyyy-MM-dd' -> 2018-12-21,  'yyyy-MM' -> 2018-12
            );
          },
        },
        {
          width: 160,
          title: "解封时间",
          key: "blocked_end_time",
          align: "center",
          className: "table-head-style",
          render: (h, params) => {
            return h(
              "div",
              formatDate(
                new Date(params.row.blocked_end_time * 1000),
                "yyyy-MM-dd hh:mm:ss"
              )
              // Date是后台时间戳参数字段
              // 'yyyy-MM-dd hh:mm' 对应的时间格式 2018-12-21 18:46
              // 格式可以自行修改，例如 'yyyy-MM-dd' -> 2018-12-21,  'yyyy-MM' -> 2018-12
            );
          },
        },
        {
          width: 230,
          title: "操作",
          slot: "action2",
          fixed: "right",
          align: "center",
          className: "table-head-style",
        },
      ],
      manageData: [],
      //弹框表格
      columnsWorks: [
        {
          width: 60,
          type: "selection",
          width: 60,
          align: "center",
          className: "table-head-style",
        },
        {
          width: 80,
          title: "视频ID",
          key: "vedio_id",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 100,
          title: "是否为付费视频",
          key: "is_pay",
          slot: "is_pay",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 100,
          title: "视频标题",
          key: "vedio_title",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 80,
          title: "视频封面",
          key: "vedio_cover",
          slot: "vedio_cover",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 200,
          title: "发布时间",
          key: "add_time",
          align: "center",
          slot: "add_time",
          className: "table-head-style",
          render: (h, params) => {
            return h(
              "div",
              formatDate(
                new Date(params.row.add_time * 1000),
                "yyyy-MM-dd hh:mm:ss"
              )
              // Date是后台时间戳参数字段
              // 'yyyy-MM-dd hh:mm' 对应的时间格式 2018-12-21 18:46
              // 格式可以自行修改，例如 'yyyy-MM-dd' -> 2018-12-21,  'yyyy-MM' -> 2018-12
            );
          },
        },
        {
          minWidth: 200,
          title: "视频分类",
          key: "category_str",
          slot: "classify",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 130,
          title: "视频收入/钻石",
          key: "pay_total",
          align: "center",
          className: "table-head-style",
        },
        // {
        //   title: "推送人数",
        //   key: "",
        //   align: "center",
        //   className: "table-head-style",
        // },
        // {
        //   title: "有效观看人数",
        //   key: "",
        //   align: "center",
        //   className: "table-head-style",
        // },
        // {
        //   title: "喜欢人数",
        //   key: "",
        //   align: "center",
        //   className: "table-head-style",
        // },
        // {
        //   title: "评论人数",
        //   key: "",
        //   align: "center",
        //   className: "table-head-style",
        // },
        // {
        //   title: "评论条数",
        //   key: "",
        //   align: "center",
        //   className: "table-head-style",
        // },
        {
          width: 100,
          title: "作品状态",
          key: "status",
          slot: "is_show",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 180,
          title: "操作",
          slot: "action",
          fixed: "right",
          key: "nickname",
          align: "center",
          className: "table-head-style",
        },
      ],
      dataWorks: [],
      //明细表格
      columndetails: [
        {
          title: "序号",
          type: "index",
          width: 60,
          align: "center",
          className: "table-head-style",
        },
        {
          title: "时间",
          key: "create_time",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "类型",
          key: "remark",
          align: "center",
          className: "table-head-style",
        },
        {
          slot: "num_money",
          title: "数量变动",
          key: "money",
          align: "center",
          className: "table-head-style",
        },
      ],
      dataDetail: [],
      //会员明细表格
      VipdetailsCloums: [
        {
          title: "序号",
          type: "index",
          width: 60,
          align: "center",
          className: "table-head-style",
        },
        {
          width: 160,
          title: "购买时间",
          key: "create_time",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 160,
          title: "支付方式",
          key: "pay_type",
          slot: "pay_type",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 160,
          title: "购买类型",
          key: "remark",
          align: "center",
          className: "table-head-style",
        },
        {
          width: 160,
          title: "会员到期时间",
          key: "vip_end_time",
          align: "center",
          className: "table-head-style",
          render: (h, params) => {
            if (params.row.vip_end_time==0) return h("span", "不是会员");
            else{
                return h(
              "div",
              formatDate(
                new Date(params.row.vip_end_time * 1000),
                "yyyy-MM-dd hh:mm:ss"
              )
              // Date是后台时间戳参数字段
              // 'yyyy-MM-dd hh:mm' 对应的时间格式 2018-12-21 18:46
              // 格式可以自行修改，例如 'yyyy-MM-dd' -> 2018-12-21,  'yyyy-MM' -> 2018-12
            );
            }
            
          },
        },
      ],
      //查看邀请明细表格
      inviteData: [],
      inviteColumns: [
        {
          title: "邀请用户",
          slot: "u_nickname",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "注册时间",
          key: "create_time",
          align: "center",
          className: "table-head-style",
          //  render: (h, params) => {
          //   return h(
          //     "div",
          //     formatDate(
          //       new Date(params.row.add_time * 1000),
          //       "yyyy-MM-dd hh:mm:ss"
          //     )
          //     // Date是后台时间戳参数字段
          //     // 'yyyy-MM-dd hh:mm' 对应的时间格式 2018-12-21 18:46
          //     // 格式可以自行修改，例如 'yyyy-MM-dd' -> 2018-12-21,  'yyyy-MM' -> 2018-12
          //   );
          // },
        },
        {
          title: "奖励钻石",
          key: "money",
          slot:"money7",
          align: "center",
          className: "table-head-style",
        },
      ],
      inviteBenefitColumns: [
        {
          title: "邀请用户",
          slot: "u_nickname",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "充值类型",
          slot: "typeBenefit",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "充值金额",
          key: "r_money",
          align: "center",
          className: "table-head-style",
        },
        {
          title: "奖励时间",
          key: "create_time",
          align: "center",
          className: "table-head-style",
          //  render: (h, params) => {
          //   return h(
          //     "div",
          //     formatDate(
          //       new Date(params.row.add_time * 1000),
          //       "yyyy-MM-dd hh:mm:ss"
          //     )
          //     // Date是后台时间戳参数字段
          //     // 'yyyy-MM-dd hh:mm' 对应的时间格式 2018-12-21 18:46
          //     // 格式可以自行修改，例如 'yyyy-MM-dd' -> 2018-12-21,  'yyyy-MM' -> 2018-12
          //   );
          // },
        },
        {
          title: "奖励钻石",
          key: "money",
          slot:"money8",
          align: "center",
          className: "table-head-style",
        },
      ],
      dataVip: [],
      //视频
      //视频
      videoSrc: "",
      playerOptions: {
        // playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        controls: true, //是否显示控制条
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "1:1", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            // type: "application/x-mpegURL", // 类型
            src: "", // url地址
          },
        ],
        poster: "", // 封面地址
        notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true, // 是否显示全屏按钮
        },
      },
    };
  },
  created() {
    // this.option.img = "http://121.43.230.79:10002/2021-12-22/cb28b69ddf1e44f292eaf08294df81c5.jpeg"
    this.firstUrl = Setting.apiFirstURL;
    // console.log( Setting.apiFirstURL,' Setting.apiFirstURL');
    this.getUserList(); //用户列表
    // this.getAdressData();
    this.getVideoTypeData();
    this.getBannedList(); //获取封禁理由
    // console.log(this.playerOptions,'notSupportedMessage');
    if (this.playerOptions.sources[0].src === "") {
      this.flagVideo = false;
    } else {
      this.flagVideo = true;
    }
  },

  mounted() {
    this.getToken();
    this.drawImg();
  },
  computed: {
    $videow() {
      return this.$refs.vueMiniPlayer.$video;
    },
  },
  methods: {
    time_to_sec(time) {
    if (time !== null) {
      var s = "";
      var hour = time.split(":")[0];
      var min = time.split(":")[1];
      var sec = time.split(":")[2];
      s = Number(hour * 3600) + Number(min * 60) + Number(sec);
      return s;
    }
},
    //图片裁剪start
    drawImg() {
      this.$nextTick(() => {
        let canvas = document.getElementById("pic");
        if (canvas) {
          canvas.width = 460;
          canvas.height = 460;
          let ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          let img = new Image();
          img.crossOrigin = "Anonymous";
          img.src =
            "https://fanyi-cdn.cdn.bcebos.com/static/translation/img/header/logo_e835568.png";
          img.onload = function () {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          };
        }
      });
    },
    cropImg() {
      let canvas = document.getElementById("pic");
      let ctx = canvas.getContext("2d");
      let img = new Image();
      img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src =
        "https://fanyi-cdn.cdn.bcebos.com/static/translation/img/header/logo_e835568.png";
      let drag = true; // 是否拖动矩形
      let flag = true; // 是否绘制矩形
      let rectWidth = 0; // 绘制矩形的宽
      let rectHeight = 0; // 绘制矩形的高
      let clickX = 0; // 矩形开始绘制X坐标
      let clickY = 0; // 矩形开始绘制Y坐标
      let dragX = 0; // 当要拖动矩形点击时X坐标
      let dragY = 0; // 当要拖动矩形点击时Y坐标
      let newRectX = 0; // 拖动变化后矩形开始绘制的X坐标
      let newRectY = 0; // 拖动变化后矩形开始绘制的Y坐标
      // 鼠标按下
      canvas.onmousedown = (e) => {
        ctx.beginPath();
        ctx.setLineDash([6, 6]);
        ctx.moveTo(newRectX, newRectY);
        ctx.lineTo(newRectX + rectWidth, newRectY);
        ctx.lineTo(newRectX + rectWidth, newRectY + rectHeight);
        ctx.lineTo(newRectX, newRectY + rectHeight);
        ctx.lineTo(newRectX, newRectY);
        ctx.strokeStyle = "green";
        ctx.stroke();
        if (ctx.isPointInPath(e.offsetX, e.offsetY)) {
          drag = true;
          dragX = e.offsetX;
          dragY = e.offsetY;
          clickX = newRectX;
          clickY = newRectY;
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          flag = true;
          clickX = e.offsetX;
          clickY = e.offsetY;
          newRectX = e.offsetX;
          newRectY = e.offsetY;
        }
      };
      // 鼠标抬起
      canvas.onmouseup = () => {
        if (flag) {
          flag = false;
          this.sureCrop(clickX, clickY, rectWidth, rectHeight);
        }
        if (drag) {
          drag = false;
          this.sureCrop(newRectX, newRectY, rectWidth, rectHeight);
        }
      };
      // 鼠标移动
      canvas.onmousemove = (e) => {
        if (flag) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          rectWidth = e.offsetX - clickX;
          rectHeight = e.offsetY - clickY;
          ctx.beginPath();
          ctx.strokeStyle = "#FF0000";
          ctx.strokeRect(clickX, clickY, rectWidth, rectHeight);
          ctx.closePath();
        }
        if (drag) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          ctx.beginPath();
          newRectX = clickX + e.offsetX - dragX;
          newRectY = clickY + e.offsetY - dragY;
          ctx.strokeStyle = "yellow";
          ctx.strokeRect(newRectX, newRectY, rectWidth, rectHeight);
          ctx.closePath();
        }
      };
    },
    sureCrop(x, y, width, height) {
      let canvas = document.getElementById("pic" + "after");
      // 设置canvas的宽为canvas的父元素宽度，宽高比3:2
      let parentEle = canvas.parentElement;
      canvas.width = parentEle.offsetWidth;
      canvas.height = (2 * parentEle.offsetWidth) / 3;
      let ctx = canvas.getContext("2d");
      let img = new Image();
      img.src =
        "https://fanyi-cdn.cdn.bcebos.com/static/translation/img/header/logo_e835568.png";
      img.onload = function () {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.clip();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      ctx.stroke();
    },
    //图片裁剪end

    closePreview() {
      if( this.flagVideo ==true){
        this.$refs.videoPlayer.player.pause(); // 暂停
      }
      this.modalpreview = false;
    },
    handleFullscreen() {},
    /**.............. 获取视频第一帧接口1210.................... */
    getVideoFirst(url) {
      axios({
        url: this.firstUrl + `/vedio/cover`,
        method: "post",
        headers: {
          "Authori-zation": "Bearer " + getCookies("token"),
          // "Content-Type": "multipart/form-data",
        },
        //参数
        data: {
          url: url,
          frame: 1,
        },
      }).then((res) => {
        this.uploadVideoForm.picUrl =Setting.url( res.data.data.url);
        this.$forceUpdate();
        if (this.uploadVideoForm.picUrl) {
          this.disabledUploadBtn = false;
        }
        // console.log(this.uploadVideoForm.picUrl,'this.uploadVideoForm.picUrl');
        // console.log(res.data.data.url,'res');
      });
    },
    /**..............视频上传修改 start.................... */
    isFristClass() {
      if (this.fristClass) {
        this.uploadVideo();
      } else {
        this.uploadTitle = "上传视频";
        this.fristTagModal = true;
      }
    },
    confirmClass() {
      this.typeList = [];
      if (this.socialBindData.length <= 0) {
        this.$Message.warning("请选择视频类型");
        return;
      }
      if (this.socialBindData.length > 3) {
        return this.$Message.warning("客户端最多选择三个类型哦！");
      }
      // console.log(this.socialList,'this.socialBindData ');
      this.fristTagModal = false;
      this.modalVideo = true;
      let testList = this.socialList.filter(
        (item) => item.is_show == 1 && item.children
      ); //过滤掉没有二级的二级标签
      // console.log(testList,'testList');
      testList.forEach((item) => {
        if (this.socialBindData.includes(item.id)) {
          this.typeList.push(item);
        }
      });
      let cate = this.socialBindData.toString();
      editUserVedioCate({ "e:uid": this.workUid, "u:vedio_cate": cate })
        .then((res) => {
          this.getUserList(); //用户列表
          this.fristClass = this.socialBindData.toString();
        })
        .catch((err) => {
          this.$Message.error(err.msg);
        });
    },
    /**..............end............................ */
    getToken() {
      this.header["Authori-zation"] = "Bearer " + getCookies("token");
    },
    handleSuccess(res) {},
   
    handleBeforeUpload(file) {
      this.progress = 0
      this.disabledUploadBtn = true;
      this.progressDis = true;
      this.file.push(file);
      // if (this.file.length > 1) {
      //   this.progress = 0;
      // }

      // console.log(this.file.length, "查找");
      let formData = new FormData();
      for (var i = 0; i < this.file.length; i++) {
        // that.file[i].name = that.file[i].name.replace('.mp4','.m3u8')
        formData.append("file[]", this.file[this.file.length - 1]); // 文件对象
      }

      // console.log(formData.getAll("file[]").length,'lengh');

      this.files = formData;
      this.progress = 90
      // console.log(this.files.getAll("file[]"), "formData0909");
      // console.log([this.files.getAll("file[]")[this.files.getAll("file[]").length-1]], "formData0909");
      axios({
        url: Setting.apiBaseURL + `/file/upload/multipleSliceFile`,
        method: "post",
        headers: {
          "Authori-zation": "Bearer " + getCookies("token"),
          "Content-Type": "multipart/form-data",
        },
        //参数
        data: this.files,
      }).then((res) => {
        if (res.data.status === 400) {
          this.$Message.warning(res.data.data.message);
        } else {
          this.videoUrl = file.name;
          this.uploadVideoForm.vedio_url = Setting.url(res.data.data.url) ;
          this.ossID = res.data.data.id;
          if (res.data.data.url) {
            this.progress = 100;
            this.getVideoFirst(Setting.url(res.data.data.url));
          }
        }
      });
      return false;
    },

    handleBeforeUploadImg(file) {
      let that = this;
      that.fileImg.push(file);
      // console.log(that.file.length, "查找");
      let formData = new FormData();
      for (var i = 0; i < that.fileImg.length; i++) {
        // that.file[i].name = that.file[i].name.replace('.mp4','.m3u8')
        formData.append("file[]", that.fileImg[i]); // 文件对象
      }

      console.log(formData.getAll("file[]"),'lengh');
      that.filesImg = formData;
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
          this.uploadVideoForm.picUrl =res.data.data.url;
          this.uploadVideoForm.picUrl =Setting.url(this.uploadVideoForm.picUrl)                       
          console.log("视频在元数据加载完成时得到的视频时长", this.$refs.video11.duration )
        }
      });
      return false;
    },
    //删除视频封面
    delPicClick() {
      this.fileImg = [];
      this.uploadVideoForm.picUrl = "";
    },
    //获取用户列表
    getUserList() {
      let time = Date.parse(this.$moment().format("YYYY-MM-DD")) / 1000;
      let datS = this.searchForm.blocked_day
        ? this.searchForm.blocked_day * 24 * 60 * 60
        : "";
      if (this.searchForm.status === 1) {
        userList({
          ...this.exchangeFrom,
          ...this.searchForm,
          "d:blocked_end_time": time,
          is_vedio: this.isVideoFlag === 3 ? "" : this.isVideoFlag,
        }).then((res) => {
          this.manageData = res.data.list;
          this.manageData.forEach(item=>{
           item.avatar = Setting.url(item.avatar);
          })
          this.total = res.data.count;
          this.spinShow = false;
        });
      } else if (this.searchForm.status === 0) {
        // let time = Date.parse(this.$moment().format("YYYY-MM-DD")) / 1000
        userList({
          ...this.exchangeFrom,
          ...this.searchForm,
          "X:blocked_end_time": time,
          blocked_day: datS,
          is_vedio: this.isVideoFlag,
        }).then((res) => {
          this.manageData = res.data.list;
          this.total = res.data.count;
          this.spinShow = false;
        });
      }
    },

    //获取会员明细表格
    getVipTableLis(uid) {
      this.spinShow = true;
      vipTableApi({
        ...this.vipPage,
        "e:uid": uid,
        "o:id": "DESC",
      }).then((res) => {
        this.totalVipTable = res.data.count;
        this.dataVip = res.data.list;
        this.spinShow = false;
      });
    },
    //获取会员充值会员信息
    getVipRechargeMsg() {
      this.spinShow = true;
      vipTableMsgApi({
        status: 1,
        gid: 75,
      })
        .then((res) => {
          this.vipRechargeLis = res.data.list;
          this.spinShow = false;
        })
        .catch((err) => {});
    },
    //获取地址
    getAdressData() {
      userAdressApi({
        keyword: this.formInlVideo.kayWords
          ? this.formInlVideo.kayWords
          : "重庆",
      }).then((res) => {
        this.cityList = res.data.map((item, index) => {
          return {
            value: item.id,
            label: item.address + item.title,
            lat: item.location.lat,
            lng: item.location.lng,
            // location: item.location,//经纬度
            address: item.address, //地址
            province: item.province, //省
            city: item.city, //市
            district: item.district, //区
            site: item.title,
          };
        });
      });
    },
    //获取视频类型
    async getVideoTypeData() {
      this.typeList = [];
      const res = await videoTypeListApi();
      let list = res.data.filter((item) => item.is_show == 1); //过滤掉已停用的视频类型
      if (this.fristClass) {
        // 如果有一级分类直接渲染
        let arr = this.fristClass.split(",");
        list.forEach((item) => {
          if (arr.includes(String(item.id))) {
            this.typeList.push(item);
          }
        });
        this.typeList = this.typeList.filter(
          (item) => item.is_show == 1 && item.children
        );
        if (this.modalVideo) {
          // console.log(this.typeList, "====123");
        }
      } else {
        // 提取一级分类标签
        this.socialList = list;
      }
    },
    //获取视频分类
    getVideoSortLis(row) {
      videoSortApi({
        category: row.category,
        // vedio_id:row.vedio_id
      }).then((res) => {
        this.treeData = this.filterData(res.data);
        // console.log( this.treeData ,' this.treeData ');
        // var arrNew = this.treeData.map(i=>{
        //     return{
        //       title:i.title,
        //       childen:i.children.length!==0&&(i.children.forEach((item,index)=>{
        //         return item
        //       }))
        //     }
        // })
        // console.log(arrNew,'arrNew');
      });
    },
    //处理数据
    filterData(data) {
      return Object.entries(data).map((val) => {
        return {
          expand: false,
          title: val[0],
          children: typeof val[1] === "object" ? this.filterData(val[1]) : [],
        };
      });
    },
    handleRemove(i) {
      this.images.splice(i, 1);
      this.formValidate.slider_image.splice(i, 1);
    },
    //清空
    cancelUpload() {
      this.modalVideo = false;
      this.uploadVideoForm = {
        vedio_url: "", //视频地址
        picUrl: "", //视频封面
        vedio_title: "", //视频标题
        // is_download: 0, //是否允许下载
        address: "", //地址
        lat: "", //地点
        lng: "", //地点
        province: "", //地点
        city: "", //地点
        district: "", //地点
        site: "", //地点
        category: [], //视频分类Id
        is_pay: 0, //是否需要付费
        limit_time: "", //免费观看时长（秒）
        vedio_price: "", //支付钻石数
      };
      this.progress = 0;
      this.progressDis = false;
      this.videoUrl = "";
    },

    //上传视频
    uploadVideo() {
      this.uploadTitle = "上传视频";
      this.modalVideo = true;
      this.getVideoTypeData();
    },

    // 根据秒数转换成对应的时分秒
    getHMS(time) {
      const hour =
        parseInt(time / 3600) < 10
          ? "0" + parseInt(time / 3600)
          : parseInt(time / 3600);
      const min =
        parseInt((time % 3600) / 60) < 10
          ? "0" + parseInt((time % 3600) / 60)
          : parseInt((time % 3600) / 60);
      const sec =
        parseInt((time % 3600) % 60) < 10
          ? "0" + parseInt((time % 3600) % 60)
          : parseInt((time % 3600) % 60);
      return hour + ":" + min + ":" + sec;
    },
    // 编辑视频
    // 编辑视频
    async editWorkBtn(row) {
      console.log(row,'rowa');
      this.uploadTitle = "编辑视频";
      await this.getVideoTypeData();

      // const typeIds = Object.keys(JSON.parse(row.category)).map((i) =>
      //   Number(i)
      // ); //视频分类idS
      // // console.log(typeIds);
      // this.typeList.forEach((i) => {
      //   typeIds.includes(i.id) && this.$set(i, "checked", true);
      // });
      // console.log(this.typeList, "list--");

      // 全部选中项
      const checkIds = Object.values(JSON.parse(row.category));
      //删除一级
      checkIds.forEach((v) => {
        delete v.par;
      });
      //二级选中项id
      const list = checkIds
        .map((v) => Object.values(v))
        .reduce((pre, next) => {
          return pre.concat(next);
        }, []);

      console.log(list);
      //赋值选中项
      this.typeList.forEach((i) => {
        if (i.children) {
          i.children.forEach((v) => {
            list.includes(v.id) && this.$set(v, "checked", true);
          });
        }
      });

      this.vid = row.vedio_id;
      this.modalVideo = true;
      this.uploadVideoForm = JSON.parse(JSON.stringify(row));
      this.uploadCover = {...row}
      this.uploadCover.title_color = row.title_color==="ffffff"?"白色":"黑色"
        this.uploadCover.index_color = row.index_color==="ffffff"?"白色":"黑色"
      this.uploadVideoForm.is_download = row.is_download == 1 ? true : false;
      this.uploadVideoForm.is_pay = row.is_pay == 1 ? true : false;
      this.limit_time1 = this.getHMS(row.limit_time).split(":")[1];
      this.limit_time2 = this.getHMS(row.limit_time).split(":")[2];
      // console.log(this.getHMS(row.limit_time).split(":"), "olool");
      // this.formValidate.image = row.vedio_cover;
      this.uploadVideoForm.picUrl = JSON.parse(JSON.stringify(Setting.url(row.vedio_cover)));
      this.formInlVideo.city = row.address;
    },

    //确认上传视频表单
    confirmUpload() {
      /* start */
      const checkList = JSON.parse(
        JSON.stringify(this.$refs.tree.getCheckedAndIndeterminateNodes())
      ); //选中项
      const allCheckIds = checkList.map((v) => v.id); //选中项id
      //checkOnes:一级选中项 并添加属性num
      const checkOnes = checkList
        ? checkList
            .filter((v) => v.children)
            .map((v) => Object.assign(v, { num: 0 }))
        : [];
      checkOnes.forEach((v) => {
        v.children.forEach((i) => {
          if (allCheckIds.includes(i.id)) {
            v.num += 1;
          }
        });
      });
      // console.log(checkOnes);
      const state = checkOnes.some((v) => v.num > 3);
      if (state) return this.$Message.warning("每项二级标签最多选三个!");
      /* end */

      let arr = this.$refs.tree.getCheckedNodes();

      let idsCatera = {};
      this.$refs.tree.getCheckedNodes().forEach((item, index) => {
        if (item.pid === 0) {
          idsCatera[item.id] = { par: item.id };
        }
      });
      // console.log(idsCatera,'idsCatera');
      this.$refs.tree.getCheckedNodes().forEach((item, index) => {
        if (item.pid !== 0) {
          if (!idsCatera[item.pid]) {
            idsCatera[item.pid] = { par: item.pid };
          }
          idsCatera[item.pid][Object.keys(idsCatera[item.pid]).length] =
            item.id;
        }
      });
      //  console.log(idsCatera,'idsCatera2');
      let categoryids = JSON.stringify(idsCatera);
      // console.log(categoryids ,'对象');
      let valArr = [];
      for (let i = 0; i < arr.length; i++) {
        valArr.push(arr[i].id);
      }
      this.uploadVideoForm.category = valArr.toString();
      this.uploadVideoForm.limit_time =
        this.limit_time1 * 60 + parseInt(this.limit_time2);
      let category = "," + this.uploadVideoForm.category + ",";
      if (this.uploadVideoForm.vedio_url == "") {
        return this.$Message.warning("请上传视频地址！");
      }
      if (this.uploadVideoForm.vedio_title == "") {
        return this.$Message.warning("请上传视频标题！");
      }
      if (this.uploadVideoForm.picUrl == "") {
        return this.$Message.warning("请上传视频封面！");
      }
      if (this.uploadVideoForm.category == "") {
        return this.$Message.warning("请选择视频类型！");
      }
      // 封面标题
       if (this.uploadCover.cover_title == "") {
        return this.$Message.warning("请输入封面标题！");
      }
      //封面集数
       if (this.uploadCover.cover_index == null) {
        return this.$Message.warning("请输入封面显示集数！");
      }
      if (this.uploadVideoForm.is_pay) {
        if (this.uploadVideoForm.vedio_price == "") {
          return this.$Message.warning("请输入需要支付的钻石数！");
        }
      }
      let coverColor1 = this.uploadCover.title_color==="白色"?"ffffff":"000000"
       let coverColor2 = this.uploadCover.index_color==="白色"?"ffffff":"000000"
      let videoSS = this.time_to_sec(this.duration)
      if (this.uploadTitle === "上传视频") {
        uoloadVedioApi({
          uid: this.workUid,
          vedio_url: this.uploadVideoForm.vedio_url,
          vedio_title: this.uploadVideoForm.vedio_title,
          java_oss_id: this.ossID,
          // is_download: this.uploadVideoForm.is_download,
          address: this.uploadVideoForm.address,
          lat: this.uploadVideoForm.lat,
          lng: this.uploadVideoForm.lng,
          province: this.uploadVideoForm.province,
          city: this.uploadVideoForm.city,
          district: this.uploadVideoForm.district,
          site: this.uploadVideoForm.site,
          is_pay: this.uploadVideoForm.is_pay,
          limit_time: this.uploadVideoForm.limit_time,
          vedio_price: this.uploadVideoForm.vedio_price,
          category: categoryids,
          vedio_cover: this.uploadVideoForm.picUrl,
          cover_title:this.uploadCover.cover_title,
          cover_index:this.uploadCover.cover_title,
          title_color:coverColor1,
          index_color:coverColor2,
          vedio_time:videoSS
        })
          .then((res) => {
            this.$Message.success(res.msg);
            this.getWorkList(this.workUid);
            this.getUserList();
            this.modalVideo = false;
            this.uploadVideoForm = {
              vedio_url: "", //视频地址
              picUrl: "", //视频封面
              vedio_title: "", //视频标题
              is_download: 0, //是否允许下载
              address: "", //地址
              lat: "", //地点
              lng: "", //地点
              province: "", //地点
              city: "", //地点
              district: "", //地点
              site: "", //地点
              category: [4, 7, 8], //视频分类Id
              is_pay: 0, //是否需要付费
              limit_time: "", //免费观看时长（秒）
              vedio_price: "", //支付钻石数
            };
             this.duration = "",//视频时长
             this.uploadCover={
              cover_title:"",//封面标题
              title_color:"白色",//封面颜色
              cover_index:null,//封面集数
              index_color:"白色",//集数颜色
            }//封
            this.videoUrl = "";
            this.progressDis = false;
            this.file = [];
            this.ossID = "";
            this.progress = 0;
          })
          .catch((err) => {
            this.$Message.warning(err.msg);
          });
      } else if (this.uploadTitle === "编辑视频") {
        uoloadVedioApi({
          vid: this.vid,
          vedio_url: this.uploadVideoForm.vedio_url,
          vedio_title: this.uploadVideoForm.vedio_title,
          is_download: this.uploadVideoForm.is_download,
          address: this.uploadVideoForm.address,
          lat: this.uploadVideoForm.lat,
          lng: this.uploadVideoForm.lng,
          province: this.uploadVideoForm.province,
          city: this.uploadVideoForm.city,
          district: this.uploadVideoForm.district,
          site: this.uploadVideoForm.site,
          is_pay: this.uploadVideoForm.is_pay,
          limit_time: this.uploadVideoForm.limit_time,
          vedio_price: this.uploadVideoForm.vedio_price,
          category: categoryids,
          vedio_cover: this.uploadVideoForm.picUrl,
           cover_title:this.uploadCover.cover_title,
          cover_index:this.uploadCover.cover_title,
          title_color:coverColor1,
          index_color:coverColor2,
          vedio_time:videoSS
        })
          .then((res) => {
            this.$Message.success(res.msg);

            this.getWorkList(this.workUid);
            this.modalVideo = false;
            this.uploadVideoForm = {
              vedio_url: "", //视频地址
              vedio_title: "", //视频标题
              is_download: 0, //是否允许下载
              address: "", //地址
              lat: "", //地点
              lng: "", //地点
              province: "", //地点
              city: "", //地点
              district: "", //地点
              site: "", //地点
              category: [], //视频分类Id
              is_pay: 0, //是否需要付费
              limit_time: "", //免费观看时长（秒）
              vedio_price: "", //支付钻石数
            };
            this.duration = "",//视频时长
             this.uploadCover={
              cover_title:"",//封面标题
              title_color:"白色",//封面颜色
              cover_index:null,//封面集数
              index_color:"白色",//集数颜色
            }//封面标题封面集数

          })
          .catch((err) => {
            this.$Message.warning(err.msg);
          });
      }
    },
    //获取作品列表
    getWorkList(uid) {
      this.spinShow = true;
      userWorksCopyApi({
        "e:is_del": 0,
        "e:uid": uid,
        "e:status":1,
        ...this.workPage,
        ...this.worksForm,
      }).then((res) => {
        this.dataWorks = res.data.list;
        this.dataWorks.forEach(item=>{
          item.vedio_cover = Setting.url(item.vedio_cover)
        })
        this.totalWork = res.data.count;
        this.spinShow = false;
      });
    },
    //合集管理
    compilationsBtn(row){
      this.$router.push(`collectionManage?row=${row.uid}`)
    },
    //查看作品分类
    workSortClick(row) {
      //取第一位s
      this.getVideoSortLis(row);
      this.modalSort = true;
      // console.log(row,'row作品分类');
    },
    //获取钻石明细表格数据
    getdiamondTable(uid) {
      rechargeRecordlApi({
        ...this.diamondPage,
        "e_m:uid": uid,
      }).then((res) => {
        this.dataDetail = res.data.list;
        this.totaldiamond = res.data.count;
      });
    },

    //获取钻石充值数据
    getdiamondData() {
      diamondApi().then((res) => {
        this.equipList = res.data;
      });
    },
    //搜索
    searchFormBtn() {
      this.spinShow = true;
      this.exchangeFrom = {
        page: 1,
        limit: 10,
      };
      this.getUserList();
    },
    //重置
    clearFormBtn() {
      this.spinShow = true;
      this.exchangeFrom = {
        page: 1,
        limit: 10,
      };
      this.searchForm = {
        status: 1, //用户状态
        blocked_day: "", //封禁秒数
        "k:nickname": "", //用户昵称
        "e:uid": "", //用户ID
        "e:phone": "", //手机号码
      };
      this.isVideoFlag = 3;
      this.showTime = false;
      this.columnsShow = 1;
      this.getUserList();
    },
    //是否上传过视频change事件
    isVideoChange(e) {
      this.searchForm.is_video = e;
    },
    //调取位置接口
    remoteMethod1(value) {
      this.formInlVideo.kayWords = value;
      this.getAdressData();
    },
    //允许下载change事件
    downChange(e) {
      this.uploadVideoForm.is_download = e ? 1 : 0;
    },
    //付费观看change事件
    noFreeChange(e) {
      this.payDisplay = e ? true : false;
      this.uploadVideoForm.is_pay = e ? 1 : 0;
    },
    //视频类型change事件
    typeListChange(e) {
      // console.log(e);
      // console.log(this.uploadVideoForm.category, "多选");
    },
    //选择位置change事件
    selectAdressChange(e) {
      this.formInlVideo.city = e.value;
      this.formInlVideo.kayWords = e.label;
      //参数
      let arr = [];
      arr = this.cityList.filter((item) => {
        return item.value == e.value;
      });
      (this.uploadVideoForm.address = arr[0].address),
        (this.uploadVideoForm.lat = arr[0].lat),
        (this.uploadVideoForm.lng = arr[0].lng),
        (this.uploadVideoForm.province = arr[0].province),
        (this.uploadVideoForm.city = arr[0].city),
        (this.uploadVideoForm.site = arr[0].site),
        (this.uploadVideoForm.district = arr[0].district),
        this.getAdressData();
    },
    //用户状态change事件
    statusChange(e) {
      this.spinShow = true;
      if (e === 1) {
        this.showTime = false;
        this.columnsShow = 1;
      } else if (e === 0) {
        this.columnsShow = 0;
        this.showTime = true;
      }
      this.searchForm.status = e;
      this.getUserList();
    },
    // 免费观看blur事件
    limitTimeBlur() {},
    //封禁时间blur事件
    timeBlur() {
      if (this.refuseForm.closure_time <= 0) {
        this.$Message.warning("封禁时间不能小于等于0哦！");
        this.refuseForm.closure_time = "";
      }
    },
    //获取封禁理由
    getBannedList() {
      bannedApi({
        status: 1,
        gid: 73,
        page: 1,
        limit: 10,
      }).then((res) => {
        this.backList = res.data.list.map((item) => {
          return {
            value: item.id,
            label: item.content,
          };
        });
      });
    },

    // 选择拒绝理由change事件
    refuseChange(e) {
      if (e === "自定义") {
        this.definedValue = true;
      } else {
        this.definedValue = false;
      }
    },
    confirmResonBatch() {
      if (!this.refuseForm.closure_time) {
        return this.$Message.warning("封禁时间不能为空！");
      }
      if (!this.refuseForm["u:check_reason"]) {
        return this.$Message.warning("请选择一个拒绝理由！");
      }
      if (this.refuseForm["u:check_reason"] == "自定义" && !this.refuseVlue) {
        return this.$Message.warning("请输入理由！");
      }
      let closure_timeS = this.refuseForm.closure_time * 24 * 60 * 60;
      let reason =
        this.refuseForm["u:check_reason"] == "自定义"
          ? this.refuseVlue
          : this.refuseForm["u:check_reason"];
      userBanApi({
        uid: this.refuseForm.uid,
        closure_time: closure_timeS,
        closure_reasons: reason,
      })
        .then((res) => {
          this.$Message.success(res.msg);
          this.getUserList();
          this.modal11 = false;
          this.refuseForm = {
            uid: "",
            closure_time: "", //天数
            closure_reasons: "", //原因
          };
          this.refuseVlue = "";
          this.definedValue = false;
        })
        .catch((err) => {
          this.$Message.warning(err.msg);
        });

      // videoAuditReasonApi({
      //   "i:vedio_id": this.batchDelID,
      //   "u:check_reason": reason,
      //   "u:is_del": del,
      //   "u:status": 2,
      // }).then((res) => {
      //   this.$Message.success(res.msg);
      //   this.auditVisibleBatch = false;
      //   this.getVideoList();
      //   this.refuseForm = {
      //     "u:check_reason": "",
      //     "u:is_del": false,
      //   };
      //   this.batchDelID = [];
      //   this.refuseVlue = "";
      // });
    },
    //管理
    manageBtn(row) {
      // console.log(row,'popopopop')
      userMoneyApi(row.uid).then((res) => {
        this.manageForm = { ...row, ...res.data };
        this.manageForm.avatar = Setting.url(this.manageForm.avatar)
        this.manageForm.add_time = formatDate(
          new Date(this.manageForm.add_time * 1000),
          "yyyy-MM-dd hh:mm:ss"
        );
      });
      this.refuseForm.uid = row.uid;
      this.modal11 = true;
    },
    //是否有上传过频频
    isVideoBtn(num) {
      this.isVideoFlag = num;
      this.spinShow = true;
      this.getUserList();
    },
    //作品
    worksBtn(row) {
      this.workUid = row.uid;
      this.getWorkList(row.uid);
      this.modal12 = true;
      //判断用户是否有一级分类
      this.fristClass = row.vedio_cate;
    },
    //钻石明细
    jewelDetailBtn(row) {
      this.user = row.nickname;
      this.diamondUid = row.uid;
      this.payForm = row;
      this.getdiamondTable(row.uid);
      this.getdiamondData();
      this.modal13 = true;
    },
    //会员明细
    jewelVipBtn(row) {
      this.userVip = row.nickname;
      this.diamondVipUid = row.uid;
      this.vipUserForm = { ...row };
      this.vipUserForm.vip_end_time = this.vipUserForm.vip_end_time===0?'不是会员':formatDate(
        new Date(this.vipUserForm.vip_end_time * 1000),
        "yyyy-MM-dd hh:mm:ss"
      );
      this.getVipTableLis(row.uid);
      this.modalVipUserVisble = true;
    },
    //获取邀请明细表格数据
    getInviteData(uid) {
      this.spinShow2 = true
      rechargeBenefitApi({
        ...this.InviteFrom,
        "e:m:uid": uid,
        "e:m:type": 6,
      }).then((res) => {
        this.inviteCount = res.data.count;
        this.total_money = (res.data.total_money*100).toFixed(2);
        this.inviteData = res.data.list;
         this.spinShow2 = false
      });
    },
    //关闭弹框
    closeInviteClick() {
      this.modalInvite = false;
      this.BenefitFlag = 1;
    },
    //获取收益明细
    getInviteBenefitData(uid) {
       this.spinShow2 = true
      rechargeBenefitSApi({
        ...this.InviteFrom,
        "e:m:uid": uid,
        "i:m:type": [7, 8],
      }).then((res) => {
        this.inviteCount = res.data.count;
        this.total_money = (res.data.total_money*100).toFixed(2);
        this.inviteData = res.data.list;
         this.spinShow2 = false
      });
    },
    BenefitClick(num) {
      this.BenefitFlag = num;
      this.InviteFrom.page = 1;
      this.InviteFrom.limit = 10;
      this.inviteData = []
      if (this.BenefitFlag === 1) {
        this.getInviteData(this.inviteID);
        // this.InviteFrom.page = 1
        // this.InviteFrom.limit = 10
      } else {
        this.InviteFrom.page = 1;
        this.getInviteBenefitData(this.inviteID);
        // this.InviteFrom.page = 1
        // this.InviteFrom.limit = 10
      }
    },
    //邀请明细
    inviteDetail(row) {
      this.inviteID = row.uid;
      this.getInviteBenefitData(row.uid);
      this.getInviteData(row.uid);
      this.modalInvite = true;
    },

    switchTag(index, item) {
      // this.price = item.price;
      this.money = item.price;
      this.give_money = item.give_money;
      this.current = index;
    },
    switchTag2(index, item) {
      this.current2 = index;
      this.longVip = item.long;
      this.unitVip = item.unit;
      this.vipType = item.viptype;
      this.moneyVip = item.now_price;
    },
    //充值
    payJewelBtn() {
      this.modalPay = true;
    },
    payJewelVipBtn() {
      this.getVipRechargeMsg();
      this.modalPayVip = true;
    },
    //钻石明细确认充值
    confirmRechargeBtn() {
      diamondRechargeApi(this.diamondUid, {
        money_status: 1,
        money: Number(this.give_money),
        // give_money: Number(this.give_money),
        integration_status: 1,
        integration: 0,
      })
        .then((res) => {
          this.$Message.success(res.msg);
          this.modalPay = false;
          this.modal13 = false;
          this.getUserList();
        })
        .catch((err) => {
          this.$$Message.warning(err.msg);
        });
    },
    //会员充值确认
    confirmuserVipBtn() {
      uservipApi({
        uid: this.diamondVipUid,
        long: this.longVip,
        unit: this.unitVip,
        viptype: this.vipType,
      })
        .then((res) => {
          this.$Message.success(res.msg);
          this.modalPayVip = false;
          this.modalVipUserVisble = false;
          this.getUserList();
        })
        .catch((err) => {
          this.$$Message.warning(err.msg);
        });
    },
    //返回
    back() {
      this.modal11 = false;
    },

    // 保存封禁
    userBanSave() {
      if (this.refuseForm.closure_time === "") {
        return this.$Message.warning("封禁时间不能为空！");
      } else if (this.refuseForm.closure_reasons === "") {
        return this.$Message.warning("封禁理由不能为空！");
      } else {
        let closure_timeS = this.refuseForm.closure_time * 24 * 60 * 60;
        userBanApi({
          ...this.refuseForm,
          closure_time: closure_timeS,
        })
          .then((res) => {
            this.$Message.success(res.msg);
            this.getUserList();
            this.modal11 = false;
            this.refuseForm = {
              uid: "",
              closure_time: "", //天数
              closure_reasons: "", //原因
            };
          })
          .catch((err) => {
            this.$Message.warning(err.msg);
          });
      }
    },

    //解除封禁
    relieveBtn(row) {
      this.$Modal.confirm({
        title: `确定要解除用户--${row.nickname}--封禁吗`,
        onOk: () => {
          relieveUserApi(row.uid)
            .then((res) => {
              this.$Message.success(res.msg);
              this.getUserList(); //用户列表
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
    //作品搜索
    workSearchBtn() {
      this.workPage = {
        page: 1,
        limit: 10,
      };
      this.getWorkList(this.workUid); //用户列表
    },
    //全选
    handleSelectSelf(e) {},
    handleSelectAll(e) {},
    //作品预览
    priviewBtn(row) {
      this.videoSrc = row.vedio_url;
      this.playerOptions.sources[0].src = row.vedio_url;
      // console.log(this.playerOptions,'notSupportedMessage');
      if (this.playerOptions.sources[0].src === "") {
        this.flagVideo = false;
      } else {
        this.flagVideo = true;
      }
      this.modalpreview = true;
    },
    //批量删除
    batchDelClick() {
      let arrId = this.$refs.selection.getSelection().map((item, index) => {
        return item.is_pay;
      });
      if (arrId.indexOf(1) > -1) {
        return this.$Message.warning("付费视频不能删除！");
      }
      // console.log(arrId,'arrId');
      this.batchDelID = this.$refs.selection
        .getSelection()
        .map((item, index) => {
          return item.vedio_id;
        });
      if (this.batchDelID.length < 2) {
        return this.$Message.warning("请至少选择2条数据！");
      }
      this.$Modal.confirm({
        title: "确定要删除所选的数据吗？",
        onOk: () => {
          videoAuditReasonApi({
            "u:is_del": 1,
            "i:vedio_id": this.batchDelID,
          }).then((res) => {
            this.$Message.success(res.msg);
            this.getWorkList(this.workUid);
          });
        },
        onCancel: () => {
          this.$Message.info("已取消！");
        },
      });
    },
    //单个删除
    singleDelClick(row) {
      if (row.is_pay === 1) {
        return this.$Message.warning("付费视频不能删除！");
      }
      this.$Modal.confirm({
        title: "确定要删除这条数据吗？",
        onOk: () => {
          videoAuditReasonApi({
            "u:is_del": 1,
            "e:vedio_id": row.vedio_id,
          }).then((res) => {
            this.$Message.success(res.msg);
            this.getWorkList(this.workUid);
          });
        },
        onCancel: () => {
          this.$Message.info("已取消！");
        },
      });
    },
    //下架
    soldOutBtn(row) {
      this.$Modal.confirm({
        title: "下架视频",
        content: "<p>确认下架本条视频吗？</p>",
        onOk: () => {
          turnoffWorksApi({
            is_show: 0,
            vedio_id: JSON.stringify(row.vedio_id),
          })
            .then((res) => {
              this.$Message.success(res.msg);
              this.getWorkList(row.uid);
              this.uidArr = [];
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
    //上架
    soldpushBtn(row) {
      this.$Modal.confirm({
        title: "上架视频",
        content: "<p>确认上架本条视频吗？</p>",
        onOk: () => {
          turnoffWorksApi({
            is_show: 1,
            vedio_id: JSON.stringify(row.vedio_id),
          })
            .then((res) => {
              this.$Message.success(res.msg);
              this.getWorkList(row.uid);
              // this.uidArr = []
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
    // 多选下架/上架
    allTurnOffBtn(status) {
      let content = status === 0 ? "下架" : "上架";
      this.uidArrId = this.$refs.selection.getSelection().map((item) => {
        return item.vedio_id;
      });
      if (this.uidArrId.length < 2) {
        return this.$Message.warning("请至少选择两条及以上数据！");
      }
      this.uidArrId = this.uidArrId.toString();
      this.$Modal.confirm({
        content: `确定要${content}您所选的几条数据吗？`,
        onOk: () => {
          turnoffWorksApi({
            vedio_id: this.uidArrId,
            is_show: status,
          })
            .then((res) => {
              this.$Message.success(res.msg);
              this.getWorkList(this.workUid); //用户列表
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
      this.getUserList(); //用户列表
    },
    pageSizeChange(index) {
      this.exchangeFrom.limit = index;
      this.getUserList(); //用户列表
    },
    pageChange2(index) {
      this.workPage.page = index;
      this.getWorkList(this.workUid); //用户列表
    },
    pageSizeChange2(index) {
      this.workPage.limit = index;
      this.getWorkList(this.workUid); //用户列表
    },
    pageChange3(index) {
      this.diamondPage.page = index;
      this.getdiamondTable(this.diamondUid); //钻石明细
    },
    pageSizeChange3(index) {
      this.diamondPage.limit = index;
      this.getdiamondTable(this.diamondUid); //钻石明细
    },
    //会员明细

    pageChange4(index) {
      this.vipPage.page = index;
      this.getVipTableLis(this.diamondVipUid);
    },
    pageSizeChange4(index) {
      this.vipPage.limit = index;
      this.getVipTableLis(this.diamondVipUid);
    },
    //邀请明细
    inviteChange(index) {
      this.InviteFrom.page = index;
      if (this.BenefitFlag === 1) {
        this.getInviteData(this.inviteID);
      } else {
        this.getInviteBenefitData(this.inviteID);
      }
    },
    inviteSizeChange(index) {
      this.InviteFrom.limit = index;
      if (this.BenefitFlag === 1) {
        this.getInviteData(this.inviteID);
      } else {
        this.getInviteBenefitData(this.inviteID);
      }
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
          this.uploadVideoForm.picUrl = res.data.data.url;
          console.log(this.uploadVideoForm.picUrl, "cut.picUrl");
        }
      });
    },
    // 传入name，src name中必须包含后缀名
    openView() {
      // this.cutModel = true
      // 传入name，src name中必须包含后缀名
      // https://img0.baidu.com/it/u=1745397029,2362331324&fm=15&fmt=auto
      this.$refs.imgCutterModal.handleOpen({
        name: "image.jpg",
        src: this.uploadVideoForm.picUrl,
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
         this.uploadVideoForm.picUrl = res.data.data.url;
          console.log(this.uploadVideoForm.picUrl, "this.uploadVideoForm.picUrl");
        }
      });
    },
    numberBlur(){
      this.uploadCover.coverNum=this.uploadCover.coverNum.replace(/\D/g,'')
    },
    metadata(e) {
    console.log("s视频源文件尊卑",e)
    console.log("视频在元数据加载完成时得到的视频时长", this.$refs.video.duration )
   },
   getDuration() {
                let s = this.$refs.video.duration; //获取视频的总时长
                console.log(s+'=========获取视频的总时长')
                 let hr = parseInt(s / 60 / 60 % 24)
              let min = parseInt(s / 60 % 60)
              let sec = parseInt(s % 60)

              hr = hr > 9 ? hr : '0' + hr
              min = min > 9 ? min : '0' + min
              sec = sec > 9 ? sec : '0' + sec
              this.duration = `${hr}:${min}:${sec}`
            // console.log(`${hr}时${min}分${sec}秒`,'opopop');

            },
  },
  mounted() {
    this.getToken();
    this.uploadList = this.$refs.upload.fileList;
  },
  directives: {
    trigger: {
      inserted(el, binding) {
        // 这里需要在触发前先进行判断，因为上面的 是用v-for循环出来的一个列表，每一项都有v-trigger
        if (el.id === "0") {
          el.click(); // 如果是第一项，则触发点击事件，需要在循环的时候给对应的列表项绑定一个id值
        }
      },
    },
  },
};
</script>

<style scoped>

.textColor{
  display: flex;
  align-items: center;
}
/* // 截图 */
.cropper-content .cropper {
  width: auto;
  height: 300px;
}
.container {
  display: flex;
}
.before {
  width: 100px;
  height: 100px;
  overflow: hidden;
  /* 这个属性可以得到想要的效果 */
}
.img-container {
  height: 400px;
  overflow: hidden;
}
.afterCropper {
  flex: 1;
  margin-left: 20px;
  border: 1px solid salmon;
  text-align: center;
}
.afterCropper img {
  width: 150px;
  margin-top: 30px;
}
.data_warp_box {
  max-height: 300px;
  overflow-y: auto;
}
.video_name {
  border: 1px solid #999;
  padding: 7px;
  border-radius: 4px;
}

.workButtonclass {
  padding: 0 0 10px 0;
  border-bottom: 1px solid #ccc;
  margin-bottom: 15px;
}
.dis_flex {
  display: flex;
}
.width60 {
  width: 60px;
}
.timeHour {
  margin-top: 6px;
}
.uploadVideo {
  display: flex;
  margin-bottom: 20px;
}
.cardPay {
  /* margin-left: 20px; */
  height: 320px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.active1 {
  background-color: #009ed6;
  padding: 3px;
  box-sizing: border-box;
  margin-bottom: 10px;
}
.active2 {
  background-color: #f10000;
  padding: 3px;
  box-sizing: border-box;
  margin-bottom: 10px;
}
.diamondTable {
  width: 500px;
}
.diamondTableVip {
  width: 700px;
}
.ivu-col-span-5,
.ivu-col-span-16,
.ivu-col-span-18,
.ivu-col-span-10 {
  margin-bottom: 16px;
  color: #333;
  font-size: 14px;
}
.user {
  font-size: 18px;
}
.manageVisible,
.wors,
.diamond {
  margin-left: 60px;
}
.title {
  font-size: 15px;
  margin-bottom: 18px;
  color: #333;
  font-weight: 550;
}
.btn {
  display: flex;
  justify-content: left;
  padding: 10px 70px;
}
.btn > button {
  padding: 0 58px;
}
.audit {
  margin: 10px 0 0 0;
}
>>> .ivu-table th.table-head-style {
  background: #f2f2f2 !important;
  color: #333;
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
/deep/.ivu-select-single .ivu-select-selection {
  /* width: 117px; */
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
  /* width: 100px !important; */
}
.page {
  text-align: right;
}
</style>
