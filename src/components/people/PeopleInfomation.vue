<template>
  <div id="PeopleInfomation">
    <!--头部标题-->
    <g-header leftTitle="人员管理" set @set="settingVisible = true">
      <g-addButton title="添加人员" slot="btnRight" @emitClickAddBtn="addBtnClick"></g-addButton>
    </g-header>
    <!--搜索框-->
    <div class="mainBox">
      <g-searchBox :optionArr="['姓名','工号']"
                   @emitSearchArr="getSearchArr">
        <el-select slot="selectOne" v-model="tableParams.depart_id"
                   clearable placeholder="部门">
          <el-option
            v-for="(item,index) in departmentArr" :key="index"
            :label="item.depart_name" :value="item.depart_id"
            @click.native="depart_nameClick(item.depart_name)">
          </el-option>
        </el-select>
      </g-searchBox>
      <!--表格-->
      <div class="tableBox">
        <el-table :data="tableData" border @sort-change="sortChange">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column v-if="setShowArr.includes('depart_name')" prop="depart_name" label="部门" sortable="custom">
          </el-table-column>
          <el-table-column v-if="setShowArr.includes('acc_name')" prop="acc_name" label="姓名" sortable="custom">
          </el-table-column>
          <el-table-column v-if="setShowArr.includes('acc_phone')" prop="acc_phone" label="手机号" sortable="custom">
          </el-table-column>
          <el-table-column v-if="setShowArr.includes('acc_phone_cornet')" prop="acc_phone_cornet" label="手机短号"
                           sortable="custom">
          </el-table-column>
          <el-table-column v-if="setShowArr.includes('acc_username')" prop="acc_username" label="登陆账号"
                           sortable="custom">
          </el-table-column>
          <el-table-column v-if="setShowArr.includes('acc_job_number')" prop="acc_job_number" label="工号"
                           sortable="custom">
          </el-table-column>
          <el-table-column v-if="setShowArr.includes('acc_login_time')" prop="acc_login_time" label="最后登陆时间"
                           sortable="custom" width="180px">
          </el-table-column>
          <el-table-column v-if="setShowArr.includes('acc_times')" prop="acc_times" label="访问次数" sortable="custom">
          </el-table-column>
          <el-table-column label="操作" width="236">
            <template scope="scope">
              <el-button type="text" @click="editClick(scope.$index,scope.row)">
                <i class="iconfont icon-edit"></i>编辑
              </el-button>
              <el-button class="deleteBtnClass" type="text" :disabled="scope.row.acc_id == selfAcc_id"
                         @click="deleteClick(scope.$index,scope.row)">
                <i class="iconfont icon-shanchu"></i>删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--点击添加人员弹出框-->
    <g-dialog @cancelBtnClick="dialogVisible = false" width="719" :visible="dialogVisible" :title="dialogTitle"
              :addNext="addNextShow" @emitAddNext="clickEnterBtn('add')"
              @close="dialogClose"
              @emitClickEnterBtn="clickEnterBtn('enter')">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="acc_name">
              <el-input v-model="ruleForm.acc_name" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="acc_phone">
              <el-input v-model="ruleForm.acc_phone" :maxlength="11" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机短号" prop="acc_phone_cornet">
              <el-input v-model="ruleForm.acc_phone_cornet" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录账号" prop="acc_username">
              <el-input v-model.trim="ruleForm.acc_username" placeholder="账号请以字母开头"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工号" prop="acc_job_number">
              <el-input v-model="ruleForm.acc_job_number" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="默认密码" prop="acc_password" v-if="dialogTitle === '添加人员'">
              <el-input v-model="ruleForm.acc_password" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!--<el-form-item v-if="dialogTitle === '添加人员'" label="部门" prop="depart_id">-->
            <el-form-item label="部门" prop="depart_id">
              <el-select v-model="ruleForm.depart_id" placeholder="请选择" clearable>
                <el-option
                  v-for="(item,index) in departmentArr" :key="index"
                  :label="item.depart_name"
                  :value="item.depart_id">
                </el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item v-else label="部门" prop="depart_name">-->
              <!--<el-input v-model="ruleForm.depart_name"></el-input>-->
            <!--</el-form-item>-->
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="role_id">
              <el-select v-model="ruleForm.role_id" placeholder="请选择" multiple clearable>
                <el-option
                  v-for="(item,index) in roleArr" :key="index"
                  :label="item.role_name" :value="item.role_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="短信提醒" class="cancelMarginBottom">
          <el-switch
            v-model="switchValue"
            @change="hstaff_sms_setChange">
          </el-switch>
        </el-form-item>
      </el-form>
    </g-dialog>
    <!--分页-->
    <g-pagenation :pageSize="tableParams.pageSize" :total="totalRow"
                  @size-change="sizeChange"
                  @current-change="currentChange"></g-pagenation>
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
  import {people} from '@/ajax/index'

  export default {
    name: 'PeopleInfomation',
    data() {
      return {
        selfAcc_id: '',
        settingVisible: false,    // 设置参数开始
        setShowArr: [],
        setNameArr: [],
        setAllArr: [],           // 设置参数结束
        inpShow: false,
        departmentArr: [],
        roleArr: [],
        dialogVisible: false,
        totalRow: 1,
        dialogTitle: '',
        accId: '',
        pwdRequiredFlag: true,
        addNextShow: false,
        switchValue: false,
        optionArr: [],   // searchText
        tableData: [],
        tableParams: {
          depart_id: '',
          depart_name: ``,
          pageNumber: 1,    // 分页
          pageSize: 10,
          acc_name: '',
          acc_job_number: '',
          acc_phone: '',
          acc_username: '',
          orderSort: 'acc_id',
          order: `desc`
        },
        ruleFormPick: [],
        ruleFormExtend: {},
        ruleForm: {
          acc_id: ``,
          acc_name: '',
          acc_phone: '',
          acc_phone_cornet: '',
          acc_username: '',
          hstaff_sms_set: 2,
          acc_password: '',
          acc_job_number: '',
          depart_id: '',
          depart_name: ``,
          role_id: []
        },
        rules: {
          acc_name: {required: true, message: '请输入姓名', trigger: 'blur'},
          acc_phone_cornet: {pattern: /^\d+$/, message: '请输入数字', trigger: 'blur'},
          acc_phone: {required: true, validator: this.validatePhone, trigger: 'blur'},
          acc_username: {required: true, validator: this.validateAccount, trigger: 'blur'},
          acc_password: {required: true, validator: this.validatePwd, trigger: 'blur'},
          depart_id: {required: true, type: 'number', message: '请输入部门', trigger: 'change'},
          depart_name: {required: true, message: '请输入部门', trigger: 'blur'},
          role_id: {required: true, type: 'array', message: '请选择角色', trigger: 'change'},
          acc_job_number: {required: true, message: '请输入工号', trigger: 'blur'}
        },
        editObj: {},
        formObj: {}
      }
    },
    watch: {
      tableParams: {
        handler(newVal, oldVal) {
          this.getAllEngineerInfo()
        },
        deep: true
      }
    },
    created() {
      // 处理pick extend
      this.ruleFormPick = Object.keys(this.ruleForm);
      this.ruleFormExtend = {...this.ruleForm};
      // 设置
      if (localStorage.hasOwnProperty('PeopleSetShowArr')) {
        this.setShowArr = JSON.parse(localStorage.getItem('PeopleSetShowArr'))
      } else {
        this.setShowArr = ['depart_name', 'acc_name', 'acc_phone', 'acc_phone_cornet', 'acc_username', 'acc_job_number', 'acc_login_time', 'acc_times'];
      }
      this.setAllArr = ['depart_name', 'acc_name', 'acc_phone', 'acc_phone_cornet', 'acc_username', 'acc_job_number', 'acc_login_time', 'acc_times'];
      this.setNameArr = ['部门', '姓名', '手机号', '手机短号', '登陆账号', '工号', '最后登陆时间', '访问次数']
      this.selfAcc_id =  JSON.parse(sessionStorage.getItem('userData')).acc_id;
    },
    activated() {

      // 调用方法
      this.getDepartments();
      this.getAllEngineerInfo();
      this.getRole();
    },
    methods: {
      /*
      *   以下是运行函数
      * */
      // 表格排序
      sortChange(obj) {
        this.tableParams.orderSort = obj.prop;
        if (obj.order === 'ascending') {
          this.tableParams.order = 'asc'
        } else if (obj.order === 'descending') {
          this.tableParams.order = 'desc'
        } else {
          this.tableParams.order = ''
        }
      },
      // 点击添加人员
      addBtnClick() {
        this.inpShow = true;
        this.addNextShow = true;
        this.dialogTitle = '添加人员';
        this.ruleForm.acc_password = 888888;
        this.rules.acc_password.required = true;
        this.pwdRequiredFlag = true;
        this.dialogVisible = true;
      },
      // 点击编辑按钮
      editClick(index, row) {
        // console.log('row', row);
        this.inpShow = false;
        this.addNextShow = false;
        this.dialogTitle = '编辑人员';
        if (row.hstaff_sms_set === 1) {
          this.switchValue = true
        } else {
          this.switchValue = false
        }
        this.ruleForm = {...this.ruleForm, ...row};
        if (row.role_id) {
          this.ruleForm.role_id = this.strTurnArr(row.role_id)
        } else {
          this.ruleForm.role_id = []
        }
        this.rules.acc_password.required = false;
        // 保存编辑对象
        this.editObj = {...this.ruleForm};
        this.dialogVisible = true;
      },
      // 弹框关闭
      dialogClose() {
        this.$refs.ruleForm.resetFields();
        this.dialogVisible = false;
        this.ruleForm = {...this.ruleFormExtend};
      },
      // 点击dialog确定按钮
      clickEnterBtn(btnText) {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.addEngineerInfo(btnText);
          }
        });
      },
      // 点击删除按钮
      deleteClick(index, row) {
        this.accId = row.acc_id
        // 人员删除
        let params = {accId: this.accId}
        this.$confirm('是否确认删除？', '提示').then(() => {
          people.delEngineerInfo(params).then(res => {
            this.getAllEngineerInfo()
            this.$message({
              showClose: true,
              message: res.data.error,
              type: 'success'
            });
          })
        })
      },
      /*
      *   以下是处理数据函数
      * */
      // 设置回调
      setShowArrChange(arr) {
        this.setShowArr = arr;
        localStorage.setItem('PeopleSetShowArr', JSON.stringify(arr));
        this.settingVisible = false;
      },
      // 分页 pageSize 改变时会触发
      sizeChange(pageSize) {
        this.tableParams.pageSize = pageSize
      },
      // currentPage 改变时会触发
      currentChange(currentPage) {
        this.tableParams.pageNumber = currentPage
      },
      // 搜索框获取搜索内容
      getSearchArr(arr) {
        this.tableParams.acc_name = '';
        this.tableParams.acc_job_number = '';
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].selected) {
            if (arr[i].label === '姓名') {
              this.tableParams.acc_name = arr[i].text
            } else {
              this.tableParams.acc_job_number = arr[i].text
            }
          }
        }
      },
      // switch开关change事件
      hstaff_sms_setChange(value) {
        if (value) {
          this.ruleForm.hstaff_sms_set = 1
        } else {
          this.ruleForm.hstaff_sms_set = 2
        }
      },
      // 部门change
      depart_nameClick(val) {
        this.tableParams.depart_name = val
      },
      /*
      *   以下是方法
      * */
      // 获取部门
      getDepartments() {
        people.getDepartments().then(res => {
          this.departmentArr = res.data.body
        })
      },
      // 员工分页数据post
      getAllEngineerInfo() {
        people.getAllEngineerInfo(this.postData(this.tableParams, 'rec')).then(res => {
          console.log('员工分页数据post',this.tableParams,res)
          if (res.data.code === 200) {
            this.tableData = res.data.body.list;
            this.totalRow = res.data.body.totalRow;
          }
        })
      },
      // 添加/编辑用户post
      addEngineerInfo(btnText) {
        // 数据转化
        this.formObj = {...this.ruleForm};
        if (_.isEqual(this.editObj, this.formObj)) {
          this.dialogVisible = false
          return
        }
        let params = _.pick(this.ruleForm, ...this.ruleFormPick);
        params.role_id = params.role_id.join(',');
         // console.log('添加/编辑用户params',params)
        people.addEngineerInfo(this.postData(params, 'rec')).then(res => {
          // console.log('添加/编辑用户res',res)
          if (res.data.code === 200) {
            if (this.selfAcc_id == params.acc_id) {
              this.$router.push({name: 'Login'});
              this.$message({
                showClose: true,
                message: '修改自己的数据需要重新登录',
                type: 'success'
              });
              this.dialogVisible = false
            } else {
              this.$message({
                showClose: true,
                message: res.data.error,
                type: 'success'
              });
              if (btnText === 'enter') {
                this.dialogVisible = false
              } else {
                this.ruleForm = {...this.ruleFormExtend};
                this.ruleForm.acc_password = 888888;
                this.$refs.ruleForm.resetFields();
                this.dialogVisible = true
              }
              this.getAllEngineerInfo();
            }
          } else {
            this.$alert(res.data.error, '提示')
          }
        })
      },
      // 获取角色
      getRole() {
        people.getRole().then(res => {
          // console.log('获取角色res', res)
          this.roleArr = res.data.body;
        })
      }
    }
  }
</script>

<style rel="stylesheet" lang="scss">
  @import '../../assets/scss/main.scss';

  #PeopleInfomation {
    width: 100%;
    height: 100%;
    .iconfont {
      margin-right: 2px;
    }
    .deleteBtnClass {
      &:not(:disabled) {
        color: #ff4949;
      }
      &:not(:disabled):hover {
        color: #ff4949;
        opacity: 0.8;
      }
      margin-left: 20px;
    }
  }
</style>
