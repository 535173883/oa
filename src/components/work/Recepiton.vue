<template>
  <!-- 公务接待 -->
  <div class="OnBusiness">
    <!-- 菜单 -->
    <div class="menu">
      <div class="menu">
        <el-menu
          text-color="#000"
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item v-for="(item, index) of menu" :key="index" :index="item.id">
            <span>{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
    <!-- 公务申请 -->
    <div class="content" v-show="activeIndex == '191'">
      <div class="table_top1">
        <div style="width:100%">
          <div style="text-align:left">
            <span>公务活动项目：</span>
            <el-input v-model="search.active" style="width: 100px;"></el-input>&#8195;
            <span>公务活动场所：</span>
            <el-input v-model="search.place" style="width: 100px;"></el-input>&#8195;
            <span>接待对象：</span>
            <el-input v-model="search.reason" style="width: 100px;"></el-input>&#8195;
            <!-- <span>活动开始时间：</span>
            <el-date-picker
              v-model="search.update"
              type="datetime"
              placeholder="开始时间"
              size="mini"
              style="width:180px"
            ></el-date-picker>
            <el-date-picker
              v-model="search.downdate"
              type="datetime"
              placeholder="结束时间"
              size="mini"
              style="width:180px"
            ></el-date-picker>&#8195;-->
            <el-button icon="el-icon-search" type="primary" @click="OfficialRe"></el-button>
            <!-- <div>
            <el-button type="primary" @click="apply(1)" v-has="71"
              >申请</el-button
            >
            </div>-->
            <el-button type="primary" @click="apply(1)">申请</el-button>
          </div>
        </div>
      </div>
      <!-- <input type="text" v-model="content_v" placeholder="搜索申请人姓名"> -->
      <!-- <el-button type="primary" @click="apply(1)" v-has="71">申请</el-button> -->

      <el-table
        :data="OfficialRedata"
        style="width: 95.8%;margin:0 2.1%;height:500px;overflow:auto"
        align="center"
        height="430"
        border
        header-cell-class-name="t_h"
      >
        <el-table-column label="公务活动项目" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.agent5 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="公务活动场所" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer">{{ scope.row.leaveaddr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="公务费用" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.reamrk5 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="接待对象" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.reason_search }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.uptime | time_f }}</span>
          </template>
        </el-table-column>

        <el-table-column label="结束时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.downtime | time_f }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="审批进程" align="center">
        <template slot-scope="scope">
          <div class="operation">
            <span
              style="color:#3399FF"
              @click="handleEdit(scope.row.wid)"
              v-has="72"
              >查看</span
            >
          </div>
        </template>
        </el-table-column>-->

        <el-table-column label="审核状态" align="center">
          <template slot-scope="scope">
            <span
              :class="
                scope.row.sh_status == 1
                  ? 'color_blue'
                  : scope.row.sh_status == 2
                  ? 'color_green'
                  : 'color_red'
              "
            >{{ scope.row.sh_status | ownstatus_f4 }}</span>
            <!-- <span class="color_red" v-if="!scope.row.isconfirm">未确认</span> -->
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <span
                style="color:#3399FF"
                @click="apply(2, scope.row)"
                v-show="scope.row.isconfirm == 0"
              >确认</span>
              <span style="color:red" @click="apply(3, scope.row)">刪除</span>
              <span style="color:#3399FF" @click="apply(4, scope.row)">查看</span>
              <span style="color:#3399FF" @click="apply(5, scope.row)">下载</span>
              <!-- <span style="color:#3399FF;" @click="apply(6, scope.row)">补充附件</span> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <span class="demonstration">每页10条</span>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <!-- 公务接待审批页面 -->
    <div class="content" v-show="activeIndex == '192'">
      <div class="table_top">
        <span style="line-height: 31px;">申请人 ：</span>
        <input
          type="text"
          v-model="content2_v"
          placeholder="搜索申请人姓名"
          style="width:150px; margin-right:20px"
        />
        <span style="line-height: 31px;">活动开始日期 ：</span>
        <el-date-picker v-model="search_uptime" type="datetime" placeholder="开始日期"></el-date-picker>
        <el-date-picker
          style="margin-left:20px"
          v-model="search_endtime"
          type="datetime"
          placeholder="结束日期"
        ></el-date-picker>
        <el-button
          style="margin-left:20px"
          icon="el-icon-search"
          type="primary"
          @click="searchtime"
        ></el-button>
        <!-- <el-button type="success" @click="ob_all()" style="margin-left:40px"
          >查看所有公务接待</el-button
        >-->
      </div>
      <el-table
        :data="
          tableData_sp
            .filter(
              data =>
                !content2_v ||
                data.uname.toLowerCase().includes(content2_v.toLowerCase())
            )
            .slice(
              (this.currentPage2 - 1) * this.pageSize,
              this.currentPage2 * this.pageSize
            )
        "
        style="width: 95.8%;margin:0 2.1%;height:500px;overflow:auto"
        align="center"
        height="430"
        border
        header-cell-class-name="t_h"
      >
        <el-table-column label="申请人" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.uname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="公务活动项目" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.agent5 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="公务活动开始时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.uptime | time_f }}</span>
          </template>
        </el-table-column>
        <el-table-column label="公务活动结束时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.downtime | time_f }}</span>
          </template>
        </el-table-column>
        <el-table-column label="公务活动场所" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.leaveaddr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="陪同人员" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer">{{ scope.row.accompanypeople }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span
              v-if="!ob_s"
              :class="
                scope.row.ownstatus == 0
                  ? 'color_red'
                  : scope.row.ownstatus == 1
                  ? 'color_green'
                  : 'color_blue'
              "
            >{{ scope.row.ownstatus | ownstatus_f }}</span>
            <span
              v-if="ob_s"
              :class="
                scope.row.result == 0
                  ? 'color_red'
                  : scope.row.result == 1
                  ? 'color_green'
                  : 'color_blue'
              "
            >{{ scope.row.result | ownstatus_f2 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <el-button type="text" @click="shenpi(scope.row)">
                {{
                scope.row.ownstatus == null ? "审批" : "查看"
                }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <span class="demonstration">每页10条</span>
        <el-pagination
          :current-page.sync="currentPage2"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="
            tableData_sp.filter(
              data =>
                !content2_v ||
                data.uname.toLowerCase().includes(content2_v.toLowerCase())
            ).length
          "
        ></el-pagination>
      </div>
    </div>
    <!-- 公务接待审批弹窗 -->
    <el-dialog
      :title="shenpixaingqing"
      width="40%"
      :visible.sync="dialogformvisible1"
      :close-on-click-modal="false"
    >
      <el-form :model="Reception_form" label-width="100px" ref="Reaeotion_form" disabled>
        <el-form-item label="活动项目:" prop="name">
          <el-input v-model="Reception_form.agent5"></el-input>
        </el-form-item>
        <el-form-item label="活动场所:" prop="site">
          <el-input v-model="Reception_form.leaveaddr" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="活动时间:">
          <el-col :span="10">
            <el-form-item prop="date1">
              <el-date-picker
                v-model="Reception_form.uptime"
                type="datetime"
                placeholder="选择日期时间"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="10">
            <el-form-item prop="date1">
              <el-date-picker
                v-model="Reception_form.downtime"
                type="datetime"
                placeholder="选择日期时间"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="活动费用:" prop="free">
          <!-- <el-input v-model="Reception_form.reamrk5" style="width:100%"></el-input> -->
          <el-select v-model="Reception_form.reamrk5" style="width:100%" placeholder="请选择">
            <el-option value="公务用车" label="公务用车"></el-option>
            <el-option value="公务用餐" label="公务用餐"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="陪同人员:" prop="accompany">
          <el-select
            v-model="Reception_form.accompanypeople"
            multiple
            placeholder="请选择"
            style="width:100%"
          >
            <el-option
              v-for="(item, index) in ptpeople"
              :key="index"
              :value="item.uid"
              :label="item.username"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接待对象:" prop="object">
          <el-input style="width:18%;margin-left:-12%" placeholder="接待对象" disabled></el-input>
          <el-input style="width:50%" placeholder="所在单位" disabled></el-input>
          <el-input style="width:18%" placeholder="职务" disabled></el-input>
        </el-form-item>
        <el-form-item v-for="(item, index) in Reception_form.reason" :key="index">
          <el-input v-model="item.unit" style="width:18%;margin-left:-12%"></el-input>
          <el-input v-model="item.object" style="width:50%"></el-input>
          <el-input v-model="item.duty" style="width:18%"></el-input>
        </el-form-item>
        <el-form-item label="部门主任:">
          <el-select v-model="Reception_form.agent1" placeholder="请选择选择部门主任" style="width:100% ">
            <el-option
              v-for="(item, index) in bmdepartmentn"
              :key="index"
              :label="item.username"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批意见:" v-if="Reception_form.reamrk1">
          <el-input v-model="Reception_form.reamrk1"></el-input>
        </el-form-item>
        <el-form-item label="分管副秘书长:" class="fgms">
          <el-select v-model="Reception_form.agent2" style="width:100%">
            <el-option
              v-for="(item, index) in fgbranched"
              :key="index"
              :label="item.username"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批意见:" v-if="Reception_form.reamrk2">
          <el-input v-model="Reception_form.reamrk2"></el-input>
        </el-form-item>
        <el-form-item label="秘书长:">
          <el-select v-model="Reception_form.agent3" style="width:100%">
            <el-option
              v-for="(item, index) in mssecretarygeneral"
              :key="index"
              :label="item.username"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批意见:" v-if="Reception_form.reamrk3">
          <el-input v-model="Reception_form.reamrk3"></el-input>
        </el-form-item>
        <el-form-item
          label="附件  ："
          :label-width="formLabelWidth"
          prop="mid"
          style="text-align: left;"
        >
          <span v-show="yupianjiazai">未上传附件</span>
          <newUpload ref="newUpload2" :Upload_showdisable="Upload_showdisable"></newUpload>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
        style="display:flex;margin-bottom:20px;justify-content:flex-end;"
      >
        <el-button type="primary" v-if="Approval" @click="close_shenpi()" style="width: 120px;">关 闭</el-button>
        <el-button type="info" @click="close_shenpi()" v-if="!Approval" style="width: 120px;">取 消</el-button>
        <div style="width:5%" v-if="!Approval"></div>
        <el-button
          type="primary"
          @click="agree(shenpi_wid, 1)"
          v-if="!Approval"
          style="width: 120px;"
        >同意</el-button>
        <div style="width:5%" v-if="!Approval"></div>
        <el-button
          type="danger"
          @click="agree(shenpi_wid, 0)"
          v-if="!Approval"
          style="width: 120px;"
        >拒绝</el-button>
      </div>
    </el-dialog>
    <!-- 公务接待申请表单 -->
    <el-dialog
      :title="OnBusiness_title"
      width="800px"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      @close="shenqingcolse"
    >
      <el-form
        :model="recepiton"
        label-width="110px"
        :disabled="showdata == false"
        :rules="rules"
        ref="recepiton"
      >
        <el-form-item label="活动项目:" prop="name">
          <el-input v-model="recepiton.name" style="width:100%" placeholder="填写活动项目"></el-input>
        </el-form-item>
        <el-form-item label="活动场所:" prop="site">
          <el-input v-model="recepiton.site" style="width:100%" placeholder="填写活动场所"></el-input>
        </el-form-item>
        <el-form-item label="活动时间:" required>
          <el-col :span="10">
            <el-form-item prop="date1">
              <el-date-picker
                v-model="recepiton.date1"
                type="datetime"
                default-time="8:00:00"
                placeholder="选择日期时间"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="10">
            <el-form-item prop="date2">
              <el-date-picker
                v-model="recepiton.date2"
                type="datetime"
                default-time="17:00:00"
                placeholder="选择日期时间"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="活动费用:" prop="free">
          <el-select v-model="recepiton.free" style="width:100%" placeholder="请选择">
            <el-option value="公务用车" label="公务用车"></el-option>
            <el-option value="公务用餐" label="公务用餐"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="陪同人员:" prop="accompany">
          <el-select
            v-model="recepiton.accompany"
            multiple
            placeholder="请选择"
            style="width:100%"
            filterable
          >
            <el-option
              v-for="(item, index) in ptpeople"
              :key="index"
              :value="index"
              :label="item.username"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 接待对象开始 -->
        <el-form-item label="接待对象:" required>
          <el-input style="width:18%;margin-left:-12%" placeholder="接待对象" disabled></el-input>
          <el-input style="width:50%" placeholder="所在单位" disabled></el-input>
          <el-input style="width:18%" placeholder="职务" disabled></el-input>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in dynamicValidateForm.reception_object"
          :key="index"
          style="margin-top:-15px;margin-left:-1.5%"
          :rules="{
            required: true
          }"
        >
          <el-input v-model="domain.object" style="width:17%; "></el-input>
          <el-input v-model="domain.unit" style="width:49%;"></el-input>
          <el-input v-model="domain.duty" style="width:18%; "></el-input>
          <el-button @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
        <el-form-item style="margin-bottom:5px">
          <el-button
            @click="addDomain"
            style="width:100px;height:40px;font-size:15px;margin-top:-20px"
            v-show="showdata == true"
          >＋</el-button>
        </el-form-item>
        <!-- 接待结束 -->
        <el-form-item label="部门主任" required>
          <el-select
            filterable
            v-model="departmentn"
            placeholder="请选择选择部门主任"
            style="width:100% "
            @change="classifying"
          >
            <el-option
              v-for="(item, index) in bmdepartmentn"
              :key="index"
              :label="item.username"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批意见:" v-if="recepiton.reamrk1">
          <el-input v-model="recepiton.reamrk1"></el-input>
        </el-form-item>
        <el-form-item label="分管副秘书长:" class="fgms" v-if="show1 == true" required>
          <el-select
            filterable
            v-model="branched"
            placeholder="请选择分管副秘书长"
            style="width:100%"
            @change="classifying1"
          >
            <el-option
              v-for="(item, index) in fgbranched"
              :key="index"
              :label="item.username"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批意见:" v-if="recepiton.reamrk2">
          <el-input v-model="recepiton.reamrk2"></el-input>
        </el-form-item>
        <el-form-item label="秘书长:" v-if="show2 == true" required>
          <el-select v-model="secretarygeneral" placeholder="请选择秘书长" style="width:100%" filterable>
            <el-option
              v-for="(item, index) in mssecretarygeneral"
              :key="index"
              :label="item.username"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批意见:" v-if="recepiton.reamrk3">
          <el-input v-model="recepiton.reamrk3"></el-input>
        </el-form-item>
        <el-form-item
          label="附件  ："
          :label-width="formLabelWidth"
          prop="mid"
          style="text-align: left;"
        >
          <newUpload ref="newUpload1" :Upload_showdisable="Upload_showdisable"></newUpload>
        </el-form-item>
        <div style="display: flex;
    justify-content: flex-end;">
          <el-button
            type="primary"
            style="width:120px; margin-left:-80px"
            @click="canclesubmit"
            v-if="showdata3 == true"
          >取消</el-button>
          <el-button
            type="primary"
            style="width:120px; margin-left:-80px"
            @click="canclesubmit(2)"
            v-if="showdata2 == true"
          >取消</el-button>
          <el-button
            type="primary"
            style="width:120px "
            @click="open2('recepiton')"
            v-if="showdata3 == true"
          >提交</el-button>
          <el-button
            type="primary"
            style="width:120px "
            @click="open('recepiton', 2)"
            v-if="showdata2 == true"
          >提 交</el-button>
        </div>
      </el-form>
      <div style="display: flex;
    justify-content: flex-end;">
        <el-button
          type="primary"
          style="width:120px"
          @click="sureform"
          v-show="showdata == false"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import newUpload from "./newUpload.vue";
import moment from "moment";
export default {
  inject: ["reload"],
  name: "Leave",
  components: { newUpload },
  data() {
    var checkagent1 = (rule, value, callback) => {
      if (this.user.leaveaddrtype == 1 && value == "") {
        callback(new Error("国外出差请选择审批人"));
      } else callback();
    };
    var checkagent2 = (rule, value, callback) => {
      if (
        this.$refs.newUpload.fileList.length == 0 &&
        this.user_stuate == 1 &&
        value == 1
      ) {
        callback(new Error("国外出差请补充出国请示材料"));
      } else callback();
    };
    var checkagent3 = (rule, value, callback) => {
      if (this.OnBusiness_downtime == 1 && value == "") {
        callback(new Error("请设置出差结束时间"));
      } else callback();
    };
    return {
      yupianjiazai: false,
      //页面搜索功能、
      Upload_showdisable: false,
      search: {
        active: "",
        place: "",
        free: "",
        update: "",
        downdate: "",
        reason: "",
      },
      Approval: "",
      menu: [],
      type: "",
      total: 0,
      pageSize: 10, //每页条数
      currentPage: 1, //当前页码
      wid: "",
      moment,
      dynamicValidateForm: {
        reception_object: [
          {
            unit: "",
            object: "",
            duty: "",
          },
        ],
      },

      //分级
      show1: false,
      show2: false,
      //申请列表
      recepiton: {
        name: "",
        site: "",
        date1: "",
        date2: "",
        free: "",
        accompany: [],
        bm: "",
        reamrk1: "",
        reamrk2: "",
        reamrk3: "",
      },

      //陪同人员
      ptpeople: [],
      //部门主任
      bmdepartmentn: [],
      //分管副秘书长
      fgbranched: [],
      // 秘书长
      mssecretarygeneral: [],
      secretarygeneral: "",
      departmentn: "",
      branched: "",
      //表单数据
      OfficialRedata: [],
      //详情禁止填写
      showdata: true,
      showdata2: true,
      showdata3: true,
      //详情列表展示
      showlist1: false,
      showlist2: false,
      OnBusiness_downtime: "",
      details: false,
      user_stuate: "",
      OnBusiness_title: "",
      chuchaiuptime: "",
      chucaitime: "",
      dialogFormVisible_1: false,
      content1_v: "",
      rules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        site: [{ required: true, message: "请输入活动场所", trigger: "blur" }],
        date1: [
          { required: true, message: "请输入活动开始日期", trigger: "blur" },
        ],
        date2: [
          { required: true, message: "请输入活动结束日期", trigger: "blur" },
        ],
        accompany: [
          { required: true, message: "请选择陪同人员", trigger: "change" },
        ],
        free: [
          {
            required: true,
            message:
              "只填写内容不写具体金额。例如：公务用车、餐费、礼品费等相关接待费",
            trigger: "change",
          },
        ],
        bm: [{ required: true, message: "请选择部门主任", trigger: "change" }],
        // fg: [
        //   {
        //     required: true,
        //     message: "请选择分管副秘书长",
        //     trigger: "blur"
        //   }
        // ],
        // ms: [
        //   {
        //     required: true,
        //     message: "请选择秘书长",
        //     trigger: "blur"
        //   }
        // ]
      },
      num: 0,
      sh_status: "",
      float: [],
      formLabelWidth: "120px",
      dialogFormVisible: false,
      overTm: "",
      ptpeolename: [],
      ptpeolename2: [],
      //补充附件
      dialogVisible_file: false,
      //删除确认框
      dialogVisible_delete: false,
      //公务审批页面数据
      ob_s: false,
      dialogformvisible1: false,
      pageSize: 10,
      currentPage2: 1,
      content2_v: "",
      content1_v: "",
      tableData_sp: [],
      activeIndex: "",
      Reception_form: {
        uname: "",
        agent5: "",
        uptime: "",
        downtime: "",
        leaveaddr: "",
        accompanypeople: [],
        reason: [],
        agent1: "",
        agent2: "",
        agent3: "",
        reamrk1: "",
        reamrk2: "",
        reamrk3: "",
      },
      shenpixaingqing: "",
      shenpi_wid: "",
      search_uptime: "",
      search_endtime: "",
      fileListId: "",
    };
  },
  methods: {
    shenqingcolse() {
      // this.dialogFormVisible = false;
      // this.secretarygeneral = "";
      // this.departmentn = "";
      // this.branched = "";
      // this.recepiton = {
      //   name: "",
      //   site: "",
      //   date1: "",
      //   date2: "",
      //   free: "",
      //   accompany: [],
      // };
      // this.dynamicValidateForm = {
      //   reception_object: [
      //     {
      //       unit: "",
      //       object: "",
      //       duty: "",
      //     },
      //   ],
      // };
      // this.$refs.recepiton.resetFields();
      // this.show1 = false;
      // this.show2 = false;
    },
    searchtime() {
      let data = new FormData();
      data.append("upTime", this.search_uptime);
      data.append("downTime", this.search_endtime);
      this.$http.post("/job/aor", data).then((res) => {
        this.tableData_sp = res.data;
      });
    },
    //查看所有公务接待申请
    ob_all() {
      this.ob_s = true;
      let data = new FormData();
      data.append("as", 6);
      this.$http.post("/job/gll", data).then((res) => {
        if (res.data != -1002) this.tableData_sp = res.data;
        console.log(res);
      });
      this.tableData_sp.ownstatus = 1;
    },
    //审批按钮
    agree(wid, a) {
      let data = new FormData();
      data.append("as", 6);
      data.append("rid", wid);
      data.append("s", a);
      this.$prompt("请输入审批意见", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          if (value == "" || value == null) {
            if (a == 1) {
              value = "同意";
            } else {
              value = "拒绝";
            }
          }
          data.append("r", value);
          this.$http.post("/job/at", data).then((res) => {
            this.load1();
            this.dialogformvisible1 = false;
            this.$refs.newUpload2.fileList = [];
            this.fileList = [];
            this.$message({
              type: "success",
              message: "审批完成",
            });
            this.OfficialRe();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消审批",
          });
        });
    },
    //关闭审批页面
    close_shenpi() {
      this.dialogformvisible1 = false;
      this.$refs.newUpload2.fileList = [];
      this.fileList = [];
    },
    // 审批/查看
    shenpi(value) {
      this.shenpixaingqing = "公务接待详情";
      this.dialogformvisible1 = true;
      let a = JSON.parse(JSON.stringify(value));
      if (a.ownstatus == 1 || a.ownstatus == 0) {
        this.Approval = true;
      } else {
        this.Approval = false;
      }
      this.shenpi_wid = a.wid;
      this.Reception_form = a;
      console.log(a);
      this.Reception_form.reason = JSON.parse(a.reason);
      // if (a.accompanypeople.length != 0) {
      //   for (var item in a.accompanypeople) {
      //     this.Reception_form.accompanypeople.push(Number(item));
      //   }
      // }
      this.Reception_form.accompanypeople = a.accompanypeople.split(",");
      if (a.agent1 != null || a.agent1 != "") {
        this.Reception_form.agent1 = Number(a.agent1);
        console.log(this.bmdepartmentn);
        console.log(a.agent1);
      }
      if (a.agent2 != null || a.agent2 != "") {
        this.Reception_form.agent2 = Number(a.agent2);
      }
      if (a.agent3 != null || a.agent3 != "") {
        this.Reception_form.agent3 = Number(a.agent3);
      }
      let data = new FormData();
      data.append("fid", value.fids);
      this.$http.post("/ac/gbf", data).then((res) => {
        console.log(res.data);
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
        this.$refs.newUpload2.fileList = this.fileList;
        this.yupianjiazai = true
          ? this.$refs.newUpload2.fileList == 0
          : this.$refs.newUpload2.fileList != 0;
      });
    },
    load1() {
      let data = new FormData();
      let t = sessionStorage.getItem("token");
      data.append("t", t);
      this.$http.post("/job/aor", data).then((res) => {
        this.tableData_sp = JSON.parse(JSON.stringify(res.data));
        console.log(res.data, "公务审批信息");
      });
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.activeIndex = key;
      console.log(this.activeIndex, "activeIndex");
      console.log(key == this.activeIndex);
    },
    // //页面搜索
    // search_offical(type) {
    //   this.type = type;
    //   console.log(this.search.active);
    //   console.log(this.search.place);
    //   console.log(this.search.free);
    //   console.log(this.search.update);
    //   console.log(this.search.downdate);
    //   let data = new FormData();
    //   if (this.search.update) {
    //     this.search.update = new Date(this.search.update);
    //     data.append("uptime", this.search.update);
    //   }
    //   if (this.search.downdate) {
    //     this.search.downdate = new Date(this.search.downdate);
    //     data.append("downtime", this.search.downdate);
    //   }
    //   if (this.search.free) {
    //     data.append("reamrk5", this.search.free);
    //   }
    //   if (this.search.place) {
    //     data.append("leaveaddr", this.search.place);
    //   }
    //   if (this.search.active) {
    //     data.append("agent5", this.search.active);
    //   }
    //   data.append("pageNo", this.currentPage);
    //   data.append("pageSize", this.pageSize);
    //   this.$http.post("/job/oro", data).then(res => {
    //     console.log(res);
    //     this.OfficialRedata = res.data.records;
    //     this.total = res.data.total;
    //   });
    // },

    //公务接待页面表单
    OfficialRe() {
      let data = new FormData();
      data.append("t", sessionStorage.getItem("token"));
      data.append("pageNo", this.currentPage);
      data.append("pageSize", this.pageSize);
      if (this.search.reason) {
        data.append("reason", this.search.reason);
      }
      if (this.search.update) {
        this.search.update = new Date(this.search.update);
        data.append("uptime", this.search.update);
      }
      if (this.search.downdate) {
        this.search.downdate = new Date(this.search.downdate);
        data.append("downtime", this.search.downdate);
      }
      if (this.search.free) {
        data.append("reamrk5", this.search.free);
      }
      if (this.search.place) {
        data.append("leaveaddr", this.search.place);
      }
      if (this.search.active) {
        data.append("agent5", this.search.active);
      }
      this.$http.post("/job/oro", data).then((res) => {
        res.data.records.forEach((v, i) => {
          console.log(v.reason);
          if (v.reason) {
            let kk = JSON.parse(v.reason);

            v.reason_search = kk[0].unit;
          }
        });
        console.log(res);
        // if (res.data.records.reason) {
        //   let kk = JSON.parse(res.data.records.reason);
        //   console.log(kk, "kkkkkkkkkkkkkkkkkkk");
        // }
        res.data.records.forEach((v, i) => {
          console.log(v);
          console.log(i);
          // console.log(v[i].isconfirm, "111111111111111111111111111");
          if (v.isconfirm === 0) {
            v.sh_status = 0;
          } else if (v.isconfirm == 1 && v.result == 1) {
            v.sh_status = 2;
          } else if (v.isconfirm == 1 && v.result == 0) {
            v.sh_status = 3;
          } else if (v.isconfirm === 1 && v.result === null) {
            v.sh_status = 1;
          }
        });
        // if (res.data.records.isconfirm === 0) {
        //   this.sh_status = 0;
        // } else if (
        //   res.data.records.isconfirm == 1 &&
        //   res.data.records.result == 1
        // ) {
        //   this.sh_status = 2;
        // } else if (
        //   res.data.records.isconfirm == 1 &&
        //   res.data.records.result == 2
        // ) {
        //   this.sh_status = 3;
        // } else if (
        //   res.data.records.isconfirm === 1 &&
        //   res.data.records.result === null
        // ) {
        //   this.sh_status = 1;
        // }

        console.log(res.data.records);
        this.OfficialRedata = res.data.records;
        this.total = res.data.total;
      });
    },
    //表单页码
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      console.log(this.type, "111111111111111");
      this.OfficialRe();
    },
    // 表单接口
    formdata() {
      let data = new FormData();
      data.append("l", "0");
      this.$http.post("/job/oral", data).then((res) => {
        console.log(res);
        this.ptpeople = res.data;
      });
    },
    formdata1() {
      let data = new FormData();
      data.append("l", "1");
      this.$http.post("/job/oral", data).then((res) => {
        console.log(res);
        this.bmdepartmentn = res.data;
        console.log(this.bmdepartmentn, "1111111111111111111111");
      });
    },
    formdata2() {
      let data = new FormData();
      data.append("l", "2");
      this.$http.post("/job/oral", data).then((res) => {
        console.log(res);
        this.fgbranched = res.data;
        console.log(this.fgbranched, "222222222222222222222222");
      });
    },
    formdata3() {
      let data = new FormData();
      data.append("l", "3");
      this.$http.post("/job/oral", data).then((res) => {
        console.log(res);
        this.mssecretarygeneral = res.data;
      });
    },

    //接待人
    addDomain() {
      this.dynamicValidateForm.reception_object.push({
        unit: "",
        object: "",
        duty: "",
      });
      console.log(this.recepiton.reception_object);
    },
    // addDomain() {
    //   this.dynamicValidateForm.reception_object.push({
    //     value: "",
    //     key: Date.now()
    //   });
    // },
    removeDomain(item) {
      console.log(item);
      var index = this.dynamicValidateForm.reception_object.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.reception_object.splice(index, 1);
      }
      console.log("444444444444444444444444444");
    },
    classifying() {
      this.show1 = true;
    },
    classifying1() {
      this.show2 = true;
    },
    open(formName, scope) {
      this.$confirm("是否提交此信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.formsubmit(formName, scope);
        })
        .catch(() => {});
    },
    open2(formName) {
      this.$confirm("是否提交此信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.formsubmit(formName);
        })
        .catch(() => {});
    },
    //提交表单
    formsubmit(formName, scope) {
      console.log(this.recepiton.accompany);
      console.log(this.dynamicValidateForm, "111111111");
      let data = new FormData();
      let aa = "";
      let bb = "";
      let cc = "";
      let lastagent = [];
      let reason = this.dynamicValidateForm.reception_object;
      var that = this;
      // console.log(this.departmentn, "this.department");
      // console.log(this.bmdepartmentn, "this.bmdepartment");
      // console.log(this.branched);
      // console.log(this.secretarygeneral);
      if (this.departmentn !== "" && typeof this.departmentn == "number") {
        aa = this.bmdepartmentn[this.departmentn].uid;
        console.log(aa);
      } else if (
        this.departmentn !== "" &&
        typeof this.departmentn == "string"
      ) {
        this.bmdepartmentn.forEach(function (item, index) {
          if (that.departmentn == item.username) {
            aa = item.uid;
          }
        });
        console.log(aa);
      }

      if (this.branched !== "" && typeof this.branched == "number") {
        bb = this.fgbranched[this.branched].uid;
        console.log(bb);
      } else if (this.branched !== "" && typeof this.branched == "string") {
        this.fgbranched.forEach(function (item, index) {
          if (that.branched == item.username) {
            bb = item.uid;
          }
        });
        console.log(aa);
      }
      if (
        this.secretarygeneral !== "" &&
        typeof this.secretarygeneral == "number"
      ) {
        cc = this.mssecretarygeneral[this.secretarygeneral].uid;
        console.log(cc);
      } else if (
        this.secretarygeneral !== "" &&
        typeof this.secretarygeneral == "string"
      ) {
        this.mssecretarygeneral.forEach(function (item, index) {
          if (that.secretarygeneral == item.username) {
            cc = item.uid;
          }
        });
        console.log(aa);
      }
      if (aa !== "") {
        lastagent.push(aa);
      }
      if (bb !== "") {
        lastagent.push(bb);
      }
      if (cc !== "") {
        lastagent.push(cc);
      }

      console.log(lastagent[lastagent.length - 1], "lastagent");
      this.fileListId = "";
      for (const i of this.$refs.newUpload1.fileList) {
        this.fileListId += i.raw.fid + ",";
      }
      this.fileListId = this.fileListId.substring(
        0,
        this.fileListId.lastIndexOf(",")
      );
      data.append("fids", this.fileListId);
      data.append("agent1", aa);
      data.append("agent2", bb);
      data.append("agent3", cc);
      data.append("agent5", this.recepiton.name);
      data.append("reamrk5", this.recepiton.free);
      data.append("lastagent", lastagent[lastagent.length - 1]);
      data.append("leaveaddr", this.recepiton.site);
      data.append("uptime", new Date(this.recepiton.date1));
      data.append("downtime", new Date(this.recepiton.date2));
      if (this.wid) {
        data.append("wid", this.wid);
      }
      this.ptpeolename = [];
      console.log(this.recepiton.accompany);
      console.log(this.ptpeolename);

      this.recepiton.accompany.forEach(function (item) {
        if (typeof item == "number") {
          that.ptpeolename.push(that.ptpeople[item].username);
        } else {
          that.ptpeolename.push(item);
        }
        that.ptpeolename2 = that.ptpeolename;
      });
      console.log(this.ptpeolename2, "this.ptpeolename2");
      data.append("accompanypeople", that.ptpeolename2);
      reason = JSON.stringify(reason);
      console.log(reason);
      data.append("reason", reason);
      let a = false;
      let b = false;
      //判断是否有接待对象
      this.dynamicValidateForm.reception_object.forEach((item, index) => {
        console.log(item);
        if (item.uid === "" || item.object === "" || item.duty === "") {
          a = false;
        } else {
          a = true;
        }
        console.log(a, "22222222222222222222222222222222222222222222");
      });
      //判断是否有部门主任 分管副秘书长 秘书长
      console.log(this.departmentn);
      console.log(this.secretarygeneral);
      console.log(this.branched);
      if (
        this.departmentn === "" ||
        this.secretarygeneral === "" ||
        this.branched === ""
      ) {
        b = false;
      } else {
        b = true;
      }
      console.log(b, "bb");
      if (a == true && b == true) {
        if (scope) {
          console.log(scope, "11111111111111111111111111111111111111111");
          this.$http.post("/job/confirm", data).then((res) => {
            console.log(res);
            if (res.data == true) {
              this.canclesubmit(1);
              this.OfficialRe();
              this.load1();
              this.wid = "";
              this.show1 = false;
              this.show2 = false;
            }
          });
        } else {
          console.log(scope, "11111111111111111111111111111111111111111");

          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$http.post("/job/or", data).then((res) => {
                console.log(res);
                if (res.data == true) {
                  this.load1();
                  this.canclesubmit(1);
                  this.OfficialRe();
                  this.wid = "";
                  this.show1 = false;
                  this.show2 = false;
                  console.log(this.departmentn, "部门主任");
                }
              });
            } else {
              this.$message("请填写完整信息");
              return false;
            }
          });
        }
      } else if (a == false && b == true) {
        this.$message("请填写完整接待对象");
      } else if (a == true && b == false) {
        this.$message("请选择完整审批人");
      } else if (a == false && b == false) {
        this.$message("请填写完整必填信息");
      }
      // console.log(that.recepiton.accompany);
      // console.log(this.mssecretarygeneral[this.secretarygeneral].username);
      // console.log(this.bmdepartmentn[this.departmentn].username);
      // console.log(this.fgbranched[this.branched].username);
    },
    canclesubmit(type) {
      this.$refs.newUpload1.fileList = [];
      this.fileListId = "";
      this.fileList = [];
      this.dialogFormVisible = false;
      this.secretarygeneral = "";
      this.departmentn = "";
      this.branched = "";
      this.recepiton = {
        name: "",
        site: "",
        date1: "",
        date2: "",
        free: "",
        accompany: [],
        reamrk1: "",
        reamrk2: "",
        reamrk3: "",
      };
      this.dynamicValidateForm = {
        reception_object: [
          {
            unit: "",
            object: "",
            duty: "",
          },
        ],
      };
      this.$refs.recepiton.resetFields();
      console.log(this.$refs.recepiton, "sadasdasd");
      if (type == 1) {
        this.$message({
          message: "提交成功",
          type: "success",
        });
      }
      if (type == 2) {
        this.show1 = false;
        this.show2 = false;
      }
    },
    sureform() {
      this.showdata = true;
      this.show1 = false;
      this.show2 = false;
      this.$refs.newUpload1.fileList = [];
      this.fileList = [];
      this.dialogFormVisible = false;
      this.canclesubmit();
      this.wid = "";
    },

    //详情展示页的确定
    submit_confirm() {
      this.dialogFormVisible = false;
      this.$refs.user.resetFields();
      this.$refs.newUpload.fileList = [];
      this.fileList = [];
      this.clear_f(this.user);
    },

    beforeRemove(file, fileList) {
      return this.$confirm(`Cancel the transfert of ${file.name} ?`);
    },
    day_num(type) {
      if (type % 0.5 != 0) {
        this.$message({
          type: "error",
          message: "最小单位为0.5的整数倍",
        });
        this.user.qjtime = "";
      }
    },
    handleReload() {
      this.reload(); // 在想要刷新页面的时候调用reload方法
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
          if (
            item.match("agent1") ||
            item.match("status1") ||
            item.match("reamrk1")
          ) {
            this.$set(this.agent1_sum, item, res.data[item]);
          }
          if (
            item.match("agent2") ||
            item.match("status2") ||
            item.match("reamrk2")
          ) {
            this.$set(this.agent2_sum, item, res.data[item]);
          }
          if (
            item.match("agent3") ||
            item.match("status3") ||
            item.match("reamrk3")
          ) {
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

    apply(n, y) {
      // let that = this;
      ////sessionStorage.setItem("username", this.username);

      if (n == 1) {
        this.Upload_showdisable = true;
        this.dialogFormVisible = true;
        console.log(this.username);
        this.showlist1 = false;
        this.showlist2 = true;
        this.details = false;
        this.showdata2 = false;
        this.showdata3 = true;
        this.OnBusiness_title = "公务接待申请";
        this.formdata();
        this.formdata1();
        this.formdata2();
        this.formdata3();
      }
      if (n == 2) {
        this.Upload_showdisable = true;
        this.dialogFormVisible = true;
        let data = new FormData();
        data.append("fid", y.fids);
        this.$http.post("/ac/gbf", data).then((res) => {
          this.fileList = [];
          console.log(res.data);
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
          this.$refs.newUpload1.fileList = this.fileList;
          console.log(this.urls, "图片列表内容");
          this.tupianjiazai = true
            ? this.fileList.length == 0
            : this.fileList.length !== 0;
        });
        this.showdata = true;
        this.showdata2 = true;
        this.showdata3 = false;
        this.modifyANDview(y);
        console.log(this.dynamicValidateForm.reception_object);
        console.log(this.departmentn, "部门主任");
        console.log(this.secretarygeneral);
        console.log(this.branched);
        console.log(this.recepiton);
        console.log(this.bmdepartmentn);

        // this.OfficialRe();
      }
      if (n == 3) {
        console.log(y);
        // this.removeDATA(y);
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.removeDATA(y);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
        // this.dialogVisible_delete = true;
      }
      if (n == 4) {
        let data = new FormData();
        data.append("fid", y.fids);
        this.$http.post("/ac/gbf", data).then((res) => {
          this.fileList = [];
          console.log(res.data);
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
          this.$refs.newUpload1.fileList = this.fileList;
          console.log(
            this.$refs.newUpload1.fileList,
            "this.$refs.newUpload1.fileList"
          );
        });
        this.Upload_showdisable = false;
        this.dialogFormVisible = true;
        this.showdata = false;
        this.showdata2 = false;
        this.showdata3 = false;
        console.log(y);
        this.modifyANDview(y);
      }
      if (n == 5) {
        let data = new FormData();
        data.append("w", y.wid);
        this.$http({
          url: "/job/eor",
          method: "post",
          data: data,
          responseType: "blob",
        }).then((res) => {
          console.log(res);
          if (res.headers["content-disposition"]) {
            var fileName = res.headers["content-disposition"]
              .split(";")[1]
              .split("fileName=")[1];
            console.log(fileName, "11111111111111111111111111111");
            // var fileNameUnicode = res.headers["content - disposition"].split(
            //   "fileName="
            // )[1];
          }
          this.download(res, fileName);
          // console.log(fileName, "asdada");
        });
      }
      if (n == 6) {
        this.dialogVisible_file = true;
      }
    },
    // 下载模板文件
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
      console.log(link);
    },
    //修改查看
    modifyANDview(y) {
      var that = this;
      console.log(y);
      this.wid = y.wid;
      console.log(this.bmdepartmentn);
      this.bmdepartmentn.forEach(function (item, index) {
        if (y.agent1 == item.uid) {
          that.departmentn = item.username;
        }
      });
      if (y.agent2) {
        this.show1 = true;
        this.fgbranched.forEach(function (event, i) {
          if (y.agent2 == event.uid) {
            that.branched = event.username;
          }
        });
      }
      if (y.agent3) {
        this.show2 = true;
        this.mssecretarygeneral.forEach(function (v, key) {
          if (y.agent3 == v.uid) {
            that.secretarygeneral = v.username;
          }
        });
      }

      let accompany = y.accompanypeople.split(",");
      console.log(accompany);
      this.recepiton = {
        name: y.agent5,
        site: y.leaveaddr,
        date1: y.uptime,
        date2: y.downtime,
        free: y.reamrk5,
        accompany: accompany,
        reamrk1: y.reamrk1,
        reamrk2: y.reamrk2,
        reamrk3: y.reamrk3,
      };
      let reason = JSON.parse(y.reason);

      this.dynamicValidateForm = {
        reception_object: [],
      };
      reason.forEach(function (item, index) {
        that.dynamicValidateForm.reception_object.push(item);
      });
    },
    //刪除
    removeDATA(y) {
      let data = new FormData();
      data.append("id", y.wid);
      this.$http.post("/job/d", data).then((res) => {
        console.log(res);
        this.OfficialRe();
      });
    },
    //附件上传
    fileupload(x, y) {
      console.log(x);
      console.log(y);
    },
    load() {
      let data = new FormData();
      this.$http.post("/job/oll", data).then((res) => {
        this.tableData = res.data;
        console.log(res, "oll");
        console.log(res.data[0].createTime);
        console.log(typeof res.data[0].createTime);
      });
    },
  },
  mounted() {
    let a = JSON.parse(sessionStorage.getItem("a"));
    console.log(a);
    for (let item of a) {
      if (item == "191") this.menu.push({ name: "接待申请", id: "191" });
      if (item == "192") this.menu.push({ name: "接待审批", id: "192" });
    }
    // this.load_people1();
    // this.user_select();
    // let float = sessionStorage.getItem("float");
    // this.float = JSON.parse(float);
    // this.activeIndex = this.float.menu_index;
    // // console.log(this.float,'this.float');
    // this.load();
    this.OfficialRe();
    this.formdata();
    this.formdata1();
    this.formdata2();
    this.formdata3();
    this.load1();
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name == "information") {
        vm.handleSelect("192");
      } else {
        vm.handleSelect(vm.menu[0].id);
      }
    });
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
.color_red {
  color: red;
}
.color_green {
  color: green;
}
.color_blue {
  color: blue;
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
  min-width: 1450px !important;
  display: flex;
  justify-content: start;
  flex-wrap: nowrap;
  padding: 1.7% 2.1%;
  margin-top: 7px;
  min-width: 500px;
}
.table_top1 {
  min-width: 1500px !important;
  display: flex;
  justify-content: start;
  flex-wrap: nowrap;
  padding: 1.7% 2.1%;
  margin-top: 7px;
  min-width: 500px;
}
.table_top1 input {
  width: 460px;
  height: 27px;
  background: rgba(239, 239, 239, 1);
  border: 0;
  border-radius: 19px;
  margin-right: 43px;
  padding-left: 10px;
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
.fgms {
  padding-right: 0 !important;
  font-size: 13.5px !important;
}
.color_red {
  color: red;
}

.color_green {
  color: green;
}

.color_blue {
  color: blue;
}
</style>
