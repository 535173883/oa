<template>
  <!-- 加班 -->
  <div class="OnBusiness">
    <div class="content">
      <div class="table_top">
        <!-- <input type="text" v-model="content1_v" placeholder="搜索事由"> -->
        <div>
          <span>加班开始时间：</span>
          <el-date-picker type="datetime" placeholder="开始时间" v-model="search.uptime"></el-date-picker>&#8195;
          <el-date-picker type="datetime" placeholder="结束时间" v-model="search.downtime"></el-date-picker>&#8195;
          <el-button icon="el-icon-search" type="primary" @click="load"></el-button>
          <el-button type="primary" @click="apply" v-has="71">申请</el-button>
        </div>
      </div>
      <el-table
        :data="
          tableData
            .filter(
              data =>
                !content1_v ||
                data.reason.toLowerCase().includes(content1_v.toLowerCase())
            )
            .slice(
              (this.currentPage1 - 1) * this.pageSize,
              this.currentPage1 * this.pageSize
            )
        "
        style="width: 95.8%;margin:0 2.1%;"
        align="center"
        border
        header-cell-class-name="t_h"
        height="500"
      >
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
        <el-table-column label="加班时长(时)" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.qjtime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="加班事由" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer">{{ scope.row.reason }}</span>
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
              :class="
                scope.row.result == 0
                  ? 'color_red'
                  : scope.row.result == 1
                  ? 'color_green'
                  : 'color_blue'
              "
            >{{ scope.row.result | ownstatus_f }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <span style="color:#3399FF" @click="overtime_xq(scope.row)">详情</span>
              <span style="color:#3399FF" @click="download_biaoge(scope.row)">下载</span>
              <!-- <span style="color:#3399FF">倒休</span> -->
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
                data.reason.toLowerCase().includes(content1_v.toLowerCase())
            ).length
          "
        ></el-pagination>
      </div>

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
              <span style="color:green" v-if="Boolean(item[Object.keys(item)[1]])">✔️</span>
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
          <el-button style="margin-left:30px;" @click="(isprocess = false), reload()">关闭</el-button>
        </span>
      </el-dialog>

      <!-- <div class="process" v-if="isprocess">
        <div class="circle">
          <span>申请人</span>
          <span>{{tableData[num].uname}}</span>
        </div>
        <div class="double" v-if="tableData[num].agent1">
          <div>
            <span :class="{'pass':tableData[num].status1==1 ,'nopass':tableData[num].status1==2}" v-if="tableData[num].status1==1">√</span>
            <span :class="{'pass':tableData[num].status1==1 ,'nopass':tableData[num].status1==2}" v-if="tableData[num].status1==2">X</span>
            <span>————</span>
          </div>
          <div class="circle">
            <span>领导{{tableData[num].agent1}}</span>
            <span :class="{'pass':tableData[num].status1==1 ,'nopass':tableData[num].status1==2}">{{tableData[num].status1|status_f}}</span>
          </div>
        </div>
        <div class="double" v-if="tableData[num].agent2">
          <div>
            <span :class="{'pass':tableData[num].status2==1 ,'nopass':tableData[num].status2==2}" v-if="tableData[num].status2==1">√</span>
            <span :class="{'pass':tableData[num].status2==1 ,'nopass':tableData[num].status2==2}" v-if="tableData[num].status2==2">X</span>
            <span>————</span>
          </div>
          <div class="circle">
            <span>领导{{tableData[num].agent2}}</span>
            <span :class="{'pass':tableData[num].status2==1 ,'nopass':tableData[num].status2==2}">{{tableData[num].status2|status_f}}</span>
          </div>
        </div>
        <div class="double" v-if="tableData[num].agent3">
          <div>
            <span :class="{'pass':tableData[num].status3==1 ,'nopass':tableData[num].status3==2}" v-if="tableData[num].status3==1">√</span>
            <span :class="{'pass':tableData[num].status3==1 ,'nopass':tableData[num].status3==2}" v-if="tableData[num].status3==2">X</span>
            <span>————</span>
          </div>
          <div class="circle">
            <span>领导{{tableData[num].agent3}}</span>
            <span :class="{'pass':tableData[num].status3==1 ,'nopass':tableData[num].status3==2}">{{tableData[num].status3|status_f}}</span>
          </div>
        </div>
        <div>
          <el-button style="margin-left:30px;" @click="isprocess=false">关闭</el-button>
        </div>
      </div>-->
      <!-- Form申请表单 -->
      <el-dialog
        title="加班申请"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        width="30%"
        :show-close="false"
      >
        <el-form :model="user" ref="user" :rules="rules" label-width="100px">
          <el-form-item label="开始时间：" :label-width="formLabelWidth" prop="uptime">
            <div class="block">
              <el-date-picker
                v-model="user.uptime"
                type="datetime"
                placeholder="选择日期时间"
                style="width:95%"
                default-time="8:00:00"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="结束时间：" :label-width="formLabelWidth" prop="downtime">
            <div class="block">
              <el-date-picker
                v-model="user.downtime"
                type="datetime"
                placeholder="选择日期时间"
                style="width:95%"
                default-time="8:00:00"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="加班时长(时)：" :label-width="formLabelWidth" prop="qjtime">
            <el-input v-model="user.qjtime" style="width:95%"></el-input>
          </el-form-item>
          <!-- <el-form-item label="加班人员：" :label-width="formLabelWidth" >
             <el-select v-model="user.people" placeholder="请选择" style="width:95%">
              <el-option
                v-for="item in this.user_data"
                :key="item.uid"
                :label="item.username"
                :value="item.uid"
               >
              </el-option>
            </el-select>
          </el-form-item>-->
          <!-- <el-form-item label="同行人员：" :label-width="formLabelWidth" >
            <el-select v-model="user.with_people" placeholder="请选择" multiple style="width:95%">
              <el-option
                v-for="item in this.user_data"
                :key="item.uid"
                :label="item.username"
                :value="item.uid"
               >
              </el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="加班地点：" :label-width="formLabelWidth" prop="leaveaddr">
            <el-input v-model="user.leaveaddr" style="width:95%"></el-input>
          </el-form-item>
          <el-form-item label="加班事由：" :label-width="formLabelWidth" prop="reason">
            <textarea v-model="user.reason" cols="30" rows="10" style="width:95%"></textarea>
          </el-form-item>
          <!-- <el-form-item label="备注：" :label-width="formLabelWidth" prop="remark">
            <el-input v-model="user.remark" style="width:95%"></el-input>
          </el-form-item>-->
          <el-form-item label="部门审批：" :label-width="formLabelWidth" prop="agent1">
            <el-select
              v-model="user.agent1"
              placeholder="请选择"
              style="width:95%"
              clearable
              @change="department"
            >
              <el-option
                v-for="item in allpeople1"
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
          <el-form-item label="分管秘书长：" :label-width="formLabelWidth" prop="agent2" v-show="show1">
            <el-select
              v-model="user.agent2"
              placeholder="请选择"
              style="width:95%"
              clearable
              @change="branched"
            >
              <el-option
                v-for="item in allpeople2"
                :key="item.uid"
                :label="item.username"
                :value="item.uid"
                :disabled="
                  (user.agent1 == item.uid && user.agent1 !== '') ||
                    (user.agent3 == item.uid && user.agent3 !== '')
                "
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="秘书长：" :label-width="formLabelWidth" prop="agent3" v-show="show2">
            <el-select v-model="user.agent3" placeholder="请选择" style="width:95%" clearable>
              <el-option
                v-for="item in allpeople3"
                :key="item.uid"
                :label="item.username"
                :value="item.uid"
                :disabled="
                  (user.agent1 == item.uid && user.agent1 !== '') ||
                    (user.agent3 == item.uid && user.agent3 !== '')
                "
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="抄送人：" :label-width="formLabelWidth" prop="cclist">
            <el-select v-model="user.cclist" placeholder="请选择" style="width:95%" clearable multiple>
              <el-option
                v-for="item in allpeople4"
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
          <el-form-item label="加班补休方式：" :label-width="formLabelWidth" style="text-align:left">
            <el-radio v-model="radio" label="1">加班费</el-radio>
            <el-radio v-model="radio" label="2">倒休</el-radio>
          </el-form-item>
          <el-form-item
            label="上传附件："
            :label-width="formLabelWidth"
            prop="mid"
            style="text-align: left;"
          >
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
            </el-upload>-->
            <newUpload ref="newUpload" :Upload_showdisable="Upload_showdisable"></newUpload>
          </el-form-item>
          <!-- <el-form-item label="审批人三：" :label-width="formLabelWidth">
            <el-select v-model="user.agent3" placeholder="请选择" style="width:95%">
              <el-option
                v-for="item in allpeople3"
                :key="item.uid"
                :label="item.username"
                :value="item.uid"
                :disabled="user.agent1==item.uid&&user.agent1!==''||user.agent2==item.uid&&user.agent2!==''">
              </el-option>
            </el-select>
          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="submit_cancel('user')" style="width: 120px;">取 消</el-button>
          <el-button type="primary" @click="submit('user')" style="width: 120px;">提 交</el-button>
        </div>
      </el-dialog>
      <!-- 加班详情弹窗 -->
      <el-dialog
        :visible.sync="dialogFormVisible1"
        title="加班详情"
        :close-on-click-modal="false"
        width="30%"
        :show-close="false"
      >
        <el-form :model="user1" ref="user1" label-width="100px" disabled>
          <el-form-item label="开始时间：" :label-width="formLabelWidth" prop="uptime">
            <div class="block">
              <el-date-picker
                v-model="user1.uptime"
                type="datetime"
                placeholder="选择日期时间"
                style="width:95%"
                default-time="8:00:00"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="结束时间：" :label-width="formLabelWidth" prop="downtime">
            <div class="block">
              <el-date-picker
                v-model="user1.downtime"
                type="datetime"
                placeholder="选择日期时间"
                style="width:95%"
                default-time="8:00:00"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="加班时长(时)：" :label-width="formLabelWidth" prop="qjtime">
            <el-input v-model="user1.qjtime" style="width:95%"></el-input>
          </el-form-item>
          <el-form-item label="加班地点：" :label-width="formLabelWidth" prop="leaveaddr">
            <el-input v-model="user1.leaveaddr" style="width:95%"></el-input>
          </el-form-item>
          <el-form-item label="加班事由：" :label-width="formLabelWidth" prop="reason">
            <textarea v-model="user1.reason" cols="30" rows="10" style="width:95%"></textarea>
          </el-form-item>
          <!-- <el-form-item label="备注：" :label-width="formLabelWidth" prop="remark">
            <el-input v-model="user1.remark" style="width:95%"></el-input>
          </el-form-item>-->
          <el-form-item label="部门审批：" :label-width="formLabelWidth" prop="agent1">
            <el-select v-model="user1.agent1" placeholder="请选择" style="width:95%">
              <el-option
                v-for="item in allpeople1"
                :key="item.uid"
                :label="item.username"
                :value="item.uid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="审批意见："
            :label-width="formLabelWidth"
            v-if="user1.reamrk1"
            prop="leaveaddr"
          >
            <el-input v-model="user1.reamrk1" style="width:95%"></el-input>
          </el-form-item>
          <el-form-item
            label="分管秘书长："
            :label-width="formLabelWidth"
            prop="agent2"
            v-if="user1.agent2"
          >
            <el-select v-model="user1.agent2" style="width:95%">
              <el-option
                v-for="item in allpeople2"
                :key="item.uid"
                :label="item.username"
                :value="item.uid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="审批意见："
            :label-width="formLabelWidth"
            prop="leaveaddr"
            v-if="user1.reamrk2"
          >
            <el-input v-model="user1.leaveaddr" style="width:95%"></el-input>
          </el-form-item>
          <el-form-item
            label="秘书长："
            :label-width="formLabelWidth"
            prop="agent3"
            v-if="user1.agent3"
          >
            <el-select v-model="user1.agent3" style="width:95%">
              <el-option
                v-for="item in allpeople3"
                :key="item.uid"
                :label="item.username"
                :value="item.uid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="审批意见："
            :label-width="formLabelWidth"
            v-if="user1.reamrk3"
            prop="leaveaddr"
          >
            <el-input v-model="user1.leaveaddr" style="width:95%"></el-input>
          </el-form-item>
          <el-form-item label="抄送人：" :label-width="formLabelWidth" prop="cclist">
            <el-select v-model="user1.cclist" style="width:95%" multiple>
              <el-option
                v-for="item in allpeople4"
                :key="item.uid"
                :label="item.username"
                :value="item.uid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="加班补休方式：" :label-width="formLabelWidth" style="text-align:left">
            <el-radio v-model="radio" label="1">加班费</el-radio>
            <el-radio v-model="radio" label="2">倒休</el-radio>
          </el-form-item>
          <el-form-item
            label="附件："
            :label-width="formLabelWidth"
            prop="mid"
            style="text-align: left;"
          >
            <newUpload ref="newUpload1" :Upload_showdisable="Upload_showdisable"></newUpload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submit_cancel1('user1')" style="width: 120px;">关 闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import newUpload from "./newUpload.vue";
export default {
  inject: ["reload"],
  name: "overtime",
  components: { newUpload },
  data() {
    return {
      Upload_showdisable: false,
      search: {
        uptime: "",
        downtime: "",
      },
      radio: "2",
      show1: false,
      show2: false,
      pageSize: 10,
      currentPage1: 1,
      content1_v: "",
      rules: {
        uptime: [
          { required: true, message: "请选择开始日期时间", trigger: "change" },
        ],
        downtime: [
          { required: true, message: "请选择结束日期时间", trigger: "change" },
        ],
        day: [{ required: true, message: "请输入加班时长", trigger: "change" }],
        qjtime: [
          { required: true, message: "请输入加班时长", trigger: "change" },
        ],
        reason: [
          { required: true, message: "请输入加班原因", trigger: "change" },
        ],
        agent1: [
          { required: true, message: "审批人不得为空", trigger: "change" },
        ],
        xhduty: [
          { required: true, message: "请输入协会职务", trigger: "change" },
        ],
        fulldata: [
          { required: true, message: "请输入协会职务", trigger: "change" },
        ],
        cclist: [{ required: false, message: "请选择抄送人", trigger: "blur" }],
      },
      user_name: "",
      allpeople1: [],
      allpeople2: [],
      allpeople3: [],
      allpeople4: [],
      user_data: [],
      fileList: [], //上传附件
      content_v: "",
      isprocess: false,
      num: 0,
      float: [],
      activeIndex: "",
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
      agent1_sum: {},
      agent2_sum: {},
      agent3_sum: {},
      formLabelWidth: "120px",
      dialogFormVisible: false,
      user: {
        uptime: "",
        downtime: "",
        qjtime: "",
        leaveaddr: "",
        reason: "",
        remark: "",
        agent1: "",
        agent2: "",
        cclist: "",
      },
      user1: {
        cclist: [],
      },
      options: [],
      res: [],
      leader_1: [],
      respon: {
        res1: [],
        res2: [],
        res3: [],
      },
      fileListid: "",
      dialogFormVisible1: false,
    };
  },
  methods: {
    //详情展示
    overtime_xq(value) {
      this.user1 = JSON.parse(JSON.stringify(value));
      this.user1.agent2 = Number(value.agent2);
      this.user1.agent3 = Number(value.agent3);
      this.user1.agent1 = Number(value.agent1);
      this.user1.cclist = [];
      console.log(typeof this.user1.cclist);
      if (value.cclist) {
        for (let i of value.cclist.split(",")) {
          this.user1.cclist.push(Number(i));
        }
      }

      console.log(typeof value.cclist, value.cclist, "asdasdasd");
      let data = new FormData();
      this.fileList = [];
      data.append("fid", value.fids);
      this.$http.post("/ac/gbf", data).then((res) => {
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
          }
        }
        this.$refs.newUpload1.fileList = this.fileList;
      });
      this.Upload_showdisable = false;
      this.dialogFormVisible1 = true;
    },
    download_biaoge(value) {
      let data = new FormData();
      data.append("wid", value.wid);
      this.$http({
        url: "/job/ewo",
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
        }
        this.download(res, fileName);
      });
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
    department() {
      this.show1 = true;
    },
    branched() {
      this.show2 = true;
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
    handleReload() {
      this.reload(); // 在想要刷新页面的时候调用reload方法
    },
    submit_cancel(type) {
      this.dialogFormVisible = false;
      this.$refs.newUpload.fileList = [];
      this.fileList = [];
      this.$refs[type].resetFields();
      this.show1 = false;
      this.show2 = false;
    },
    submit_cancel1(type) {
      // this.user1.cclist = [];
      this.dialogFormVisible1 = false;
      this.$refs.newUpload1.fileList = [];
      this.fileList = [];
      this.$refs[type].resetFields();
      this.show1 = false;
      this.show2 = false;
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
    },
    apply() {
      this.show_submit = true;
      this.Upload_showdisable = true;
      this.dialogFormVisible = true;
      // let data=new FormData();
      // data.append("as",0)
      // this.$http.post("/job/ql",data).then(res => {
      //   this.options=res.data;
      //   console.log(this.options);
      // })
      // this.$http.post("/job/gul",data).then(res => {
      //  if(type==1)this.allpeople1 = res.data;
      //   if(type==2)this.allpeople2 = res.data;
      //   // if(type==3)this.allpeople3 = res.data;
      // })
    },
    load_people(type) {
      let data = new FormData();
      let t = sessionStorage.getItem("token");
      data.append("level", type);
      data.append("t", t);
      this.$http.post("/job/gul", data).then((res) => {
        // console.log(res)
        if (type == 1) this.allpeople1 = res.data;
        if (type == 2) this.allpeople2 = res.data;
        if (type == 3) this.allpeople3 = res.data;
        // if(type==3)this.allpeople3 = res.data;
        // this.allpeople = res.data
        // console.log(this.allpeople, "所有可选人");
        // console.log(this.options, "this.options");
      });
    },
    load_people1() {
      let data = new FormData();
      this.$http.post("/job/gul", data).then((res) => {
        console.log(res.data, "所有人员");
        this.allpeople4 = res.data;
      });
    },
    load_peoples() {
      for (var i = 1; i < 4; i++) {
        console.log(i, "数字");
        this.load_people(i);
      }
    },
    submit(formName) {
      console.log(this.user);
      let data = new FormData();
      for (let key in this.user) {
        if (this.user[key] != "" && this.user[key] != null)
          data.append(key, this.user[key]);
      }
      if (this.user["agent3"]) {
        this.user["lastagent"] = this.user["agent3"];
      } else if (this.user["agent2"]) {
        this.user["lastagent"] = this.user["agent2"];
      } else {
        this.user["lastagent"] = this.user["agent1"];
      }
      this.fileListid = "";
      for (const i of this.$refs.newUpload.fileList) {
        this.fileListid += Number(i.raw.fid) + ",";
      }
      this.fileListid = this.fileListid.substring(
        0,
        this.fileListid.lastIndexOf(",")
      );
      data.append("fids", this.fileListid);
      data.set("lastagent", this.user["lastagent"]);
      data.append("as", "5");
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("确认信息填写无误", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info",
          }).then(() => {
            this.$http
              .post("/job/add", data)
              .then((res) => {
                this.dialogFormVisible = false;
                this.fileListid = "";
                this.$refs.newUpload.fileList = [];
                this.$refs[formName].resetFields();
                this.load();
              })
              .catch((error) => {
                this.$message.error("提交失败");
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
    },
    load() {
      let data = new FormData();
      if (this.search.uptime) {
        data.append("uptime", this.search.uptime);
      }
      if (this.search.downtime) {
        data.append("uptime", this.search.downtime);
      }
      this.$http.post("/job/ot", data).then((res) => {
        this.tableData = res.data;
        console.log(res, "oll");
      });
    },
  },
  mounted() {
    this.load_people1();
    this.load_peoples();
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
  display: -webkit-box;

  /* display: flex; */
  flex-direction: row-reverse;
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
