<template>
  <div class="Files" >
    <div  >
      <div  @click.stop="resetChecked">
        <el-input
        prefix-icon="el-icon-search"
        placeholder="输入关键字进行搜索目录"
        v-model="filterText"
        style="margin-bottom:10px">
      </el-input>
      <el-tree
          :data="limitsData"
          node-key="id"
          ref="tree"
          default-expand-all
          :highlight-current="light_tree"
          :show-checkbox="checkFlag"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          style="width:200px"
          @node-click="getCurrentNode">
          <span class="custom-tree-node" slot-scope="{node}">
            <i class="el-icon-folder-opened" style="color:#409EFF"></i><span>{{ node.label }}</span>
          </span>
        </el-tree>
        <!-- <div class="treeBtn">
          <el-button size="mini" type="primary" @click.stop="createTree">新增</el-button>
          <el-button size="mini" @click.stop="updataTree">修改</el-button>
          <el-button size="mini" @click.stop="removeTree">删除</el-button>
        </div> -->
    </div>
    
     <!-- <div style="float:left;margin-top:30px;width: 1px;height: 30%; background: darkgray;"></div> -->
     <!-- <div style="height:400px;width:60%;overflow:auto;margin-left:40px" >
       <el-table 
        :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        ref="tableData"
        @row-click="clickRow"
        highlight-current-row
        style="width: 100%;cursor:pointer;overflow:auto"
        > 
       <el-table-column prop="fname" label="文件" width="300" >
         <template slot-scope="scope">
           <i class="el-icon-folder-opened" style="color:#409EFF" v-if="Boolean(scope.row.fname.match('files'))" ></i> <span>{{  scope.row.fname | file_t}}</span>
          </template>
       </el-table-column>
        <el-table-column prop="fname"  label="类型" width="100" >
            <template slot-scope="scope">
                <span :style="(scope.row.fname.match('files'))? 'color:#409EFF':'' ">{{ scope.row.fname | file_w}}</span>
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
     </div> -->

    </div>
        <!-- <div style="margin-top:10px" >
          <el-button  type="success" @click="chooseType" icon="el-icon-upload2">上传文件</el-button>
          <input @change="upload($event)" type="file" id="upload_file1" multiple="multiple" style="display: none"/>
        </div> -->
        
  </div>
</template>

<script>
// var trii=document.createElement("div")
// tri.id="3333",
let id = 1000;
export default {
    name:"tree",
  data() {
    return {
      fid:[],
      light_tree:true,
      currentPage: 1, //初始页
      pagesize: 10,
      length: 0,
      filterText: '',
      file_name:"",
      limitsData: null, //处理好的权限数据
      tableData:[],
      res: [
        {
          "fmid": 0,
          "fname": "string",
          "fposition": "string",
          "maxc": 0
        }
      ], //接收到的数据
      currentData: null, //当前选中节点数据
      currentNode: null, //当前选中节点
      checkFlag: false, //是否可选
      enabledCheck: false
    };
  },
   watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
  methods: {
    //附件上传
    upload(e) {
      //获取选定的文件
      let tFile = e.target.files;
      let len = tFile.length;
      console.log(len,"文件个数");
      console.log(tFile,"文件");
      if(this.currentNode==null||this.currentNode==""){
        alert("请选择文件目录地址")
        e.target.value=""
        return false
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
      console.log(tFile[i],'tFile')
      param.append("f", tFile[i]);
      console.log(this.currentNode,"选择的地址");
      param.append("fmid",this.currentNode.data.id)
      // if(this.currentNode.data.id!=""&&this.currentNode.data.id!=null){param.append("fmid",this.currentNode.data.id)}else{
      //   alert("请选择文件目录地址")
      //   return false
      // }
      //请求
      this.$http.post("/fmc/upf",param).then(res => {
        let f={}
        f=res.data[0]
        this.fid.push(JSON.stringify(f))
        console.log(this.fid,"文件this.fid");
        sessionStorage.setItem("file_id",JSON.stringify(this.fid))
        //特殊需求 数据赋值
        console.log(res)
        this.reload_file()
        // alert("上传成功")
      });
      }
      alert("上传成功")
    },
    //附件上传
    upload_m(e) {
      //获取选定的文件
      let tFile = e.target.files;
      let len = tFile.length;
      console.log(len,"文件个数");
      console.log(tFile,"文件");
      // if(this.currentNode==null||this.currentNode==""){
      //   alert("请选择文件目录地址")
      //   e.target.value=""
      //   return false
      // }
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
      console.log(tFile[i],'tFile')
      param.append("f", tFile[i]);
      // console.log(this.currentNode,"选择的地址");
      // let fmid=JSON.parse(sessionStorage.getItem("file_r")).id
      // console.log('fmid',fmid);
      param.append("fmid",this.currentNode.data.id)
      this.$http.post("/fmc/upf",param).then(res => {
        //特殊需求 数据赋值
        console.log(res)
        this.reload_file()
        // alert("上传成功")
      });
      }
      alert("上传成功")
    },
      reload_file(){
      let datas =new FormData();
      datas.append("fmid",this.currentData.id)
      this.$http.post('/fmc/gp',datas).then(res=>{
        this.tableData=res.data
        this.file_name=res.data
      console.log(res,"路径下节点信息")
      })
    },
    resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
        this.nochoose()
        this.light_tree=false
      },
    handleCurrentChange(cpage) {
      this.currentPage = cpage;
    },
     clickRow(row) {
      console.log(row,"节点东西");
      if(row.fname.match("files")){
        this.file_choose(row.fmid)
      }
      this.$refs.tableData.toggleRowSelection(row);
    },
      file_choose(type){
      let datas =new FormData();
      datas.append("fmid",type)
      this.$http.post('/fmc/gp',datas).then(res=>{
        if(res.data.length!=0)this.tableData=res.data;
        this.file_name=res.data
      console.log(res,"路径下节点信息")
      })
    },
     filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
    //图片上传压缩
    compress(event) {
      // debugger
        var file = event.target.files;
        var reader = new FileReader(), imgFile = file[0];
        if (imgFile.type.indexOf('image') == 0) {
          reader.readAsDataURL(imgFile);
          console.log( reader,"base64?");   
          } else {this.$message({type: "error",message: "文件类型仅为图片"});
        }
        let img = new Image();
          reader.onload = function (e) {
          img.src = e.target.result;
          console.log(img.src)

        };
        var imgP = new Promise((resolve, reject) => {
            //异步上传对象
          img.onload = () => {
            var canvas=document.getElementById('myCanvas');
            var ctx = canvas.getContext('2d');
            //    瓦片canvas
            var tCanvas = document.createElement("canvas");
            var tctx = tCanvas.getContext("2d");
            var initSize = img.src.length;
            var width = img.width;
            var height = img.height;
            //图片像素大于400万像素，计算压缩到400万以下
            var ratio;
            if ((ratio = width * height / 4000000) > 1) {
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
            if ((count = width * height / 1000000 > 1)) {
              count = ~~(Math.sqrt(count) + 1);//计算分成的瓦片数
              var nw = ~~(width / count);
              var nh = ~~(height / count);
              tCanvas.width = nw;
              tCanvas.height = nh;
              for (var i = 0; i < count; i++) {
                for (var j = 0; j < count; j++) {
                  tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
                  ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
                }
              }
            } else {
              ctx.drawImage(img, 0, 0, width, height)
            }
            //进行最小压缩
            var ndata = canvas.toDataURL('image/jpeg', 0.3);
            tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
            resolve(ndata)
              
              
              console.log(this.currentData,"能否获取Data");
              console.log(this.currentNode,"能否获取Node");
            console.log(ndata,"11-----------");
            
          }
        })
        //all为所有均成功后执行操作
        return Promise.all([imgP])
 },
    nochoose(){
      this.currentData=null;
      this.currentNode=null;
      console.log(this.currentData,this.currentNode,
      )
      console.log(123)
    },
    append(node, data) {
      //添加
      const newChild = { id: data.faid, label: data.value, children: [] };
      console.log(node,'node')
      if (node&&!node.children) {
        this.$set(node, "children", []);
      }
      if(node) node.children.push(newChild);
    },
    remove(node) {
      //删除
      console.log(node)
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === node.id);
      children.splice(index, 1);
    },
    updataTree(){
      if (!this.currentNode) {
        this.$message({
          type: "error",
          message: "没有选中节点"
        });
      }else{
        console.log(this.currentData,'this.currentData')
        this.$prompt("请输入修改后的名称", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then(({ value }) => {
          let fa=this.currentData.fmid,
          fn=value,
          // fposition=this.currentData.fposition,
          // maxc=this.currentData.maxc,
          fm={fa,fn}
          let data = new FormData();
          for(let key in fm){
            data.append(key,fm[key])
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
              let node=this.currentData;
              console.log(node,'node')
              if(node){
                node.fname=value
              }
              this.load();
            }
          });
        }).catch(error => {
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
      }).then(({ value }) => {
        let faid;
        if (!this.currentData || this.currentData.id == 0) {
          faid = "";
        } else {
          faid = this.currentData.id;
        }
        console.log(this.currentData,'this.currentData')
        let data = new FormData();
        data.append("fa", faid);
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
      }).catch(error => {
        this.$message({
          type: "info",
          message: error
        });
      });
    },
    //删除tree节点
    removeTree() {
      console.log(this.currentNode)
      // this.checkFlag = true;
      if (!this.currentNode) {
        this.$message({
          type: "error",
          message: "没有选中节点"
        });
      } else {
        this.$confirm("此操作将永久删除"+this.currentNode.data.fname+"文件夹, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let data = new FormData();
            data.append("fmid",this.currentNode.data.id)
            this.$http.post("/fmc/dp",data).then(res => {
              console.log(res)
              if(typeof res == "string"){
                res = JSON.parse(res)
              }
              this.remove(this.currentNode)
              this.load();
            })
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          })
          .catch((err) => {
            this.$message({
              type: "info",
              message: err
            });
          });
      }
    },
    //获取当前点击节点的数据
    getCurrentNode(data, node) {
      this.light_tree=true
      this.currentData = data;
      this.currentNode = node;
      console.log(this.currentData,"current");
      console.log(this.currentNode,"currentNode");
      let f={}
      let datas =new FormData();
      datas.append("fmid",data.id);
      this.$http.post('/fmc/gpi',datas).then(res=>{
        if(res.data.length!=0)this.tableData=res.data;
        // this.length=res.data.length
        // this.file_name=res.data
        // //路径储存
        f.path=res.data.fposition
        f.fmid=res.data.fmid
        sessionStorage.setItem("file_r",JSON.stringify(f))
        console.log(res,"gpi路径下节点信息")
      })
       this.$http.post('/fmc/gp',datas).then(res=>{
        if(res.data.length!=0)this.tableData=res.data;
        this.length=res.data.length
        console.log(res,"gp路径下节点信息")
      })
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
    load(){
      let data=new FormData();
      this.$http.post("/fmc/gap",data).then(res => {
        console.log(res);
        if (typeof res === "string") {
          res = JSON.parse(res);
        }
        console.log(res);
        this.limitsData = this.buildTree(res.data);
      });
    },
    chooseType() {
      document.getElementById("upload_file1").click();
    },
    
    // //附件上传
    // upload(e) {
    //   //获取选定的文件
    //   let tFile = e.target.files[0];
    //   // let len = tFiles.length;
    //   function createObjectURL(object) {
    //     return window.URL
    //       ? window.URL.createObjectURL(object)
    //       : window.webkitURL.createObjectURL(object);
    //   }
    //   //开始上传每一个文件
    //   var imgurl = createObjectURL(tFile);
    //   var item = {
    //     name: tFile.name,
    //     imgs: imgurl
    //   };
    //   //特殊需求获取文件名字 显示使用
    //   this.file_name=tFile.name
    //   //开始上传文件 新建一个formData
    //   let param = new FormData();
    //   //通过append向form对象添加数据 ！！！图片数据
    //   console.log(tFile,'tFile')
    //   param.append("f", tFile);
    //   //请求
    //   this.$http.post("/fmc/upf",param).then(res => {
    //     //特殊需求 数据赋值
    //     console.log(res)
    //     alert("上传成功")
    //   });
    // },
  },
  created() {
    
    this.load()
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
  /* display: flex; */
  height: 100%;
  background-color: #fff

}
.treeDir {
  position: relative;
  float: left;
  width: 25%;
  min-width: 200px;
  height: 100%;
  margin-right: 10px;
  background-color: #fff;

}
.treeDir >>> .el-tree {
  height: 82%;
  overflow-y: auto;
}
.treeTitle {
  margin: 29px 0 19px 0;
  font-size: 16px;
  font-weight: 400;
  color: #070707;
}
.treeBtn {
  margin-top:20px;
  text-align: left;
  width: 100%;
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
    border: 1px solid #99D3F5;
    border-radius: 4px;
    padding: 9px 12px;
    overflow: hidden;
    color:white;
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
    background: #AADFFD;
    border-color: #78C3F3;
    color: #004974;
    text-decoration: none;
}

</style>
<style >
   .el-table__body tr.current-row>td{
  background-color: #c3e0ff !important;
  /* color: #f19944; */  /* 设置文字颜色，可以选择不设置 */
}
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
  background-color: #c0c4cc !important;
  color: white
}
</style>