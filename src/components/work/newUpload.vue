<template>
  <div>
    <el-upload
      class="upload-demo"
      action
      :http-request="Mrequest"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-change="onChange"
      :file-list="fileList"
      list-type="picture-card"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{file}">
        <img class="el-upload-list__item-thumbnail" :src="file.url" />
        <el-tooltip class="item" effect="dark" :content="file.name" placement="bottom">
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              v-if="panduan(file)"
              @click="handlePictureCardPreview(file)"
            >
              <i class="el-icon-zoom-in"></i>
            </span>
            <span class="el-upload-list__item-delete" @click="handleDownload(file)">
              <i class="el-icon-download"></i>
            </span>
            <span
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
              v-if="Upload_showdisable"
            >
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </el-tooltip>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "newUpload",
  props: { Upload_showdisable: "" },
  data() {
    return {
      fileList: [],
      url: this.sytem + "fmc/upf",
      token: "",
      dialogVisible: false,
      dialogImageUrl: "",
      fileListId: "",
    };
  },
  created() {
    this.token = sessionStorage.getItem("token");
  },
  // watch: {
  //   fileList: function (val, oldVal) {
  //     console.log(val, oldVal, "sadasd");
  //     console.log("==========");

  //     this.fileList.forEach((data) => {
  //       console.log(data, data.raw);
  //       this.fileListId += data.raw.fid + ",";
  //     });
  //     this.fileListId = this.fileListId.slice(0, -1);
  //     console.log(this.fileListId, this.fileListId.slice(0), "截取");
  //   },
  // },
  methods: {
    panduan(file) {
      if (
        file.name.indexOf(".jpg") != -1 ||
        file.name.indexOf(".png") != -1 ||
        file.name.indexOf(".jpeg") != -1 ||
        file.name.indexOf(".png") != -1 ||
        file.name.indexOf(".gif") != -1 ||
        file.name.indexOf(".JPG") != -1 ||
        file.name.indexOf(".JPEG") != -1 ||
        file.name.indexOf(".PNG") != -1 ||
        file.name.indexOf(".GIF") != -1
      ) {
        return true;
      } else {
        return false;
      }
    },
    handleRemove(file) {
      let index = this.fileList.findIndex((fileItem) => {
        return fileItem.uid === file.uid;
      });
      this.fileList.splice(index, 1);
    },
    handlePreview(file) {},
    onChange(file, fileList) {
      if (
        file.name.indexOf(".jpg") != -1 ||
        file.name.indexOf(".png") != -1 ||
        file.name.indexOf(".jpeg") != -1 ||
        file.name.indexOf(".png") != -1 ||
        file.name.indexOf(".gif") != -1 ||
        file.name.indexOf(".JPG") != -1 ||
        file.name.indexOf(".JPEG") != -1 ||
        file.name.indexOf(".PNG") != -1 ||
        file.name.indexOf(".GIF") != -1
      ) {
      } else if (file.name.indexOf("txt") != -1) {
        file.url = require("../../assets/image/txt.jpg");
      } else if (
        file.name.indexOf(".docx") != -1 ||
        file.name.indexOf(".doc") != -1
      ) {
        file.url = require("../../assets/image/docx.jpg");
      } else if (
        file.name.indexOf(".xls") != -1 ||
        file.name.indexOf(".xlsx") != -1
      ) {
        file.url = require("../../assets/image/ex.jpg");
      } else if (file.name.indexOf("pdf") != -1) {
        file.url = require("../../assets/image/pdf.jpg");
      } else {
        file.url = require("../../assets/image/file.jpg");
      }
      this.fileList = fileList;
      console.log(fileList, "fileList");
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
      console.log(
        this.Upload_showdisable,
        this.Upload_showdisable1,
        "sasdasdasdas",
        "sadasdasdasd"
      );
    },
    handleDownload(file) {
      let data = new FormData();
      data.append("fid", file.raw.fid);
      this.$http({
        url: "/fmc/dpf",
        method: "post",
        data: data,
        responseType: "blob",
      }).then((res) => {
        console.log(res);
        if (res.headers["content-disposition"]) {
          var fileName = res.headers["content-disposition"]
            .split(";")[1]
            .split("fileName=")[1];
        }
        this.download(res, fileName);
      });
    },
    download(data, fileName) {
      fileName = decodeURIComponent(fileName);
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
      console.log(link);
    },
    Mrequest(data) {
      this.$nextTick(() => {
        let fileObj = data.file;
        console.log(data.file);
        let form = new FormData();
        form.append("f", fileObj);
        form.append("t", this.token);
        this.$http.post(this.url, form).then((res) => {
          if (res) {
            //  res.data[0].name = res.data[0].fnm;
            // res.data[0].url = res.data[0].furl;
            // res.data[0].uid = res.data[0].fid;
            this.fileListId += res.data[0].fid + ",";
            // console.log(this.fileListId);
            data.file.fid = res.data[0].fid;
            // console.log(this.fileList);
          }
        });
      });
    },
  },
};
</script>
<style>
</style>
