<template>
  <Modal
    v-model="modals"
    scrollable
    title="订单发送货"
    class="order_box"
    :closable="false"
  >
    <div v-for="(value, key) in infos.formValidate" :key="key" class="form">
      <div v-for="(item, index) in value" :key="index">
        <Form
          :ref="'formValidate' + key + index"
          :model="item"
          :rules="infos.ruleValidate"
          :label-width="100"
        >
          <FormItem label="商品名称：" prop="remark">
            <Input
              v-model="item.remark"
              filterable
              placeholder="请输商品名称"
              style="width:80%;"
            ></Input>
          </FormItem>
          <FormItem label="快递公司：" prop="delivery_name">
            <Select
              v-model="item.delivery_name"
              filterable
              placeholder="请选择快递公司"
              style="width:80%;"
              @on-change="expressChange"
            >
              <Option
                @click.native="expressClick(val)"
                v-for="(val, i) in express"
                :value="val.value"
                :key="val.code"
                >{{ val.value }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="快递单号：" prop="delivery_id">
            <Input
              v-model="item.delivery_id"
              filterable
              placeholder="请输入快递单号"
              style="width:80%;"
            ></Input>
          </FormItem>
         
        </Form>
      </div>
    </div>
    <div slot="footer">
      <Button type="primary" @click="addOrder">添加商品单号</Button>
      <Button @click="cancel">取消</Button>
      <Button type="primary" @click="handleSubmit">提交</Button>
    </div>
    <div ref="viewer" v-viewer>
      <img :src="temp.pic" style="display:none" />
    </div>
  </Modal>
</template>

<script>
import { getExpressData, putDeliverys, orderExpressTemp } from "@/api/order";
export default {
  name: "orderSendV",
  props: {
    orderId: Number,
  },
  data() {
    return {
      infos: {
        formValidate: [
          [
            {
              remark: "",
              delivery_name: "",
              delivery_id: "",
              code: "",
            },
          ],
          
        ],
        ruleValidate: {
          remark: [
            {
              required: true,
              message: "请输入商品名称",
              trigger: "blur",
            },
          ],
          delivery_name: [
            {
              required: true,
              message: "请选择快递公司",
              trigger: "change",
            },
          ],
          delivery_id: [
            {
              required: true,
              message: "请输入快递单号",
              trigger: "blur",
            },
          ],
        },
      },
     
      modals: false,
      express: [],
      expressTemp: [],
      deliveryList: [],
      temp: {},
      export_open: true,
    };
  },
  mounted() {},
  methods: {
    
    echan(item) {
      console.log(item, "item");
    },
    reset() {
      this.infos.formValidate= [
          [
            {
              remark: "",
              delivery_name: "",
              delivery_id: "",
              code: "",
            },
          ],
          
        ]
    },
    // 物流公司列表
    getList(type) {
      let status = type === 2 ? 1 : "";
      getExpressData(status)
        .then(async (res) => {
          this.express = res.data;
        })
        .catch((res) => {
          this.loading = false;
          this.$Message.error(res.msg);
        });
    },
    // getDeliveryList() {
    //   orderDeliveryList()
    //     .then((res) => {
    //       this.deliveryList = res.data.list;
    //     })
    //     .catch((err) => {
    //       this.$Message.error(err.msg);
    //     });
    // },
    // 提交
    handleSubmit() {
      
      let flagArr = [];
      this.infos.formValidate.forEach((item, index) => {
        item.forEach((data, key) => {
          let form = "formValidate" + index + key;
          this.$refs[form][0].validate((valid) => {
            if (valid) {
            } else {
              this.$Message.warning("请检查输入框");
            }
            flagArr[index] = valid;
          });
        });
      });

      /* 转异步 */
      setTimeout(() => {
        if (flagArr.includes(false)) return this.$Message.error("fild");
        // this.$Message.success("验证通过");
        let params = this.infos.formValidate.map((val) => val[0]);
        params = JSON.stringify(params)
        let data = {
            id: this.orderId,
            deliverys:params
        };
        putDeliverys(data).then(async res => {
            this.modals = false;
            this.$Message.success(res.msg);
            this.$emit('submitFail');
            this.reset()
        }).catch(res => {
            this.$Message.error(res.msg);
        })
      }, 0);
    },
    handleReset() {
      this.infos.formValidate.forEach((item, index) => {
        item.forEach((data, key) => {
          let form = "formValidate" + index + key;
          this.$refs[form][0].resetFields();
        });
      });
    },
    cancel() {
      this.reset();
      this.modals = false;
    },
    //添加商品单号
    addOrder() {
      let obj = [
        {
          remark: "",
          delivery_name: "",
          delivery_id: "",
        },
      ];
      this.infos.formValidate.push(obj);
    },
    // 电子面单列表
    expressChange(value) {
      this.infos.formValidate.forEach(function(item, index) {
        console.log(item, index);
        if (item.delivery_name === value) {
        }
      });
      let expressItem = this.express.find((item) => {
        return item.value === value;
      });
      this.formItem.delivery_code = expressItem.code;
      if (this.formItem.express_record_type === "2") {
        this.expressTemp = [];
        this.formItem.express_temp_id = "";
        orderExpressTemp({
          com: this.formItem.delivery_code,
        })
          .then((res) => {
            this.expressTemp = res.data;
            if (!res.data.length) {
              this.$Message.error("请配置你所选快递公司的电子面单");
            }
          })
          .catch((err) => {
            this.$Message.error(err.msg);
          });
      }
    },
    //获取code
    expressClick(item) {
      this.infos.formValidate.forEach((value, index) => {
        if (value[0].delivery_name === item.value) {
          value[0].code = item.code;
        }
      });
    },
    expressTempChange(tempId) {
      this.temp = this.expressTemp.find((item) => {
        return tempId === item.temp_id;
      });
      if (this.temp === undefined) {
        this.temp = {};
      }
    },
    preview() {
      this.$refs.viewer.$viewer.show();
    },
  },
};
</script>

<style scoped>
.express_temp_id {
  position: relative;
}

.express_temp_id button {
  position: absolute;
  top: 50%;
  right: 110px;
  padding: 0;
  border: none;
  background: none;
  transform: translateY(-50%);
  color: #57a3f3;
}

.ivu-btn-text:focus {
  box-shadow: none;
}
.form{
  /* border-top: 1px dotted rgb(131, 129, 129); */
}
.form:not(:nth-child(1)){
 border-top: 1px dotted rgb(131, 129, 129);
 padding-top: 2rem;
}
</style>
