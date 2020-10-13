<template>
  <div id="app" @mouseover="OperatingWebsite()">
    <router-view v-if="isAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  //自定义刷新页面方式 无刷新页面闪现感
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isAlive: true,
      currentTime: new Date().getTime(),
    };
  },
  methods: {
    //检测两个小时未进行操作进行重新登录
    OperatingWebsite() {
      let currentTime = this.currentTime;
      // console.log(currentTime, "currentTime");
      let lastTime = new Date().getTime();
      // console.log(lastTime, "lastTime");
      let timeOut = 90 * 60 * 1000; //设置时间 10分钟
      //let timeOut = 5000;
      if (lastTime - currentTime > timeOut) {
        // 未操作页面，跳转登录页面
        this.currentTime = new Date().getTime();
        // const fullPath = this.$route.fullPath;
        // const query = this.$Base64.encode(fullPath);
        //   alert("长时间未进行操作,请重新登录账号");
        this.$alert("长时间未进行操作,请重新登录账号", "提示", {
          confirmButtonText: "确定",
        });
        sessionStorage.clear();
        this.$router.push({
          path: "/login",
          query: {
            id: 2,
          },
        });
      } else {
        this.currentTime = new Date().getTime();
      }
    },
    reload() {
      this.isAlive = false;
      this.$nextTick(function () {
        this.isAlive = true;
      });
    },
  },
};
</script>
<style>
html {
  margin: 0 auto;
}
body {
  margin: 0;
  height: 100vh;
}
#app {
  font-family: Microsoft YaHei;
  text-align: center;
  font-weight: 400;
  line-height: 21px;
  height: 99%;
  overflow: hidden;
}
p {
  margin: 0;
  padding: 0;
}
</style>
