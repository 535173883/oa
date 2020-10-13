<template>
  <!-- 人事管理 -->
  <div class="User">
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

    <!-- 员工管理 -->
    <div class="content" v-show="activeIndex=='81'">
      <div class="table_top">
        <span style="line-height: 31px;">员工姓名 ：</span>
        <input type="text" v-model="content_v" placeholder="搜索员工姓名" style="width:100px;" />
        <span style="line-height: 31px;">政治面貌 ：</span>
        <el-select
          v-model="user_Political"
          @change="Political_filters()"
          placeholder="政治面貌"
          style="width:120px;margin-right:20px;"
          clearable
        >
          <el-option value="正式党员" label="正式党员"></el-option>
          <el-option value="预备党员" label="预备党员"></el-option>
          <el-option value="群众" label="群众"></el-option>
        </el-select>
        <span style="line-height: 31px;">职务 ：</span>
        <el-select
          v-model="user_job"
          @change="job_filters()"
          placeholder="选择职务"
          style="width:120px;margin-right:20px;"
          clearable
        >
          <el-option v-for="item in joblist" :key="item.did" :label="item.dname" :value="item.did"></el-option>
        </el-select>
        <!-- <span style="line-height: 31px;">政治面貌 ：</span>
        <el-select></el-select>-->
        <el-button style="float:right;margin-left:20px" type="primary" @click="addstaff()">添加</el-button>
        <!-- <el-button style="float:right" type="danger" @click="resetpassword()">重置密码</el-button>
        <el-button style="float:right" type="success" @click="resetvacation()">重置年假</el-button>-->
      </div>
      <el-table
        :data="tableData_yg.filter(data => !content_v || data.username.toLowerCase().includes(content_v.toLowerCase())).slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)"
        style="width: 95.8%;margin:0 2.1%;cursor:pointer;height:527px;overflow:auto"
        align="center"
        ref="tableData_yg"
        @selection-change="handleSelectionChange"
        @row-click="clickRow"
        row-key="uid"
        height="430"
        highlight-current-row
        border
        header-cell-class-name="t_h"
      >
        <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="身份证号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.identity }}</span>
          </template>
        </el-table-column>-->
        <!-- <el-table-column label="年龄" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.age }}</span>
          </template>
        </el-table-column>
        <el-table-column label="生日" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.birthdays | time_o }}</span>
          </template>
        </el-table-column>-->
        <!-- <el-table-column label="性别" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.sex }}</span>
          </template>
        </el-table-column>
        <el-table-column label="民族" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.nation }}</span>
          </template>
        </el-table-column>-->
        <el-table-column label="学历" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.education }}</span>
          </template>
        </el-table-column>
        <el-table-column label="政治面貌" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.politicsStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前职务" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.duty }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号：" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer">{{ scope.row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column label="住址" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.address }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="所属部门" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.department }}</span>
          </template>
        </el-table-column>-->

        <!-- <el-table-column label="登录账号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.mobile }}</span>
          </template>
        </el-table-column>-->

        <!-- <el-table-column label="邮箱" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.email }}</span>
          </template>
        </el-table-column>-->
        <el-table-column label="总年假(天)" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.annualleave }}</span>
          </template>
        </el-table-column>
        <el-table-column label="剩余年假(天)" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.remainannualleave }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="备注" align="center">
          <template slot-scope="scope" show-overflow-tooltip>
            <span style="text-decoration:underline;cursor:pointer">{{ scope.row.remark }}</span>
          </template>
        </el-table-column>-->
        <el-table-column label="操作" align="center" width="140">
          <template slot-scope="scope">
            <div class="operation">
              <!-- <el-button size="mini" type="text" @click.stop="distribute(scope.row.duty,scope.row.uid)" v-has="812">分配角色</el-button> -->
              <!-- <span style="color:#3399FF"
              @click.stop="distribute(scope.row.duty,scope.row.uid)" v-has="812">分配角色</span><br>-->
              <span style="color:#3399FF" @click.stop="handleEdit2( scope.row,1)">详情</span>
              <span style="color:#3399FF" @click.stop="handleEdit2( scope.row,0)">修改</span>
              <!-- <el-button type="text"  @click.stop="resetpassword(scope.row.uid)" v-has="813" >重置密码</el-button> -->
              <!-- <span style="color:#3399FF"
              @click.stop="resetpassword(scope.row.uid)" v-has="813" >重置密码</span>-->
              <!-- <el-button type="text"  @click.stop="resetpassword(scope.row.uid)" v-has="813" >重置密码</el-button> -->
              <!-- <el-button type="text"  @click.stop="resetvacation(scope.row.uid)" v-has="813" >重置年假</el-button> -->
              <!-- <span style="color:#3399FF"
              @click.stop="resetvacation(scope.row.uid)" v-has="813" >重置年假</span>-->
              <!-- <el-button size="mini" type="text" style="color:red" @click.stop="handleDelete1(scope.$index, scope.row)"  v-has="814" >删除</el-button> -->
              <span style="color:#FF5454" @click.stop="handleDelete1(scope.$index,scope.row)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <span class="demonstration">每页10条</span>
        <el-pagination
          :current-page.sync="currentPage"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="tableData_yg.filter(data => !content_v || data.username.toLowerCase().includes(content_v.toLowerCase())).length"
        ></el-pagination>
      </div>
    </div>
    <!-- 部门管理部分 -->
    <div class="content" v-show="activeIndex=='82'">
      <div class="table_top">
        <span style="line-height: 31px;">部门名称 ：</span>
        <input type="text" placeholder="搜索部门名称" v-model="content_d" style="width:150px;" />
        <el-button type="primary" @click="add_dep()" v-has="811">添加</el-button>
      </div>
      <el-table
        :data="dep_list.filter(data => !content_d || data.dname.toLowerCase().includes(content_d.toLowerCase())).slice((this.currentPage_2-1)*this.pageSize,this.currentPage_2*this.pageSize)"
        :model="dep_list"
        ref="dep_list"
        style="width: 95.8%;margin:0 2.1%;"
        align="center"
        border
        header-cell-class-name="t_h"
        height="430"
      >
        <el-table-column label="部门名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.dname }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="部门描述"
           align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>-->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <!-- <span style="color:#3399FF"
              @click="distribute(scope.row.uid)" v-has="822">分配</span>-->
              <!-- <span style="color:#67C23A"
              @click="user_fenpei(scope.row.rid)" v-has="823">分配权限</span>-->
              <span style="color:#3399FF" @click="dep_xiugai(scope.row.did)" v-has="812">修改</span>
              <span
                style="color:#FF5454"
                @click="dep_delete(scope.$index, scope.row)"
                v-has="813"
              >删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <span class="demonstration">每页10条</span>
        <el-pagination
          :current-page.sync="currentPage_2"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="dep_list.filter(data => !content_d || data.dname.toLowerCase().includes(content_d.toLowerCase())).length"
        ></el-pagination>
      </div>
    </div>
    <!-- 部门添加弹窗 -->
    <el-dialog
      :title="deptitle"
      :visible.sync="depwindow"
      width="30%"
      :close-on-click-modal="false"
      :show-close="false"
      center
    >
      <el-form label-width="100px" :data="depe" :model="depe" ref="depe" :rules="rules">
        <el-form-item label="部门名称：" prop="dname">
          <el-input v-model="depe.dname"></el-input>
        </el-form-item>
        <!-- <el-form-item label="角色描述："  prop="remark">
              <el-input  v-model="role.remark" ></el-input>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dep_cancel()" style="width: 120px;">取 消</el-button>
        <el-button type="primary" @click="dep_queding('depe')" style="width: 120px;">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 角色添加弹窗 -->
    <el-dialog
      :title="roletitle"
      :visible.sync="userwindow"
      width="30%"
      :close-on-click-modal="false"
      :show-close="false"
      center
      :modal-append-to-body="false"
    >
      <el-form label-width="100px" :data="role" :model="role" ref="role" :rules="rules">
        <el-form-item label="角色名称：" prop="roleName">
          <el-input v-model="role.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：" prop="remark">
          <el-input v-model="role.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="role_cancel()" style="width: 120px;">取 消</el-button>
        <el-button type="primary" @click="role_queding('role')" style="width: 120px;">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 员工添加弹窗 -->
    <el-dialog
      :title="staff_title"
      :visible.sync="dialogFormVisible_1"
      width="40%"
      stlye="min-width: 600px;"
      :close-on-click-modal="false"
      @close="dialogFormVisible_1_colse"
    >
      <el-form
        :data="user"
        :model="user"
        ref="user"
        :rules="rules"
        label-width="100px"
        :disabled="!user_ygshow"
      >
        <el-form-item label="姓名：" prop="username">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="身份证号：" prop="identity">
          <el-input v-model="user.identity"></el-input>
        </el-form-item>
        <el-form-item label="年龄：" prop="age">
          <el-input v-model="user.age"></el-input>
        </el-form-item>
        <el-form-item label="生日：" prop="birthday">
          <el-date-picker
            v-model="user.birthdays"
            type="date"
            placeholder="选择日期"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="性别：" prop="sex" style="text-align:left">
          <el-radio v-model="user.sex" label="男">男</el-radio>
          <el-radio v-model="user.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="民族：" prop="nation">
          <el-input v-model="user.nation"></el-input>
        </el-form-item>
        <el-form-item label="学历：" prop="education">
          <el-input v-model="user.education"></el-input>
        </el-form-item>
        <el-form-item label="政治面貌：" prop="politics_status" style="text-align:left">
          <el-radio v-model="user.politicsStatus" value="0" label="正式党员" border>正式党员</el-radio>
          <el-radio v-model="user.politicsStatus" value="1" label="预备党员" border>预备党员</el-radio>
          <el-radio v-model="user.politicsStatus" value="2" label="群众" border>群众</el-radio>
        </el-form-item>
        <el-form-item label="部门：" prop="department">
          <el-select v-model="user.department" placeholder="请选择" style="width:100%" multiple>
            <el-option
              v-for="item in this.depll"
              :key="item.did"
              :label="item.dname"
              :value="item.did"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="当前职务：" prop="duty">
          <el-select v-model="user.duty" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in joblist"
              :key="item.did"
              :label="item.dname"
              :value="item.did"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile">
          <el-input v-model="user.mobile"></el-input>
        </el-form-item>
        <el-form-item label="固定电话：" prop="telephone">
          <el-input v-model="user.telephone"></el-input>
        </el-form-item>
        <el-form-item label="家庭住址：" prop="address">
          <el-input v-model="user.address"></el-input>
        </el-form-item>
        <el-form-item label="入职时间：" prop="entryTime">
          <el-date-picker
            v-model="user.entryTimes"
            type="date"
            placeholder="选择日期"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="合同到期时间：" prop="end_time" style="text-align:left;" id="hetongend_time">
          <el-radio
            label="具体日期"
            border
            :value="1"
            @change="user_hetongtime = true"
            v-model="user.isDate"
          >具体日期</el-radio>
          <el-date-picker
            type="date"
            placeholder="选择日期"
            style="width:40%"
            v-show="user_hetongtime"
            v-model="user.endTimes"
            :value="user.endTimes"
          ></el-date-picker>
          <el-radio
            v-model="user.isDate"
            label="无固期"
            border
            :value="0"
            @change="user_hetongtime = false"
            style="margin-left:10px"
          >无固期</el-radio>
        </el-form-item>
        <el-form-item label="员工备案：" prop="empRecord" style="text-align:left">
          <el-radio v-model="user.empRecord" label="协会" border>协会</el-radio>
          <el-radio v-model="user.empRecord" label="中心" border>中心</el-radio>
        </el-form-item>
        <el-form-item label="任职时间：" prop="proTime">
          <el-date-picker v-model="user.proTimes" type="date" placeholder="选择日期" style="width:100%"></el-date-picker>
        </el-form-item>
        <el-form-item label="总年假(天)：" prop="annualleave" v-show="!user_ygshow">
          <el-input v-model="user.annualleave" disabled></el-input>
        </el-form-item>
        <el-form-item
          label="剩余年假(天)："
          prop="remainannualleave"
          label-width="106px"
          v-show="!user_ygshow"
        >
          <el-input v-model="user.remainannualleave" disabled></el-input>
        </el-form-item>
        <el-form-item label="职务工资：" prop="dutySalary">
          <el-input v-model="user.dutySalary"></el-input>
        </el-form-item>
        <el-form-item label="岗位工资：" prop="postSalary">
          <el-input v-model="user.postSalary"></el-input>
        </el-form-item>

        <!-- <el-form-item label="月份：" prop="month">
            <el-input v-model="user.month"></el-input>
          </el-form-item>

          <el-form-item label="人员类别：" prop="ptype">
            <el-input v-model="user.ptype"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="user.email"></el-input>
          </el-form-item>

          <el-form-item label="角色：" prop="utype">
            <el-select v-model="user.utype" placeholder="请选择" style="width:100%" multiple>
              <el-option
                v-for="item in user_list"
                :key="item.rid"
                :label="item.roleName"
                :value="item.rid"
              ></el-option>
            </el-select>
        </el-form-item>-->
        <!-- <el-form-item label="用户表示："  prop="flag">
            <el-input v-model="user.flag"></el-input>
        </el-form-item>-->
        <!-- <el-form-item label="帐号："  prop="accounts">
            <el-input v-model="user.accounts"></el-input>
          </el-form-item>
          <el-form-item label="用户类型："  prop="utype">
            <el-input v-model="user.utype"></el-input>
        </el-form-item>-->
        <!-- 
          <el-form-item label="总年假(天)：" prop="annualleave">
            <el-input v-model="user.annualleave"></el-input>
          </el-form-item>
        <el-form-item label="备注：" prop="remark">-->
        <!-- f -->
        <!-- <textarea v-model="user.remark" name id cols="30" rows="10" style="width:100%"></textarea>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel1('user')" v-show="user_ygshow" style="width: 120px;">取 消</el-button>
        <el-button type="primary" @click="submit('user')" style="width: 120px;">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  name: "User",
  data() {
    return {
      hetong_endtime1: "",
      hetong_endtime: "",
      user_Political: "",
      user_job: "",
      dialogFormVisible_1: false,
      staff_title: "",
      user_hetongtime: false,
      roletitle: "角色添加",
      deptitle: "部门添加",
      xiugai_status: 1,
      dep_status: 1,
      role: {
        name: "",
        remark: "",
      },
      depe: {
        dname: "",
      },
      user_duty: "",
      user_uid: "",
      quanxianwindows: false,
      userwindow: false,
      depwindow: false,
      user_title: "用户详情",
      rules: {
        identity: [
          { required: true, message: "请输入身份证", trigger: "blur" },
        ],
        entryTimes: [
          { required: true, message: "请输入入职时间", trigger: "blur" },
        ],
        username: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        workno: [{ required: true, message: "请输入工号", trigger: "blur" }],
        duty: [{ required: true, message: "请选择职务", trigger: "blur" }],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^[0-9]*$/,
            message: "请输入数字",
          },
        ],
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        utype: [{ required: true, message: "请分配角色信息", trigger: "blur" }],
        dname: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
        age: [
          { required: true, message: "请输入年龄", trigger: "blur" },
          {
            pattern: /^(?:[1-9][0-9]?|1[01][0-9]|120)$/,
            message: "年龄在1-120之间",
          },
        ],
        birthdays: [{ required: true, message: "请输入生日", trigger: "blur" }],
        sex: [{ required: true, message: "请输入性别", trigger: "blur" }],
        nation: [{ required: true, message: "请输入民族", trigger: "blur" }],
        education: [{ required: true, message: "请输入学历", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱号", trigger: "blur" },
          // {
          //   pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
          //   message: "请输入正确的邮箱号"
          // }
        ],
        // email: [
        //   { required: true, message: "请输入电子邮箱地址", trigger: "change" }
        // ],
        // department: [
        //   { required: true, message: "请输入部门信息", trigger: "change" }
        // ],
        // duty: [
        //   { required: true, message: "请输入职务信息", trigger: "change" }
        // ],
        flag: [
          { required: true, message: "请输入用户表示", trigger: "change" },
        ],
        accounts: [
          { required: true, message: "请输入账号信息", trigger: "change" },
        ],
        utype: [{ required: true, message: "请输入用户类型", trigger: "blur" }],
        // workno: [
        //   { required: true, message: "请输入工号信息", trigger: "change" }
        // ],
      },
      isphoto: true,
      menu: [],
      currentPage: 1, //当前页
      currentPage_1: 1, //角色管理页面
      currentPage_2: 1, //部门管理页面
      pageSize: 10, //每页条数
      content_v: "",
      content_i: "", //角色管理页面
      content_d: "", //部门管理页面
      float: [],
      activeIndex: "",
      tableData_yh: [],
      tableData_js: [],
      tableData_yg: [],
      depll: [],
      joblist: [],
      user_list: [],
      dep_list: [],
      fid: "",
      photoid: "",
      dialogFormVisible: false,
      xid: "",
      user: {
        empRecord: "",
        username: "",
        telephone: "",
        sex: "",
        proTimes: "",
        postSalary: "",
        nation: "",
        mobile: "",
        education: "",
        endTimes: "",
        entryTimes: "",
        identity: "",
        isDate: "",
        dutySalary: "",
        birthdays: "",
        age: "",
        address: "",
        politicsStatus: 2,
        utype: "",
        annualleave: "",
        remainannualleave: "",
        username: "",
        mobile: "",
        email: "",
        department: [],
        duty: "",
        workno: "",
        remark: "",
        birthday: "",
        education: "",
        politics_status: "",
        entryTime: "",
        end_time: "",
        proTime: "",
      },
      user_ygshow: "",
      multipleSelection: "",
      formLabelWidth: "100px",
      code: 0,
    };
  },
  methods: {
    dialogFormVisible_1_colse() {
      this.clear_f(this.user);
      this.$refs.user.resetFields();
    },
    endtime_filters() {
      let data = new FormData();
      let time = [];
      time.push(this.hetong_endtime);
      time.push(this.hetong_endtime1);
      data.append("time", time);
      data.append("name", this.content_v);
      data.append("duty", this.user_job);
      data.append("mm", this.user_Political);
      this.$http.post("/emp/sau", data).then((res) => {
        this.tableData_yg = res.data;
        console.log(res.data);
      });
    },
    job_filters() {
      let data = new FormData();
      let time = [];
      time.push(this.hetong_endtime);
      time.push(this.hetong_endtime1);
      data.append("time", time);
      data.append("name", this.content_v);
      data.append("duty", this.user_job);
      data.append("mm", this.user_Political);
      this.$http.post("/emp/sau", data).then((res) => {
        this.tableData_yg = res.data;
        console.log(res.data);
      });
    },
    Political_filters() {
      let data = new FormData();
      let time = [];
      time.push(this.hetong_endtime);
      time.push(this.hetong_endtime1);
      data.append("time", time);
      data.append("name", this.content_v);
      data.append("duty", this.user_job);
      data.append("mm", this.user_Political);
      this.$http.post("/emp/sau", data).then((res) => {
        this.tableData_yg = res.data;
        console.log(res.data);
      });
    },
    //员工添加取消
    cancel1(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible_1 = false;
    },
    reload1() {
      var data = new FormData();
      let t = sessionStorage.getItem("token");
      data.append("t", t);
      this.$http.post("/emp/sau", data).then((res) => {
        console.log(res.data, "人员信息");
        this.tableData_yg = res.data;
        this.tableData_yh = res.data;
        this.tableData_js = res.data;
      });
    },
    // 员工修改
    handleEdit2(row, num) {
      let t = sessionStorage.getItem("token");
      this.dialogFormVisible_1 = true;
      let data = new FormData();
      data.append("t", t);
      data.append("uid", row.id);
      this.$http.post("/emp/gu", data).then((res) => {
        this.user = JSON.parse(JSON.stringify(res.data));
        if (res.data.duty != "") {
          this.user.duty = Number(res.data.duty);
        }
        // this.user.department=Number(res.data.department)
        if (res.data.department != "") {
          var dep_1 = [];
          var vicedep_2 = res.data.department.split(",");
          for (var ii in vicedep_2) {
            //将每一项转为Number类型以后 增加到定义数组中
            dep_1.push(parseInt(vicedep_2[ii]));
            console.log(ii);
            console.log(typeof ii);
          }
        }

        if (res.data.isDate != "" && res.data.isDate == 1) {
          this.user_hetongtime = true;
          this.user.isDate = "具体日期";
        } else if (res.data.isDate != "" && res.data.isDate == 0) {
          this.user_hetongtime = false;
          this.user.isDate = "无固期";
        }
        this.user.department = dep_1;
        console.log(this.user);
      });
      this.dialogFormVisible_1 = true;
      if (num == 0) {
        this.code = 200;
        this.staff_title = "员工修改";
        this.user_ygshow = true;
      } else if (num == 1) {
        this.staff_title = "员工详细信息";
        this.user_ygshow = false;
      }
    },
    //员工添加
    addstaff() {
      console.log(1);
      this.code = 100;
      this.user_ygshow = true;
      this.dialogFormVisible_1 = true;
      this.staff_title = "员工添加";
    },
    //部门添加窗口取消
    dep_cancel() {
      this.depwindow = false;
      this.depe.dname = "";
    },
    //部门添加窗口确认
    dep_queding(formName) {
      let data = new FormData();
      data.append("dname", this.depe.dname);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("确认信息填写无误", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info",
          }).then(() => {
            //申请
            if (this.dep_status == 1) {
              this.$http.post("/uc/adep", data).then((res) => {
                this.depe.dname = "";
                this.depwindow = false;
                this.get_depl();
                console.log(res);
              });
              //修改
            } else if (this.dep_status == 2) {
              data.append("did", this.xid);
              this.$http.post("/uc/ud", data).then((res) => {
                this.depe.dname = "";
                this.depwindow = false;
                this.get_depl();
                console.log(res);
              });
            }
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
    handleReload() {
      this.reload(); // 在想要刷新页面的时候调用reload方法
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    clickRow(row) {
      //  this.$refs.tableData_yh.toggleRowSelection(row);
      // return { "background-color": "rgba(185, 221, 249, 0.75)" };
      // return false;
    },
    //文件目录输出器
    file_l(type) {
      //替换
      type.replace("-", "/");
      //对诸如 21-5-6类数值做拆分处理后 再进行分布匹配
      let a = type.split("-");
      let message = "";
      let tree = this.limitsData_1;
      for (var item of tree) {
        a.forEach((item, index) => {});
      }
    },
    //重置年假
    resetvacation() {
      // let a=this.multipleSelection;
      // let rids=[]
      // for(let key in a){
      //   rids.push(a[key].uid)
      // }
      // if(rids==""){
      //   alert("请选择数据导出")
      //   return false
      // }
      let data = new FormData();
      // data.append('rid',rids)
      this.$confirm("确认重置年假操作", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.$http.post("/uc/ral", data).then((res) => {
          this.$alert("重置成功", "提示", {
            confirmButtonText: "确定",
          });
          // alert("重置成功");
          this.load();
          console.log(res);
        });
      });
    },
    //重置密码
    resetpassword() {
      let a = this.multipleSelection;
      console.log(a, "22222222222");
      let rids = [];
      for (let key in a) {
        rids.push(a[key].uid);
      }
      if (rids == "" || rids.length > 1) {
        this.$alert("请选择一条用户信息进行重置密码", "提示", {
          confirmButtonText: "确定",
        });
        //  alert("请选择一条用户信息进行重置密码");
        return false;
      }
      let data = new FormData();
      data.append("rid", rids);
      this.$confirm("确认重置密码操作", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.$http.post("/uc/rp", data).then((res) => {
          // alert("重置成功");
          this.$message({
            message: "重置成功",
            type: "success",
          });
          this.load();
          console.log(res);
        });
      });
    },
    role_delete(c, m) {
      let num = m.rid;
      let data = new FormData();
      data.append("rid", num);
      this.$confirm("确认删除信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.$http.post("/p/dr", data).then((res) => {
          this.get_user();
          console.log(res);
        });
      });
    },
    //部门删除
    dep_delete(c, m) {
      let num = m.did;
      let data = new FormData();
      data.append("did", num);
      this.$confirm("确认删除信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.$http.post("/uc/dd", data).then((res) => {
          this.get_depl();
          console.log(res);
        });
      });
    },
    add_user() {
      this.roletitle = "角色添加";
      this.userwindow = true;
    },
    add_dep() {
      this.deptitle = "部门添加";
      this.depwindow = true;
    },
    dep_xiugai(type) {
      this.deptitle = "部门修改";
      this.dep_status = 2;
      this.xid = type;
      //简单深度拷贝  防止属性污染
      let a = JSON.parse(JSON.stringify(this.dep_list));
      for (var item of a) {
        console.log(item, "2222");
        if (type == item.did) {
          //直接赋值时候 导向存在问题
          this.depe = item;
        }
      }
      this.depwindow = true;
    },
    user_xiugai(type) {
      this.roletitle = "角色修改";
      this.xiugai_status = 2;
      this.xid = type;
      //简单深度拷贝  防止属性污染
      let a = JSON.parse(JSON.stringify(this.user_list));
      for (var item of a) {
        console.log(item, "2222");
        if (type == item.rid) {
          //直接赋值时候 导向存在问题
          this.role = item;
        }
      }
      this.userwindow = true;
    },
    user_fenpei(t) {
      this.$router.push("/manage");
      sessionStorage.setItem("userid", t);
    },
    user_canael() {
      this.quanxianwindows = false;
      this.user_duty = "";
    },
    role_cancel() {
      this.role.roleName = "";
      this.role.remark = "";
      this.userwindow = false;
    },
    role_queding(formName) {
      let data = new FormData();
      data.append("remark", this.role.remark);
      data.append("roleName", this.role.roleName);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("确认信息填写无误", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info",
          }).then(() => {
            if (this.xiugai_status == 1) {
              this.$http.post("/p/ar", data).then((res) => {
                this.userwindow = false;
                this.role.roleName = "";
                this.role.remark = "";
                this.get_user();
                console.log(res);
                this.xiugai_status = 1;
              });
            } else if (this.xiugai_status == 2) {
              data.append("rid", this.xid);
              this.$http.post("/p/ur", data).then((res) => {
                this.userwindow = false;
                this.role.roleName = "";
                this.role.remark = "";
                this.get_user();
                console.log(res);
                this.xiugai_status = 1;
                this.xid = "";
              });
            }
          });
        } else {
          //    alert("信息填写不规范或不完整");
          this.$alert("信息填写不规范或不完整", "提示", {
            confirmButtonText: "确定",
          });
          return false;
        }
      });
    },
    user_queding() {
      let data = new FormData();
      data.append("rid", this.user_duty);
      data.append("uid", this.user_uid);
      this.$http.post("/uc/sur", data).then((res) => {
        this.quanxianwindows = false;
        this.user_duty = "";
        this.load();
        console.log(res);
      });
    },
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },
    filter_duty() {},
    distribute(t, uid) {
      this.user_uid = uid;
      this.quanxianwindows = true;
      // this.$router.push('/manage')
      // sessionStorage.setItem("userid",t)
      // let data =new FormData;
      // data.append('','')
      // this.http.post('',data).then(res=>{
      //   console.log(res)
      //   sessionStorage.setItem("")
      //   this.$router.push('/manage')

      // })
    },
    passport(e) {
      // debugger
      console.log(e);
      //获取选定的文件
      let tFiles = e.target.files;
      let len = tFiles.length;
      if (tFiles[0].size > 2000000) {
        alert("文件大小超过2M,请重新选择上传");
        e.target.value = "";
        return false;
      }
      function createObjectURL(object) {
        return window.URL
          ? window.URL.createObjectURL(object)
          : window.webkitURL.createObjectURL(object);
      }
      for (let i = 0; i < len; i++) {
        //开始上传每一个文件
        let imgurl = createObjectURL(tFiles[i]);
        this.photourl = imgurl;
        console.log(this.photourl);
        console.log(this.photourl, "图片上传回显地址");
        //开始上传文件 新建一个formData
        let param = new FormData();
        param.append("t", sessionStorage.getItem("token"));
        //通过append向form对象添加数据
        param.append("f", tFiles[i]);
        //FormData私有类对象，访问不到，可以通过get判断值是否传进去
        let config = {
          //添加请求头
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        this.$http({
          url: "/uc/ul",
          method: "post",
          data: param,
          config,
        }).then((res) => {
          console.log(res.data);
          this.photoid = res.data;
          this.user.logo = res.data;
          this.isphoto = false;
        });
      }
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.activeIndex = key;
      console.log(this.activeIndex, "activeIndex");
      console.log(key == this.activeIndex);
    },
    handleEdit1(index, row) {
      this.code = 200;
      console.log(index, row);
      let data = new FormData();
      let t = sessionStorage.getItem("token");
      data.append("t", t);
      data.append("uid", row.uid);
      this.$http.post("/emp/gu", data).then((res) => {
        console.log(res);
        this.user_title = "用户详情";
        this.user = JSON.parse(JSON.stringify(res.data));
        // this.user.department=Number(res.data.department)
        if (res.data.duty != "") {
          this.user.duty = Number(res.data.duty);
        } else if (res.data.duty == "") {
          res.data.duty == "";
        }
        var dep = [];
        var vicedep_1 = res.data.utype.split(",");
        for (var ii in vicedep_1) {
          //将每一项转为Number类型以后 增加到定义数组中
          dep.push(parseInt(vicedep_1[ii]));
          console.log(ii);
          console.log(typeof ii);
        }
        if (res.data.department != "") {
          var dep_1 = [];
          var vicedep_2 = res.data.department.split(",");
          for (var ii in vicedep_2) {
            //将每一项转为Number类型以后 增加到定义数组中
            dep_1.push(parseInt(vicedep_2[ii]));
            console.log(ii);
            console.log(typeof ii);
          }
        }
        this.user_ygshow = true;
        this.user.department = dep_1;
        this.user.utype = dep;
        this.dialogFormVisible = true;
      });
    },
    handleDelete1(index, row) {
      console.log("uid--", row.uid);
      let data = new FormData();
      let t = sessionStorage.getItem("token");
      data.append("t", t);
      data.append("uid", row.uid);
      this.$confirm("此操作将删除该员工的所有信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/emp/delete", data)
            .then((res) => {
              console.log(res);
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.load();
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "删除失败",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      // if (confirm("确认删除信息") == true) {
      //   this.$http.post("/uc/delete", data).then((res) => {
      //     console.log(res);
      //     this.load();
      //   });
      // }
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    adduser() {
      this.user_ygshow = true;
      this.user_title = "用户添加";
      //  this.$refs.user.resetFields();
      // console.log(this.$refs['user'],"123");
      // this.resetForm('user')
      console.log(this.duty_name, "2131");
      this.dialogFormVisible = true;
      this.code = 100;
    },
    cancel(formName) {
      this.$refs.user.resetFields();
      this.clear_f(this.user);
      this.dialogFormVisible = false;
      this.dianji();
    },
    dianji() {
      this.photourl = "";
      this.isphoto = true;
    },
    submit(formName) {
      if (this.user_ygshow == true) {
        let data = new FormData();
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // console.log(this.$refs.user,'ref')
            console.log(this.user, "user");
            for (var key in this.user) {
              if (this.user[key] != null && this.user[key] != undefined) {
                console.log(key + ":" + this.user[key], "每次数值");
                data.append(key, this.user[key]);
              }
              this.user.annualleave = Number(this.user.annualleave);
              this.user.remainannualleave = Number(this.user.remainannualleave);
              // if(this.user[key]!==null&&key!=='lastLoginTime'){
            }
            // data.delete("remainannualleave");
            // data.delete("annualleave");
            data.delete("birthday");
            data.delete("endTime");
            data.delete("entryTime");
            data.delete("proTime");
            this.$confirm("确认信息填写无误", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "info",
            }).then(() => {
              console.log("自定义状态码", this.code);
              if (this.code == 100) {
                data.delete("lastLoginTime");
                this.$http.post("/emp/a", data).then((res) => {
                  if (res.data == true) {
                    this.dialogFormVisible_1 = false;
                    this.dialogFormVisible = false;
                    console.log("新增", res);
                    this.dianji();
                    this.load();
                    this.$message({
                      message: "添加成功",
                      type: "success",
                    });
                    this.$refs[formName].resetFields();
                    this.clear_f(this.user);
                  } else if (res.data == -1) {
                    // alert("该账号已注册");
                    this.$alert("该账号已注册", "提示", {
                      confirmButtonText: "确定",
                    });
                    this.user.mobile = "";
                    return false;
                  } else if (res.data == -2) {
                    this.$alert("工号已注册", "提示", {
                      confirmButtonText: "确定",
                    });
                    //    alert("工号已注册");
                    this.user.workno == "";
                    return false;
                  }
                });
              } else if (this.code == 200) {
                data.delete("lastLoginTime");
                this.$http.post("/emp/us", data).then((res) => {
                  if (res.data == true) {
                    this.dialogFormVisible = false;
                    this.dialogFormVisible_1 = false;
                    console.log("修改", res);
                    this.dianji();
                    this.load();
                    this.reload1();
                    this.$message({
                      message: "修改成功",
                      type: "success",
                    });
                    this.clear_f(this.user);
                    this.$refs[formName].resetFields();
                  } else if (res.data == -1) {
                    this.$alert("该账号已注册", "提示", {
                      confirmButtonText: "确定",
                    });
                    //  alert("该账号已注册");
                    this.user.mobile = "";
                    return false;
                  } else if (res.data == -2) {
                    this.$alert("工号已注册", "提示", {
                      confirmButtonText: "确定",
                    });
                    //  alert("工号已注册");
                    this.user.workno == "";
                    return false;
                  }
                });
              }
            });
          } else {
            //  alert("信息填写不规范或不完整");
            this.$alert("信息填写不规范或不完整", "提示", {
              confirmButtonText: "确定",
            });
            document.documentElement.scrollTop = document.body.scrollTop = 0;
            return false;
          }
        });
      } else if (this.user_ygshow == false) {
        this.dialogFormVisible_1 = false;
        this.clear_f(this.user);
        //   this.$refs.user.resetField();
      }
    },
    get_depl() {
      let data = new FormData();
      this.$http.post("/uc/depl", data).then((res) => {
        this.depll = res.data;
        this.dep_list = res.data;
        // sessionStorage.setItem("duty_1",JSON.stringify(this.depll))
        console.log(this.depll, "iiii");
      });
    },
    get_user() {
      let data = new FormData();
      this.$http.post("/uc/rl", data).then((res) => {
        console.log(res.data);
        this.user_list = res.data;

        // this.tableData_yh=res.data
      });
    },
    get_job() {
      let data = new FormData();
      this.$http.post("/uc/dtl", data).then((res) => {
        console.log(res, "职位");
        this.joblist = res.data;
        // sessionStorage.setItem("job_1",JSON.stringify(this.joblist))
        // this.tableData_yh=res.data
      });
    },
    load() {
      var data = new FormData();
      let t = sessionStorage.getItem("token");
      data.append("t", t);
      this.$http.post("/emp/sau", data).then((res) => {
        console.log(res.data, "人员信息");
        this.tableData_yh = res.data;
        this.tableData_js = res.data;
        this.tableData_yg = res.data;
      });
    },
  },
  computed: {
    duty_name: function () {
      //  var that=this
      let deparr = JSON.parse(JSON.stringify(this.depll));
      let duty_na = JSON.parse(JSON.stringify(this.tableData_yh));
      deparr.forEach((item, index) => {
        duty_na.forEach((key, ink) => {
          if (Number(key.department) == Number(item.did)) {
            console.log("1---------1");
            duty_na[dname] = item.dname;
            // this.$set(duty_na,'dname',item.dname)
          }
        });
      });
      console.log(duty_na, "--------------");
      return duty_na;
    },
  },
  mounted() {
    this.get_depl();
    this.get_job();
    this.get_user();
    let a = JSON.parse(sessionStorage.getItem("a"));
    console.log(a);
    for (let item of a) {
      if (item == "81") this.menu.push({ name: "员工管理", id: "81" });
      if (item == "82") this.menu.push({ name: "部门管理", id: "82" });
      // if (item == "82") this.menu.push({ name: "员工管理", id: "82" });
      // if (item == "81") this.menu.push({ name: "部门管理", id: "81" });
    }
    console.log(this.menu, "menu");
    let float = sessionStorage.getItem("float");
    this.float = JSON.parse(float);
    this.activeIndex = this.float.menu_index;
    this.load();
    this.handleSelect(this.menu[0].id);
  },
  //   beforeRouteEnter(to, from, next) {
  //     next((vm) => {
  //       if (from.name !== "information") {
  //         vm.handleSelect(vm.menu[0].id);
  //       }
  //     });
  //   },
  beforeRouteLeave(to, from, next) {
    this.float.menu_index = this.activeIndex;
    let float = JSON.stringify(this.float);
    sessionStorage.setItem("float", float);
    next();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-dialog__wrapper /deep/ .el-dialog {
  min-width: 600px;
}
body .el-table::before {
  z-index: inherit;
}
/* body .el-table::before {z-index: inherit;} */
.add {
  position: absolute;
  left: 0;
  width: 240px;
  height: 200px;
  font-size: 30px;
  top: 0;
  z-index: 98;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fileBox {
  margin-left: 100px;
  width: 240px;
  height: 200px;
  position: relative;
  border: 1px dashed #c0ccda;
}
.myFile {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  width: 240px;
  height: 200px;
  z-index: 99;
}
/* .el-form-item /deep/ .el-input__inner{width:300px;} */
.el-table {
  color: #070707;
  height: 64vh;
}
.el-menu {
  overflow: auto;
}
.el-menu,
.el-table--border {
  border: 0;
  overflow: auto;
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
.User {
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
  display: flex;
  /* justify-content: space-between; */
  padding: 1.7% 2.1%;
  margin-top: 7px;
  min-width: 1250px;
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
#hetongend_time /deep/ .el-form-item__label {
  width: 110px !important;
}
</style>
<style >
.el-table__body tr.current-row > td {
  background-color: #c3e0ff !important;
  /* color: #f19944; */ /* 设置文字颜色，可以选择不设置 */
}
</style>
