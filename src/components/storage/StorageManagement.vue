<template>
  <div id="StorageManagement">
    <!--头部标题-->
    <g-header leftTitle="仓储管理" set @set="settingVisible = true">
      <g-addButton title="新增粮仓" slot="btnRight" @emitClickAddBtn="clickAddPeople"></g-addButton>
    </g-header>
    <!--搜索框-->
    <div class="mainBox">
    <g-searchBox :optionArr="['仓号', '保管员']"  @emitSearchArr="getSearchArr">
      <el-select class="department" slot="selectOne"
                 v-model="seaType"
                 clearable
                 placeholder="仓房类型">
        <el-option
          v-for="(item,index) in depotTypeArr" :key="index"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
      <el-select class="department" slot="selectTwo"
                 v-model="seaVentilationForm"
                 clearable
                 placeholder="通风类型">
        <el-option
          v-for="(item,index) in ventilaTypeArr" :key="index"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
      <el-date-picker v-model="seaBulidYear" slot="selectThree" type="date" :picker-options="pickerOptions"
                      placeholder="选择日期">
      </el-date-picker>
    </g-searchBox>
    <!--表格-->
    <div class="tableBox">
      <el-table :data="tableData"
                border
                @cell-click="cellClick"
                @row-click="toStorageDetail"
                @sort-change="sortChange">
        <el-table-column v-if="setShowArr.includes('depot_name')" show-overflow-tooltip
                         prop="depot_name"
                         label="仓号" sortable="custom">
        </el-table-column>
        <el-table-column v-if="setShowArr.includes('granary_name')" show-overflow-tooltip
                         prop="type"
                         label="仓号类型" sortable="custom">
        </el-table-column>
        <el-table-column v-if="setShowArr.includes('ventilation_form')" show-overflow-tooltip
                         prop="ventilation_form"
                         label="通风形式" sortable="custom">
        </el-table-column>
        <el-table-column v-if="setShowArr.includes('bulid_year')" show-overflow-tooltip
                         prop="bulid_year"
                         label="启用时间" sortable="custom">
        </el-table-column>
        <el-table-column v-if="setShowArr.includes('acc_name')" show-overflow-tooltip
                         prop="acc_name"
                         label="保管员" sortable="custom">
        </el-table-column>
        <el-table-column v-if="setShowArr.includes('total_storage')" show-overflow-tooltip
                         prop="total_storage"
                         label="核定仓容(吨)" sortable="custom">
        </el-table-column>
        <el-table-column v-if="setShowArr.includes('remain_storage')" show-overflow-tooltip
                         prop="remain_storage"
                         label="库存数量(吨)" sortable="custom">
        </el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="method"
                         label="操作"
                         width="180px">
          <template scope="scope">
            <div>
              <el-button @click.stop="EditStore(scope.row.depot_id)" type="text" class="EditBtn">
                <i class="iconfont icon-edit"></i>编辑
              </el-button>
              <el-button @click.stop="deleteStore(scope.row.depot_id)" type="text" class="deleteBtn">
                <i class="iconfont icon-shanchu"></i>删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    </div>
    <!--分页-->
    <g-pagenation :pageSize="pageSize" :total="tableTotal"
                  @size-change="sizeChange"
                  @current-change="currentChange"></g-pagenation>
    <!--仓库弹出框-->
    <g-dialog
      :visible="dialogVisible"
      :title="title"
      :width="719"
      @open="" @close="close"
      @emitClickEnterBtn="clickEnterBtn"
      @cancelBtnClick="dialogVisible = false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="仓号" prop="depotName">
              <el-input v-model="ruleForm.depotName" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓房类型" prop="type">
              <el-select clearable placeholder="仓房类型" v-model="ruleForm.type" class="department">
                <el-option
                  v-for="(item,index) in depotTypeArr" :key="index"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通风形式" prop="ventilationForm">
              <el-select v-model="ruleForm.ventilationForm"
                         clearable
                         placeholder="通风类型">
                <el-option
                  v-for="(item,index) in ventilaTypeArr" :key="index"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结构" prop="structure">
              <el-input v-model="ruleForm.structure"  maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="启用时期" prop="bulidYear">
              <el-date-picker v-model="ruleForm.bulidYear" align="right" type="date" :picker-options="pickerOptions"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓门数量" prop="doorNum">
              <el-input v-model="ruleForm.doorNum"  maxlength="10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="ruleForm.type=='浅圆仓'" label="外径内径" prop="siloDiameter">
              <el-input v-model="ruleForm.siloDiameter" placeholder="请输入格式为N*W的内容" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item v-else label="长宽高" prop="volume">
              <el-input v-model="ruleForm.volume" placeholder="请输入格式为L*W*H的内容" maxlength="10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="堆粮线高" prop="grainLineHeight">
              <el-input v-model="ruleForm.grainLineHeight" maxlength="10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="筒内体积" prop="inVolume">
              <el-input v-model="ruleForm.inVolume" maxlength="10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="隔热措施" prop="insulationMeasures">
              <el-input v-model="ruleForm.insulationMeasures" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="核定仓容" prop="totalStorage">
              <el-input v-model="ruleForm.totalStorage" maxlength="8">
                <template slot="append">吨</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存数量" prop="remainStorage">
              <el-input v-model="ruleForm.remainStorage" maxlength="8">
                <template slot="append">吨</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保管员" prop="accId">
              <!--<el-input v-model="ruleForm.accId"></el-input>-->
              <el-select clearable placeholder="保管员" v-model="ruleForm.accId" class="department">
                <el-option
                  v-for="(item,index) in peopleArray" :key="index"
                  :label="item.acc_name"
                  :value="item.acc_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <hr />
        <el-row :gutter="1">
          <el-form-item
            v-for="(item, index) in ruleForm.remark"
            label="备注"
            :key="index"
          >
            <el-col :span="19" class="colItem">
              <el-input v-model="item.depot_remark" maxlength="50"></el-input>
            </el-col>
            <!--<el-col :span="5" class="colItem" v-show="index != 0">-->
            <el-col :span="5" class="colItem">
              <el-button type="text" @click.stop="deleteRemark(item)" class="deleteClass">删除</el-button>
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>
      <el-button @click.native="addRemark" slot="leftBtn">新增备注</el-button>
    </g-dialog>
    <!--设置弹窗-->
    <g-setting :visible="settingVisible"
               id="settingVisible"
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
  import qs from 'querystring';
   export default {
    name: '',
    props: {},
    components: {},
    data() {
      var validateToStorageInfo = (rule, value, callback) => {
        if(value){
          if (!/^[0-9]+\.{0,1}[0-9]{0,2}$/.test(value)){
            callback(new Error('核定仓容必须为数字(可保留两位小数点)'));
          }
          if(this.ruleForm.remainStorage &&  Number(value) < Number(this.ruleForm.remainStorage)){
            callback(new Error('库存数量大于核定仓容'));
          }
          callback();
        } else {
          callback();
        }
      };
      var validateReStorageInfo = (rule, value, callback) => {
        if(value){
          if (!/^[0-9]+\.{0,1}[0-9]{0,2}$/.test(value)){
            callback(new Error('库存数量必须为数字(可保留两位小数点)'));
          }
          if(this.ruleForm.totalStorage &&  Number(value)> Number(this.ruleForm.totalStorage)){
            callback(new Error('库存数量大于核定仓容'));
          }
          callback();
        } else {
          callback();
        }
      };
      var validateGrainLineHeight = (rule, value, callback) => {
        if(value){
          if (!/^[0-9]+\.{0,1}[0-9]{0,2}$/.test(value)){
            callback(new Error('堆粮线高必须为数字(可保留两位小数点)'));
          }
          callback();
        } else {
          callback();
        }
      };
      var validateDoorNum = (rule, value, callback) => {
        if(value){
          if (/\D/g.test(value)){
            callback(new Error('仓门数量必须为数字'));
          }
          callback();
        } else {
          callback();
        }
      };
      var validateDoubleDepotName = (rule, value, callback) => {
        if(this.ruleForm.depotId){
          if(value && this.tempDepotName != value){
            this.axios.get('/storeroom/existDepot?depotName=' + value).then((response) => {
              if(response.data.code === 500){
                callback(new Error(response.data.error));
              } else {
                callback();
              }
            })
          } else {
            callback();
          }
        } else {
          if(value){
            this.axios.get('/storeroom/existDepot?depotName=' + value).then((response) => {
              if(response.data.code === 500){
                callback(new Error(response.data.error));
              } else {
                callback();
              }
            })
          } else {
            callback();
          }
        }
      };
      return {
        settingVisible: false,    // 设置参数开始
        setShowArr: [],
        setNameArr: [],
        setAllArr: [],           // 设置参数结束
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        dialogVisible: false,
        tableTotal: 1,
        tableData: [],
        pageSize: 10,   //分页
        currentPage: 1,
        ruleForm: {
          depotName:'',
          ventilationForm: '',
          bulidYear: '',
          siloDiameter: '',
          volume: '',
          inVolume: '',
          totalStorage: null,
          accId: '',
          type: '',
          structure: '',
          doorNum: null,
          grainLineHeight: null,
          insulationMeasures: '',
          remainStorage: null,
          remark: [],
          delete_depot_repair_id:''
        },
        rules: {
          depotName: [
            {required: true, message: '请输入仓库名称', trigger: 'blur'},
            {validator: validateDoubleDepotName, trigger: 'blur'}
          ],
          doorNum: [
            {validator: validateDoorNum, trigger: 'blur'}
          ],
          totalStorage: [
            {validator: validateToStorageInfo, trigger: 'blur'}
          ],
          remainStorage: [
            {validator: validateReStorageInfo, trigger: 'blur'}
          ],
          grainLineHeight: [
            {validator: validateGrainLineHeight, trigger: 'blur'}
          ]
        },
        depotTypeArr: [
          {name:'平房仓'},
          {name:'浅圆仓'},
          {name:'钢板仓'}
        ],
        ventilaTypeArr:[
          {name:'地槽'},
          {name:'地上笼'},
          {name:'横向通风'}
        ],
        seaDepodName:'',
        seaAccName:'',
        seaType:'',
        seaVentilationForm:'',
        seaBulidYear:'',
        //保管员的下拉框
        peopleArray:[],
        orderSort: ``,
        order: ``,
        tempDepotName:'',
      }
    },
    computed: {
      watchTabelData() {
        return [
          this.currentPage,
          this.pageSize,
          this.seaDepodName,
          this.seaAccName,
          this.seaType,
          this.seaVentilationForm,
          this.seaBulidYear,
          this.orderSort,
          this.order,
        ];
      },
     watchDialogVis(){
       return this.dialogVisible;
     }
    },
    watch: {
      watchTabelData: {
        handler(newVal, oldVal) {
          this.getStorageList()
        },
        deep: true
      },
      watchDialogVis: {
        handler(newVal, oldVal) {
          this.visitDialog(newVal)
        },
        deep: true
      }
    },
    created() {
      // 设置
      if (localStorage.hasOwnProperty('StorageSetShowArr')) {
        this.setShowArr = JSON.parse(localStorage.getItem('StorageSetShowArr'))
      } else {
        this.setShowArr = ['depot_name', 'granary_name', 'ventilation_form', 'bulid_year', 'acc_name', 'total_storage','remain_storage'];
      }
      this.setAllArr = ['depot_name', 'granary_name', 'ventilation_form', 'bulid_year', 'acc_name', 'total_storage','remain_storage'];
      this.setNameArr = ['仓号', '仓号类型', '通风形式', '启用时间', '保管员', '核定仓容(吨)','库存数量(吨)']
    },
    mounted() {
    },
    activated() {
      this.getStorageList();
      this.getPeopleList();
    },
    deactivated() {
    },
    methods: {
      /*
      *   以下是运行函数
      * */
      //删除仓库
      deleteStore(depotId){
        this.$confirm('是否确认删除？', '提示').then(() => {
          this.axios.delete('/storeroom/deleteStoreroom',{
            params:{
              'depotId' : depotId
            }
          }).then((response) => {
            if(response.data.code === 200){
//              this.ruleForm = response.data;
              this.$message.success('删除成功');
              this.getStorageList();
              this.initObj(this.ruleForm);
              this.dialogVisible = false;
            } else {
              this.$message.error(response.data.error);
            }
          }).catch((error) => {
            this.$message.error('修改异常');
          });
        })
      },
      //编辑仓库
      EditStore(storeId){
        //搜索条件
        this.title="编辑仓库"
        let param = {
          params:{
            depotId: storeId,
          }
        };
        this.ruleForm.depotId = storeId;
        this.axios.get('/storeroom/getOutRecordsList', param).then((response) => {
          if(response.data.code === 200){
            let depotObject = response.data.body.depot;
            depotObject = this.transformObject(depotObject);
            this.ruleForm = {...this.ruleForm, ...depotObject};
            this.tempDepotName = depotObject.depotName;
            if( response.data.body.records.length != 0) {
              this.ruleForm.remark =  response.data.body.records;
            } else {
              this.ruleForm.remark =  [];
            }
            this.dialogVisible = true;
          } else {
            this.$message.error('获取错误');
          }
        })

      },
      // 设置回调
      setShowArrChange(arr) {
        this.setShowArr = arr;
        localStorage.setItem('StorageSetShowArr', JSON.stringify(arr));
        this.settingVisible = false;
      },
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

         //获取人员下拉
      getPeopleList(){
        let param = {
          params:{
            'per_id': 6
          }
        };
        this.peopleArray = [];
        this.axios.get('/account/findAccByPermision', param).then((response) => {
          if(response.data.code === 200){
            this.peopleArray = response.data.body;
          } else {
            this.$message.error('获取错误');
          }
        })
      },
      visitDialog(newVal){
        if(newVal == false){
          this.$refs.ruleForm.resetFields();
          this.ruleForm.remark = [];
          this.ruleForm.depotName ='';
        }
      },
      // 改变每页显示条数触发
      sizeChange (pageSize) {
        this.pageSize = pageSize;
      },
      /*
      *   以下是运行函数
      * */
      currentChange(val){
        this.currentPage = val;
      },
      //删除remark备注
      deleteRemark(item){
        var index = this.ruleForm.remark.indexOf(item);
        if(item.depot_repair_id){
          this.ruleForm.delete_depot_repair_id = this.ruleForm.delete_depot_repair_id + item.depot_repair_id +",";
        }
        if (index !== -1) {
          this.ruleForm.remark.splice(index, 1)
        }
      },
      //添加remark备注
      addRemark(){
        if(this.ruleForm.remark.length==0){
          this.ruleForm.remark =[{
            value: '',
            key: Date.now()
          }];
        } else {
          this.ruleForm.remark.push({
            value: '',
            key: Date.now()
          });
        }
      },
      // 获取搜索内容
      getSearchArr(arr) {
        let searchArr = arr
        this.seaDepodName = ''
        this.seaAccName = ''
        for (let i = 0; i < searchArr.length; i++) {
          if (searchArr[i].selected) {
            if (searchArr[i].label == '仓号') {
              this.seaDepodName = searchArr[i].text
            } else {
              this.seaAccName = searchArr[i].text
            }
          }
        }
      },
      // 点击新增粮仓
      clickAddPeople() {
        this.title="新增粮仓"
        this.tempDepotName='';
        this.dialogVisible = true;
        this.initObj(this.ruleForm);
      },
      //到仓库详情页面
      toStorageDetail(row){
        this.$router.push({name: 'StorageDetails',query: {StorageNum: row.depot_id}})
      },
      // 点击编辑按钮
      handleEdit(index, row) {
        this.dialogVisible = true;
        this.ruleForm = row;
      },
      close() {
        this.dialogVisible = false;
//        this.ruleForm.remark= [{
//          value: ''
//        }];
      },
      // 点击dialog确定按钮
      clickEnterBtn() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let bulidYear = this.ruleForm.bulidYear ? this.formatDate.format(this.ruleForm.bulidYear, "yyyy-MM-dd") : '';
            this.ruleForm.bulidYear = bulidYear;
            const params = this.postDataAndRemark(this.ruleForm, "rec");
            if(this.ruleForm.depotId){
              this.axios.post('/storeroom/updateStoreroom', params).then((response) => {
                if (response.data.code === 200) {
                  this.$message({
                    message: '编辑信息成功',
                    type: 'success',
                  });
                  this.getStorageList();
                  this.initObj(this.ruleForm);
                  this.dialogVisible = false;
                }
              })
            } else {
              this.axios.post('/storeroom/saveStoreroom', params).then((response) => {
                if (response.data.code === 200) {
                  this.$message({
                    message: '添加信息成功',
                    type: 'success',
                  });
                  this.getStorageList();
                  this.initObj(this.ruleForm);
                  this.dialogVisible = false;
                }
              })
            }
            return false;
          }
        })
      },
      //获取仓储表格数据
      getStorageList() {
        //搜索条件
        let param = {
          params:{
            'pageNumber': this.currentPage,
            'pageSize': this.pageSize,
            'depotName': this.seaDepodName,
            'accName': this.seaAccName,
            'type': this.seaType,
            'ventilationForm': this.seaVentilationForm,
            'bulidYear': this.seaBulidYear ? this.formatDate.format(this.seaBulidYear, "yyyy-MM-dd") : '',
            'orderSort': this.orderSort,
            'order': this.order
          }
        };
        this.axios.get('/storeroom/getPageStoreroomList', param).then((response) => {
          if(response.data.code === 200){
            this.tableTotal = response.data.body.totalRow;
            this.tableData = response.data.body.list;
          } else {
            this.$message.error('获取错误');
          }
        })
      },
      postDataAndRemark (obj, pre) {
        let params = {};
        let addArry = [];
        let editArray = [];
        for (let key in obj) {
          if(key == "remark"){
            for(let rekey in obj[key]){
              if(obj[key][rekey].depot_remark){
                if(obj[key][rekey].key || !obj[key][rekey].depot_repair_id){
                  addArry.push(obj[key][rekey]);
                }else {
                  editArray.push(obj[key][rekey]);
                }
              }
            }
          } else{
            if(obj[key]) {
              params[pre + '.' + key] = obj[key];
            }
          }
        }
        for(let i in addArry){
          params['reca['+i+'].add_depot_remark'] = addArry[i].depot_remark;
        }
        for(let i in editArray){
          params['recu['+ i +'].depot_remark'] = editArray[i].depot_remark;
          params['recu['+ i +'].depot_repair_id'] = editArray[i].depot_repair_id;
        }
        if(this.ruleForm.delete_depot_repair_id && this.ruleForm.delete_depot_repair_id.endsWith(',')){
          this.ruleForm.delete_depot_repair_id.substr(0, this.ruleForm.delete_depot_repair_id.length-1);
          params['delete_depot_repair_id'] = this.ruleForm.delete_depot_repair_id;
        }
        return qs.stringify(params)
      }
    }
  }
</script>

<style rel="stylesheet" lang="scss">
  @import '../../assets/scss/main.scss';

  #StorageManagement {
    width: 100%;
    height: 100%;
    .el-table__row:hover {
      cursor: pointer;
    }
    .el-input-group__prepend{
      width: 83px;
    }
    .tableBox {
      @extend %padding;
      @extend %minWidth;
      margin-top: 25px;
    }
    hr{
      border: none;
      border-top: 1px solid #dfe6ec;
      margin-bottom: 25px;
    }
    .deleteBtn {
      color: #ff4949;
      margin-left: 20px;
    }
    #settingVisible{
      .el-dialog--small {
        width: 518px;
        height: 488px;
        .el-dialog__body {
          padding: 30px 30px 0;
          height: 380px;
          .el-transfer-panel__body{
            height: 276px;
          }
        }
      }
    }
    .el-dialog--small {
      width: 719px;
    }
    .el-dialog__body {
      padding: 30px 30px 0;
      height: 530px;
      overflow-y: auto;
      overflow-x: hidden;
      .el-input__inner{
        /*width: 200px;*/
      }
      .deleteClass{
        color: #ff4949;
        margin-left: 30px;
      }
      .el-date-editor{
        width:100%;
      }
    }
  }
</style>
