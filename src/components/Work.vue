<template>
  <div class="work">
    <div class="menu">
      <el-button
        v-for="(item, index) of menu"
        :key="index + 1"
        @click="link(item)"
        :style="item.color"
      >
        <img :src="item.img" style="width:28px;height:28px" />
        <span style="font-size:20px">{{ item.name }}</span>
      </el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "Work",
  data() {
    return {
      llist: [],
      list: [
        {
          id: "1",
          name: "考勤管理",
          url: "/attendance",
          img: require("../assets/attendance.png"),
          menu_index: "11",
          color: " background: rgba(33, 152, 255, 1);color: #fff",
        },
        {
          id: "2",
          name: "固定资产",
          url: "/assets",
          img: require("../assets/apply.png"),
          menu_index: "21",
          color: "background-color: #f4b162;color: #fff",
        },
        {
          id: "3",
          name: "会员管理",
          url: "/member",
          img: require("../assets/member.png"),
          menu_index: "31",
          color: "background-color: #fc8675;color: #fff",
        },
        {
          id: "4",
          name: "公文管理",
          url: "/official",
          img: require("../assets/official.png"),
          menu_index: "41",
          color: "background-color: #4acacb;color: #fff",
        },
        // {
        //   id: "5",
        //   name: "文件管理",
        //   url: "/files",
        //   img: require("../assets/files.png"),
        //   menu_index: "51",
        //   color: "background: rgba(33, 152, 255, 1);color: #fff"
        // },
        {
          id: "6",
          name: "请假",
          url: "/leave",
          img: require("../assets/leave.png"),
          menu_index: "61",
          color: " background-color: #af91e1;color: #fff",
        },
        {
          id: "7",
          name: "出差",
          url: "/onbusiness",
          img: require("../assets/onbusiness.png"),
          menu_index: "71",
          color: "background-color: #6a8abe;color: #fff",
        },
        {
          id: "8",
          name: "用户管理",
          url: "/user",
          img: require("../assets/user.png"),
          menu_index: "81",
          color: "background-color: #af91e1;color: #fff",
        },
        {
          id: "9",
          name: "加班",
          url: "/overtime",
          img: require("../assets/overtime.png"),
          menu_index: "91",
          color: "background-color: #fc8675;color: #fff",
        },

        {
          id: "19",
          name: "公务接待",
          url: "/recepiton",
          img: require("../assets/Recepiton.png"),
          menu_index: "101",
          color: "background-color: #f4b162;color: #fff",
        },
        {
          id: "49",
          name: "人事管理",
          url: "/Administration",
          img: require("../assets/renshi.png"),
          menu_index: "409",
          color: "background-color: #f4b162;color: #fff",
        },
        // {id:'9',name:'资费报销',url:'/apply',img:require('../assets/apply.png'),menu_index:'91'}
      ],
      menu: [],
    };
  },
  methods: {
    //  部门加载
    department() {
      let data = new FormData();
      this.$http.post("/uc/depl", data).then((res) => {
        if (res.data != -1002 && res.data != null && res.data != "")
          sessionStorage.setItem("depart_name", JSON.stringify(res.data));
        console.log(res);
      });
    },
    duty() {
      let data = new FormData();
      this.$http.post("/uc/dtl", data).then((res) => {
        if (res.data != -1002 && res.data != null && res.data != "")
          sessionStorage.setItem("duty_name", JSON.stringify(res.data));
        console.log(res);
      });
    },
    //假期类型加载
    vacation_name() {
      let data = new FormData();
      this.$http.post("/job/ql", data).then((res) => {
        if (res.data != -1002 && res.data != null && res.data != "")
          sessionStorage.setItem("vacation", JSON.stringify(res.data));
        console.log(res);
      });
    },
    //固定资产配置
    peizhi() {
      var data = new FormData();
      this.$http.post("/ac/al", data).then((res) => {
        console.log(res.data);
        if (res.data != -1002 && res.data != null && res.data != "")
          this.tableData_pz = res.data;
        if (res.data != -1002 && res.data != null && res.data != "")
          sessionStorage.setItem("peizhi_3", JSON.stringify(res.data));
      });
    },
    user_name() {
      var data = new FormData();
      this.$http.post("/uc/gau", data).then((res) => {
        console.log(res, "name");
        sessionStorage.setItem("user_name", JSON.stringify(res.data));
        // this.tableData_yh=res.data
        //  this.tableData_js=res.data;
      });
    },
    first_menu() {
      let type = "2";
      let a = JSON.parse(sessionStorage.getItem("a"));
      for (var item of a) {
        if (item.match(type)) console.log(item, "选定的菜单");
        // console.log(item)
      }
    },
    link(obj) {
      console.log(obj.color);
      let url = obj.url;
      let name = obj.name;
      this.llist.push(obj);
      console.log(this.llist, "this.llist");
      sessionStorage.setItem("llist", JSON.stringify(this.llist));
      console.log(sessionStorage.getItem("llist"), "后台存储");
      this.$emit("func", obj);
      this.$router.push(url);
    },
  },
  created() {
    this.peizhi();
  },
  mounted() {
    this.peizhi();
    this.user_name();
    this.department();
    this.duty();
    this.vacation_name();
    this.first_menu();
    //页面id识别跳转
    let a = JSON.parse(sessionStorage.getItem("a"));
    for (let item of a) {
      for (let obj of this.list) {
        if (item == obj.id) {
          console.log(obj, "obj");
          this.menu.push(obj);
        }
      }
    }
    console.log(this.menu, "menuuuuuuuuuuu");
    console.log(a, "加载work");
    console.log(location.href, "location.href");
    console.log(top, "top");
    console.log(top.location.href, "top.location.href");
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.color_1 {
  background: rgba(33, 152, 255, 1);
  color: #fff;
}
.color_2 {
  background-color: #f4b162;
}
.color_3 {
  background-color: #4acacb;
  color: #fff;
}
.color_4 {
  background-color: #af91e1;
  color: #fff;
}
.color_5 {
  background-color: #fc8675;
  color: #fff;
}
.color_6 {
  background-color: #6a8abe;
  color: #fff;
}
.menu {
  display: flex;
  flex-flow: row wrap;
}
.menu button {
  width: 16.4%;
  margin: 3% 0 0 3%;
  height: 10vh;
  line-height: 8vh;
  background: #fff;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  border: 0px;
}
.menu button img {
  position: relative;
  top: 5px;
  right: 5px;
}
</style>
