<template>
  <div id="PlanManagement">
    <!--头部标题-->
    <g-header leftTitle="计划列表" set @set="settingVisible = true">
      <g-addButton title="新增计划" slot="btnRight" @emitClickAddBtn="AddPlan"></g-addButton>
    </g-header>
    <div class="mainBox">
    <g-searchBox :optionArr="['品名','计划名称','发货单位','收货单位']"  @emitSearchArr="getPlanSearchArr">

      <el-select class="selectionBox" slot="selectOne"
                 v-model="seaType"
                 clearable>
        <el-option
          v-for="(item,index) in items" :key="index"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker slot="selectTwo"
                      v-model="seaIntime"
                      type="date"
                      placeholder="开始时间">
      </el-date-picker>
      <el-date-picker slot="selectThree"
                      v-model="seaOuttime"
                      type="date"
                      placeholder="结束时间">
      </el-date-picker>
    </g-searchBox>
    <div id="List">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        @row-click="planDetail"
        @sort-change="sortChange">
        <el-table-column v-if="setShowArr.includes('plan_name')" show-overflow-tooltip
                         prop="plan_name"
                         label="名称" sortable="custom">
        </el-table-column>
        <el-table-column v-if="setShowArr.includes('typeName')" show-overflow-tooltip
                         prop="typeName"
                         label="类型" sortable="custom">
        </el-table-column>
        <el-table-column v-if="setShowArr.includes('variety_name')" show-overflow-tooltip
                         prop="variety_name"
                         label="品名" sortable="custom">
        </el-table-column>
        <el-table-column v-if="setShowArr.includes('shipping_frim_name')" show-overflow-tooltip
                         prop="shipping_frim_name"
                         label="发货单位" sortable="custom">
        </el-table-column>
        <el-table-column v-if="setShowArr.includes('receiving_frim_name')" show-overflow-tooltip
                         prop="receiving_frim_name"
                         label="收货单位" sortable="custom">
        </el-table-column>
        <el-table-column v-if="setShowArr.includes('notice_num')" show-overflow-tooltip
                         prop="notice_num"
                         label="计划数" sortable="custom">
        </el-table-column>
        <el-table-column v-if="setShowArr.includes('state')" show-overflow-tooltip
                         prop="state"
                         label="计划状态" sortable="custom">
          <template scope="scope">
           <span>{{scope.row.state === 1?`未完成`:`完成`}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="setShowArr.includes('in_time')" show-overflow-tooltip
                         prop="in_time"
                         label="进出库时间">
        </el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="method"
                         label="操作"
                         width="220px"
        >
          <template scope="scope">
            <div>
              <el-button @click.stop="confirmPlanComBut(scope.row)" type="text"
                         icon="circle-cross"
                         class = 'planBut'
                         v-if="scope.row.state == '2'">
                取消
              </el-button>
              <el-button @click.stop="confirmPlanComBut(scope.row)" type="text"
                         icon="circle-check"
                         class = 'planBut'
                          v-else>
                 完成
              </el-button>
              <el-button @click.stop="EditPlan(scope.row.plan_id)" type="text" class="EditBtn">
                <i class="iconfont icon-edit"></i>编辑
              </el-button>
              <el-button @click.stop="detelePlanManage(scope.row.plan_id)" type="text" class="delWeight">
                <i class="iconfont icon-shanchu"></i>删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    </div>
    <!--分页-->
    <g-pagenation :pageSize="10" :total="tableTotal"
                  @size-change="sizeChange"
                  @current-change="currentChange"></g-pagenation>

    <!--新增计划-->
      <g-dialog @cancelBtnClick="addPlanVisible = false"  :visible="addPlanVisible" :title="title"
                :width="760"
                @close="dialogClose" @emitClickEnterBtn="clickEnterBtn">
      <el-form :model="planform" :rules="planRules" ref="planform" label-width="80px">
        <el-row :gutter="20">

          <el-col :span="12" style="height:58px;">
            <el-form-item label="计划类型" prop="type" class="chooseType" >
              <el-radio-group v-model="planform.type" v-if="planform.planId">
                <el-radio-button label="1" name="type" :disabled="planform.type==2">出库</el-radio-button>
                <el-radio-button label="2" name="type" :disabled="planform.type==1">入库</el-radio-button>
              </el-radio-group>
              <el-radio-group v-model="planform.type" v-else >
                <el-radio-button label="1" name="type" >出库</el-radio-button>
                <el-radio-button label="2" name="type" >入库</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划名称" prop="planName">
              <el-input v-model="planform.planName" placeholder="请输入" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文件号" prop="fileCode">
              <el-input v-model="planform.fileCode" placeholder="请输入" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货单位" prop="shippingFrimName" :class="{ 'is-required': isRequired }">
              <el-autocomplete
                class="inline-input"
                v-model="planform.shippingFrimName"
                :fetch-suggestions="querySearchShip"
                placeholder="请输入内容"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品名" prop="varietyName" :class="{ 'is-required': isRequired }" class="chooseType">
              <el-autocomplete v-if="planform.planId"
                class="inline-input"
                v-model="planform.varietyName"
                :fetch-suggestions="querySearchVariety"
                placeholder="请输入内容"
                @select="handleSelect"
                 disabled
              ></el-autocomplete>
              <el-autocomplete v-else
                 class="inline-input"
                 v-model="planform.varietyName"
                 :fetch-suggestions="querySearchVariety"
                 placeholder="请输入内容"
                 @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货单位" prop="receivingFrimName" :class="{ 'is-required': isRequired }">
              <el-autocomplete
                class="inline-input"
                v-model="planform.receivingFrimName"
                :fetch-suggestions="querySearchReceiv"
                placeholder="请输入内容"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用途" prop="useType">
              <el-input v-model="planform.useType" placeholder="请输入" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产年度" prop="productionYear">
              <el-date-picker
                v-model="planform.productionYear"
                align="right"
                type="year"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="等级" prop="level" class="chooseType">
              <el-select v-model="planform.level" placeholder="请选择">
                <el-option label="国标一级" value="1"></el-option>
                <el-option label="国标二级" value="2"></el-option>
                <el-option label="国标三级" value="3"></el-option>
                <el-option label="国标四级" value="4"></el-option>
                <el-option label="国标五级" value=5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始时间" prop="inOutStartTime">
              <el-date-picker
                v-model="planform.inOutStartTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="inOutEndTime">
              <el-date-picker
                v-model="planform.inOutEndTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <hr>
        <el-row :gutter="20" v-for="(depot, index) in planform.depotInfo"
                label=""
                :key="index">
          <el-col :span="12" class="colItem">
            <el-form-item label="仓号"
                          :prop="'depotInfo.' + index + '.depotId'"
                          :rules="{type:'number', required: true, message: '仓号不能为空', trigger: 'change'}"
                          class="chooseType"
            >
              <!--<el-input v-model="depot.depotId"></el-input>-->
              <el-select v-model="depot.depotId" filterable clearable  placeholder="请选择" value-key="frim_id">
                <el-option
                  v-for="itemArray in storeroomListArray" :key="itemArray.depot_id"
                  :label="itemArray.depot_name"
                  :value="itemArray.depot_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="colItem">
            <el-form-item label="数量"
                          :prop="'depotInfo.' + index + '.number'"
              :rules="[
              {pattern: /^[0-9]+\.{0,1}[0-9]{0,2}$/,message: '重量只能输入数字形式'}
              ]"
            >
              <el-input v-model="depot.number"></el-input>
            </el-form-item>
          </el-col>
          <!--<span class="del" @click.stop="deleteDepotNumber(depot)" v-show="index != 0" >删除</span>-->
          <span class="del" @click.stop="deleteDepotNumber(depot)">删除</span>
        </el-row>
        <hr>
        <e-row :gutter="20">
          <el-form-item label="备注" class="remarks" prop="remark">
            <el-input type="textarea" v-model="planform.remark" maxlength="50"></el-input>
          </el-form-item>
        </e-row>
      </el-form>
        <el-button @click.native="addDepotNum" slot="leftBtn">新增仓号</el-button>
      </g-dialog>
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
    data() {
      const generateData = _ => {
        const data = [];
        const cities = ['编号', '名称', '品种', '计划数', '用途', '类型', '生产年度','等级','出库时间'];
        cities.forEach((city, index) => {
          data.push({
            label: city,
            key: index,
          });
        });
        return data;
      };
      var validateVarietyInfo = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择品类'));
        }else {
          callback();
        }
      };
      var validateDateInfo = (rule, value, callback) => {
         if(value && this.planform.inOutStartTime && value < this.planform.inOutStartTime){
          callback(new Error('进出库结束时间大于开始时间'));
        } else {
          callback();
        }
      };
      var validateStartDateInfo = (rule, value, callback) => {
        if(value && this.planform.inOutEndTime && value > this.planform.inOutEndTime){
          callback(new Error('进出库结束时间大于开始时间'));
        } else {
          callback();
        }
      };
      return {
        settingVisible: false,    // 设置参数开始
        setShowArr: [],
        setNameArr: [],
        setAllArr: [],           // 设置参数结束
        data: generateData(),
        settingShowList:[],
        searchValue: '',
        items: [{
          value: '',
          label: '全部订单'
        }, {
          value: '1',
          label: '出库订单'
        }, {
          value: '2',
          label: '入库订单'
        }],
        tableData: [],
        // dialog默认隐藏
        addPlanVisible:false,
        // 右对齐
        labelPosition: 'right',
        planform: {
          planId:'',
          type: 1,
          fileCode: '',
          varietyName: '',
          useType: '',
          level:'',
          planName: '',
          shippingFrimName: '',
          receivingFrimName: '',
          productionYear: '',
          inOutStartTime: '',
          inOutEndTime:'',
          depotInfo:[{
            depotId: '',
            number: ''
          }],
          remark:''
        },
        planRules: {
          planName: [
            {required: true, message: '请输入计划名称', trigger: 'blur'}
          ],
          shippingFrimName: [
            {required: true, message: '请输入或者选择发货单位', trigger: 'change'},
            {max: 20, message: '长度在20个字符以内', trigger: 'change'  }
          ],
          receivingFrimName: [
            {required: true, message: '请输入或者选择收货单位', trigger: 'change'},
            {max: 20, message: '长度在20个字符以内', trigger: 'change'  }
          ],
          varietyName: [
            {validator: validateVarietyInfo, trigger: 'change'}
          ],
          inOutEndTime: [
            {validator: validateDateInfo, trigger: 'change'}
          ],
          inOutStartTime: [
            {validator: validateStartDateInfo, trigger: 'change'}
          ]

        },
        //总条数
        tableTotal:1,
        pageSize: 10,
        currentPage: 1,
        //定义搜索条件的变量
        seaproduName:'',
        seaPlanName:'',
        seaShippingFrimName:'',
        seaReceivingFrimName:'',
        seaType:'',
        seaIntime:'',
        seaOuttime:'',
        //生成编码时的临时变量
        tempPlanType:'',
        tempPlanId:'',
        carInfo: '',
        //添加仓库的两个下拉框
        varietyArray:[],
        recCompanyArray:[],
        shipCompanyArray:[],
        storeroomListArray:[],
        isRequired: true,
        restaurants: [],
        state1: '',
        orderSort: 'plan_id',
        order: 'desc',
        //刪除倉庫id
        deleteIds:'',
        //比较是否是添加还是比较
        firstVarietyName :'',
        firstVarietyId :'',
      };
    },
    computed: {
      watchTabelData() {
        return [
          this.currentPage,
          this.pageSize,
          this.seaproduName,
          this.seaPlanName,
          this.seaShippingFrimName,
          this.seaReceivingFrimName,
          this.seaType,
          this.seaIntime,
          this.seaOuttime,
          this.orderSort,
          this.order,
        ];
      },
      typeDate(){
        return this.planform.type
      },
      watchDialogVis(){
        return this.addPlanVisible
      },
    },
    watch: {
      watchTabelData: {
        handler(newVal, oldVal) {
          if(this.seaOuttime && this.seaIntime){
            if(this.seaOuttime >= this.seaIntime){
              this.getPlanManageList();
            } else {
              this.$message.error("结束时间大于开始时间");
              this.seaOuttime = '';
            }
          } else {
            this.getPlanManageList();
          }

        },
        deep: true
      },
      typeDate :{
        handler(newVal, oldVal) {
          this.planform.shippingFrimName ="",
            this.planform.receivingFrimName ="",
          this.getCompanyList();
        }
      },
      watchDialogVis :{
        handler(newVal, oldVal) {
          this.visitDialog(newVal);
        }
      }
    },
    created() {
      // 设置
      if (localStorage.hasOwnProperty('PlanSetShowArr')) {
        this.setShowArr = JSON.parse(localStorage.getItem('PlanSetShowArr'))
      } else {
        this.setShowArr = ['plan_name', 'typeName', 'variety_name', 'shipping_frim_name', 'receiving_frim_name', 'notice_num', 'state','in_time'];
      }
      this.setAllArr = ['plan_name', 'typeName', 'variety_name', 'shipping_frim_name', 'receiving_frim_name', 'notice_num', 'state','in_time'];
      this.setNameArr = ['名称', '类型', '品名', '发货单位', '收货单位', '计划数','计划状态','进出库时间']
    },
    mounted() {
//      this.restaurants = this.loadAll();
    },
    activated() {
      this.getPlanManageList();
      this.getVarietyList();
      this.getCompanyList();
      this.getStoreroomList();
    },
    deactivated() {
    },
    methods: {
      /*
      *   以下是运行函数
      * */
      //选择品种
      handleSelect(item){
        this.planform.varietyId = item.variety_id;
        this.planform.varietyName = item.value;
      },
      //删除计划
      detelePlanManage(planId){
        this.$confirm('是否确认删除？', '提示').then(() => {
          this.axios.delete('/planManagement/deletePlan',{
            params:{
              'planId' : planId
            }
          }).then((response) => {
            if(response.data.code === 200){
              this.$message({
                message: '删除成功',
                type: 'success',
              });
              this.getPlanManageList();
            } else if(response.data.code === 500){
              this.$message.error(response.data.error);
            }
          }).catch((error) => {
            this.$message.error(error);
          });

        })
      },
      // 弹框关闭
      dialogClose() {
        this.addPlanVisible = false
      },
      // 设置回调
      setShowArrChange(arr) {
        this.setShowArr = arr;
        localStorage.setItem('PlanSetShowArr', JSON.stringify(arr));
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
      //完成计划方法
      confirmPlanComBut(row){
        let str = '计划是否完成';
        let paramState =  2;
        if(row.state == 2){
          str = '计划是否取消完成'
          paramState = 1;
        }
        this.$confirm(str, '提示').then(() => {
          this.axios.get('/planManagement/upstate', {
            params: {
              plan_id: row.plan_id,
              state: paramState,
            }
          }).then((response) => {
            if (response.data.code === 200) {

              this.$message.success('确认成功');
              this.getPlanManageList();
              //TODO
            } else {
              this.$message.error(response.data.error);
            }
          }).catch((error) => {
            this.$message.error('获取异常');
          });
        });
      },
      visitDialog(newVal){
        if(newVal == false){
          this.$refs.planform.resetFields();
        }
      },
      querySearchVariety(queryString, cb) {
        var restaurants = this.varietyArray;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      querySearchReceiv(queryString, cb) {
        var restaurants = this.shipCompanyArray;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      querySearchShip(queryString, cb) {
        var restaurants = this.recCompanyArray;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.indexOf(queryString.toLowerCase()) === 0);
        };
      },
      //删除仓号
      deleteDepotNumber(item){
        if(item.planDepotId){
          this.deleteIds += item.planDepotId +",";
        }
        var index = this.planform.depotInfo.indexOf(item)
        if (index !== -1) {
          this.planform.depotInfo.splice(index, 1)
        }
      },
      //新增仓号
      addDepotNum(){
        if(this.planform.depotInfo.length==0){
          this.planform.depotInfo =[{
            depotId: '',
            number: ''
          }];
        } else {
          this.planform.depotInfo.push({
            depotId: '',
            number: ''
          });
        }
      },
      //获取计划列表
      getPlanManageList(){
        //搜索条件
        let param = {
          params:{
            'rec.pageNumber': this.currentPage,
            'rec.pageSize': this.pageSize,
            'rec.varietyName': this.seaproduName,
            'rec.planName': this.seaPlanName,
            'rec.shippingFrimName': this.seaShippingFrimName,
            'rec.receivingFrimName': this.seaReceivingFrimName,
            'rec.type': this.seaType,
            'rec.inOutStartTime': this.seaIntime ? this.formatDate.format(this.seaIntime, "yyyy-MM-dd") : '',
            'rec.inOutEndTime': this.seaOuttime ? this.formatDate.format(this.seaOuttime, "yyyy-MM-dd") : '',
            'rec.orderSort':this.orderSort,
            'rec.order':this.order,
          }
        };
        this.axios.get('/planManagement/findPagePlanList', param).then((response) => {
          if(response.data.code === 200){
            this.tableTotal = response.data.body.totalRow;
            this.tableData = response.data.body.list;
            for(let item of  this.tableData){
              if(!item.in_out_start_time){
                item.in_out_start_time = "暂无"
              }
              if(!item.in_out_end_time){
                item.in_out_end_time = "暂无"
              }
              item.in_time = item.in_out_start_time+' -- '+item.in_out_end_time;
              if (item.type == 1) {
                item.typeName = "出库订单";
              } else if (item.type == 2) {
                item.typeName = "入库订单";
              } else {
                item.typeName = "";
              }
            }
          } else {
            this.$message.error('获取错误');
          }
        })
      },
      //新增计划
      AddPlan() {
        this.title="新增计划"
        this.planform.depotInfo = [{
          depotId: '',
          number: ''
        }];
        this.planform.planId = '';
//        console.log("this.$refs.planform",this.$refs.planform);
//        this.$refs.planform.resetFields();
        this.initObj(this.planform);
        this.planform.type = 1;
        this.planform.depotInfo=[{
          depotId: '',
          number: ''
        }],
        this.addPlanVisible = true;

      },
      //编辑计划
      EditPlan(planId){
        this.title="编辑计划"
        let param = {
          params:{
            'planId': planId
          }
        };
        this.planform.planId =  planId;
        this.axios.get('/planManagement/findPlanEdit', param).then((response) => {
          if(response.data.code === 200){
            //计划的基本信息
            let baseInfo = response.data.body.basicInfoList;
            //计划仓库
            let planList = response.data.body.planList;

            this.planform.depotInfo = [];
            //TODO
            this.planform.type =  baseInfo.type;
            this.planform.fileCode =  baseInfo.file_code;
            this.firstVarietyName = baseInfo.variety_name;
            this.firstVarietyId = baseInfo.variety_id;
            this.planform.varietyId = baseInfo.variety_id;
            this.planform.varietyName = baseInfo.variety_name;
            this.planform.useType =  baseInfo.use_type;
            this.planform.level =  baseInfo.level;
            this.planform.planName =  baseInfo.plan_name;
            this.planform.shippingFrimName =  baseInfo.shipping_frim_name;
            this.planform.receivingFrimName =  baseInfo.receiving_frim_name;
            this.planform.productionYear =  baseInfo.production_year;
            this.planform.inOutStartTime =  baseInfo.in_out_start_time;
            this.planform.inOutEndtTime =  baseInfo.in_out_end_time;
            this.planform.state =  baseInfo.state;
            for(var index in planList){
              this.planform.depotInfo.push({
                depotId: planList[index].depot_id,
                number: planList[index].number,
                planDepotId: planList[index].plan_depot_id
              })
            }
            this.planform.remark =  baseInfo.remark;
            this.deleteIds = '';
            this.addPlanVisible = true;
          } else {
            this.$message.error('获取错误');
          }
        })

      },
      //提交新增计划表单
      clickEnterBtn(){
        this.$refs.planform.validate((valid) => {
          if (valid) {
            let startTime =this.planform.inOutStartTime;
            let endTime = this.planform.inOutEndTime;
            this.planform.inOutStartTime = startTime ? this.formatDate.format(startTime, "yyyy-MM-dd") : '';
            this.planform.inOutEndTime = endTime ? this.formatDate.format(endTime, "yyyy-MM-dd") : '';
            this.planform.productionYear = this.planform.productionYear ? this.formatDate.format(this.planform.productionYear, "yyyy") : '';
            if(this.firstVarietyName != this.planform.varietyName && this.firstVarietyId == this.planform.varietyId){
              this.planform.varietyId = '';
            }
            const params = this.postPlanData(this.planform, "rec");
            if(!params){
              return ;
            }
            if(this.planform.planId){
              this.axios.post('/planManagement/updatePlan', params).then((response) => {
                if (response.data.code === 200) {
                  this.$message({
                    message: '編輯信息成功',
                    type: 'success',
                  });
                  this.addPlanVisible = false;
                  this.getPlanManageList();
                  this.getCompanyList();
                  this.getVarietyList();
                }
              })
            } else {
              this.axios.post('/planManagement/savePlan', params).then((response) => {
                if (response.data.code === 200) {
                  this.$message({
                    message: '添加信息成功',
                    type: 'success',
                  });
                  this.addPlanVisible = false;
                  this.getPlanManageList();
                  this.getCompanyList();
                }
              })
            }
            return false;
          }
        })
      },
      //点击table单行跳转
      planDetail(row){
        this.$router.push({name: 'PlanDetails',query: {planId: row.plan_id}})
      },

      // 每次显示条数改变 触发
      sizeChange (pageSize) {
        this.pageSize = pageSize;
      },

      // currentPage 改变时会触发
      currentChange (currentPage) {
        this.currentPage = currentPage;

      },

      // 获取搜索内容
      getPlanSearchArr(arr) {
        let searchArr = arr;
        this.seaproduName ='';
        this.seaPlanName ='';
        this.seaShippingFrimName ='';
        this.seaReceivingFrimName ='';
        for (let i = 0; i < searchArr.length; i++) {
          if (searchArr[i].selected) {
            if (searchArr[i].label == '品名') {
              this.seaproduName = searchArr[i].text
            } else if (searchArr[i].label == '计划名称') {
              this.seaPlanName = searchArr[i].text
            } else if (searchArr[i].label == '发货单位') {
              this.seaShippingFrimName = searchArr[i].text
            } else {
              this.seaReceivingFrimName = searchArr[i].text
            }
          }
        }
      },
      //转化字符串
      postPlanData (obj, pre) {
        let params = new URLSearchParams()
        for (let key in obj) {
          if(!obj[key]){
            obj[key] == null;
          }
          params.append(pre + '.' + key, obj[key])
          if(key == "depotInfo"){
            let sumnotic = 0;
            let isDouble = "";
            for(let index in obj[key]){
              for(let depKey in obj[key][index]){
                if(depKey == 'planDepotId'){
                  //如果id存在加上去
                  if(obj[key][index][depKey]){
                    params.append('recs['+ index +'].'+depKey, obj[key][index][depKey]);
                  }
                }
                if(depKey == 'depotId'){
                  params.append('recs['+ index +'].'+depKey, obj[key][index][depKey]);
                  if(isDouble){
                    if(isDouble.indexOf(obj[key][index][depKey])>-1) {
                      this.$alert("不能添加同样的仓库",'提示')
                      return false;
                    }
                  }
                  isDouble +=obj[key][index][depKey] + ',';
                }
                if(depKey == 'number'){
                  params.append('recs['+ index +'].'+depKey, obj[key][index][depKey])
                  sumnotic += Number(obj[key][index][depKey]);
                }
              }
            }
            params.append('rec.noticeNum', sumnotic);
          }
        }
        if(this.deleteIds && this.deleteIds.endsWith(',')){
          this.deleteIds = this.deleteIds.substr(0, this.deleteIds.length-1);
          params.append( 'delete_plan_depot_id', this.deleteIds);
        }
        return params
      },
      //获取品种的下拉列表
      getVarietyList(){
        this.varietyArray = [];
        this.axios.get('/checkManagement/getVarietyList').then((response) => {
          if(response.data.code === 200){
            for(var index in response.data.body){
              this.varietyArray.push({
                value: response.data.body[index].variety_name,
                variety_id: response.data.body[index].variety_id,
              });
            }

          } else {
            this.$message.error('获取222错误');
          }
        })
      },
      //获取单位的下拉列表
      getCompanyList(){
        let type = 1;
        if(this.planform.type == 1){
          type = 2;
        }else {
          type = 1;
        }
        let param = {
          params:{
            'frimType': type
          }
        };
        this.shipCompanyArray = [];
        this.recCompanyArray = [];
        let tempObj = JSON.parse(sessionStorage.getItem('userData'));
        this.axios.get('/planManagement/selectFrim', param).then((response) => {
          if(response.data.code === 200){
            let nameArray = tempObj.granary_name.split(",");
            if(this.planform.type == 2){
              for(var index in nameArray){
                this.shipCompanyArray.push({
//                  lable:nameArray[index],
                  value:nameArray[index]
                });
              }
              for(var index in response.data.body){
                this.recCompanyArray.push({
                  value:response.data.body[index]
                })
              }
            } else {
              for(var index in nameArray){
                this.recCompanyArray.push({
                  value:nameArray[index]
                });
              }
              for(var index in response.data.body){
                this.shipCompanyArray.push({
                  value:response.data.body[index]
                })
              }
            }
          } else {
            this.$message.error('获取错误');
          }
        })
      },
      //获取仓库的下拉菜单
      getStoreroomList(){
        this.axios.get('/storeroom/getStoreroomList').then((response) => {
          if(response.data.code === 200){
            this.storeroomListArray = response.data.body;
          } else {
            this.$message({message: '获取错误',type: 'error'});
          }
        })
      },
      sizeChange (pageSize) {
        this.pageSize = pageSize;
      }
    }
  }
</script>

<style rel="stylesheet" lang="scss">
  @import '../../assets/scss/main.scss';
  @import '../plan/css/PlanManagement.scss';
  .el-table__row:hover {
    cursor: pointer;
  }
  .del {
    margin-left: -7px;
  }
</style>
