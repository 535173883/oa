<template>
  <!-- 文件管理 -->
  <div class="Files">
    <div class="treeDir" @click.stop="resetChecked">
      <div class="treeTitle" style="margin-top:75px">文件目录管理</div>
      <div class="tree_c"></div>
      <el-tree
        :data="limitsData"
        node-key="id"
        ref="tree"
        default-expand-all
        :highlight-current="light_tree"
        :show-checkbox="checkFlag"
        :expand-on-click-node="false"
        @node-click="getCurrentNode"
      >
        <span class="custom-tree-node" slot-scope="{ node }">
          <span>{{ node.label }}</span>
          <!-- <span>{{ node.id }}</span> -->
        </span>
      </el-tree>
      <div class="treeBtn">
        <el-button size="mini" type="primary" @click.stop="createTree" v-has="511">新增</el-button>
        <el-button size="mini" @click.stop="updataTree" v-has="512">修改</el-button>
        <el-button size="mini" type="danger" @click.stop="removeTree" v-has="513">删除</el-button>
      </div>
    </div>
    <div style="float:left;margin-top: 30px;width: 1px;height: 80%; background: darkgray;"></div>
    <div class="limitsBox">
      <div>
        <!-- <el-input style="width:70%;float:left;margin-top:20px;margin-bottom:10px" placeholder="导航窗口"></el-input> -->
        <el-input
          style="width:70%;float:left;margin-top:20px;margin-bottom:10px;margin-left:10px"
          v-model="value1"
          placeholder="请输入文件名或关键字"
          icon="el-icon-search"
        ></el-input>
        <el-button
          type="primary"
          icon="el-icon-search"
          style="float:left;margin-top:20px;margin-bottom:10px;margin-left:10px"
          @click="search_file()"
        >搜索</el-button>
      </div>

      <div style="height:800px">
        <el-table
          :data="
            tableData.slice(
              (currentPage - 1) * pagesize,
              currentPage * pagesize
            )
          "
          style="width: 100%;cursor:pointer"
          ref="tableData"
          :model="tableData"
          @row-click="clickRow"
          @selection-change="handleSelectionChange"
          highlight-current-row
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="fname" label="名称">
            <template slot-scope="scope">
              <i
                class="el-icon-folder-opened"
                style="color:#409EFF"
                v-if="Boolean(scope.row.fname.match('files'))"
              ></i>
              <span>{{ scope.row.fname | file_t }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="uptime" label="日期">
            <template slot-scope="scope">
              <span>{{ scope.row.uptime | time_t }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fname" label="类型">
            <template slot-scope="scope">
              <span
                :style="scope.row.fname.match('files') ? 'color:#409EFF' : ''"
              >{{ scope.row.fname | file_w }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fposition" label="文件目录">
            <template slot-scope="scope">
              <span>{{ scope.row.fposition }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="关键字">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="page">
          <el-pagination
            layout="prev, pager, next"
            :pageSize="pagesize"
            :total="length"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>
      <div style="position:absolute;right:0px;bottom:40px;width:560px">
        <el-button type="primary" icon="el-icon-download" @click="down_file()">下载文件</el-button>
        <el-button type="danger" icon="el-icon-close" @click="delete_file()" v-has="514">删除文件</el-button>

        <!-- chooseType激活input上传组件 -->
        <el-button type="success" @click="dialogtable_upload = true" v-has="515">上传文件</el-button>
        <!-- 上传文件确定弹出框 -->
        <el-dialog
          :visible.sync="dialogtable_upload"
          width="40%"
          title="上传附件"
          center
          :before-close="handleClose_upload"
        >
          <el-form label-width="100px">
            <el-form-item label="文件关键字：" prop="remark">
              <!-- f 0-->
              <textarea
                name
                id
                cols="30"
                rows="10"
                style="width:90%;margin-top:14px;padding:0px"
                v-model="remark"
              ></textarea>
            </el-form-item>
            <el-button
              type="success"
              @click="chooseType"
              icon="el-icon-upload2"
              style="margin-top:-30px;margin-bottom:26px;margin-left:14%"
            >上传文件</el-button>

            <div class="querendiv" style="margin-left:14%">
              <el-button @click="cancleupload">取消</el-button>
              <el-button @click="uploadtext" style="margin-left:5px">确认</el-button>
            </div>
          </el-form>
        </el-dialog>
        <!-- 上传  multiple-->
        <input
          @change="upload($event)"
          type="file"
          id="upload_file"
          multiple="multiple"
          style="display: none"
        />
      </div>
    </div>
  </div>
</template>

<script>
let id = 1000;
export default {
  data() {
    return {
      remark: "",
      fid: "",
      dialogtable_upload: false,
      light_tree: true,
      value1: "",
      tableData: [],
      file_name: [],
      limitsData: null, //处理好的权限数据
      limitsData_1: null, //用于处理文件目录的中间量
      res: [
        {
          fmid: 0,
          fname: "string",
          fposition: "string",
          maxc: 0
        }
      ], //接收到的数据
      currentPage: 1, //初始页
      pagesize: 10,
      length: 0,
      multipleSelection: "",
      currentData: null, //当前选中节点数据
      currentNode: null, //当前选中节点
      checkFlag: false, //是否可选
      enabledCheck: false
    };
  },
  methods: {
    handleCurrentChange(cpage) {
      this.currentPage = cpage;
    },
    search_file() {
      let data = new FormData();
      data.append("fname", this.value1);
      this.$http.post("/fmc/gfl ", data).then(res => {
        console.log(res);
        this.tableData = res.data;
        this.length = res.data.length;
      });
    },
    down_file() {
      var a = this.multipleSelection;
      var rids = [];
      for (var i = 0; i < a.length; i++) {
        this.downform(a[i].fid);
      }
    },
    delete_file() {
      var a = this.multipleSelection;
      console.log(a, "选中的文件集合");
      var rids = [];
      for (var i = 0; i < a.length; i++) {
        rids.push(a[i].fid);
      }
      if (rids == "") {
        alert("请选择文件夹中文件进行操作");
        return false;
      }
      let data = new FormData();
      data.append("fid", rids);
      // a.forEaach(item=>{
      //   if(item.fname.match("files"))
      //   alert("选中文件中包含文件夹，请妥善处理内部文件后进行删除操作")
      // })
      if (confirm("确认删除文件") == true) {
        this.$http.post("/fmc/del", data).then(res => {
          // alert("删除成功")
          this.reload_file();
          console.log(res);
        });
      }

      // var rids = [];
      // for (var i = 0; i < a.length; i++) {
      //     this.downform(a[i].fid)
      // }
    },
    clickRow(row) {
      console.log(row, "节点东西");
      if (row.fname.match("files")) {
        this.file_choose(row.fmid);
      }
      this.$refs.tableData.toggleRowSelection(row);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //下载文件
    download(data, fileName) {
      fileName = decodeURIComponent(fileName);
      console.log(data);
      if (!data) {
        this.$message.warning("文件下载失败");
        return;
      }
      // let url = window.URL.createObjectURL(new Blob([data]))
      let url = window.URL.createObjectURL(data.data);
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    //下载文件
    downform(id) {
      if (id == null) {
        return false;
      }
      var data = new FormData();
      data.append("fid", id);
      this.$http({
        url: "/fmc/dpf",
        method: "post",
        data: data,
        responseType: "blob"
      }).then(res => {
        //获取文件名部分
        console.log(res.headers["Content-Disposition"], "res---------");
        if (res.headers["content-disposition"]) {
          var fileName = res.headers["content-disposition"]
            .split(";")[1]
            .split("fileName=")[1];
          var fileNameUnicode = res.headers["content-disposition"].split(
            "filename*="
          )[1];
          if (fileNameUnicode) {
            //当存在 filename* 时，取filename* 并进行解码（为了解决中文乱码问题）
            fileName = decodeURIComponent(fileNameUnicode.split("''")[1]);
          }
          console.log(fileName, "fileName");
        }
        //下载文件
        this.download(res, fileName);
      });
    },
    //

    //删除文件
    handleClose(tag) {
      console.log(tag);
      console.log(this.file_name, "nameeee");
      if (confirm("确认删除该文件") == true) {
        this.file_name.splice(tag, 1);
        this.fid.splice(this.fid.indexOf(tag), 1);
      }
      console.log(this.fid, "fidddd");
      console.log(this.file_name, "file_name");
      // this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    //图片上传压缩
    compress(event) {
      // debugger
      var file = event.target.files;
      var reader = new FileReader(),
        imgFile = file[0];
      if (imgFile.type.indexOf("image") == 0) {
        reader.readAsDataURL(imgFile);
        console.log(reader, "base64?");
      } else {
        this.$message({ type: "error", message: "文件类型仅为图片" });
      }
      let img = new Image();
      reader.onload = function(e) {
        img.src = e.target.result;
        console.log(img.src);
      };
      var imgP = new Promise((resolve, reject) => {
        //异步上传对象
        img.onload = () => {
          var canvas = document.getElementById("myCanvas");
          var ctx = canvas.getContext("2d");
          //    瓦片canvas
          var tCanvas = document.createElement("canvas");
          var tctx = tCanvas.getContext("2d");
          var initSize = img.src.length;
          var width = img.width;
          var height = img.height;
          //图片像素大于400万像素，计算压缩到400万以下
          var ratio;
          if ((ratio = (width * height) / 4000000) > 1) {
            ratio = Math.sqrt(ratio);
            width /= ratio;
            height /= ratio;
          } else {
            ratio = 1;
          }
          canvas.width = width;
          canvas.height = height;
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          //如果图片太大则使用瓦片绘制
          var count;
          if ((count = (width * height) / 1000000 > 1)) {
            count = ~~(Math.sqrt(count) + 1); //计算分成的瓦片数
            var nw = ~~(width / count);
            var nh = ~~(height / count);
            tCanvas.width = nw;
            tCanvas.height = nh;
            for (var i = 0; i < count; i++) {
              for (var j = 0; j < count; j++) {
                tctx.drawImage(
                  img,
                  i * nw * ratio,
                  j * nh * ratio,
                  nw * ratio,
                  nh * ratio,
                  0,
                  0,
                  nw,
                  nh
                );
                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
              }
            }
          } else {
            ctx.drawImage(img, 0, 0, width, height);
          }
          //进行最小压缩
          var ndata = canvas.toDataURL("image/jpeg", 0.3);
          tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
          resolve(ndata);

          console.log(this.currentData, "能否获取Data");
          console.log(this.currentNode, "能否获取Node");
          console.log(ndata, "11-----------");
        };
      });
      //all为所有均成功后执行操作
      return Promise.all([imgP]);
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([]);
      this.nochoose();
      this.light_tree = false;
    },
    //失焦事件
    nochoose() {
      this.currentData = null;
      this.currentNode = null;
      console.log(this.currentData, this.currentNode);
      console.log(123);
    },
    append(node, data) {
      //添加
      const newChild = { id: data.faid, label: data.value, children: [] };
      console.log(node, "node");
      if (node && !node.children) {
        this.$set(node, "children", []);
      }
      if (node) node.children.push(newChild);
    },
    remove(node) {
      //删除
      console.log(node);
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === node.id);
      children.splice(index, 1);
    },
    updataTree() {
      if (!this.currentNode) {
        this.$message({
          type: "error",
          message: "没有选中节点"
        });
      } else {
        console.log(this.currentData, "this.currentData");
        this.$prompt("请输入修改后的名称", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(({ value }) => {
            let fa = this.currentData.fmid,
              fn = value,
              // fposition=this.currentData.fposition,
              // maxc=this.currentData.maxc,
              fm = { fa, fn };
            let data = new FormData();
            for (let key in fm) {
              data.append(key, fm[key]);
            }
            this.$http.post("/fmc/up", data).then(res => {
              console.log(res.data);
              // if (typeof res.data === "string") {
              //   res.data = JSON.parse(res.data);
              // }
              if (Number(res.data) === 0) {
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
                let node = this.currentData;
                console.log(node, "node");
                if (node) {
                  node.fname = value;
                }
                this.load();
              }
            });
          })
          .catch(error => {
            this.$message({
              type: "info",
              message: error
            });
          });
      }
    },
    createTree() {
      //新增目录
      this.$prompt("请输入名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          let faid;
          if (!this.currentData || this.currentData.id == 0) {
            faid = "";
          } else {
            faid = this.currentData.id;
          }
          console.log(this.currentData, "this.currentData");
          let data = new FormData();
          //节点位置
          data.append("fa", faid);
          //节点名字
          data.append("fn", value);
          this.$http.post("/fmc/ap", data).then(res => {
            console.log(res.data);
            if (typeof res.data === "string") {
              res.data = JSON.parse(res.data);
            }
            if (Number(res.data.code) === 0) {
              this.$message({
                type: "success",
                message: "新增成功"
              });
              this.append(this.currentData, { faid, value });
              this.load();
            }
          });
        })
        .catch(error => {
          this.$message({
            type: "info",
            message: error
          });
        });
    },
    //删除tree节点
    removeTree() {
      console.log(this.currentNode);
      // this.checkFlag = true;
      if (!this.currentNode) {
        this.$message({
          type: "error",
          message: "没有选中节点"
        });
      } else {
        this.$confirm(
          "此操作将永久删除" +
            this.currentNode.data.fname +
            "文件夹, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            let data = new FormData();
            data.append("fmid", this.currentNode.data.id);
            this.$http.post("/fmc/dp", data).then(res => {
              if (Number(res.data) == -1) {
                alert("文件夹下存在文件，请妥善处理后进行删除");
                return false;
              } else {
                console.log(res);
                if (typeof res == "string") {
                  res = JSON.parse(res);
                }
                this.remove(this.currentNode);
                this.load();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
          })
          .catch(err => {
            this.$message({
              type: "info",
              message: err
            });
          });
      }
    },
    //获取当前点击节点的数据
    getCurrentNode(data, node) {
      this.light_tree = true;
      this.tableData = [];
      console.log(data, "data");
      console.log("点击节点", node);
      this.currentData = data;
      this.currentNode = node;
      let datas = new FormData();
      datas.append("fmid", data.id);
      this.$http.post("/fmc/gp", datas).then(res => {
        this.tableData = res.data;
        this.length = res.data.length;
        this.file_name = res.data;
        console.log(res, "路径下节点信息");
      });
    },
    reload_file() {
      let datas = new FormData();
      datas.append("fmid", this.currentData.id);
      this.$http.post("/fmc/gp", datas).then(res => {
        this.tableData = res.data;
        this.file_name = res.data;
        console.log(res, "路径下节点信息");
      });
    },
    file_choose(type) {
      let datas = new FormData();
      datas.append("fmid", type);
      this.$http.post("/fmc/gp", datas).then(res => {
        this.tableData = res.data;
        this.file_name = res.data;
        console.log(res, "路径下节点信息");
      });
    },
    buildTree(data) {
      //格式后台返回权限集合
      let parent_id, //目录树父节点标识
        temp = {},
        tree = [];
      for (let item of data) {
        var spData = item.fposition.split("-");
        if (spData.length === 1) {
          parent_id = 0;
        } else {
          spData.pop();
          parent_id = spData.join("-");
        }
        item.parent_id = parent_id;
        item.label = item.fname;
        item.id = item.fmid;
        item.disabled = this.enabledCheck;
      }
      for (let i in data) {
        if (!data[i].fposition || !data[i].fname) {
          continue;
        }
        temp[data[i].fposition] = data[i];
      }
      console.log("temp", temp);
      for (let i in temp) {
        if (temp[i].parent_id) {
          if (!temp[temp[i].parent_id].children) {
            temp[temp[i].parent_id].children = new Array();
          }
          temp[temp[i].parent_id].children.push(temp[i]);
        } else {
          tree.push(temp[i]);
        }
      }
      return tree;
    },
    load() {
      let data = new FormData();
      this.$http.post("/fmc/gap", data).then(res => {
        console.log(res);
        if (typeof res === "string") {
          res = JSON.parse(res);
        }
        console.log(res);
        this.limitsData_1 = res.data;
        console.log(this.limitsData_1, "文件目录输出工具");
        //构建树形图
        this.limitsData = this.buildTree(res.data);
        // this.getCurrentNode()
      });
    },
    chooseType() {
      console.log(this.currentNode, "22222222222222222222");
      document.getElementById("upload_file").click();
    },
    handleClose_upload(done) {
      done();
    },
    //文本上传
    uploadtext() {
      console.log(this.notedata);
      let queryParam = new FormData();
      queryParam.append("fid", this.fid);
      queryParam.append("remark", this.remark);
      let axios = this.axios;
      this.$http
        .post("/fmc/sf", queryParam)
        .then(res => {
          console.log(res, "1111111111111111111111");
          this.$message.success("上传成功");
          this.dialogtable_upload = false;
          this.remark = "";
          // location.reload();
          // this.getCurrentNode()
          this.reload_file();
        })
        .catch(err => {
          this.$message.error("上传失败");
        });
    },
    //取消文件上传
    cancleupload() {
      this.remark = "";
      this.dialogtable_upload = false;
    },
    //附件上传
    upload(e) {
      //获取选定的文件
      console.log(e.target);
      let tFile = e.target.files;
      let len = tFile.length;
      console.log(len, "文件个数");
      console.log(tFile, "文件");
      if (this.currentNode == null || this.currentNode == "") {
        alert("请选择文件目录地址");
        e.target.value = "";
        return false;
      }
      function createObjectURL(object) {
        return window.URL
          ? window.URL.createObjectURL(object)
          : window.webkitURL.createObjectURL(object);
      }
      for (var i = 0; i < len; i++) {
        //开始上传每一个文件
        var imgurl = createObjectURL(tFile[i]);
        var item = {
          name: tFile.name,
          imgs: imgurl
        };
        //开始上传文件 新建一个formData
        let param = new FormData();
        //通过append向form对象添加数据 ！！！图片数据
        console.log(tFile[i], "tFile");
        param.append("f", tFile[i]);
        //以下业务代码 无需理解
        console.log(this.currentNode, "选择的地址");
        param.append("fmid", this.currentNode.data.id);
        //请求
        this.$http.post("/fmc/upf", param).then(res => {
          //特殊需求 数据赋值
          console.log(res, "5555555555555555555555555555");
          this.fid = res.data[0].fid;
          this.reload_file();
          // alert("上传成功")
        });
      }
      // alert("上传成功");
      this.$message.success("文件已上传");
    }
  },
  created() {
    // this.getCurrentNode()
    this.load();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body .el-table::before {
  z-index: inherit;
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.container > .right > div {
  background-color: #707070;
}
.Files {
  height: 100%;
}
.treeDir {
  position: relative;
  float: left;
  width: 20%;
  min-width: 200px;
  height: 100%;
  margin-right: 10px;
  background-color: #fff;
  /* box-shadow: 0px 3px 6px rgba(0,0,0,0.16); */
}
.treeDir >>> .el-tree {
  height: 82%;
  overflow-y: auto;
}
.treeTitle {
  margin: 29px 0 19px 0;
  font-size: 16px;
  font-weight: 400;
  color: #409eff;
}
.treeBtn {
  position: absolute;
  bottom: 40px;
  text-align: center;
  width: 100%;
}
.treeBtn_2 {
  position: absolute;
  bottom: 40px;
  text-align: right;
  width: 80%;
}
.limitsBox {
  /* float: right; */
  margin-left: 26%;
  width: 74%;
  height: 100%;
  background-color: #fff;
}
.file {
  width: 100px;
  text-align: center;
  position: relative;
  display: inline-block;
  background: #66b1ff;
  border: 1px solid #99d3f5;
  border-radius: 4px;
  padding: 9px 12px;
  overflow: hidden;
  color: white;
  text-decoration: none;
  text-indent: 0;
  line-height: 20px;
}
.file input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
}
.file:hover {
  background: #aadffd;
  border-color: #78c3f3;
  color: #004974;
  text-decoration: none;
}
</style>
<style>
.el-table__body tr.current-row > td {
  background-color: #c3e0ff !important;
  /* color: #f19944; */ /* 设置文字颜色，可以选择不设置 */
}
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #c0c4cc !important;
  color: white;
}
</style>
