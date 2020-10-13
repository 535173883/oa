<template>
  <div id="login">
    <div class="login_top">
      <div class="circle circle1"></div>
      <div class="circle circle2"></div>
      <div class="circle circle3"></div>
      <div class="circle circle4"></div>
      <div class="circle circle5"></div>
    </div>
    <div class="login_center">
      <div class="circle circle6"></div>
      <p>中国远洋渔业协会</p>
      <div class="login_form">
        <el-input placeholder="请输入手机号" v-model="mobile" clearable></el-input>
        <el-input
          placeholder="请输入密码"
          @keyup.enter.native="login()"
          v-model="password"
          show-password
        ></el-input>
        <button @click="login()">登录</button>
        <!-- <button @click="register">注册</button> -->
        <!-- Form -->
        <el-dialog title="用户注册" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
          <el-form :model="user" :rules="rules" ref="user">
            <el-form-item label="姓名" :label-width="formLabelWidth" prop="username">
              <el-input v-model="user.username" placeholder="请输入您的真实姓名"></el-input>
            </el-form-item>
            <!-- <el-form-item label="部门" :label-width="formLabelWidth" prop="department">
            <el-select v-model="user.department" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.dname"
                :value="item.did">
              </el-option>
            </el-select>
            </el-form-item>-->
            <!-- <el-form-item label="职务" :label-width="formLabelWidth" prop="duty">
              
              <el-select v-model="user.duty" placeholder="请选择">
                <el-option
                  v-for="item in options_1"
                  :key="item.did"
                  :label="item.dutyname"
                  :value="item.did">
                </el-option>
            </el-select>
            </el-form-item>-->
            <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
              <el-input v-model="user.mobile" placeholder="请输入11位手机号"></el-input>
            </el-form-item>
            <el-form-item label="E-mail" :label-width="formLabelWidth" prop="email">
              <el-input v-model="user.email"></el-input>
            </el-form-item>

            <!-- <el-form-item label="用户类型" :label-width="formLabelWidth" prop="utype">
              <el-input v-model="user.utype"></el-input>
            </el-form-item>
            <el-form-item label="工号" :label-width="formLabelWidth" prop="workno">
              <el-input v-model="user.workno"></el-input>
            </el-form-item>-->

            <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
              <el-input v-model="user.password" show-password placeholder="请输入数字，字母，符号两种以上的组合"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" :label-width="formLabelWidth" prop="repassword">
              <el-input v-model="user.repassword" show-password clearable placeholder="请再次输入密码"></el-input>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
              <el-input v-model="user.remark"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" align="center">
            <el-button @click="cancel()">取 消</el-button>
            <el-button type="primary" @click="submit('user')">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="circle circle7"></div>
    </div>
    <div class="login_bottom">
      <div class="circle circle8"></div>
      <div class="circle circle9"></div>
      <div class="circle circle10"></div>
      <div class="circle circle11"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (this.user.repassword == "") {
        callback(new Error("请再次输入密码"));
      } else if (this.user.repassword != this.user.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      mobile: "",
      password: "",
      dialogFormVisible: false,
      formLabelWidth: "120px",
      user: {
        company: "",
        department: "",
        duty: "",
        email: "",
        telephone: "",
        intelephone: "",
        mobile: "",
        utype: "",
        workno: "",
        username: "",
        password: "",
        remark: "",
        del: "",
        flag: "",
        lastLoginTime: "",
        logo: "",
        salt: "",
      },
      rules: {
        mobile: [
          { required: true, message: "请输入11位手机号码", trigger: "blur" },
          {
            pattern: /^1[34578]\d{9}$/,
            message: "请输入正确的格式",
            trigger: "blur",
          },
        ],
        username: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            message: "密码长度至少6位且由字母、数字或字符组成",
            pattern: /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{6,}$/,
            trigger: "blur",
          },
        ],
        repassword: [
          { required: true, validator: validatePass2, trigger: "blur" },
        ],
      },
      options: [],
      options_1: [],
    };
  },
  methods: {
    // getVerifyCode_111(){
    //   console.log(213213);
    //   // data.append('time_quantum',1)
    //     this.$http.get('/ebsGrade/list',{
    //       params: {
    //       time_quantum:'1'
    //       // userid: this.$root.userid
    //       },
    //   }).then(res=>{
    //     console.log(res)
    //   })
    //   },
    cancel() {
      console.log(this.$refs.user, "this.$refs.user");
      this.dialogFormVisible = false;
      this.$refs.user.resetFields();
    },
    login() {
      let data = new FormData();
      data.append("m", this.mobile);
      data.append("p", this.password);
      this.$http
        .post("/l/l", data)
        .then((res) => {
          console.log(res);
          if (res.status == 200 && res.data != -1) {
            sessionStorage.setItem("token", res.data.t);
            //对传入数组做去重以及排序操作 防止菜单排列错乱
            let ag = JSON.parse(JSON.stringify(res.data.a));
            ag = ag.sort(function (a, b) {
              return a > b ? 1 : -1;
            });
            ag = new Set(ag);
            console.log(res);
            this.$message({
              type: "success",
              message: "登陆成功",
            });
            // console.log(JSON.stringify(ag),"排序后的a权限");
            sessionStorage.setItem("a", JSON.stringify(new Set(res.data.a)));
            // sessionStorage.setItem("a", JSON.stringify(ag));
            console.log(JSON.stringify(new Set(res.data.a)), "传入的权限参数");
            this.$router.push("/work");
          }
          if (res.data == -1) {
            this.$message.error("登录失败，手机号或密码错误");
            this.password = "";
          }
        })
        .catch((error) => {
          this.$message.error("登录失败，手机号或密码错误");
          this.password = "";
        });
    },
    register() {
      this.dialogFormVisible = true;
    },

    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          let data = new FormData();
          console.log(this.user);
          for (var key in this.user) {
            if (this.user[key]) {
              data.append(key, this.user[key]);
              console.log(this.user[key]);
            }
          }
          this.$http.post("/l/r", data).then((res) => {
            console.log(res);
            if (res.data == 0) {
              this.$message({
                message: "注册成功",
                type: "success",
              });
              this.$refs.user.resetFields();
            } else {
              this.$message.error("注册失败，该手机号或名字已被注册");
            }
          });
        } else {
          this.$message.error("信息填写不规范或不完整");
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
  mounted() {
    // this.getVerifyCode_111();
    this.$http.post("/uc/depl").then((res) => {
      // console.log(res);
      this.options = res.data;
    });
    this.$http.post("/uc/dtl").then((res) => {
      // console.log(res);
      this.options_1 = res.data;
    });
  },
  created() {
    var that = this;
  },
};
</script>
<style scoped>
#login {
  overflow: hidden;
}
.login_top,
.login_center,
.login_bottom {
  position: relative;
}
.login_top {
  height: 31.25vh;
}
.login_bottom {
  height: 35.5vh;
}
.login_center {
  height: 28.75vh;
}
.login_form {
  width: 320px;
  margin: 0 auto;
  margin-top: 10px;
}
.login_center p {
  font-size: 36px;
  color: rgba(51, 153, 255, 1);
  letter-spacing: 20px;
  text-align: center;
}
.login_form > button {
  width: 100%;
  height: 40px;
  border-radius: 3px;

  background-image: linear-gradient(to right, #86dcf9, #3399ff);
  border: 0px;
  color: #fff;
  font-size: 16px;
}
.login_form .el-input {
  /* box-shadow: 0px 3px 6px rgba(0,0,0,0.16); */
  margin: 5px 0;
}
.el-form-item > div > .el-input {
  width: 70%;
}
.el-form-item .el-select {
  width: 70%;
}
.circle {
  background: rgba(51, 153, 255, 1);
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.16);
  border-radius: 50%;
  position: absolute;
}
.circle1 {
  width: 25vh;
  height: 25vh;
  top: -9.6vh;
  left: -5.6vh;
}
.circle2 {
  width: 7.5vh;
  height: 7.5vh;
  top: 17.5vh;
  left: 17.25vh;
}
.circle3 {
  width: 3vh;
  height: 3vh;
  top: 27.75vh;
  left: 26.75vh;
}
.circle4 {
  width: 25vh;
  height: 25vh;
  top: -18.75vh;
  right: 42.5vh;
}
.circle5 {
  width: 25vh;
  height: 25vh;
  top: -7.5vh;
  right: -10.86vh;
}
.circle6 {
  width: 12.5vh;
  height: 12.5vh;
  top: 8.6vh;
  left: -10.13vh;
}
.circle7 {
  width: 7.88vh;
  height: 7.88vh;
  top: 27.25vh;
  right: 22.5vh;
}
.circle8 {
  width: 18.75vh;
  height: 18.75vh;
  top: 8.75vh;
  left: -11.25vh;
}
.circle9 {
  width: 8.5vh;
  height: 8.5vh;
  top: 6.25vh;
  left: 43.63vh;
}
.circle10 {
  width: 18.75vh;
  height: 18.75vh;
  top: 21.63vh;
  right: 32.13vh;
}
.circle11 {
  width: 18.75vh;
  height: 18.75vh;
  top: 8.38vh;
  right: -10.63vh;
}
</style>
