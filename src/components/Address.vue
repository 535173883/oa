<template>
  <div class="Adress">
    <div class="menu">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item
          v-for="item in department"
          :label="item.dname"
          :key="item.did"
          :value="item.did"
          :index="item.did.toString()"
        >{{item.dname}}</el-menu-item>
      </el-menu>
    </div>
    <div class="content">
      <div class="table_top">
        <input type="text" placeholder="搜索用户姓名" v-model="content1_v" />
      </div>
      <div class="person">
        <el-table
          :data="list.filter(data => !content1_v || data.username.toLowerCase().includes(content1_v.toLowerCase())).slice((this.currentPage1-1)*this.pageSize,this.currentPage1*this.pageSize)"
          :model="list"
          ref="list"
          height="430"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="姓名" align="center" prop="username">
            <template slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column label="电话" prop="telephone" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.mobile }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" align="center" width="170">
          <template slot-scope="scope">
            <div class="operation">
              <span
                style="color:#3399FF"
                @click="user_f(scope.row.aid,scope.row)"
              >发送消息</span>
            </div>
          </template>
          </el-table-column>-->
        </el-table>
        <div class="block">
          <span class="demonstration">每页10条</span>
          <el-pagination
            :current-page.sync="currentPage1"
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total="list.filter(data => !content1_v || data.username.toLowerCase().includes(content1_v.toLowerCase())).length"
          ></el-pagination>
        </div>
        <!-- <div class="cell" v-for="(item,index) of list" :key="index">
          <span style="width:200px">{{item.username}}</span>
          <span style="width:400px">{{item.telephone}}</span>
          <span style="width:300px">{{qingjia(item.isattend)}}</span>
          <span><el-button type="primary">发消息</el-button></span>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Adress",
  data() {
    return {
      currentPage1: 1, //当前页1
      pageSize: 10, //每页条数
      content1_v: "",
      actnum: "",
      department: "",
      float: [],
      activeIndex: "0",
      list: [],
    };
  },
  methods: {
    qingjia(type) {
      if (type == 0) {
        return "正常";
      } else if (type == 1) {
        return "迟到";
      } else if (type == 2) {
        return "早退";
      } else if (type == 3) {
        return "请假";
      } else if (type == 4) {
        return "出差";
      } else if (type == 5) {
        return "矿工";
      }
    },
    depart() {
      let data = new FormData();
      this.$http.post("/uc/depl", data).then((res) => {
        console.log(res);
        this.department = res.data;
        console.log(this.department, "this.department");
      });
    },
    depart_select(type) {
      var data = new FormData();
      data.append("did", type);
      this.$http.post("/uc/ab", data).then((res) => {
        this.list = res.data;
        console.log(this.list, "list");
        console.log(res.data);
      });
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.actnum = key;
      console.log(this.actnum, "this.actnum");
      this.depart_select(this.actnum);
      console.log(this.actnum, "activeIndex");
      console.log(key == this.activeIndex);
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
  },
  mounted() {
    this.depart();
    this.depart_select("1");
    console.log("address mounted");
    let address_index = sessionStorage.getItem("address_index");
    if (address_index) this.activeIndex = address_index;
  },
  beforeRouteLeave(to, from, next) {
    sessionStorage.setItem("address_index", this.activeIndex);

    next();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Adress[data-v-43c5b3f4] {
  background-color: #f5f5f5;
  height: 100%;
  color: #242635;
}
.Adress.el-menu {
  border: 0;
}
.Adress.content {
  background-color: #fff;
}
.menu {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}
.content {
  background: #fff;
}
.table_top {
  display: flex;
  justify-content: space-between;
  padding: 20px 22px;
  /* margin-top:7px; */
}
.table_top input {
  width: 460px;
  height: 27px;
  background: rgba(239, 239, 239, 1);
  border: 0;
  border-radius: 19px;
  margin-right: 43px;
  padding-left: 10px;
}
/* .person{
    background-color: #F5F5F5;
  } */
.person::before {
  content: "";
  display: table;
}
.Adress .cell {
  height: 56px;
  line-height: 56px;
  display: flex;
  /* justify-content:space-between; */
  padding: 0 80px;
  margin: 10px 0;
  background: #fff;
}
.Adress_night .cell {
  height: 56px;
  line-height: 56px;
  display: flex;
  /* justify-content:space-between; */
  padding: 0 80px;
  margin: 10px 0;
  background: #242635;
}
/* .menu /deep/ .el-menu-item{
    color: #fff !important;
  } */
</style>
