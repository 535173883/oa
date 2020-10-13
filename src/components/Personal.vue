<template>
  <!-- 个人信息 -->
  <div class="review_public">
    <div class="menu">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item v-for="(item,index) of menu" :key="index" :index="item.id">{{item.name}}</el-menu-item>
      </el-menu>
    </div>

    <!-- <div class='content' v-show="activeIndex=='12'">
    </div>-->

    <!-- <div class="tod_header">
      <p>修改密码</p>
      <span></span>
      <i></i>
    </div>-->
    <div class="content_l" v-show="activeIndex=='11'" border>
      <!-- <span>个人信息展示</span> -->
      <div align="left" style="width:100%">
        <el-form label-width="130px" :model="sava_data" ref="sava_data" :rules="rules" disabled>
          <el-form-item label="姓名：" prop="username" style="width:29%; display: inline-block;">
            <el-input v-model="sava_data.username"></el-input>
          </el-form-item>
          <el-form-item label="归属部门：" prop="department" style="width: 29%; display: inline-block;">
            <!-- <el-input v-model="sava_data.department"></el-input> -->
            <el-select v-model="sava_data.department" placeholder="请选择" multiple style="width:100%">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.dname"
                :value="item.did"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="归属职务：" prop="duty" style="width: 29%; display: inline-block;">
            <el-select v-model="sava_data.duty" placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in options_1"
                :key="item.value"
                :label="item.dname"
                :value="item.did"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色：" prop="utype" style="width: 29%; display: inline-block;">
            <el-select
              v-model="sava_data.utype"
              placeholder="请选择"
              :disabled="true"
              style="width:100%"
              multiple
            >
              <el-option
                v-for="item in user_list"
                :key="item.rid"
                :label="item.roleName"
                :value="item.rid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工号：" prop="workno" style="width: 29%; display: inline-block;">
            <el-input v-model="sava_data.workno"></el-input>
          </el-form-item>
          <el-form-item label="民族：" prop="nation" style="width: 29%; display: inline-block;">
            <el-input v-model="sava_data.nation"></el-input>
          </el-form-item>
          <el-form-item label="身份证号：" prop="identity" style="width: 29%; display: inline-block;">
            <el-input v-model="sava_data.identity"></el-input>
          </el-form-item>
          <el-form-item label="年龄：" prop="age" style="width: 29%; display: inline-block;">
            <el-input v-model="sava_data.age"></el-input>
          </el-form-item>
          <el-form-item label="生日：" prop="birthdays" style="width: 29%; display: inline-block;">
            <el-date-picker
              v-model="sava_data.birthdays"
              type="date"
              placeholder="选择日期"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="月份：" prop="month" style="width: 29%; display: inline-block;">
            <el-input v-model="sava_data.month"></el-input>
          </el-form-item>
          <el-form-item label="性别：" prop="sex" style="width:44%;  display: inline-block;">
            <el-radio v-model="sava_data.sex" label="男">男</el-radio>
            <el-radio v-model="sava_data.sex" label="女">女</el-radio>
          </el-form-item>
          <el-form-item label="学历：" prop="education" style="width: 29%; display: inline-block;">
            <el-input v-model="sava_data.education"></el-input>
          </el-form-item>
          <el-form-item label="手机：" prop="mobile" style="width: 29%; display: inline-block;">
            <el-input v-model="sava_data.mobile"></el-input>
          </el-form-item>
          <el-form-item label="人员类别：" prop="ptype" style="width: 29%; display: inline-block;">
            <el-input v-model="sava_data.ptype"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email" style="width: 29%; display: inline-block;">
            <el-input v-model="sava_data.email"></el-input>
          </el-form-item>
          <el-form-item label="家庭住址：" prop="address" style="width: 29%; display: inline-block;">
            <el-input v-model="sava_data.address"></el-input>
          </el-form-item>
          <el-form-item label="入职时间：" prop="entryTimes" style="width: 29%; display: inline-block;">
            <el-date-picker
              v-model="sava_data.entryTimes"
              type="date"
              placeholder="选择日期"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="归属公司：" prop="company">
            <el-input v-model="sava_data.company"></el-input>
          </el-form-item>-->

          <el-form-item
            label="总年假(天)："
            prop="annualleave"
            style="width: 29%; display: inline-block;"
          >
            <el-input v-model="sava_data.annualleave" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item
            label="剩余年假(天)："
            prop="remainannualleave"
            style="width: 29%; display: inline-block;"
          >
            <el-input v-model="sava_data.remainannualleave" :disabled="true"></el-input>
          </el-form-item>
          <!-- <el-form-item label="电话：">
            <el-input v-model="sava_data.email"></el-input>
          </el-form-item>-->

          <el-form-item label="备注：" prop="remark" style="width: 44%; display: inline-block;">
            <!-- <el-input></el-input> -->
            <textarea v-model="sava_data.remark" name id cols="30" rows="10"></textarea>
          </el-form-item>
          <!-- <el-form-item label="用户类型：" prop="utype">
            <el-input v-model="sava_data.utype"></el-input>
          </el-form-item>-->
        </el-form>
        <!-- <div class="save_btn" align="center">
          <el-button type="primary" @click="save_btn('sava_data')">保存</el-button>
        </div>-->
      </div>
      <!-- <div class="content_r">
        <div class="fileBox" v-if="isphoto">
          <input type="file" class="myFile" @change="passport($event,key)" />
          <div class="add">
            <i class="el-icon-plus"></i>
          </div>
          <span>点击上传头像</span>
        </div>

        <div width="240px" v-if="!isphoto">
          <div class="fileInfo" style="display:flex;flex-direction:column ">
            <img width="240px" height="316px" :src="photourl" @dblclick="dianji()" alt />
            <button @click="dianji()" style="width:80px;margin:8px auto">更换头像</button>
          </div>
        </div>
      </div>-->
    </div>
    <div class="content" v-show="activeIndex=='12'">
      <el-form :model="form" status-icon :rules="rules" hide-required-asterisk ref="form">
        <el-form-item label="旧密码" prop="old">
          <el-input show-password v-model="form.old" @blur="opassword()"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input show-password v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repassword">
          <el-input show-password v-model="form.repassword"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" style="width:140px;height:40px" @click="queding('form')">确定</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "xiugai",
  data() {
    //命名规则
    var validatePass2 = (rule, value, callback) => {
      if (this.form.repassword == "") {
        callback(new Error("请再次输入密码"));
      } else if (this.form.repassword != this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      user_list: [],
      photo_id: "",
      options: [],
      options_1: [],
      sava_data: {},
      photourl: "",
      isphoto: true,
      activeIndex: "11",
      menu: [
        { name: "个人信息", id: "11" },
        { name: "修改密码", id: "12" },
      ],

      form: {
        old: "",
        password: "",
        repassword: "",
      },
      photoid: "",
      rules: {
        identity: [
          { required: true, message: "请输入身份证", trigger: "blur" },
        ],
        age: [{ required: true, message: "请输入年龄", trigger: "blur" }],
        birthdays: [{ required: true, message: "请输入生日", trigger: "blur" }],
        sex: [{ required: true, message: "请输入性别", trigger: "blur" }],
        nation: [{ required: true, message: "请输入民族", trigger: "blur" }],
        education: [{ required: true, message: "请输入学历", trigger: "blur" }],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { pattern: /^[0-9]*$/, message: "请输入数字" },
        ],
        email: [
          { required: true, message: "请输入邮箱号", trigger: "blur" },
          // {
          //   pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
          //   message: "请输入正确的邮箱号"
          // }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/,
            message: "请输入字母+数字或字母+特殊字符的组合",
          },
        ],
        repassword: [
          { required: true, validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    logo_return(t) {
      if (t == "") {
        return false;
      }
      let data = new FormData();
      data.append("fid", t);
      this.$http({
        url: "/fmc/dpf",
        method: "post",
        data: data,
        responseType: "blob",
      }).then((res) => {
        var url =
          res.config.url +
          "?t=" +
          sessionStorage.getItem("token") +
          "&fid=" +
          t;
        if (url != null) {
          this.photourl = url;
          this.isphoto = false;
        }
        this.photourl = url;
        console.log(res, "图片下载");
      });
    },
    get_user() {
      let data = new FormData();
      this.$http.post("/uc/rl", data).then((res) => {
        console.log(res);
        this.user_list = res.data;

        // this.tableData_yh=res.data
      });
    },
    user_old() {
      let data = new FormData();
      // data.append('','')
      this.$http.post("/uc/gut", data).then((res) => {
        this.sava_data = res.data;
        if (res.data.duty != "") this.sava_data.duty = Number(res.data.duty);
        var dep = [];
        var vicedep_1 = res.data.utype.split(",");
        for (var ii in vicedep_1) {
          //将每一项转为Number类型以后 增加到定义数组中
          dep.push(parseInt(vicedep_1[ii]));
          console.log(ii);
          console.log(typeof ii);
        }

        if (res.data.department != "") {
          var dep_1 = [];
          var vicedep_2 = res.data.department.split(",");
          for (var ii in vicedep_2) {
            //将每一项转为Number类型以后 增加到定义数组中
            dep_1.push(parseInt(vicedep_2[ii]));
            console.log(ii);
            console.log(typeof ii);
          }
        }

        this.sava_data.department = dep_1;
        this.sava_data.utype = dep;
        // // this.sava_data.department = Number(res.data.department);
        // this.sava_data.duty = Number(res.data.duty);
        this.photo_id = res.data.logo.split(",")[0];
        console.log(res.data.logo.split(",")[0], "diyiwei");
        this.logo_return(this.photo_id);
        console.log(res);
      });
    },
    save_btn(formName) {
      let data = new FormData();
      for (var item in this.sava_data) {
        if (
          this.sava_data[item] != "" &&
          this.sava_data[item] != null &&
          this.sava_data[item] != "undefined"
        ) {
          data.append(item, this.sava_data[item]);
        }
      }
      if (this.photoid != "" && this.photoid != null)
        data.set("logo", this.photoid);
      data.delete("birthday");
      data.delete("lastLoginTime");
      data.delete("annualleave");
      data.delete("remainannualleave");
      data.delete("utype");
      data.delete("entryTime");
      data.delete("endTime");
      data.delete("proTime");
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http({
            url: "/uc/us",
            method: "post",
            data: data,
          }).then((res) => {
            this.$alert("保存成功", "提示", {
              confirmButtonText: "确定",
            });
            console.log(res.data);
          });
        } else {
          this.$alert("信息填写不规范或不完整", "提示", {
            confirmButtonText: "确定",
          });
          return false;
        }
      });
    },
    //修改头像上传
    dianji() {
      this.photourl = "";
      this.isphoto = true;
    },
    //头像上传
    passport(e) {
      // debugger
      console.log(e);
      //获取选定的文件
      let tFiles = e.target.files;
      let len = tFiles.length;
      if (tFiles[0].size > 2000000) {
        this.$alert("文件大小超过2M,请重新选择上传", "提示", {
          confirmButtonText: "确定",
        });
        e.target.value = "";
        return false;
      }
      function createObjectURL(object) {
        return window.URL
          ? window.URL.createObjectURL(object)
          : window.webkitURL.createObjectURL(object);
      }
      for (let i = 0; i < len; i++) {
        //开始上传每一个文件
        let imgurl = createObjectURL(tFiles[i]);
        this.photourl = imgurl;
        console.log(this.photourl);
        console.log(this.photourl, "图片上传回显地址");
        //开始上传文件 新建一个formData
        let param = new FormData();
        param.append("t", sessionStorage.getItem("token"));
        //通过append向form对象添加数据
        param.append("f", tFiles[i]);
        //FormData私有类对象，访问不到，可以通过get判断值是否传进去
        let config = {
          //添加请求头
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        this.$http({
          url: "/fmc/upf",
          method: "post",
          data: param,
          config,
        }).then((res) => {
          console.log(res.data);
          this.photoid = res.data[0].fid;
          console.log(this.photoid, "图片id");
          this.isphoto = false;
        });
      }
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.activeIndex = key;
      console.log(this.activeIndex, "activeIndex");
      console.log(key == this.activeIndex);
    },
    //旧密码校验
    opassword(formName) {
      let data = new FormData();
      data.append("p", this.form.old);
      this.$http({
        url: "/l/opc",
        method: "post",
        data: data,
      }).then((res) => {
        if (res.data == 0) {
          console.log("校验成功");
        } else if (res.data == 1) {
          this.$alert("旧密码验证失败", "提示", {
            confirmButtonText: "确定",
          });
          this.form.old = "";
        }
      });
    },
    //部门加载
    loadingbumens() {
      this.$http({
        url: "/m/al",
        method: "post",
        data: {
          t: sessionStorage.getItem("Token"),
        },
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          }
          return str.join("&");
        },
      }).then((res) => {
        if (res.status == 200) {
          console.log(res.data);
          this.depart = res.data;
        } else {
          this.$alert("部门加载失败", "提示", {
            confirmButtonText: "确定",
          });
        }
      });
    },
    //确定修改按钮
    queding(formName) {
      if (this.form.old == "") {
        this.$alert("请完善旧密码信息", "提示", {
          confirmButtonText: "确定",
        });

        return false;
      }
      let data = new FormData();
      data.append("newPswd", this.form.repassword);
      data.append("oldpswd", this.form.old);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http({
            url: "/uc/upd ",
            method: "post",
            data: data,
          }).then((res) => {
            this.$alert("修改成功", "提示", {
              confirmButtonText: "确定",
            });
            sessionStorage.clear();
            this.$router.push("/login");
          });
        } else {
          this.$alert("信息填写不规范或不完整", "提示", {
            confirmButtonText: "确定",
          });

          document.documentElement.scrollTop = document.body.scrollTop = 0;
          return false;
        }
      });
    },
  },
  mounted() {
    this.get_user();
    this.user_old();
    this.loadingbumens();
    this.$http.post("/uc/depl").then((res) => {
      // console.log(res);
      this.options = res.data;
    });
    this.$http.post("/uc/dtl").then((res) => {
      // console.log(res);
      this.options_1 = res.data;
    });
    // this.handleSelect()
    let num = 0;
    let cum = 0;
    cum = sessionStorage.getItem("indes");
    num = sessionStorage.getItem("index");
    console.log(num);
    console.log(cum);
    this.$emit("func", num, cum);
  },
};
</script>
<style scoped>
/* .save_btn{
    
} */
.add {
  position: absolute;
  left: 0;
  width: 240px;
  height: 300px;
  font-size: 30px;
  top: 0;
  z-index: 98;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fileBox {
  width: 240px;
  height: 300px;
  position: relative;
  border: 1px dashed #c0ccda;
}
.myFile {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  width: 240px;
  height: 340px;
  z-index: 99;
}
.e_photo .add {
  position: absolute;
  left: 0;
  width: 226px;
  height: 316px;
  font-size: 30px;
  top: 0;
  z-index: 98;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content_l {
  display: flex;
  width: 93%;
  height: 530px;
  overflow: auto;
  margin-left: 20px;
  margin-top: 30px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 38px;
  color: rgba(114, 114, 114, 1);
  opacity: 1;
}
.content_r {
  display: flex;
  width: 400px;
  height: 400px;
  margin-left: 60px;
  /* margin-top: 10px; */
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 38px;
  color: rgba(114, 114, 114, 1);
  opacity: 1;
}
.content {
  /* display: flex; */
  width: 400px;
  height: 400px;
  margin-left: 20px;
  margin-top: 80px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 38px;
  color: rgba(114, 114, 114, 1);
  opacity: 1;
  margin: 0 auto;
}
.header_button {
  margin-top: 20px;
  margin-left: auto;
}
/* 设置一些按钮样式 */
.hide {
  display: none;
}
.pass {
  color: green;
}
.fail {
  color: red;
}
.review_public {
  width: 98%;
  height: 90%;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 10px;
}
/* 表头按钮格式 */
/* .review_public >>>.el-menu-demo {
  background-color: #242635;
} */
.review_public_night {
  width: 100%;
  height: 90%;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 10px;
}
.review_public_night >>> .el-menu-demo {
  background-color: #242635;
}
.tod_header {
  margin-left: 30px;
}
.tod_header p {
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  color: rgba(33, 152, 255, 1);
  opacity: 1;
  padding-top: 20px;
  text-align: left;
}
.tod_header span {
  display: block;
  width: 64px;
  height: 4px;
  background: rgba(33, 152, 255, 1);
  opacity: 1;
  margin-top: 10px;
}
.tod_header i {
  display: block;
  width: 94%;
  height: 0px;
  border: 1px solid rgba(229, 229, 229, 1);
  opacity: 1;
  margin-left: 40px;
}
</style>
