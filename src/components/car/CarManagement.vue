<template>
  <div id="CarManagement">
    <!--头部标题 设置-->
    <g-header leftTitle="车辆管理" set @set="settingVisible = true">
      <g-addButton title="添加车辆" slot="btnRight" @emitClickAddBtn="clickAddCar"></g-addButton>
    </g-header>
    <div class="mainBox">
    <g-searchBox :optionArr="['车号']" @emitSearchArr="getSearchInfo">
      <el-select class="selectionBox" slot="selectOne"
                 v-model="carNumValue"
                 clearable filterable placeholder="请选择车辆公司">
        <el-option
          v-for="(item,index) in typeArr" :key="index"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </g-searchBox>

    <!--表格-->
    <div id="List">
      <el-table
        :data="carData"
        border
        style="width: 100%"
        @row-click="carDetail"
        @sort-change="sortChange">
        <el-table-column v-if="setShowArr.includes('type')" show-overflow-tooltip
                         prop="type"
                         label="公司/个人" sortable="custom">
        </el-table-column>
        <el-table-column v-if="setShowArr.includes('car_num')" show-overflow-tooltip
                         prop="car_num"
                         label="车号" sortable="custom">
          <template scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag>{{ scope.row.car_num }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="setShowArr.includes('car_register_weight')" show-overflow-tooltip
                         prop="car_register_weight"
                         label="登记皮重"
                          sortable="custom">
        </el-table-column>
        <el-table-column v-if="setShowArr.includes('create_time')" show-overflow-tooltip
                         prop="create_time"
                         label="登记时间" sortable="custom">
        </el-table-column>
        <el-table-column v-if="setShowArr.includes('last_weight_time')" show-overflow-tooltip
                         prop="last_weight_time"
                         label="最后称重时间" sortable="custom">
        </el-table-column>
        <el-table-column v-if="setShowArr.includes('times')" show-overflow-tooltip
                         prop="times"
                         label="称重次数"
                         width="120px" sortable="custom">
        </el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="method"
                         label="操作">
          <template scope="scope">
            <el-button @click.stop="editCarClick(scope.$index,scope.row)" type="text" size="small">
              <i class="el-icon-edit"></i>编辑
            </el-button>
            <el-button @click.stop="deleteCarClick(scope.$index)" type="text" size="small">
              <i class="el-icon-delete"></i>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    </div>
    <!--分页-->
    <g-pagenation :pageSize="pageSize" :total="pageTotal"
                  @size-change="sizeChange"
                  @current-change="currentChange"></g-pagenation>

    <!--添加车辆-->
    <el-dialog :visible.sync="carVisible"
               :title="carTitle"
               size="middle"
               @open="" @close="closeRule">
      <el-form :model="AddCarForm" :rules="AddCarRules" ref="AddCarForm" label-width="79px">

        <el-row :gutter="20">

          <el-col :span="12" style="height:58px;">
            <el-form-item label="类型" prop="carType" class="chooseType">
              <el-radio-group v-model="carType" @change="companysChange">
                <el-radio-button label="公司"></el-radio-button>
                <el-radio-button label="个人"></el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="!companyDisabled" label="所属公司" prop="companys" :class="{ 'is-required': isRequired }">
              <el-autocomplete
                class="inline-input"
                v-model="AddCarForm.companys"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车号" prop="carNums">
              <el-input v-model="AddCarForm.carNums" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="驾驶员" prop="driver">
              <el-input v-model="AddCarForm.driver" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="phones">
              <el-input v-model="AddCarForm.phones" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登记皮重" prop="registrationTare">
              <el-input v-model="AddCarForm.registrationTare" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="载重" prop="loadWeight">
              <el-input v-model="AddCarForm.loadWeight" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="尺寸" prop="carSize">
              <el-input v-model="AddCarForm.carSize" placeholder="请输入格式为L*W*H尺寸"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog('AddCarForm')">取 消</el-button>
        <el-button type="primary" class="addWarehouseNumber"
                   @click.native="batchAddCar('AddCarForm')">添加下一个
        </el-button>
        <el-button type="primary" @click.native="submitCarForm('AddCarForm')">确 定</el-button>

      </div>
    </el-dialog>
    <!--设置弹窗-->
    <g-setting :visible="settingVisible"
               @cancelBtnClick="settingVisible = false"
               @close="settingVisible = false"
               :setShowArr="setShowArr"
               :setAllArr="setAllArr"
               :setNameArr="setNameArr"
               @setShowArrChange="setShowArrChange">
    </g-setting>
  </div>
</template>

<script>
  export default {
    name: '',
    props: {},
    components: {},
    data() {
//      var validateDoubleCarName = (rule, value, callback) => {
//        if(value){
//          if(this.tempCarNum && this.tempCarNum == value){
//            callback();
//          }
//          this.axios.get('/carManagement/existCar?carNum=' + value).then((response) => {
//            this.carVisible = true;
//            if(response.data.code === 500){
//              callback(new Error(response.data.error));
//            } else {
//              callback();
//            }
//          })
//        } else {
//          callback();
//        }
//      };
      return {
        settingVisible: false,    // 设置参数开始
        setShowArr: [],
        setNameArr: [],
        setAllArr: [],           // 设置参数结束
        companysValue: '',
        carVisible: false,
        typeArr: [],
        belongArr: [],
        select_value: '',
        carData: [],
        tabIndex: '',
        carTitle: '',
        carNumValue: null,
        carId: '',
        car_num: '',
        type: '',
        driver: '',
        starDate: '',
        endDate: '',
        pageSize: 10,   //分页
        pageTotal: 1,
        currentPage: 1,
        orderType: '',
        sort: '',
        order: '',
        AddCarForm: {
          carType: null,
          carNums: null,
          loadWeight: null,
          companys: null,
          registrationTare: null,
          carSize: null,
          driver: null,
          phones: null
        },
        AddCarRules: {
          carNums: [
            {required: true, message: '请输入车号', trigger: 'blur'},
//            {validator: validateDoubleCarName, trigger: 'blur'},
            {max: 8, message: '车号不能超过8位'},
//            {
//              pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
//              message: '请输入正确的车牌号',
//              trigger: 'blur'
//            }
          ],
          companys: [
            {required: true, message: '请输入或者选择公司', trigger: 'change'}
          ],
          loadWeight: [{
            pattern: /^[0-9]+\.{0,1}[0-9]{0,2}$/,
            message: '重量只能输入数字形式'
          }
          ],
          registrationTare: [{
            pattern: /^[0-9]+\.{0,1}[0-9]{0,2}$/,
            message: '重量只能输入数字形式'
          }
          ],
//
        },
        // 单选框
        carType: '个人',
        companyDisabled: false,
        allowCreateCompany: false,
        state1: '',
        rows: [],
        isRequired: true,
        tempCarNum:'',
        orderSort:``,
        order:``
      }
    },
    computed: {
      watchTabelData() {
        return {
          carId: this.carId,
          carNum: this.car_num,
          type: this.carNumValue,
          driver: this.driver,
          starDate: this.starDate,
          endDate: this.endDate,
          pageNumber: this.currentPage,
          pageSize: this.pageSize,
          orderSort: this.orderSort,
          order: this.order
        }
      },
      watchDialogVis() {
        return this.carVisible
      }
    },
    created() {
      // 设置
      if (localStorage.hasOwnProperty('CarSetShowArr')) {
        this.setShowArr = JSON.parse(localStorage.getItem('CarSetShowArr'))
      } else {
        this.setShowArr = ['type', 'car_num', 'car_register_weight', 'create_time', 'last_weight_time', 'times'];
      }
      this.setAllArr = ['type', 'car_num', 'car_register_weight', 'create_time', 'last_weight_time', 'times'];
      this.setNameArr = ['公司/个人', '车号', '登记皮重', '登记时间', '最后称重时间', '称重次数']
    },
    watch: {
      watchTabelData: {
        handler(newVal, oldVal) {
          this.getAllCar();
          this.findPageFirmList();
        },
        deep: true
      },
      //监听dialog是否弹出
      watchDialogVis: {
        handler(newVal) {
          this.visitDialog(newVal);
        }
      },
    },
    activated() {
      this.getAllCar();
      this.findPageFirmList();
      this.getCarCompanyList();
    },
    deactivated() {
    },
    methods: {
      /*
      *   以下是运行函数
      * */
      // 表格排序
      sortChange (obj) {
        this.orderSort = obj.prop;
        if (obj.order === 'ascending') {
          this.order = 'asc'
        } else if (obj.order === 'descending') {
          this.order = 'desc'
        } else {
          this.order = ''
        }
      },
      // 设置回调
      setShowArrChange(arr) {
        this.setShowArr = arr;
        localStorage.setItem('CarSetShowArr', JSON.stringify(arr));
        this.settingVisible = false;
      },
      sizeChange(pageSize) {
        this.pageSize = pageSize
      },
      // currentPage 改变时会触发
      currentChange(currentPage) {
        this.currentPage = currentPage
      },

      visitDialog(newVal) {
        if (newVal == false) {
          this.$refs.AddCarForm.resetFields();
        }
      },

//      选择或填写所属公司
      querySearch(queryString, cb) {
        let restaurants = this.belongArr;
        let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.indexOf(queryString.toLowerCase()) === 0);
        };
      },
//      选择类型
      companysChange() {
        if (this.carType == "个人") {
          this.AddCarForm.companys = null;
          this.companyDisabled = true;
        } else {
          this.companyDisabled = false;
        }
      },
//    点击table单行跳转
      carDetail(row) {
        this.$router.push({name: 'CarDetail', query: {carId: row.car_id}});
      },

//      关闭dialog
      closeRule() {
        this.$refs.AddCarForm.resetFields();
        this.findPageFirmList();
      },

      closeDialog() {
        this.carVisible = false;
      },

//    获取车辆公司List
      findPageFirmList() {
        this.axios.get('/carManagement/findPageFirmList').then(res => {
            this.typeArr = res.data.body;
          },
          (error) => {
            // error
            console.log(error)
          })
      },

//    获取车辆公司list，隐藏个人
      getCarCompanyList() {
        let param = {
          type: '个人',
        };
        this.belongArr = [];
        this.axios.get('/carManagement/findPageFirmList', {params: param}).then(res => {
            let newArr = res.data.body;
            for (var index in newArr) {
              this.belongArr.push({
                value: newArr[index]
              })
            }
          },
          (error) => {
            // error
            console.log(error)
          })
      },

//     删除车辆项
      deleteCarClick(index) {
        this.$confirm('是否确认删除？', '提示').then(() => {
          this.axios.get('/carManagement/deleteCar', {
              params: {
                carId: this.carData[index].car_id,
              }
            }
          ).then(res => {
              if (res.data.code == 200) {
                this.getAllCar();
                this.findPageFirmList();
                this.carData.splice(index, 1);
                this.$message({
                  type: 'success',
                  message: '已删除!',
                  duration: 2000,
                })
              } else {
                this.$message.error(res.data.error)
              }
            },
            (error) => {
              // error
              console.log(error)
            });

        })
      },

      // 编辑车辆项
      editCarClick(index, row) {
        this.AddCarForm.companys = null;
        this.tabIndex = row.car_id;
        this.carTitle = '编辑车辆';
        this.carVisible = true;
        this.allowCreateCompany = true;
        $(".addWarehouseNumber").hide();
        this.AddCarForm.carNums = row.car_num;
        this.AddCarForm.phones = row.phones;
        this.AddCarForm.driver = row.driver;
        this.AddCarForm.loadWeight = row.car_load_weight;
        this.AddCarForm.registrationTare = row.car_register_weight;
        this.AddCarForm.carSize = row.car_size;
        this.tempCarNum = row.car_num;
        this.getCarCompanyList();
        if (row.type == "个人") {
          this.companyDisabled = true;
          this.carType = "个人";
        } else {
          this.carType = "公司";
          this.AddCarForm.companys = row.type;
        }
        this.rows = row;
      },
      // 根据搜索框查询
      getSearchInfo(arr) {
        let searchArr = arr;
        this.car_num = '';
        for (let i = 0; i < searchArr.length; i++) {
          if (searchArr[i].selected) {
            if (searchArr[i].label == '车号') {
              this.car_num = searchArr[i].text;
            }
          }
        }
      },
      // 车辆分页
      getAllCar() {
        this.axios.get('/carManagement/getPageCarList', {
            params: {
              carId: this.carId,
              carNum: this.car_num,
              type: this.carNumValue,
              driver: this.driver,
              starDate: this.starDate,
              endDate: this.endDate,
              pageNumber: this.currentPage,
              pageSize: this.pageSize,
              orderSort: this.orderSort,
              order: this.order,
            }
          }
        ).then(res => {
          if (res.data.code == 200) {
            this.carData = res.data.body.list;
            this.pageTotal = res.data.body.totalRow;
          }
        }, (error) => {
          console.log(error)
        })
      },

      // 点击添加车辆
      clickAddCar() {
        this.carTitle = '添加车辆';
        this.carVisible = true;
        $(".addWarehouseNumber").show();
        this.clearInput();
        this.getCarCompanyList();
        this.companyDisabled=true;
        this.allowCreateCompany = true;
        this.AddCarForm.companys = null;
      },
      // 单条车辆添加/编辑
      submitCarForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.carTitle === '添加车辆') {
              this.AddCar();
              this.carVisible = false;
            }
            if (this.carTitle === '编辑车辆') {
              if (this.carType === '个人') {
                for (let i = 0; i < this.carData.length; i++) {
                  if (this.tabIndex === this.carData[i].car_id) {
                    this.editCar();
                    this.carVisible = false;
                  }
                }
              } else {
                this.editCar();
                this.carVisible = false;
              }
            }
          }
        });
      },
      // 批量车辆添加/编辑
      submitCarsForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.carTitle === '添加车辆') {
              this.AddCar();
            }
            if (this.carTitle === '编辑车辆') {
              if (this.carType === '个人') {
                for (let i = 0; i < this.carData.length; i++) {
                  if (this.tabIndex === this.carData[i].car_id) {
                    this.editCar();
                  }
                }
              } else {
                this.editCar();
              }
            }
          }
        });
      },
      // 新增车辆
      AddCar() {
        let param = {
          'rec.type': this.AddCarForm.companys ? this.AddCarForm.companys : '个人',
          'rec.carNum': this.AddCarForm.carNums,
          'rec.carLoadWeight': this.AddCarForm.loadWeight,
          'rec.carSize': this.AddCarForm.carSize,
          'rec.carRegisterWeight': this.AddCarForm.registrationTare,
          'rec.phones': this.AddCarForm.phones,
          'rec.driver': this.AddCarForm.driver,
        };
        this.axios.get('/carManagement/saveCar', {params: param}).then(res => {
          if (res.data.code == 200) {
            this.$message('已保存');
            this.getCarCompanyList();
            this.getAllCar();
          }
          if(res.data.code == 500){
            this.$message.error(res.data.error);
          }
        })
      },
      // 批量车辆添加
      batchAddCar(formName) {
          this.submitCarsForm(formName);
          this.carVisible = true;
          this.clearNextInput();
      },
      // 编辑车辆信息
      editCar() {
        let param = {
          'rec.carId': this.tabIndex,
          'rec.type': this.AddCarForm.companys ? this.AddCarForm.companys : '个人',
          'rec.carNum': this.AddCarForm.carNums,
          'rec.carLoadWeight': this.AddCarForm.loadWeight,
          'rec.carSize': this.AddCarForm.carSize,
          'rec.carRegisterWeight': this.AddCarForm.registrationTare,
          'rec.phones': this.AddCarForm.phones,
          'rec.driver': this.AddCarForm.driver,
        };
        this.axios.get('/carManagement/updateCar', {params: param}).then(res => {
          if (res.data.code == 200) {
            this.$message('已修改');
            this.getAllCar();
            this.getCarCompanyList();
            this.findPageFirmList();
          }
          if(res.data.code == 500){
            this.$message.error(res.data.error);
          }
        })
      },
      clearInput() {
        this.carType = "个人";
        this.companyDisabled = true;
        this.AddCarForm.carNums = null;
        this.AddCarForm.companys = null;
        this.AddCarForm.loadWeight = null;
        this.AddCarForm.carSize = null;
        this.AddCarForm.registrationTare = null;
      },
      // 清空输入框方法
      clearNextInput() {
        if(this.carType == "个人"){
          this.carType = "个人";
          this.companyDisabled = true;
        } else {
          this.carType = "公司";
          this.companyDisabled = false;
        }
        this.AddCarForm.carNums = null;
        this.AddCarForm.companys = null;
        this.AddCarForm.loadWeight = null;
        this.AddCarForm.carSize = null;
        this.AddCarForm.registrationTare = null;
      },
    }
  }
</script>

<style rel="stylesheet" lang="scss">
  @import '../../assets/scss/main.scss';
  @import './css/CarManagement.scss';
  .el-table__row:hover{
    cursor: pointer;
  }
</style>
