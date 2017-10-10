<template>
  <div id="Login" @keyup.enter="loginBtnClick">
    <div class="mainBox">
      <div class="center">
        <div class="left"><img src="./images/img-loginLeft.jpg" alt=""></div>
        <div class="right">
          <div class="avatar">
            <img src="./images/img-avatar.png" alt="">
          </div>
          <el-form :model="loginData" :rules="rules" ref="loginData">
            <el-form-item label="账号" prop="loginName">
              <el-input type="text" v-model="loginData.loginName" auto-complete="off" placeholder="输入账号"
                        autofocus></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="loginPwd">
              <el-input :type="this.pwdTypeFlag?'password': 'text'" auto-complete="off"
                        v-model="loginData.loginPwd" placeholder="输入密码" icon="search"
                        :on-icon-click="passwordIconClick"></el-input>
            </el-form-item>
            <el-form-item class="checkBox">
              <el-checkbox class="checkBox-l" v-model="loginData.rememberMe">记住密码</el-checkbox>
            </el-form-item>
            <el-form-item class="btnBox">
              <el-button class="loginBtn" type="primary" :disabled="btnDisabled"
                         @click.native.enter="loginBtnClick" :icon="loadingIcon">登陆
              </el-button>
            </el-form-item>
            <!--<el-form-item class="btnBox">-->
            <!--<el-button size="large" type="text" @click.native="forgetPwdBtnClick">忘记密码</el-button>-->
            <!--</el-form-item>-->
          </el-form>
        </div>
      </div>
    </div>
    <div class="copyRight">Copyright © 2017 杭州与盟医疗技术有限公司</div>
  </div>
</template>

<script>
  import {login} from '@/ajax/index'

  export default {
    name: 'Login',
    data() {
      return {
        loadingIcon: '',
        pwdTypeFlag: true,
        btnDisabled: false,
        loginData: {
          loginName: '',
          loginPwd: '',
          rememberMe: false
        },
        rules: {
          loginName: [
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ],
          loginPwd: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ],
        }
      }
    },
//    watch: {
//      loginData: {
//        handler (newVal,oldVal) {
//          if (newVal.loginName && newVal.loginPwd) {
//            this.btnDisabled = false;
//          } else {
//            this.btnDisabled = true;
//          }
//        },
//        deep: true
//      }
//    },
    activated() {
      if (localStorage.hasOwnProperty('loginData')) {
        let tempObj = JSON.parse(localStorage.getItem('loginData'));
        this.loginData = tempObj
      }
    },
    methods: {
      /*
      *  以下是运行函数
      * */
      // 点击登录按钮
      loginBtnClick() {
        this.$refs.loginData.validate((valid) => {
          if (valid) {
            this.btnDisabled = true;
            this.login()
          }
        })
      },
      // 密码框点击可视按钮
      passwordIconClick() {
        $('#Login').find('.el-input__icon').toggleClass('pwdActive')
        this.pwdTypeFlag = !this.pwdTypeFlag
      },
      // 忘记密码按钮点击
      forgetPwdBtnClick() {
//        alert('忘记密码按钮点击')
      },
      /*
    *  以下是方法
    * */
      // 登录
      login() {
        this.loadingIcon = 'loading';
        login.dologin(this.postData(this.loginData)).then((res) => {
          // console.log('登录res', res)
          if (res.data.code === 200) {
            // 存储权限
            let body = res.data.body;
            if (this.loginData.rememberMe) {
              localStorage.setItem('loginData', JSON.stringify(this.loginData))
            } else {
              localStorage.removeItem('loginData')
            }
            sessionStorage.setItem('userData', JSON.stringify(body.acc));
            sessionStorage.setItem('perList', JSON.stringify(body.per));
            sessionStorage.setItem('loginName', body.acc.acc_name);
            setTimeout(() => {
              this.loadingIcon = '';
              this.btnDisabled = false;
              this.$message({
                showClose: true,
                message: '登录成功',
                type: 'success'
              });
              this.$router.push({name: 'Index', query: {from: 'login'}})
              this.pwdTypeFlag = true;
            }, 300)
          } else {
            setTimeout(() => {
              this.loadingIcon = '';
              this.btnDisabled = false;
              this.$alert(res.data.error, '提示')
            }, 300)
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet" lang="scss">
  @import '../../assets/scss/main.scss';

  #Login {
    position: relative;
    width: 100%;
    height: 100%;
    background: url('./images/bg-login.png') no-repeat center center;
    background-size: 100% 100%;
    .mainBox {
      position: relative;
      height: calc(100% - 48px);
    }
    .center {
      @extend %clearfix;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 869px;
      height: 478px;
      background: $white;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0px 6px 40px 0 #999;
    }
    .left {
      @extend %fl;
      @extend %imgBox;
      width: 512px;
      height: 100%;
    }
    .right {
      @extend %fr;
      width: 869px - 512px;
      height: 100%;
      padding: 36px 32px 0;
      .avatar {
        text-align: center;
        padding-bottom: 10px;
        margin-bottom: 30px;
      }
    }
    .checkBox {
      @extend %clearfix;
      /*margin-top: 50px;*/
      .checkBox-l {
        @extend %fl;
      }
      .checkBox-r {
        @extend %fr;
      }
    }
    .btnBox {
      text-align: center;
    }
    .loginBtn {
      width: 100%;
      height: 100%;
      &:focus {
        border: 1px solid #000000;
        /*color: $yellow;*/
      }
    }
    .el-form-item {
      margin-bottom: 15px;
    }
    .el-input__icon {
      background: url('./images/icon-visibility off.png') no-repeat center center;
      background-size: 22px 22px;
      &:before {
        display: none;
      }
    }
    .pwdActive {
      background: url('./images/icon-visibility.png') no-repeat center center;
      background-size: 22px 22px;
      &:before {
        display: none;
      }
    }
    .copyRight {
      position: absolute;
      /*bottom: 20px;*/
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      line-height: 48px;
      color: $color999;
    }
    .el-checkbox__inner::after {
      transition: none !important;
    }
  }
</style>
