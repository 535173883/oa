<template>
  <div id="upload">
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
    <div style="display:flex;flex-direction:column;align-items:center;overflow:auto;height:100px ">
      <el-tag
        :key="index"
        v-for="(item,index) in file_name"
        closable
        :disable-transitions="false"
        style="margin:10px;width:230px;cursor:pointer"
        @click="downform(item.id)"
        @close.stop="handleClose(index)"
      >{{item.name}}</el-tag>
    </div>
  </div>
</template>

<script>
let id = 1000;
export default {
  name: "upload",
  data() {
    return {
      xid: [],
      isActive: true,
      file_name: [],
    };
  },
  methods: {
    //下载文件
    downform(id) {
      // let t=sessionStorage.getItem("token")
      var data = new FormData();
      data.append("fid", id);
      this.$http({
        url: "/fmc/dpf",
        method: "post",
        data: data,
        responseType: "blob",
      }).then((res) => {
        console.log(res.headers["Content-Disposition"], "res---------", res);
        if (res.headers["content-disposition"]) {
          var fileName = res.headers["content-disposition"]
            .split(";")[1]
            .split("fileName=")[1];
          var fileNameUnicode = res.headers["content-disposition"].split(
            "filename*="
          )[1];
          console.log(fileName, "fileName", fileNameUnicode);
          // return;
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
      console.log(e, "1");
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
        param.append("fmid", -1);
        //FormData私有类对象，访问不到，可以通过get判断值是否传进去
        let config = {
          //添加请求头
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        // return;
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
          console.log(res, "？？？？？？？？？？？？？？？？？？？？？？？？");
          console.log(typeof String(res.data[0].fid), "iddddddddd");
          obj1.id = res.data[0].fid;
          this.file_name.unshift(obj1);
          this.xid.push(String(res.data[0].fid));
          console.log(this.xid, "22222222222222222");
          sessionStorage.setItem("xid", this.xid);
          console.log(this.xid, "上传的fid库");
        });
      }
    },
  },
  created() {
    this.load();
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
.file:hover {
  background: #aadffd;
  border-color: #78c3f3;
  color: #004974;
  text-decoration: none;
}
</style>
