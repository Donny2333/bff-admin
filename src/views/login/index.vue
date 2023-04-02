<template>
  <div :class="{ 'main-content': true, mainbackground: true }">
    <div class="login_box">
      <div class="left">
        <!-- <img :src="require('@/assets/images/login-logo.svgd')"/> -->
      </div>
      <div class="right">
        <div class="title">账号密码登录</div>
        <a-form :model="form" :layout="layout">
          <a-form-item field="loginName" label="用户名">
            <a-input v-model="form.loginName" placeholder="请输入用户名">
              <template #prepend>
                <svg-icon
                  name="login-i"
                  style="width: 14px; height: 14px; font-size: 14px"
                ></svg-icon>
              </template>
            </a-input>
          </a-form-item>
          <a-form-item field="password" label="密码">
            <a-input-password v-model="form.password" placeholder="请输入密码">
              <template #prepend>
                <svg-icon
                  name="password-i"
                  style="width: 14px; height: 14px; font-size: 14px"
                ></svg-icon>
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item field="isRead">
            <a-checkbox v-model="form.isRead"> 记住用户名和密码 </a-checkbox>
            <div style="margin-left: 78px" class="blue-text-button">
              忘记密码
            </div>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" style="width: 100%" @click="onSubmit"
              >登录</a-button
            >
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login-view",
};
</script>
<script setup>
import { useStore } from "vuex";
import { login } from "@/assets/api/api";
import { reactive, ref } from "vue";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
const layout = ref("vertical");
const form = reactive({
  loginName: "",
  password: "",
});
const store = useStore();
// const state = store.state;

const router = useRouter();
const onSubmit = () => {
  if (!form.loginName) {
    Message.error("请输入用户名" || "网络错误");
    return false;
  }
  if (!form.password) {
    Message.error("请输入密码" || "网络错误");
    return false;
  }
  // if (!this.form.checksumCode) {
  //   this.$message({
  //     message: "请输入验证码",
  //     type: "warning",
  //   });
  //   return false;
  // }

  login(form).then((res) => {
    if(res.code !=200){
      Message.error({
        content:res.msg,
         duration: 2000
      })
      return
    }
    store.commit("SetToken", res.data.token);
    store.commit("LoginIn", res.data);
    //  localStorage.setItem("TOKEN",res.data.token)
    //  localStorage.setItem("USERINFO",JSON.stringify(res.data) )
    router.push({ path: "/dict" });
  });
  // this.$router.push({ path: "cardiac" });
};
</script>
<style lang="less">
.login {
  .el-button--primary {
    background-color: #1459fa;
  }
  .el-form-item__label {
    float: none;
    word-break: break-word;
    font-size: 12px;
    color: #071f4b;
    font-weight: 400;
  }
  .el-form {
    margin-top: 20px;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 10px;
  }
  .el-button--text {
    color: #177bff;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #177bff;
  }
  .el-checkbox__label {
    font-size: 12px;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #276bdd;
    font-size: 12px;
  }
  .icon_user {
    // background:url(../assets/icons/login-icon-user.svg)no-repeat 0 0;
    width: 24px;
    height: 32px;
    display: inline-block;
    background-size: 15px 22px;
    background-position: 5px 5px;
  }
  .icon_pwd {
    // background:url(../assets/icons/login-icon-pwd.svg)no-repeat 0 0;
    width: 24px;
    height: 32px;
    display: inline-block;
    background-size: 15px 22px;
    background-position: 5px 5px;
  }
  .icon_rcode {
    // background:url(../assets/icons/login-icon-rcode.svg)no-repeat 0 0;
    width: 24px;
    height: 32px;
    display: inline-block;
    background-size: 15px 22px;
    background-position: 5px 5px;
  }
}
</style>
<style lang="less" scoped>
.main-content {
  background: url("@/assets/images/login-back.png") no-repeat center;
  // background-size: cover;
  // width: 100%;
  // height: 100%;
  // position: relative;
  background-size: cover;
  height: 100%;
  margin: 0;
  .login_box {
    width: 696px;
    height: 424px;
    display: flex;
    transform: translate(-50%, -50%);
    position: absolute;
    top: 50%;
    left: 50%;
    .left {
      width: 329px;
      height: 424px;
      background: url("@/assets/images/login-logo.svg") no-repeat center;
      background-color: rgba(20, 89, 250, 0.75);
      // background-size: 329px 424px;
      padding: 0px 40px;
    }
    .right {
      width: 367px;
      // height:424px;
      background: rgba(255, 255, 255, 1);
      border-radius: 0 10px 10px 0;
      padding: 40px 48px;
      .title {
        font-size: 16px;
        color: #343d4e;
        line-height: 24px;
        font-weight: 600;
        margin-bottom: 20px;
      }
    }
  }
  /deep/ .arco-input-wrapper {
    border: 1px solid #dbdde0;
    border-left-width: 0;
    background: #fff;
    padding-left: 0;
  }
  /deep/ .arco-input::-webkit-input-placeholder {
    color: #c3c6cb;
  }
  /deep/.arco-checkbox {
    padding-left: 0px;
  }
  /deep/.arco-input-prepend {
    border: 1px solid #dbdde0;
    background: #fff;
    border-right-width: 0;
    svg {
      color: #9398a1;
    }
  }
}
</style>