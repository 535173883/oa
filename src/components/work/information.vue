<template>
  <div style="overflow:auto">
    <div class="table_top">
      <div style class="button">
        <span>
          <span>姓名/单位名称 ：</span>
          <el-input type="text" placeholder="搜索姓名/单位名称" v-model="content1_v" style="width:170px" />
        </span>

        <!-- <el-input style="width: 300px;" v-model="input" placeholder="请输入内容"></el-input> -->
        <el-button @click="messOut" type="success">查看所有消息</el-button>
        <el-button @click="mess" type="danger">查看未读消息</el-button>
      </div>
      <div class="table_content">
        <el-table
          :data="tableData.filter(data => !content1_v || data.createUname.toLowerCase().includes(content1_v.toLowerCase())).slice((this.currentPage1-1)*this.pageSize,this.currentPage1*this.pageSize)"
          border
          style="width: 100%"
          ref="tableData"
        >
          <el-table-column prop="createUname" label="姓名/单位名称"></el-table-column>
          <el-table-column label="类型">
            <template
              slot-scope="scope"
            >{{scope.row.messagetype==3?'会员申请':scope.row.messagetype==4?'发文审批':scope.row.messagetype==6?'公务接待':scope.row.messagetype==9?'固定资产折旧':scope.row.messagetype==8?'会员到期':scope.row.messagetype==7?'合同到期':scope.row.messagetype==1?'请假':scope.row.messagetype==0?'出差':'加班'}}</template>
          </el-table-column>
          <el-table-column prop="createDateStr" label="通知时间"></el-table-column>
          <el-table-column show-overflow-tooltip prop="remark" label="消息内容"></el-table-column>
          <el-table-column label="是否已读">
            <template slot-scope="scope">{{scope.row.isread==1?'已读':'未读'}}</template>
          </el-table-column>
          <el-table-column prop label="操作">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
              <!-- <el-button type="text" size="small">编辑</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
      </div>
    </div>
    <div class="block">
      <el-pagination
        :current-page.sync="currentPage1"
        :page-size="10"
        layout="prev, pager, next, jumper"
        :total="tableData.filter(data => !content1_v || data.createUname.toLowerCase().includes(content1_v.toLowerCase())).length"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "information",
  data() {
    return {
      createUname: "",
      pageSize: 10, //每页条数
      currentPage1: 1,
      content1_v: "",
      input: "",
      tableData: [],
      url: {
        list: "/trMessage/gaM",
        weidu: "/trMessage/wr",
      },
    };
  },
  methods: {
    mess() {
      let that = this;
      let data = new FormData();
      this.$http.post(that.url.weidu, data).then((res) => {
        console.log(res, "未读消息");
        if (res.data) {
          this.tableData = res.data;
        }
      });
    },
    messOut() {
      let that = this;
      var data = new FormData();
      this.$http.post(that.url.list, data).then((res) => {
        console.log(res);
        this.tableData = res.data;
      });
    },
    handleClick(scope) {
      let that = this;
      let data = new FormData();
      let status = scope.messagetype;
      console.log(scope.messagetype, "asdasdasdas");
      data.append("id", scope.id);
      if (status === 4) {
        this.$http.post("/trMessage/mr", data);
        var float = JSON.stringify({
          id: "4",
          name: "公文管理",
          url: "/official",
          img: require("../../assets/official.png"),
          menu_index: "43",
          color: " background: rgba(33, 152, 255, 1);color: #fff",
        });
        sessionStorage.setItem("float", float);
        // let url = scope.messagetype==0?'/onbusiness':scope.messagetype==1?'/leave':'/overtime';
        // scope.row.messagetype==1?'请假':scope.row.messagetype==0?'出差':'加班'
        this.$router.push("/official");
        this.$parent.get_mess();
      }
      if (status === 6) {
        this.$http.post("/trMessage/mr", data);
        var float = JSON.stringify({
          id: "11",
          name: "公务接待",
          url: "/recepiton",
          img: require("../../assets/user.png"),
          menu_index: "192",
          color: " background: rgba(33, 152, 255, 1);color: #fff",
        });
        sessionStorage.setItem("float", float);
        // let url = scope.messagetype==0?'/onbusiness':scope.messagetype==1?'/leave':'/overtime';
        // scope.row.messagetype==1?'请假':scope.row.messagetype==0?'出差':'加班'
        this.$router.push("/recepiton");
        this.$parent.get_mess();
      }
      if (status === 9) {
        this.$http.post("/trMessage/mr", data);
        var float = JSON.stringify({
          id: "2",
          name: "固定资产",
          url: "/assets",
          img: require("../../assets/apply.png"),
          menu_index: "22",
          color: " background: rgba(33, 152, 255, 1);color: #fff",
        });
        sessionStorage.setItem("float", float);
        // let url = scope.messagetype==0?'/onbusiness':scope.messagetype==1?'/leave':'/overtime';
        // scope.row.messagetype==1?'请假':scope.row.messagetype==0?'出差':'加班'
        this.$router.push("/assets");
        this.$parent.get_mess();
      }
      if (status === 8 || status === 3) {
        this.$http.post("/trMessage/mr", data);
        var float = JSON.stringify({
          id: "3",
          name: "会员管理",
          url: "/member",
          img: require("../../assets/member.png"),
          menu_index: status == 8 ? "31" : "34",
          color: " background: rgba(33, 152, 255, 1);color: #fff",
        });
        sessionStorage.setItem("float", float);
        // let url = scope.messagetype==0?'/onbusiness':scope.messagetype==1?'/leave':'/overtime';
        // scope.row.messagetype==1?'请假':scope.row.messagetype==0?'出差':'加班'
        this.$router.push("/member");
        this.$parent.get_mess();
      }
      if (status === 7) {
        this.$http.post("/trMessage/mr", data);
        var float = JSON.stringify({
          id: "8",
          name: "用户管理",
          url: "/user",
          img: require("../../assets/user.png"),
          menu_index: "82",
          color: " background: rgba(33, 152, 255, 1);color: #fff",
        });
        sessionStorage.setItem("float", float);
        // let url = scope.messagetype==0?'/onbusiness':scope.messagetype==1?'/leave':'/overtime';
        // scope.row.messagetype==1?'请假':scope.row.messagetype==0?'出差':'加班'
        this.$router.push("/user");
        this.$parent.get_mess();
      } else if (
        scope.messagetype === 1 ||
        scope.messagetype === 0 ||
        scope.messagetype === 5
      ) {
        this.$http.post("/trMessage/mr", data);
        var float = JSON.stringify({
          id: "1",
          name: "考勤管理",
          url: "/attendance",
          img: require("../../assets/attendance.png"),
          menu_index:
            scope.messagetype == 0
              ? "12"
              : scope.messagetype == 1
              ? "11"
              : "13",
          color: " background: rgba(33, 152, 255, 1);color: #fff",
        });
        sessionStorage.setItem("float", float);
        // let url = scope.messagetype==0?'/onbusiness':scope.messagetype==1?'/leave':'/overtime';
        // scope.row.messagetype==1?'请假':scope.row.messagetype==0?'出差':'加班'
        this.$router.push("/attendance");
        this.$parent.get_mess();
      }
      // else if(){}else if(){}
    },
  },
  mounted() {
    this.mess();
  },
};
</script>

<style>
.button {
  width: 50%;
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  min-width: 620px;
}

.table_content {
  width: 100%;
  height: 638px;
}
</style>
