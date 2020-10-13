<template>
  <div id="root">
    <header :class=" [isActive ?'day':'night']">
      <div class="float">
        <img
          src="@/assets/yuanyang.png"
          alt="yuanyang"
          style="width:40px;height:40px;margin-right:20px"
        />
        <span>中国远洋渔业协会办公系统</span>
        <div v-if="float.name">
          <div class="float_up" @click="tofloat">
            <span>{{float.name}}</span>
            <i class="el-icon-close" @click="close"></i>
          </div>
        </div>
      </div>
      <div class="person">
        <div>
          <i
            class="iconfont icon-email"
            @click="$router.push('/information')"
            style="cursor:pointer;"
          ></i>
          <el-badge :value="mess" class="item">
            <!-- <i class="iconfont icon-email"></i> -->
          </el-badge>
        </div>
        <div class="dropdown" @mouseenter="show1=true" @mouseleave="show1=false">
          <!-- <img  src="@/assets/333.png" alt="" width="40px" height="40px">  -->
          <i class="iconfont icon-person"></i>
          <span>{{username}}</span>
        </div>
        <!--  -->
        <div
          class="dropdown_menu"
          @mouseenter="show2=true"
          @mouseleave="show2=false"
          v-if="show1==true||show2==true"
        >
          <div v-for="(item,index) in dropdown_menu" :key="index" @click="handleCommand(index)">
            <el-button type="primary">{{item}}</el-button>
          </div>
        </div>
      </div>
    </header>
    <div :class=" [isActive ?'container':'container_night']">
      <div class="left">
        <div
          v-for="(item,index) in left"
          :class="{'active':index == i }"
          :key="index"
          @click="c_left(index,item.url)"
        >
          <i :class="item.font"></i>
          <!-- <el-badge :value="3" class="item">
            {{item.name}}
          </el-badge>-->
          <el-badge
            :is-dot="(item.name=='通知公告'&&notice==true)?true:false "
            class="item"
          >{{item.name}}</el-badge>
        </div>
      </div>
      <div class="right">
        <div style="overflow-y:auto">
          <router-view @func="getWork" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  name: "Root",
  data() {
    return {
      manager_status: false,
      notice: false,
      username: "",
      value: false,
      isActive: true,
      mess: "",
      float: {},
      i: 0,
      left: [],
      show1: false,
      show2: false,
      dropdown_menu: ["个人信息", "退出"],
    };
  },
  methods: {
    //获取未读信息
    get_mess() {
      let that = this;
      let data = new FormData();
      this.$http.post("/trMessage/wr", data).then((res) => {
        console.log(res, "未读消息");
        if (res.data) {
          that.mess = res.data.length;
        }
      });
    },
    //剩余年假截取
    get_user() {
      let data = new FormData();
      // data.append('','')
      this.$http.post("/uc/gut", data).then((res) => {
        this.username = res.data.username;
        sessionStorage.setItem("username", this.username);
        sessionStorage.setItem("personal_post", res.data.duty);
        sessionStorage.setItem("roletype", res.data.utype);
        console.log(this.left, "asdasdasd");
        let user_root = res.data.utype.split(",");
        console.log(user_root, "asdasdas");
        function checkAdult(user) {
          return user == "3";
        }
        this.left = [
          { name: "工作", url: "/work", font: "el-icon-menu" },
          { name: "通知公告", url: "/message", font: "el-icon-s-promotion" },
          { name: "通讯录", url: "/address", font: "el-icon-phone" },
          { name: "个人信息", url: "/personal", font: "el-icon-user-solid" },
        ];
        console.log(user_root.some(checkAdult));
        if (user_root.some(checkAdult)) {
          this.left.push({
            name: "权限管理",
            url: "/manage",
            font: "el-icon-s-tools",
          });
        }
        console.log(res, "用户内容");
      });
    },
    night(type) {
      // sessionStorage.setItem("night",type)
      // console.log(type,"黑夜类型");
      if (type == true) {
        this.$store.commit("hide");
        console.log(this.$store.state.night, "黑夜属性");
        sessionStorage.setItem("night", this.$store.state.night);
        console.log(sessionStorage.getItem("night"), "仓库中的夜晚属性");
        this.isActive = false;
        // this.reload()
      } else if (type == false) {
        this.$store.commit("show");
        console.log(this.$store.state.night, "黑夜属性");
        sessionStorage.setItem("night", this.$store.state.night);
        console.log(sessionStorage.getItem("night"), "仓库中的夜晚属性");
        this.isActive = true;
        // this.reload()
      }
    },
    handleReload() {
      this.reload(); // 在想要刷新页面的时候调用reload方法
    },
    getWork(obj) {
      this.float = obj;
      console.log(obj, "floooo");
      console.log(this.float);
      console.log(this.float.length);
      obj = JSON.stringify(obj);
      sessionStorage.setItem("float", obj);
      // console.log( sessionStorage.setItem("float", obj),"follllll");
    },
    tofloat() {
      console.log(this.float);
      if (this.float.url != "") {
        //
        let url = this.float.url;
        // console.log(url,'url');
        this.$router.push(url);
        this.reload();
        // this.i=0;
      }
    },
    newlist() {
      let data = new FormData();
      data.append("r", 0);
      this.$http.post("/not/list", data).then((res) => {
        console.log(res, "/not/list");
        for (let item of res.data) {
          if (item.isread == 0) {
            this.notice = true;
          }
        }
        // this.newslist=res.data
      });
    },
    ismanager() {
      let data = new FormData();
      // data.append('','')
      this.$http.post("/not/cim", data).then((res) => {
        this.manager_status = res.data;
        console.log(res);
      });
    },
    close() {
      if (parseInt(this.i) == 0) {
        //工作区域关闭浮窗
        this.$router.push("/work");
      }
      this.float = {};
      sessionStorage.removeItem("float");
      console.log(parseInt(this.i));
    },
    c_left(index, url) {
      this.i = index;
      sessionStorage.setItem("index", index);
      this.$router.push(url);
    },
    handleCommand(command) {
      if (command == 0) {
        this.$router.push("/personal");
      }
      if (command == 1) {
        sessionStorage.clear();
        this.$router.push("/");
      }
    },
  },
  mounted() {
    this.ismanager();
    this.newlist();
    this.get_user();
    this.get_mess();
    // let nighth=sessionStorage.getItem("night")
    // console.log(nighth,"黑夜仓库值");
    // this.night(nighth)
    let float = sessionStorage.getItem("float");
    console.log(float, "float");
    float = JSON.parse(float);
    let index = sessionStorage.getItem("index");
    if (float) this.float = float;
    if (index) this.i = index;
    console.log(this.float, "调用 mounted--float");
    console.log(this.i, "调用 mounted--index");
  },
};
</script>
<style scoped>
.day {
  background: #45aeea;
  color: white;
}
.night {
  background: #242635;
  color: white;
}
.float_up {
  margin-top: 0.9vh;
  margin-left: 80px;
  width: 113px;
  height: 40px;
  line-height: 40px;
  background: #45aeea;
  opacity: 1;
  border-radius: 4px;
}
.float_up span {
  color: white;
  font-weight: bold;
  /* text-align:center;
  margin-top: 10px; */
  text-align: center;
}
.float_up i {
  color: white;
}
#root {
  height: 99%;
}
header {
  min-width: 500px;
  height: 7.5%;
  line-height: 7.5vh;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  color: #707070;
  padding-left: 30px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}
header .float {
  display: flex;
  align-items: center;
  cursor: pointer;
}
header .float > span:first-child {
  font-size: 20px;
  margin-right: 30px;
}
header .float > div > span:last-child {
  font-size: 18px;
  color: #707070;
}
header .person,
header .person > div {
  display: flex;
}
.person {
  position: relative;
}
header .person > div {
  margin-right: 30px;
}
header .person i {
  font-size: 32px;
}
header .person span {
  margin-left: 10px;
}
header .dropdown_menu {
  display: block !important;
  width: 134px;
  height: 155px;
  position: absolute;
  top: 30px;
  /* left:10px; */
  background: #fff;
  color: #3399ff;
  z-index: 1000;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  right: 16px;
  line-height: 70px;
}
header .dropdown_menu button {
  width: 100px;
  font-size: 16px;
}
.container {
  display: flex;
  width: 100%;
  height: 92.5%;
  margin-top: 5px;
}
.container > .right {
  width: 85%;
  min-width: 830px;
  background: #f5f5f5;
}
.container > .right:before {
  content: "";
  display: table;
}
.container > .right > div {
  height: 98.8%;
  margin: 10px;
  margin-top: 5px;
  background: #fff;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}
.container > .left {
  width: 15%;
  min-width: 170px;
  color: #707070;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}
.container > .left > div {
  height: 5vh;
  line-height: 3.6vh;
  cursor: pointer;
  text-align: start;
}
.container > .left > div:first-child {
  margin-top: 30px;
}
.container > .left > div i {
  margin-right: 5px;
  margin-left: 48px;
}

/* 夜晚模式 */
.container_night {
  display: flex;
  width: 100%;
  height: 92.5%;
  /* margin-top: 5px; */
}
.container_night > .right {
  width: 85%;
  min-width: 830px;
  background: #242635;
}
.container_night > .right:before {
  display: table;
}
.container_night > .right > div {
  height: 98.8%;
  margin: 10px;
  margin-top: 5px;
  background: #242635;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}
.container_night > .left {
  width: 15%;
  min-width: 170px;
  background: #242635;
  color: white;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}
.container_night > .left > div {
  height: 5.6vh;
  line-height: 5.6vh;
  cursor: pointer;
  text-align: start;
}
.container_night > .left > div:first-child {
  margin-top: 30px;
}
.container_night > .left > div i {
  margin-right: 5px;
  margin-left: 48px;
}

.active {
  background: rgba(51, 153, 255, 0.2);
  color: #3399ff;
}
.item {
  margin-top: -10px;
}
</style>
