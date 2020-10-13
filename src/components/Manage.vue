<template>
  <div class="Manage">
    <h1 style="padding-top:20px;cursor:pointer;" @click="turnmanage()">权限管理</h1>
    <div v-if="!autho">
      <el-table
        :data="name_list.filter(data => !content1_v || data.username.toLowerCase().includes(content1_v.toLowerCase())).slice((this.currentPage1-1)*this.pageSize,this.currentPage1*this.pageSize)"
        style="width: 95.8%;margin:0 2.1%;height:500px;overflow:auto"
        align="center"
        height="430"
        border
        header-cell-class-name="t_h"
      >
        <el-table-column label="姓名" align="center" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="权限" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.rid }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <span
                style="color:#3399FF"
                @click="handleEdit_xiugai(scope.row)"
               
              >修改</span>
              <span
                style="color:#FF5454"
                @click="handleEdit_delete(scope.row.eid)"
              >删除</span>
            </div>
          </template>
        </el-table-column>-->
      </el-table>
      <!--分页-->
      <div class="block" style="display:block">
        <span class="demonstration">每页10条</span>
        <el-pagination
          :current-page.sync="currentPage1"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="name_list.filter(data => !content1_v || data.username.toLowerCase().includes(content1_v.toLowerCase())).length"
        ></el-pagination>
      </div>
    </div>
    <div class="content">
      <div class="left" v-if="autho">
        <el-radio-group v-model="s_left">
          <el-radio
            v-for="(item,index) of left"
            :key="index"
            :label="item.rid"
            :value="item.remark"
            @change="manage_1(item.rid)"
          >{{item.roleName}}</el-radio>
        </el-radio-group>
      </div>

      <div class="right" v-if="autho">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >全选</el-checkbox>
        <el-checkbox-group v-model="s_right" @change="handleCheckedCitiesChange">
          <el-checkbox
            v-for="(item,index) of right"
            :key="index"
            :label="item.aid"
            :value="item.aid"
          >
            {{item.remark}}
            {{item.aname}}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div v-if="autho">
      <el-button @click="submit">提交</el-button>
      <el-button type="primary" @click="add_audit()">添加</el-button>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form :model="audit" ref="audit">
        <el-form-item label="权限地址">
          <el-input v-model="audit.fname"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="audit.remark"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="audit.type"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="queding_cancel()">取 消</el-button>
        <el-button type="primary" @click="queding()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  inject: ["reload"],
  name: "Manage",
  data() {
    return {
      autho: false,
      content1_v: "",
      currentPage1: 1,
      pageSize: 10, //每页条数
      audit: {
        fname: "",
        remark: "",
        type: 0,
      },
      dialogVisible: false,
      checkAll: false,
      isIndeterminate: true,
      left: [],
      right: [],
      s_left: 0,
      s_right: [],
      name_list: [],
    };
  },
  methods: {
    turnmanage() {
      // console.log("quanxian dianji");
      let a = sessionStorage.getItem("roletype");
      if (a.indexOf(3) != -1) this.autho = !this.autho;
    },
    user_name() {
      var data = new FormData();
      this.$http.post("/uc/gau", data).then((res) => {
        console.log(res, "name");
        this.name_list = JSON.parse(JSON.stringify(res.data));
        // this.tableData_yh=res.data
        //  this.tableData_js=res.data;
      });
    },
    queding_cancel() {
      this.dialogVisible = false;
    },
    handleReload() {
      this.reload(); // 在想要刷新页面的时候调用reload方法
    },
    add_audit() {
      this.dialogVisible = true;
    },
    queding() {
      let data = new FormData();
      for (let key in this.audit) {
        data.append(key, this.audit[key]);
      }
      this.$http.post("/p/aa", data).then((res) => {
        this.reload();
        console.log(res);
      });
    },
    handleCheckAllChange(val) {
      var right_n = [];
      for (var item in this.right) {
        right_n.push(this.right[item].aid);
      }
      this.s_right = val ? right_n : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      // console.log(type,"light")
      let checkedCount = value.length;
      console.log(value.length, "value.length");

      this.checkAll = checkedCount === this.right.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.right.length;
    },
    manage_1(type) {
      if (type == "") {
        return false;
      }
      //清空
      this.s_right = [];
      let t = sessionStorage.getItem("token");
      var data = new FormData();
      data.append("rid", type);
      data.append("t", t);
      this.$http.post("/p/grsbr", data).then((res) => {
        for (var key in res.data) {
          this.s_right.push(res.data[key].aid);
        }
        console.log(this.s_right, "this.s_right");
      });
    },
    submit() {
      let t = sessionStorage.getItem("token");
      console.log(this.s_left);
      console.log(this.s_right);
      let str = this.s_right.join("-");
      console.log(str);
      let data = new FormData();
      console.log(typeof this.s_left);
      console.log(typeof str);
      data.append("rid", this.s_left);
      // data.append("pt",'');
      data.append("aid", str);
      data.append("t", t);
      this.$confirm("是否确认提交", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.$http.post("/p/srs", data).then((res) => {
          if (res.status == 200) {
            alert("权限分配成功");
          }
        });
      });
    },
  },
  mounted() {
    this.user_name();
    let userid = sessionStorage.getItem("userid");
    console.log(userid, "权限id");
    this.s_left = Number(userid);
    if (userid != null && userid != "") this.manage_1(userid);
    let t = sessionStorage.getItem("token");
    var data = new FormData();
    data.append("t", t);
    this.$http.post("/p/gar", data).then((res) => {
      console.log(res);
      this.left = res.data;
    });
    this.$http.post("/p/gs", data).then((res) => {
      console.log(res);
      this.right = res.data;
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-table /deep/ .t_h {
  background-color: #f5f5f5 !important;
  color: #070707;
}
.Manage {
  height: 100%;
  background: white;
  font-size: 14px;
}

.Manage_night h1 {
  color: grey;
}
h1 {
  margin-bottom: 50px;
}
.content {
  height: 76%;
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}
.left {
  width: 50%;
  height: 100%;
  border-right: 2px solid #666;
  overflow-x: hidden;
}
.right {
  width: 30%;
  overflow-x: hidden;
}
.el-radio,
.el-checkbox {
  width: 100%;
  text-align: start;
}
.el-radio {
  margin: 10px 0;
}
</style>
