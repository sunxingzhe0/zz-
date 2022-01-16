<template>
  <Modal
    v-model="modals"
    scrollable
    title="配送信息"
    class="order_box"
    :closable="false"
  >
    <div v-for="(item, key) in orderData" :key="key">
      <div >
        <Form
          :model="item"
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
      <Button @click="cancel">取消</Button>
      <Button type="primary" @click="handleSubmit">确认</Button>
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
     
      orderData:[],  
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
    // reset() {
    //   this.infos.formValidate= [
    //       [
    //         {
    //           remark: "",
    //           delivery_name: "",
    //           delivery_id: "",
    //           code: "",
    //         },
    //       ],
          
    //     ]
    // },
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
       let params = this.orderData;
        params = JSON.stringify(params)
        let data = {
            id: this.orderId,
            deliverys: params
        };
        let flag = this.orderData.every((item)=>{
            
            return item.delivery_name&&item.remark&&item.delivery_id
        })
        if(flag){
             putDeliverys(data).then(async res => {
                this.modals = false;
                this.$Message.success(res.msg);
                this.$emit('submitFail');
                // this.reset()
            }).catch(res => {
                this.$Message.error(res.msg);
            })
        }else{
             this.$Message.warning('请检查输入项，不能为空！')
        }
            
        //  setTimeout(() => {
        //         putDeliverys(data).then(async res => {
        //     this.modals = false;
        //     this.$Message.success(res.msg);
        //     this.$emit('submitFail');
        //     // this.reset()
        // }).catch(res => {
        //     this.$Message.error(res.msg);
        // })
        //   }, 0);
        
    //   let flagArr = [];
    //   this.infos.formValidate.forEach((item, index) => {
    //     item.forEach((data, key) => {
    //       let form = "formValidate" + index + key;
    //       this.$refs[form][0].validate((valid) => {
    //         if (valid) {
    //         } else {
    //           this.$Message.warning("请检查输入框");
    //         }
    //         flagArr[index] = valid;
    //       });
    //     });
    //   });

      /* 转异步 */
    //   setTimeout(() => {
    //     if (flagArr.includes(false)) return this.$Message.error("fild");
    //     this.$Message.success("验证通过");
    //     let params = this.orderData;
    //     params = JSON.stringify(params)
    //     let data = {
    //         id: this.orderId,
    //         deliverys: params
    //     };
    //     putDeliverys(data).then(async res => {
    //         this.modals = false;
    //         this.$Message.success(res.msg);
    //         this.$emit('submitFail');
    //         this.reset()
    //     }).catch(res => {
    //         this.$Message.error(res.msg);
    //     })
    //   }, 0);
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
      this.modals = false;
       this.$emit('submitFail');
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
</style>
