<template>
  <!--  公文管理 -->
  <div class="Official">
    <div class="menu">
      <el-menu
        text-color="#000"
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item v-for="(item, index) of menu" :key="index" :index="item.id">{{ item.name }}</el-menu-item>
      </el-menu>
    </div>
    <!-- <el-dialog
      title="提示"
      :visible.sync="dialogVisible_shouwen"
      width="30%"
      :before-close="handleClose_shouwen"
    >
      <el-form
        label-width="100px"
        :model="shouwen_form"
        ref="shouwen_form"
        :rules="rules"
      >
        <el-form-item label="来文单位：" prop="recvFrom" style="width: 95%;">
          <el-input v-model="shouwen_form.recvFrom"></el-input>
        </el-form-item>
        <el-form-item label="收文标题：" prop="recvTitle" style="width: 95%;">
          <el-input v-model="shouwen_form.recvTitle"></el-input>
        </el-form-item>
        <el-form-item label="文件类型：" prop="recvtype" style="width: 95%;">
          <el-select
            v-model="shouwen_form.recvtype"
            style="width: 100%;"
            clearable
          >
            <el-option label="审批文件" value="审批文件"></el-option>
            <el-option label="会议通知" value="会议通知"></el-option>
            <el-option label="政策文件" value="政策文件"></el-option>
            <el-option label="事物文件" value="事物文件"></el-option>
            <el-option label="海关文件" value="海关文件"></el-option>
            <el-option label="船检文件" value="船检文件"></el-option>
            <el-option label="相关部局文件" value="相关部局文件"></el-option>
            <el-option label="其他通知" value="其他通知"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收文日期：" prop="recvTime" style="width: 95%;">
          <el-date-picker
            v-model="shouwen_form.recvTime"
            type="date"
            placeholder="请选择日期"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="收文编号：" prop="recvNo" style="width: 95%;">
          <el-input v-model="shouwen_form.recvNo"></el-input>
        </el-form-item>
        <el-form-item label="上传文件：" prop="recvNo" style="width: 30%;">
          <div style="display: flex; flex-direction: row;">
            <div style="display: flex; flex-direction: column;">
              <el-tag
                :key="index"
                v-for="(item, index) in shouwen_upname"
                closable
                :disable-transitions="false"
                style="
                    margin: 10px;
                    margin-top: 0px;
                    width: 285px;
                    cursor: pointer;
                    text-align: center;
                  "
                @click="downform(item.fid)"
                @close.stop="handleClose_shouwen(index)"
                >{{ item.fnm }}</el-tag
              >
            </div>
            <div>
              <el-button
                type="success"
                @click="chooseType"
                icon="el-icon-upload2"
              ></el-button>
              <input
                @change="upload($event, 1)"
                type="file"
                id="upload_file"
                multiple="multiple"
                style="display: none;"
              />
            </div>
          </div>
        </el-form-item>

        <el-form-item label="归档地址：" prop="recvNo" style="width: 95%;">
          <div style="display: flex; flex-direction: row;">
            <el-input
              v-model="shouwen_form.fpostion"
              :disabled="true"
            ></el-input>
            <el-button icon="el-icon-search" @click="file_router()"></el-button>
          </div>
        </el-form-item>
       
        <el-form-item label="备注：" prop="recvNo" style="width: 95%;">
          <el-input v-model="shouwen_form.remark" type="textarea"></el-input>
        </el-form-item>
        <div style="margin-left: 200px;">
          <el-button style="width: 120px;" @click="reload()">返 回</el-button>
          <el-button
            type="primary"
            style="width: 120px;"
            @click="shouwen_queren('shouwen_form')"
            >确 定</el-button
          >
        </div>
      </el-form>
    </el-dialog>-->

    <!-- 收文添加功弹窗模块 -->
    <el-dialog
      title="收文添加"
      :visible.sync="visible_shouwenform"
      @close="reload_shouwen"
      :close-on-click-modal="false"
      width="40%"
    >
      <el-form
        label-width="20%"
        :model="shouwen_form"
        ref="shouwen_form"
        :rules="rules"
        :disabled="shouwen_show"
      >
        <el-form-item label="来文单位：" prop="recvFrom">
          <el-input v-model="shouwen_form.recvFrom"></el-input>
        </el-form-item>
        <el-form-item label="收文文号：" prop="recvWh">
          <el-input v-model="shouwen_form.recvWh"></el-input>
        </el-form-item>
        <el-form-item label="收文标题：" prop="recvTitle" style="width: 100%;">
          <el-input v-model="shouwen_form.recvTitle"></el-input>
        </el-form-item>
        <el-form-item label="文件类型：" prop="recvtype" style="width: 100%;">
          <el-select v-model="shouwen_form.recvtype" style="width: 100%;" clearable>
            <el-option label="政策规定文件" value="政策规定文件"></el-option>
            <el-option label="党务文件" value="党务文件"></el-option>
            <el-option label="会议通知" value="会议通知"></el-option>
            <el-option label="其他文件" value="其他文件"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发文日期：" prop="sendTime" style="width: 100%;">
          <el-date-picker
            v-model="shouwen_form.sendTime"
            type="date"
            placeholder="请选择日期"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="收文日期：" prop="recvTime" style="width: 100%;">
          <el-date-picker
            v-model="shouwen_form.recvTime"
            type="date"
            placeholder="请选择日期"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="收文编号：" prop="recvNo" style="width: 100%;">
          <el-input v-model="shouwen_form.recvNo" :disabled="true"></el-input>
        </el-form-item>
        <!-- <el-form-item label="归档地址：" prop="recvNo" style="width: 100%;">
          <div style="display: flex; flex-direction: row;">
            <el-input v-model="shouwen_form.fpostion" :disabled="true"></el-input>
            <el-button icon="el-icon-search" @click="file_router()"></el-button>
          </div>
        </el-form-item>-->
        <!-- <el-form-item label="通知人：" prop="recvNo" style="width:40%">
          <el-input v-model="shouwen_form.recvNo"></el-input>
        </el-form-item>-->
        <el-form-item label="关键词：" prop="keywords" style="width: 100%;">
          <el-input v-model="shouwen_form.keywords"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remark" style="width: 100%;">
          <el-input v-model="shouwen_form.remark" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="相关人员：" prop="isVisible" style="width:100%;" v-if="!shouwen_show">
          <el-cascader
            v-model="shouwen_form.isVisible"
            ref="mycascader"
            clearable
            collapse-tags
            placeholder="默认全员选中"
            style="width:100%"
            :options="ishowpeople"
            :props="ishowprops"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="收文文件：" style="width: 100%;">
          <newUpload
            ref="shouwenaddfile"
            style="text-align:left"
            :Upload_showdisable="Upload_showdisable"
          ></newUpload>
        </el-form-item>
        <!-- <el-form-item label="上传文件：" prop="recvNo" style="width: 100%;">
          <div style="display: flex; flex-direction: row;">
            <div style="display: flex; flex-direction: column;">
              <el-tag
                :key="index"
                v-for="(item, index) in shouwen_upname"
                closable
                :disable-transitions="false"
                style="
                    margin: 10px;
                    margin-top: 0px;
                    width: 285px;
                    cursor: pointer;
                    text-align: center;
                  "
                @click="downform(item.fid)"
                @close.stop="handleClose_shouwen(index)"
              >{{ item.fnm }}</el-tag>
            </div>
            <div>
              <el-button type="success" @click="chooseType" icon="el-icon-upload2"></el-button>
              <input
                @change="upload($event, 1)"
                type="file"
                id="upload_file"
                multiple="multiple"
                style="display: none;"
              />
            </div>
          </div>
        </el-form-item>-->
        <!-- <el-button type="primary" >归档路径选择</el-button> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="width: 120px;" @click="reload()" v-if="!shouwen_show">返 回</el-button>
        <el-button type="primary" style="width: 120px;" @click="shouwen_queren('shouwen_form')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- <div class="content" v-show="activeIndex == '42'">
   
      <div align="left" style="margin-left: 20px; padding-top: 20px;">
        <el-form label-width="100px" :model="shouwen_form" ref="shouwen_form" :rules="rules">
          <el-form-item label="来文单位：" prop="recvFrom" style="width: 40%;">
            <el-input v-model="shouwen_form.recvFrom"></el-input>
          </el-form-item>
          <el-form-item label="收文标题：" prop="recvTitle" style="width: 40%;">
            <el-input v-model="shouwen_form.recvTitle"></el-input>
          </el-form-item>
          <el-form-item label="文件类型：" prop="recvtype" style="width: 40%;">
            <el-select v-model="shouwen_form.recvtype" style="width: 100%;" clearable>
              <el-option label="政策规定文件" value="政策规定文件"></el-option>
              <el-option label="党务文件" value="党务文件"></el-option>
              <el-option label="会议通知" value="会议通知"></el-option>
              <el-option label="其他文件" value="其他文件"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收文日期：" prop="recvTime" style="width: 40%;">
            <el-date-picker
              v-model="shouwen_form.recvTime"
              type="date"
              placeholder="请选择日期"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="收文编号：" prop="recvNo" style="width: 40%;">
            <el-input v-model="shouwen_form.recvNo"></el-input>
          </el-form-item>
          <el-form-item label="上传文件：" prop="recvNo" style="width: 40%;">
            <div style="display: flex; flex-direction: row;">
              <div style="display: flex; flex-direction: column;">
                <el-tag
                  :key="index"
                  v-for="(item, index) in shouwen_upname"
                  closable
                  :disable-transitions="false"
                  style="
                    margin: 10px;
                    margin-top: 0px;
                    width: 285px;
                    cursor: pointer;
                    text-align: center;
                  "
                  @click="downform(item.fid)"
                  @close.stop="handleClose_shouwen(index)"
                >{{ item.fnm }}</el-tag>
              </div>
              <div>
                <el-button type="success" @click="chooseType" icon="el-icon-upload2"></el-button>
                <input
                  @change="upload($event, 1)"
                  type="file"
                  id="upload_file"
                  multiple="multiple"
                  style="display: none;"
                />
              </div>
            </div>
          </el-form-item>
          <el-form-item label="归档地址：" prop="recvNo" style="width: 40%;">
            <div style="display: flex; flex-direction: row;">
              <el-input v-model="shouwen_form.fpostion" :disabled="true"></el-input>
              <el-button icon="el-icon-search" @click="file_router()"></el-button>
            </div>
          </el-form-item>
         
          <el-form-item label="关键词：" prop="recvNo" style="width: 40%;">
            <el-input v-model="shouwen_form.remark" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="recvNo" style="width: 40%;">
            <el-input v-model="shouwen_form.remark" type="textarea"></el-input>
          </el-form-item>
      
          <div style="margin-left: 200px;">
            <el-button style="width: 120px;" @click="reload()">返 回</el-button>
            <el-button
              type="primary"
              style="width: 120px;"
              @click="shouwen_queren('shouwen_form')"
            >确 定</el-button>
          </div>
        </el-form>
      </div>
      
    </div>-->
    <!-- 收文 管理-->
    <div class="content" v-show="activeIndex == '41'">
      <div class="table_top">
        <!-- <span style="margin-left:20px">搜索：</span> -->
        <!-- <input type="text" v-model="content1_v" placeholder="搜索文件类型" /> -->
        <!-- <el-select v-model="content1_v" style="width:240px" placeholder="搜索文件类型" clearable>
            <el-option label="审批文件" value="审批文件"></el-option>
            <el-option label="会议通知" value="会议通知"></el-option>
            <el-option label="政策文件" value="政策文件"></el-option>
            <el-option label="事物文件" value="事物文件"></el-option>
            <el-option label="海关文件" value="海关文件"></el-option>
            <el-option label="船检文件" value="船检文件"></el-option>
            <el-option label="相关部局文件" value="相关部局文件"></el-option>
            <el-option label="其他通知" value="其他通知"></el-option>
        </el-select>-->
        <span style="line-height: 31px;">文件类型：</span>
        <el-select v-model="filetype" style="width: 150px;" placeholder="文件类型" clearable>
          <el-option label="政策规定文件" value="政策规定文件"></el-option>
          <el-option label="党务文件" value="党务文件"></el-option>
          <el-option label="会议通知" value="会议通知"></el-option>
          <el-option label="其他文件" value="其他文件"></el-option>
        </el-select>&#8195;
        <span style="line-height: 31px;">关键字：</span>
        <el-input v-model="keyword" style="width: 100px;"></el-input>&#8195;
        <span style="line-height: 31px;">收文时间段：</span>
        <el-date-picker
          v-model="puttime1"
          type="date"
          placeholder="开始时间"
          default-time="00:00:00"
          style="width: 135px;"
        ></el-date-picker>
        <el-date-picker
          v-model="puttime2"
          type="date"
          placeholder="结束时间"
          default-time="23:59:59"
          style="width: 135px;"
        ></el-date-picker>&#8195;
        <el-button icon="el-icon-search" type="primary" @click="search_offical"></el-button>
        <el-button
          type="primary"
          class="shenqing_button"
          style="margin-left: 20px;height:40px"
          @click="shouwen_shenqing()"
          v-has="424"
        >添加</el-button>

        <!-- <el-button type="primary" class="shenqing_button" @click="shouwen_upload">上传</el-button> -->
        <!-- <input type="file" @change="upload($event)" id="upload_file" style="display: none" /> -->
      </div>
      <el-table
        :data="
          tableData_gl
            .filter(
              data =>
                !content1_v ||
                data.recvtype.toLowerCase().includes(content1_v.toLowerCase())
            )
            .slice(
              (this.currentPage1 - 1) * this.pageSize,
              this.currentPage1 * this.pageSize
            )
        "
        style="width: 95.8%; margin: 0 2.1%;"
        align="center"
        ref="tableData_gl"
        border
        header-cell-class-name="t_h"
      >
        <!-- <el-table-column label="通知人" align="center" prop="notice">
        <el-table-column label="登记人" align="center" prop="marker">-->
        <el-table-column label="来文单位" align="center" prop="recvFrom" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer">{{ scope.row.recvFrom }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收文标题" align="center" prop="recvTitle" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer">{{ scope.row.recvTitle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文件类型" align="center" prop="recvtype" width="150"></el-table-column>
        <el-table-column label="收文日期" align="center" prop="recvTime" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.recvTime | time_t }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收文编号" align="center" prop="recvNo" width="100"></el-table-column>

        <!-- <el-table-column
          label="归档地址"
          align="center"
          prop="fpostion"
          width="150"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.fpostion }}</span>
          </template>
        </el-table-column>-->
        <el-table-column
          label="关键字"
          align="center"
          prop="keywords"
          width="200"
          show-overflow-tooltip
        ></el-table-column>
        <!-- <el-table-column label="下载附件" align="center" prop="fid" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag
              :key="index"
              v-for="(item,index) in scope.row.fid.split(',')"
              :style="item==''?'display:none':'cursor:pointer'"
              @click="downform(item)"
              >{{nnnm(item)}}</el-tag>
          </template>
        </el-table-column>-->
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <div class="operation">
              <!-- <span style="color:#3399FF" @click="shouwen_chakan(scope.row.did,1)">查看</span> -->
              <span style="color: #3399ff;" @click="shouwen_chakan(scope.row.did, 3,scope.row)">查看</span>
              <span
                style="color: #3399ff;"
                @click="shouwen_chakan(scope.row.did, 2,scope.row)"
                v-has="421"
              >修改</span>
              <!-- <span style="color: #3399ff;" @click="shouwen_up()" v-has="422"
                >上传附件</span
              >-->
              <span style="color: #3399ff;" @click="shouwen_down(scope.row)">附件查看</span>
              <span style="color: #ff5454;" @click="shouwen_delet(scope.row.did)" v-has="422">删除</span>
              <span style="color: #3399ff;" @click="supplementfile(scope.row)" v-has="423">补充上传附件</span>
              <!-- <span style="color: #3399ff;" @click="leader_fileget1(scope.row.did)">领导批示文件</span> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <span class="demonstration">每页8条</span>
        <el-pagination
          :current-page.sync="currentPage1"
          :page-size="8"
          layout="prev, pager, next, jumper"
          :total="
            tableData_gl.filter(
              data =>
                !content1_v ||
                data.recvtype.toLowerCase().includes(content1_v.toLowerCase())
            ).length
          "
        ></el-pagination>
      </div>
    </div>
    <!--发文申请-->
    <div class="content" v-show="activeIndex == '43'">
      <div class="table_top">
        <!-- <span>关键词搜索：</span> -->
        <!-- <input type="text" v-model="content3_v" placeholder="搜索发文机关" /> -->

        <span style="line-height: 31px;">申请时间：</span>
        <el-date-picker
          v-model="search_time"
          type="date"
          placeholder="开始时间"
          default-time="00:00:00"
          style="width: 135px;margin-right:20px"
        ></el-date-picker>
        <el-date-picker
          v-model="search_time2"
          type="date"
          placeholder="结束时间"
          default-time="23:59:59"
          style="width: 135px;"
        ></el-date-picker>&#8195;
        <span style="line-height: 31px;">发文文号：</span>
        <el-select v-model="search_de" style="width: 125px;" clearable>
          <el-option label="中远渔协" value="中远渔协"></el-option>
          <el-option label="中远渔协（秘）" value="中远渔协（秘）"></el-option>
          <el-option label="中远渔协（财）" value="中远渔协（财）"></el-option>
          <el-option label="中远渔人字" value="中远渔人字"></el-option>
          <el-option label="中远渔" value="中远渔"></el-option>
          <el-option label="中远渔（财）" value="中远渔（财）"></el-option>
        </el-select>&#8195;
        <!-- <span>发文标题：</span>
        <el-input v-model="search_title" style="width: 125px;"></el-input>&#8195;-->
        <!-- <span>经办人：</span>
        <el-input v-model="search_sender" style="width: 115px;"></el-input>-->
        <el-button icon="el-icon-search" type="primary" @click="search_fawen()"></el-button>
        <el-button type="primary" @click="fawen_shenqing()" class="shenqing_button">申请</el-button>
      </div>
      <el-table
        :data="
          tableData_shen
            .filter(
              data =>
                !content3_v ||
                data.sendDepart.toLowerCase().includes(content3_v.toLowerCase())
            )
            .slice(
              (this.currentPage3 - 1) * this.pageSize,
              this.currentPage3 * this.pageSize
            )
        "
        style="width: 95.8%; margin: 0 2.1%;"
        ref="tableData_shen"
        :model="tableData_shen"
        align="center"
        border
        header-cell-class-name="t_h"
        height="430"
      >
        <el-table-column label="经办人" align="center" prop="sender">
          <template slot-scope="scope">
            <span>{{ scope.row.sender }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发文标题" align="center" prop="sendTitle" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer">{{ scope.row.sendTitle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发文单位" align="center" prop="sendDepart" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer">{{ scope.row.sendDepart }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发文文号" align="center" prop="sendWh">
          <template slot-scope="scope">
            <span>{{ scope.row.sendWh }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发文年限" align="center" prop="sendTime">
          <template slot-scope="scope">
            <span>{{ scope.row.sendTime | time_y }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请日期" align="center" prop="sendTime">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | time_t }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <span
              :class="scope.row.status == 2 ? 'color_red' :  scope.row.status == 5 ? 'color_green' : 'color_blue'"
            >{{ scope.row.status == 0 ? "待审核" : scope.row.status == 1 ? "同意" : scope.row.status == 2 ? "拒绝" :scope.row.status == 3 ? "待上级领导审批" : scope.row.status == 4 ? "待会签" : "已通过"}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="审批进程" align="center"  width="120">
          <template slot-scope="scope">
            <el-button type="text" @click.stop.prevent="fawen_chakan(scope.row.did)">查看</el-button>
          </template>
        </el-table-column>-->
        <!-- <el-table-column label="状态" align="center" >
          <template>
            <div>
              <span>待审核</span>
            </div>
          </template>
        </el-table-column>-->
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <div class="operation">
              <span
                style="color: #3399ff;"
                @click="fawen_approval(scope.row,1)"
                v-show="scope.row.bstatus != 3"
              >详情</span>
              <span
                style="color: #3399ff;"
                @click="fawen_approval(scope.row,0)"
                v-show="scope.row.bstatus == 1 && scope.row.status != 5 && scope.row.status != 2 || scope.row.hqResult != 1 &&scope.row.bstatus == 4 && scope.row.status != 5 && scope.row.status != 2"
              >审批</span>
              <span
                style="color: #3399ff;"
                @click="fawen_public(scope.row)"
                v-show="scope.row.bstatus == 0 && scope.row.status == 5"
              >模板</span>
              <!-- <span
                style="color: #3399ff;"
                v-show="scope.row.result == 1 && scope.row.bstatus == 3 && scope.row.endstatus == 1"
                @click="downform(scope.row.archivingfile)"
              >下载</span>-->
              <!--  -->
              <span
                style="color: #ff5454;"
                @click="fawen_delet(scope.row.did)"
                v-has="433"
                v-if="scope.row.bstatus == 0"
              >删除</span>
              <span
                style="color: #3399ff;"
                v-show="scope.row.endstatus == 0 && scope.row.bstatus == 0 && scope.row.status == 5"
                @click="elect_select(scope.row,0)"
                v-has="431"
              >上传文档</span>
              <span
                style="color: #67c23a;"
                v-show="scope.row.endstatus == 1 && scope.row.bstatus == 0   || scope.row.result == 1 && scope.row.bstatus == 3 && scope.row.endstatus == 1 "
                @click="elect_select(scope.row,1)"
              >文档下载</span>
              <!-- <span
                style="color: #67c23a;"
                @click="todepartment(scope.row.did, scope.row.isSumbit)"
                v-show="scope.row.isSumbit != 1"
                v-has="432"
              >归入到综合部</span>-->
              <!-- <el-button  style="display:inline-block"  type="text" size="mini" @click="fawen_public(scope.row.did)">发布下载</el-button>
              <el-button  type="text" style="color:red;"  size="mini" @click="fawen_delet(scope.row.did)">删除</el-button>-->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <span class="demonstration">每页8条</span>
        <el-pagination
          :current-page.sync="currentPage3"
          :page-size="8"
          layout="prev, pager, next, jumper"
          :total="
            tableData_shen.filter(
              data =>
                !content3_v ||
                data.sendDepart.toLowerCase().includes(content3_v.toLowerCase())
            ).length
          "
        ></el-pagination>
      </div>
    </div>
    <!-- pdf模板 -->
    <el-dialog :visible.sync="dialogTableVisible_4" width="60%" style="height:100%">
      <div class="content">
        <div class="fawen_border" style="height: 100%;width:100%" align="center">
          <el-form
            style="width: 99%; margin: 0 2.1%;"
            :model="miji"
            ref="miji"
            border
            label-width="100px"
          >
            <h1
              style="padding-top: 20px;"
            >{{fawen_form.sendDepart == "中国远洋渔业协会" ? "中国远洋渔业协会秘书处发文纸质稿" : "中远渔业推广示范中心发文稿纸"}}</h1>
            <div class="pdf_page">
              <el-container style="border: 1px solid black; width: 1041px;">
                <el-header>
                  <div class="pdf_header">
                    <div
                      style="
                      width: 1020px;
                      display: flex;
                      justify-content: space-between;
                    "
                    >
                      <div>
                        <span>密级：</span>(
                        <input
                          style="
                          width: 30px;
                          height: 20px;
                          text-align: center;
                          font-weight:center;
                          font-weight: bold;
                        "
                          type="text"
                          v-model="fawen_form.confidential"
                        />)
                      </div>

                      <div>
                        <span>
                          <select name id v-model="fawen_form.sendWh" style="font-weight: bold;">
                            <option
                              v-for="item in fawen_form_sendDepart2"
                              :key="item"
                              :label="item"
                              :value="item"
                            ></option>
                          </select>
                        </span>[
                        <input
                          style="width: 40px; height: 20px; font-weight: bold;"
                          v-model="fawen_form.sendTime"
                          placeholder="年份"
                          type="text"
                        />
                        ]
                        <span style="font-weight: bold;">
                          {{
                          fawen_form.sendNo
                          }}
                        </span>
                        号
                      </div>
                    </div>
                  </div>
                </el-header>
                <div style="display: flex; width: 1055px;">
                  <div style="width: 293px; height: 450px; padding: 0px;">
                    <textarea style="width: 260px; height: 440px;" name id cols="30" rows="10"></textarea>
                  </div>
                  <div>
                    <div
                      style="
                      display: flex;
                      width: 740px;
                      border: 1px solid black;
                    "
                    >
                      <span>会签：</span>
                      <input type="textarea" style="width: 650px; height: 130px;" />
                      <!-- <textarea style="width:650px;height:130px" name id cols="30" rows="10"></textarea> -->
                    </div>

                    <div
                      style="
                      display: flex;
                      width: 740px;
                      border: 1px solid black;
                    "
                    >
                      <span>部门审核：</span>
                      <input type="textarea" style="width: 600px; height: 130px;" />
                      <!-- <textarea style="width:600px;height:130px" name id cols="30" rows="10"></textarea> -->
                    </div>

                    <div
                      style="
                      width: 740px;
                      height: 170px;
                      border: 1px solid black;
                    "
                      align="left"
                    >
                      <span style="display: inline-block; margin-top: 80px;">经办人：</span>
                      <input
                        style="height: 20px; font-weight: bold;"
                        type="text"
                        v-model="fawen_form.sender"
                      />
                      <br />
                      <span style="width: 100px; height: 20px;"></span>
                      <br />
                      <span style="display: inline-block; margin-top: 10px;">日期：</span>
                      <span style="font-weight: bold;">
                        {{
                        fawen_form.createTime | time_o
                        }}
                      </span>
                      <!-- <el-date-picker
                    dateType="time"
                    v-model="fawen_form.creatTime"
                    format="yyyy 年 MM 月 dd 日"
                    style="margin-left:20px;height:40px;width:100%"
                   >
                      </el-date-picker>-->

                      <!-- <span style="width:30px;height:20px">{{fawen_form.creatTime}}</span> -->

                      <!-- <span style="margin-left:50px">年</span> -->

                      <!-- <span style="width:30px;height:20px">{{fawen_form.creatTime}}</span> -->
                      <!-- <span style="margin-left:20px">月</span> -->

                      <!-- <span style="width:30px;height:20px">{{fawen_form.creatTime}}</span> -->
                      <!-- <span style="margin-left:20px">日</span> -->
                    </div>
                  </div>
                </div>
              </el-container>
              <el-row>
                <el-col>
                  <div
                    style="
                    width: 1039px;
                    height: 100px;
                    display: flex;
                    justify-content: space-between;
                    border: 1px solid black;
                  "
                  >
                    <span>标题：</span>
                    <input
                      type="textarea"
                      style="width: 800px; height: 80px; font-weight: bold;"
                      v-model="fawen_form.sendTitle"
                    />
                    <!-- <textarea style="width:900px;height:80px" v-model="fawen_form.sendTitle" name id cols="30" rows="10"></textarea> -->
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <div
                    style="
                    width: 1039px;
                    height: 100px;
                    display: flex;
                    justify-content: space-between;
                    border: 1px solid black;
                    align-items: center;
                  "
                  >
                    <b>附件名：</b>
                    <!-- <i class="el-icon-upload2"></i>
                    <el-button
                      type="primary"
                      @click="fujian_button"
                      style="width: 100px; height: 35px;"
                    >点击上传</el-button>
                    <input
                      type="file"
                      @change="upload_fujian($event)"
                      id="fujian_upload"
                      style="display: none;"
                    />-->
                    <!-- {{fawen_form.annex}} -->
                    <!-- <span style="width:800px;height:80px"> {{fawen_form.annex}}</span> -->
                    <!-- <el-input type="text" style="width:800px;height:80px"  v-model="fawen_form.annex" ></el-input> -->
                    <span
                      style="
                      width: 800px;
                      height: 80px;
                      margin-left: 50px;
                      display: block;
                    "
                    >{{ fujianfile_name }}</span>
                    <!-- <textarea style="width:800px;height:80px" v-model="fujianfile_name" :disabled="true" cols="30" rows="10"></textarea> -->
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <div
                    style="
                    width: 1039px;
                    height: 100px;
                    display: flex;
                    justify-content: space-between;
                    border: 1px solid black;
                  "
                  >
                    <span>主送单位：</span>
                    <input
                      type="textarea"
                      style="width: 800px; height: 80px; font-weight: bold;"
                      v-model="fawen_form.mainsenddepart"
                    />
                    <!-- <textarea style="width:800px;height:80px" v-model="fawen_form.sendDepart" name id cols="30" rows="10"></textarea> -->
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <div
                    style="
                    width: 1039px;
                    height: 100px;
                    display: flex;
                    justify-content: space-between;
                    border: 1px solid black;
                  "
                  >
                    <span>抄送单位：</span>
                    <input
                      type="textarea"
                      style="width: 800px; height: 80px; font-weight: bold;"
                      v-model="fawen_form.ccunit"
                    />
                    <!-- <textarea style="width:800px;height:80px" name id cols="30" rows="10"></textarea> -->
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <div
                    style="
                    width: 1039px;
                    height: 80px;
                    display: flex;
                    justify-content: space-between;
                    border: 1px solid black;
                  "
                  >
                    <span style="width:60px">主题词:</span>
                    <!-- <input type="textarea" style="width:800px;height:75px;font-weight:bold" cols="5" rows="8" v-model="fawen_form.zhutici" /> -->
                    <textarea
                      style="
                      width: 700px;
                      height: 75px;
                      border: none;
                      height: auto;
                      width: 100%;
                      line-height: 16pt;
                      resize: none;
                      overflow: hidden;
                    "
                      rows="1"
                      cols="10"
                      wrap="hard"
                      v-model="fawen_form.zhutici"
                    ></textarea>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <div
                    style="
                    width: 1039px;
                    height: 100px;
                    display: flex;
                    justify-content: space-between;
                    border: 1px solid black;
                  "
                  >
                    <span>印刷</span>
                    <div>
                      <span>主件:</span>
                      <input
                        style="
                        width: 30px;
                        height: 20px;
                        text-align: center;
                        font-weight: bold;
                      "
                        type="text"
                        v-model="fawen_form.mainparts"
                      />份
                    </div>
                    <div>
                      <span>附件:</span>
                      <input
                        style="
                        width: 30px;
                        height: 20px;
                        text-align: center;
                        font-weight: bold;
                      "
                        type="text"
                        v-model="fawen_form.accessoryparts"
                      />份
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </div>
        <div slot="footer" style="margin-top: 10px; padding-top: 10px;">
          <el-button style="width: 100px;" @click="fawen_cancel()">返 回</el-button>
          <!-- <el-button style="width: 100px;" type="info" @click="fake_fawendown()">保 存</el-button> -->
          <el-button style="width: 100px;" type="primary" @click="fawen_down(fawen_form.did)">下 载</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- <div class="content" v-show="activeIndex=='45'">
      <div class="table_top">
        <input type="text" placeholder="搜索" />
        <el-button type="primary" @click="fawen_shenqing()" class="shenqing_button">申请</el-button>
      </div>
      <el-form label-width="100px" width="50%">
        <el-form-item label="标题" prop="content">
          <el-input ></el-input>
        </el-form-item>
        <el-form-item label="附件" prop="content">
          <el-input ></el-input>
        </el-form-item>
        <el-form-item label="主送单位" prop="content">
          <el-input ></el-input>
        </el-form-item>
        <el-form-item label="抄报单位" prop="content">
          <el-input ></el-input>
        </el-form-item>
        <el-form-item label="主题词" prop="content">
          <el-input ></el-input>
        </el-form-item>
        <el-form-item label="会签" prop="content">
          <el-input ></el-input>
        </el-form-item>
        <el-form-item label="部门审核" prop="content">
          <el-input ></el-input>
        </el-form-item>
        <el-form-item label="经办人" prop="content">
          <el-input ></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="content">
          <el-input ></el-input>
        </el-form-item>
      </el-form>
     
      
    </div>-->

    <!-- 发文申请弹窗 -->
    <el-dialog
      :title="fawen_title"
      :visible.sync="dialogTableVisible_1"
      @close="close_fawenshenqing"
      :before-close="guanbi_fa"
      :close-on-click-modal="false"
    >
      <el-form
        label-width="100px"
        :data="fawen_form"
        :model="fawen_form"
        ref="fawen_form"
        :rules="rules"
        :disabled="!fawen_status"
      >
        <!-- <el-form-item label="密级：" prop="sendDepart">
          <el-input v-model="fawen_form.sendDepart"></el-input>
        </el-form-item>-->
        <el-form-item label="发文单位：" prop="sendDepart" style="width: 44%; display: inline-block;">
          <!-- <el-input v-model="fawen_form.sendDepart"></el-input> -->
          <el-select
            style="width: 100%;"
            v-model="fawen_form.sendDepart"
            clearable
            @change="fawen_form_sendDepart1($event)"
          >
            <el-option label="中国远洋渔业协会" value="中国远洋渔业协会"></el-option>
            <el-option label="中远渔业推广示范中心" value="中远渔业推广示范中心"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-from-item label="发文单位" style="width: 44%;display: inline-block;">
          <el-select style="width: 100%;" clearable>
            <el-option label="中国远洋渔业协会" value="中国远洋渔业协会"></el-option>
            <el-option label="中远渔业推广示范中心" value="中远渔业推广示范中心"></el-option>
          </el-select>
        </el-from-item>-->
        <el-form-item label="发文文号：" prop="sendWh" style="width: 55%; display: inline-block;">
          <!-- <el-input v-model="fawen_form.sendDepart"></el-input> -->
          <el-select v-model="fawen_form.sendWh" style="width: 100%;" clearable>
            <el-option
              v-for="item in fawen_form_sendDepart"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
            <!-- <el-option label="中远渔协" value="中远渔协"></el-option>
            <el-option label="中远渔协(秘)" value="中远渔协(秘)"></el-option>
            <el-option label="中远渔协(财)" value="中远渔协(财)"></el-option>
            <el-option label="中远渔人字" value="中远渔人字"></el-option>
            <el-option label="中远渔" value="中远渔"></el-option>
            <el-option label="中远渔（财)" value="中远渔（财)"></el-option>-->
          </el-select>
        </el-form-item>
        <el-form-item label="拟文日期：" prop="sendTime" style="width: 44%;">
          <el-date-picker
            v-model="fawen_form.sendTime"
            :clearable="false"
            type="year"
            value-format="yyyy"
            style="width: 100%;"
            placeholder="选择年"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="申请日期" prop="createTime">
          <el-date-picker
            v-model="fawen_form.createTime"
            type="date"
            style="width: 100%;"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="标题：" prop="sendTitle">
          <el-input v-model="fawen_form.sendTitle"></el-input>
        </el-form-item>
        <el-form-item label="主送单位：" prop="mainsenddepart">
          <el-input v-model="fawen_form.mainsenddepart" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="抄送单位：" prop="ccunit">
          <el-input v-model="fawen_form.ccunit" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="主题词：" prop="zhutici">
          <el-input v-model="fawen_form.zhutici"></el-input>
        </el-form-item>
        <el-form-item label="经办人：" prop="sender">
          <!-- <el-input v-model="fawen_form.sender"></el-input> -->
          <el-select v-model="fawen_form.sender" placeholder="请选择" style="width: 100%;" filterable>
            <el-option
              v-for="(item, index) in user_option"
              :key="index"
              :label="item.username"
              :value="item.username"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 申请 -->
        <el-form-item label="审核人：" prop="auditor" v-if="fawen_status">
          <el-select v-model="fawen_form.auditor" placeholder="请选择" style="width: 100%;" filterable>
            <el-option
              v-for="(item, index) in fawen_shenhe"
              :key="index"
              :label="item.username"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 详情 -->
        <!-- 初级审核人 -->
        <el-form-item label="审核人：" prop="auditor" v-if="!fawen_status">
          <el-select v-model="fawen_form.auditor" placeholder="请选择" style="width: 100%;" filterable>
            <el-option
              v-for="(item, index) in fawen_shenhe"
              :key="index"
              :label="item.aname"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核人意见：" v-if="!fawen_status" prop="auditorRemark">
          <el-input v-model="fawen_form.auditorRemark" style="width:100%"></el-input>
        </el-form-item>
        <div v-for="(item,index) in fawen_shenhe1" :key="index">
          <el-form-item v-if="!fawen_status" :label="shenhe_people">
            <el-input v-model="item.uid"></el-input>
          </el-form-item>
          <el-form-item v-if="!fawen_status" :label="shenhe_yijian" label-width="110px">
            <el-input v-model="item.remarks"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="密级：" prop="confidential" style="width: 44%; display: inline-block;">
          <el-select v-model="fawen_form.confidential" placeholder="请选择" style="width: 100%;">
            <el-option value="绝密" label="绝密"></el-option>
            <el-option value="机密" label="机密"></el-option>
            <el-option value="秘密" label="秘密"></el-option>
            <el-option value="内部" label="内部"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="部门审核：" prop="sendTime">
          <el-input v-model="fawen_form.sendTime"></el-input>
        </el-form-item>-->
        <!-- <el-form-item label="经办人：" prop="sendTime">
          <el-input v-model="fawen_form.sendTime"></el-input>
        </el-form-item>-->
        <!-- <el-form-item label="申请日期：" prop="creatTime">
          <el-input v-model="fawen_form.sendTime"></el-input>
           <el-date-picker
            v-model="fawen_form.creatTime"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            style="width:100%"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>-->

        <!-- <el-form-item label="主送单位：" prop="sendTitle">
          <el-input v-model="fawen_form.sendTitle"></el-input>
        </el-form-item>
        <el-form-item label="抄送单位：" prop="sendTitle">
          <el-input v-model="fawen_form.sendTitle"></el-input>
        </el-form-item>-->

        <!-- <el-form-item label="印刷：" prop="sendTitle">
          <el-input v-model="fawen_form.sendTitle"></el-input>
        </el-form-item>-->

        <el-form-item label="主件份数：" prop="mainparts  " style="width: 55%; display: inline-block;">
          <el-input v-model="fawen_form.mainparts"></el-input>
        </el-form-item>
        <el-form-item
          label="附件份数："
          prop="accessoryparts"
          style="width: 100%; display: inline-block;"
        >
          <el-input v-model="fawen_form.accessoryparts"></el-input>
        </el-form-item>
        <el-form-item label="相关人员：" prop="isVisible" style="width:100%;" v-if="fawen_status">
          <el-cascader
            v-model="fawen_form.isVisible"
            ref="mycascader"
            clearable
            collapse-tags
            placeholder="默认全员选中"
            style="width:100%"
            :options="ishowpeople"
            :props="ishowprops"
          ></el-cascader>
        </el-form-item>
        <!-- <el-form-item label="申请时间：" prop="sendTime">
          <el-date-picker
            v-model="fawen_form.creatTime"
            type="date"
            placeholder="请选择日期"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>-->
        <!-- // 14 13 11 12 15 -->
        <!-- <el-form-item label="审批人：" prop="agent1">
          <el-select v-model="shenpiren.agent1" placeholder="请选择" style="width:100%" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.username"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <!-- <el-form-item label="状态：" v-if="!fawen_status">
          <el-input></el-input>
        </el-form-item>-->
        <!-- <div v-if="fawen_status" class="upload_button"> -->
        <!-- 文件上传查看模块 -->
        <el-form-item label="上传附件：" prop="mid" style="text-align: left;">
          <!-- <el-upload
					    class="upload-demo"
					    :action="`/fmc/upf`"
					    :on-preview="handlePreview"
					    :on-remove="handleRemove"
					    :before-remove="beforeRemove"
					    multiple
					    :limit="3"
					    :on-exceed="handleExceed"
					    :file-list="fileList">
					    <el-button size="small" type="primary">上传附件</el-button>
					    <div slot="tip" class="el-upload__tip">jpg/png files with a size less than 500kb</div>
              this.fawen_data();
          </el-upload>-->
          <newUpload ref="newUpload_shouwen" :Upload_showdisable="Upload_showdisable"></newUpload>
        </el-form-item>
        <!-- <div style="display: flex; justify-content: space-between;">
          <div>
            <span>上传附件：</span>
            <a href="javascript:;" @click="downform()"></a>
          </div>
          <div v-if="fawen_status">
            <a href="javascript:;" :class="[isActive ? 'file' : 'file_1']">
              <input type="file" id="myFile" @change="upload_pdf($event)" />上传
            </a>
          </div>
        </div>
        <div
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow: auto;
            height: 100px;
          "
        >
          <el-tag
            :key="index"
            v-for="(item, index) in file_name"
            closable
            :disable-transitions="false"
            style="margin: 10px; width: 230px; cursor: pointer;"
            @click="downform(item.id)"
            @close.stop="handleClose(index)"
          >{{ item.name }}</el-tag>
        </div>-->
        <!-- </div> -->
        <div v-if="fawen_status" style="display: flex;
    justify-content: flex-end;">
          <el-button class="return" @click="fawen_return('fawen_form')" style="width: 120px;">取消</el-button>
          <el-button
            type="primary"
            class="fill"
            @click="fawen_queren('fawen_form')"
            style="width:120px;"
          >确定</el-button>
        </div>
      </el-form>
      <el-row class="approval_foot" style="margin-left:60%">
        <el-button
          style="width:120px"
          v-show="fawen_approval_status && !fawen_status"
          type="primary"
          @click="apprpval_dia_show"
        >审批</el-button>
        <el-button
          style="width:120px"
          class="return"
          @click="fawen_return('fawen_form')"
          v-show="fawen_approval_status && !fawen_status"
        >取消</el-button>

        <!-- <el-col :span="10">
          
          <el-button
            type="primary"
            @click="shenpi_argee()"
            v-show="fawen_approval_status && !fawen_status"
          >同意</el-button>
          <el-button
            type="danger"
            class="fill"
            @click="shenpi_refuse('fawen_form')"
            v-show="fawen_approval_status && !fawen_status"
          >不同意</el-button>
        </el-col>
        <el-col
          :span="10"
          style="display:inline-block margin-bottom:30px"
          v-show="fawen_approval_status && !fawen_status"
        >
          <el-button style="padding:0; width:180px">
            请&nbsp;
            <el-select v-model="fawen_form.shenhe2" placeholder="请选择" style="width: 50%;">
              <el-option
                v-for="(item, index) in fawen_shenhe"
                :key="index"
                :label="item.username"
                :value="item.uid"
              ></el-option>
            </el-select>&nbsp;审核
          </el-button>
          <el-button type="primary" @click="approval_transfer()">确 定</el-button>
        </el-col>-->
      </el-row>

      <el-row :gutter="24">
        <el-col :span="8" :offset="16">
          <el-button
            style="width:120px"
            type="primary"
            v-show="!fawen_approval_status"
            @click="approval_details9('fawen_form')"
          >确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!--  文件浏览列表-->
    <el-dialog title="附件列表" :visible.sync="dialogVisible_file" width="30%">
      <el-form label-width="120px" disabled>
        <el-form-item label="收文标题：">
          <span>{{supplementfile_title}}</span>
        </el-form-item>
        <el-form-item label="收文文件：" style="text-align: left;">
          <newUpload ref="shouwenaddfile" :Upload_showdisable="Upload_showdisable"></newUpload>
        </el-form-item>
        <el-form-item label="领导批示文件：" style="text-align: left;">
          <newUpload ref="supplementfile1" :Upload_showdisable="Upload_showdisable"></newUpload>
        </el-form-item>
      </el-form>
      <!-- <div
        style="
          display: flex;
          flex-direction: column;
          height: 300px;
          overflow-y: auto;
        "
      >
        <el-tag
          :key="index"
          v-for="(item, index) in f_nlist"
          style="margin: 10px; width: 100%; cursor: pointer;"
          @click="downform(item.fid)"
        >{{ item.fname }}</el-tag>
      </div>-->
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible_file = false">关 闭</el-button> -->
        <el-button type="primary" @click="file_close()">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- <el-dialog  :visible.sync="istree" width="60%"  :close-on-click-modal="false" :show-close="false">
        <div style="width:1000px;height:800px;">
          <tree></tree>
        </div>
       <span slot="footer" class="dialog-footer">
        <el-button @click="istree = false">取 消</el-button>
        <el-button type="primary" @click="istree = false">确 定</el-button>
      </span>
    </el-dialog>-->

    <!-- 收文细节弹窗 -->
    <el-dialog
      :title="shouwen_title"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="dialogTableVisible_2"
      :before-close="guanbi_shou"
    >
      <el-form label-width="100px" :model="shouwen_form" ref="shouwen_form" :rules="rules">
        <el-form-item label="来文单位：" prop="recvFrom">
          <el-input v-model="shouwen_form.recvFrom"></el-input>
        </el-form-item>
        <el-form-item label="收文标题：" prop="recvTitle">
          <el-input v-model="shouwen_form.recvTitle"></el-input>
        </el-form-item>
        <el-form-item label="文件类型：" prop="recvtype">
          <el-input v-model="shouwen_form.recvtype"></el-input>
        </el-form-item>
        <el-form-item label="收文日期：" prop="recvTime">
          <!-- <el-input v-model="shouwen_form.recvTime"></el-input> -->
          <el-date-picker
            v-model="shouwen_form.recvTime"
            type="date"
            placeholder="请选择日期"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="收文编号：" prop="recvNo">
          <el-input v-model="shouwen_form.recvNo"></el-input>
        </el-form-item>
        <div v-if="shouwen_status">
          <el-button class="return" @click="shouwen_return()" style="width: 120px;">取消</el-button>
          <el-button
            type="primary"
            class="fill"
            @click="shouwen_queren('shouwen_form')"
            style="width: 120px;"
          >确定</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!-- <el-dialog
      :visible.sync="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <ul>
        <li style="display: inline-block;">
          <div class="yuanxing">
            <span>申请人</span>
            <br />
            <span>{{ shenqin_name }}</span>
          </div>
        </li>
        <li style="display: inline-block;" v-for="(item, index) in leader" :key="index">
          <div style="display: inline-block;">
            <span>--</span>
            <span>x</span>
            <span>--</span>
          </div>
          <div class="yuanxing">
            <span>{{ item.name + Number(index + 1) }}</span>
            <br />
            <span>{{ item.advise }}</span>
          </div>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>-->

    <!-- 归档路径细节弹窗-->
    <!-- <el-dialog
      title="文档上传"
      :close-on-click-modal="false"
      width="30%"
      :show-close="false"
      :visible.sync="dialogTableVisible_file"
    >
      <div>
        <newUpload></newUpload>
      </div>
      <div>
        <newUpload></newUpload>
      </div>
      <div style="margin-top: 50px;">
        <el-button class="return" @click="dialogTableVisible_file = false">取消</el-button>
        <el-button type="primary" class="fill" @click="file_queren()">确定</el-button>
      </div>
    </el-dialog>-->

    <!-- 上传文档弹窗-->
    <el-dialog
      :title="elect_select_title"
      :close-on-click-modal="false"
      width="700px"
      :show-close="false"
      :visible.sync="dialogTableVisible_file2"
    >
      <el-form :disabled="wendangxiazaishow" style="text-align: start;padding: 0 0 0px 56px;">
        <el-row style="margin-bottom:30px;font-size:15px">
          <el-col :span="8">
            <span style="font-size:15px">发文标题：</span>
          </el-col>
          <el-col :span="8" style="color:rgba(0, 0, 0, 0.75)">
            <span>{{select_title}}</span>
          </el-col>
        </el-row>
        <el-row
          style="margin-top:50px;line-height: 38px;
    font-size: 15px;"
          v-show="!wendangxiazaishow"
        >
          <el-col :span="8">
            <span style="font-size:15px">相关人员 :</span>
          </el-col>
          <el-col :span="16">
            <el-cascader
              v-model="isVisible1"
              ref="mycascader"
              clearable
              collapse-tags
              placeholder="默认全员选中"
              style="width:100%"
              :options="ishowpeople"
              :props="ishowprops"
            ></el-cascader>
          </el-col>
        </el-row>
        <el-row style="margin-top:50px">
          <el-col :span="8">
            <span style="font-size:15px">正式文档 :</span>
          </el-col>
          <el-col :span="16">
            <newUpload
              ref="archivingfile"
              style="text-align:left"
              :Upload_showdisable="Upload_showdisable"
            ></newUpload>
          </el-col>
        </el-row>
        <el-row style="margin-top:50px">
          <el-col :span="8">
            <span style="font-size:15px">领导批示文件 :</span>
          </el-col>
          <el-col :span="16">
            <newUpload
              ref="leader_file"
              style="text-align:left"
              :Upload_showdisable="Upload_showdisable"
            ></newUpload>
          </el-col>
        </el-row>
      </el-form>

      <!-- <div align="center">
        <tree ref="trees" v-if="tree_status"></tree>
      </div>-->
      <div style="margin-top: 50px;text-align: end;" v-if="select_staus">
        <el-button class="return" @click="tree_cancel(2)" style="width: 120px;">取消</el-button>
        <el-button type="primary" class="fill" @click="elect_save()" style="width: 120px;">确定</el-button>
      </div>
      <div style="margin-top: 50px;text-align: end;" v-if="!select_staus">
        <el-button class="return" @click="tree_cancel(2)" style="width: 120px;">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 申请审批同意弹窗 -->
    <!-- <el-dialog title="请选择会签及领导审批人" width="30%" :visible.sync="dialogTableVisible_approval1">
      <el-form
        label-width="30%"
        ref="countersignature_from"
        :rules="rules1"
        :model="countersignature_from"
      >
        <el-form-item label="选择会签人员" prop="approval">
          <el-select v-model="countersignature_from.approval" placeholder="请选择" multiple>
            <el-option
              v-for="(item,index) in countersignature_list"
              :key="index"
              :label="item.username"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领导审批人" prop="username">
          <el-select v-model="countersignature_from.username" placeholder="请选择">
            <el-option
              v-for="(item, index) in fawen_shenhe"
              :key="index"
              :label="item.username"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="approval_cancel('countersignature_from')">取 消</el-button>
          <el-button type="primary" @click="approval_agree2('countersignature_from')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>-->
    <!-- 补充上传附件 -->
    <el-dialog title="补充上传附件" width="600px" :visible.sync="dialogTableVisible_supplementfile">
      <el-row style="margin-bottom:30px;font-size:15px">
        <el-col :span="8">
          <span>收文标题：</span>
        </el-col>
        <el-col :span="8" style="color:rgba(0, 0, 0, 0.75)">
          <span>{{supplementfile_title}}</span>
        </el-col>
      </el-row>
      <el-row style="margin-top:50px">
        <el-col :span="8">
          <span style="font-size:16px">附件：</span>
        </el-col>
        <el-col :span="16">
          <newUpload
            ref="supplementfile"
            style="text-align:left"
            :Upload_showdisable="Upload_showdisable"
          ></newUpload>
        </el-col>
      </el-row>
      <div style="margin-top: 50px;">
        <el-button class="return" @click="tree_cancel(1)" style="width: 120px;">取消</el-button>
        <el-button type="primary" class="fill" @click="supplement_save()" style="width: 120px;">确定</el-button>
      </div>
    </el-dialog>
    <!-- 上传领导附件查看 -->
    <el-dialog title="补充上传附件" width="30%" :visible.sync="dialogTableVisible_supplementfile1">
      <newUpload ref="supplementfile" :Upload_showdisable="Upload_showdisable"></newUpload>
      <div style="margin-top: 50px;">
        <!-- <el-button type="success" @click="chooseType2" icon="el-icon-upload2">上传文件</el-button> -->
        <!-- <input @change="upload_m($event)" type="file" id="upload_file1" style="display: none;" /> -->

        <el-button type="primary" class="fill" @click="supplement_quxiao()" style="width: 120px;">确定</el-button>
      </div>
    </el-dialog>
    <!-- 审批弹出窗口 -->
    <el-dialog title="发文审批" width="25%" :visible.sync="apprpval_dia">
      <el-form :model="countersignature_from" ref="countersignature_from">
        <el-form-item style="width:100%;display: flex;justify-content:space-between">
          <el-button type="primary" @click="shenpi_argee()">同意</el-button>
          <el-button type="danger" @click="shenpi_refuse('fawen_form')">不同意</el-button>
        </el-form-item>
        <el-form-item
          label="请领导会签："
          style="width: 100%;"
          v-if="approval_details1 && approval_details3"
          prop="approval"
        >
          <el-select
            clearable
            style="width: 70%;"
            v-model="countersignature_from.approval"
            placeholder="请选择会签人员"
            multiple
            @change="huiqianpeople1()"
          >
            <el-option
              v-for="(item,index) in countersignature_list"
              :key="index"
              :label="item.username"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请领导审批：" style="width: 100%;" v-if="approval_details3" prop="username">
          <el-select
            clearable
            style="width: 70%;"
            v-model="countersignature_from.username"
            placeholder="请上级领导审批"
            @change="huiqianpeople2()"
          >
            <el-option
              v-for="(item, index) in fawen_shenhe"
              :key="index"
              :label="item.username"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="approval_details3">
        <el-button @click="approval_cancel('countersignature_from')">取 消</el-button>
        <el-button type="primary" @click="approval_agree2('countersignature_from')">确 定</el-button>
      </div>
      <div slot="footer" class="dialog-footer" v-if="!approval_details3">
        <el-button type="primary" @click="approval_agree_show()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import newUpload from "./newUpload.vue";
export default {
  inject: ["reload"],
  name: "Official",
  components: { newUpload },

  data() {
    return {
      isVisible1: [],
      isshowPeiple: [],
      ishowprops: { multiple: true },
      ishowpeople: [],
      wendangxiazaishow: false,
      supplementfile_title: "",
      select_title: "",
      elect_select_title: "",
      select_staus: false,
      Upload_showdisable: false,
      shouwen_recvno: false,
      fileList1: [],
      supplementfile_did: "",
      apprpval_dia: false,
      dialogTableVisible_supplementfile1: false,
      dialogTableVisible_supplementfile: false,
      watch_f: false,
      fawen_approval_status: "",
      visible_shouwenform: false,
      countersignature_from: {
        approval: "",
        username: "",
      },
      rules1: {
        username: [{ required: true, message: "领导审批人", trigger: "blur" }],
      },
      dialogTableVisible_approval1: false,
      countersignature_list: [],
      current_reviewer: "",
      fawen_shenhe: [],
      fawen_form_sendDepart: [],
      //收文搜索
      filetype: "",
      keyword: "",
      puttime1: "",
      puttime2: "",
      //收文添加
      dialogVisible_shouwen: false,
      wenjianfid1: [],
      wenjianfid: "",
      tree_status: false,
      file_fid: "",
      file_did: "",
      dialogVisible_file: false,
      f_nlist: [],
      num_list: [],
      istree: false,
      xid: "",
      shenqin_name: "",
      shouwen_title: "收文查看",
      fawen_title: "",
      user_data: [],
      miji: {},
      shenpiren: {},
      currentPage1: 1, //当前页1
      currentPage2: 1, //当前页2
      currentPage3: 1, //当前页2
      pageSize: 8, //每页条数
      content1_v: "",
      content2_v: "",
      content3_v: "",
      //发文搜索框
      search_de: "",
      search_title: "",
      search_sender: "",
      search_time: "",
      search_time2: "",
      fmid: "",
      file_name: [],
      shouwen_upname: [],
      fujianfile_name: "",
      isActive: true,

      rules: {
        sender: [{ required: true, message: "请选择经办人", trigger: "blur" }],
        sendWh: [
          { required: true, message: "请选择发文文号", trigger: "blur" },
        ],
        auditor: [{ required: true, message: "请选择审核人", trigger: "blur" }],
        recvWh: [
          { required: true, message: "请输入收文文号", trigger: "blur" },
        ],
        agent1: [{ required: true, message: "请选择审批人", trigger: "blur" }],
        reqTime: [
          { required: true, message: "请输入效日期", trigger: "change" },
        ],
        sendDepart: [
          { required: true, message: "请输入有效信息", trigger: "blur" },
        ],

        recvTime: [
          { required: true, message: "请选择收文日期", trigger: "blur" },
        ],
        // sendNo: [
        //   { required: true, message: "请输入编号信息", trigger: "change" }
        // ],
        // sendTitle: [
        //   { required: true, message: "请输入标题信息", trigger: "change" }
        // ],
        notice: [
          { required: true, message: "请输入有效信息", trigger: "change" },
        ],
        reqer: [
          { required: true, message: "请输入有效信息", trigger: "change" },
        ],
        marker: [
          { required: true, message: "请输入登记人", trigger: "change" },
        ],
        notice: [
          { required: true, message: "请输入通知人信息", trigger: "change" },
        ],
        marker: [
          { required: true, message: "请输入登记人信息", trigger: "change" },
        ],
        recvFrom: [
          { required: true, message: "请输入来文单位", trigger: "blur" },
        ],
        recvTitle: [
          { required: true, message: "请输入来文标题", trigger: "blur" },
        ],
        recvtype: [
          { required: true, message: "请选择文件类型", trigger: "blur" },
        ],
        // recvTime: [
        //   { required: true, message: "请输入收文日期", trigger: "change" }
        // ],
        // recvNo: [
        //   { required: true, message: "请输入收文编号", trigger: "change" }
        // ],
        elecDoc: [
          { required: true, message: "请输入电子文档", trigger: "change" },
        ],
      },
      wuneir: "无",
      shouwen_show: false,
      fawen_status: false,
      shouwen_status: false,
      fawen_form: {
        isVisible: [],
        sendDepart: "",
        sendWh: "",
        sendTime: new Date(),
        sendTitle: "",
        mainsenddepart: "",
        ccunit: "",
        zhutici: "",
        sender: "",
        auditor: "",
        confidential: "",
        mainparts: "",
        accessoryparts: "",
        mid: "",
        createTime: "",
        annex: "",
        auditorRemark: "",
      },
      shouwen_form: {
        isVisible: [],
        sendTime: "",
        //附件
        fpostion: "",
        recvNo: "",
        recvtype: "",
        recvTitle: "",
        recvFrom: "",
        recvTime: "",
        //  "annex": "",
        // "del": "",
        // "did": "",
        // "elecDoc": "",
        // "fmid": "",
        // "marker": "",
        // "notice": "",
        // "recvFrom": "",
        // "recvNo": "",
        // "recvTime": "",
        // "recvTitle": "",
        // "annex":""
      },
      user_option: [],
      leader: [
        { name: "领导", advise: "同意" },
        { name: "领导", advise: "拒绝" },
        { name: "领导", advise: "审核" },
      ],
      dialogVisible: false,
      menu: [],
      float: [],
      options: [],
      fid: [],
      aid: "",
      activeIndex: "",
      dialogTableVisible_1: false,
      dialogTableVisible_2: false,
      dialogTableVisible_4: false,
      dialogTableVisible_file: false,
      dialogTableVisible_file2: false,
      tableData_sp: [],
      gridData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
      shouwen_fid: "",
      watch_s: false,
      shouwen_fmid: "",
      // bianhao:"",
      value4: "0",
      value4_name: "",
      tableData_gl: [],
      tableData_shen: [],
      fawen_shenhe1: [],
      sendDepart2: "",
      shenhe_people: "",
      shenhe_yijian: "",
      fawen_form_sendDepart2: [],
      shenpi_did: "",
      approval_details1: true,
      approval_details3: true,
      approval_details4: true,
      disabled_wenjian: true,
    };
  },

  watch: {
    "fawen_form.sendDepart": {
      handler() {
        let data = new FormData();
        let d = this.fawen_form.sendDepart;
        let t = this.fawen_form.sendTime;
        if (
          d !== "" &&
          d != null &&
          t !== "" &&
          t != null &&
          this.watch_s == true
        ) {
          data.append("d", d);
          data.append("y", t);
          this.$http.post("/oc/fn", data).then((res) => {
            this.fawen_form.sendNo = JSON.parse(JSON.stringify(res.data));
            console.log(res, "监听返回");
          });
        }
      },
    },
    "fawen_form.sendTime": {
      handler() {
        let data = new FormData();
        let d = this.fawen_form.sendDepart;
        let t = this.fawen_form.sendTime;
        if (
          d !== "" &&
          d != null &&
          t !== "" &&
          t != null &&
          this.watch_s == true
        ) {
          data.append("d", d);
          data.append("y", t);
          this.$http.post("/oc/fn", data).then((res) => {
            this.fawen_form.sendNo = JSON.parse(JSON.stringify(res.data));
            console.log(res, "监听返回");
          });
        }
      },
    },
    "shouwen_form.recvtype": {
      handler() {
        if (this.shouwen_recvno == true) {
          let data = new FormData();
          let d = this.shouwen_form.recvtype;
          if (d !== "" && d != null && this.watch_f == true) {
            data.append("recvType", d);
            this.$http.post("/oc/sn", data).then((res) => {
              this.shouwen_form.recvNo = JSON.parse(JSON.stringify(res.data));
              console.log(res.data, "监听回调");
            });
          }
        }
      },
    },
  },
  computed: {
    bianhao: function () {
      let data = new FormData();
      let messag = "";
      data.appeend("d", this.fawen_form.sendDepart);
      this.$http.post("/oc/fn", data).then((res) => {
        // this.num_list.push(res.data)
        messag = res.data;
        console.log(messag, "返回信息");
        // this.fawen_form.sendNo = JSON.parse(JSON.stringify(res.data));

        console.log(res);
      });
      return messag;
    },
    bianhao: function () {
      let data = new FormData();
      let messag = "";
      data.appeend("recvType", shouwen_form.recvtype);
      this.$http.post("/oc/sn", data).then((res) => {
        // this.num_list.push(res.data)
        messag = res.data;
        console.log(messag, "返回信息");
        // this.fawen_form.sendNo = JSON.parse(JSON.stringify(res.data));
        console.log(res);
      });
      return messag;
    },
  },
  methods: {
    close_fawenshenqing() {
      this.clear_f(this.fawen_form);
      this.$refs.newUpload_shouwen.fileList = [];
    },
    reload_shouwen() {
      this.$refs.shouwenaddfile.fileList = [];
      this.clear_f(this.shouwen_form);
    },
    approval_agree_show() {
      this.apprpval_dia = false;
      this.countersignature_from.username = "";
      this.countersignature_from.approval = [];
    },
    apprpval_dia_show() {
      this.apprpval_dia = true;
      let data = new FormData();
      data.append("did", this.shenpi_did);
      this.$http.post("/oc/ib", data).then((res) => {
        if (res.data == 1) {
          this.approval_details1 = false;
        }
        if (res.data == 3) {
          this.approval_details3 = false;
        } else {
          this.approval_details4 = false;
        }
      });
    },
    fawen_form_sendDepart1(value) {
      console.log(value);
      this.fawen_form.sendWh = "";
      if (value == "中国远洋渔业协会") {
        this.fawen_form_sendDepart = [
          "中远渔协",
          "中远渔协（秘）",
          "中远渔协（财）",
          "中远渔协人字",
        ];
      } else if (value == "中远渔业推广示范中心") {
        this.fawen_form_sendDepart = ["中远渔", "中远渔（财）"];
      }
    },

    supplement_quxiao() {
      this.fileList = [];
      this.$refs.supplementfile.fileList = [];
      this.dialogTableVisible_supplementfile1 = false;
    },
    //领导审批文件获取
    leader_fileget1(type) {
      let data = new FormData();
      data.append("did", type);
      this.$http.post("/oc/glfs", data).then((res) => {
        this.fileList1 = [];
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
            this.fileList1.push({
              uid: res.data[i].fid,
              raw: {
                fid: res.data[i].fid,
              },
              name: res.data[i].fname,
              url: "http://fas.intertion.cn:9111/group1/" + res.data[i].fpath,
            });
          } else if (res.data[i].fname.indexOf("txt") != -1) {
            this.fileList1.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../../assets/image/txt.jpg"),
            });
          } else if (
            res.data[i].fname.indexOf(".docx") != -1 ||
            res.data[i].fname.indexOf(".doc") != -1
          ) {
            this.fileList1.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../../assets/image/docx.jpg"),
            });
          } else if (
            res.data[i].fname.indexOf(".xls") != -1 ||
            res.data[i].fname.indexOf(".xlsx") != -1
          ) {
            this.fileList1.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../../assets/image/ex.jpg"),
            });
          } else if (res.data[i].fname.indexOf("pdf") != -1) {
            this.fileList1.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../../assets/image/pdf.jpg"),
            });
          } else {
            this.fileList1.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../../assets/image/file.jpg"),
            });
          }
        this.$refs.supplementfile.fileList = this.fileList1;
      });
      this.dialogTableVisible_supplementfile1 = true;
    },
    // 会签与领导审批或
    huiqianpeople1() {
      this.countersignature_from.username = "";
    },
    huiqianpeople2() {
      this.countersignature_from.approval = [];
    },
    supplementfile(value) {
      console.log(value);
      this.Upload_showdisable = true;
      this.supplementfile_did = value.did;
      this.supplementfile_title = value.recvTitle;
      this.dialogTableVisible_supplementfile = true;
    },
    // 收文管理上传附件确定
    supplement_save() {
      let data = new FormData();
      data.append("did", this.supplementfile_did);
      if (this.$refs.supplementfile.fileList.length == 0) {
        //alert("请上传文件之后再进行操作");
        this.$alert("请上传文件之后再进行操作", "提示", {
          confirmButtonText: "确定",
        });
        return false;
      }

      this.fileListId = "";
      for (const i of this.$refs.supplementfile.fileList) {
        this.fileListId += Number(i.raw.fid) + ",";
      }
      this.fileListId = this.fileListId.substring(
        0,
        this.fileListId.lastIndexOf(",")
      );
      data.append("lFid", this.fileListId);
      this.$confirm("是否确认补充上传附件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          this.$http
            .post("/oc/srf", data)
            .then((res) => {
              this.supplementfile_did = "";
              this.$refs.supplementfile.fileListId = "";
              this.$refs.supplementfile.fileList = [];
              this.dialogTableVisible_supplementfile = false;
              this.shouwen_data();
              this.$message({
                message: "已上传成功",
                type: "success",
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "上传失败",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消上传",
          });
        });
    },
    //审核详情确认关闭
    approval_details9(formName) {
      console.log("asdasd");
      this.clear_f(this.fawen_form);
      //  this.fawen_form.mainparts = "";
      //this.$refs[formName].resetFields();
      this.dialogTableVisible_1 = false;
      this.file_name = [];
      this.$refs.newUpload_shouwen.fileList = [];
      this.fileList = [];
      this.fawen_data();
      this.fawen_form.sendTime = new Date();
      // this.fawen_form.confidential = "";
      // this.fawen_form.mainparts = "";
      // this.fawen_form.accessoryparts = "";
    },
    // 审核转交
    approval_transfer() {
      let data = new FormData();
      data.append("supId", this.fawen_form.shenhe2);
      data.append("status", 3);
      data.append("did", this.fawen_form.did);
      this.$confirm("此操作将转交审批，是否继续", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/oc/audD", data)
            .then((res) => {
              this.$message({
                type: "success",
                message: "审批已转交",
              });
              this.dialogTableVisible_1 = false;
              this.$nextTick(() => {
                this.$refs.fawen_form.resetFields();
              });
              this.file_name = [];
              this.$refs.newUpload_shouwen.fileList = [];
              this.fileList = [];
              this.fawen_form.shenhe2 = "";
              this.fawen_data();
            })
            .catch((error) => {
              this.$message.error("转交失败");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消转交",
          });
        });
    },
    //发文审批不同意
    shenpi_refuse(formName) {
      let data = new FormData();
      data.append("did", this.fawen_form.did);
      data.append("status", 2);
      this.$prompt("请输入审批意见", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          if (
            value == null ||
            value == "" ||
            value == "null" ||
            value == undefined ||
            value == "undefined"
          ) {
            value = "不同意";
          }
          data.append("remark", value);
          this.$http
            .post("/oc/audD", data)
            .then((res) => {
              this.dialogTableVisible_approval1 = false;
              this.dialogTableVisible_1 = false;
              this.$nextTick(() => {
                this.$refs.fawen_form.resetFields();
              });
              this.file_name = [];
              this.$refs.newUpload_shouwen.fileList = [];
              this.fileList = [];
              this.apprpval_dia = false;
              this.$message({
                type: "success",
                message: "审批已拒绝",
              });
              this.fawen_data();
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "提交失败",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
          this.apprpval_dia = false;
          this.dialogTableVisible_approval1 = false;
          this.dialogTableVisible_1 = false;
          this.$nextTick(() => {
            this.$refs.fawen_form.resetFields();
          });
          this.file_name = [];
          this.$refs.newUpload_shouwen.fileList = [];
          this.fileList = [];
          this.fawen_data();
        });
    },
    //发文审批二级弹窗确认
    approval_agree2(formName) {
      if (
        this.countersignature_from.username == "" &&
        this.countersignature_from.approval.length == 0
      ) {
        this.$alert("请选择至少一个审批领导或者会签领导再进行操作", "提示", {
          confirmButtonText: "确定",
        });
      } else {
        let data = new FormData();
        data.append("did", this.current_reviewer.did);
        data.set("leader", this.countersignature_from.username);
        data.set("hqPerson", this.countersignature_from.approval);
        if (this.countersignature_from.username != "") {
          data.set("status", 3);
        } else if (this.countersignature_from.approval != []) {
          data.set("status", 4);
        }
        data.delete("createTime");
        this.$prompt("请输入审批意见", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }).then(({ value }) => {
          if (
            value == null ||
            value == "" ||
            value == "null" ||
            value == undefined ||
            value == "undefined"
          ) {
            value = "同意";
          }
          console.log(typeof value, value, "意见");
          data.append("remark", value);
          this.$http.post("/oc/audD", data).then((res) => {
            this.$message({
              type: "success",
              message: "审批已转交",
            });
            this.countersignature_from.username = "";
            this.countersignature_from.approval = [];
            this.dialogTableVisible_approval1 = false;
            this.dialogTableVisible_1 = false;
            this.$nextTick(() => {
              this.$refs.fawen_form.resetFields();
            });
            this.file_name = [];
            this.$refs.newUpload_shouwen.fileList = [];
            this.fileList = [];
            this.apprpval_dia = false;
            this.fawen_data();
          });
        });
      }
    },
    //发文审批二级弹窗取消
    approval_cancel(formName) {
      this.apprpval_dia = false;
      this.dialogTableVisible_approval1 = false;
      this.clear_f(this.countersignature_from);
    },
    //发文审批同意按钮
    shenpi_argee() {
      let data = new FormData();
      data.append("did", this.current_reviewer.did);
      data.set("status", 1);
      data.delete("createTime");
      this.$prompt("请输入审批意见", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          if (
            value == null ||
            value == "" ||
            value == "null" ||
            value == undefined ||
            value == "undefined"
          ) {
            value = "同意";
          }
          data.append("remark", value);
          this.$http
            .post("/oc/audD", data)
            .then((res) => {
              this.dialogTableVisible_approval1 = false;
              this.dialogTableVisible_1 = false;
              this.$nextTick(() => {
                this.$refs.fawen_form.resetFields();
              });
              this.file_name = [];
              this.$refs.newUpload_shouwen.fileList = [];
              this.fileList = [];
              this.apprpval_dia = false;
              console.log(1);
              this.$message({
                type: "success",
                message: "审批已同意",
              });
              this.fawen_data();
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "提交失败",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
          this.apprpval_dia = false;
          this.dialogTableVisible_approval1 = false;
          this.dialogTableVisible_1 = false;
          this.$nextTick(() => {
            this.$refs.fawen_form.resetFields();
          });
          this.file_name = [];
          this.$refs.newUpload_shouwen.fileList = [];
          this.fileList = [];
          this.fawen_data();
          console.log(1);
        });
    },
    //发文审批
    fawen_approval(d, num) {
      console.log(d);
      this.Upload_showdisable = false;
      this.fawen_form.auditor = Number(d.auditor);
      this.fawen_form = d;
      let data = new FormData();
      data.append("did", d.did);
      this.$http.post("/oc/go", data).then((res) => {
        console.log(res.data, "发文审核1");
        this.fawen_form.auditor = res.data.aname;
        this.fawen_form.auditorRemark = res.data.auditorRemark;
        this.current_reviewer = JSON.parse(JSON.stringify(res.data));
        if (res.data.arrayHQ.length != 0) {
          this.fawen_shenhe1 = res.data.arrayHQ;
          this.fawen_status = false;
          this.shenhe_people = "会签领导人：";
          this.shenhe_yijian = "会签领导意见：";
          console.log(this.fawen_shenhe1, "发文会签审核意见");
        } else if (res.data.arrayLeader.length != 0) {
          this.fawen_shenhe1 = res.data.arrayLeader;
          this.fawen_status = false;
          this.shenhe_people = "";
          this.shenhe_people = "审批领导人：";
          this.shenhe_yijian = "审批领导意见：";
          console.log(this.fawen_shenhe1, "发文领导审核意见");
        }
      });
      this.$http.post("/oc/gsp", data).then((res) => {
        this.fawen_shenhe = res.data;
        console.log(this.fawen_shenhe, "发文审核12");
        console.log(res.data);
      });
      this.$http.post("/oc/ghqp", data).then((res) => {
        this.countersignature_list = res.data;
      });
      this.fawen_status = false;
      if (num == 0) {
        this.shenpi_did = d.did;
        this.fawen_title = "发文详情";
        this.fawen_approval_status = true;
        data.append("fid", d.annex);
        this.$http.post("/ac/gbf", data).then((res) => {
          this.fileList = [];
          this.file_name = JSON.parse(JSON.stringify(res.data));
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
                url: require("../../assets/image/txt.jpg"),
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
                url: require("../../assets/image/docx.jpg"),
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
                url: require("../../assets/image/ex.jpg"),
              });
            } else if (res.data[i].fname.indexOf("pdf") != -1) {
              this.fileList.push({
                uid: res.data[i].fid,
                name: res.data[i].fname,
                raw: {
                  fid: res.data[i].fid,
                },
                url: require("../../assets/image/pdf.jpg"),
              });
            } else {
              this.fileList.push({
                uid: res.data[i].fid,
                name: res.data[i].fname,
                raw: {
                  fid: res.data[i].fid,
                },
                url: require("../../assets/image/file.jpg"),
              });
            }
          console.log(this.fileList);
          this.$refs.newUpload_shouwen.fileList = this.fileList;
        });
      } else if (num == 1) {
        this.fawen_title = "发文详情";
        this.fawen_approval_status = false;
        data.append("fid", d.annex);
        this.$http.post("/ac/gbf", data).then((res) => {
          this.fileList = [];
          this.file_name = JSON.parse(JSON.stringify(res.data));
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
                url: require("../../assets/image/txt.jpg"),
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
                url: require("../../assets/image/docx.jpg"),
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
                url: require("../../assets/image/ex.jpg"),
              });
            } else if (res.data[i].fname.indexOf("pdf") != -1) {
              this.fileList.push({
                uid: res.data[i].fid,
                name: res.data[i].fname,
                raw: {
                  fid: res.data[i].fid,
                },
                url: require("../../assets/image/pdf.jpg"),
              });
            } else {
              this.fileList.push({
                uid: res.data[i].fid,
                name: res.data[i].fname,
                raw: {
                  fid: res.data[i].fid,
                },
                url: require("../../assets/image/file.jpg"),
              });
            }
          console.log(this.fileList);
          this.$refs.newUpload_shouwen.fileList = this.fileList;
        });
      }
      this.dialogTableVisible_1 = true;
    },

    //收文搜索
    search_offical() {
      let queryparams = new FormData();
      let http = this.$http;
      var that = this;
      queryparams.append("keywords", this.keyword);
      queryparams.append("titleType", this.filetype);
      if (this.puttime1 + "," + this.puttime2 != ",")
        queryparams.append("time", this.puttime1 + "," + this.puttime2);

      http.post("/oc/gard", queryparams).then((res) => {
        console.log(res);
        this.tableData_gl = res.data;
      });
    },
    todepartment(n, d) {
      var data = new FormData();
      data.append("did", n);
      this.$confirm("是否归入综合部", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          this.$http({
            url: "/oc/toZHB",
            method: "post",
            data: data,
          });
          this.$message({
            message: "已成功导入综合部",
            type: "success",
          });
          this.fawen_data();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消提交",
          });
        });
    },
    // fawen_name() {},
    //  文件下载
    fawen_down(type) {
      // if (this.fawen_form.annex == "" || this.fawen_form.annex == null) {

      // }
      var data = new FormData();
      data.append("did", type);
      for (var item in this.fawen_form) {
        if (this.fawen_form[item] != "" && this.fawen_form[item] != null)
          data.append(item, this.fawen_form[item]);
      }
      if (
        this.fawen_form.createTime != "" &&
        this.fawen_form.createTime != null
      )
        data.set("createTime", new Date(this.fawen_form.createTime));
      // if (this.fawen_form.annex != "" && this.fawen_form.annex != null) {
      //   this.fawen_form.annex.split(",").forEach(item => {
      //     console.log(item, "item");
      //     this.downform(item);
      //   });
      // }
      this.$http({
        url: "/oc/asdt",
        method: "post",
        data: data,
        responseType: "blob",
      }).then((res) => {
        if (res.headers["content-disposition"]) {
          var fileName = res.headers["content-disposition"]
            .split(";")[1]
            .split("fileName=")[1];
          var fileNameUnicode = res.headers["content-disposition"].split(
            "filename*="
          )[1];
          if (fileNameUnicode) {
            //   当存在 filename* 时，取filename* 并进行解码（为了解决中文乱码问题）
            fileName = decodeURIComponent(fileNameUnicode.split("''")[1]);
          }
          console.log(fileName, "fileName");
        }
        //下载所有文件
        this.download(res, fileName, "下载所有文件");
        console.log(res, "asdada");
        //修改后的发文表单
        //   this.fake_fawendown();

        // this.fujianfile_name=""
        // this.options = res.data;
      });
    },
    tree_cancel(num) {
      if (num == 1) {
        this.dialogTableVisible_supplementfile = false;
        this.$refs.supplementfile.fileList = [];
      } else if (num == 2) {
        this.isVisible1 = [];
        this.$refs.archivingfile.fileList = [];
        this.$refs.leader_file.fileList = [];
        this.fileList = [];
        this.tree_status = false;
        this.file_did = "";
        // this.$refs.trees.$$refs.tree.clearValidate=false
        this.dialogTableVisible_file2 = false;
        sessionStorage.removeItem("file_r");
      }
    },
    elect_select(type, num) {
      console.log(type);
      this.select_title = type.sendTitle;
      //获取选中信息条的did
      if (num === 0) {
        this.getishowpeople();
        this.isVisible1 = JSON.parse(type.isVisible);
        this.wendangxiazaishow = false;
        this.elect_select_title = "上传文档";
        this.tree_status = true;
        this.select_staus = true;
        this.file_did = type.did;
      } else if (num === 1) {
        this.wendangxiazaishow = true;
        this.select_staus = false;
        this.elect_select_title = "下载文档";
        let token = sessionStorage.getItem("token");
        let data = new FormData();
        data.append("t", token);
        data.append("fid", type.archivingfile);
        this.$http.post("/ac/gbf", data).then((res) => {
          this.fileList = [];
          for (var i = 0; i < res.data.length; i++) {
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
                url: require("../../assets/image/txt.jpg"),
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
                url: require("../../assets/image/docx.jpg"),
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
                url: require("../../assets/image/ex.jpg"),
              });
            } else if (res.data[i].fname.indexOf("pdf") != -1) {
              this.fileList.push({
                uid: res.data[i].fid,
                name: res.data[i].fname,
                raw: {
                  fid: res.data[i].fid,
                },
                url: require("../../assets/image/pdf.jpg"),
              });
            } else {
              this.fileList.push({
                uid: res.data[i].fid,
                name: res.data[i].fname,
                raw: {
                  fid: res.data[i].fid,
                },
                url: require("../../assets/image/file.jpg"),
              });
            }
          }
          this.$refs.archivingfile.fileList = this.fileList;
        });
      }
      // data.append("lFid", type.leaderFile);
      //newUpload1
      // this.dialogformvisible1 = false;
      // this.$refs.newUpload2.fileList = [];
      // this.fileList = [];
      this.get_leader_file(type);
      this.dialogTableVisible_file2 = true;
    },
    get_leader_file(type) {
      //
      let data = new FormData();
      let token = sessionStorage.getItem("token");
      data.append("t", token);
      data.append("fid", type.leaderFile);
      this.$http.post("/ac/gbf", data).then((res) => {
        this.fileList = [];
        for (var i = 0; i < res.data.length; i++) {
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
              url: require("../../assets/image/txt.jpg"),
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
              url: require("../../assets/image/docx.jpg"),
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
              url: require("../../assets/image/ex.jpg"),
            });
          } else if (res.data[i].fname.indexOf("pdf") != -1) {
            this.fileList.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../../assets/image/pdf.jpg"),
            });
          } else {
            this.fileList.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../../assets/image/file.jpg"),
            });
          }
        }
        this.$refs.leader_file.fileList = this.fileList;
      });
    },
    elect_save() {
      let data = new FormData();
      let t = JSON.stringify(this.isVisible1);
      data.append("isVisible", t);
      data.append("did", this.file_did);
      if (
        this.$refs.archivingfile.fileListId == "" &&
        this.$refs.leader_file.fileListId == ""
      ) {
        this.$alert("请上传文件之后再进行操作", "提示", {
          confirmButtonText: "确定",
        });
        return false;
      }
      data.set("fid", this.$refs.archivingfile.fileListId);
      data.set("lFid", this.$refs.leader_file.fileListId);
      this.$confirm("是否确认上传文档?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          this.$http
            .post("/oc/ssf", data)
            .then((res) => {
              this.file_did = "";
              this.$refs.archivingfile.fileListId = "";
              this.$refs.leader_file.fileListId = "";
              this.$refs.archivingfile.fileList = [];
              this.$refs.leader_file.fileList = [];
              this.dialogTableVisible_file2 = false;
              this.$message({
                message: "上传成功",
                type: "success",
              });
              this.fawen_data();
              console.log(res);
            })
            .catch((Error) => {
              this.$message({
                type: "info",
                message: "上传失败",
              });
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消上传",
          });
        });
    },
    search_fawen() {
      let data = new FormData();
      data.append("sd", this.search_de);
      data.append("tl", this.search_title);
      data.append("j", this.search_sender);
      if (this.search_time + "," + this.search_time2 != ",")
        data.append("ti", this.search_time + "," + this.search_time2);
      this.$http.post("/oc/gasod", data).then((res) => {
        this.tableData_shen = res.data;
        console.log(res);
      });
    },
    shouwen_up() {
      this.dialogVisible_shouwen = true;
    },
    handleClose_shouwen() {},

    shouwen_down(type) {
      this.supplementfile_title = type.recvTitle;
      this.Upload_showdisable = false;
      console.log(type);
      this.shouwen_recvno = false;
      this.disabled_wenjian = false;
      if (
        (type.fid == "" || type.fid == null) &&
        (type.leaderFid == "" || type.leaderFid == null)
      ) {
        this.$alert("未上传文件", "提示", {
          confirmButtonText: "确定",
        });
        // alert("未上传文件");
        return false;
      }
      let data = new FormData();
      data.append("did", type.did);
      this.$http.post("/oc/gfs", data).then((res) => {
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
              url: require("../../assets/image/txt.jpg"),
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
              url: require("../../assets/image/docx.jpg"),
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
              url: require("../../assets/image/ex.jpg"),
            });
          } else if (res.data[i].fname.indexOf("pdf") != -1) {
            this.fileList.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../../assets/image/pdf.jpg"),
            });
          } else {
            this.fileList.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../../assets/image/file.jpg"),
            });
          }
        console.log(this.fileList);
        this.$refs.shouwenaddfile.fileList = this.fileList;
      });
      this.leader_fileget(type);
      // this.form_name(did);
      // supplementfile
      this.dialogVisible_file = true;
    },
    leader_fileget(type) {
      let data = new FormData();
      data.append("did", type.did);
      this.$http.post("/oc/glfs", data).then((res) => {
        this.fileList1 = [];
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
            this.fileList1.push({
              uid: res.data[i].fid,
              raw: {
                fid: res.data[i].fid,
              },
              name: res.data[i].fname,
              url: "http://fas.intertion.cn:9111/group1/" + res.data[i].fpath,
            });
          } else if (res.data[i].fname.indexOf("txt") != -1) {
            this.fileList1.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../../assets/image/txt.jpg"),
            });
          } else if (
            res.data[i].fname.indexOf(".docx") != -1 ||
            res.data[i].fname.indexOf(".doc") != -1
          ) {
            this.fileList1.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../../assets/image/docx.jpg"),
            });
          } else if (
            res.data[i].fname.indexOf(".xls") != -1 ||
            res.data[i].fname.indexOf(".xlsx") != -1
          ) {
            this.fileList1.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../../assets/image/ex.jpg"),
            });
          } else if (res.data[i].fname.indexOf("pdf") != -1) {
            this.fileList1.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../../assets/image/pdf.jpg"),
            });
          } else {
            this.fileList1.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../../assets/image/file.jpg"),
            });
          }
        console.log(this.$refs.supplementfile1.fileList, "获取图片数组");
        this.$refs.supplementfile1.fileList = this.fileList1;
      });
    },
    //附件上传
    upload_m(e) {
      //获取选定的文件
      let tFile = e.target.files;
      let len = tFile.length;
      console.log(len, "文件个数");
      console.log(tFile, "文件");
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
          imgs: imgurl,
        };
        //开始上传文件 新建一个formData
        let param = new FormData();
        //通过append向form对象添加数据 ！！！图片数据
        console.log(tFile[i], "tFile");
        param.append("f", tFile[i]);
        // console.log(this.currentNode,"选择的地址");
        let a = JSON.parse(sessionStorage.getItem("file_r")).id;
        if (a == "") {
          return false;
        }
        let fmid = a;
        console.log("fmid", fmid);
        param.append("fmid", fmid);
        this.$http.post("/fmc/upf", param).then((res) => {
          //特殊需求 数据赋值
          this.file_fid = res.data[0].fid;
          console.log(this.file_fid, "this.file_fid");
          // this.reload_file()
          // alert("上传成功")
        });
      }
      alert("上传成功");
    },
    //  reload_file(){
    //   let datas =new FormData();
    //   let fmid=JSON.parse(sessionStorage.getItem("file_r")).id
    //   datas.append("fmid",fmid)
    //   this.$http.post('/fmc/gp',datas).then(res=>{
    //     this.tableData=res.data
    //     this.file_name=res.data
    //   console.log(res,"路径下节点信息")
    //   })
    // },
    chooseType() {
      document.getElementById("upload_file").click();
    },
    chooseType2() {
      document.getElementById("upload_file1").click();
    },
    file_queren() {
      this.dialogTableVisible_file = false;
      let t = JSON.parse(sessionStorage.getItem("file_r"));
      this.shouwen_form.fpostion = t.path;
      this.shouwen_fmid = t.fmid;
      // this.shouwen_form.fmid = t.fmid;
      console.log(t, "路径");
    },
    file_tree(type) {
      if (type != "" && this.shouwen_fmid != "") {
        let data = new FormData();
        data.append("fid", type);
        data.append("fmid", this.shouwen_fmid);
        this.$http.post("/fmc/udf", data).then((res) => {
          console.log(res);
        });
      }
    },
    file_tree2(type, tree) {
      if (type != "" && tree != "") {
        let data = new FormData();
        data.append("fid", type);
        data.append("fmid", tree);
        this.$http.post("/fmc/udf", data).then((res) => {
          console.log(res);
        });
      }
    },
    file_router() {
      console.log("213");
      this.dialogTableVisible_file = true;
    },
    zhongyuan(value, time) {
      if (value !== "" && value != null && time !== "" && time != null) {
        let data = new FormData();
        data.append("d", value);
        data.append("y", time);
        this.$http.post("/oc/fn", data).then((res) => {
          // this.num_list.push(res.data)
          this.fawen_form.sendNo = JSON.parse(JSON.stringify(res.data));
          console.log(res);
        });
      }
    },
    fawen_submit() {
      let data = new FormData();
      data.append("", "");
      for (var item in fawen_data)
        this.$http.post("", data).then((res) => {
          console.log(res);
        });
    },
    fawen_cancel() {
      this.clear_f(this.fawen_form);
      // this.handleSelect("43");
      this.dialogTableVisible_4 = false;
      // this.fawen_clear()
      this.fujianfile_name = "";
      // this.reload()
    },
    //清空
    fawen_clear() {
      for (var item in this.fawen_form) {
        delete this.fawen_form[item];
      }
    },
    // fawen_chakan(type){
    //   this.dialogVisible=true
    //   let data =new FormData();
    //   data.append("did",type)
    //   this.$http.post("/oc/gsod",data).then(res=>{
    //     this.shouwen_data()
    //     console.log(res);
    //   })
    // },
    shouwen_delet(type) {
      let data = new FormData();
      data.append("id", type);
      this.$confirm("确认删除信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.$http.post("/oc/dard", data).then((res) => {
          this.shouwen_data();
          console.log(res);
        });
      });
    },
    fawen_public(type) {
      this.watch_s = false;
      this.fujianfile_name = "";
      console.log(type, "拿到的id");
      this.fawen_form = JSON.parse(JSON.stringify(type));
      this.fawen_form.annex.split(",").forEach((item) => {
        this.downform_name(item, 1);
      });
      // this.handleSelect("44");
      console.log(type.sendDepart);
      if (type.sendDepart == "中国远洋渔业协会") {
        this.fawen_form_sendDepart2 = [
          "中远渔协",
          "中远渔协（秘）",
          "中远渔协（财）",
          "中远渔协人字",
        ];
      } else {
        this.fawen_form_sendDepart2 = ["中远渔", "中远渔（财）"];
      }
      this.fawen_form.sendTime = Date.parse(this.fawen_form.sendTime);
      this.fawen_form.sendTime = new Date(this.fawen_form.sendTime);
      this.fawen_form.sendTime = this.fawen_form.sendTime.getFullYear();
      // this.fawen_form.sendTime = this.fawen_form.sendTime | this.time_y;
      console.log(this.fawen_form.sendTime, "fawen_form.sendTime");
      this.dialogTableVisible_4 = true;
    },

    fawen_delet(type) {
      let data = new FormData();
      data.append("id", type);
      this.$confirm("确认删除信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.$http.post("/oc/dsod", data).then((res) => {
          this.fawen_data();
          console.log(res);
        });
      });
    },
    adents() {
      var data = new FormData();
      let t = sessionStorage.getItem("token");
      data.append("t", t);
      this.$http.post("/uc/gau", data).then((res) => {
        console.log(res);
        this.options = res.data;
        this.user_option = res.data;
      });
    },
    //下载文件
    //下载表
    // downform(type) {

    // console.log(type);
    // if (type == "") return false;
    // var data = new FormData();
    // data.append("fid", type);
    // this.$http({
    //   url: "/fmc/dpf",
    //   method: "post",
    //   data: data,
    //   responseType: "blob",
    // }).then((res) => {
    //   console.log(res.headers["Content-Disposition"], "res---------");
    //   if (res.headers["content-disposition"]) {
    //     var fileName = res.headers["content-disposition"]
    //       .split(";")[1]
    //       .split("fileName=")[1];
    //     var fileNameUnicode = res.headers["content-disposition"].split(
    //       "filename*="
    //     )[1];
    //     if (fileNameUnicode) {
    //       //当存在 filename* 时，取filename* 并进行解码（为了解决中文乱码问题）
    //       fileName = decodeURIComponent(fileNameUnicode.split("''")[1]);
    //     }
    //     console.log(fileName, "fileName");
    //   }
    //   this.download(res, fileName);
    // });

    // .catch(error => {});
    // },
    file_close() {
      this.fileList = [];
      this.fileList1 = [];
      this.$refs.supplementfile1.fileList = [];
      this.$refs.shouwenaddfile.fileList = [];
      this.dialogVisible_file = false;
    },
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
        if (num == 1)
          this.fujianfile_name =
            this.fujianfile_name + "\xa0\xa0\xa0 " + fileName;
        if (num == 2) {
          let f = {};
          f.fnm = fileName;
          f.fid = type;
          this.shouwen_upname.push(f);
        }
        //列表解析文件名
        if (num == 3) {
          return "123";
        }
        // this.download(res, fileName);
      });
      // .catch(error => {});
    },
    form_name(type) {
      let data = new FormData();
      data.append("fmid", type);
      // let f={}
      this.$http({
        url: "/fmc/gpn",
        method: "post",
        data: data,
      }).then((res) => {
        this.f_nlist = res.data;
      });
    },
    nnnm(item) {
      return "123";
    },
    //下载
    download(data, fileName) {
      // var myDate = new Date();
      // var mytime = myDate.toLocaleString();
      fileName = decodeURIComponent(fileName);
      console.log(fileName, "文件名");
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
    handleReload() {
      this.reload(); // 在想要刷新页面的时候调用reload方法
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
    //附件上传
    upload(e, num) {
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
        this.file_name = tFiles[i].name;
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
          //收文添加上传文件操作
          console.log(res.data[0]);
          console.log(typeof res.data);
          let ff = [];
          if (num == 1) {
            for (var item of res.data) {
              console.log(item, "111111111111111");
              this.shouwen_upname.push(item);
            }
          }
          console.log(this.shouwen_upname, "文件上传回显");
          // for (var key in res.data) {
          //   this.fid = res.data[key].fid;
          // }
          console.log(this.fid);
          //特殊需求部分 页面状态
          this.isActive = true;
        });
        alert("上传成功");
      }
    },
    fujian_button() {
      document.getElementById("fujian_upload").click();
    },
    upload_fujian(e) {
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

        this.fujianfile_name = this.fujianfile_name + " " + tFiles[i].name;
        // console.log(this.fujianfile_name,"上传文件名字");
        // this.fawen_form.annex=this.fujianfile_name
        // console.log();
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
          console.log(res.data, "asdasdasdasdads");
          console.log(this.fawen_form.annex, "发文表格的annex");
          for (var key in res.data) {
            this.wenjianfid1.push(res.data[key].fid);
          }
          console.log(this.wenjianfid1, "文件id");
          // this.wenjianfid = res.data.fid;
          // console.log(this.wenjianfid);
          //特殊需求部分 页面状态
          this.isActive = true;
        });
      }
    },
    guanbi_shou(done) {
      this.shouwen_return();
    },
    guanbi_fa(done) {
      this.fawen_return();
    },
    fawen_shenqing() {
      this.fawen_form.sendTime = new Date();
      //  new Date(this.fawen_form.sendTime);
      let username = sessionStorage.getItem("username");
      console.log(username, "username");
      this.fawen_form.sender = username;
      this.fawen_approval_status = true;
      //   this.fawen_form.sendTime = mydate1.getFullYear();
      this.watch_s = true;
      // this.handleSelect("44")
      this.fawen_title = "发文申请";
      this.dialogTableVisible_1 = true;
      this.fawen_status = true;
      let data = new FormData();
      this.$http.post("/oc/gsp", data).then((res) => {
        this.fawen_shenhe = res.data;
        console.log(this.fawen_shenhe);
        console.log(res.data);
      });
      this.getishowpeople();
      this.Upload_showdisable = true;
    },
    getishowpeople() {
      let data = new FormData();
      this.$http.post("/oc/gubd", data).then((res) => {
        console.log(res.data);
        let p = JSON.parse(JSON.stringify(res.data));
        this.ishowpeople = p;
      });
    },
    shouwen_shenqing() {
      this.Upload_showdisable = true;
      this.shouwen_recvno = true;
      this.clear_f(this.shouwen_form);
      this.watch_f = true;
      this.shouwen_upname = [];
      // this.handleSelect("42");
      this.shouwen_show = false;
      let data = new FormData();
      this.$http.post("/oc/gubd", data).then((res) => {
        console.log(res.data);
        let p = JSON.parse(JSON.stringify(res.data));
        this.ishowpeople = p;
      });
      this.visible_shouwenform = true;
    },
    shouwen_upload() {
      document.getElementById("upload_file").click();
    },
    fawen_return(formName) {
      this.$nextTick(() => {
        this.$refs.fawen_form.resetFields();
      });
      this.watch_s = false;
      this.isActive = true;
      this.file_name = [];
      this.dialogTableVisible_1 = false;
      this.$refs.newUpload_shouwen.fileList = [];
      this.fileList = [];
      console.log(1);
      this.fawen_data();
    },
    shouwen_return() {
      this.$refs.shouwen_form.resetFields();
      this.isActive = true;
      this.file_name = [];
      (this.dialogTableVisible_2 = false), (this.shouwen_status = false);
    },
    fawen_queren(formName) {
      console.log(this.fid, "发文的fid");
      console.log(typeof this.fawen_form);
      let data = new FormData();
      for (let key in this.fawen_form) {
        if (this.fawen_form[key] != "" && this.fawen_form[key] != null)
          data.append(key, this.fawen_form[key]);
      }
      let people = JSON.stringify(this.fawen_form.isVisible);
      data.set("isVisible", people);
      let time = this.fawen_form.sendTime;
      time = new Date(time);
      console.log(time);
      time = time.getFullYear();
      console.log(time);
      data.set("sendTime", time);
      let fileListId = "";
      for (const i of this.$refs.newUpload_shouwen.fileList) {
        fileListId += Number(i.raw.fid) + ",";
      }
      fileListId = fileListId.substring(0, fileListId.lastIndexOf(","));
      data.set("annex", fileListId);
      data.delete("sendNo", this.sendNo);
      console.log(data);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("确认信息填写无误", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info",
          }).then(() => {
            this.$http({
              method: "post",
              url: "/oc/asod",
              data: data,
            }).then((res) => {
              console.log(res.data);
              this.dialogTableVisible_1 = false;
              this.$nextTick(() => {
                this.$refs.fawen_form.resetFields();
              });
              this.file_name = [];
              this.$refs.newUpload_shouwen.fileList = [];
              this.fileList = [];
              this.fawen_data();

              this.fawen_clear();

              this.file_name = [];
              this.fujianfile_name = "";
              this.fawen_data();

              this.fid = [];
              this.$refs.newUpload_shouwen.fileList = [];
              console.log(1);
            });
          });
        }
      });
    },
    fake_fawendown() {
      let data = new FormData();
      for (let key in this.fawen_form) {
        if (this.fawen_form[key] != "" && this.fawen_form[key] != null)
          data.append(key, this.fawen_form[key]);
      }
      if (
        this.fawen_form.createTime != "" &&
        this.fawen_form.createTime != null
      )
        data.set("createTime", new Date(this.fawen_form.createTime));
      data.append("fid", this.wenjianfid1);
      this.$http({
        method: "post",
        url: "/oc/usod",
        data: data,
      }).then((res) => {
        console.log(res.data);
        this.file_name = [];
        this.fawen_data();
        this.dialogTableVisible_4 = false;
        this.$message({
          message: "保存成功",
          type: "success",
        });
        console.log(this.fid, "asdasdasdasdasd");
        // this.fujianfile_name=""
      });
    },
    shouwen_queren(formName) {
      if (this.shouwen_show == false) {
        this.shouwen_form.fmid = this.fmid;
        let data = new FormData();

        for (let key in this.shouwen_form) {
          if (this.shouwen_form[key] != "" && this.shouwen_form[key] != null)
            data.append(key, this.shouwen_form[key]);
        }
        data.set("isVisible", JSON.stringify(this.shouwen_form.isVisible));
        if (
          this.shouwen_form.recvTime != "" &&
          this.shouwen_form.recvTime != null
        )
          data.set("recvTime", new Date(this.shouwen_form.recvTime));
        if (
          this.shouwen_form.sendTime != "" &&
          this.shouwen_form.sendTime != null
        )
          data.set("sendTime", new Date(this.shouwen_form.sendTime));
        var f = [];
        this.fileListId = "";
        for (const i of this.$refs.shouwenaddfile.fileList) {
          this.fileListId += Number(i.raw.fid) + ",";
        }
        this.fileListId = this.fileListId.substring(
          0,
          this.fileListId.lastIndexOf(",")
        );
        data.set("fid", this.fileListId);
        if (this.status_edit == 2) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$confirm("确认信息填写无误", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "info",
              }).then(() => {
                this.$http({
                  method: "post",
                  url: "/oc/urod",
                  data: data,
                }).then((res) => {
                  sessionStorage.removeItem("file_id");
                  this.file_tree(f);
                  this.$refs[formName].resetFields();

                  sessionStorage.removeItem("file_id");
                  this.reload();
                });
              });
            } else {
              this.$alert("信息填写不规范或不完整", "提示", {
                confirmButtonText: "确定",
              });
            }
          });
        } else {
          if (
            this.shouwen_form.recvTime != "" &&
            this.shouwen_form.recvTime != null
          )
            data.set("recvTime", new Date(this.shouwen_form.recvTime));
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$confirm("确认信息填写无误", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "info",
              }).then(() => {
                this.$http({
                  method: "post",
                  url: "/oc/arod",
                  data: data,
                }).then((res) => {
                  sessionStorage.removeItem("file_id");
                  this.file_tree(f);
                  this.$refs[formName].resetFields();
                  this.reload();

                  this.$refs[formName].resetFields();
                });
              });
            } else {
              this.$alert("信息填写不规范或不完整", "提示", {
                confirmButtonText: "确定",
              });
            }
          });
        }
      } else if (this.shouwen_show == true) {
        this.$refs[formName].resetFields();
        this.reload();
      }
    },

    openDetails(row) {
      this.dialogTableVisible_1 = true;
      return false;
    },
    //收文详细弹窗
    openDetails_2(row) {
      this.dialogTableVisible_2 = true;
      return false;
    },
    //发文修改弹窗
    modify_2() {
      this.dialogTableVisible_2 = true;
    },
    //收文修改弹窗
    modify() {},
    // fawen_chakan(type) {
    //   var va = new FormData();
    //   va.append("did", type);
    //   this.$http({
    //     method: "post",
    //     url: "/oc/gsod",
    //     data: va,
    //   }).then((res) => {
    //     console.log(res.data);
    //     this.dialogVisible = true;
    //     this.shenqin_name = res.data.sender;

    //   });

    // return false;
    // },
    shouwen_chakan(type, num, t) {
      this.getishowpeople();
      this.shouwen_upname = [];
      this.watch_f = true;
      this.shouwen_recvno = false;

      this.status_edit = num;
      if (num == 3) {
        this.shouwen_show = true;
        this.Upload_showdisable = false;
      } else {
        t.isVisible = JSON.parse(t.isVisible);
        this.shouwen_show = false;
        this.Upload_showdisable = true;
      }

      this.shouwen_form = JSON.parse(JSON.stringify(t));
      var data = new FormData();
      data.append("fid", t.fid);
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
              url: require("../../assets/image/txt.jpg"),
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
              url: require("../../assets/image/docx.jpg"),
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
              url: require("../../assets/image/ex.jpg"),
            });
          } else if (res.data[i].fname.indexOf("pdf") != -1) {
            this.fileList.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../../assets/image/pdf.jpg"),
            });
          } else {
            this.fileList.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../../assets/image/file.jpg"),
            });
          }
        console.log(this.fileList);
        this.$refs.shouwenaddfile.fileList = this.fileList;
      });
      this.visible_shouwenform = true;
      // did.append("did", type);
      // this.$http({
      //   method: "post",
      //   url: "/oc/grd",
      //   data: did
      // }).then(res => {
      //   console.log(res.data);
      //   this.shouwen_form = JSON.parse(JSON.stringify(res.data));
      //   if (res.data.fid != "") {
      //     res.data.fid.split(",").forEach(item => {
      //       this.downform_name(item, 2);
      //     });
      //   }
      // });
    },
    //收文信息
    shouwen_data() {
      let data = new FormData();
      this.$http.post("/oc/gard", data).then((res) => {
        console.log(res.data);
        this.tableData_gl = res.data;
        console.log(this.tableData_gl, "this.tableData_gl");
      });
    },
    fawen_data() {
      let data = new FormData();
      this.$http.post("/oc/gasod", data).then((res) => {
        console.log(res.data, "发文申请的数据", res, "wdasdaasdasdasd");
        this.tableData_shen = res.data;
        // this.tableData_shen.sendTime;
        // for (var item in res.data) {
        //   console.log(res.data[item].sendTime);
        //   res.data[item].sendTime = Date.parse(new Date());
        //   res.data[item].sendTime = res.data[item].sendTime.getFullYear();
        // }
        console.log(res.data.sendTime);
        this.tableData_shen = res.data;
      });
    },
    shenpi_data() {
      let data = new FormData();
      data.append("as", 4);
      this.$http({
        method: "post",
        url: "/job/fwl",
        data: data,
      }).then((res) => {
        console.log(res);
        this.tableData_sp = res.data;
      });
    },
    user_select() {
      let data = new FormData();
      this.$http.post("/uc/gau", data).then((res) => {
        this.user_data = res.data;
        console.log(this.user_data, " this.user_data");
      });
    },
    //通过id获取发文
    get_fawen() {
      this.$http({
        method: "post",
        url: "/oc/gsod",
        data: {},
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          }
          return str.join("&");
        },
      }).then((res) => {
        console.log(res.data);
      });
    },
    //通过id获取收文
    get_shouwen() {
      this.$http({
        method: "post",
        url: "/oc/grd/",
        data: {},
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          }
          return str.join("&");
        },
      }).then((res) => {
        console.log(res.data);
      });
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);

      this.activeIndex = key;
      console.log(this.activeIndex, "activeIndex");
      console.log(key == this.activeIndex);
    },
    //预先请求编号
    // b_number(){
    //   for(var i=0;i<6;i++){
    //     this.zhongyuan(i)
    //   }
    // },
    handleEdit(index, row) {
      this.dialogTableVisible_2 = true;
      this.shouwen_status = true;
      console.log(index, row);
    },
  },

  mounted() {
    this.fawen_form.sender = JSON.parse(sessionStorage.getItem("user_name"));
    // this.handleSelect("41")
    // this.zhongyuan("0");
    this.fawen_data();
    this.shenpi_data();
    this.shouwen_data();
    this.user_select();
    this.adents();
    let t = sessionStorage.getItem("token");
    // console.log( typeof(sessionStorage.getItem("a")),"aaaaaaaa");
    let a = JSON.parse(sessionStorage.getItem("a"));
    // let a=["1", "11", "12", "13",  "14", "141", "142", "143",  "2", "21", "211", "212", "213", "214", "22", "23", "24", "241", "242", "243", "25", "251", "252", "253", "3", "31", "311", "312", "313",  "32", "321", "322", "4", "41", "42", "421", "422",  "5", "6", "61", "62", "7", "71", "72", "8", "913", "922", "81", "811", "812", "813", "82", "822", "821", "823", "824", "9", "91", "911", "912", "92", "921"]
    for (let item of a) {
      // console.log(item)
      // if (item == "41") this.menu.push({ name: "发文审批", id: "41" });
      if (item == "41") this.menu.push({ name: "收文管理", id: "41" });
      // if (item == "42") this.menu.push({ name: "收文添加", id: "42" });
      if (item == "43") this.menu.push({ name: "发文申请", id: "43" });
      // if (item == "44") this.menu.push({ name: "发文模板(PDF)", id: "44" });
    }
    let float = sessionStorage.getItem("float");
    this.float = JSON.parse(float);
    this.activeIndex = this.float.menu_index;
    // console.log(this.float,'this.float');
    // this.handleSelect(this.menu[0].id);
  },
  beforeRouteLeave(to, from, next) {
    this.float.menu_index = this.activeIndex;
    let float = JSON.stringify(this.float);
    sessionStorage.setItem("float", float);
    next();
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name == "information") {
        vm.handleSelect("43");
      } else {
        vm.handleSelect(vm.menu[0].id);
      }
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.color_red {
  color: red;
}
.color_green {
  color: green;
}
.color_blue {
  color: #3399ff;
}
body .el-table::before {
  z-index: inherit;
}
/* .fawen_border{
  border: 1px solid #070707;
} */
.pdf_header {
  display: flex;
  justify-content: space-between;
}
.pdf_page {
  /* padding-top: 20px; */
  height: 500px;
  min-height: 400px;
  /* margin-left: 80px; */
  /* text-align: center; */
  margin: 0 auto;
  overflow: auto;
}
.pdf_page input {
  background-color: transparent;
  border: 0;
}
.pdf_page textarea {
  resize: none;
}
.pdf_geshi {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.upload_button {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.shenqing_button {
  /* padding-top: 5px; */
  width: 97px;
  height: 41px;
  margin-left: 20px;
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
.Official {
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
  min-width: 1210px;
  display: flex;
  justify-content: left;
  padding: 0.8% 0%;
  margin-top: 7px;
  margin-left: 20px;
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
.approval_foot {
  display: flex;
  justify-content: space-around;
  padding-bottom: 20px;
}
</style>
