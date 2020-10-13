<template>
  <!-- 报销 -->
  <div class="OnBusiness">
    <div class="content">
      <div class="table_top">
        <input type="text" v-model="content1_v" placeholder="搜索创建人姓名" />
        <el-button type="primary" @click="apply" v-has="101">申请</el-button>
      </div>
      <el-table
        :data="tableData.filter(data => !content1_v || data.applyer.toLowerCase().includes(content1_v.toLowerCase())).slice((this.currentPage1-1)*this.pageSize,this.currentPage1*this.pageSize)"
        style="width: 95.8%;margin:0 2.1%;height:500px;overflow:auto"
        align="center"
        height="500"
        border
        header-cell-class-name="t_h"
      >
        <el-table-column label="创建人/经办人" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.applyer || username_f }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime|time_f }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建事由" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.reason }}</span>
          </template>
        </el-table-column>
        <el-table-column label="报销类别" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.ekind }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="出差事由"
          align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.reason }}</span>
          </template>
        </el-table-column>-->
        <!-- <el-table-column 
          label="审批进程" 
          align="center">
          <template slot-scope="scope">
            <div class="operation">
              <span style="color:#3399FF"
                @click="handleEdit(scope.row.wid)" v-has="102">查看</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.result|ownstatus_f }}</span>
          </template>
        </el-table-column>-->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <span style="color:#3399FF" @click="handleEdit_xiugai(scope.row)">修改</span>
              <span style="color:#FF5454" @click="handleEdit_delete(scope.row.eid)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <span class="demonstration">每页10条</span>
        <el-pagination
          :current-page.sync="currentPage1"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="tableData.filter(data => !content1_v || data.applyer.toLowerCase().includes(content1_v.toLowerCase())).length"
        ></el-pagination>
      </div>
      <!-- 审批弹窗 -->
      <el-dialog
        :visible.sync="isprocess"
        width="60%"
        :close-on-click-modal="false"
        :show-close="false"
      >
        <ul>
          <li style="display:inline-block;">
            <div class="yuanxing">
              <span>申请人</span>
              <br />
              <span>{{user_name}}</span>
            </div>
          </li>
          <li style="display:inline-block" v-for="(item,index) in leader_1" :key="index+1">
            <div style="display:inline-block" v-if="Boolean(item[Object.keys(item)[0]])">
              <span>--</span>
              <span style="color:red" v-if="!Boolean(item[Object.keys(item)[1]])">X</span>
              <span v-if="Boolean(item[Object.keys(item)[1]])">✔️</span>
              <span>--</span>
            </div>
            <div class="yuanxing" v-if="Boolean(item[Object.keys(item)[0]])">
              <span>{{ leader_name2( item[Object.keys(item)[0]] ) }}</span>
              <br />
              <span>{{ leader_name( item[Object.keys(item)[1]] ) }}</span>
            </div>
          </li>
        </ul>
        <span>
          <el-button style="margin-left:30px;" @click="isprocess=false,reload()">关闭</el-button>
        </span>
      </el-dialog>
      <!-- 
        
        sdasd
        asd
   
        a
        
      -->
      <!-- Form申请表单 -->
      <el-dialog
        title="报销申请详情内容"
        width="30%"
        :visible.sync="dialogFormVisible"
        @close="dialogFormVisibleclose"
        :close-on-click-modal="false"
      >
        <el-form :model="user" ref="user" :rules="rules" label-width="100px">
          <el-form-item label="创建人员：" :label-width="formLabelWidth" prop="applyer">
            <el-select v-model="user.applyer" placeholder="请选择" style="width:95%">
              <el-option
                v-for="item in this.user_data"
                :key="item.uid"
                :label="item.username"
                :value="item.uid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间：" :label-width="formLabelWidth" prop="createTime">
            <div class="block">
              <el-date-picker
                style="width:95%"
                v-model="user.createTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="8:00:00"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="报销金额：" :label-width="formLabelWidth" prop="price">
            <el-input style="width:95%;" v-model="user.price"></el-input>
          </el-form-item>
          <el-form-item label="费用明细：" :label-width="formLabelWidth" prop="reason">
            <el-input type="textarea" v-model="user.reason" style="width:95%;"></el-input>
          </el-form-item>

          <el-form-item label="报销类别：" :label-width="formLabelWidth" prop="ekind">
            <el-input v-model="user.ekind" style="width:95%"></el-input>
          </el-form-item>
          <div style="display:flex;justify-content:space-between">
            <div>
              <span>上传附件：</span>
            </div>
            <div>
              <a href="javascript:;" :class="[isActive?'file':'file']">
                <input type="file" id="myFile" @change="upload_excel($event)" />上传附件
              </a>
            </div>
          </div>
          <div
            style="display:flex;flex-direction:column;align-items:center;overflow:auto;height:100px "
          >
            <el-tag
              :key="index"
              v-for="(item,index) in file_name"
              closable
              :disable-transitions="false"
              style="margin:10px;width:230px;cursor:pointer"
              @click="downform(item.id)"
              @close.stop="handleClose(index)"
            >
              {{item.name}}
              <i
                class="el-icon-picture-outline"
                size="mini"
                style="color:green"
                v-show="isPhoto(item.name)"
                @click.stop="eyePhoto(item.id)"
              >查看</i>
            </el-tag>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="submit_canael('user')">取 消</el-button>
          <el-button type="primary" @click="submit('user')">提 交</el-button>
        </div>
      </el-dialog>
      <el-dialog title="图片展示" :visible.sync="photo_show">
        <div>
          <img :src="showPhoto" alt="图片" style="width:100%;height:100%" />
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  inject: ["reload"],
  name: "Leave",
  data() {
    return {
      photo_show: false,
      showPhoto: "",
      content1_v: "",
      currentPage1: 1,
      pageSize: 10, //每页条数
      isActive: true,
      file_name: [],
      rules: {
        createTime: [
          { required: true, message: "请选择创建日期时间", trigger: "blur" },
        ],
        downtime: [
          { required: true, message: "请选择结束日期时间", trigger: "change" },
        ],
        day: [{ required: true, message: "请输入创建天数", trigger: "change" }],
        applyer: [
          { required: true, message: "请选择创建人员", trigger: "blur" },
        ],
        // leaveaddr: [
        //   { required: true, message: "请输入出差地点", trigger: "change" }
        // ],
        reason: [
          { required: true, message: "请输入费用明细", trigger: "blur" },
        ],
        agent1: [
          { required: true, message: "审批人不得为空", trigger: "change" },
        ],
        // xhduty: [
        //   { required: true, message: "请输入协会职务", trigger: "change" }
        // ],
        // fulldata: [
        //   { required: true, message: "请输入协会职务", trigger: "change" }
        // ]
      },
      agent1_sum: {},
      agent2_sum: {},
      agent3_sum: {},
      user_name: "",
      user_data: [],
      leader_1: [],
      content_v: "",
      isprocess: false,
      num: 0,
      fid: [],
      float: [],
      activeIndex: "",
      busin_peole: [],
      tableData: [
        //   {
        //   agent1:3,
        //   agent2:15,
        //   agent3:20,
        //   downtime: 1570060800000,
        //   uptime: 1569888000000,
        //   wtype: 1,
        //   qjtime: 48,
        //   ownstatus: null,
        //   status1: 1,
        //   status2: 2,
        //   status3: null
        // }
      ],
      formLabelWidth: "120px",
      dialogFormVisible: false,
      user: {
        fid: [],
      },
      submit_status: 1,
      options: [],
      res: [],
      respon: {
        res1: [],
        res2: [],
        res3: [],
      },
    };
  },
  methods: {
    dialogFormVisibleclose() {
      this.$nextTick(() => {
        this.$refs.user.clear_f();
        this.$refs.user.resetFields();
        this.submit_status = 1;
        this.file_name = [];
      });
    },
    //图片判断是否
    isPhoto(value) {
      //value 为传入文件名
      let imglist = [
        "png",
        "jpg",
        "jpeg",
        "bmp",
        "gif",
        "PNG",
        "JPG",
        "JPEG",
        "BMP",
        "GIF",
      ];
      let mstatus = false;
      // 进行图片匹配
      mstatus = imglist.some((item) => {
        console.log(item);
        return value.indexOf(item) > -1;
      });
      return mstatus;
    },
    eyePhoto(id) {
      console.log("id", id);
      if (id == "" || id == null) return false;
      var data = new FormData();
      data.append("fmid", id);
      this.$http({
        url: "/fmc/goi",
        method: "post",
        data: data,
      }).then((res) => {
        console.log(res, "res______");
        //  console.log(res.config, "res---------");
        //  var url = res.config.url + "?" + 't='+sessionStorage.getItem('token') +'&'+'fid='+id;
        //  console.log(url,"url");
        this.photo_show = true;
        this.showPhoto = res.data.fpath;
        //   console.log('res');
        // this.download(res,fileName)
        // this.file_name.push(fileName)
      });
    },
    //删除表单数据
    handleEdit_delete(num) {
      let data = new FormData();
      data.append("id", num);
      this.$confirm("确认删除信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.$http.post("/Ex/de", data).then((res) => {
          this.load();
          console.log(res);
        });
      });
    },
    //下载文件
    downform(id) {
      if (id == "" || id == null) return false;
      // let t=sessionStorage.getItem("token")
      var data = new FormData();
      data.append("fid", id);
      this.$http({
        url: "/fmc/dpf",
        method: "post",
        data: data,
        responseType: "blob",
      }).then((res) => {
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
        this.download(res, fileName);
        // this.file_name.push(fileName)
      });
      // .catch(error => {});
    },
    //获取文件名
    downform_name(id) {
      console.log("22222_____");
      if (id == "" || id == null) return false;
      // let t=sessionStorage.getItem("token")
      var data = new FormData();
      data.append("fid", id);
      this.$http({
        url: "/fmc/dpf",
        method: "post",
        data: data,
        // responseType: "blob"
      }).then((res) => {
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
        fileName = decodeURIComponent(fileName);
        // this.download(res,fileName)
        let obj1 = {};
        this.$set(obj1, "name", fileName);
        this.$set(obj1, "id", id);

        this.file_name.push(obj1);
        // console.log('');
      });
      // .catch(error => {});
    },
    handleEdit_xiugai(scope) {
      this.submit_status = 2;
      let a = JSON.parse(JSON.stringify(scope));
      this.user = a;
      this.user.applyer = Number(a.applyer);
      // let a=JSON.parse(JSON.stringify(this.tableData))

      // this.user=this.tableData[Object.keys(this.tableData)[num]]
      console.log(this.user, "22");
      // this.user.applyer=Number(this.user.applyer)
      console.log(this.user.fid, "文件库内容");
      //文件名下载
      if (this.user.fid != "" && this.user.fid != null) {
        for (var item of this.user.fid.split(",")) {
          console.log(item, "wenjian ");
          if (item != null && item != "" && item != "null")
            this.downform_name(item);
        }
      }
      this.dialogFormVisible = true;
    },
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
    upload_excel(e) {
      //获取选定的文件
      let tFiles = e.target.files;
      let len = tFiles.length;
      //   if(!tFiles[0].type.match("excel")){
      //       alert("请务必上传excel文件")
      //       e.target.value=""
      //       return false
      //   }
      function createObjectURL(object) {
        return window.URL
          ? window.URL.createObjectURL(object)
          : window.webkitURL.createObjectURL(object);
      }
      for (var i = 0; i < len; i++) {
        //开始上传每一个文件
        var imgurl = createObjectURL(tFiles[i]);
        var item = {
          name: tFiles[i].name,
          imgs: imgurl,
        };
        //特殊需求获取文件名字 显示使用
        let obj1 = {};
        this.$set(obj1, "name", tFiles[i].name);
        // this.file_content=tFiles[i]
        this.isActive = false;
        // 开始上传文件 新建一个formData
        let param = new FormData();
        //通过append向form对象添加数据 ！！！图片数据
        param.append("f", tFiles[i]);
        //FormData私有类对象，访问不到，可以通过get判断值是否传进去
        let config = {
          //添加请求头
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        // var that =this
        //请求
        this.$http({
          url: "/fmc/upf",
          method: "post",
          data: param,
          config,
        }).then((res) => {
          alert("上传成功");
          // for(var key in res.data ){
          //   this.fid=res.data[key].fid
          // }
          console.log(typeof String(res.data[0].fid), "iddddddddd");
          obj1.id = res.data[0].fid;
          // this.$set(obj1,"id",res.data[0].fid)
          this.file_name.unshift(obj1);
          this.user.fid = this.user.fid + "," + String(res.data[0].fid);
          // console.log(this.user.fid.split(",") ,"this.user.fid.split(",") ");
          // console.log(this.user.fid.split(",") ).unshift((res.data[0].fid),"this.user.fid.split(",") ).unshift(res.data[0].fid");
          // (this.user.fid.split(",") ).unshift(res.data[0].fid)
          console.log(this.user.fid, "上传的fid库");
          //特殊需求部分 页面状态
        });
      }
    },
    handleReload() {
      this.reload(); // 在想要刷新页面的时候调用reload方法
    },
    leader_name(type) {
      if (type == null) {
        return "未审核";
      } else if (type == 1) {
        return "通过";
      } else if (type == 0) {
        return "未通过";
      }
    },
    leader_name2(type) {
      if (type == null) {
        return "未分配";
      } else {
        return type;
      }
    },
    user_select() {
      let data = new FormData();
      this.$http.post("/uc/gau", data).then((res) => {
        this.user_data = res.data;
        console.log(this.user_data, " this.user_data");
      });
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.activeIndex = key;
      console.log(this.activeIndex, "activeIndex");
      console.log(key == this.activeIndex);
    },
    handleEdit(num) {
      let data = new FormData();
      data.append("id", num);
      data.append("t", sessionStorage.getItem("token"));
      this.$http.post("/job/qbi", data).then((res) => {
        this.user_name = res.data.uname;
        for (var item in res.data) {
          if (item.match("agent1") || item.match("status1")) {
            this.$set(this.agent1_sum, item, res.data[item]);
          }
          if (item.match("agent2") || item.match("status2")) {
            this.$set(this.agent2_sum, item, res.data[item]);
          }
          if (item.match("agent3") || item.match("status3")) {
            this.$set(this.agent3_sum, item, res.data[item]);
          }
        }
        this.leader_1.push(this.agent1_sum);
        this.leader_1.push(this.agent2_sum);
        this.leader_1.push(this.agent3_sum);
        console.log(this.leader_1, "123211");
        this.isprocess = true;
        console.log(res);
      });

      // console.log(index, row);
      // this.isprocess=true;
      // this.num=index;
    },
    apply() {
      this.clear_f(this.user);
      this.dialogFormVisible = true;
      let data = new FormData();
      data.append("as", 0);
      this.$http.post("/job/ql", data).then((res) => {
        this.options = res.data;
        console.log(this.options);
      });
      this.$http.post("/job/gol", data).then((res) => {
        console.log(res, "出差");
        this.busin_peole = res.data;
        // this.res=res.data
        // console.log(this.res);
        // this.respon.res1=JSON.parse(JSON.stringify(this.res));
        // this.respon.res2=JSON.parse(JSON.stringify(this.res));
        // this.respon.res3=JSON.parse(JSON.stringify(this.res));
      });
    },
    submit_canael(formName) {
      // this.clear_f(this.user);
      this.$refs.user.resetFields();
      this.dialogFormVisible = false;
      //  this.$refs[formName].resetFields();
      this.submit_status = 1;
      this.file_name = [];
    },
    submit(formName) {
      let data = new FormData();
      for (let key in this.user) {
        console.log(key, "提交内容");
        if (this.user[key] != "" && this.user[key] != null)
          data.append(key, this.user[key]);
      }
      data.set("createTime", new Date(this.user.createTime));
      data.set("eid", parseInt(this.user.eid));
      console.log(typeof this.user.eid);
      console.log(typeof new Date(this.user.createTime));
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("确认提交数据", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info",
          }).then(() => {
            //提交数据
            if (this.submit_status == 1) {
              data.delete("eid");
              this.$http({
                method: "post",
                url: "/Ex/lea",
                // responseType: "blob",
                data: data,
              })
                .then((res) => {
                  this.dialogFormVisible = false;
                  this.$refs.user.resetFields();
                  this.file_name = [];
                  this.submit_status = 1;
                  this.load();
                })
                .catch((error) => {
                  this.$message.error("提交失败");
                  this.dialogFormVisible = false;
                });
            } else if (this.submit_status == 2) {
              this.$http({
                method: "post",
                url: "/Ex/ue",
                // responseType: "blob",
                data: data,
              })
                .then((res) => {
                  this.dialogFormVisible = false;
                  this.$refs.user.resetFields();
                  this.file_name = [];
                  this.submit_status = 1;
                  this.load();
                })
                .catch((error) => {
                  this.$message.error("提交失败");
                  this.dialogFormVisible = false;
                });
            }
            //修改数据
          });
        } else {
          // alert("信息填写不规范或不完整");
          this.$alert("信息填写不规范或不完整", "提示", {
            confirmButtonText: "确定",
          });
          return false;
        }
      });
    },
    //文件下载
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
    load() {
      let data = new FormData();
      this.$http.post("/Ex/el", data).then((res) => {
        if (res.data != -1002) this.tableData = res.data;
        console.log(res, "oll");
      });
    },
  },
  mounted() {
    this.user_select();
    let float = sessionStorage.getItem("float");
    this.float = JSON.parse(float);
    this.activeIndex = this.float.menu_index;
    this.load();
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
<style scoped>
body .el-table::before {
  z-index: inherit;
}
.text-shenglue {
  display: block;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  -icab-text-overflow: ellipsis;
  -khtml-text-overflow: ellipsis;
  -moz-text-overflow: ellipsis;
  -webkit-text-overflow: ellipsis;
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
.file_1 {
  width: 100px;
  text-align: center;
  position: relative;
  display: inline-block;
  background: lightgrey;
  border: 1px solid #99d3f5;
  border-radius: 4px;
  padding: 9px 12px;
  overflow: hidden;
  color: white;
  text-decoration: none;
  text-indent: 0;
  line-height: 20px;
}
.file_1 input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
}
.yuanxing {
  display: inline-block;
  width: 108px;
  height: 108px;
  margin: 31px auto;
  border: 2px solid #303133;
  text-align: center;
  line-height: 38px;
  font-weight: bold;
  /* background: burlywood; */
  border-radius: 50%;
}
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
.Leave {
  background-color: #f5f5f5;
}
.content {
  background: #fff;
}
.table_top {
  display: flex;
  /* justify-content: space-between; */
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
.process {
  width: 585px;
  height: 151px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px auto;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.16);
}
.double {
  display: flex;
  align-items: center;
}
.circle {
  width: 63px;
  height: 63px;
  border-radius: 50%;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
}
.pass {
  color: green;
  font-weight: bold;
}
.nopass {
  color: red;
  font-weight: bold;
}
</style>
