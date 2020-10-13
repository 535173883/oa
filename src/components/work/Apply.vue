<template>
  <div class="Apply">
    <div class="menu">
      <el-menu
        text-color="#000"
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item v-for="(item,index) of menu" :key="index" :index="item.id">{{item.name}}</el-menu-item>
      </el-menu>
    </div>
    <div class="content" v-show="activeIndex=='91'">
      <div class="table_top">
        <input type="text" placeholder="搜索" />
        <el-button type="primary" v-has="911">添加</el-button>
      </div>
      <el-table
        :data="tableData_sp"
        style="width: 95.8%;margin:0 2.1%;"
        align="center"
        border
        header-cell-class-name="t_h"
      >
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="报销名目" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.bx }}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.je }}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.zt }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <span
                style="color:#3399FF"
                @click="handleEdit(scope.$index, scope.row)"
                v-has="912"
              >修改</span>
              <span style="color:#FF5454" @click="handleEdit(scope.$index, scope.row)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="content" v-show="activeIndex=='92'">
      <div class="table_top">
        <input type="text" placeholder="搜索" />
        <el-button type="primary" v-has="921">申请</el-button>
      </div>
      <el-table
        :data="tableData_sq"
        style="width: 95.8%;margin:0 2.1%;"
        align="center"
        border
        header-cell-class-name="t_h"
      >
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="报销名目" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.bx }}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.je }}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审批进程" width="146" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <span style="color:#3399FF" @click="handleEdit(scope.$index, scope.row)">查看</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="166" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.zt }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "Apply",
  data() {
    return {
      menu: [],
      float: [],
      activeIndex: "",
      tableData_sp: [
        {
          //接受的数据
          name: "张三",
          bx: "XXXXXXXX",
          je: "XXXXX",
          time: "1995-08-12",
          zt: "XXXXX",
        },
        {
          name: "李四",
          name: "张三",
          bx: "XXXXXXXX",
          je: "XXXXX",
          time: "1995-08-12",
          zt: "XXXXX",
        },
        {
          name: "王五",
          name: "张三",
          bx: "XXXXXXXX",
          je: "XXXXX",
          time: "1995-08-12",
          zt: "XXXXX",
        },
      ],
      tableData_sq: [
        //接受的数据
        {
          name: "张三",
          bx: "XXXXXXXX",
          je: "XXXXX",
          time: "1995-08-12",
          zt: "待审核",
        },
        {
          name: "李四",
          bx: "XXXXXXXX",
          je: "XXXXX",
          time: "1995-08-12",
          zt: "已同意",
        },
        {
          name: "王五",
          bx: "XXXXXXXX",
          je: "XXXXX",
          time: "1995-08-12",
          zt: "已拒绝",
        },
      ],
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.activeIndex = key;
      console.log(this.activeIndex, "activeIndex");
      console.log(key == this.activeIndex);
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
  },
  mounted() {
    let a = JSON.parse(sessionStorage.getItem("a"));
    // let a=["1", "11", "12", "13",  "14", "141", "142", "143",  "2", "21", "211", "212", "213", "214", "22", "23", "24", "241", "242", "243", "25", "251", "252", "253", "3", "31", "311", "312", "313",  "32", "321", "322", "4", "41", "42", "421", "422",  "5", "6", "61", "62", "7", "71", "72", "8", "913", "922", "81", "811", "812", "813", "82", "822", "821", "823", "824", "9", "91", "911", "912", "92", "921"]
    for (let item of a) {
      // console.log(item)
      if (item == "91") this.menu.push({ name: "资费审批", id: "91" });
      if (item == "92") this.menu.push({ name: "资费申请", id: "92" });
    }
    console.log(this.menu, "menu");
    let float = sessionStorage.getItem("float");
    this.float = JSON.parse(float);
    this.activeIndex = this.float.menu_index;
    // console.log(this.float,'this.float');
  },
  beforeRouteLeave(to, from, next) {
    this.float.menu_index = this.activeIndex;
    let float = JSON.stringify(this.float);
    sessionStorage.setItem("float", float);
    next();
    // console.log(this.float,'float')
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-table {
  color: #070707;
}
.el-menu,
.el-table--border {
  border: 0;
}
.el-table /deep/ .t_h {
  background-color: #f5f5f5 !important;
  color: #070707;
}
.el-table /deep/ .el-table__row .operation span {
  cursor: pointer;
  border-right: 1px solid #e5e5e5;
  padding: 0 2px;
}
.el-table /deep/ .el-table__row .operation span:last-child {
  border: 0;
}
.Apply {
  background-color: #f5f5f5;
}
.menu,
.content {
  background: #fff;
}
.menu {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}
.table_top {
  display: flex;
  justify-content: space-between;
  padding: 1.7% 2.1%;
  margin-top: 7px;
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
</style>
