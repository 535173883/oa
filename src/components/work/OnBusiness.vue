<template>
  <!-- 出差 -->
  <div class="OnBusiness">
    <div class="content">
      <div class="table_top">
        <!-- <input type="text" v-model="content_v" placeholder="搜索申请人姓名"> -->

        <span style="line-height: 31px;">出差地点：</span>
        <el-select v-model="search.place" placeholder="请选择" clearable style="width:120px">
          <el-option
            v-for="item in ccplace"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>&#8195;
        <span style="line-height: 31px;">具体地点：</span>
        <el-input v-model="search.jtplace" style="width: 125px;"></el-input>&#8195;
        <span style="line-height: 31px;">出差开始时间：</span>
        <el-date-picker type="date" placeholder="开始时间" v-model="search.uptime" style="width:10%"></el-date-picker>&#8195;
        <el-date-picker type="date" placeholder="结束时间" v-model="search.downtime" style="width:10%"></el-date-picker>&#8195;
        <el-button icon="el-icon-search" type="primary" @click="load"></el-button>
        <el-button type="primary" @click="apply(1)" v-has="71">申请</el-button>
      </div>
      <el-table
        :data="
          tableData
            .filter(
              data =>
                !content_v ||
                data.uname.toLowerCase().includes(content_v.toLowerCase())
            )
            .slice(
              (this.currentPage1 - 1) * this.pageSize,
              this.currentPage1 * this.pageSize
            )
        "
        style="width: 95.8%;margin:0 2.1%;height:500px;overflow:auto"
        align="center"
        border
        header-cell-class-name="t_h"
      >
        <el-table-column label="出差申请人" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.uname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出差事由" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer">{{ scope.row.reason }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" align="center" width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.uptime | time_t }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center" width="110">
          <template slot-scope="scope">
            <span>
              {{
              scope.row.downtime || scope.row.estimateendtime | time_t
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="出差时长(天)" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.qjtime || scope.row.estimateupdays }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出差地点" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer">{{ scope.row.c }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="出差事由"
          align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.reason }}</span>
          </template>
        </el-table-column>-->

        <el-table-column label="同行人员" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer">{{ scope.row.accompanypeople }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审批进程" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <span style="color:#3399FF" @click="handleEdit(scope.row.wid)" v-has="72">查看</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span
              v-if="scope.row.isconfirm"
              :class="
                scope.row.result == 0
                  ? 'color_red'
                  : scope.row.result == 1
                  ? 'color_green'
                  : 'color_blue'
              "
            >{{ scope.row.result | ownstatus_f }}</span>
            <span class="color_red" v-if="!scope.row.isconfirm">未确认</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <div class="operation">
              <span
                style="color:#3399FF"
                @click="apply(2, scope.row)"
                v-if="scope.row.isconfirm !== 1"
              >出差确认</span>
              <span
                style="color:#3399FF"
                @click="handleover(scope.row.wid, scope.row.uptime, scope.row)"
                v-if="!scope.row.downtime"
              >补充</span>
              <span style="color:#3399FF" @click="apply(3, scope.row)">详情</span>
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
          :total="
            tableData.filter(
              data =>
                !content1_v ||
                data.uname.toLowerCase().includes(content_v.toLowerCase())
            ).length
          "
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
              <span>{{ user_name }}</span>
            </div>
          </li>
          <li style="display:inline-block" v-for="(item, index) in leader_1" :key="index + 1">
            <div style="display:inline-block" v-if="Boolean(item[Object.keys(item)[0]])">
              <span>--</span>
              <span style="color:red" v-if="!Boolean(item[Object.keys(item)[1]])">X</span>
              <span v-if="Boolean(item[Object.keys(item)[1]])">✔️</span>
              <span>--</span>
            </div>
            <div class="yuanxing" v-if="Boolean(item[Object.keys(item)[0]])">
              <span>{{ leader_name2(item[`agent${index + 1}`]) }}</span>
              <br />
              <span>
                {{
                leader_name(
                item[`status${index + 1}`],
                item[`reamrk${index + 1}`]
                )
                }}
              </span>
            </div>
          </li>
        </ul>
        <span>
          <el-button style="margin-left:30px;width:120px" @click="(isprocess = false), reload()">关闭</el-button>
          <!-- <el-button type="primary" style="margin-left:30px;" @click="isprocess=false,reload()">查看原因</el-button> -->
        </span>
      </el-dialog>

     
      <!-- Form申请表单 -->
      <el-dialog
        :title="OnBusiness_title"
        width="30%"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        @close="close_xq"
      >
        <el-form
          :data="user"
          :model="user"
          ref="user"
          :rules="rules"
          label-width="130px"
          :disabled="details"
        >
          <el-form-item label="开始时间：" prop="uptime">
            <div class="block">
              <el-date-picker
                v-model="user.uptime"
                type="date"
                placeholder="选择日期时间"
                style="width:95%"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item v-show="showlist2" label="预计结束时间：" prop="estimateendtime">
            <div class="block">
              <el-date-picker
                style="width:95%"
                v-model="user.estimateendtime"
                type="date"
                placeholder="选择日期时间"
                @change="travel_apply"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item v-show="showlist1" label="实际结束时间：" prop="downtime">
            <div class="block">
              <el-date-picker
                style="width:95%"
                v-model="user.downtime"
                type="date"
                placeholder="选择日期时间"
              ></el-date-picker>
            </div>
          </el-form-item>

          <el-form-item v-show="showlist2" label="预计出差天数：" prop="estimateupdays">
            <el-input v-model="user.estimateupdays" style="width:95%"></el-input>
          </el-form-item>

          <el-form-item v-show="showlist1" label="实际出差天数：" prop="qjtime">
            <el-input
              v-model="user.qjtime"
              placeholder="最小单位为0.5(半天)"
              @change="day_num(user.qjtime)"
              style="width:95%"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="出差人员：" :label-width="formLabelWidth" prop="people" >
             <el-select v-model="user.people" placeholder="请选择" style="width:95%" clearable>
              <el-option
                v-for="item in this.user_data"
                :key="item.uid"
                :label="item.username"
                :value="item.uid"
               >
              </el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="出差人员：" prop="accompanypeople">
            <!-- <el-input v-model="user.leaveaddr" style="width:95%"></el-input> -->
            <!-- Travel -->
            <el-select
              filterable
              v-model="user.accompanypeople"
              placeholder="请选择"
              multiple
              style="width:95%"
              user
              clearable
            >
              <el-option
                v-for="item in this.user_data"
                :key="item.uid"
                :label="item.username"
                :value="item.username"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出差地点：" prop="leaveaddrtype">
            <el-select v-model="user.leaveaddrtype" placeholder="请选择出差地点" style="width:95%">
              <el-option label="国内" value="0"></el-option>
              <el-option label="国外" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="具体地点：" prop="leaveaddr">
            <el-input v-model="user.leaveaddr" style="width:95%"></el-input>
          </el-form-item>
          <el-form-item label="出差事由：" prop="reason">
            <el-input v-model="user.reason" type="textarea" style="width:95%"></el-input>
            <!-- <el-input type="textarea" v-model="ruleForm.desc"></el-input> -->
            <!-- <textarea v-model="user.reason" name="" id="" cols="30" rows="10" style="width:95%"></textarea> -->
          </el-form-item>
          <!-- <el-form-item label="备注：" :label-width="formLabelWidth" prop="remark">
            <el-input v-model="user.remark" style="width:95%"></el-input>
          </el-form-item>-->
          <el-form-item label="审批人：" prop="agent1">
            <el-select v-model="user.agent1" placeholder style="width:95%" clearable filterable>
              <el-option
                v-for="item in busin_peole"
                :key="item.uid"
                :label="item.username"
                :value="item.uid"
                :disabled="
                  (user.agent2 == item.uid && user.agent2 !== '') ||
                    (user.agent3 == item.uid && user.agent3 !== '')
                "
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核意见： " prop="reamrk1" v-show="user.reamrk1">
            <el-input v-model="user.reamrk1" style="width:95%"></el-input>
          </el-form-item>
          <!-- <el-form-item label="抄送人：" :label-width="formLabelWidth" prop="cclist">
            <el-select v-model="user.cclist" placeholder="请选择" style="width:95%" clearable multiple>
              <el-option
                v-for="item in allpeople4"
                :key="item.uid"
                :label="item.username"
                :value="item.uid"
              ></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="上传附件：" prop="mid" style="text-align: left;">
            <newUpload
              :Upload_showdisable="Upload_showdisable"
              :Upload_showdisable1="Upload_showdisable1"
              ref="newUpload"
            ></newUpload>
          </el-form-item>
          <el-form-item
            v-if="showlist1 && showlist2"
            label="补充材料："
            prop="pid"
            style="text-align: left;"
          >
            <newUpload ref="newUpload2" :Upload_showdisable="Upload_showdisable"></newUpload>
          </el-form-item>
          <!-- <el-form-item label="经办人2：" :label-width="formLabelWidth">
            <el-select v-model="user.agent2" placeholder="请选择">
              <el-option
                v-for="item in respon.res2"
                :key="item.uid"
                :label="item.username"
                :value="item.uid"
                :disabled="user.agent1==item.uid&&user.agent1!==''||user.agent3==item.uid&&user.agent3!==''">
              </el-option>
            </el-select>
          </el-form-item>-->
          <!-- <el-form-item label="经办人3：" :label-width="formLabelWidth">
            <el-select v-model="user.agent3" placeholder="请选择">
              <el-option
                v-for="item in respon.res3"
                :key="item.uid"
                :label="item.username"
                :value="item.uid"
                :disabled="user.agent1==item.uid&&user.agent1!==''||user.agent2==item.uid&&user.agent2!==''">
              </el-option>
            </el-select>
          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer" v-if="!details">
          <el-button @click="submit_canael()" style="width: 120px;">取 消</el-button>
          <el-button type="primary" @click="submit('user')" style="width: 120px;">提 交</el-button>
        </div>
        <div slot="footer" class="dialog-footer" v-if="details">
          <el-button type="primary" @click="submit_confirm()" style="width: 120px;">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 设置出差结束时间弹窗 -->
      <el-dialog
        title="设置出差结束时间"
        width="30%"
        :visible.sync="dialogFormVisible_1"
        :close-on-click-modal="false"
      >
        <el-form :data="user" :model="user" ref="user" label-width="100px">
          <el-form-item label="实际开始时间：" :label-width="formLabelWidth">
            <!-- <span>{{ this.chuchaiuptime }}</span> -->
            <div class="block">
              <el-date-picker style="width:95%" v-model="chuchaiuptime" type="date"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="预计结束时间：" :label-width="formLabelWidth" prop="estimateendtime">
            <div class="block">
              <el-date-picker style="width:95%" v-model="user.estimateendtime" type="date" disabled></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="实际结束时间：" :label-width="formLabelWidth" prop="estimateendtime">
            <div class="block">
              <el-date-picker
                style="width:95%"
                v-model="user.downtime"
                type="date"
                placeholder="选择日期时间"
                @blur="travel"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="实际出差天数：" :label-width="formLabelWidth" prop="qjtime">
            <el-input
              v-model="user.qjtime"
              placeholder="最小单位为0.5(半天)"
              @change="day_num(user.qjtime)"
              style="width:95%"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="补充材料："
            :label-width="formLabelWidth"
            prop="mid"
            style="text-align: left;"
          >
            <newUpload ref="newUpload1" :Upload_showdisable="Upload_showdisable"></newUpload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="submit_canael_time()" style="width: 120px;">取 消</el-button>
          <el-button type="primary" @click="submit_time('user')" style="width: 120px;">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import newUpload from "./newUpload.vue";
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
      fileListid: "",
      fileListid1: "",
      Upload_showdisable1: false,
      Upload_showdisable: true,
      ccplace: [
        {
          value: 0,
          label: "国内",
        },
        {
          value: 1,
          label: "国外",
        },
      ],
      search: {
        place: "",
        uptime: "",
        jtpalce: "",
        downtime: "",
      },
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
      currentPage1: 1,
      pageSize: 10, //每页条数
      rules: {
        estimateendtime: [
          { required: true, message: "请选择预计结束时间", trigger: "blur" },
        ],
        leaveaddrtype: [{ validator: checkagent2, trigger: "blur" }],
        cclist: [{ required: true, message: "请选择抄送人", trigger: "blur" }],
        uptime: [
          { required: true, message: "请选择开始日期时间", trigger: "blur" },
        ],
        downtime: [{ validator: checkagent3, trigger: "blur" }],
        day: [{ required: true, message: "请输入出差天数", trigger: "blur" }],
        accompanypeople: [
          {
            required: true,
            message: "请选择出差人员",
            trigger: "blur",
            type: "array",
          },
        ],
        qjtime: [
          { required: false, message: "请输入出差天数", trigger: "blur" },
        ],
        reason: [
          { required: true, message: "请输入出差事由", trigger: "blur" },
        ],
        cclist: [{ required: false, message: "请选择抄送人", trigger: "blur" }],
        agent1: [
          {
            validator: checkagent1,
            trigger: "blur",
          },
        ],

        // agent1: [
        //   { required: true, message: "审批人不得为空", trigger: "change" }
        // ],
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
      float: [],
      activeIndex: "",
      busin_peole: [],
      fileList: [], //上传附件
      fileList1: [],
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
        uptime: "",
        downtime: "",
        estimateupdays: "",
        estimateendtime: "",
        qjtime: "",
        people: "",
        accompanypeople: [],
        leaveaddr: "",
        reason: "",
        remark: "",
        agent1: "",
        leaveaddrtype: "0",
        place: "",
      },
      options: [],
      allpeople4: [],
      res: [],
      respon: {
        res1: [],
        res2: [],
        res3: [],
      },
      overTm: "",
    };
  },
  methods: {
    close_xq() {
      this.clear_f(this.user);
      this.$refs.newUpload.fileList = [];
    },
    //出差确认中天数计算
    travel_apply() {
      let time = this.user.uptime.getTime();
      console.log(time);
      let overtime = this.user.estimateendtime.getTime();
      console.log(overtime);
      if (overtime > time) {
        let aa = (overtime - time) / 86400000 + 1;
        this.user.estimateupdays = Math.ceil(aa);
      } else {
        this.user.estimateupdays = 0;
      }
      console.log(this.user.estimateupdays);
      console.log(this.user);
    },
    //修改中的出差天数
    travel() {
      //开始时间
      let time = this.chuchaiuptime;
      console.log(time);
      let overtime = this.user.downtime.getTime();
      //结束时间
      console.log(overtime);
      if (overtime > time) {
        let bb = (overtime - time) / 86400000 + 1;
        this.user.qjtime = Math.ceil(bb);
      } else {
        this.user.qjtime = 0;
      }
    },
    //详情展示页的确定
    submit_confirm() {
      this.dialogFormVisible = false;
      this.$refs.user.resetFields();
      this.$refs.newUpload.fileList = [];
      this.fileList = [];
      this.clear_f(this.user);
    },
    load_people1() {
      let data = new FormData();
      this.$http.post("/job/gul", data).then((res) => {
        console.log(res.data, "所有人员");
        this.allpeople4 = res.data;
      });
    },
    // 设置出差结束时间弹窗
    // "handleover(scope.row.wid,scope.row.uptime)"
    handleover(num, n, y) {
      this.user.downtime = y.estimateendtime;
      this.user.estimateendtime = y.estimateendtime;
      this.Upload_showdisable = true;
      this.$refs.newUpload1 = [];

      this.OnBusiness_downtime = 1;
      this.chucaitime = num;
      this.chuchaiuptime = n;
      let t = this.user.downtime;
      let q = n;
      console.log(t);
      console.log(q);
      if (t > q) {
        let a = (t - q) / 86400000 + 1;
        this.user.qjtime = Math.ceil(a);
      } else {
        this.user.qjtime = 0;
      }
      // 时间转化;
      // function formatDate(now) {
      //   var year = now.getFullYear(); //取得4位数的年份
      //   var month = now.getMonth() + 1; //取得日期中的月份，其中0表示1月，11表示12月
      //   if (month < 10) {
      //     month = "0" + month;
      //   }
      //   var date = now.getDate(); //返回日期月份中的天数（1到31）
      //   if (date < 10) {
      //     date = "0" + date;
      //   }
      //   return year + "-" + month + "-" + date;
      // }
      // var g = n; //定义一个时间戳变量
      // var d = new Date(g); //创建一个指定的日期对象
      // this.chuchaiuptime = formatDate(d);
      // console.log(formatDate(d));
      this.dialogFormVisible_1 = true;
      // let data = new FormData();
      // data.append("fid", y.fids);
      // this.$http.post("/ac/gbf", data).then(res => {
      //   for (var i = 0; i < res.data.length; i++)
      //     this.fileList.push({
      //       uid: res.data[i].fid,
      //       name: res.data[i].fname,
      //       url: "http://fas.intertion.cn:9111/group1/" + res.data[i].fpath
      //     });
      //   console.log(res.data, "图片数据");
      //   console.log(this.fileList);
      //   this.$refs.newUpload1.fileList = this.fileList;
      //   console.log(
      //     this.$refs.newUpload1.fileList,
      //     "this.$refs.newUpload1.fileList"
      //   );
      // });
    },
    // 设置出差结束时间弹窗确定
    submit_time(formName) {
      this.fileListid1 = "";
      console.log(this.$refs.newUpload1.fileList, "asdasdasdasd");
      if (this.$refs.newUpload1.fileList) {
        for (let i of this.$refs.newUpload1.fileList) {
          this.fileListid1 += i.raw.fid + ",";
          console.log(i, "sdasdasd");
        }
      }
      this.fileListid1 = this.fileListid1.substring(
        0,
        this.fileListid1.lastIndexOf(",")
      );
      let data = new FormData();
      this.user.estimateendtime = new Date(this.user.estimateendtime);
      for (let key in this.user) {
        if (this.user[key] != "" && this.user[key] != null)
          data.append(key, this.user[key]);
      }
      data.set("downtime", new Date(this.user.downtime));
      data.append("supplementfid", this.fileListid1);
      data.append("wid", this.chucaitime);
      console.log(this.user.fids);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("确认消息填写无误", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info",
          }).then(() => {
            this.$http
              .post("/job/setend", data)
              .then((res) => {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.dialogFormVisible = false;
                this.dialogFormVisible_1 = false;
                this.$refs.user.resetFields();
                this.OnBusiness_downtime = 0;
                this.fileList = [];
                this.load();
              })
              .catch((error) => {
                this.$message.error("提交失败");
                this.dialogFormVisible = false;
              });
            this.fileList = [];
            this.$refs.user.resetFields();
            this.OnBusiness_downtime = 0;
            this.dialogFormVisible_1 = false;
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
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `The limit is 3, you selected ${
          files.length
        } files this time, add up to ${files.length + fileList.length} totally`
      );
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
    leader_name(type, reason) {
      let message = "";
      console.log(reason, "输出一下reason");
      console.log(type, "输出一下type");
      if (type == null) {
        message = "未审核";
      } else if (type == "1" && reason != "null") {
        message = reason;
        // console.log(type == "1"&& reason!=null,"2222");
      } else if (type == "1" && reason == "null") {
        message = "已通过";
      } else if (type == "0" && reason != "null") {
        message = reason;
      } else if (type == "0" && reason == "null") {
        message = "未通过";
      } else {
        console.log("123213");
      }
      return message;
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
    chaxun() {
      let data = new FormData();
      data.append("as", 0);
      this.$http.post("/job/ql", data).then((res) => {
        this.options = res.data;
        console.log(this.options, "options");
      });
      this.$http.post("/job/gul", data).then((res) => {
        console.log(res, "出差");
        this.busin_peole = res.data;
      });
    },
    apply(n, y) {
      this.fileList = [];
      // let that = this;
      ////sessionStorage.setItem("username", this.username);
      this.dialogFormVisible = true;

      if (n == 1) {
        console.log(this.username);
        this.Upload_showdisable1 = false;
        this.showlist1 = false;
        this.showlist2 = true;
        this.user_stuate = 0;
        this.details = false;
        this.OnBusiness_title = "出差申请";
        this.user.accompanypeople = [sessionStorage.getItem("username")];
        this.Upload_showdisable = true;
        this.chaxun();
      } else if (n == 2) {
        console.log(y);
        this.Upload_showdisable1 = true;
        this.Upload_showdisable = true;
        this.showlist1 = false;
        this.showlist2 = true;
        this.user_stuate = 1;
        this.details = false;
        this.chaxun();
        this.OnBusiness_title = "出差确认";
        let a = JSON.parse(JSON.stringify(y));
        this.user = a;
        if (a.agent1 != null) {
          this.user.agent1 = Number(a.agent1);
        }
        let leavetime1 = "";
        let leavetime2 = "";
        console.log(a, 1111111111111111);
        this.user.accompanypeople = a.accompanypeople.split(",");
        //时间的转换
        this.user.uptime = new Date(a.uptime);
        if (a.createTime !== null) {
          this.user.createTime = new Date(a.createTime);
        }
        if (a.downtime !== null) {
          this.user.downtime = new Date(a.downtime);
        }
        if (a.estimateendtime !== null) {
          this.user.estimateendtime = new Date(a.estimateendtime);
        }

        console.log(this.user, "11111111111111111111111");
        console.log(typeof this.user.createTime);
        // y.accompanypeople = y.accompanypeople.split(",");
        // y.uptime = Date(y.uptime);
        // y.createtime = Date(y.createtime);
        // console.log(typeof y.uptime, y.uptime);
        // this.user = y;
        // console.log(y.fids, "fids");
        let data = new FormData();
        data.append("fid", this.user.fids);
        // data.set("createTime", new Date(this.user.uptime));
        // data.set("createTime", new Date(this.user.createTime));
        // data.set("createTime", new Date(this.user.downtime));
        this.$http.post("/ac/gbf", data).then((res) => {
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
          console.log(res.data, "图片数据");
          console.log(this.fileList, "124555");
          this.$refs.newUpload.fileList = this.fileList;
          console.log(
            this.$refs.newUpload.fileList,
            "this.$refs.newUpload.fileList"
          );
          for (var i of this.$refs.newUpload.fileList) {
            this.fileListid += Number(i.raw.fid) + ",";
          }
          console.log(this.fileListid, "this.$refs.newUpload.fileListid");
          //  this.$refs.newUpload.fileListid =  this.$refs.newUpload.fileListid
        });
      } else if (n == 3) {
        console.log(y);
        this.Upload_showdisable1 = false;
        this.Upload_showdisable = false;
        this.fileList1 = [];
        this.showlist1 = true;
        this.showlist2 = true;
        this.chaxun();
        this.OnBusiness_title = "详情展示";
        this.details = true;
        let a = JSON.parse(JSON.stringify(y));

        this.user = a;
        if (a.agent1 != null) {
          this.user.agent1 = Number(a.agent1);
        }
        this.user.accompanypeople = a.accompanypeople.split(",");
        var data = new FormData();
        data.append("fid", this.user.fids);
        this.$http.post("/ac/gbf", data).then((res) => {
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
          console.log(res.data, "图片数据");
          console.log(this.fileList);
          for (var i of this.$refs.newUpload.fileList) {
            this.fileListid += Number(i.raw.fid) + ",";
          }
          this.$refs.newUpload.fileList = this.fileList;
        });
        this.getmaterialscience();
      }
    },
    getmaterialscience() {
      var data = new FormData();
      data.append("fid", this.user.supplementfid);
      console.log(this.user.supplementfid);
      this.$http.post("/ac/gbf", data).then((res) => {
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
        console.log(res.data, "图片数据");
        console.log(this.fileList1);
        this.$refs.newUpload2.fileList = this.fileList1;
        console.log(this.$refs.newUpload2.fileList, "图片列表");
      });
    },
    submit_canael_time() {
      this.OnBusiness_downtime = 0;
      this.dialogFormVisible_1 = false;
      if (this.$refs.newUpload.fileList) {
        this.$refs.newUpload.fileList = [];
      }

      this.fileList = [];
      this.$refs.user.resetFields();
      this.clear_f(this.user);
    },
    submit_canael() {
      console.log(this.user);
      this.dialogFormVisible = false;
      this.$refs.user.resetFields();
      this.$refs.newUpload.fileList = [];
      this.$refs.newUpload2.fileList = [];
      this.clear_f(this.user);
      console.log(this.user);
      this.load();
    },
    submit(formName) {
      this.fileListid = "";
      for (const i of this.$refs.newUpload.fileList) {
        this.fileListid += i.raw.fid + ",";
      }
      if (this.user_stuate == 0) {
        //  for  (let i in this.$refs.newUpload.fileList){
        //  this.fileListid +=  i.raw.fid +","
        //  }
        let data = new FormData();
        for (let key in this.user) {
          if (this.user[key] != "" && this.user[key] != null)
            data.append(key, this.user[key]);
        }
        data.append("fids", this.fileListid);
        data.set("lastagent", this.user["agent1"]);
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm("确认消息填写无误", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "info",
            }).then(() => {
              this.$http
                .post("/job/ladd", data)
                .then((res) => {
                  this.dialogFormVisible = false;
                  this.$refs.user.resetFields();
                  this.clear_f(this.user);
                  this.$refs.newUpload.fileList = [];
                  this.load();
                })
                .catch((error) => {
                  this.$message.error("提交失败");
                  this.dialogFormVisible = false;
                  this.load();
                });
            });
          } else {
            //     alert("信息填写不规范或不完整");
            this.$alert("信息填写不规范或不完整", "提示", {
              confirmButtonText: "确定",
            });
            return false;
          }
        });
      } else if (this.user_stuate == 1) {
        let data = new FormData();
        for (let key in this.user) {
          if (this.user[key] != "" && this.user[key] != null)
            data.append(key, this.user[key]);
        }
        data.set("fids", this.fileListid);
        data.set("lastagent", this.user["agent1"]);
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm("确认消息填写无误", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "info",
            }).then(() => {
              this.$http
                .post("/job/confirm", data)
                .then((res) => {
                  this.dialogFormVisible = false;
                  this.$refs.user.resetFields();
                  this.$refs.newUpload.fileList = [];
                  this.load();
                })
                .catch((error) => {
                  this.$message.error("提交失败");
                  this.dialogFormVisible = false;
                  this.load();
                });
            });
          } else {
            //  alert("信息填写不规范或不完整");
            this.$alert("信息填写不规范或不完整", "提示", {
              confirmButtonText: "确定",
            });
            return false;
          }
        });
      }

      // console.log(this.user)

      // if(this.user['agent3']){
      //   this.user['lastagent']=this.user['agent3'];
      // }else if(this.user['agent2']){
      //   this.user['lastagent']=this.user['agent2'];
      // }else {
      //   this.user['lastagent']=this.user['agent1'];
      // }
      // data.append('agent1',this.user['agent1'])
    },
    load() {
      let data = new FormData();
      console.log(this.search.place);
      if (this.search.place === 0 || this.search.place == 1) {
        data.append("leaveaddrtype", this.search.place);
      }
      if (this.search.jtplace) {
        data.append("leaveaddr", this.search.jtplace);
      }
      if (this.search.uptime) {
        data.append("uptime", this.search.uptime);
      }
      if (this.search.downtime) {
        data.append("downtime", this.search.downtime);
      }
      this.$http.post("/job/oll", data).then((res) => {
        console.log(res);
        var a = "";
        var c = "";
        res.data.forEach(function (item, index) {
          if (item.leaveaddrtype == "0") {
            a = "国内";
          } else {
            a = "国外";
          }
          if (item.leaveaddr) {
            c = a + "/" + item.leaveaddr;
          } else {
            c = a;
          }
          item.c = c;
        });
        console.log(res.data, "111111111111111111111111");
        this.tableData = res.data;
        // if (
        //   res.data.downtime == null ||
        //   res.data.downtime == "" ||
        //   res.data.downtime == undefined
        // ) {
        //   this.tableData.downtime = res.data.estimateendtime;
        // }
        // if (
        //   res.data.qjtime == null ||
        //   res.data.qjtime == "" ||
        //   res.data.qjtime == undefined
        // ) {
        //   this.tableData.qjtime = res.data.estimateupdays;
        // }
        // console.log(res, "oll");
        // console.log(res.data[0].createTime);
        // console.log(typeof res.data[0].createTime);
      });
    },
  },
  mounted() {
    this.load_people1();
    this.user_select();
    let float = sessionStorage.getItem("float");
    this.float = JSON.parse(float);
    this.activeIndex = this.float.menu_index;
    // console.log(this.float,'this.float');
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
  display: flex;
  justify-content: left;
  min-width: 1200px;
  /* display: -webkit-box; */
  /* flex-direction: row-reverse; */
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
.ccsearch {
  display: -webkit-box;
}
</style>

