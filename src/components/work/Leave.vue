<template>
  <!-- 请假 -->
  <div class="Leave">
    <div>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">请假</el-menu-item>
        <el-menu-item index="2">请假规则</el-menu-item>
        <el-menu-item index="3">年假记录</el-menu-item>
      </el-menu>
    </div>
    <!-- 请假 -->
    <div class="content" v-show="activeIndex == '1'">
      <div class="table_top2">
        <div style=" text-align:left">
          <span>请假类型：</span>
          <el-select v-model="search.type" placeholder="请选择" clearable style="width:10%">
            <el-option
              v-for="item in options"
              :key="item.sid"
              :label="item.jiaqileixing"
              :value="item.sid"
            ></el-option>
          </el-select>&#8195;
          <span>请假开始时间：</span>
          <el-date-picker
            type="datetime"
            placeholder="开始时间"
            v-model="search.uptime"
            style="width:15%"
          ></el-date-picker>
          <el-date-picker
            type="datetime"
            style="width:15%"
            placeholder="结束时间"
            v-model="search.downtime"
          ></el-date-picker>&#8195;
          <el-button icon="el-icon-search" type="primary" @click="load"></el-button>
          <el-button align="right" type="primary" @click="apply">申请</el-button>
        </div>
        <!-- <input type="text" v-model="content_v" placeholder="搜索请假类型"  style="display:none"/> -->
      </div>
      <el-table
        :data="
          tableData
            .filter(
              data =>
                !content_v ||
                data.wtype.toLowerCase().includes(content_v.toLowerCase())
            )
            .slice(
              (this.currentPage1 - 1) * this.pageSize,
              this.currentPage1 * this.pageSize
            )
        "
        ref="tableData"
        :model="tableData"
        height="430"
        style="width: 95.8%;margin:0 2.1%;"
        align="center"
        border
        header-cell-class-name="t_h"
      >
        <el-table-column label="请假类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.wtype | wtype_f }}</span>
          </template>
        </el-table-column>
        <el-table-column label="请假原因" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer">{{ scope.row.reason }}</span>
          </template>
        </el-table-column>
        <el-table-column label="请假时长(天)" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.qjtime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" align="center" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.uptime | time_f }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.downtime | time_f }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审批进程" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <span style="color:#3399FF" @click="handleEdit(scope.row.wid)">查看</span>
              <!-- <span style="color:red" v-if="(scope.row.result==null)?true:false " @click="handle_xiugai(scope.$index,scope.row.wid)">修改</span> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <el-button type="text" @click="leave_xiangqing(scope.row, scope.row.fids)">详情</el-button>
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
                !content_v ||
                data.wtype.toLowerCase().includes(content_v.toLowerCase())
            ).length
          "
        ></el-pagination>
      </div>
      <!-- <iframe  style="width:800px;height:800px" ref="iframe" src="http://localhost:8086"  id="sendMessage" name="sendMessage" onload="resize()"></iframe> -->
      <!-- <el-button></el-button> -->
      <!-- <el-button type="primary" @click="sendMessage">向iframe发送信息</el-button> -->
      <!-- <div class="process" v-if="isprocess"> -->
      <!-- <div class="circle">
          <span>申请人</span>
          <span>{{tableData.uname}}</span>
      </div>-->
      <!-- 申请弹窗 -->
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
              <br />
              <!-- <span style="color:white">查看</span> -->
            </div>
          </li>
          <li style="display:inline-block" v-for="(item, index) in leader_1" :key="index + 1">
            <!-- <span>{{item}}</span> -->
            <div style="display:inline-block" v-if="Boolean(item[Object.keys(item)[0]])">
              <span>--</span>
              <span style="color:red" v-if="!Boolean(item[Object.keys(item)[1]])">X</span>
              <span style="color:green" v-if="Boolean(item[Object.keys(item)[1]])">✔️</span>
              <span>--</span>
            </div>
            <div class="yuanxing" v-if="Boolean(item[Object.keys(item)[0]])">
              <span>{{ leader_name2(item[`agent${index + 1}`]) }}</span>
              <br />
              <span class="text-shenglue">
                {{
                leader_name(
                item[`status${index + 1}`],
                item[`reamrk${index + 1}`]
                )
                }}
              </span>
              <br />
            </div>
          </li>
        </ul>
        <span>
          <el-button
            style="margin-left:30px;width: 120px;"
            @click="(isprocess = false), reload()"
          >关闭</el-button>
        </span>
      </el-dialog>
      <!-- </div> -->
      <!-- Form申请表单 -->
      <el-dialog
        title="请假申请"
        :visible.sync="dialogFormVisible"
        width="600px"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <el-form :model="user" ref="user" :rules="ruless">
          <el-form-item label="开始时间：" :label-width="formLabelWidth" prop="uptime">
            <div class="block">
              <el-date-picker
                v-model="user.uptime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="8:00:00"
                style="width:95%"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="结束时间：" :label-width="formLabelWidth" prop="downtime">
            <div class="block">
              <el-date-picker
                v-model="user.downtime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="17:00:00"
                style="width:95%"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="请假时长(天)：" :label-width="formLabelWidth" prop="qjtime">
            <el-input v-model="user.qjtime" autocomplete="off" style="width:95%"></el-input>
          </el-form-item>
          <el-form-item label="请假类型：" :label-width="formLabelWidth" prop="wtype">
            <div style="margin-left:15px;display:flex;flex-direction:row;width:95%">
              <el-select
                v-model="user.wtype"
                placeholder="请选择"
                style="width:30%"
                ref="s_wtype"
                @change="year_s()"
              >
                <el-option
                  v-for="item in options"
                  :key="item.sid"
                  :label="item.jiaqileixing"
                  :value="item.sid"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="备注：" v-show="year_status" :label-width="formLabelWidth">
            <el-input class="qjbeizhuc" type="textarea" :disabled="true" v-model="qjbeizhu"></el-input>
          </el-form-item>
          <!--  -->
          <!-- <el-form-item label="剩余年假天数：" :label-width="formLabelWidth" prop="annualleave">
            <el-input v-model="user.annualleave" autocomplete="off" style="width:95%"></el-input>
          </el-form-item>-->
          <el-form-item label="请假原因：" :label-width="formLabelWidth" prop="reason">
            <el-input v-model="user.reason" autocomplete="off" style="width:95%"></el-input>
          </el-form-item>
          <el-form-item label="综合部审核：" :label-width="formLabelWidth" prop="Agent1" v-show="show1">
            <el-select placeholder="请选择" style="width:95%" v-model="Agent1" clearable>
              <el-option
                v-for="item in allpeople5"
                :key="item.uid"
                :label="item.username"
                :value="item.uid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门审批：" :label-width="formLabelWidth" prop="Agent2" v-show="show5">
            <el-select
              filterable
              v-model="Agent2"
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
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="分管秘书长："
            :label-width="formLabelWidth"
            v-show="show2 == true"
            prop="agent3"
            class="fenguan_form"
          >
            <el-select
              filterable
              v-model="Agent3"
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
                  (user.agent2 == item.uid && user.agent2 !== '') ||
                    (user.agent4 == item.uid && user.agent4 !== '')
                "
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="秘书长："
            :label-width="formLabelWidth"
            v-show="show3 == true"
            prop="agent4"
          >
            <el-select v-model="Agent4" placeholder="请选择" style="width:95%" clearable filterable>
              <el-option
                v-for="item in allpeople3"
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
          <!-- <el-form-item label="抄送人：" :label-width="formLabelWidth" prop="cclist">
            <el-select
              v-model="user.cclist"
              placeholder="请选择"
              style="width:95%"
              clearable
              multiple
              filterable
            >
              <el-option
                v-for="item in allpeople4"
                :key="item.uid"
                :label="item.username"
                :value="item.uid"
              ></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item
            label="上传附件："
            :label-width="formLabelWidth"
            prop="mid"
            style="text-align: left;"
          >
            <newUpload ref="newUpload" :Upload_showdisable="Upload_showdisable"></newUpload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="submit_cancel()" style="width: 120px;">取 消</el-button>
          <el-button type="primary" @click="submit('user')" style="width: 120px;">提 交</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 请假规则 -->
    <div class="content" v-show="activeIndex == '2'">
      <div class="table_top1">
        <span style="line-height:31px">请假类别：</span>
        <input type="text" v-model="content4_v" placeholder="搜索请假类别" style="width:150px;" />
        <el-button
          type="primary"
          @click="addType"
          v-has="111"
          slot-scope
          style="margin-left:50px"
        >添加</el-button>
      </div>
      <el-table
        :data="
          tableData_pz
            .filter(
              data =>
                !content4_v ||
                data.jiaqileixing
                  .toLowerCase()
                  .includes(content4_v.toLowerCase())
            )
            .slice(
              (this.currentPage4 - 1) * this.pageSize,
              this.currentPage4 * this.pageSize
            )
        "
        style="width: 95.8%;margin:0 2.1%;"
        align="center"
        border
        header-cell-class-name="t_h"
        height="430"
      >
        <el-table-column label="请假类别" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.jiaqileixing }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最小单位(天)" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.unit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <span
                style="color:#3399FF"
                @click="updateType(scope.$index, scope.row)"
                v-has="142"
              >修改</span>
              <span
                style="color:#FF5454"
                @click="deleteType(scope.$index, scope.row)"
                v-has="143"
              >删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <span class="demonstration">每页10条</span>
        <el-pagination
          :current-page.sync="currentPage4"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="
            tableData_pz.filter(
              data =>
                !content4_v ||
                data.jiaqileixing
                  .toLowerCase()
                  .includes(content4_v.toLowerCase())
            ).length
          "
        ></el-pagination>
      </div>
      <!-- Form新增表单 -->
      <el-dialog
        :title="kaoqin_title"
        :visible.sync="typeFormVisible"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <el-form :model="type" ref="type" :rules="rules">
          <el-form-item label="请假类型" :label-width="formLabelWidth" prop="jiaqileixing">
            <el-input v-model="type.jiaqileixing"></el-input>
          </el-form-item>
          <el-form-item label="最小单位" :label-width="formLabelWidth" prop="unit">
            <el-input v-model="type.unit"></el-input>
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
            <el-input v-model="type.remark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelType" style="width: 120px;">取 消</el-button>
          <el-button type="primary" @click="sureType('type')" style="width: 120px;">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 年假记录 -->
    <div class="content" v-show="activeIndex == '3'">
      <div class="table_top1">
        <span style="line-height:31px">姓名：</span>
        <input type="text" v-model="content6_v" placeholder="搜索请假姓名" style="width:150px;" />
        <span style="line-height:31px">年度：</span>
        <el-date-picker type="year" format="yyyy" placeholder="选择年" v-model="year_time"></el-date-picker>&#8195;
        <el-button icon="el-icon-search" type="primary" @click="yearjl_search()"></el-button>
      </div>
      <el-table
        :data="
          tableData_yearjl
            .filter(
              data =>
                !content6_v ||
                data.username
                  .toLowerCase()
                  .includes(content6_v.toLowerCase())
            )
            .slice(
              (this.currentPage6 - 1) * this.pageSize,
              this.currentPage6 * this.pageSize
            )
        "
        style="width: 95.8%;margin:0 2.1%;"
        align="center"
        border
        header-cell-class-name="t_h"
        height="430"
      >
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="年份" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.year }}</span>
          </template>
        </el-table-column>
        <el-table-column label="应休假天数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.restDays }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实际休假天数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.actualRestDays }}</span>
          </template>
        </el-table-column>
        <el-table-column label="本年剩余天数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.remainRestDays }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上年度剩余天数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.lastYearDays }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" width="220" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer">{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <span style="color:#3399FF" @click="setyear( scope.row)" v-has="142">修改</span>
              <span style="color:#FF5454" @click="deleteyear( scope.row)" v-has="143">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <span class="demonstration">每页10条</span>
        <el-pagination
          :current-page.sync="currentPage6"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="
            tableData_yearjl.filter(
              data =>
                !content6_v ||
                data.username
                  .toLowerCase()
                  .includes(content6_v.toLowerCase())
            ).length
          "
        ></el-pagination>
      </div>
    </div>
    <!-- 请假详情获取 -->
    <el-dialog
      title="请假详情"
      :visible.sync="dialogFormVisible_1"
      width="40%"
      @close="close_xiangqing"
      :close-on-click-modal="true"
    >
      <el-form :model="user1" ref="user1" :disabled="true">
        <el-form-item label="开始时间：" :label-width="formLabelWidth" prop="uptime">
          <div class="block">
            <el-date-picker
              v-model="user1.uptime"
              type="datetime"
              placeholder="选择日期时间"
              default-time="8:00:00"
              style="width:95%"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="结束时间：" :label-width="formLabelWidth" prop="downtime">
          <div class="block">
            <el-date-picker
              v-model="user1.downtime"
              type="datetime"
              placeholder="选择日期时间"
              default-time="8:00:00"
              style="width:95%"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="请假时长(天)：" :label-width="formLabelWidth" prop="qjtime">
          <el-input v-model="user1.qjtime" autocomplete="off" style="width:95%"></el-input>
        </el-form-item>
        <el-form-item label="请假类型：" :label-width="formLabelWidth" prop="wtype">
          <div style="margin-left:15px;display:flex;flex-direction:row;width:95%">
            <el-select v-model="user1.wtype" placeholder="请选择" style="width:30%" ref="s_wtype">
              <el-option
                v-for="item in options"
                :key="item.sid"
                :label="item.jiaqileixing"
                :value="item.sid"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="请假原因：" :label-width="formLabelWidth" prop="reason">
          <el-input v-model="user1.reason" autocomplete="off" style="width:95%"></el-input>
        </el-form-item>
        <el-form-item
          label="综合部审核："
          :label-width="formLabelWidth"
          prop="agent1"
          v-show="user1.agent1"
        >
          <el-select v-model="user1.agent1" placeholder style="width:95%" clearable>
            <el-option
              v-for="item in allpeople4"
              :key="item.uid"
              :label="item.username"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="审核意见："
          :label-width="formLabelWidth"
          prop="reamrk1"
          v-show="user1.reamrk1"
        >
          <el-input v-model="user1.reamrk1" style="width:95%"></el-input>
        </el-form-item>
        <el-form-item
          label="部门审批："
          :label-width="formLabelWidth"
          prop="agent2"
          class="bumensp"
          v-show="user1.agent2"
        >
          <el-select v-model="user1.agent2" placeholder style="width:95%" clearable>
            <el-option
              v-for="item in allpeople4"
              :key="item.uid"
              :label="item.username"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="审核意见： "
          :label-width="formLabelWidth"
          prop="reamrk2"
          v-show="user1.reamrk2"
        >
          <el-input v-model="user1.reamrk2" style="width:95%"></el-input>
        </el-form-item>
        <el-form-item
          label="分管秘书长审批："
          :label-width="formLabelWidth"
          prop="agent3"
          v-show="user1.agent3"
        >
          <el-select v-model="user1.agent3" placeholder style="width:95%" clearable>
            <el-option
              v-for="item in allpeople4"
              :key="item.uid"
              :label="item.username"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="审核意见： "
          :label-width="formLabelWidth"
          prop="reamrk3"
          v-show="user1.reamrk3"
        >
          <el-input v-model="user1.reamrk3" style="width:95%"></el-input>
        </el-form-item>
        <el-form-item
          label="秘书长审批："
          :label-width="formLabelWidth"
          prop="agent4"
          v-show="user1.agent4"
        >
          <el-select v-model="user1.agent4" placeholder style="width:95%" clearable>
            <el-option
              v-for="item in allpeople4"
              :key="item.uid"
              :label="item.username"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="审核意见： "
          :label-width="formLabelWidth"
          prop="reamrk4 "
          v-show="user1.reamrk4"
        >
          <el-input v-model="user1.reamrk4" style="width:95%"></el-input>
        </el-form-item>
        <el-form-item
          label="附件  ："
          :label-width="formLabelWidth"
          prop="mid"
          style="text-align: left;"
        >
          <span v-show="tupianjiazai">未上传图片附件</span>
          <newUpload ref="newUpload1" :Upload_showdisable="Upload_showdisable" prop="mid"></newUpload>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
        style="display:flex;margin-bottom:20px;justify-content:flex-end;margin-right:94px;"
      >
        <el-button @click="xiangqing" type="primary" style="width: 120px;">确定</el-button>
      </div>
    </el-dialog>
    <!-- 年假记录修改弹窗 -->
    <el-dialog
      title="年假记录修改"
      :visible.sync="dia_Annualleaverecords"
      width="450px"
      :close-on-click-modal="false"
    >
      <el-form ref="yearvication_form" :model="yearvication_form" label-width="120px">
        <el-form-item label="姓名:" label-width="50px" style="display:inline-block;width:34%">
          <el-input v-model="yearvication_form.username" disabled></el-input>
        </el-form-item>
        <el-form-item label-width="50px" label="年份:" style="display:inline-block;width:40%">
          <el-input disabled v-model="yearvication_form.year"></el-input>
        </el-form-item>
        <el-form-item label="应休假天数:">
          <el-input disabled v-model="yearvication_form.restDays"></el-input>
        </el-form-item>
        <el-form-item label="实际休假天数:">
          <el-input disabled v-model="yearvication_form.actualRestDays"></el-input>
        </el-form-item>
        <el-form-item label="本年剩余天数:">
          <el-input disabled v-model="yearvication_form.remainRestDays"></el-input>
        </el-form-item>
        <el-form-item label="上年度剩余天数:">
          <el-input disabled v-model="yearvication_form.lastYearDays"></el-input>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="yearvication_form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close_yearxq()">取 消</el-button>
        <el-button type="primary" @click="toupdate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import newUpload from "./newUpload.vue";
export default {
  inject: ["reload"],
  name: "Leave",
  components: { newUpload },
  data() {
    var validatePass3 = (rule, value, callback) => {
      if (this.personal_post < 12) {
        callback();
      }
      if (this.show1 == true && this.Agent1 == "") {
        return callback(new Error("请选择综合部审批人"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (this.personal_post < 12) {
        callback();
      }
      if (this.Agent1 == "" && this.Agent2 == "") {
        return callback(new Error("请输入审批人"));
      } else {
        callback();
      }
    };

    var validatePass1 = (rule, value, callback) => {
      if (value % 0.5 != 0) {
        return callback(new Error("请假天数必须是以0.5的倍数的数字"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (
        (this.personal_post >= 10 &&
          this.personal_post <= 12 &&
          this.Agent3 === "") ||
        this.Agent3 === null
      ) {
        return callback(new Error("请选择审批人"));
      } else {
        callback();
      }
    };
    var validatePass4 = (rule, value, callback) => {
      if (
        (this.personal_post <= 9 && this.Agent4 == "") ||
        this.Agent4 == null
      ) {
        return callback(new Error("请选择审批人"));
      } else {
        callback();
      }
    };
    return {
      personal_post: 16,
      year_time: "",
      tableData_yearjl: [],
      content6_v: "",
      currentPage6: 1,
      qjbeizhu:
        "普通员工事假及病假1天以内需报部门主任审批；           超过1天且3天以内的，经部门主任同意，报分管副秘书长审批；                                                                    连休3天（含）以上的，经部门主任和分管副秘书长同意后报秘书长审批",
      yearvication_form: {},
      dia_Annualleaverecords: false,
      fileListid: [],
      Upload_showdisable: true,
      search: {
        type: "",
        uptime: "",
        downtime: "",
      },
      //综合部门
      Agent1: "",
      show1: false,
      //部门审批
      Agent2: "",
      //分管秘书长审批
      show2: false,
      Agent3: "",
      //秘书长审批
      show3: false,
      Agent4: "",
      show5: true,
      //请假类型
      alltype: [],
      year_status: false,
      dialogFormVisible_1: false,
      urls: [],
      tupianjiazai: false,
      ruless: {
        Agent1: [{ validator: validatePass3, trigger: "blur" }],
        Agent2: [
          { validator: validatePass, trigger: "blur" },
          // { required: true, message: "请选择部门审批人", trigger: "blur" },
          //    { required: true, message: "请输入部门审批", trigger: "blur" },
        ],
        // 分管秘书长
        agent3: [{ validator: validatePass2, trigger: "blur" }],
        //秘书长
        agent4: [{ validator: validatePass4, trigger: "blur" }],
        uptime: [
          { required: true, message: "请选择开始日期时间", trigger: "change" },
        ],
        qjtime: [
          { required: true, message: "请输入请假天数", trigger: "change" },
          {
            validator: validatePass1,
            trigger: "change",
          },
        ],
        downtime: [
          { required: true, message: "请选择结束日期时间", trigger: "change" },
        ],
        day: [{ required: true, message: "请输入请假天数", trigger: "change" }],
        wtype: [
          { required: true, message: "请选择请假类型", trigger: "change" },
        ],
        reason: [
          { required: true, message: "请输入请假原因", trigger: "change" },
        ],
        xhduty: [
          { required: true, message: "请输入协会职务", trigger: "change" },
        ],
        fulldata: [
          { required: true, message: "请输入协会职务", trigger: "change" },
        ],
        cclist: [
          { required: false, message: "请选择抄送人", trigger: "change" },
        ],
      },
      user_data: [],
      content_v: "",
      isprocess: false,
      num: 0,
      user_name: "",
      user_status: "",
      pageSize: 10, //每页条数
      leader_1: [],
      fileList: [], //上传附件
      tableData_pz: [],
      content4_v: "",
      currentPage4: 1, //当前页4
      currentPage5: 1, //当前页4
      kaoqin_title: "新增考勤类型",
      typeFormVisible: false,
      rules: {
        jiaqileixing: [
          { required: true, message: "请输入请假类型", trigger: "blur" },
        ],
        //  unit: [
        //   { required: true, message: "请输入最小单位", trigger: "change" }
        // ],
        // remark: [
        //   { required: true, message: "请输入最小单位", trigger: "change" }
        // ],
      },
      type: {
        jiaqileixing: "",
        unit: "",
        remark: "",
      },
      leader: [
        { name: "领导", advise: "同意" },
        { name: "领导", advise: "拒绝" },
        { name: "领导", advise: "审核" },
      ],
      float: [],
      agent1_sum: {},
      agent2_sum: {},
      agent4_sum: {},
      agent3_sum: {
        agent3: "",
        status3: "",
        remark3: "",
      },
      activeIndex: "1",
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
      formLabelWidth: "130px",
      dialogFormVisible: false,
      currentPage1: 1,
      content1_v: "",
      user: {
        remainannualleave: "",
        lastagent: "",
        uptime: "",
        downtime: "",
        qjtime: "",
        wtype: "",
        reason: "",
        agent1: "",
        agent2: "",
        agent3: "",
        agent4: "",
        reamrk1: "",
        reamrk2: "",
        reamrk3: "",
        reamrk4: "",
        cclist: "",
      },
      x_gou: true,
      z_gou: false,
      options: [],
      allpeople1: [],
      allpeople2: [],
      allpeople3: [],
      allpeople4: [],
      allpeople5: [],
      res: [],
      respon: {
        res1: [],
        res2: [],
        res3: [],
      },
      user1: [],
    };
  },
  methods: {
    //查询
    yearjl_search() {
      if (this.year_time) {
        var y = this.year_time.getFullYear();
      }
      console.log(y);
      let data = new FormData();
      data.append("name", this.content6_v);
      data.append("year", y);
      this.$http.post("/ar/gaar", data).then((res) => {
        this.tableData_yearjl = res.data;
      });
    },
    // 修改
    toupdate() {
      let data = new FormData();
      let remark = this.yearvication_form.remark;
      let id = this.yearvication_form.id;
      data.append("remark", remark);
      data.append("id", id);
      this.$confirm("确认信息填写无误", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.$http.post("/ar/uacr", data).then((res) => {
          if (res.data == 1) {
            this.$message.success("修改成功");
            this.load_yearjl();
            this.$refs.yearvication_form.resetFields();
            this.dia_Annualleaverecords = false;
          }
        });
      });
    },
    close_yearxq() {
      this.$refs.yearvication_form.resetFields();
      this.dia_Annualleaverecords = false;
    },
    deleteyear(value) {
      let data = new FormData();
      let id = value.id;
      data.append("id", id);
      this.$confirm("确认删除此条信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.$http.post("/ar/dacr", data).then((res) => {
          this.load_yearjl();
        });
      });
    },
    load_yearjl() {
      let data = new FormData();
      this.$http.post("/ar/gaar", data).then((res) => {
        this.tableData_yearjl = res.data;
      });
    },
    //修改年假记录
    setyear(value) {
      console.log(value, "本条年假记录");
      this.dia_Annualleaverecords = true;
      this.yearvication_form = JSON.parse(JSON.stringify(value));
    },
    close_xiangqing() {
      this.$refs.user1.resetFields();
      this.fileList = [];
      this.$refs.newUpload1.fileList = [];
    },
    xiangqing() {
      this.$refs.user1.resetFields();
      this.$refs.newUpload1.fileList = [];
      this.fileList = [];
      this.dialogFormVisible_1 = false;
      this.show1 = false;
    },
    qjtype() {
      let data = new FormData();
      data.append("t", sessionStorage.getItem("token"));
      this.$http.post("/job/ql", data).then((res) => {
        this.options = res.data;
        console.log(this.options);
      });
    },
    //综合部门列表
    synthesize() {
      let t = sessionStorage.getItem("token");
      var data = new FormData();
      data.append("t", t);
      this.$http.post("/job/gdl", data).then((res) => {
        console.log(res, "111111111111111111111111111111111111");
        this.allpeople5 = res.data;
      });
    },
    department() {
      this.show2 = true;
    },
    branched() {
      this.show3 = true;
    },
    // 获取当前请假详情
    leave_xiangqing(n, y) {
      let post = Number(sessionStorage.getItem("personal_post"));
      console.log(n);
      console.log(post);
      if (n.agent1 != null) {
        n.agent1 = Number(n.agent1);
      }
      if (n.agent2 != null) {
        n.agent2 = Number(n.agent2);
      }
      if (n.agent3 != null) {
        n.agent3 = Number(n.agent3);
      }
      if (n.agent4 != null) {
        n.agent4 = Number(n.agent4);
      }
      if (n.agent5 != null) {
        n.agent5 = Number(n.agent5);
      }
      let t = {};
      t = JSON.parse(JSON.stringify(n));
      if (post >= 10 && post <= 12) {
        if (n.isgd == 1) {
          t.agent4 = n.agent3;
          t.agent3 = n.agent2;
          t.agent1 = n.agent1;
          t.reamrk1 = n.reamrk1;
          t.reamrk3 = n.reamrk2;
          t.reamrk4 = n.reamrk3;
          t.agent2 = null;
          t.reamrk2 = null;
        } else if (n.isgd == 0) {
          t.agent3 = n.agent1;
          t.agent4 = n.agent2;
          t.reamrk3 = n.reamrk1;
          t.reamrk4 = n.reamrk2;
          t.reamrk1 = null;
          t.agent1 = null;
          t.agent2 = null;
          t.reamrk2 = null;
        }
      } else if (post <= 9) {
        if (n.isgd == 1) {
          t.agent1 = n.agent1;
          t.agent4 = n.agent2;
          t.reamrk1 = n.reamrk1;
          t.reamrk4 = n.reamrk2;
          t.agent2 = null;
          t.agent3 = null;
          t.reamrk2 = null;
          t.reamrk3 = null;
        } else if (n.isgd == 0) {
          t.agent4 = n.agent1;
          t.reamrk4 = n.reamrk1;
          t.agent1 = null;
          t.agent2 = null;
          t.agent3 = null;
          t.reamrk1 = null;
          t.reamrk2 = null;
          t.reamrk3 = null;
        }
      } else {
        if (n.isgd == 0) {
          t.agent2 = n.agent1;
          t.agent3 = n.agent2;
          t.agent4 = n.agent3;
          t.reamrk2 = n.reamrk1;
          t.reamrk3 = n.reamrk2;
          t.reamrk4 = n.reamrk3;
          t.agent1 = null;
          t.reamrk1 = null;
        }
      }
      this.user1 = t;
      console.log(t);
      console.log(this.user1);
      this.agree_fujianchakan(y);
      this.dialogFormVisible_1 = true;
      this.Upload_showdisable = false;
    },
    //图片列表回显
    agree_fujianchakan(n) {
      this.Upload_showdisable = false;
      this.urls = [];
      console.log(n);
      let data = new FormData();
      let fid = n;
      data.append("fid", n);
      this.$http.post("/ac/gbf", data).then((res) => {
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
    },
    load_people1() {
      let data = new FormData();
      this.$http.post("/job/gul", data).then((res) => {
        console.log(res.data, "所有人员");
        this.allpeople4 = res.data;
      });
    },
    sureType(formName) {
      let data = new FormData();
      for (let key in this.type) {
        console.log(this.type[key], "item");
        if (this.type[key]) data.append(key, this.type[key]);
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("确认信息填写无误", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info",
          }).then(() => {
            if (this.typeCode == 100) {
              this.$http.post("/job/qsa", data).then((res) => {
                console.log(res);
                this.load4();
                this.$refs.type.resetFields();
                this.typeFormVisible = false;
              });
            } else if (this.typeCode == 200) {
              this.$http.post("/job/uq", data).then((res) => {
                console.log(res);
                this.load4();
                this.$refs.type.resetFields();
                this.typeFormVisible = false;
              });
            }
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
    updateType(index, obj) {
      this.kaoqin_title = "修改考勤类型";
      this.typeFormVisible = true;
      this.clear_f(this.type);
      console.log(index, "index");
      console.log(obj, "obj");
      this.type = JSON.parse(JSON.stringify(obj));
      this.typeCode = 200;
    },
    deleteType(index, obj) {
      let data = new FormData();
      data.append("id", obj.sid);
      this.$confirm("确认删除信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.$http.post("/job/dq", data).then((res) => {
          console.log(res);
          this.load4();
        });
      });
    },
    cancelType() {
      this.clear_f(this.type);
      this.typeFormVisible = false;
      // this.$refs.type.resetFields();
    },
    addType() {
      this.kaoqin_title = "新增考勤类型";
      this.typeFormVisible = true;
      this.typeCode = 100;
    },
    load4() {
      let data = new FormData();
      this.$http
        .post("/job/ql", data)
        .then((res) => {
          //考勤配置
          if (res.data != -1002) this.tableData_pz = res.data;
          sessionStorage.setItem("vacation", JSON.stringify(this.tableData_pz));
          console.log(this.tableData_pz, "this.tableData_pz");
        })
        .catch((error) => {
          console.log("错误");
        });
    },
    handleRemove(file, fileList) {
      //console.log(file, fileList);
    },
    handlePreview(file) {
      //console.log(file);
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
    leader_name(type, reason) {
      let message = "";
      //console.log(reason, "输出一下reason");
      //console.log(type, "输出一下type");
      if (type == null) {
        message = "未审核";
      } else if (type == "1" && reason != "null") {
        message = reason;
        // //console.log(type == "1"&& reason!=null,"2222");
      } else if (type == "1" && reason == "null") {
        message = "已通过";
      } else if (type == "0" && reason != "null") {
        message = reason;
      } else if (type == "0" && reason == "null") {
        message = "未通过";
      } else {
        //console.log("123213");
      }
      return message;
    },
    leader_name2(type) {
      //console.log(type, "输出名字");
      if (type == null) {
        return "未分配";
      } else {
        return type;
      }
    },
    handleReload() {
      this.reload(); // 在想要刷新页面的时候调用reload方法
    },
    submit_cancel() {
      this.$refs.newUpload.fileList = [];
      this.year_status = false;
      this.dialogFormVisible = false;
      this.$refs.user.resetFields();
      this.Agent1 = "";
      this.Agent2 = "";
      this.Agent3 = "";
      this.Agent4 = "";
      this.fileList = [];
      this.show1 = false;
      this.show2 = false;
      this.show3 = false;
    },
    load_people() {
      let data = new FormData();
      let t = sessionStorage.getItem("token");
      // data.append("level", type);
      data.append("t", t);
      this.$http.post("/uc/gau", data).then((res) => {
        this.allpeopleall = res.data;
        // this.allpeople = res.data
        // //console.log(this.allpeople, "所有可选人");
        // //console.log(this.options, "this.options");
      });
    },
    load_type() {
      for (let i = 1; i < 4; i++) {
        this.load_people_type(i);
      }
    },
    load_people_type(type) {
      let data = new FormData();
      data.append("level", type);
      this.$http.post("/job/gul", data).then((res) => {
        if (type == 1) {
          this.allpeople1 = res.data;
        } else if (type == 2) {
          this.allpeople2 = res.data;
        } else if (type == 3) {
          this.allpeople3 = res.data;
        }
      });
    },

    user_select() {
      let data = new FormData();
      this.$http.post("/uc/gau", data).then((res) => {
        this.user_data = Object.assign({}, res.data);
        this.user_data[0].duty = "123";
        //console.log(this.user_data[0].duty, " this.user_data");
        //console.log(res.data[0].duty);
      });
    },
    handleSelect(key, keyPath) {
      //console.log(key, keyPath);
      this.activeIndex = key;

      //console.log(this.activeIndex, "activeIndex");
      //console.log(key == this.activeIndex);
    },
    handle_xiugai(num) {
      this.user = this.tableData[num];
      this.user.agent1 = Number(this.tableData[num].agent1);
      this.user.agent2 = Number(this.tableData[num].agent2);
      this.dialogFormVisible = true;
    },
    handleEdit(num) {
      if (num == null || null == "") return false;
      let data = new FormData();
      data.append("id", num);
      data.append("t", sessionStorage.getItem("token"));
      this.$http.post("/job/qbi", data).then((res) => {
        this.user_name = res.data.uname;
        for (var item in res.data) {
          // if(item.match('agent3' ))this.agent3_sum.agent3=res.data[item];
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
            item.match("status3") ||
            item.match("agent3") ||
            item.match("reamrk3")
          ) {
            // //console.log(item,"后台成员3");
            // this.agent3_sum.status3=res.data[item]
            this.$set(this.agent3_sum, item, res.data[item]);
          }
          if (
            item.match("status4") ||
            item.match("agent4") ||
            item.match("reamrk4")
          ) {
            this.$set(this.agent4_sum, item, res.data[item]);
          }
        }
        //   function compare(property){
        //     return function(a,b){
        //     var value1 = a[property];
        //     var value2 = b[property];
        //     return value1 - value2;
        //   }
        // }
        // //console.log(arr.sort(compare('agent')))
        //console.log(this.agent1_sum, "33333");
        this.leader_1.push(this.agent1_sum);
        this.leader_1.push(this.agent2_sum);
        this.leader_1.push(this.agent3_sum);
        this.leader_1.push(this.agent4_sum);
        //console.log(this.leader_1, "审核人员轮询");

        this.isprocess = true;
        // for( var item of this.leader_1){
        //   //console.log(item,"玄幻下");
        // }
      });
    },
    jiaohuan(type) {},
    year_s() {
      // console.log(this.$refs.s_wtype.selectedLabel, "111111111111111111111111");
      this.$nextTick(() => {
        if (
          this.user.wtype == 7 ||
          this.user.wtype == 6 ||
          this.user.wtype == 5 ||
          this.user.wtype == 4
        ) {
          this.show1 = true;
          this.$message.warning("需要综合部审核");
        } else {
          this.show1 = false;
        }
        // //console.log(this.$refs.s_wtype.selectedLabel);
        // //console.log(this.$refs.s_wtype.selected.label);
        if (this.user.wtype == 9 || this.user.wtype == 8) {
          this.year_status = true;
        } else {
          this.year_status = false;
        }
      });
    },
    apply() {
      let post = Number(sessionStorage.getItem("personal_post"));
      this.personal_post = post;
      if (10 <= post && post <= 12) {
        this.show1 = false;
        this.show5 = false;
        this.show2 = true;
      } else if (post <= 9) {
        this.show1 = false;
        this.show5 = false;
        this.show2 = false;
        this.show3 = true;
      } else {
        this.show5 = true;
      }
      console.log(this.personal_post);
      let data = new FormData();
      data.append("t", sessionStorage.getItem("token"));
      this.$http.post("/job/ql", data).then((res) => {
        this.options = res.data;
      });
      this.$http.post("/job/gul", data).then((res) => {
        this.res = res.data;
        this.respon.res1 = JSON.parse(JSON.stringify(this.res));
        this.respon.res2 = JSON.parse(JSON.stringify(this.res));
        this.respon.res3 = JSON.parse(JSON.stringify(this.res));
      });
      this.Upload_showdisable = true;
      this.dialogFormVisible = true;
    },
    submit(formName) {
      if (this.personal_post >= 10 && this.personal_post <= 12) {
        if (
          this.$refs.s_wtype.selectedLabel == "年假" ||
          this.$refs.s_wtype.selectedLabel == "婚假" ||
          this.$refs.s_wtype.selectedLabel == "产假" ||
          this.$refs.s_wtype.selectedLabel == "丧假"
        ) {
          this.user.agent1 = this.Agent1;
          this.user.agent2 = this.Agent3;
          this.user.agent3 = this.Agent4;
        } else {
          this.user.agent1 = this.Agent3;
          this.user.agent2 = this.Agent4;
        }
      } else if (this.personal_post <= 9) {
        if (
          this.$refs.s_wtype.selectedLabel == "年假" ||
          this.$refs.s_wtype.selectedLabel == "婚假" ||
          this.$refs.s_wtype.selectedLabel == "产假" ||
          this.$refs.s_wtype.selectedLabel == "丧假"
        ) {
          this.user.agent1 = this.Agent1;
          this.user.agent2 = this.Agent4;
        } else {
          this.user.agent1 = this.Agent4;
        }
      } else {
        if (
          this.$refs.s_wtype.selectedLabel == "年假" ||
          this.$refs.s_wtype.selectedLabel == "婚假" ||
          this.$refs.s_wtype.selectedLabel == "产假" ||
          this.$refs.s_wtype.selectedLabel == "丧假"
        ) {
          this.show1 = true;
          this.user.agent1 = this.Agent1;
          this.user.agent2 = this.Agent2;
          this.user.agent3 = this.Agent3;
          this.user.agent4 = this.Agent4;
        } else {
          this.show1 = false;
          this.user.agent1 = this.Agent2;
          this.user.agent2 = this.Agent3;
          this.user.agent3 = this.Agent4;
        }
      }
      let data = new FormData();
      if (this.user["agent4"]) {
        this.user["lastagent"] = this.user["agent4"];
      } else if (this.user["agent3"]) {
        this.user["lastagent"] = this.user["agent3"];
      } else if (this.user["agent2"]) {
        this.user["lastagent"] = this.user["agent2"];
      } else {
        this.user["lastagent"] = this.user["agent1"];
      }
      for (let key in this.user) {
        if (this.user[key] != "" && this.user[key] != null)
          data.append(key, this.user[key]);
      }
      this.fileListid = [];
      for (const i of this.$refs.newUpload.fileList) {
        this.fileListid.push(i.raw.fid);
      }
      data.append("fids", this.fileListid);
      data.append("as", 1);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("确认信息填写无误", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info",
          })
            .then(() => {
              this.$http.post("/job/add", data).then((res) => {
                this.dialogFormVisible = false;
                this.$refs.user.resetFields();
                this.load();
                this.show1 = false;
                this.user.agent4 = "";
                this.user.agent1 = "";
                this.user.agent2 = "";
                this.user.agent3 = "";
                this.show2 = false;
                this.show3 = false;
                this.Agent1 = "";
                this.Agent2 = "";
                this.Agent3 = "";
                this.fileList = [];
                this.$refs.newUpload.fileList = [];
                this.fileListid = "";
                this.year_status = false;
              });
            })
            .catch((res) => {});
        } else {
          this.$alert("信息填写不规范或不完整", "提示", {
            confirmButtonText: "确定",
          });
          return false;
        }
      });
    },
    sendMessage() {
      this.iframeWin.postMessage(
        {
          cmd: "getFormJson",
          params: {},
        },
        "*"
      );
    },
    load() {
      let data = new FormData();
      if (this.search.type) {
        data.append("wtype", this.search.type);
      }
      if (this.search.uptime) {
        data.append("uptime", this.search.uptime);
      }
      if (this.search.downtime) {
        data.append("downtime", this.search.downtime);
      }
      this.$http.post("/job/ol", data).then((res) => {
        this.tableData = res.data;
      });
    },
  },
  filters: {
    agree_f: function (value) {
      //console.log(value, "输出具体内容+++++++++++++++");
    },
  },
  mounted() {
    this.synthesize();
    this.load_people1();
    this.qjtype();
    this.load_type();
    this.load_people();
    this.load_yearjl();
    // //console.log(this.$refs.iframe,"//console.log(this.$refs.iframe)")
    //  //console.log(this.$refs.iframe.contentWindow," //console.log(this.$refs.iframe.contentWindow)")
    // window.addEventListener("message", function(event) {
    //     //console.log('child', event.data)
    // })
    // $(window).on('message', function(event) {
    //   //console.log('child', event.originalEvent.data)
    // })
    // this.load_peoples();
    this.user_select();
    let float = sessionStorage.getItem("float");
    this.float = JSON.parse(float);
    // this.activeIndex = this.float.menu_index;
    console.log(this.float, "this.float");
    this.load();
    this.load4();
  },

  beforeRouteLeave(to, from, next) {
    this.float.menu_index = this.activeIndex;
    let float = JSON.stringify(this.float);
    sessionStorage.setItem("float", float);
    next();
    // //console.log(this.float,'float')
  },
};
</script>
<style scoped>
.qjbeizhuc .el-textarea {
  width: 100%;
  height: 50px;
}
.qjbeizhuc /deep/ .el-textarea__inner {
  min-height: 117.9886px !important;
}
.body .el-table::before {
  z-index: inherit;
}
.text-shenglue {
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  white-space: nowrap;
  width: 30px;
  height: 30px;
  word-wrap: break-word;
  word-break: break-all;
  /* display:block; */
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
  /* margin-top: 40px; */
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
  flex-direction: row-reverse;
  padding: 1.7% 2.1%;
  margin-top: 7px;
}
.table_top1 {
  display: flex;
  justify-content: start;
  padding: 1.7% 2.1%;
  margin-top: 7px;
}
.table_top1 input {
  width: 460px;
  height: 36px;
  background: rgba(239, 239, 239, 1);
  border: 0;
  border-radius: 19px;
  margin-right: 43px;
  padding-left: 10px;
}
.table_top2 {
  flex-direction: row-reverse;
  padding: 1.7% 2.1%;
  margin-top: 7px;
}
.table_top input {
  width: 460px;
  height: 36px;
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
.table_top {
  display: flex;
  justify-content: space-between;
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
.fenguan_form /deep/ .el-form-item__label {
  width: 124px !important;
}
</style>
