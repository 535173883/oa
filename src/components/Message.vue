<template>
  <div class="Message">
    <div v-show="news">
      <!-- <h1>通知通告</h1> -->
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
      <!-- 通知攥写人发布界面 -->
      <div class="content" v-show="activeIndex=='51'">
        <div class="search">
          <div style="margin-left:20px">
            <span>主题：</span>
            <el-input v-model="value3" style="width:250px"></el-input>
            <!-- <el-select v-model="receivers" style="width:10%" multiple clearable>
            <el-option
              v-for="item in this.user_data"
              :key="item.uid"
              :label="item.username"
              :value="item.uid"
            ></el-option>
          </el-select>&#8195;&#8195;
          <span>阅读状态：</span>
          <el-select v-model="value1" style="width:10%"  clearable >
            <el-option label="已读" value="已读"></el-option>
            <el-option label="未读" value="未读"></el-option>
            </el-select>-->
            <el-button type="primary" @click="search_title()">搜索</el-button>
          </div>

          <div align="right" style="margin:20px;display:inline" v-if="news">
            <el-button
              type="primary"
              icon="el-icon-plus"
              style="margin:10px"
              @click="addnews()"
            >添加消息</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              style="margin:10px;margin-left:30px"
              @click="deletenews()"
            >删除信息</el-button>
          </div>
        </div>

        <el-table
          ref="newslist"
          :data="newslist.filter(data => !content3_v || data.issuer.toLowerCase().includes(content3_v.toLowerCase())).slice((this.currentPage3-1)*this.pageSize,this.currentPage3*this.pageSize)"
          tooltip-effect="dark"
          style="width: 100%;cursor:pointer"
          highlight-current-row
          :lazy="true"
          @row-click="clickRow"
          @selection-change="handleSelectionChange"
          height="430"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="issuer" label="发件人" width="120">
            <template slot-scope="scope">
              <span :class="(scope.row.isread==1)?'nobold':'isbold'">{{scope.row.issuer}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="主题" show-overflow-tooltip>
            <template slot-scope="scope">
              <span :class="(scope.row.isread==1)?'nobold':'isbold'">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="阅读状况" width="200" height="50">
            <template slot-scope="scope" style="height:50px">
              <el-popover
                v-if="(scope.row.unreadpernum!=0)?true:false"
                placement="top-start"
                width="200"
                trigger="click"
              >
                <!-- <el-table :data="gridData">
                <el-table-column width="100" property="name" label="全部人员"></el-table-column>
                <el-table-column width="300" property="address" label="未读人员"></el-table-column>
                </el-table>-->
                <div
                  style="display:flex;flex-direction: row;justify-content:space-between;height:150px"
                >
                  <div style="height:150px;overflow:auto" align="left">
                    <b>已读人员：</b>
                    <div v-for="(item,index) in allreadcontent" :key="index">
                      <span>{{item.peo}}</span>
                    </div>
                  </div>
                  <div style="margin-top:20px;width: 1px;height: 80%; background: darkgray;"></div>
                  <div style="height:150px;overflow:auto" align="left">
                    <b>未读人员：</b>
                    <!-- <ul v-for="(item,index) in unreadcontent" :key="index">
                      <li style="list-style-type:none;">{{item.unpeo}}</li>
                    </ul>-->
                    <div v-for="(item,index) in unreadcontent" :key="index">
                      <span>{{item.unpeo}}</span>
                    </div>
                  </div>
                </div>
                <!-- <el-table :data="unreadcontent" style="height:200px;overflow:auto">
                <el-table-column width="100" property="unpeo" label="未读人员"></el-table-column>
                </el-table>-->
                <el-button
                  type="text"
                  slot="reference"
                  style="color:red;"
                  @click.stop="unreadlist(scope.row)"
                >{{scope.row.unreadpernum}}人未读</el-button>
              </el-popover>
              <el-popover
                v-show="(scope.row.unreadpernum==0)?true:false"
                placement="top-start"
                width="200"
                trigger="click"
              >
                <!-- <el-table :data="allreadcontent" style="height:200px;overflow:auto">
                  <el-table-column width="100" property="peo" label="全部人员"></el-table-column>
                </el-table>-->
                <div style="height:100px;overflow:auto" align="left">
                  <b>已读人员：</b>
                  <div v-for="(item,index) in allreadcontent" :key="index">
                    <span>{{item.peo}}</span>
                  </div>
                </div>
                <el-button
                  type="text"
                  slot="reference"
                  style="color:#67c23a"
                  @click.stop="allreadlist(scope.row)"
                >全部已读</el-button>
              </el-popover>
              <!-- <span style="color:#67c23a" v-show="(scope.row.unreadpernum==0)?true:false">全部已读</span> -->
            </template>
          </el-table-column>
          <el-table-column label="日期" width="250">
            <template slot-scope="scope">
              <span
                :class="(scope.row.isread==1)?'nobold':'isbold'"
              >{{ scope.row.createTime|time_f }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <!-- <span class="demonstration">每页10条</span> -->
          <el-pagination
            :current-page.sync="currentPage3"
            :page-size="8"
            layout="prev, pager, next, jumper"
            :total="newslist.filter(data => !content3_v || data.issuer.toLowerCase().includes(content3_v.toLowerCase())).length"
          ></el-pagination>
        </div>
      </div>
      <!-- 通知接收人员界面 -->
      <div class="content" v-show="activeIndex=='32'">
        <div align="left" style="margin:30px">
          <span>发布人：</span>
          <el-select v-model="value1" style="width:15%" clearable>
            <el-option
              v-for="item in this.user_data"
              :key="item.uid"
              :label="item.username"
              :value="item.uid"
            ></el-option>
          </el-select>&#8195;&#8195;
          <span>阅读状态：</span>
          <el-select v-model="value2" style="width:15%" clearable>
            <el-option label="已读" value="1"></el-option>
            <el-option label="未读" value="0"></el-option>
          </el-select>
          <span>主题：</span>
          <el-input v-model="value3" style="width:150px"></el-input>
          <el-button type="primary" @click="search_data()">搜索</el-button>
        </div>

        <el-table
          ref="newslist2"
          :data="newslist2.filter(data => !content3_v || data.issuer.toLowerCase().includes(content3_v.toLowerCase())).slice((this.currentPage3-1)*this.pageSize,this.currentPage3*this.pageSize)"
          tooltip-effect="dark"
          style="width: 100%;cursor:pointer"
          highlight-current-row
          @row-click="clickRow2"
          @selection-change="handleSelectionChange"
          height="430"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="issuer" label="发件人" width="120">
            <template slot-scope="scope">
              <span :class="(scope.row.isread==1)?'nobold':'isbold'">{{scope.row.issuer}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="主题" show-overflow-tooltip>
            <template slot-scope="scope">
              <span :class="(scope.row.isread==1)?'nobold':'isbold'">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="日期" width="250">
            <template slot-scope="scope">
              <span
                :class="(scope.row.isread==1)?'nobold':'isbold'"
              >{{ scope.row.createTime|time_f }}</span>
            </template>
            <!-- <template slot-scope="scope">
            
            {{ scope.row.createTime|time_f }}
            </template>-->
          </el-table-column>
        </el-table>
        <div class="block">
          <!-- <span class="demonstration">每页10条</span> -->
          <el-pagination
            :current-page.sync="currentPage3"
            :page-size="8"
            layout="prev, pager, next, jumper"
            :total="newslist2.filter(data => !content3_v || data.issuer.toLowerCase().includes(content3_v.toLowerCase())).length"
          ></el-pagination>
        </div>
      </div>
    </div>

    <!-- <div class="cell" v-for="(item,index) of newslist" :key="index" >
        <el-checkbox label v-model="item.ischeck" style="display:flex" v-show="manager_status"></el-checkbox>
        <el-tooltip
          class="item"
          effect="dark"
          :content="unreadcontent"
          placement="right-start"
          :manual="manualstatus"
        >
          <el-badge :value="readpop(item)" class="item" :type="readcolor(item)">
            <div class="top" @click="opennews(item)" @mouseenter="unreadlist(item)">
              <span class="spancontent" align="center">{{item.title}}</span>
              <span
                :class="(manager_status==true)?'manage_is':'manage_no'"
              >{{item.createTime |time_f}}</span>
            </div>
          </el-badge>
        </el-tooltip>
    </div>-->
    <!-- 通知公告具体内容打开接收人部分 -->
    <div v-show="newsopen" style>
      <h1>通告内容</h1>
      <span>{{creatime |time_f}}</span>
      <span style="margin-left:20px;">发送人：{{issuer}}</span>
      <br />
      <!-- <h2 style="margin:30px;width:600px;margin:0 auto">{{title}}</h2> -->
      <el-input style="margin-top:20px;width:80%" readonly v-model="title" placeholder="请输入标题内容"></el-input>
      <!-- <pre class="pre">&#8195; &#8195; {{content}}</pre> -->
      <el-input
        type="textarea"
        readonly
        style="margin-top:50px;width:80%"
        :rows="10"
        v-model="content"
        placeholder="请输入信息内容"
      ></el-input>
      <br />
      <div style="width:100%;text-align:left;margin-left: 10%;
    margin-top: 10px;">
        <b>附件：</b>
      </div>
      <br />
      <el-form disabled style="width:100%;margin-left: 10%;">
        <newUpload
          ref="newUpload1"
          :Upload_showdisable="Upload_showdisable"
          prop="mid"
          style="text-align:left"
        ></newUpload>
      </el-form>

      <!-- <div
        style="display:flex;flex-direction:column;align-items:center;overflow:auto;height:100px "
      >
        <el-tag
          :key="index"
          v-for="(item,index) in file_name"
          :disable-transitions="false"
          style="margin:10px;width:230px;cursor:pointer"
          @click="downform(item.id)"
        >{{item.name}}</el-tag>
      </div>-->
      <br />
      <div style="margin-top:20px">
        <el-button plain @click="reload()">返回</el-button>
      </div>
    </div>
    <!-- 通知公告具体内容打开攥写人部分 -->
    <div v-show="newsedit">
      <h1>通告内容</h1>
      <span>{{creatime |time_f}}</span>
      <span v-if="!new_status" style="margin-left:20px;">发送人：{{issuer}}</span>
      <br />
      <el-input style="margin-top:20px;width:80%" v-model="title" placeholder="请输入标题内容"></el-input>
      <el-input
        type="textarea"
        style="margin-top:50px;width:80%"
        :rows="10"
        v-model="content"
        placeholder="请输入信息内容"
      ></el-input>
      <br />
      <div v-if="!open_status">
        <span style="text-align:left">接收人：</span>
        <el-select
          v-model="receivers"
          placeholder="默认为全员选中"
          style="margin-top:20px;width:76%"
          multiple
          clearable
        >
          <el-option
            v-for="item in this.user_data"
            :key="item.uid"
            :label="item.username"
            :value="item.uid"
          ></el-option>
        </el-select>
      </div>
      <div
        style="display:flex;justify-content:start;margin-left:10%;margin-right:10%;margin-top:30px"
      >
        <div>
          <span>上传附件：</span>
          <!-- <a href="javascript:;" @click="downform()"></a> -->
        </div>
        <div>
          <!-- <a href="javascript:;" :class="[isActive?'file':'file_1']">
            <input type="file" id="myFile" @change="upload_pdf($event)" />上传附件
          </a>-->
          <newUpload ref="newUpload" :Upload_showdisable="Upload_showdisable" prop="mid"></newUpload>
        </div>
      </div>
      <!-- <div
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
        >{{item.name}}</el-tag>
      </div>-->
      <div style="margin-top:20px">
        <el-button plain @click="editnews()" icon="el-icon-edit" v-if="open_status">修改</el-button>
        <el-button plain @click="newscancel()">返回</el-button>
        <el-button type="primary" @click="submitnews()" v-if="!open_status">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import newUpload from "./work/newUpload";
export default {
  components: { newUpload },
  inject: ["reload"],
  name: "Message",
  data() {
    return {
      fileList: [],
      Upload_showdisable: false,
      fujianfile_name: "",
      fid: [],
      file_name: [],
      activeIndex: "",
      menu: [{ name: "通知查看", id: "32" }],
      content3_v: "",
      currentPage3: 1, //当前页2
      pageSize: 8, //每页条数
      issuer: "",
      manualstatus: false,
      newvalue: "未读",
      typevalue: "danger",
      visible: false,
      manager_status: false,
      new_status: false,
      //控制修改按钮显隐
      open_status: false,
      night: "",
      receivers: "",
      value1: "",
      value2: "",
      value3: "",
      totalnum: "",
      creatime: "",
      fids: "",
      newid: "",
      title: "",
      user_data: [],
      content: "",
      unreadcontent: [],
      allreadcontent: [],
      newslist: [],
      newslist2: [],
      //攥写人显示部分
      newsedit: false,
      //接收人显示部分
      newsopen: false,
      news: true,
      isActive: true,
      multipleSelection: "",
      list: [
        {
          title: "系统通知",
          isnew: 1,
          content: "您的请假已通过",
          date: "2019-08-12",
        },
        {
          title: "张三",
          isnew: 1,
          content:
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
          date: "2019-08-12",
        },
        {
          title: "李四",
          isnew: 0,
          content: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
          date: "2019-08-12",
        },
      ],
    };
  },
  methods: {
    //下载文件名字
    downform_name(type, num) {
      if (type == "") {
        return false;
      }
      var data = new FormData();
      data.append("fid", type);
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
        fileName = decodeURIComponent(fileName);
        //攥写人的文件名字展示
        if (num == 1) {
          let obj_file = {};
          obj_file.id = type;
          obj_file.name = fileName;
          this.file_name.push(obj_file);
        }
        console.log(this.file_name, "this.file_name");
        //查看人的文件类展示
        if (num == 2) {
          let obj_file = {};
          obj_file.id = type;
          obj_file.name = fileName;
          this.file_name.push(obj_file);
        }
        // if(num==2)this.fujianfile_name = this.fujianfile_name  + "\xa0\xa0\xa0 " + fileName;
        console.log(this.fujianfile_name, "this.fujianfile_name");
        // if(num==2){
        //   let f={};
        //   f.fnm=fileName;
        //   f.fid=type
        //   this.shouwen_upname.push(f);
        // }
        //列表解析文件名
        // if(num==3){
        //   return "123"
        // }
        // this.download(res, fileName);
      });
      // .catch(error => {});
    },
    //下载表
    downform(type) {
      if (type == "") return false;
      var data = new FormData();
      data.append("fid", type);
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
      });

      // .catch(error => {});
    },
    //下载
    download(data, fileName) {
      fileName = decodeURIComponent(fileName);
      console.log(fileName);
      if (!data) {
        return;
      }
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
    handleClose(tag) {
      console.log(tag);
      console.log(this.file_name, "nameeee");
      this.$confirm("确认删除该文件", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.file_name.splice(tag, 1);
        this.fid.splice(this.fid.indexOf(tag), 1);
      });

      console.log(this.fid, "fidddd");
      console.log(this.file_name, "file_name");
    },
    //附件上传
    upload_pdf(e) {
      //获取选定的文件
      let tFiles = e.target.files;
      let len = tFiles.length;
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
        // this.file_name = tFiles[i].name;
        //开始上传文件 新建一个formData
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
        //请求
        this.$http({
          url: "/fmc/upf",
          method: "post",
          data: param,
          config,
        }).then((res) => {
          alert("上传成功");
          // for (var key in res.data) {
          //   this.fid = res.data[key].fid;
          // }
          obj1.id = res.data[0].fid;
          this.file_name.unshift(obj1);
          // this.fid= this.fid+","+String(res.data[0].fid)
          console.log(typeof this.fid, "---------------");

          this.fid.push(String(res.data[0].fid));
          console.log(this.fid, "这是我要上传的附件的ID");
          //特殊需求部分 页面状态
          this.isActive = true;
        });
      }
    },
    search_title() {
      let data = new FormData();
      data.append("rs", 1);
      data.append("issuer", "");
      data.append("isread", "");
      data.append("title", this.value3);
      this.$http.post("/not/list", data).then((res) => {
        console.log(res);
        if (res.data != null) this.newslist = res.data;
      });
    },
    search_data() {
      let data = new FormData();
      data.append("rs", 0);
      data.append("issuer", this.value1);
      data.append("isread", this.value2);
      data.append("title", this.value3);
      this.$http.post("/not/list", data).then((res) => {
        if (res.data != null) this.newslist2 = res.data;
        console.log(res);
      });
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.activeIndex = key;
      console.log(this.activeIndex, "activeIndex");
      console.log(key == this.activeIndex);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    clickRow(row) {
      this.$refs.newslist.toggleRowSelection(row);
      this.opennews(row);
    },
    clickRow2(row) {
      this.$refs.newslist2.toggleRowSelection(row);
      this.opendetals(row);
    },
    // 获取滚动条当前的位置
    getScrollTop() {
      // debugger
      let scrollTop = 0;
      // document.body.clientHeight
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
      } else if (document.body) {
        scrollTop = document.body.scrollTop;
      }
      return scrollTop;
      alert(scrollTop, "scrollTop");
    },
    // 获取当前可视范围的高度
    getClientHeight() {
      let clientHeight = 0;
      if (document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = Math.min(
          document.body.clientHeight,
          document.documentElement.clientHeight
        );
      } else {
        clientHeight = Math.max(
          document.body.clientHeight,
          document.documentElement.clientHeight
        );
      }
      return clientHeight;
      console.log(clientHeight, "clientHeight");
    },

    // 获取文档完整的高度
    getScrollHeight() {
      return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      console.log(
        Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight
        ),
        "Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)"
      );
    },
    onScroll() {
      this.getScrollHeight();
      this.getClientHeight();
      this.getScrollTop();
    },
    //删除信息
    deletenews() {
      let data = new FormData();
      let a = this.multipleSelection;
      let rids = [];
      for (let key in a) {
        rids.push(a[key].id);
      }
      if (rids.length == 0) {
        alert("请选择信息进行删除");
        return false;
      }
      data.append("id", rids);
      this.$confirm("是否确认删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.$http.post("/not/del", data).then((res) => {
          this.newlist();
          console.log(res);
        });
      });
    },
    //判断是否为消息管理人员
    ismanager() {
      let data = new FormData();
      // data.append('','')
      this.$http.post("/not/cim", data).then((res) => {
        this.manager_status = res.data;
        this.manualstatus = !res.data;
        if (res.data == true) {
          this.menu.push({ name: "通知撰写", id: "51" });
        }

        // this.newlist(this.manager_status);
        console.log(res);
      });
    },
    handleReload() {
      this.reload(); // 在想要刷新页面的时候调用reload方法
    },
    //人员加载
    user_select() {
      let data = new FormData();
      this.$http.post("/uc/gau", data).then((res) => {
        this.user_data = res.data;
        console.log(this.user_data, " this.user_data");
      });
    },
    //未读人员查看
    open2(item) {
      this.unreadlist(item);
      // var that=this
      this.$notify({
        title: item.title,
        message: this.unreadcontent,
        duration: 0,
      });
    },
    unreadlist(item) {
      this.unreadcontent = [];
      this.allreadlist(item);
      // console.log(item,"mouseentermouseenter");
      let data = new FormData();
      data.append("id", item.id);
      this.$http.post("/not/sul", data).then((res) => {
        // let people = "未读人员：";
        for (let item of res.data) {
          let unpeople = {};
          unpeople.unpeo = item.uname;
          this.unreadcontent.push(unpeople);
          // people = people + "\xa0\xa0\xa0 " + item.uname;
        }
        console.log(this.unreadcontent, "unreadcontent");
        // if (people == "") {
        //   this.unreadcontent = "无";
        // } else {
        //   this.unreadcontent = people
        // }
        console.log(this.unreadcontent, "new");
      });
    },
    //已读人员名单
    allreadlist(item) {
      this.allreadcontent = [];
      // console.log(item,"mouseentermouseenter");
      let data = new FormData();
      data.append("id", item.id);
      this.$http.post("/not/srl", data).then((res) => {
        for (let item of res.data) {
          let people = {};
          people.peo = item.uname;
          this.allreadcontent.push(people);
        }
        // if (people == "") {
        //   this.allreadcontent = "无";
        // } else {
        //   // this.manualstatus=false
        //   this.allreadcontent = people;
        // }

        console.log(this.allreadcontent, "people");
      });
    },
    //isread消息
    isread(value) {
      if (value.isread == 1) {
        return false;
      }
      let data = new FormData();
      data.append("id", value.id);
      this.$http.post("/not/slo", data).then((res) => {
        console.log(res, "isread?");
      });
    },
    readpop(item) {
      let cc = "未读";
      if (this.manager_status == true) {
        if (item.unreadpernum == 0) {
          cc = "全部已读";
        } else {
          cc = item.unreadpernum + "人未读";
        }
      } else {
        if (item.isread == 1) {
          cc = "已读";
        }
      }
      return cc;
    },
    readcolor(item) {
      let cc = "danger";
      if (this.manager_status == true) {
        if (item.unreadpernum == 0) {
          cc = "success";
        } else {
          cc = "danger";
        }
      } else {
        if (item.isread == 1) {
          cc = "success";
        }
      }
      return cc;
    },
    //攥写人消息列表加载
    newlist(value) {
      console.log(this.manager_status, "this.manager_status");
      let data = new FormData();
      data.append("rs", 1);
      data.append("title", this.value3);
      data.append("isread", this.value2);
      data.append("issuer", this.value1);
      this.$http.post("/not/list", data).then((res) => {
        console.log(res, "/not/list");
        if (res.data != null) this.newslist = res.data;
        console.log(this.newslist, "this.newslist");
      });
    },
    //接受人消息列表加载
    newlist2() {
      console.log(this.manager_status, "this.manager_status");
      let data = new FormData();
      data.append("rs", 0);
      data.append("title", this.value3);
      data.append("isread", this.value2);
      data.append("issuer", this.value1);
      this.$http.post("/not/list", data).then((res) => {
        console.log(res, "/not/list");
        if (res.data != null) this.newslist2 = res.data;
        console.log(this.newslist2, "this.newslist2");
      });
    },
    newscancel() {
      this.newsedit = false;
      this.newsopen = false;
      this.news = true;
      this.title = "";
      this.content = "";
      this.receivers = "";
      this.creatime = "";
      this.newid = "";
      //关于文件盒子的清空
      this.file_name = [];
      this.newlist();
      this.newlist2();
      this.$refs.newUpload.fileList = [];
      this.fileList = [];
      // this.reload();
    },

    //消息修改
    editnews() {
      let data = new FormData();
      data.append("title", this.title);
      data.append("context", this.content);
      data.append("receivers", this.receivers);
      data.append("totalpernum", this.totalnum);
      data.append("id", this.newid);
      let fids = "";
      for (const i of this.$refs.newUpload.fileList) {
        fids += Number(i.raw.fid) + ",";
      }
      fids = fids.substring(0, fids.lastIndexOf(","));
      data.append("fids", fids);
      if (this.title == "") {
        alert("请完善标题内容填写");
        return false;
      }
      this.$confirm("确定修改", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.$http.post("/not/upn", data).then((res) => {
          this.newscancel();
          this.newlist();
          console.log(res);
        });
      });
    },
    //消息列表添加
    submitnews() {
      let data = new FormData();
      data.append("title", this.title);
      data.append("context", this.content);
      data.append("receivers", this.receivers);
      let fids = "";
      for (const i of this.$refs.newUpload.fileList) {
        fids += Number(i.raw.fid) + ",";
      }
      fids = fids.substring(0, fids.lastIndexOf(","));
      data.append("fids", fids);
      data.append("issuer", sessionStorage.getItem("username"));
      if (this.title == "") {
        alert("请完善标题内容、接收人信息填写");
        return false;
      }
      this.$http.post("/not/add", data).then((res) => {
        this.newscancel();
        this.newlist();
        this.$refs.newUpload.fileList = [];
        this.fileList = [];
        console.log(res);
      });
    },
    //深克隆
    deepClone(obj) {
      if (obj === null) return null;
      if (typeof obj !== "object") return obj;
      if (obj instanceof RegExp) return new RegExp(obj);
      if (obj instanceof Date) return new Date(obj);
      //保证克隆的结果和之前保持相同的所属类！而不用空的{}
      let newObj = new obj.constructor();
      for (let key in obj) {
        //检测内部的私有属性进行遍历
        if (obj.hasOwnProperty(key)) {
          newObj[key] = this.deepClone(obj[key]);
        }
      }
      return newObj;
    },
    //通知攥写详细打开
    opennews(item) {
      this.title = item.title;
      this.issuer = item.issuer;
      this.content = item.context;
      this.creatime = item.createTime;
      this.fids = item.fids;
      if (this.fids != null) {
        this.fids.split(",").forEach((item) => {
          this.downform_name(item, 1);
        });
      }

      this.open_status = true;
      this.newsedit = true;
      this.news = false;
      // this.isread(item);
      this.totalnum = item.totalpernum;
      this.newid = item.id;
      let data = new FormData();
      data.append("fid", this.fids);
      this.$http.post("/ac/gbf", data).then((res) => {
        this.fileList = [];
        for (var i = 0; i < res.data.length; i++)
          if (
            res.data[i].fname.indexOf(".jpg") != -1 ||
            res.data[i].fname.indexOf(".png") != -1 ||
            res.data[i].fname.indexOf(".jpeg") != -1 ||
            res.data[i].fname.indexOf(".png") != -1 ||
            res.data[i].fname.indexOf(".gif") != -1 ||
            res.data[i].fname.indexOf(".JPG") != -1 ||
            res.data[i].fname.indexOf(".JPEG") != -1 ||
            res.data[i].fname.indexOf(".PNG") != -1 ||
            res.data[i].fname.indexOf(".GIF") != -1
          ) {
            this.fileList.push({
              uid: res.data[i].fid,
              raw: {
                fid: res.data[i].fid,
              },
              name: res.data[i].fname,
              url: "http://fas.intertion.cn:9111/group1/" + res.data[i].fpath,
            });
          } else if (res.data[i].fname.indexOf("txt") != -1) {
            this.fileList.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../assets/image/txt.jpg"),
            });
          } else if (
            res.data[i].fname.indexOf(".docx") != -1 ||
            res.data[i].fname.indexOf(".doc") != -1
          ) {
            this.fileList.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../assets/image/docx.jpg"),
            });
          } else if (
            res.data[i].fname.indexOf(".xls") != -1 ||
            res.data[i].fname.indexOf(".xlsx") != -1
          ) {
            this.fileList.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../assets/image/ex.jpg"),
            });
          } else if (res.data[i].fname.indexOf("pdf") != -1) {
            this.fileList.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../assets/image/pdf.jpg"),
            });
          } else {
            this.fileList.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../assets/image/file.jpg"),
            });
          }
        this.$refs.newUpload.fileList = this.fileList;
      });
    },
    //接受人详细打开
    opendetals(item) {
      this.Upload_showdisable = false;
      this.title = item.title;
      this.issuer = item.issuer;
      this.content = item.context;
      this.creatime = item.createTime;
      this.fids = item.fids;
      if (this.fids != null) {
        this.fids.split(",").forEach((item) => {
          this.downform_name(item, 2);
        });
      }
      console.log(this.fids, "this.fids");
      this.newsopen = true;
      this.news = false;
      this.isread(item);
      this.totalnum = item.totalpernum;
      this.newid = item.id;
      let data = new FormData();
      data.append("fid", this.fids);
      this.$http.post("/ac/gbf", data).then((res) => {
        this.fileList = [];
        for (var i = 0; i < res.data.length; i++)
          if (
            res.data[i].fname.indexOf(".jpg") != -1 ||
            res.data[i].fname.indexOf(".png") != -1 ||
            res.data[i].fname.indexOf(".jpeg") != -1 ||
            res.data[i].fname.indexOf(".png") != -1 ||
            res.data[i].fname.indexOf(".gif") != -1 ||
            res.data[i].fname.indexOf(".JPG") != -1 ||
            res.data[i].fname.indexOf(".JPEG") != -1 ||
            res.data[i].fname.indexOf(".PNG") != -1 ||
            res.data[i].fname.indexOf(".GIF") != -1
          ) {
            this.fileList.push({
              uid: res.data[i].fid,
              raw: {
                fid: res.data[i].fid,
              },
              name: res.data[i].fname,
              url: "http://fas.intertion.cn:9111/group1/" + res.data[i].fpath,
            });
          } else if (res.data[i].fname.indexOf("txt") != -1) {
            this.fileList.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../assets/image/txt.jpg"),
            });
          } else if (
            res.data[i].fname.indexOf(".docx") != -1 ||
            res.data[i].fname.indexOf(".doc") != -1
          ) {
            this.fileList.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../assets/image/docx.jpg"),
            });
          } else if (
            res.data[i].fname.indexOf(".xls") != -1 ||
            res.data[i].fname.indexOf(".xlsx") != -1
          ) {
            this.fileList.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../assets/image/ex.jpg"),
            });
          } else if (res.data[i].fname.indexOf("pdf") != -1) {
            this.fileList.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../assets/image/pdf.jpg"),
            });
          } else {
            this.fileList.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../assets/image/file.jpg"),
            });
          }
        this.$refs.newUpload1.fileList = this.fileList;
      });
    },
    //定义时间转换函数
    formatDate(date, fmt) {
      date = new Date(date);

      if (typeof fmt === "undefined") {
        fmt = "yyyy-MM-dd HH:mm:ss";
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }

      let o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "H+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
      };
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + "";
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? str : ("00" + str).substr(str.length)
          );
        }
      }
      // return fmt
      console.log(fmt, "输出时间");
    },

    addnews() {
      this.open_status = false;
      this.new_status = true;
      this.newsedit = true;
      this.news = false;
      this.Upload_showdisable = true;
    },
  },
  mounted() {
    // var abc={
    //     obj:{b:1},
    //     array:[10,20,30],
    //     x:/\x61/,
    //     hh:null,
    //   }
    //   console.log(JSON.parse(JSON.stringify(abc)),"JSON");
    //   console.log(this.deepClone(abc),"deepClone");
    this.handleSelect("32");
    this.ismanager();
    this.newlist();
    this.newlist2();
    this.user_select();
    this.$nextTick(function () {
      window.addEventListener("scroll", this.onScroll);
      console.log(this.data);
    });
  },
  filters: {
    isnew(value) {
      if (value == 0) value = "未读";
      else value = "";
      return value;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
.el-menu,
.el-table--border {
  border: 0;
  overflow: auto;
}
.menu {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}
.search {
  /* margin: 15px; */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.pre {
  white-space: pre-wrap; /* css3.0 */
  white-space: -moz-pre-wrap; /* Firefox */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
  font-size: 18px;
  font-family: Microsoft YaHei;
  /* font-weight: 400; */
  line-height: 28px;
  width: 500px;
  margin-top: 50px;
  margin: 0 auto;
  color: rgba(28, 28, 28, 1);
  opacity: 1;
}
.menu,
.content {
  background: #fff;
}
.isbold {
  font-weight: bold;
  color: black;
}
.nobold {
  font-weight: normal;
}
.manage_is {
  color: grey;
  float: right;
  margin-top: 23px;
}
.manage_no {
  color: grey;
  float: right;
  margin-top: 37px;
}
.cell >>> .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #f56c6c;
  border-color: #f56c6c;
}
.spancontent {
  /* text-align: center; */
  font-size: 16px;
  font-weight: bold;
  display: block;
  color: #fff;
  width: 600px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: keep-all;
  margin-left: 20px;
}
.exopen {
  float: right;
  line-height: 50px;
  font-size: 13px;
  color: blue;
}
.afopen {
  float: right;
  line-height: 50px;
  font-size: 13px;
  color: black;
}
.Message {
  height: 100%;
  background-color: white;
  font-size: 14px;
  overflow: auto;
  /* overflow: auto; */
}

.Message::before {
  content: "";
  display: table;
}
/* .Message >>> .cell {
  width: 650px;
  margin-left: 20px;
  border-radius: 8px;

  background: linear-gradient(
    312deg,
    rgba(51, 153, 255, 1) 0%,
    rgba(51, 204, 255, 1) 100%
  );
  opacity: 1;
  margin-bottom: 30px;
  height: 60px;
  cursor: pointer;
} */
.cellbefore {
  content: "";
  position: absolute;
  right: 100%;
  top: 0px;
  width: 0;
  height: 0;
  border-width: 10px;
  border-style: solid;
  border-color: transparent;
  border-right-width: 16px;
  border-right-color: currentColor;
  color: #dddddd;
}

.top {
  width: 650px;
  text-align: start;
  margin-bottom: 3px;
  font-size: 16px;
  height: 60px;
}
/* .top span:last-child{
  font-size:12px;
  color:#FF3D3D;
  margin-left:8px;
 
} */

.bottom {
  display: flex;
  justify-content: space-between;
}

.Message.bottom span:last-child {
  color: #7e7e7e;
}
</style>
<style >
.el-table__body tr.current-row > td {
  background-color: #c3e0ff !important;
  /* color: #f19944; */ /* 设置文字颜色，可以选择不设置 */
}
</style>
