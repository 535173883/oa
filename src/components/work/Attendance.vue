<template>
  <!-- 考勤管理 -->
  <div class="Attendance">
    <div class="menu">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item v-for="(item, index) of menu" :key="index" :index="item.id">{{ item.name }}</el-menu-item>
      </el-menu>
    </div>
    <!-- 假期类型 -->
    <div class="content" v-show="activeIndex == '15'">
      <div class="table_top">
        <input type="text" v-model="content4_v" placeholder="搜索请假类别" />
        <el-button type="primary" style="width: 120px;" @click="addType" v-has="111">添加</el-button>
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
            <span>{{ scope.row.reamrk }}</span>
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
              <span style="color:grey" v-has="1004">暂无</span>
            </div>
          </template>
        </el-table-column>
      </el-table>

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
          <el-form-item label="备注" :label-width="formLabelWidth" prop="reamrk">
            <el-input v-model="type.reamrk"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelType" style="width: 120px;">取 消</el-button>
          <el-button type="primary" @click="sureType('type')" style="width: 120px;">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 考勤信息导入 -->
    <div class="content" v-show="activeIndex == '14'">
      <div v-show="!ischeck">
        <div class="table_top">
          <div>
            <span style="line-height: 31px;">用户姓名 ：</span>
            <input type="text" v-model="content3_v" placeholder="搜索用户姓名" style="width:150px" />
            <span style="line-height: 31px;">日期选择 ：</span>
            <el-date-picker v-model="value2" type="month" placeholder="选择月" value-format="yyyy-MM"></el-date-picker>
            <el-button
              style="margin-left:30px"
              icon="el-icon-search"
              type="primary"
              @click="search_kq()"
            ></el-button>
          </div>
          <el-button type="primary" style="margin-left:20px" @click="daoru()" v-has="121">导入</el-button>
          <el-button type="success" @click="kaoqin_time()" v-has="121">设置考勤统计时间</el-button>
          <!-- <el-button type="primary" @click="daochu()">导出</el-button> -->
          <!-- Form新增表单  kaoqintimeFormVisible -->
          <el-dialog
            title="导入考勤信息"
            :visible.sync="kaoqinFormVisible"
            :show-close="false"
            :close-on-click-modal="false"
          >
            <el-form>
              <el-form-item label="假期选择：">
                <el-date-picker
                  type="dates"
                  v-model="value_date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择节假日信息如：国庆节、中秋节等。"
                  style="width:80%"
                ></el-date-picker>
              </el-form-item>
            </el-form>
            <!-- <dateform></dateform> -->
            <div style="display:flex;justify-content:space-between">
              <div>
                <span>上传附件：</span>
                <a href="javascript:;" @click="downform()">{{ file_name }}</a>
              </div>
              <div>
                <a href="javascript:;" :class="[isActive ? 'file' : 'file_1']">
                  <input type="file" id="myFile" @change="upload_excel($event)" />上传附件
                </a>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelkaoqin()" style="width: 120px;">取 消</el-button>
              <el-button type="primary" @click="surekaoqin()" style="width: 120px;">确 定</el-button>
            </div>
          </el-dialog>
          <!-- 考勤时间设置 -->
          <el-dialog
            title="设置考勤时间"
            :visible.sync="kaoqintimeFormVisible"
            width="40%"
            :show-close="false"
            :close-on-click-modal="false"
          >
            <el-form label-width="200px">
              <el-form-item label="时间选择：">
                <div style="display:flex;flex-direction:row;">
                  <el-time-select
                    placeholder="起始时间"
                    v-model="kaoqin_ti"
                    :picker-options="{
                      start: '06:00',
                      step: '00:15',
                      end: '24:00'
                    }"
                  ></el-time-select>
                  <el-time-select
                    placeholder="结束时间"
                    v-model="kaoqin_tiend"
                    :picker-options="{
                      start: '06:00',
                      step: '00:15',
                      end: '24:00'
                    }"
                  ></el-time-select>
                </div>
              </el-form-item>
            </el-form>
            <!-- <dateform></dateform> -->
            <div slot="footer" class="dialog-footer">
              <el-button
                style="width: 120px;"
                @click="(kaoqintimeFormVisible = false), (kaoqin_ti = '')"
              >取 消</el-button>
              <el-button type="primary" @click="kaoqintime_queren()" style="width: 120px;">确 定</el-button>
            </div>
          </el-dialog>
        </div>
        <el-table
          :data="tableData_tj"
          style="width: 95.8%;margin:0 2.1%;height:350px;overflow:auto"
          align="center"
          height="430"
          border
          header-cell-class-name="t_h"
        >
          <el-table-column label="姓名" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.uname }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="正常出勤" align="center">
            <template slot-scope="scope">
              <span
                :style="scope.row.atttenddays!=0?'color:#0089FA':'' "
              >{{ scope.row.atttenddays==0?'无':scope.row.atttenddays }}</span>
            </template>
          </el-table-column>-->
          <el-table-column label="请假" align="center">
            <template slot-scope="scope">
              <span
                :style="scope.row.leavedays != 0 ? 'color:#e6a23c' : ''"
                style="cursor:pointer"
                @click="qingjiatz(scope.row,1)"
              >
                {{
                scope.row.leavedays == 0 ? "无" : scope.row.leavedays
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="迟到" align="center">
            <template slot-scope="scope">
              <span :style="scope.row.latedays != 0 ? 'color:red' : ''">
                {{
                scope.row.latedays == 0 ? "无" : scope.row.latedays
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="早退" align="center">
            <template slot-scope="scope">
              <span :style="scope.row.leaveearlydays != 0 ? 'color:#67c23a' : ''">
                {{
                scope.row.leaveearlydays == 0
                ? "无"
                : scope.row.leaveearlydays
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="出差" align="center">
            <template slot-scope="scope">
              <span
                :style="scope.row.evectiondays != 0 ? 'color:#0089FA' : ''"
                style="cursor:pointer"
                @click="qingjiatz(scope.row,0)"
              >
                {{
                scope.row.evectiondays == 0 ? "无" : scope.row.evectiondays
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="缺勤" align="center">
            <template slot-scope="scope">
              <span :style="scope.row.absenteeismdays != 0 ? 'color:red' : ''">
                {{
                scope.row.absenteeismdays == 0
                ? "无"
                : scope.row.absenteeismdays
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="时间" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.month }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div class="operation">
                <span style="color:#3399FF" @click="examine(scope.$index, scope.row)">查看</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <div class="block">
          <span class="demonstration">每页10条</span>
          <el-pagination
            @current-change="handleCurrentChange3"
            :current-page.sync="currentPage3"
            :page-size="pageSize3"
            layout="prev, pager, next, jumper"
            :total="total3"
          ></el-pagination>
        </div>
      </div>
      <div v-if="ischeck" style="height: 100%;">
        <div class="calender" style="height: 100%;">
          <div
            id="dateOuter"
            style="height: 100%;margin-top: 10px;border-radius: 5px;text-align:start;"
          >
            <!--表体-->
            <div id="attendwrap" style="height: 100%;background: #f5f5f5;">
              <div
                id="attendwrapleft"
                style="width: 62%;height: 100%;float: left;background: #fff;"
              >
                <div
                  class="attendtittle"
                  style="height: 51px;line-height: 51px;border-bottom: 1px solid  #E6E6EB;"
                >
                  <span
                    style="margin-left: 16px;font-size: 16px;color: #333;font-weight: bold;"
                  >工作日历</span>
                  <!-- <span
                    style="width: 44px;height: 24px;border: 1px solid #E6E6EB;padding:4px 8px;cursor: pointer;border-radius: 4px;font-size: 14px;color: #333;margin-left: 44px;"
                    @click.prevent="getThisDay()"
                  >今天</span>-->
                  <span
                    style="margin-left: 17px;color:  #8E8E93;cursor: pointer;"
                    @click.stop.prevent="lastMonthClick()"
                  ></span>
                  <span
                    style="margin-left: 18px;color:  #8E8E93;cursor: pointer;"
                    @click.stop.prevent="nextMonthClick()"
                  ></span>
                  <span style="font-size: 14px;color: #2D2D2D;margin-left: 17px;">{{ checkYear }}年</span>
                  <span style="font-size: 14px;color: #2D2D2D;">{{ checkMonth }}月</span>
                  <span style="font-size: 14px;color: #2D2D2D;margin-left: 18px;">{{kaoq_username}}</span>
                </div>
                <div class="everyWeekDay">
                  <span v-for="(item, index) in weekDays" class="weekday" :key="index">
                    <span
                      v-if="item == '日' || item == '六'"
                      class="weekday"
                      style="color:#0089FA;"
                    >{{ item }}</span>
                    <span class="weekday" style="color:#888;" v-else>
                      {{
                      item
                      }}
                    </span>
                  </span>
                </div>
                <div class="everyDay">
                  <!--空白站位-->
                  <span v-for="(item1, index) in ThisWeekDayCounrt" :key="index" class="days"></span>
                  <!--这个月的天数-->
                  <span
                    @mouseenter="getdate(index)"
                    @click="getdate1(index)"
                    @mouseleave="theday = null"
                    v-for="(item, index) in calData"
                    :key="item.data"
                    class="days"
                    ref="current"
                  >
                    <!--今天-->
                    <!-- <span
                      v-if="checkYear == nowYear && checkMonth == nowMonth && index+1 == nowDay"
                      style="position: relative;"
                      
                    >
                      
                      <div v-if="index==theday" class="ts">
                        <p v-for="(ele,i) in item.type.times" :key="i">{{ele}}</p>
                        <p v-if="item.type.times.length==0">无打卡记录</p>
                      </div>
                      <span
                        v-if="cumWeekDayCounrt(index+1) == 6 || cumWeekDayCounrt(index+1) == 0"
                        class="days"
                        style="width:100%;cursor:pointer;"
                      >
                        <span
                          style="background-color:#4eccc4;color:#FFFFFF;padding:4px 10px;border-radius: 100%;"
                        >{{index+1}}</span>
                      </span>
                      <span
                        v-else
                        class="days"
                        style="width:100%; cursor:pointer;border-radius: 100%;"
                      >
                        <span
                         
                        >{{index+1}}</span>
                      </span>
                   
                      <span v-if="item.date==index+1">
                        <span
                          style="position: absolute;bottom: -12px;right:30px;border-radius: 100%;width: 6px;height: 6px;background: #f00;"
                          v-if="item.type.status==5"
                        ></span>
                        <div
                          v-if="item.type.status==1"
                          :style="{position: 'absolute',bottom: '0px',right: 14+'px',color: '#FF54E8',fontSize: '12px'}"
                        >迟</div>
                        <div
                          v-if="item.type.status==2"
                          :style="{position: 'absolute',bottom: '0px',right: 14+'px',color: '#00A753',fontSize: '12px'}"
                        >早</div>
                        <div
                          v-if="item.type.status==3"
                          :style="{posupselect_sition: 'absolute',bottom: '0px',right: 14+'px',color: '#FF9500',fontSize: '12px'}"
                        >假</div>
                        <div
                          v-if="item.type.status==4"
                          :style="{position: 'absolute',bottom: '0px',right: 14+'px',color: '#9569FE',fontSize: '12px'}"
                        >差</div>
                        <div
                          v-if="item.type.status==5"
                          :style="{position: 'absolute',bottom: '0px',right: 14+'px',color: '#f00',fontSize: '12px'}"
                        >假</div>
                      </span>
                      
                    </span>-->
                    <!-- :style="[day_css[index+1]==1?'position: relative;':'position: relative']" -->
                    <!--循环日历上面的状态 over-->
                    <span
                      :class="[
                        day_css[index + 1] == true ? 'select_s' : 'upselect_s'
                      ]"
                      @click="every_change(item, index + 1)"
                    >
                      <div v-show="index === theday" class="ts">
                        <p v-for="(ele, i) in item.type.times" :key="i">{{ ele }}</p>
                        <p v-if="item.type.times.length == 0">无打卡记录</p>
                      </div>
                      <!-- 周末加载 -->
                      <span
                        v-if="
                          cumWeekDayCounrt(index + 1) == 6 ||
                            cumWeekDayCounrt(index + 1) == 0
                        "
                        :class="[
                          day_css[index + 1] == true
                            ? 'select_s'
                            : 'upselect_s2'
                        ]"
                        key="1"
                      >{{ index + 1 }}</span>
                      <!-- :style="[day_css[index+1]==true?'color:red;position: relative':'cursor:pointer;position: relative']" -->
                      <span v-else key="2">{{ index + 1 }}</span>
                      <!--循环日历上面的状态-->
                      <span v-if="item.date == index + 1">
                        <!-- <span
                          style="position: absolute;bottom: -10px;right:2px;border-radius: 100%;width: 6px;height: 6px;background: #f00;"
                          v-if="item.type.status==1"
                        ></span>-->
                        <div
                          v-if="item.type.status == 3"
                          :style="{
                            position: 'absolute',
                            bottom: '0px',
                            right: -14 + 'px',
                            color: '#FF54E8',
                            fontSize: '12px'
                          }"
                        >迟</div>
                        <div
                          v-if="item.type.status == 4"
                          :style="{
                            position: 'absolute',
                            bottom: '0px',
                            right: -14 + 'px',
                            color: '#00A753',
                            fontSize: '12px'
                          }"
                        >早</div>
                        <div
                          v-if="item.type.status == 5"
                          :style="{
                            position: 'absolute',
                            bottom: '0px',
                            right: -14 + 'px',
                            color: '#FF9500',
                            fontSize: '12px'
                          }"
                        >缺</div>
                        <div
                          v-if="item.type.status == 0"
                          :style="{
                            position: 'absolute',
                            bottom: '0px',
                            right: -14 + 'px',
                            color: '#9569FE',
                            fontSize: '12px'
                          }"
                        >差</div>
                        <div
                          v-if="item.type.status == 1"
                          :style="{
                            position: 'absolute',
                            bottom: '0px',
                            right: -14 + 'px',
                            color: '#f00',
                            fontSize: '12px'
                          }"
                        >假</div>
                        <div
                          v-if="item.type.status == 7"
                          :style="{
                            position: 'absolute',
                            bottom: '0px',
                            right: -14 + 'px',
                            color: '#f00',
                            fontSize: '12px'
                          }"
                        >无</div>
                      </span>
                      <!--循环日历上面的状态 over-->
                    </span>
                  </span>
                </div>
                <div style="text-align:center;margin-top:50px;">
                  <el-button @click="xiugai_return()" style="width: 120px;">返回</el-button>
                  <el-button
                    type="warning"
                    @click="xiugai_enter()"
                    v-has="122"
                    style="width: 120px;"
                  >修改</el-button>
                </div>
                <el-dialog
                  title="修改当日状态"
                  :visible.sync="dayFormVisible"
                  :show-close="false"
                  :close-on-click-modal="false"
                >
                  <el-form>
                    <el-form-item label="当日状态：" prop="atype">
                      <el-select v-model="day_ststus" placeholder="请选择" clearable>
                        <el-option label="正常出勤" value="2"></el-option>
                        <el-option label="迟到" value="3"></el-option>
                        <el-option label="早退" value="4"></el-option>
                        <el-option label="缺勤" value="5"></el-option>
                        <el-option label="出差" value="0"></el-option>
                        <el-option label="请假" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="dayFormVisible = false" style="width: 120px;">取 消</el-button>
                    <el-button type="primary" @click="day_xiugai()" style="width: 120px;">确 定</el-button>
                  </div>
                </el-dialog>
              </div>
              <div
                class="attendwrapright"
                style="float: right;width: 36%;height: 100%;background: #f5f5f5;text-align: center;"
              >
                <!-- <div class="chart">
                  <span>正常出勤</span>
                  <div>
                    <span>{{this.res.atttenddays}}</span>
                    <span>天</span>
                  </div>
                </div>-->
                <div class="chart">
                  <span>请假</span>
                  <div>
                    <span>{{ this.res.leavedays }}</span>
                    <span>天</span>
                  </div>
                </div>
                <div class="chart">
                  <span>迟到</span>
                  <div>
                    <span>{{ this.res.latedays }}</span>
                    <span>天</span>
                  </div>
                </div>
                <div class="chart">
                  <span>出差</span>
                  <div>
                    <span>{{ this.res.evectiondays }}</span>
                    <span>天</span>
                  </div>
                </div>
                <div class="chart">
                  <span>缺勤</span>
                  <div>
                    <span>{{ this.res.absenteeismdays }}</span>
                    <span>天</span>
                  </div>
                </div>
                <div class="chart">
                  <span>早退</span>
                  <div>
                    <span>{{ this.res.leaveearlydays }}</span>
                    <span>天</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 请假审批 -->
    <div class="content" v-show="activeIndex == '11'">
      <div class="table_top">
        <span style="line-height: 31px;">用户姓名 ：</span>
        <input v-model="content1_v" type="text" placeholder="搜索用户姓名" style="width:150px" />
        <!-- <span style="line-height: 31px;">请假日期 ：</span>
        <el-date-picker
          style="margin-right:20px"
          v-model="value3"
          type="month"
          placeholder="所有请假信息日期筛选"
          value-format="yyyy-MM"
          @change="leave_all(value3)"
        ></el-date-picker>-->
        <!-- <el-button
          style="margin-left:20px"
          type="primary"
          @click="load1(), (leave_s = false)"
          v-has="181"
        >查看审核信息</el-button>-->
        <el-button type="success" @click="leave_all1()" v-has="181">查看所有请假</el-button>
      </div>
      <el-table
        :data="
          tableData_qj
            .filter(
              data =>
                !content1_v ||
                data.uname.toLowerCase().includes(content1_v.toLowerCase())
            )
            .slice(
              (this.currentPage1 - 1) * this.pageSize,
              this.currentPage1 * this.pageSize
            )
        "
        style="width: 95.8%; margin:0 2.1%;height:500px;overflow:auto"
        align="center"
        height="430"
        border
        header-cell-class-name="t_h"
      >
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.uname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="请假类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.wtype | wtype_f }}</span>
          </template>
        </el-table-column>
        <el-table-column label="请假原因" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer">
              {{
              scope.row.reason
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="请假时长(天)" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.qjtime }}</span>
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
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span
              v-show="!leave_s"
              :class="
                scope.row.ownstatus == 0
                  ? 'color_red'
                  : scope.row.ownstatus == 1
                  ? 'color_green'
                  : 'color_blue'
              "
            >{{ scope.row.ownstatus | ownstatus_f }}</span>
            <span
              v-show="leave_s"
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
              <el-button
                type="text"
                @click="
                  agree_chakan(
                    scope.row.wid,
                    scope.row.fids,
                    scope.row,
                    scope.row.ownstatus
                  )
                "
              >
                {{
                scope.row.ownstatus === null ? shengpi_1 : chakan_1
                }}
              </el-button>
              <!-- <el-button
                type="text"
                :disabled="scope.row.ownstatus|agree_f"
                @click="agree(scope.$index, scope.row,1,1)"
              >同意</el-button>
              <el-button
                type="text"
                :disabled="scope.row.ownstatus|agree_f"
                @click="agree(scope.$index, scope.row,1,0)"
              >拒绝</el-button>
              <el-button type="text" @click="open_reason(scope.row.ownreamrk)">查看审核意见</el-button>-->
            </div>
            <!-- <div v-if="leave_s">
              <el-button type="text" :disabled="true">暂无</el-button>
            </div>
            <div v-if="scope.row.ownstatus == 1 || scope.row.ownstatus == 2"></div>-->
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
            tableData_qj.filter(
              data =>
                !content1_v ||
                data.uname.toLowerCase().includes(content1_v.toLowerCase())
            ).length
          "
        ></el-pagination>
      </div>
    </div>
    <!-- 出差审批 -->
    <div class="content" v-show="activeIndex == '12'">
      <div class="table_top">
        <span style="line-height: 31px;">用户姓名 ：</span>
        <input
          type="text"
          v-model="content2_v"
          placeholder="搜索用户姓名"
          style="width:150px; margin-right:20px"
        />
        <!-- <el-button type="primary" @click="load2(), (ob_s = false)" v-has="181">查看审核信息</el-button> -->
        <el-button type="success" @click="ob_all()" v-has="181">查看所有出差</el-button>
      </div>
      <el-table
        :data="
          tableData_cc
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

        <el-table-column label="开始时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.uptime | time_t }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.downtime || scope.row.estimateendtime | time_t }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出差时长(天)" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.qjtime || scope.row.estimateupdays }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出差地点" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer;">{{ scope.row.c }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出差人员" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer;">
              {{
              scope.row.accompanypeople
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="出差事由" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer;">{{ scope.row.reason }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span
              v-show="!ob_s"
              :class="
                scope.row.ownstatus == 0
                  ? 'color_red'
                  : scope.row.ownstatus == 1
                  ? 'color_green'
                  : 'color_blue'
              "
            >{{ scope.row.ownstatus | ownstatus_f }}</span>
            <span
              v-show="ob_s"
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
            <div class="operation" v-if="!ob_s">
              <el-button type="text" @click="agree_OnBusiness(scope.row)">
                {{
                scope.row.ownstatus == null ? shengpi_1 : chakan_1
                }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <span class="demonstration">每页10条</span>
        <el-pagination
          :current-page.sync="currentPage2"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="
            tableData_cc.filter(
              data =>
                !content2_v ||
                data.uname.toLowerCase().includes(content2_v.toLowerCase())
            ).length
          "
        ></el-pagination>
      </div>
    </div>
    <!-- 加班审批 -->
    <div class="content" v-show="activeIndex == '13'">
      <div class="table_top">
        <span style="line-height: 31px;">用户姓名 ：</span>
        <input type="text" v-model="content5_v" placeholder="搜索用户姓名" style="width:150px" />
        <!-- <el-button type="primary" @click="load5(), (ov_s = false)" v-has="181">查看审核信息</el-button> -->
        <el-button type="success" @click="overtime_all()" v-has="181">查看所有加班</el-button>
      </div>
      <el-table
        :data="
          tableData_jb
            .filter(
              data =>
                !content5_v ||
                data.uname.toLowerCase().includes(content5_v.toLowerCase())
            )
            .slice(
              (this.currentPage5 - 1) * this.pageSize,
              this.currentPage5 * this.pageSize
            )
        "
        style="width: 95.8%;margin:0 2.1%;height:500px;overflow:auto"
        align="center"
        height="430"
        border
        header-cell-class-name="t_h"
      >
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.uname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="加班时长(时)" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.qjtime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="加班原因" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer">
              {{
              scope.row.reason
              }}
            </span>
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
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span
              v-show="!ov_s"
              :class="
                scope.row.ownstatus == 0
                  ? 'color_red'
                  : scope.row.ownstatus == 1
                  ? 'color_green'
                  : 'color_blue'
              "
            >{{ scope.row.ownstatus | ownstatus_f }}</span>
            <span
              v-show="ov_s"
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
              <el-button type="text" @click="agree_overtime(scope.row)">
                {{
                scope.row.ownstatus == null ? shengpi_1 : chakan_1
                }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <span class="demonstration">每页10条</span>
        <el-pagination
          :current-page.sync="currentPage5"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="
            tableData_jb.filter(
              data =>
                !content5_v ||
                data.uname.toLowerCase().includes(content5_v.toLowerCase())
            ).length
          "
        ></el-pagination>
      </div>
      <!-- Form新增表单 -->
      <!-- <el-dialog title="新增请假类型" :visible.sync="typeFormVisible" :close-on-click-modal="false">
        <el-form :model="type" ref="type">
          <el-form-item label="请假类型" :label-width="formLabelWidth" prop="jiaqileixing">
            <el-input v-model="type.jiaqileixing"></el-input>
          </el-form-item>
          <el-form-item label="最小单位" :label-width="formLabelWidth" prop="unit">
            <el-input v-model="type.unit"></el-input>
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth" prop="reamrk">
            <el-input v-model="type.reamrk"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelType">取 消</el-button>
          <el-button type="primary" @click="sureType()">确 定</el-button>
        </div>
      </el-dialog>-->
    </div>
    <!-- 抄送列表 -->
    <div class="content" v-show="activeIndex == '16'">
      <div class="table_top">
        <span style="line-height: 31px;">用户姓名 ：</span>
        <input v-model="content6_v" type="text" placeholder="搜索用户姓名" style="width:150px" />
        <!--  <el-date-picker
	       v-has="181"
	       v-model="value3"
	       type="month"
	       placeholder="所有请假信息日期筛选"
	       value-format="yyyy-MM"
	       @change="leave_all(value3)"
        ></el-date-picker>-->
        <!-- <el-button type="primary" @click="load1(),leave_s=false" v-has="181">查看审核信息</el-button> -->
        <!-- <el-button type="success" @click="leave_all()" v-has="181">查看所有请假</el-button> -->
      </div>
      <el-table
        :data="
          tableData_cs
            .filter(
              data =>
                !content6_v ||
                data.uname.toLowerCase().includes(content6_v.toLowerCase())
            )
            .slice(
              (this.currentPage1 - 1) * this.pageSize,
              this.currentPage1 * this.pageSize
            )
        "
        style="width: 95.8%; margin:0 2.1%;height:500px;overflow:auto"
        align="center"
        height="430"
        border
        header-cell-class-name="t_h"
      >
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.uname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.approvaltype | wtype_f }}</span>
          </template>
        </el-table-column>
        <el-table-column label="原因" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer">
              {{
              scope.row.reason
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="时长(天)" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.qjtime }}</span>
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
        <!-- <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span
              v-if="!leave_s"
              :class="(scope.row.ownstatus==0)?'color_red':(scope.row.ownstatus==1?'color_green':'color_blue')"
            >{{ scope.row.ownstatus| ownstatus_f }}</span>
            <span
              v-if="leave_s"
              :class="(scope.row.result==0)?'color_red':(scope.row.result==1?'color_green':'color_blue')"
            >{{ scope.row.result|ownstatus_f2}}</span>
          </template>
        </el-table-column>-->
        <!-- <el-table-column label="操作" align="center">
	       <template slot-scope="scope">
	         <div class="operation" v-if="!leave_s">
	           <el-button
	             type="text"
	             :disabled="scope.row.ownstatus|agree_f"
	             @click="agree(scope.$index, scope.row,1,1)"
	           >同意</el-button>
	           <el-button
	             type="text"
	             :disabled="scope.row.ownstatus|agree_f"
	             @click="agree(scope.$index, scope.row,1,0)"
	           >拒绝</el-button>
	           <el-button type="text" @click="open_reason(scope.row.ownreamrk)">查看审核意见</el-button>
	         </div>
	         <div v-if="leave_s">
	           <el-button type="text" :disabled="true">暂无</el-button>
	         </div>
	         <div v-if="scope.row.ownstatus==1||scope.row.ownstatus==2"></div>
	       </template>
        </el-table-column>-->
      </el-table>
      <!--分页-->
      <div class="block">
        <span class="demonstration">每页10条</span>
        <el-pagination
          :current-page.sync="currentPage1"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="
            tableData_cs.filter(
              data =>
                !content6_v ||
                data.uname.toLowerCase().includes(content6_v.toLowerCase())
            ).length
          "
        ></el-pagination>
      </div>
    </div>
    <!-- 请假审批弹窗 -->
    <el-dialog
      title="请假申请"
      :visible.sync="dialogFormVisible_1"
      width="40%"
      :close-on-click-modal="false"
      @close="dialogFormVisible_1close"
    >
      <el-form :model="user" ref="user" disabled>
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
              default-time="8:00:00"
              style="width:95%"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="请假时长(天)：" :label-width="formLabelWidth" prop="qjtime">
          <el-input v-model="user.qjtime" autocomplete="off" style="width:95%"></el-input>
        </el-form-item>
        <el-form-item label="请假类型：" :label-width="formLabelWidth" prop="wtype">
          <div style="margin-left:15px;display:flex;flex-direction:row;width:95%">
            <el-select v-model="user.wtype" placeholder="请选择" style="width:30%" ref="s_wtype">
              <el-option
                v-for="item in options1"
                :key="item.sid"
                :label="item.jiaqileixing"
                :value="item.sid"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="请假原因：" :label-width="formLabelWidth" prop="reason">
          <el-input v-model="user.reason" autocomplete="off" style="width:95%"></el-input>
        </el-form-item>
        <el-form-item
          label="综合部审核："
          :label-width="formLabelWidth"
          prop="agent1"
          v-show="user.agent1"
        >
          <el-select v-model="user.agent1" placeholder style="width:95%" clearable>
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
          v-show="user.reamrk1"
        >
          <el-input v-model="user.reamrk1" style="width:95%"></el-input>
        </el-form-item>
        <el-form-item
          label="部门审批："
          :label-width="formLabelWidth"
          prop="agent2"
          class="bumensp"
          v-show="user.agent2"
        >
          <el-select v-model="user.agent2" placeholder style="width:95%" clearable>
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
          v-show="user.reamrk2"
        >
          <el-input v-model="user.reamrk2" style="width:95%"></el-input>
        </el-form-item>
        <el-form-item label="分管秘书长审批：" label-width="125px" prop="agent3" v-show="user.agent3">
          <el-select v-model="user.agent3" placeholder style="width:95%" clearable>
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
          v-show="user.reamrk3"
        >
          <el-input v-model="user.reamrk3" style="width:95%"></el-input>
        </el-form-item>
        <el-form-item
          label="秘书长审批："
          :label-width="formLabelWidth"
          prop="agent4"
          v-show="user.agent4"
        >
          <el-select v-model="user.agent4" placeholder style="width:95%" clearable>
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
          v-show="user.reamrk4"
        >
          <el-input v-model="user.reamrk4" style="width:95%"></el-input>
        </el-form-item>
        <el-form-item
          label="附件  ："
          :label-width="formLabelWidth"
          prop="mid"
          style="text-align: left;"
        >
          <span v-show="yupianjiazai">未上传附件</span>
          <newUpload ref="newUpload1" :Upload_showdisable="Upload_showdisable"></newUpload>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
        style="display: flex;
    justify-content: flex-end;"
      >
        <el-button type="primary" v-if="Approval" @click="submit_cancel()" style="width: 120px;">确 定</el-button>
        <el-button @click="submit_cancel()" type="info" style="width: 120px;" v-if="!Approval">取 消</el-button>
        <div style="width:5%" v-if="!Approval"></div>
        <el-button
          @click="agree(shenpi, 1, 1)"
          style="width: 120px;"
          v-has="152"
          type="primary"
          v-if="!Approval"
        >同意</el-button>
        <div style="width:5%" v-if="!Approval"></div>
        <el-button
          @click="agree(shenpi, 1, 0)"
          style="width: 120px;"
          type="danger"
          v-if="!Approval"
        >拒绝</el-button>
      </div>
    </el-dialog>
    <!-- 出差审批窗口 -->
    <el-dialog
      title="出差审批"
      width="40%"
      :visible.sync="dialogFormVisible_2"
      :close-on-click-modal="false"
      @close="dialogFormVisible_2close"
    >
      <el-form
        :data="user_onbusiness"
        :model="user_onbusiness"
        ref="user_onbusiness"
        label-width="100px"
        disabled
      >
        <el-form-item label="开始时间：" :label-width="formLabelWidth" prop="uptime">
          <div class="block">
            <el-date-picker
              v-model="user_onbusiness.uptime"
              type="date"
              placeholder="选择日期时间"
              style="width:95%"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="结束时间：" :label-width="formLabelWidth" prop="estimateendtime">
          <div class="block">
            <el-date-picker
              style="width:95%"
              v-model="user_onbusiness.estimateendtime"
              type="date"
              placeholder="选择日期时间"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="出差天数：" :label-width="formLabelWidth" prop="estimateupdays">
          <el-input v-model="user_onbusiness.estimateupdays" style="width:95%"></el-input>
        </el-form-item>
        <!-- v-model="user_onbusiness.accompanypeople" -->
        <el-form-item label="出差人员：" :label-width="formLabelWidth" prop="accompanypeople">
          <el-input v-model="user_onbusiness.accompanypeople" style="width:95%"></el-input>
        </el-form-item>
        <el-form-item label="出差地点：" :label-width="formLabelWidth" prop="leaveaddrtype">
          <el-select style="width:95%" v-model="user_onbusiness.leaveaddrtype">
            <el-option label="国内" value="0"></el-option>
            <el-option label="国外" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="具体地点：" :label-width="formLabelWidth" prop="leaveaddr">
          <el-input v-model="user_onbusiness.leaveaddr" style="width:95%"></el-input>
        </el-form-item>
        <el-form-item label="出差事由：" :label-width="formLabelWidth" prop="reason">
          <el-input v-model="user_onbusiness.reason" type="textarea" style="width:95%"></el-input>
        </el-form-item>
        <el-form-item label="备注：" :label-width="formLabelWidth" prop="reamrk">
          <el-input v-model="user_onbusiness.reamrk" style="width:95%"></el-input>
        </el-form-item>
        <el-form-item label="审批人：" :label-width="formLabelWidth" prop="agent1">
          <el-select v-model="user_onbusiness.agent1" placeholder style="width:95%" clearable>
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
        <el-form-item
          label="审核意见： "
          :label-width="formLabelWidth"
          prop="reamrk1"
          v-show="user_onbusiness.reamrk1"
        >
          <el-input v-model="user_onbusiness.reamrk1" style="width:95%"></el-input>
        </el-form-item>
        <!-- <el-form-item
          label="上传附件："
          :label-width="formLabelWidth"
          prop="mid"
          style="text-align: left;"
        >
          <newUpload ref="newUpload"></newUpload>
        </el-form-item>-->
        <el-form-item
          label="附件  ："
          :label-width="formLabelWidth"
          prop="mid"
          style="text-align: left;"
        >
          <span v-show="yupianjiazai">未上传图片附件</span>
          <newUpload ref="newUpload2" :Upload_showdisable="Upload_showdisable"></newUpload>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
        style="display:flex;margin-bottom:20px;justify-content:flex-end;"
      >
        <el-button
          type="primary"
          v-if="Approval_onbusiness1"
          style="width: 120px;"
          @click="submit_cancel2()"
        >确 定</el-button>
        <el-button
          type="info"
          style="width: 120px;"
          @click="submit_cancel2()"
          v-if="!Approval_onbusiness1"
        >取 消</el-button>
        <div style="width:5%" v-if="!Approval_onbusiness1"></div>
        <el-button
          style="width: 120px;"
          type="primary"
          @click="agree(Approval_onbusiness, 0, 1)"
          v-if="!Approval_onbusiness1"
        >同意</el-button>
        <div style="width:5%" v-if="!Approval_onbusiness1"></div>
        <el-button
          style="width: 120px;"
          type="danger"
          @click="agree(Approval_onbusiness, 0, 0)"
          v-if="!Approval_onbusiness1"
        >拒绝</el-button>
      </div>
    </el-dialog>
    <!-- 加班审批窗口 -->
    <el-dialog
      title="加班审批"
      :visible.sync="dialogFormVisible_3"
      @close="dialogFormVisible_3close"
      :close-on-click-modal="false"
      width="30%"
    >
      <el-form ref="user_overtime" label-width="100px" :model="user_overtime" disabled>
        <el-form-item label="开始时间：" :label-width="formLabelWidth" prop="uptime">
          <div class="block">
            <el-date-picker
              v-model="user_overtime.uptime"
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
              v-model="user_overtime.downtime"
              type="datetime"
              placeholder="选择日期时间"
              style="width:95%"
              default-time="8:00:00"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="加班时长(时)：" :label-width="formLabelWidth" prop="qjtime">
          <el-input v-model="user_overtime.qjtime" style="width:95%"></el-input>
        </el-form-item>

        <el-form-item label="加班地点：" :label-width="formLabelWidth" prop="leaveaddr">
          <el-input v-model="user_overtime.leaveaddr" style="width:95%"></el-input>
        </el-form-item>
        <el-form-item label="加班事由：" :label-width="formLabelWidth" prop="reason">
          <textarea v-model="user_overtime.reason" cols="30" rows="10" style="width:95%"></textarea>
        </el-form-item>
        <el-form-item label="备注：" :label-width="formLabelWidth" prop="reamrk">
          <el-input v-model="user_overtime.reamrk" style="width:95%"></el-input>
        </el-form-item>
        <el-form-item label="部门审批：" :label-width="formLabelWidth" prop="agent1">
          <el-select v-model="user_overtime.agent1" style="width:95%" clearable>
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
        <el-form-item
          label="审核意见： "
          :label-width="formLabelWidth"
          prop="reamrk1"
          v-show="user_overtime.reamrk1"
        >
          <el-input v-model="user_overtime.reamrk1" style="width:95%"></el-input>
        </el-form-item>
        <el-form-item
          label="分秘书长审批："
          :label-width="formLabelWidth"
          prop="agent2"
          v-if="user_overtime.agent2"
        >
          <el-select v-model="user_overtime.agent2" style="width:95%" clearable>
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
        <el-form-item
          label="审核意见： "
          :label-width="formLabelWidth"
          prop="reamrk1"
          v-show="user_overtime.reamrk2"
        >
          <el-input v-model="user_overtime.reamrk2" style="width:95%"></el-input>
        </el-form-item>
        <el-form-item
          label="秘书长审批："
          :label-width="formLabelWidth"
          prop="agent3"
          v-if="user_overtime.agent3"
        >
          <el-select v-model="user_overtime.agent3" style="width:95%" clearable>
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
        <el-form-item
          label="审核意见： "
          :label-width="formLabelWidth"
          prop="reamrk1"
          v-show="user_overtime.reamrk3"
        >
          <el-input v-model="user_overtime.reamrk3" style="width:95%"></el-input>
        </el-form-item>
        <el-form-item
          label="抄送人："
          :label-width="formLabelWidth"
          prop="cclist"
          v-show="user_overtime.cclist"
        >
          <el-select v-model="cclist" style="width:95%" clearable multiple placeholder>
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
        <el-form-item
          label="附件  ："
          :label-width="formLabelWidth"
          prop="mid"
          style="text-align: left;"
        >
          <span v-show="yupianjiazai">未上传图片附件</span>
          <newUpload ref="newUpload3" :Upload_showdisable="Upload_showdisable"></newUpload>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
        style="display:flex;margin-bottom:20px;justify-content:flex-end;"
      >
        <el-button
          type="primary"
          v-if="Approval_overtime1"
          style="width: 120px;"
          @click="submit_cancel3()"
        >确 定</el-button>
        <el-button
          type="info"
          @click="submit_cancel3()"
          style="width: 120px;"
          v-if="!Approval_overtime1"
        >取 消</el-button>
        <div style="width:5%" v-if="!Approval_overtime1"></div>
        <el-button
          type="primary"
          style="width: 120px;"
          @click="agree(Approval_overtime, 5, 1)"
          v-if="!Approval_overtime1"
        >同 意</el-button>
        <div style="width:5%" v-if="!Approval_overtime1"></div>
        <el-button
          type="danger"
          style="width: 120px;"
          @click="agree(Approval_overtime, 5, 0)"
          v-if="!Approval_overtime1"
        >拒 绝</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Loading } from "element-ui";
import eleCalendar from "ele-calendar";
import moment from "moment";
import "ele-calendar/dist/vue-calendar.css";
import newUpload from "./newUpload";
// import newupload from "./mupload";
let today = new Date();
export default {
  name: "Attendance",
  // components: { newupload: newupload },
  // components: { newUpload },
  data() {
    return {
      options1: [],
      total3: 0,
      pageSize3: 10,
      kaoq_username: "",
      fileList: [],
      Upload_showdisable: false,
      isgd: "",
      Approval_overtime1: "",
      Approval_overtime: "",
      cclist: [],
      allpeople1: [],
      allpeople2: [],
      allpeople3: [],
      allpeople4: [],
      user_overtime: {
        cclist: [],
      },
      Approval_onbusiness: "",
      Approval_onbusiness1: "",
      busin_peole: [],
      user_onbusiness: {},
      user: {
        uptime: "",
        downtime: "",
        qjtime: "",
        wtype: "",
        reason: "",
        agent1: "",
        agent2: "",
        agent3: "",
        agent4: "",
        cclist: "",
        reamrk1: "",
        reamrk2: "",
        reamrk3: "",
        reamrk4: "",
      },
      shengpi_1: "审批",
      chakan_1: "查看",
      shenpi: "",
      // 请假审批窗口
      dialogFormVisible_1: false,
      //出差审批窗口
      dialogFormVisible_2: false,
      //加班审批窗口
      dialogFormVisible_3: false,
      Approval: "",
      urls: [],
      yupianjiazai: false,
      filelist: [],
      dialogVisible_1: false,
      moment,
      kaoqin_title: "新增考勤类型",
      current_time: "",
      rules: {
        jiaqileixing: [
          { required: true, message: "请输入请假类型", trigger: "blur" },
        ],
        //  unit: [
        //   { required: true, message: "请输入最小单位", trigger: "change" }
        // ],
        // reamrk: [
        //   { required: true, message: "请输入最小单位", trigger: "change" }
        // ],
      },
      value2: "",
      value3: "",
      file_name: "",
      file_content: "",
      isActive: true,
      datedef: [
        { date: "2018-06-30", content: null, cid: null },
        { date: "2018-06-26", content: null, cid: null },
      ],
      prop: "date", //对应日期字段名
      // dat_type:{type:'current-month',isSelected:false,day:'yyyy-MM-dd'},
      value_date: "",
      datedef: [],
      menu: [
        // {name:"请假审批",id:"11"},
        // {name:"出差审批",id:"12"},
        // {name:"考勤统计",id:"13"},
        // {name:"考勤配置",id:"14"},
      ],
      float: [],
      activeIndex: "",
      currentPage1: 1, //当前页1
      currentPage2: 1, //当前页2
      currentPage3: 1, //当前页3`
      currentPage4: 1, //当前页4
      currentPage5: 1, //当前页4
      pageSize: 10, //每页条数

      content1_v: "",
      content2_v: "",
      content3_v: "",
      content4_v: "",
      content5_v: "",
      tableData_cs: [],
      content6_v: "",
      cs_s: false,
      tableData_qj: [],
      tableData_cc: [],
      tableData_tj: [],
      tableData_pz: [],
      tableData_jb: [],
      options: [
        {
          value: "july",
          label: "七月",
        },
      ],
      value: "july",
      ischeck: false,
      multipleSelection: "",
      date: new Date(),
      // nowYear: new Date().getFullYear(),
      nowYear: "",
      // nowMonth: new Date().getMonth() + 1,
      nowMonth: "",
      nowDay: new Date().getDate(),
      splitString: "-",
      weekDays: new Array("日", "一", "二", "三", "四", "五", "六"),
      months: new Array(
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月"
      ),
      lastDays: new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31),
      checkYear: "",
      checkMonth: "",
      thisDayCount: "", //这个月有几天
      ThisWeekDayCounrt: "", //这个周有多少天
      calData: [], //真数据进行渲染页面
      resData: [], //假数据 模拟后台反过来的数据
      res: {},
      leave_s: false,
      ob_s: false,
      ov_s: false,
      chart: [],
      theday: null,
      num_list: [],
      kaoq_rid: "",
      kaoq_uid: "",
      kaoq_time: "",
      day_css: {},
      dayFormVisible: false,
      day_ststus: "",
      formLabelWidth: "120px",
      typeFormVisible: false,
      typeFormVisible: false,
      kaoqinFormVisible: false,
      kaoqintimeFormVisible: false,
      kaoqin_ti: "",
      kaoqin_tiend: "",
      type: {
        jiaqileixing: "",
        unit: "",
        reamrk: "",
      },
      typeCode: 0,
    };
  },
  components: {
    eleCalendar,
    newUpload,
  },
  methods: {
    search_kq() {
      let data = new FormData();
      data.append("n", this.content3_v);
      data.append("m", this.value2);
      this.$http.post("/kc/gau", data).then((res) => {
        if (res.data != -1002) {
          this.total3 = res.data.total;
          this.tableData_tj = res.data.records;
        }
      });
    },
    handleCurrentChange3(value) {
      this.currentPage3 = value;
      this.load7();
    },
    load7() {
      let data = new FormData();
      data.append("n", this.content3_v);
      data.append("m", this.value2);
      data.append("pageNo", this.currentPage3);
      this.$http.post("/kc/gau", data).then((res) => {
        if (res.data != -1002) {
          this.total3 = res.data.total;
          this.tableData_tj = res.data.records;
        }
      });
    },
    qingjiatz(value, n) {
      let data = new FormData();
      data.append("name", value.uname);
      data.append("time", value.month);
      data.append("type", n);
      // 请假
      if (n == 1) {
        this.$http.post("/job/glbn", data).then((res) => {
          this.tableData_qj = res.data;
          this.handleSelect("11");
        });
      }
      //出差
      if (n == 0) {
        this.$http.post("/job/glbn", data).then((res) => {
          this.handleSelect("12");
          this.tableData_cc = res.data;
        });
      }
    },
    dialogFormVisible_1close() {
      this.$refs.user.resetFields();
      this.$refs.user.clear_f();
      this.urls = [];
    },
    dialogFormVisible_3close() {
      this.$refs.user_overtime.resetFields();
      this.$refs.user_overtime.clear_f();
      this.urls = [];
    },
    dialogFormVisible_2close() {
      this.$nextTick(() => {
        this.$refs.user_onbusiness.resetFields();
        this.$refs.user_onbusiness.clear_f();
        this.urls = [];
      });
    },
    //加班审批按钮
    agree_overtime(o) {
      this.dialogFormVisible_3 = true;
      let a = JSON.parse(JSON.stringify(o));
      this.Approval_overtime = o;
      if (o.ownstatus == 1 || o.ownstatus == 0) {
        this.Approval_overtime1 = true;
      } else {
        this.Approval_overtime1 = false;
      }

      let b = o.fids;
      this.agree_fujianchakan(b, 0);
      let data = new FormData();
      data.append("wid", a.wid);
      this.$http.post("/job/gobw", data).then((res) => {
        console.log(res.data);
        //allpeople1: [],allpeople2: [],allpeople4: [],
        this.user_overtime = JSON.parse(JSON.stringify(res.data));
        for (var i = 1; i < 4; i++) {
          this.load_people(i);
        }
        this.load_people1();
        if (this.user_overtime.agent1 != "") {
          this.user_overtime.agent1 = Number(this.user_overtime.agent1);
        }
        if (this.user_overtime.agent2 != "") {
          this.user_overtime.agent2 = Number(this.user_overtime.agent2);
        }
        if (this.user_overtime.agent3 != "") {
          this.user_overtime.agent3 = Number(this.user_overtime.agent3);
        }
        let cclist1 = [];
        if (this.user_overtime.cclist) {
          cclist1 = this.user_overtime.cclist.split(",");
          for (var i in cclist1) {
            cclist1[i] = Number(cclist1[i]);
            this.cclist[i] = cclist1[i];
          }
          console.log(this.cclist, "cclist");
        }
      });
    },

    //审批人获取
    load_people1() {
      let data = new FormData();
      this.$http.post("/job/gul", data).then((res) => {
        console.log(res.data, "所有人员");
        this.allpeople4 = res.data;
      });
    },
    load_people(type) {
      let data = new FormData();
      let t = sessionStorage.getItem("token");
      data.append("level", 1);
      data.append("t", t);
      this.$http.post("/job/gul", data).then((res) => {
        if (type == 1) this.allpeople1 = res.data;
        if (type == 2) this.allpeople2 = res.data;
        if (type == 3) this.allpeople3 = res.data;
      });
    },
    chaxun() {
      let data = new FormData();
      let t = sessionStorage.getItem("token");
      data.append("t", t);
      this.$http.post("/uc/gau", data).then((res) => {
        console.log(res, "出差");
        this.busin_peole = res.data;
      });
    },
    // 出差审批审批按钮
    agree_OnBusiness(o) {
      this.dialogFormVisible_2 = true;
      let a = JSON.parse(JSON.stringify(o));
      let b = o.fids;
      this.Approval_onbusiness = o;
      if (o.result == 1 || o.result == 0) {
        this.Approval_onbusiness1 = true;
      } else {
        this.Approval_onbusiness1 = false;
      }
      this.agree_fujianchakan(b, 1);
      let data = new FormData();
      data.append("wid", a.wid);
      this.$http.post("/job/gobw", data).then((res) => {
        this.user_onbusiness = JSON.parse(JSON.stringify(res.data));
        if (this.user_onbusiness.agent1 != "") {
          this.user_onbusiness.agent1 = Number(this.user_onbusiness.agent1);
        }
      });
      this.chaxun();
      console.log(this.user_onbusiness, "当前出差申请人");
    },
    submit_cancel() {
      setTimeout(() => {
        this.dialogFormVisible_1 = false;
        this.$refs.user.resetFields();
        this.$refs.newUpload1.fileList = [];
        this.urls = [];
      }, 100);
    },
    submit_cancel3() {
      this.dialogFormVisible_3 = false;
      this.$refs.user_overtime.resetFields();
      this.$refs.newUpload3.fileList = [];
      this.urls = [];
    },
    submit_cancel2() {
      this.dialogFormVisible_2 = false;
      this.$refs.user_onbusiness.resetFields();
      this.$refs.newUpload2.fileList = [];
      this.urls = [];
    },
    //请假审批按钮

    agree_chakan(p, y, n, num) {
      this.load_people1();
      this.options1 = JSON.parse(sessionStorage.getItem("vacation"));
      console.log(n);
      console.log(this.options1);
      if (n.leaveaddr != null) {
        n.leaveaddr = Number(n.leaveaddr);
      }
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
      let post = n.leaveaddr;
      let t = {};
      t = JSON.parse(JSON.stringify(n));
      if (post >= 10 && post <= 12) {
        if (n.isgd == 1) {
          t.agent1 = n.agent1;
          t.agent3 = n.agent2;
          t.agent4 = n.agent3;
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
      this.user = t;
      console.log(t, "t");
      console.log(this.user);

      if (num == 1 || num == 0) {
        this.Approval = true;
      } else {
        this.Approval = false;
      }
      this.shenpi = n;
      this.agree_fujianchakan(y, 2);
      this.dialogFormVisible_1 = true;
    },
    //附件查看功能
    agree_fujianchakan(n, num) {
      console.log(n);
      let data = new FormData();
      let fid = n;
      data.append("fid", n);
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
        console.log(this.fileList);
        if (num === 1) {
          this.$refs.newUpload2.fileList = this.fileList;
          this.yupianjiazai = true
            ? this.$refs.newUpload2.fileList == 0
            : this.$refs.newUpload2.fileList != 0;
        } else if (num === 2) {
          this.$refs.newUpload1.fileList = this.fileList;
          this.yupianjiazai = true
            ? this.$refs.newUpload1.fileList == 0
            : this.$refs.newUpload1.fileList != 0;
        } else if (num === 0) {
          this.$refs.newUpload3.fileList = this.fileList;
          this.yupianjiazai = true
            ? this.$refs.newUpload3.fileList == 0
            : this.$refs.newUpload3.fileList != 0;
        }
      });
      // this.dialogVisible_1 = true;
    },
    //抄送所有
    cs_all(value3) {
      this.cs_s = true;
      let data = new FormData();
      data.append("as", 1);
      if (value3 != "" && value3 != undefined && value3 != null)
        data.append("m", value3);
      this.$http.post("/job/gcl", data).then((res) => {
        if (res.data != -1002) this.tableData_cs = res.data;
        console.log(res);
      });
    },
    load6(type) {
      let data = new FormData();
      // data.append("as", 1);
      // data.append("m", type);
      this.$http
        .post("/job/gcl", data)
        .then((res) => {
          //抄送审批
          if (res.data != -1002 && res.data != undefined && res.data != null)
            this.tableData_cs = res.data;
          console.log(this.tableData_cs, "this.tableData_cs");
        })
        .catch((error) => {
          this.tableData_cs = [];
        });
    },
    search() {
      let data = new FormData();
      data.append("name", this.content6_v);
      this.$http.post("/job/sl", data).then((res) => {
        console.log(res);
      });
    },
    xiugai_return() {
      this.ischeck = !this.ischeck;
      this.num_list = [];

      this.select_clear();
      this.load3();
    },
    xiugai_enter() {
      let a = 0;
      console.log(this.day_css, "css");
      for (var ind in this.day_css) {
        if (this.day_css[ind] == true) a = a + 1;
      }
      if (a == 0) {
        //  alert("请选中具体日期进行操作");
        this.$alert("请选中具体日期进行操作", "提示", {
          confirmButtonText: "确定",
        });
        return false;
      } else {
        this.dayFormVisible = true;
      }
    },

    day_xiugai() {
      let data = new FormData();
      let d_list = [];
      for (var ind in this.day_css) {
        if (this.day_css[ind] == true) d_list.push(ind);
      }
      console.log(d_list, "选定的d_list");
      // if(d_list==""){
      //   alert("请选中具体日期进行修改")
      //   return false
      // }
      data.append("d", d_list);
      data.append("s", this.day_ststus);
      data.append("rid", this.kaoq_rid);
      this.$confirm("确定修改考勤记录", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.$http.post("/kc/ul", data).then((res) => {
          this.num_list = [];
          this.day_ststus = "";
          this.dayFormVisible = false;
          this.kaoq_fresh();
          this.select_clear();
          console.log(res);
        });
      });
    },
    select_clear() {
      for (var item in this.day_css) {
        this.day_css[item] = false;
      }
    },
    kaoq_fresh() {
      let data = new FormData();
      data.append("month", this.kaoq_time);
      data.append("rid", this.kaoq_uid);

      this.$http.post("/kc/gou", data).then((res) => {
        this.nowYear = this.kaoq_time.split("-")[0];
        this.nowMonth = this.kaoq_time.split("-")[1];
        // this.ischeck = !this.ischeck;
        console.log(res);
        this.res = res.data;
        this.resData = res.data.daymap;
        for (let item of this.resData) {
          let arr = item.type.times.split(";");
          arr.pop();
          arr.forEach((ele, i) => {
            if (i == 0) {
              arr[i] = "上午：" + ele;
            }
            if (i == 1) {
              if (ele.slice(0, 2) > 14) {
                arr[i] = "下午：" + ele;
              } else {
                arr[i] = "中午：" + ele;
              }
            }
            if (i == 2) {
              arr[i] = "下午：" + ele;
            }
          });
          item.type.times = arr;
        }
        this.calData = this.resData;
        console.log(this.calData, "较新的");
      });
    },
    //加班所有
    overtime_all() {
      this.ov_s = true;
      let data = new FormData();
      data.append("as", 5);
      this.$http.post("/job/gll", data).then((res) => {
        if (res.data != -1002) this.tableData_jb = res.data;
        console.log(res);
        for (var item of res.data) {
          item.ownstatus = "1";
        }
      });
    },

    leave_all1() {
      this.leave_s = true;
      let data = new FormData();
      data.append("as", 1);
      this.$http.post("/job/gll", data).then((res) => {
        if (res.data != -1002) this.tableData_qj = res.data;
        for (var item of res.data) {
          item.ownstatus = "1";
        }

        console.log(res);
      });
    },
    //请假所有
    leave_all(value3) {
      this.leave_s = true;
      let data = new FormData();
      data.append("as", 1);
      if (value3 != "" && value3 != undefined && value3 != null)
        data.append("m", value3);
      this.$http.post("/job/flist", data).then((res) => {
        if (res.data != -1002) this.tableData_qj = res.data;
        for (var item of res.data) {
          item.ownstatus = "1";
        }
        console.log(res);
      });
    },
    //出差所有
    ob_all() {
      this.ob_s = true;
      let data = new FormData();
      data.append("as", 0);
      this.$http.post("/job/gll", data).then((res) => {
        if (res.data != -1002) {
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
          for (var item of res.data) {
            item.ownstatus = "1";
          }
          this.tableData_cc = res.data;
          console.log(res);
        }
      });
    },
    every_change(item, index) {
      console.log(item + "_" + index + "___" + this.day_css[index], "每天情况");

      this.day_css[index] = !this.day_css[index];
      // this.$set(this.day_css,index,true)
      // this.num_list.forEach(ind=>{
      //   console.log(ind,"1111");
      //   if(Number(ind)!=Number(index))this.num_list.push(index);
      // })

      this.num_list.push(index);
      console.log(JSON.stringify(new Set(this.num_list)));
    },
    kaoqin_time() {
      let data = new FormData();
      data.append("type", "2");
      this.$http.post("/kc/gkq", data).then((res) => {
        this.kaoqin_ti = res.data.jiaqileixing;
        this.kaoqin_tiend = res.data.unit;
        this.kaoqintimeFormVisible = true;
        console.log(res);
      });
    },
    kaoqintime_queren() {
      let data = new FormData();
      data.append("dates", this.kaoqin_ti + "," + this.kaoqin_tiend);
      this.$http.post("/kc/guk", data).then((res) => {
        //alert("修改成功");
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.kaoqintimeFormVisible = false;
        this.kaoqin_ti = "";
        console.log(res);
      });
    },
    open_reason(type) {
      if (type == null || type == "") {
        type = "暂无";
      }
      this.$alert(type, "查看原因", {
        confirmButtonText: "确定",
      });
    },
    agree_t(value) {
      console.log(value, "-------------");
      if (value != null) {
        return true;
      } else {
        return false;
      }
    },
    mounth_chaxun(type) {
      console.log(type, "当前月+++++++++++");
      // let data =new FormData;
      // data.append('','')
      // this.http.post('',data).then(res=>{
      // console.log(res)
      // })
    },
    upload_excel(e) {
      //获取选定的文件
      let tFiles = e.target.files;
      let len = tFiles.length;
      if (!tFiles[0].name.match(".xls")) {
        alert("请务必上传excel文件");
        e.target.value = "";
        return false;
      }
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
        this.file_content = tFiles[i];
        this.isActive = false;
        //开始上传文件 新建一个formData
        // let param = new FormData();
        // //通过append向form对象添加数据 ！！！图片数据
        // param.append("f", tFiles[i]);
        // //FormData私有类对象，访问不到，可以通过get判断值是否传进去
        // let config = {
        //   //添加请求头
        //   headers: {
        //     "Content-Type": "multipart/form-data"
        //   }
        // };
        // //请求
        // this.$http({
        //   url: "/fmc/upf",
        //   method: "post",
        //   data: param,
        //   config,
        // }).then(res => {
        //   alert("上传成功")
        //   for(var key in res.data ){
        //     this.fid=res.data[key].fid
        //   }
        //   console.log(this.fid)
        //   //特殊需求部分 页面状态

        // });
      }
    },
    renderContent(h, parmas) {
      const loop = (data) => {
        // return data.defvalue.value ? (
        //   <div>
        //     <div>{data.defvalue.text}</div>
        //     <span>备选项</span>
        //   </div>
        // ) : (
        //   <div>{data.defvalue.text}</div>
        // );
      };
    },
    surekaoqin() {
      if (this.file_content == "") {
        this.$alert("请上传文件后点击确认", "提示", {
          confirmButtonText: "确定",
        });
        //   alert("请上传文件后点击确认");
        return false;
      }
      console.log(this.value_date, "12321");
      console.log(this.file_content, "文件");
      let data = new FormData();
      data.append("dates", "," + this.value_date);
      data.append("f", this.file_content);
      const loading = this.$loading({
        lock: true,
        text: "数据导入中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.$http
        .post("/kc/ii", data)
        .then((res) => {
          loading.close();
          this.kaoqinFormVisible = false;

          this.value_date = "";
          (this.file_content = ""),
            (this.file_name = ""),
            (this.isActive = true);
          this.load3();
          console.log(res);
        })
        .catch((error) => {
          loading.close();
          this.$message.error("提交失败");
          // this.dialogFormVisible = false;
        });
    },
    cancelkaoqin() {
      this.file_name = "";
      this.file_content = "";
      this.kaoqinFormVisible = false;
    },
    daochu() {
      let a = this.multipleSelection;
      let rids = [];
      for (let key in a) {
        rids.push(a[key].mid);
      }
      if (rids == "") {
        //alert("请选择数据导出");
        this.$alert("请选择数据导出", "提示", {
          confirmButtonText: "确定",
        });
        return false;
      }
      let data = new FormData();
      data.append("ids", rids);
      this.$http({
        method: "post",
        url: "/kc/ii",
        responseType: "blob",
        data: data,
      }).then((res) => {
        console.log(res);
        if (res.headers["content-disposition"]) {
          var fileName = res.headers["content-disposition"]
            .split(";")[1]
            .split("fileName=")[1];
          var fileNameUnicode = res.headers["content-disposition"].split(
            "fileName*="
          )[1];
          if (fileNameUnicode) {
            fileName = decodeURIComponent(fileNameUnicode.split("''")[1]);
          }
          fileName = decodeURIComponent(fileName);
          console.log(fileName, "fileName");
        }
        this.download(res, fileName);
      });
    },
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
    daoru() {
      this.kaoqinFormVisible = true;
      // let data = new FormData();
      // data.append("", "");
      // this.$http.post("/kc/ii", data).then(res => {
      //   console.log(res);
      // });
    },
    search() {
      let data = new FormData();
      data.append("name", this.content1_v);
      this.$http.post("/job/sl", data).then((res) => {
        console.log(res);
      });
    },
    agree(obj, as, num) {
      let data = new FormData();
      console.log(obj, "rid", num, "s");
      data.append("as", as);
      data.append("rid", obj.wid);
      data.append("s", num);
      this.$prompt("请输入审批意见", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          if (num == 1) {
            if (value == null) {
              value = "同意";
            }
          }
          if (num == 0) {
            if (value == null) {
              value = "拒绝";
            }
          }
          data.append("r", value);
          // if(num==0&&(r==""||r==null)){
          //   this.$message({
          //   type: "info",
          //     message: "审批意见不得为空"
          //   });
          //   return false
          // }
          this.$http.post("/job/at", data).then((res) => {
            if (as == 1) this.load1();
            if (as == 0) this.load2();
            if (as == 5) this.load5();
            this.dialogFormVisible_1 = false;
            this.dialogFormVisible_2 = false;
            this.dialogFormVisible_3 = false;
            this.urls = [];
            this.$message({
              type: "success",
              message: "审批完成",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消审批",
          });
          this.dialogFormVisible_1 = false;
          this.dialogFormVisible_2 = false;
          this.dialogFormVisible_3 = false;
          this.urls = [];
        });
    },
    handleSelect(key, keyPath) {
      console.log(key);
      console.log(keyPath);
      this.activeIndex = key;
      this.load5();
      this.load4();
      this.load3();
      this.load2();
      this.load1();
      // console.log(this.activeIndex,'activeIndex');
      // console.log(key==this.activeIndex)
    },
    examine(index, row, num) {
      console.log("点击查看");
      console.log(index, "index");
      console.log(row, "row");
      //获取每天信息的id内容
      this.kaoq_username = row.uname;
      this.kaoq_rid = row.rid;
      this.kaoq_uid = row.uid;
      this.kaoq_time = row.month;
      this.nowYear = row.month.split("-")[0];
      this.nowMonth = row.month.split("-")[1];
      this.getThisDay();
      this.ischeck = !this.ischeck;
      let data = new FormData();
      let uid = row.uid;
      let month = row.month;
      data.append("month", month);
      data.append("rid", uid);
      this.$http.post("/kc/gou", data).then((res) => {
        console.log(res);
        this.res = res.data;
        this.resData = res.data.daymap;
        for (let item of this.resData) {
          if (item.type.times != "") {
            console.log(item.type.times);
            let arr = item.type.times.split(";");
            arr.pop();
            arr.forEach((ele, i) => {
              if (i == 0) {
                arr[i] = "上午：" + ele;
              }
              if (i == 1) {
                if (ele.slice(0, 2) > 14) {
                  arr[i] = "下午：" + ele;
                } else {
                  arr[i] = "中午：" + ele;
                }
              }
              if (i == 2) {
                arr[i] = "下午：" + ele;
              }
            });
            item.type.times = arr;
          }
        }
        this.calData = this.resData;
      });
    },
    load1(type) {
      let data = new FormData();
      data.append("as", 1);
      data.append("m", type);
      this.$http
        .post("/job/flist", data)
        .then((res) => {
          //请假审批
          if (res.data != -1002 && res.data != undefined && res.data != null)
            this.tableData_qj = res.data;
          console.log(this.tableData_qj, "this.tableData_qj");
        })
        .catch((error) => {
          this.tableData_qj = [];
        });
    },
    load2() {
      let data = new FormData();
      data.append("as", 0);
      this.$http
        .post("/job/flist", data)
        .then((res) => {
          //出差审批
          if (res.data != -1002 && res.data != undefined && res.data != null)
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
          this.tableData_cc = res.data;

          console.log(this.tableData_cc, "this.tableData_cc");
        })
        .catch((error) => {
          console.log("错误");
        });
    },
    load3(type) {
      // if (type == undefined) {
      //   type = this.moment().format("yyyy-MM");
      // }
      console.log(type, "当前月份-----------");
      let data = new FormData();
      // data.append("m", type);
      this.$http
        .post("/kc/gau", data)
        .then((res) => {
          //考勤统计
          if (res.data != -1002) {
            this.total3 = res.data.total;
            this.tableData_tj = res.data.records;
          }
          console.log(this.tableData_tj, "this.tableData_tj");
        })
        .catch((error) => {
          console.log("错误");
        });
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
    load5() {
      let data = new FormData();
      data.append("as", 5);
      this.$http.post("/job/flist", data).then((res) => {
        //加班列表
        if (res.data != -1002) this.tableData_jb = res.data;
        console.log(this.tableData_jb, "this.tableData_jb");
      });
    },
    getdate(index) {
      //点击天根据数据渲染右侧的内容
      this.theday = index;
    },
    getdate1(index) {
      this.theday = -1;
      console.log(this.theday);
    },
    getThisDay() {
      //返回今天 重新获取今天的数据渲染页面；
      this.checkYear = this.nowYear;
      this.checkMonth = this.nowMonth;
      console.log(this.checkYear, "this.checkYear");
      console.log(this.checkMonth, "this.checkMonth");
      //请求数据 this.http;
      this.requreData();
    },
    lastMonthClick() {
      //切换上一个月
      if (this.checkMonth == 1) {
        this.checkYear = this.checkYear - 1;
        this.checkMonth = 12;
      } else {
        this.checkMonth = this.checkMonth - 1;
      }
      //请求数据 this.http;
      this.requreData();
    },
    nextMonthClick() {
      //切换下一个月
      if (this.checkMonth == 12) {
        this.checkYear = this.checkYear + 1;
        this.checkMonth = 1;
      } else {
        this.checkMonth = this.checkMonth + 1;
      }
      //请求数据 this.http;
      this.requreData();
    },
    requreData() {
      //请求数据 this.http;
      this.getThisMonthDay(this.checkYear, this.checkMonth);
      this.getThisWeekDay(this.checkYear, this.checkMonth, 1);
    },
    isLeapYear(year) {
      var isLeap = false;
      if (0 == year % 4 && (year % 100 != 0 || year % 400 == 0)) {
        isLeap = true;
      }
      return isLeap;
    },
    getThisMonthDay(year, month) {
      var thisDayCount = this.lastDays[month - 1];
      if (month == 2 && this.isLeapYear(year)) {
        thisDayCount++;
      }
      this.thisDayCount = thisDayCount;
    },
    getThisWeekDay(year, month, date) {
      var thisDate = new Date(year, month - 1, date);
      this.ThisWeekDayCounrt = thisDate.getDay();
      // console.log(this.ThisWeekDayCounrt,'ThisWeekDayCounrt')
    },
    cumWeekDayCounrt(date) {
      var thisDate = new Date(this.checkYear, this.checkMonth - 1, date);
      return thisDate.getDay();
    },
    addType() {
      this.kaoqin_title = "新增考勤类型";
      this.typeFormVisible = true;
      this.typeCode = 100;
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
          //  alert("信息填写不规范或不完整");
          this.$alert("信息填写不规范或不完整", "提示", {
            confirmButtonText: "确定",
          });
          return false;
        }
      });
    },
    cancelType() {
      this.clear_f(this.type);
      this.typeFormVisible = false;
      // this.$refs.type.resetFields();
    },
  },
  filters: {
    agree_f: function (value) {
      //  console.log(value,"-------------");
      if (value == "0" || value == "1") {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    var _this = this;
    _this.checkYear = _this.nowYear;
    _this.checkMonth = _this.nowMonth;

    setTimeout(function () {
      //初始调用服务请求
      _this.getThisMonthDay(_this.checkYear, _this.checkMonth);
      _this.getThisWeekDay(_this.checkYear, _this.checkMonth, 1);
    }, 1000);
  },
  mounted() {
    let t = sessionStorage.getItem("token");
    let a = JSON.parse(sessionStorage.getItem("a"));
    for (var i = 1; i < 32; i++) {
      this.$set(this.day_css, i, false);
    }

    // console.log(this.day_css, "31天盒子");
    for (let item of a) {
      //菜单栏里的权限不能使用v-has设置，否则刷新后会出现bug。页面上的按钮可以使用v-has设置权限
      // console.log(item, "111111111111111111111111111111111111111111111");
      // 14 13 11 12 15
      if (item == "11") this.menu.push({ name: "请假审批", id: "11" });
      if (item == "12") this.menu.push({ name: "出差审批", id: "12" });
      if (item == "13") this.menu.push({ name: "加班审批", id: "13" });
      if (item == "14") this.menu.push({ name: "考勤统计", id: "14" });
      // if (item == "15") this.menu.push({ name: "设置考勤时间", id: "15" });

      // if (item == "11") this.menu.push({ name: "考勤配置", id: "11" });
      // if (item == "12") this.menu.push({ name: "考勤统计", id: "12" });
      // if (item == "13") this.menu.push({ name: "请假审批", id: "13" });
      // if (item == "14") this.menu.push({ name: "出差审批", id: "14" });
      // if (item == "15") this.menu.push({ name: "加班审批", id: "15" });
    }
    this.menu.push({ name: "抄送信息", id: "16" });
    //请假类型配置
    this.load4();
    // console.log(this.menu, "menu");
    this.float = JSON.parse(sessionStorage.getItem("float"));
    console.log(this.float);
    this.activeIndex = this.float.menu_index;
    // console.log(this.float,'this.float');
    this.load1();
    this.load2();
    this.load3();
    this.load6();
    this.load5();
  },
  // beforeRouteEnter (to, from, next) {
  //   next(vm => {
  //     // 通过 `vm` 访问组件实例
  // console.log(to,from,"实例代码",vm.$route.params.messagetype);
  // if(from.fullPath=='/information'){
  // 	vm.handleSelect(vm.$route.params.messagetype);
  // 	vm.load1();
  // 	vm.load2();
  // 	vm.load3();
  // 	vm.load4();
  // 	vm.load6();
  // 	vm.load5();
  // }
  //   })
  // },
  beforeRouteLeave(to, from, next) {
    this.float.menu_index = this.activeIndex;
    let float = JSON.stringify(this.float);
    sessionStorage.setItem("float", float);
    next();
    // console.log(this.float,'float')
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.select_s {
  background-color: #4eccc4;
  position: relative;
  height: 10px;
  width: 10px;
  border-radius: 10px;
  color: white;
  cursor: pointer;
}

.upselect_s {
  cursor: pointer;
  position: relative;
}

.upselect_s2 {
  cursor: pointer;
  position: relative;
  color: #0089fa;
}

#myFile {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  width: 240px;
  height: 340px;
  z-index: 99;
}

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

#file {
  width: 240px;
  height: 160px;
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

.is-selected {
  color: #1989fa;
}

.ts {
  width: 100px;
  height: 100px;
  border: 1px solid #666;
  position: absolute;
  top: -100px;
  right: -100px;
  background: #fff;
  z-index: 1;
  font-size: 12px;
  border-radius: 3px;
}

.ts p {
  height: 30px;
  line-height: 30px;
  border-bottom: 1px solid #999;
}

.ts p:last-child {
  height: 30px;
  border: 0;
}

.Attendance >>> .el-table {
  color: #070707;
  height: 64vh;
}

.Attendance_night >>> .el-table {
  color: grey;
  background: #242635 !important;
  height: 64vh;
}

/* .Attendance_night >>>.el-table__footer-wrapper>>> .el-table__header-wrapper{
     background: red
   } */
.el-menu,
.el-table--border {
  border: 0;
}

.el-table /deep/ .t_h {
  background-color: #f5f5f5 !important;
  /* color: grey; */
}

.el-table /deep/ .el-table__row .operation span {
  cursor: pointer;
  border-right: 1px solid #e5e5e5;
  padding: 0 2px;
}

.el-table /deep/ .el-table__row .operation span:last-child {
  border: 0;
}

.Attendance {
  background-color: #f5f5f5;
  height: 100%;
}

.Attendance_night {
  background-color: #242635;
  height: 100%;
  color: grey;
}

.Attendance_night .menu >>> .el-menu-item {
  color: grey;
}

.Attendance_night >>> .el-menu {
  background: #242635;
}

.Attendance.menu.content {
  background: #fff;
}

.Attendance_night.content {
  background: #242635;
}

.Attendance_night >>> .el-menu .el-table--border {
  border: 0;
  background: #242635;
}

.menu {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}

.content {
  height: 92%;
  background: #fff;
}

.table_top {
  display: flex;
  /* justify-content: space-between; */
  padding: 1.7% 2.1%;
  margin-top: 7px;
  min-width: 960px;
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

.everyWeekDay .weekday {
  display: -moz-inline-box;
  display: inline-block;
  text-align: center;
  /*height: 50px;*/
  line-height: 26px;
  width: 13.6%;
  border: 1px solid transparent;
  cursor: pointer;
  box-sizing: border-box;
}

.everyDay .days {
  /*解决span不支持width属性*/
  display: -moz-inline-box;
  display: inline-block;
  text-align: center;
  /*height: 50px;*/
  line-height: 50px;
  width: 13.6%;
  border: 1px solid transparent;
  cursor: pointer;
  box-sizing: border-box;
}

/* .attendtittle,.everyWeekDay,.everyDay{background:#fff;} */
.attendwrapright {
  display: flex;
  flex-flow: row wrap;
}

.attendwrapright > div {
  width: 45%;
  height: 30%;
  background: #fff;
  margin-right: 3%;
  margin: 0 5% 5% 0;
}

.chart {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 18px;
}

.chart > span {
  font-weight: 600;
}

.chart > div {
  font-size: 16px;
  line-height: 52px;
  margin-top: 30px;
}

.chart > div span:first-child {
  font-size: 40px;
  color: #3399ff;
  position: relative;
  top: 3px;
  left: -5px;
}

.chart > div span:last-child {
  font-weight: 600;
}
.img /deep/ .el-icon-circle-close {
  color: white;
}
</style>
