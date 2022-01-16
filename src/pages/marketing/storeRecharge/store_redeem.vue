<template>
  <div>
    <!-- 头部搜索 -->
    <div class="header">
      <Form :model="exchangeFrom" :label-width="80">
        <!-- 第一排 -->
        <Row :gutter="24">
          <Col span="6">
            <div class="line">
              <div class="text-left">卡编号</div>
              <Input
                clearable
                class="input"
                v-model="exchangeFrom.cardno"
                :border="false"
                placeholder="请输入充值卡编号"
              />
            </div>
          </Col>
          <Col span="7">
            <div class="line">
              <div class="text-left">金额</div>
              <Input
                number
                clearable
                class="input"
                v-model="exchangeFrom.minmoney"
                placeholder="请输入最小金额"
              />
            </div>
          </Col>
          <Col span="1" class="connect"> — </Col>
          <Col span="6">
            <div class="line">
              <Input
                number
                clearable
                style="border: 1px"
                class="input"
                v-model="exchangeFrom.maxmoney"
                placeholder="请输入最大金额"
                @on-blur="moneyMaxBlur"
              />
            </div>
          </Col>
        </Row>
        <!-- 二排 -->
        <Row :gutter="24">
          <Col span="6">
            <div class="line">
              <div class="text-left">有效期</div>
              <Date-picker
                class="input"
                placement="left-start"
                :value="validDate"
                @on-change="handleChangeValid"
                @on-clear="clearDate"
                format="yyyy-MM-dd"
                type="daterange"
                placeholder="选择日期"
                style="width: 200px"
              ></Date-picker>
            </div>
          </Col>
          <Col span="7">
            <div class="line">
              <div class="text-left">生成期</div>
              <DatePicker
                :value="bornData"
                @on-change="handleChangeBorn"
                class="input"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择时间"
                style="width: 300px; position: relative"
              ></DatePicker>
            </div>
          </Col>
          <Col span="7">
            <div class="line">
              <div class="text-left">批次ID</div>
              <Input
                clearable
                class="input"
                v-model="exchangeFrom.cid"
                :border="false"
                placeholder="请输入批次ID"
              />
            </div>
          </Col>
        </Row>
        <!-- 三排 -->
        <Row :gutter="24">
          <Col span="6">
            <div class="line">
              <div class="text-left">使用状态</div>
              <Select
                :label-in-value="true"
                @on-change="changeUse"
                class="select"
                v-model="exchangeFrom.status"
                clearable
                style="width: 100%"
              >
                <Option
                  v-for="item in useStateList"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</Option
                >
              </Select>
            </div>
          </Col>
          <Col span="6">
            <div class="line">
              <div class="text-left">启用状态</div>
              <Select
                :label-in-value="true"
                @on-change="changeOpen"
                class="select"
                v-model="exchangeFrom.isopen"
                clearable
                style="width: 100%"
              >
                <Option
                  v-for="item in cityList"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</Option
                >
              </Select>
            </div>
          </Col>
        </Row>
      </Form>
      <!-- 头部按钮 -->
      <Row class="search-button">
        <Button type="info" @click="queryList">查询</Button>
        <Button type="info" @click="resetSearch">重置</Button>
        <Button type="info" @click="addCard">新增兑换卡</Button>
        <Button type="info" @click="exportTable">导出</Button>
      </Row>
      <!-- 表格 -->
    </div>
    <div class="table" style="text-align: center; position: relative">
      <Table  ref="selection" border :columns="columns1" :data="data1" :header-cell-style="{background:'#fff',color:'#606266'}">
        <template slot-scope="{ row, index }" slot="actionTime">
          {{ row.start_time | formatDate}}~{{ row.stop_time | formatDate}}
        </template>
        <template slot-scope="{ row, index }" slot="actionMoney">
          <span v-if="row.money !== '0.00'">{{ row.money }}</span>
        </template>
        <!-- <template slot-scope="{ row, index }" slot="actionShop">
          <Tooltip placement="top">
            <span>{{ row.name }}</span>

            <div slot="content">
              <p>商品名称：{{ row.name }}</p>
              <p>商品规格：{{ row.suk }}</p>
            </div>
          </Tooltip>
        </template> -->
        <template slot-scope="{ row, index }" slot="actionType">
          <Tag type="border" color="pink" v-if="row.type == 1">商品</Tag>
          <Tag type="border" color="pink" v-if="row.type == 0">金额</Tag>
        </template>
        <template slot-scope="{ row, index }" slot="action1">
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="instance(row)"
            >{{ row.isopen == 1 ? "启用" : "停用" }}</Button
          >
        </template>
        <template slot-scope="{ row, index }" slot="action2">
          {{ row.status_str }}
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
    <!-- 新增兑换卡 -->
    <Modal v-model="addVisible" @on-cancel="visibleCancel">
      <p slot="header" style="text-align: left">
        <span>新增兑换卡</span>
      </p>
      <Form
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="110"
      >
        <FormItem label="充值卡名称：" prop="name">
          <Input
            v-model="formValidate.name"
            placeholder="请输入充值卡名称"
            style="width: 200px"
          ></Input>
        </FormItem>
        <FormItem label="充值卡数量：" prop="number">
          <Input
            number
            v-model="formValidate.number"
            placeholder="请输入充值卡数量"
            style="width: 200px"
          ></Input>
        </FormItem>
        <FormItem label="使用范围：" prop="range">
          <RadioGroup v-model="range" @on-change="radioChange">
            <Radio label="0">金额</Radio>
            <Radio label="1">商品 </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="兑换商品：" prop="shopping" v-if="this.range == 1">
          <Select
            v-model="formValidate.shopping"
            filterable
            placeholder="请选择商品"
            style="width: 200px"
            @on-change="shopChange"
          >
            <Option v-for="item in products" :value="item.id" :key="item.id">{{
              item.store_name
            }}</Option>
          </Select>
        </FormItem>
        <FormItem label="商品规格：" prop="shopSku" v-if="this.range == 1">
          <Select
            v-model="formValidate.shopSku"
            filterable
            placeholder="请选择商品规格"
            style="width: 200px"
            @on-change="shopSkuChange"
          >
            <Option v-for="(item, index) in list" :value="item" :key="index">{{
              item
            }}</Option>
          </Select>
        </FormItem>
        <FormItem label="充值金额：" prop="money" v-if="this.range == 0">
          <Input
            number
            v-model="formValidate.money"
            placeholder="请输入充值金额"
            style="width: 200px"
          ></Input>
        </FormItem>
        <FormItem label="有效期：" prop="validDateForm">
          <Date-picker
            placement="left-start"
            :value="formValidate.validDateForm"
            @on-change="handleChangeForm"
            format="yyyy-MM-dd"
            type="daterange"
            placeholder="选择日期"
            style="width: 350px"
          ></Date-picker>
        </FormItem>
        <FormItem label="启用状态：" prop="openState">
          <i-switch v-model="formValidate.openState" @on-change="changeStatus">
            <span slot="open">开</span>
            <span slot="close">关</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" :disabled="disabled" @click="handleSubmit('formValidate')"
          >确定</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  reedeemQuery,
  reedeemQueryShop,
  reedeemAddCard,
  reedeemStateEdit,
} from "@/api/redeem";
import {formatTimeToStr} from './date.js';
export default {
  components: {},
  filters: {
   formatDate: function(time) {
        if(time!=null&&time!="")
        {
          var date = new Date(time);
          return formatTimeToStr(date, "yyyy-MM-dd");
        }else{
          return "";
        }
      }
  },
  data() {
    return {
      disabled:false,
      //商品规格数据
      products: [
        // { id: 1, store_name: "diyige" },
        // { id: 2, store_name: "diyi" },
        // { id: 3, store_name: "die" },
      ],
      suks: {
        // 1: ["默认"],
        // 2: ["xl", "xxl"],
        // 3: ["5,红", "5,黄"],
      },
      list: [],
      // radioSelect: 2,
      spinShow: true, //loadding
      validity_time: "", //有效期
      range: "1", //商品名规格选择
      formValidate: {
        validDateForm: [], //有效期
        name: "",
        number: "",
        money: "",
        shopping: "",
        shopSku: "",
        openState: true,
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "请输入充值卡名称",
            trigger: "blur",
          },
        ],
        number: [
          {
            required: true,
            type: "number",
            message: "请输入充值卡数量",
            trigger: "blur",
          },
          {
            type: "number",
            message: "请输入数字格式",
            trigger: "blur",
            transform(value) {
              return Number(value);
            },
          },
        ],
        range: [
          {
            // required: true,
            // message: "请选择使用范围",
            // trigger: "change",
          },
        ],
        shopping: [
          {
            required: true,
            message: "请选择商品",
          },
        ],
        shopSku: [
          {
            required: true,
            message: "请选择商品商品规格",
          },
        ],
        money: [
          {
            required: true,
            message: "请输入兑换金额",
            trigger: "blur",
            type: "number",
          },
          {
            type: "number",
            message: "请输入数字格式",
            trigger: "blur",
            transform(value) {
              return Number(value);
            },
          },
        ],
        validDateForm: [
          {
            required: true,
            message: "请选择有效期",
            trigger: "blur",
            pattern: /.+/,
          },
        ],
        openState: [
          {
            required: true,
            message: "请选择启用状态",
          },
        ],
      },
      addVisible: false,
      validDate: [],
      bornData: [],

      excel: 0,
      exchangeFrom: {
        cardno: "", //ID
        cid: "", //批次ID
        minmoney: "",
        maxmoney: "",
        isopen: 9,
        status: 9,
        page: 1,
        limit: 10,
      },
      useStateList: [
        {
          value: 9,
          label: "全部",
        },
        {
          value: 0,
          label: "未使用",
        },
        {
          value: 1,
          label: "已兑换",
        },
        {
          value: 2,
          label: "已兑物",
        },
        {
          value: 20,
          label: "已过期",
        },
      ],
      cityList: [
        {
          value: 9,
          label: "全部",
        },
        {
          value: 1,
          label: "启用",
        },
        {
          value: 0,
          label: "停用",
        },
      ],
      columns1: [
        {
          type: "selection",
          width: 55,
          align: "center",
          //  fixed: 'left',
           className: 'table-head-style'
        },
        {
          width: 100,
          title: "卡编号",
          key: "cardno",
          align: "center",
           className: 'table-head-style'
        },
         {
          width: 100,
          title: "卡密",
          key: "cardpwd",
          align: "center",
          className: 'table-head-style'
        },
        {
          width: 100,
          title: "批次ID",
          key: "cid",
          align: "center",
          className: 'table-head-style'
        },
        {
          width: 100,
          title: "卡名称",
          key: "name",
          align: "center",
          className: 'table-head-style',
          render:(h, params) => {
          return h('div', [
            h('span', {
              style: {display: 'inline-block', 
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap'},
              domProps: {title: params.row.name},
              on:{click:(e) => { e.stopPropagation();}}
            }, params.row.name)
          ]);
        } 

        },
        {
          width: 100,
          title: "兑物商品名",
          key: "store_name",
          align: "center",
          className: 'table-head-style',
           render:(h, params) => {
          return h('div', [
            h('span', {
              style: {display: 'inline-block', 
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap'},
              domProps: {title: params.row.store_name},
              on:{click:(e) => { e.stopPropagation();}}
            }, params.row.store_name)
          ]);
        } 
        },
        {
          width: 100,
          title: "商品规格",
          key: "suk",
          align: "center",
          className: 'table-head-style'
        },

        {
          width: 100,
          title: "兑换卡类型",
          key: "type",
          align: "center",
          slot: "actionType",
          className: 'table-head-style'
        },
        // {
        //   width: 120,
        //   title: "商品名称（规格）",
        //   key: "name",
        //   align: "center",
        //   slot: "actionShop",
        // },
        {
          width: 100,
          title: "充值金额",
          key: "money",
          align: "center",
          slot: "actionMoney",
          className: 'table-head-style'
        },
        
        {
          title: "生成期",
          key: "add_time",
          align: "center",
          minWidth: 160,
          className: 'table-head-style'
        },
        {
          title: "有效期",
          key: "start_time",
          align: "center",
          slot: "actionTime",
           minWidth: 180,
           className: 'table-head-style'
        },
        {
          width: 100,
          title: "使用状态",
          key: "status",
          slot: "action2",
          align: "center",
          className: 'table-head-style'
        },
        {
          width: 100,
          title: "启用状态",
          key: "isopen",
          slot: "action1",
          align: "center",
           fixed: 'right',
          className: 'table-head-style'
        },
      ],
      data1: [],
      rowID: "",
      total: 0,
    };
  },
  computed: {},
  created() {
    this.redeemList();
  },
  methods: {
    //过滤日期
    
     //处理时间格式
    //时间格式转换
    dateFormat: function (time) {
      var date = new Date(time);
      var year = date.getFullYear();
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var seconds =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // 拼接
      return year + "-" + month + "-" + day;
      // return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    },
    //  兑换卡列表接口数据
    redeemList() {
      this.spinShow = true;
      // 处理时间
      let validity_time =this.validDate[0] == ''||this.validDate[0] == undefined? "": this.dateFormat(this.validDate[0]) +" " +"00:00:00" +"," + this.dateFormat(this.validDate[1]) +" " +"23:59:59";
      let add_time =this.bornData[0]== ''||this.bornData[0] == undefined? "": this.dateFormat(this.bornData[0]) +" " +"00:00:00"+ "," + this.dateFormat(this.bornData[1])+" " +"23:59:59";
      let status =
        this.exchangeFrom.status == 9 ? "" : this.exchangeFrom.status;
      let isopen =
        this.exchangeFrom.isopen == 9 ? "" : this.exchangeFrom.isopen;
      let maxMoney = this.exchangeFrom.maxmoney==""?"":parseInt(this.exchangeFrom.maxmoney).toFixed(2);
      let minMoney = this.exchangeFrom.minmoney==""?"":parseInt(this.exchangeFrom.minmoney).toFixed(2);
      //查询列表
    //  this.$set(this.exchangeFrom, 'page', '1')
    //  this.$set(this.exchangeFrom, 'page', 1)
      reedeemQuery({
        ...this.exchangeFrom,
        status: status,
        isopen: isopen,
        validity_time: validity_time,
        add_time: add_time,
        export: 0,
        minmoney:minMoney,
        maxmoney:maxMoney
      })
        .then((res) => {
          this.data1 = res.data.list;
          this.total = res.data.count;
         
          this.spinShow = false;
        })
        .catch((error) => {
          this.$Message.error(error.msg);
        });
    },
    //导出
    exportTable() {
      //  this.spinShow = true;
      // 处理时间
      let validity_time =this.validDate[0] == ''||this.validDate[0] == undefined? "": this.dateFormat(this.validDate[0]) +" " +"00:00:00" +"," + this.dateFormat(this.validDate[1]) +" " +"23:59:59";
      let add_time =this.bornData[0]== ''||this.bornData[0] == undefined? "": this.dateFormat(this.bornData[0]) +" " +"00:00:00"+ "," + this.dateFormat(this.bornData[1])+" " +"23:59:59";
      let status =
        this.exchangeFrom.status == 9 ? "" : this.exchangeFrom.status;
      let isopen =
        this.exchangeFrom.isopen == 9 ? "" : this.exchangeFrom.isopen;
      let maxMoney = this.exchangeFrom.maxmoney==""?"":parseInt(this.exchangeFrom.maxmoney).toFixed(2);
      let minMoney = this.exchangeFrom.minmoney==""?"":parseInt(this.exchangeFrom.minmoney).toFixed(2);
      this.$Modal.confirm({
          title: '确定要导出列表数据吗？',
          onOk: () => {
            window.location.href  =`${location.origin}/adminapi/marketing/redeem?`+"export="+1+"&status="+status+"&isopen="+isopen+"&validity_time="+validity_time+"&add_time="+add_time+"&minMoney="+minMoney+"&maxmoney="+maxMoney+"&cardno="+this.exchangeFrom.cardno+"&cid="+this.exchangeFrom.cid;
              // this.$Message.success('已导出');
            //   // window.location.href =`${location.origin}/adminapi/marketing/redeem?export=` + 1;
          },
          onCancel: () => {
              this.$Message.info('已取消');
          }
      });
    
    },
    //有效期
    handleChangeValid(date) {
      this.validDate = date;
      // console.log(this.validDate,'有效期')
    },
    //有效期清除事件
    clearDate(){
    
    },
    //取消
    visibleCancel() {
      (this.formValidate = {
        validDateForm: [], //有效期
        name: "",
        number: "",
        money: "",
        shopping: "",
        shopSku: "",
        openState: true,
      }),
        (this.validity_time = ""),
        (this.range = "1"); //商品名规格选择
    },
    //失焦事件
    moneyMaxBlur() {
      let maxMoney = parseInt(this.exchangeFrom.maxmoney);
      let minMoney = parseInt(this.exchangeFrom.minmoney);
      
      // console.log(maxMoney,'金额')
      if (maxMoney < minMoney) {
        this.$Message.warning("最大值不能小于最小值哦！");
        this.exchangeFrom.maxmoney = "";
      }
    },
    //使用状态
    changeUse(data) {
      // console.log(data.value,'val');
      this.exchangeFrom.status = data.value;
    },
    //启用状态
    changeOpen(data) {
      this.exchangeFrom.isopen = data.value;
    },
    //生成期
    handleChangeBorn(date) {
      this.bornData = date;
      // console.log(date, "生成期");
    },
    //查询列表
    queryList() {
      this.exchangeFrom.page = 1;
      this.exchangeFrom.limit = 10;
      this.$set(this.exchangeFrom, 'page', 1)
       this.redeemList()
    },

    //状态弹出框
    instance(row) {
      console.log(111)
      console.log(row, "row");
      var title = row.isopen == 1 ? "确定要停用?" : "确定要启用?";
      this.$Modal.confirm({
        title: title,
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          // row.isopen = !row.isopen;
          // this.$Message.info("已完成修改状态！");
          this.spinShow = true;
          const value = !row.isopen == true ? 1 : 0;
          reedeemStateEdit({
            id: row.id,
            field: "isopen",
            value: value,
          })
            .then((res) => {
              this.$Message.success("修改状态成功！");
              this.redeemList();
              this.spinShow = false;
            })
            .catch((error) => {
              this.$Message.error(error.msg);
            });
        },
        onCancel: () => {
          this.$Message.info("已取消");
        },
      });
    },
    //获取商品名商品规格接口数据
    getInstanceShop() {
      reedeemQueryShop()
        .then((res) => {
          this.products = res.data.products;
          this.suks = res.data.suks;
        })
        .catch((res) => {
          // this.$Message.error(res.msg);
        });
    },
    radioChange(val) {
      this.range = val;
      if (val == 0) {
        this.formValidate.shopping = "";
        this.formValidate.shopSku = "";
      } else {
        this.formValidate.money = "";
      }
      console.log(val, "val");
    },
    //状态开关
    changeStatus(status) {
      console.log(status, "开关状态");
      this.openState = status == true ? 1 : 0;
      console.log(this.openState, "this.openState");
    },
    // 表格全选全不选
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    // 分页
    pageChange(index) {
      this.exchangeFrom.page = index;
      this.redeemList();
      // this.getList();
    },
    pageSizeChange(index) {
      this.exchangeFrom.limit = index;
      this.redeemList();
    },
    //新增兑换卡
    addCard() {
      this.getInstanceShop();
      this.addVisible = true;
    },
    handleChangeForm(date) {
      this.formValidate.validDateForm = date;
    },
    handleChangeValid(date) {
      this.validDate = date;
      console.log(date, "有效期");
      // var data = date;
      // data = data.toString();
      // console.log(data, "zifu");
    },
    ok(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success("Success!");
          this.$Message.info("Clicked ok");
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    cancel() {
      this.$Message.info("Clicked cancel");
    },
    //兑换商品change事件
    shopChange(e) {
      console.log(e, "商品ID");
      this.list = this.suks[e];
    },
    shopSkuChange(e) {
      console.log(e, "规格");
    },
    //新增兑换卡
    handleSubmit(name) {
     
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.disabled = true;
          this.spinShow = true;
          //新增请求接口
          const isopen = this.formValidate.openState == true ? 1 : 0;
          let  validity_time = this.dateFormat(this.formValidate.validDateForm[0]) +" " +"00:00:00" +"," + this.dateFormat(this.formValidate.validDateForm[1]) +" " +"23:59:59";
          reedeemAddCard({
            name: this.formValidate.name,
            count: this.formValidate.number,
            type: this.range,
            money: this.formValidate.money,
            product_id: this.formValidate.shopping,
            suk: this.formValidate.shopSku,
            validity_time: validity_time,
            isopen: isopen,
          })
            .then((res) => {
              this.addVisible = false;
              this.$Message.success("新增兑换卡成功！");
              this.spinShow = false;
              this.redeemList(); //刷新列表
              (this.formValidate = {
                validDateForm: [], //有效期
                name: "",
                number: "",
                money: "",
                shopping: "",
                shopSku: "",
                openState: true,
              }),
                (this.validity_time = ""),
                (this.range = "1"); //商品名规格选择
                this.disabled = false
            })
            .catch((error) => {
              this.$Message.error(error.msg);
            });
        } else {
          // this.$Message.error("验证失败!");
        }
      });
    },
    //重置
    resetSearch() {
      (this.exchangeFrom = {
        cardno: "", //ID
        cid: "", //批次ID
        minmoney: "",
        maxmoney: "",
        isopen: 9,
        status: 9,
        page: 1,
        limit: 10,
      }),
        (this.validDate = []);
      this.bornData = [];
      this.redeemList(); //刷新列表
      
    },
  },
};
</script>

<style scoped>
/*头部th*/
 /* .ivu-table-header th {
  color: #333;
  font-weight: bold;
  background-color: #f2f2f2 !important;
 
} */
 >>> .ivu-table th.table-head-style{
    background:  #f2f2f2!important;
    color: #333;
}
.header {
  box-sizing: border-box;
  background: #ffff;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.page {
  text-align: center;
}
.table {
  margin: 2rem 0;
  background-color: #fff;
  padding: 2.5rem 1rem;
}
.search-button {
  text-align: right;
}
.search-button button {
  margin-right: 2rem;
  width: 9rem;
  height: 3.5rem;
  text-align: center;
}
.search-button button:nth-child(odd) {
  background-color: #0093ff;
}
.search-button button:nth-child(odd):hover {
  background-color: #00bdb6;
}
.search-button button:nth-child(even) {
  background-color: #fbfbfb;
  color: #555555;
  border-color: #c9c9c9;
}
.search-button button span {
  font-size: 15px;
}
.ivu-row:not(:last-child) {
  margin-bottom: 1.5rem;
}
.line {
  display: flex;
  border: 1px solid #d7d7d7;
  border-radius: 5px;
}
.line .text-left {
  flex: 0 0 24%;
  border-right: 1px solid #d7d7d7;
  font-size: 1.1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;
  color: #a2a2a2;
  border-right: 1px solid #d7d7d7;
}
.icon {
  flex: 0.3%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.line > .input {
  flex: 1;
  border: 0 !important;
  padding: 0.34rem 0.5rem !important;
}
.enTime >>> .ivu-input {
  padding: 1.6rem 0.8rem !important;
}
.enTime >>> .ivu-input-prefix {
  top: 5px;
}
/deep/ .ivu-input:focus {
  box-shadow: none;
}

.input >>> .ivu-input {
  border: 0 !important;
  padding: 0.34rem 0.5rem !important;
}
.input >>> .ivu-select-single .ivu-select-selection {
  border: 0;
  padding: 0.45rem 0.5rem;
}
.select >>> .ivu-select-selection {
  border: 0;
  padding: 0.34rem 0.5rem;
  height: 3.34rem;
}
/deep/.ivu-layout-content {
  padding: 0 !important;
  height: calc(100% - 80px);
  overflow: auto;
}
.connect {
  width: 0.9rem;
  height: 40px;
  line-height: 40px;
  text-align: center;
  padding: 0 !important;
}
</style>
