<template>
  <!-- 会员单位 -->
  <div class="Member">
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
    <!-- 会员单位 -->
    <div class="content" v-show="activeIndex=='31'">
      <div class="table_top">
        <span style="line-height: 31px;">单位名称 ：</span>
        <input type="text" v-model="content1_v" placeholder="搜索单位名称" style="width:15%" />
        <span style="line-height: 31px;">会员类型：</span>
        <el-select placeholder="请选择" v-model="search_type" @change="vip_search()" clearable>
          <el-option
            v-for="item in m_option"
            :key="item.did"
            :label="item.dname"
            :value="item.did"
            style="width:100%"
          ></el-option>
        </el-select>
        <!-- <span style="line-height: 31px;margin-left:20px">会员到期时间：</span>
            <el-date-picker
              @change="vip_search()"
              type="date"
              placeholder="开始日期"
              style="width:13%"
              v-model="search_starttime"
            ></el-date-picker>
            <el-date-picker
              type="date"
              placeholder="结束日期"
              style="width:13%"
              v-model="search_endtime"
              @change="vip_search()"
        ></el-date-picker>-->

        <el-button
          type="primary"
          @click="huiyuan_shenqing()"
          class="huiyuan_button"
          v-has="314"
          style="margin-right:20px;margin-left:20px"
        >添加</el-button>
        <el-button
          type="primary"
          @click="daochu()"
          class="huiyuan_button"
          style="margin-right:20px"
        >导出</el-button>
        <a
          href="javascript:;"
          :class="[isActive?'file':'file_1']"
          style="background:#409EFF;height:23px;"
          v-if="!showdaoru"
        >
          <input type="file" id="myFile" @change="upload_fu($event)" />导入
        </a>
      </div>
      <el-table
        :data="tableData_hy.filter(data => !content1_v || data.mname.toLowerCase().includes(content1_v.toLowerCase())).slice((this.currentPage1-1)*this.pageSize,this.currentPage1*this.pageSize)"
        style="width: 95.8%;margin:0 2.1%;height:500px;overflow:auto"
        ref="tableData_hy"
        align="center"
        height="430"
        @selection-change="handleSelectionChange"
        @row-click="clickRow"
        @sort-change="sortChange"
        highlight-current-row
        row-key="mid"
        border
        header-cell-class-name="t_h"
      >
        <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
        <el-table-column label="单位名称" align="center" prop="mname" show-overflow-tooltip>
          <template slot-scope="scope">
            <span
              style="text-decoration:underline;cursor:pointer"
              :class="scope.row.colorStatus == 0 ? 'colorStatus_black'  :  scope.row.colorStatus == 1 ? 'colorStatus_yellow':'colorStatus_red' "
            >{{ scope.row.mname }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="联系人电子邮箱" prop="email" align="center"></el-table-column> -->
        <el-table-column label="会员类型" prop="mtype" align="center">
          <template slot-scope="scope">
            <span
              :class="scope.row.colorStatus == 0 ? 'colorStatus_black'  :  scope.row.colorStatus == 1 ? 'colorStatus_yellow':'colorStatus_red' "
            >{{danwei_f(scope.row.mtype) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系人" align="center" prop="liaison">
          <template slot-scope="scope">
            <span
              :class="scope.row.colorStatus == 0 ? 'colorStatus_black'  :  scope.row.colorStatus == 1 ? 'colorStatus_yellow':'colorStatus_red' "
            >{{scope.row.liaison }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="联系人电话"
          prop="telephone"
          align="center"
          width="125"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span
              style="text-decoration:underline;cursor:pointer"
              :class="scope.row.colorStatus == 0 ? 'colorStatus_black'  :  scope.row.colorStatus == 1 ? 'colorStatus_yellow':'colorStatus_red' "
            >{{scope.row.telephone }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="单位地址" align="center" prop="addr" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer">{{ scope.row.addr }}</span>
          </template>
        </el-table-column>-->
        <!-- <el-table-column label="职务" align="center" prop="duty"></el-table-column> -->
        <!-- <el-table-column label="入会日期" prop="intime" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.intime | time_t }}</span>
          </template>
        </el-table-column>-->
        <!-- <el-table-column label="会费到期日期" prop="endtime" align="center" width="130" sortable="custom">
          <template slot-scope="scope">
            <span>{{ scope.row.endtime | time_t }}</span>
          </template>
        </el-table-column>-->
        <el-table-column label="协会职务" prop="xhduty" align="center">
          <template slot-scope="scope">
            <span
              :class="scope.row.colorStatus == 0 ? 'colorStatus_black'  :  scope.row.colorStatus == 1 ? 'colorStatus_yellow':'colorStatus_red' "
            >{{ scope.row.xhduty }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参与项目名称" align="center" prop="invProjectName" show-overflow-tooltip>
          <template slot-scope="scope">
            <span
              style="text-decoration:underline;cursor:pointer"
              :class="scope.row.colorStatus == 0 ? 'colorStatus_black'  :  scope.row.colorStatus == 1 ? 'colorStatus_yellow':'colorStatus_red' "
            >{{ scope.row.invProjectName }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="信用代码" prop="taxno" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.taxno }}</span>
          </template>
        </el-table-column>
        <el-table-column label="银行卡号" prop="bankcard" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.bankcard }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开户行" prop="ofbank" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.ofbank }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资料齐全" prop="fulldata" align="center"></el-table-column>-->
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <div class="operation">
              <span
                style="color:#3399FF"
                @click="huiyuan_handleSacn(scope.row.mname,scope.row.mid,3,scope.row.fid,scope.row.comProfile)"
                v-has="311"
              >详情</span>
              <span
                style="color:#3399FF"
                @click="huiyuan_handleSacn(scope.row.mname,scope.row.mid,2,scope.row.fid,scope.row.comProfile)"
                v-has="312"
              >修改</span>
              <span
                style="color:#FF5454"
                @click="huiyuan_handleDelete(scope.row.mid)"
                v-has="313"
              >删除</span>

              <span style="color:#E6A23C" @click="huiyuan_statuschange(scope.row)" v-has="312">状态</span>
              <!-- <span
                style="color:#3399FF"
                @click="huiyuan_handleSacn(scope.row.mname,scope.row.mid,1,scope.$index,scope)"
                v-has="311"
              >缴费记录</span>-->
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
          :total="tableData_hy.filter(data => !content1_v || data.mname.toLowerCase().includes(content1_v.toLowerCase())).length"
        ></el-pagination>
      </div>
    </div>
    <!-- 缴费记录信息展示 -->
    <div class="content" v-show="activeIndex=='32'">
      <el-tabs v-model="activename" @tab-click="handleclick" style="margin-left:20px;">
        <!-- 会费展示 -->
        <el-tab-pane label="会费" name="vip_price" style="margin:0">
          <div class="table_top">
            <span>
              <span>
                <span style="line-height: 31px;">单位名称 ：</span>
                <input type="text" placeholder="搜索单位名称" v-model="content3_v" style="width:170px" />
              </span>
              <span>
                <span style="line-height: 31px;">缴费情况 ：</span>
                <el-select
                  v-model="content1_hf"
                  placeholder="缴费情况"
                  @change="jiaofei_filters(0)"
                  style="width:120px;margin-right:20px;"
                  clearable
                >
                  <el-option label="已缴" value="已缴"></el-option>
                  <el-option label="未缴" value="未缴"></el-option>
                  <el-option label="免缴" value="免缴"></el-option>
                </el-select>
              </span>
              <!-- <el-button
                type="success"
                icon="el-icon-search"
                style="width:130px"
                @click="jiaofei_data(),jf_name='',jiaofei_form.mname=''"
                class="huiyuan_button"
              >查询全部</el-button>-->
            </span>

            <el-button type="primary" @click="hf_add()" class="huiyuan_button" v-has="323">添加</el-button>
          </div>
          <el-table
            :data="tableData_hf.filter(data => !content3_v || data.mname.toLowerCase().includes(content3_v.toLowerCase())).slice((this.currentPage4-1)*this.pageSize,this.currentPage4*this.pageSize)"
            style="width: 95.8%;margin:0 2.1%;height:380px;overflow:auto"
            align="center"
            height="380"
            @selection-change="handleSelectionChange"
            @row-click="clickRow_jf"
            ref="tableData_hf"
            highlight-current-row
            @sort-change="sortChange3"
            border
            row-key="mid"
            header-cell-class-name="t_h"
          >
            <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
            <el-table-column label="单位名称" align="center" prop="mname">
              <template slot-scope="scope">
                <span>{{ scope.row.mname }}</span>
              </template>
            </el-table-column>
            <el-table-column label="联系人" align="center" prop="liaison">
              <template slot-scope="scope">
                <span>{{ scope.row.liaison }}</span>
              </template>
            </el-table-column>
            <el-table-column label="年度" align="center" prop="annual">
              <template slot-scope="scope">
                <span>{{ scope.row.annual}}</span>
              </template>
            </el-table-column>
            <el-table-column label="应缴金额(元)" align="center" prop="shouldpay">
              <template slot-scope="scope">
                <span>{{ scope.row.shouldpay }}</span>
              </template>
            </el-table-column>
            <el-table-column label="实缴金额(元)" align="center" prop="inpay">
              <template slot-scope="scope">
                <span>{{ scope.row.inpay }}</span>
              </template>
            </el-table-column>

            <el-table-column label="到期日期" align="center" prop="endtime" sortable="custom">
              <template slot-scope="scope">
                <span>{{ scope.row.endtime | time_t }}</span>
              </template>
            </el-table-column>
            <el-table-column label="缴纳情况" align="center" prop="paystatus">
              <template slot-scope="scope">
                <span>{{ scope.row.paystatus }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="140">
              <template slot-scope="scope">
                <div class="operation">
                  <span style="color:#3399FF" @click="hf_handleEdit(scope.row,0)" v-has="321">详情</span>
                  <span style="color:#3399FF" @click="hf_handleEdit(scope.row,1)" v-has="321">修改</span>
                  <span style="color:#FF5454" @click="hf_delete(scope.row.mid)" v-has="322">删除</span>
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
              :total="tableData_hf.filter(data => !content3_v || data.mname.toLowerCase().includes(content3_v.toLowerCase())).length"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <!-- 缴费记录——项目费 -->
        <el-tab-pane label="项目费" name="project_price">
          <div class="table_top">
            <span>
              <span>
                <span style="line-height: 31px;">单位名称 ：</span>
                <input type="text" placeholder="搜索单位名称" v-model="content2_v" style="width:170px" />
              </span>
              <span>
                <span style="line-height: 31px;">项目名称 ：</span>
                <el-select
                  v-model="content1_user"
                  @change="project_filters(content1_user,1)"
                  placeholder="项目名称"
                  style="width:120px;margin-right:20px;"
                  clearable
                >
                  <el-option
                    v-for="item in project_option"
                    :key="item.sid"
                    :label="item.jiaqileixing"
                    :value="item.sid"
                    style="width:100%"
                  ></el-option>
                </el-select>
              </span>
              <span>
                <span style="line-height: 31px;">缴费情况 ：</span>
                <el-select
                  v-model="content1_jf"
                  placeholder="缴费情况"
                  @change="jiaofei_filters(1)"
                  style="width:120px;margin-right:20px;"
                  clearable
                >
                  <el-option label="已缴" value="已缴"></el-option>
                  <el-option label="未缴" value="未缴"></el-option>
                  <el-option label="免缴" value="免缴"></el-option>
                </el-select>
              </span>
              <!-- <el-button
                type="success"
                icon="el-icon-search"
                style="width:130px"
                @click="jiaofei_data(),jf_name='',jiaofei_form.mname=''"
                class="huiyuan_button"
              >查询全部</el-button>-->
            </span>

            <el-button
              type="primary"
              @click="jiaofei_shenqing()"
              class="huiyuan_button"
              v-has="323"
            >添加</el-button>
          </div>
          <el-table
            :data="tableData_jf.filter(data => !content2_v || data.mname.toLowerCase().includes(content2_v.toLowerCase())).slice((this.currentPage2-1)*this.pageSize,this.currentPage2*this.pageSize)"
            style="width: 95.8%;margin:0 2.1%;height:380px;overflow:auto"
            align="center"
            height="380"
            @selection-change="handleSelectionChange"
            @row-click="clickRow_jf"
            ref="tableData_jf"
            highlight-current-row
            @sort-change="sortChange2"
            border
            row-key="mid"
            header-cell-class-name="t_h"
          >
            <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
            <el-table-column label="单位名称" align="center" prop="mname">
              <template slot-scope="scope">
                <span>{{ scope.row.mname }}</span>
              </template>
            </el-table-column>
            <el-table-column label="联系人" align="center" prop="liaison">
              <template slot-scope="scope">
                <span>{{ scope.row.liaison }}</span>
              </template>
            </el-table-column>
            <el-table-column label="应缴金额" align="center" prop="shouldpay" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.shouldpay }}</span>
              </template>
            </el-table-column>
            <el-table-column label="参与项目名称" align="center" prop="mtype">
              <template slot-scope="scope">
                <span>{{ project_s(scope.row.mtype) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="实缴金额" align="center" prop="inpay">
              <template slot-scope="scope">
                <span>{{ scope.row.inpay }}</span>
              </template>
            </el-table-column>
            <el-table-column label="到期日期" align="center" prop="endtime" sortable="custom">
              <template slot-scope="scope">
                <span>{{ scope.row.endtime | time_t }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="统一社会信用代码" align="center" prop="taxno">
          <template slot-scope="scope">
            <span>{{ scope.row.taxno }}</span>
          </template>
        </el-table-column>
        <el-table-column label="银行卡号" align="center" prop="bankcard">
          <template slot-scope="scope">
            <span>{{ scope.row.bankcard }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开户行" align="center" prop="ofbank">
          <template slot-scope="scope">
            <span>{{ scope.row.ofbank }}</span>
          </template>
            </el-table-column>-->
            <el-table-column label="缴纳情况" align="center" prop="paystatus">
              <template slot-scope="scope">
                <span>{{ scope.row.paystatus }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="140">
              <template slot-scope="scope">
                <div class="operation">
                  <span
                    style="color:#3399FF"
                    @click="jf_handleEdit(scope.row.mid, scope.row.mname,scope.row,0)"
                    v-has="321"
                  >详情</span>
                  <span
                    style="color:#3399FF"
                    @click="jf_handleEdit(scope.row.mid, scope.row.mname,scope.row,1)"
                    v-has="321"
                  >修改</span>
                  <span style="color:#FF5454" @click="jf_delete(scope.row.mid)" v-has="322">删除</span>
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
              :total="tableData_jf.filter(data => !content2_v || data.mname.toLowerCase().includes(content2_v.toLowerCase())).length"
            ></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 项目名称配置界面 -->
    <div class="content" v-show="activeIndex=='33'">
      <div class="table_top">
        <span style="line-height: 31px;">项目名称 ：</span>
        <input type="text" placeholder="搜索项目名称" v-model="content3_v" style="width:170px" />
        <el-button type="primary" @click="project_shenqing()" class="huiyuan_button" v-has="323">添加</el-button>
      </div>
      <el-table
        :data="tableData_jfpz.filter(data => !content3_v || data.jiaqileixing.toLowerCase().includes(content3_v.toLowerCase())).slice((this.currentPage3-1)*this.pageSize,this.currentPage3*this.pageSize)"
        style="width: 95.8%;margin:0 2.1%;height:380px;overflow:auto;"
        align="center"
        height="430"
        border
        header-cell-class-name="t_h"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="项目名称" align="center" prop="jiaqileixing">
          <template slot-scope="scope">
            <span>{{ scope.row.jiaqileixing }}</span>
          </template>
        </el-table-column>
        <el-table-column label="会费配置(元)" align="center" prop="xmPrice">
          <template slot-scope="scope">
            <span>{{ scope.row.xmPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="应缴金额" align="center" prop="shouldpay">
          <template slot-scope="scope">
            <span>{{ scope.row.shouldpay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参与项目名称" align="center" prop="shouldpay">
          <template slot-scope="scope">
            <span>{{ scope.row.shouldpay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实缴金额" align="center" prop="inpay">
          <template slot-scope="scope">
            <span>{{ scope.row.inpay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="缴纳情况" align="center" prop="paystatus">
          <template slot-scope="scope">
            <span>{{ scope.row.paystatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="缴费日期" align="center" prop="paytime">
          <template slot-scope="scope">
            <span>{{ scope.row.paytime | time_f }}</span>
          </template>
          </el-table-column>
        <el-table-column label="到期日期" align="center" prop="endtime">
          <template slot-scope="scope">
            <span>{{ scope.row.endtime | time_f }}</span>
          </template>
        </el-table-column>
        <el-table-column label="统一社会信用代码" align="center" prop="taxno">
          <template slot-scope="scope">
            <span>{{ scope.row.taxno }}</span>
          </template>
        </el-table-column>
        <el-table-column label="银行卡号" align="center" prop="bankcard">
          <template slot-scope="scope">
            <span>{{ scope.row.bankcard }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开户行" align="center" prop="ofbank">
          <template slot-scope="scope">
            <span>{{ scope.row.ofbank }}</span>
          </template>
        </el-table-column>-->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <span
                style="color:#3399FF"
                @click="xiugai_peizhi(scope.$index, scope.row)"
                v-has="321"
              >修改</span>
              <span style="color:#FF5454" @click="handleEdit_peizhi(scope.row)" v-has="322">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <span class="demonstration">每页10条</span>
        <el-pagination
          :current-page.sync="currentPage3"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="tableData_jfpz.filter(data => !content3_v || data.jiaqileixing.toLowerCase().includes(content3_v.toLowerCase())).length"
        ></el-pagination>
      </div>
    </div>
    <!-- 会员申请 -->
    <div class="content" v-show="activeIndex=='34'">
      <div class="table_top">
        <span style="line-height: 31px;">项目名称 ：</span>
        <input type="text" placeholder="搜索项目名称" v-model="content5_v" style="width:170px" />
        <!-- <el-button type="primary" @click="project_shenqing()" class="huiyuan_button" v-has="323">添加</el-button> -->
      </div>
      <el-table
        :data="vip_shenqingform.filter(data => !content5_v || data.mname.toLowerCase().includes(content5_v.toLowerCase())).slice((this.currentPage5-1)*this.pageSize,this.currentPage5*this.pageSize)"
        style="width: 95.8%;margin:0 2.1%;height:380px;overflow:auto;"
        align="center"
        height="430"
        border
        header-cell-class-name="t_h"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="单位名称" align="center" prop="jiaqileixing">
          <template slot-scope="scope">
            <span>{{ scope.row.mname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="法定代表" align="center" prop="xmPrice">
          <template slot-scope="scope">
            <span>{{ scope.row.legalPersonName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系人" align="center" prop="remark">
          <template slot-scope="scope">
            <span>{{ scope.row.liaison }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" align="center" prop="remark">
          <template slot-scope="scope">
            <span>{{ scope.row.telephone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="applyflag">
          <template slot-scope="scope">
            <span>{{scope.row.applyflag | pamduan_zt}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <span
                v-if="scope.row.applyflag === 1 "
                style="color:#3399FF"
                @click="vipshenqing_sp(scope.row,0)"
                v-has="341"
              >审批</span>
              <span style="color:#3399FF" @click="vipshenqing_sp(scope.row,1)">查看</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <span class="demonstration">每页10条</span>
        <el-pagination
          :current-page.sync="currentPage5"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="vip_shenqingform.filter(data => !content5_v || data.mname.toLowerCase().includes(content5_v.toLowerCase())).length"
        ></el-pagination>
      </div>
    </div>
    <!-- 项目名称配置细节弹窗 -->
    <el-dialog
      :title="project_title"
      :visible.sync="dialogTableVisible_paizhi"
      :close-on-click-modal="false"
      :show-close="false"
      destroy-on-close
      width="30%"
    >
      <el-form label-width="150px" :model="project_data" ref="project_data" :rules="rules">
        <el-form-item label="项目名称：" prop="jiaqileixing">
          <el-input v-model="project_data.jiaqileixing"></el-input>
        </el-form-item>
        <el-form-item label="会费配置：" prop="xmPrice">
          <el-input v-model="project_data.xmPrice"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="project_data.remark"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button class="return" @click="project_return('project_data')" style="width: 120px;">取消</el-button>
        <el-button
          type="primary"
          class="fill"
          @click="project_quren('project_data')"
          style="width: 120px;"
        >确定</el-button>
      </div>
    </el-dialog>
    <!-- 会员单位添加弹窗 -->
    <el-dialog
      :title="title_scan"
      :visible.sync="dialogTableVisible_1"
      :close-on-click-modal="false"
      @close="dialogTableVisible_1close"
      :before-close="guanbi_huiyuan"
      class="vip_xq"
    >
      <el-form
        label-width="150px"
        :model="vip_form"
        ref="vip_form"
        :rules="rules"
        :disabled="vip_form_show"
        class="formVipAdd"
      >
        <el-form-item label="单位名称：" prop="mname">
          <el-input v-model="vip_form.mname" placeholder="请输入单位名称"></el-input>
        </el-form-item>
        <el-form-item label="单位英文名称：" prop="enname">
          <el-input v-model="vip_form.enname" placeholder="请输入单位英文名称"></el-input>
        </el-form-item>
        <el-form-item label="单位性质：" prop="unitNature">
          <el-select v-model="vip_form.unitNature" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in u_option"
              :key="item.did"
              :label="item.dname"
              :value="item.did"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="单位地址：" prop="addr">
          <el-input v-model="vip_form.addr" placeholder="请输入单位地址"></el-input>
        </el-form-item>
        <el-form-item label="联系人：" :prop="vip_form_show ? 'asd' : 'liaison'">
          <el-input v-model="vip_form.liaison" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系人职务：" :prop="vip_form_show ? 'asd' : 'duty'">
          <el-input v-model="vip_form.duty" placeholder="请输入职务"></el-input>
        </el-form-item>
        <el-form-item label="联系人电话：" :prop="vip_form_show ? 'asd' : 'telephone'">
          <el-input v-model="vip_form.telephone" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱：" prop="email">
          <el-input v-model="vip_form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="法人代表：" prop="legalPersonName">
          <el-input v-model="vip_form.legalPersonName" placeholder="请输入法人姓名"></el-input>
        </el-form-item>
        <el-form-item label="社会职务：" :prop="vip_form_show ? 'asd' : 'socialDuty'">
          <el-input v-model="vip_form.socialDuty" placeholder="请输入社会职务"></el-input>
        </el-form-item>
        <el-form-item label="法人电话：" prop="legalPersonPhone">
          <el-input v-model="vip_form.legalPersonPhone" placeholder="请输入法人电话"></el-input>
        </el-form-item>
        <el-form-item label="法人身份证号：" prop="legalPersonCard">
          <el-input v-model="vip_form.legalPersonCard" placeholder="请输入法人身份证"></el-input>
        </el-form-item>
        <el-form-item label="统一社会信用代码：" :prop="vip_form_show ? 'asd' : 'taxno'">
          <el-input v-model="vip_form.taxno" placeholder="请输入统一社会信用代码"></el-input>
        </el-form-item>
        <el-form-item label="开户行：" :prop="vip_form_show ? 'asd' : 'ofbank'">
          <el-input v-model="vip_form.ofbank" placeholder="请输入开户行"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号：" :prop="vip_form_show ? 'asd' : 'bankcard'">
          <el-input v-model="vip_form.bankcard" placeholder="请输入银行卡号"></el-input>
        </el-form-item>
        <el-form-item label="入会日期：" :prop="vip_form_show ? 'asd' : 'intime'">
          <el-date-picker
            v-model="vip_form.intime"
            type="date"
            placeholder="请选择日期"
            style="width:100%"
            format="yyyy 年 MM 月 dd 日"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="会员类型：" :prop="vip_form_show ? 'asd' : 'mtype'">
          <el-select v-model="vip_form.mtype" placeholder="请选择" style="width:100%" filterable>
            <el-option
              v-for="item in m_option"
              :key="item.did"
              :label="item.dname"
              :value="item.did"
              style="width:100%"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="协会职务：" :prop="vip_form_show ? 'asd' : 'xhduty'">
          <el-select
            v-model="vip_form.xhduty"
            placeholder="请选择"
            style="width:100%"
            clearable
            filterable
          >
            <el-option value="理事长" label="理事长"></el-option>
            <el-option value="副理事长" label="副理事长"></el-option>
            <el-option value="常务理事" label="常务理事"></el-option>
            <el-option value="理事" label="理事"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参与项目：" prop="project">
          <el-select
            v-model="vip_form.invProject"
            placeholder="请选择"
            style="width:100%"
            multiple
            filterable
          >
            <el-option
              v-for="item in project_select"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="会员到期日期：" prop="endtime">
          <!-- <el-input v-model="vip_form.intime"></el-input> -->
          <el-date-picker
            disabled
            v-model="vip_form.endtime"
            type="date"
            placeholder="请选择日期"
            style="width:100%"
            format="yyyy 年 MM 月 dd 日"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="退会日期：" prop="endtime" v-if="show_outTime">
          <!-- <el-input v-model="vip_form.intime"></el-input> -->
          <el-date-picker
            v-model="vip_form.outTime"
            type="date"
            placeholder="请选择日期"
            style="width:100%"
            format="yyyy 年 MM 月 dd 日"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="材料是否齐全：" :prop="vip_form_show ? 'asd' : 'fulldata'" style="width:100%">
          <!-- <el-input v-model="vip_form.fulldata"></el-input> -->
          <el-select v-model="vip_form.fulldata" style="width:100%">
            <el-option label="是" value="是"></el-option>
            <el-option label="否" value="否"></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="上传附件：" prop="mid" style="text-align: left;"> -->
        <!-- <div v-if="jiaofei_status" class="upload_button">
			    <div>
			      <span>上传附件：</span>
			      <a href="javascript:;" @click="downform()">{{file_name}}</a>
			    </div>
			    <div>
			      <a href="javascript:;" :class="[isActive?'file':'file_1']">
			        <input type="file" id="myFile" @change="upload($event)" />上传附件
			      </a>
			    </div>
        </div>-->
        <!-- <newUpload></newUpload>
        </el-form-item>-->
        <el-form-item
          :label="vip_form_show ?'企业资格证书' : '上传企业资格证书'"
          style="text-align: left;width:100%"
          prop="mid"
        >
          <newUpload ref="newUpload" key="randomkey" :Upload_showdisable="Upload_showdisable"></newUpload>
        </el-form-item>
        <el-form-item
          :label="vip_form_show ?'企业简介' : '上传企业简介'"
          style="text-align: left;width:100%"
          prop="aid"
        >
          <newUpload ref="newUpload1" key="randomkey" :Upload_showdisable="Upload_showdisable"></newUpload>
        </el-form-item>
      </el-form>
      <div v-if="huiyuan_status" slot="footer" class="dialog-footer">
        <el-button
          class="return"
          @click="huiyuan_return()"
          v-show="!vip_form_show"
          style="width: 120px;"
        >取消</el-button>
        <el-button
          style="width: 120px;"
          type="primary"
          class="fill"
          @click="huiyuan_queren('vip_form')"
          v-show="!vip_form_show"
        >确定</el-button>
        <el-button
          style="width: 120px;"
          type="primary"
          class="fill"
          @click="huiyuan_queren_chakan()"
          v-show="vip_form_show"
        >确定</el-button>
      </div>
    </el-dialog>
    <!-- 缴费记录项目费弹窗 -->
    <el-dialog
      :title="jf_title"
      :visible.sync="dialogTableVisible_2"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form
        label-width="155px"
        :model="jiaofei_form"
        ref="jiaofei_form"
        :rules="rules"
        :disabled="xiangqing_project"
      >
        <el-form-item label="单位名称：" prop="mname">
          <el-select
            v-model="jiaofei_form.mname"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remotemethod"
            :loading="loading"
            @focus="chaxun_danwei"
            style="width:100%"
            clearable
            @change="chaxun_kahao(1)"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="单位名称：" prop="mname">
          <el-input v-model="jiaofei_form.mname"></el-input>
        </el-form-item>-->
        <el-form-item label="联系人：" prop="liaison">
          <el-input v-model="jiaofei_form.liaison"></el-input>
        </el-form-item>
        <el-form-item label="项目名称：" prop="mtype">
          <!-- <el-input v-model="jiaofei_form.shouldpay"></el-input> -->
          <el-select
            v-model="jiaofei_form.mtype"
            placeholder="请选择"
            style="width:100%"
            @change="jiaofei_form_getprice"
          >
            <el-option
              v-for="item in project_option"
              :key="item.sid"
              :label="item.jiaqileixing"
              :value="item.sid"
              style="width:100%"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应缴金额：" prop="shouldpay">
          <el-input v-model="jiaofei_form.shouldpay"></el-input>
        </el-form-item>
        <el-form-item label="实缴金额：" prop="inpay">
          <el-input v-model="jiaofei_form.inpay"></el-input>
        </el-form-item>
        <el-form-item label="缴纳情况：" prop="paystatus">
          <el-select v-model="jiaofei_form.paystatus" style="width:100%">
            <el-option label="已缴" value="已缴"></el-option>
            <el-option label="未缴" value="未缴"></el-option>
            <el-option label="免缴" value="免缴"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缴费日期：" prop="paytime">
          <el-date-picker
            v-model="jiaofei_form.paytime"
            type="date"
            placeholder="选择日期"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="到期日期：" prop="endtime">
          <el-date-picker
            v-model="jiaofei_form.endtime"
            type="date"
            placeholder="选择日期"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="统一社会信用代码：" prop="taxno">
          <el-input v-model="jiaofei_form.taxno" placeholder="社会信用代码"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号：" prop="bankcard">
          <el-input v-model="jiaofei_form.bankcard" placeholder="银行卡号"></el-input>
        </el-form-item>
        <el-form-item label="开户行：" prop="ofbank">
          <el-input v-model="jiaofei_form.ofbank" placeholder="开户行"></el-input>
        </el-form-item>
        <!-- <el-form-item label="组件id：" prop="mid" >
          <el-input v-model="jiaofei_form.mid"></el-input>
        </el-form-item>-->
        <!-- <div v-if="jiaofei_status" class="upload_button">
          <div>
            <span>上传附件：</span>
            <a href="javascript:;" @click="downform()">{{file_name}}</a>
          </div>
          <div>
            <a href="javascript:;" :class="[isActive?'file':'file_1']">
              <input type="file" id="myFile" @change="upload($event)" />上传附件
            </a>
          </div>
        </div>-->
        <div v-if="!xiangqing_project" style="display: flex;
    justify-content: flex-end;">
          <el-button class="return" @click="jiaofei_return('jiaofei_form')" style="width: 120px;">取消</el-button>
          <el-button
            type="primary"
            class="fill"
            @click="jiaofei_queren('jiaofei_form')"
            style="width: 120px;"
          >确定</el-button>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right:8%" v-if="xiangqing_project">
        <el-button type="primary" @click="xiangqing_close()" style="width: 120px;">确定</el-button>
      </div>
    </el-dialog>
    <!-- 缴费记录会费弹窗 -->
    <el-dialog
      :title="hf_title"
      :visible.sync="dialogTableVisible_3"
      :close-on-click-modal="false"
      @close="huifei_return"
    >
      <el-form
        label-width="155px"
        :model="huifei_form"
        ref="huifei_form"
        :rules="rules"
        :disabled="huifei_xaingqing"
      >
        <el-form-item label="单位名称：" prop="mname">
          <el-select
            v-model="huifei_form.mname"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remotemethod"
            :loading="loading"
            @focus="chaxun_danwei"
            style="width:100%"
            clearable
            @change="chaxun_kahao(0)"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="单位名称：" prop="mname">
          <el-input v-model="huifei_form.mname" :disabled="danwei_s()"></el-input>
        </el-form-item>-->
        <el-form-item label="联系人：" prop="liaison">
          <el-input v-model="huifei_form.liaison"></el-input>
        </el-form-item>
        <el-form-item label="应缴金额：" prop="shouldpay">
          <el-input v-model="huifei_form.shouldpay"></el-input>
        </el-form-item>

        <el-form-item label="年度：" prop="annual">
          <el-date-picker
            v-model="huifei_form.annual"
            value-format="yyyy"
            placeholder="请选择"
            type="year"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="实缴金额：" prop="inpay">
          <el-input v-model="huifei_form.inpay"></el-input>
        </el-form-item>
        <el-form-item label="缴纳情况：" prop="paystatus">
          <el-select v-model="huifei_form.paystatus" style="width:100%">
            <el-option label="已缴" value="已缴"></el-option>
            <el-option label="未缴" value="未缴"></el-option>
            <el-option label="免缴" value="免缴"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缴费日期：" prop="paytime">
          <el-date-picker
            v-model="huifei_form.paytime"
            type="date"
            placeholder="选择日期"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="到期日期：" prop="endtime">
          <el-date-picker
            v-model="huifei_form.endtime"
            type="date"
            placeholder="选择日期"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="统一社会信用代码：" prop="taxno" label-width="155px">
          <el-input v-model="huifei_form.taxno" placeholder="社会信用代码"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号：" prop="bankcard">
          <el-input v-model="huifei_form.bankcard" placeholder="银行卡号"></el-input>
        </el-form-item>
        <el-form-item label="开户行：" prop="ofbank">
          <el-input v-model="huifei_form.ofbank" placeholder="开户行"></el-input>
        </el-form-item>
        <div v-if="!huifei_xaingqing" style="display: flex;justify-content: flex-end;">
          <el-button class="return" @click="huifei_return('huifei_form')" style="width: 120px;">取消</el-button>
          <el-button type="primary" @click="huifei_submit('huifei_form')" style="width: 120px;">确定</el-button>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right:8%" v-if="huifei_xaingqing">
        <el-button type="primary" @click="xaingqing_cancel()" style="width: 120px;">确定</el-button>
      </div>
    </el-dialog>
    <!-- 状态改变弹窗 -->
    <el-dialog title="会员状态改变" :visible.sync="dialogTableVisible_statuschange" width="30%">
      <!-- <div style="margin-bottom:20px">
        <span>会费到期日期 ：</span>
        <el-date-picker
          v-model="vip_form_endtime"
          type="date"
          placeholder="请选择日期"
          style="width:50%"
          format="yyyy 年 MM 月 dd 日"
          @change="gethuifei_endtime"
        ></el-date-picker>
      </div>-->
      <div>
        <span style="margin-left:20px">会员状态 ：</span>
        <el-select placeholder="请选择状态" v-model="colorStatus" style="width:50%;margin-left:5px">
          <el-option value="0" label="正常"></el-option>
          <el-option value="1" label="欠费"></el-option>
          <el-option value="2" label="退会"></el-option>
        </el-select>
      </div>
      <div style="margin-top:20px;width:80%;margin-left:16%;color:red">
        <p>提示：正常情况下显示黑色，欠费时显示黄色，超过一年未交费的显示红色。</p>
      </div>
      <div style="margin-top:50px;">
        <el-button type="info" @click="vip_colorStatus_info()" style="width: 120px;">取消</el-button>
        <div style="display:inline-block;width:30px"></div>
        <el-button type="primary" @click="vip_colorStatus_confirm()" style="width: 120px;">确定</el-button>
      </div>
    </el-dialog>
    <!-- 会员申请审批弹窗 -->
    <el-dialog
      title="会员详情"
      :visible.sync="dialogvisible_vipshenqing"
      width="40%"
      class="vip_xq"
      @close="vipxq_close"
      :close-on-click-modal="false"
    >
      <el-form :model="vip_xq" ref="vip_xq" label-width="150px" class="formVipAdd">
        <el-form-item label="单位名称：" prop="mname" style="width:100%">
          <span>{{vip_xq.mname}}</span>
        </el-form-item>
        <el-form-item label="单位英文名称：" prop="enname" style="width:100%">
          <span>{{vip_xq.enname}}</span>
        </el-form-item>
        <el-form-item label="会员类型：" prop="mtype" v-if="vip_xq.mtype" style="width:100%">
          <el-select v-model="vip_xq.mtype" disabled style="width:100%">
            <!-- <el-option label="远洋渔业企业" value="1"></el-option>
            <el-option label="相关行业单位" value="0"></el-option>-->
          </el-select>
        </el-form-item>
        <el-form-item label="营业执照登记号：" prop="remark">
          <span>{{vip_xq.remark}}</span>
        </el-form-item>
        <el-form-item label="详细通讯地址：" prop="addr">
          <span>{{vip_xq.addr}}</span>
        </el-form-item>
        <el-form-item label="邮政编码：" prop="inpay">
          <span>{{vip_xq.inpay}}</span>
        </el-form-item>
        <el-form-item label="网址：" prop="shouldpay">
          <span>{{vip_xq.shouldpay}}</span>
        </el-form-item>
        <el-form-item label="电子邮箱：" prop="mail">
          <span>{{vip_xq.mail}}</span>
        </el-form-item>
        <el-form-item label="法人代表：" prop="legalPersonName">
          <span>{{vip_xq.legalPersonName}}</span>
        </el-form-item>
        <el-form-item label="职务：" prop="duty">
          <span>{{vip_xq.duty}}</span>
        </el-form-item>
        <el-form-item label="身份证号：" prop="legalPersonCard">
          <span>{{vip_xq.legalPersonCard}}</span>
        </el-form-item>
        <el-form-item label="社会职务：" prop="xhduty">
          <span>{{vip_xq.xhduty}}</span>
        </el-form-item>
        <el-form-item label="联系电话：" prop="legalPersonPhone">
          <span>{{vip_xq.legalPersonPhone}}</span>
        </el-form-item>
        <el-form-item label="单位性质：" prop="unitNature ">
          <span>{{vip_xq.unitNature }}</span>
        </el-form-item>
        <el-form-item label="职工人数（人）：" prop="dtype">
          <span>{{vip_xq.dtype}}</span>
        </el-form-item>
        <el-form-item label="注册资本（万元）：" prop="taxno">
          <span>{{vip_xq.taxno}}</span>
        </el-form-item>
        <el-form-item label="年产值（万元）：" prop="bankcard">
          <span>{{vip_xq.bankcard}}</span>
        </el-form-item>
        <el-form-item label="业务范围：" prop="ofbank">
          <span>{{vip_xq.ofbank}}</span>
        </el-form-item>

        <el-form-item label="联系人：" prop="liaison">
          <span>{{vip_xq.liaison}}</span>
        </el-form-item>
        <el-form-item label="联系人职务：" prop="professionaboard">
          <span>{{vip_xq.professionaboard}}</span>
        </el-form-item>
        <el-form-item label="联系人电话：" prop="telephone">
          <span>{{vip_xq.telephone}}</span>
        </el-form-item>
        <el-form-item label="传真：" prop="fax" style="width:100%">
          <span>{{vip_xq.fax}}</span>
        </el-form-item>
        <el-form-item label="审批意见：" prop="mid" v-if="vip_xq.reason" style="width:100%">
          <span>{{vip_xq.reason}}</span>
        </el-form-item>
        <el-form-item label="企业资格证书：" prop="mid" disabled style="width:100%">
          <new-upload style="float:left" ref="vip_file" :Upload_showdisable="Upload_showdisable"></new-upload>
        </el-form-item>
        <el-form-item label="企业简介：" prop="mid" disabled style="width:100%">
          <new-upload style="float:left" ref="vip_file1" :Upload_showdisable="Upload_showdisable"></new-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          style="width:120px"
          v-if="show_spbutton"
          @click="vipsq_agree(0)"
        >同 意</el-button>
        <el-button
          type="danger"
          style="width:120px"
          v-if="show_spbutton"
          @click="vipsq_agree(2)"
        >拒 绝</el-button>
        <el-button type="primary" style="width:120px" @click="vipxq_close()">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="vip_sptishi"
      :visible.sync="dialogTableVisible_vipspxx"
      :close-on-click-modal="false"
      width="430px"
      :show-close="false"
    >
      <el-form label-width="100px" :rules="vip_spyj" :model="vip_sp" ref="vip_sp" class="vip_spcss">
        <el-form-item label="入会时间：" prop="shenpidata">
          <el-date-picker v-model="vip_sp.shenpidata" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="会员类型：" prop="shenpitype">
          <el-select v-model="vip_sp.shenpitype">
            <el-option label="远洋渔业企业" value="1"></el-option>
            <el-option label="相关行业单位" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批意见：" prop="shenpiyijian">
          <textarea v-model="vip_sp.shenpiyijian" style="width:230px;height:250px"></textarea>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" style="width:120px" @click="vipsq_agree1()">确 定</el-button>
        <el-button type="primary" style="width:120px" @click="vipxq_close1()">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// const t=sessionStorage.getItem("token")
import newUpload from "./newUpload.vue";
export default {
  inject: ["reload"],
  name: "Member",
  components: { newUpload },
  data() {
    var validatePass = (rule, value, callback) => {
      //    console.log(rule, value, callback, "判断条件", this.activeIndex);
      let data = new FormData();
      let yanzhengdata = "";
      data.append("mid", this.huiyuandanwei_mid);
      data.append("mname", value);
      this.$http.post("/vc/iem", data).then((res) => {
        yanzhengdata = res.data;
        if (this.activeIndex == 31) {
          if (!value) {
            return callback(new Error("单位名称不能为空"));
          } else if (value && yanzhengdata == false) {
            return callback(new Error("单位名称已注册"));
          } else {
            callback();
          }
        } else {
          if (!value) {
            return callback(new Error("单位名称不能为空"));
          } else {
            callback();
          }
        }
      });
    };

    return {
      //会员同意或拒绝意见窗口
      vip_sp: {
        shenpidata: "",
        shenpitype: "",
        shenpiyijian: "",
      },
      vip_spyj: {
        shenpidata: [
          { required: true, message: "请选择入会日期", trigger: "change" },
        ],
        shenpitype: [
          { required: true, message: "请选择会员单位类型", trigger: "change" },
        ],
      },

      vip_sptishi: "",

      dialogTableVisible_vipspxx: false,
      //会员申请审批数据
      vipxq_mid: "",
      show_spbutton: false,
      fileshow: false,
      vip_xq: {},
      dialogvisible_vipshenqing: false,
      vip_shenqingform: [],
      content5_v: "",
      currentPage4: 1,
      currentPage5: 1,
      Upload_showdisable: true,
      showdaoru: false,
      huiyuandanwei_mid: "",
      change_name: false,
      show_outTime: false,
      options: [],
      value: [],
      list: [],
      loading: false,
      states: [],
      activename: "vip_price",
      search_type: "",
      search_endtime: "",
      search_starttime: "",
      colorStatus: "",
      dialogTableVisible_statuschange: false,
      vip_form_show: false,
      fileList_1: [],
      jf_title: "缴费记录添加",
      project_title: "项目配置添加",
      //单位类型选项
      m_option: [
        { dname: "远洋渔业企业", did: 1 },
        { dname: "相关行业单位", did: 0 },
      ],
      u_option: [
        { dname: "国企", did: 0 },
        { dname: "集体", did: 1 },
        { dname: "私活", did: 2 },
        { dname: "合资", did: 3 },
        { dname: "股份", did: 4 },
        { dname: "外企", did: 5 },
        { dname: "社团", did: 6 },
        { dname: "政府", did: 7 },
        { dname: "事业", did: 8 },
        { dname: "科研院校", did: 9 },
      ],
      // <el-option value="0" label="国企"></el-option>
      //       <el-option value="1" label="集体"></el-option>
      //       <el-option value="2" label="私活"></el-option>
      //       <el-option value="3" label="合资"></el-option>
      //       <el-option value="4" label="股份"></el-option>
      //       <el-option value="5" label="外企"></el-option>
      //       <el-option value="6" label="社团"></el-option>
      //       <el-option value="7" label="政府"></el-option>
      //       <el-option value="8" label="事业"></el-option>
      //       <el-option value="9" label="科研院校"></el-option>
      project_option: [],
      project_select: [],
      duty_option: [],
      title_scan: "会员查看",
      // title_edit:"会员修改",
      content1_v: "",
      content2_v: "",
      content3_v: "",
      content4_v: "",
      pageSize: 10, //每页条数
      a1: 123,
      jiaofei_status: true,
      isActive: true,
      file_name: "",
      huiyuan_status: false,
      shouwen_status: false,
      currentPage1: 1, //当前页1
      currentPage2: 1, //当前页2
      currentPage3: 1, //当前页2
      currentPage4: 1,
      //会员表单
      vip_form: {
        socialDuty: "",
        //联系人
        liaison: "",
        //电话
        telephone: "",
        email: "",
        mname: "",
        enname: "",
        addr: "",
        mtype: "",
        unitNature: "",
        duty: "",
        intime: "",
        endtime: "",
        xhduty: "",
        fulldata: "",
        taxno: "",
        bankcard: "",
        ofbank: "",
        invProject: [],
        // depll:'',
        outTime: "",
      },
      //会员表单提交
      vip_data: {},
      //缴费表单
      jiaofei_form: {
        //会员单位名称
        mname: "",
        //应缴纳金额
        shouldpay: "",
        //联系人
        liaison: "",
        //单位地址
        addr: "",
        //单位类型
        mtype: "",
        annual: "",
        //附件
        annex: "",
        //实际缴纳
        inpay: "",
        //银行卡号
        bankcard: "",
        //职务
        duty: "",
        //会费缴费状态
        paystatus: "",
        email: "",
        //缴费日期
        paytime: "",
        //会费到期时间
        endtime: "",
        //税号
        taxno: "",
        //银行卡号
        bankcard: "",
        // endtime: "2019-10-23T10:44:10.053Z",
        //传真
        fax: "",
        //开户行
        ofbank: "",
        mtype: "",
        //材料是否齐全
        // fulldata: "",
        // //入会时间
        // // intime: "",
        // mail: "",
        // mid: "",
        // //备注
        // remark: "",
        // telephone: "",
        // //协会服务
        // xhduty: ""
      },
      content1_user: "",
      content1_jf: "",
      fid: "",
      dialogTableVisible_1: false,
      dialogTableVisible_2: false,
      dialogTableVisible_paizhi: false,
      dialogTableVisible_edit: false,
      menu: [
        // { name: "会员单位", id: "31" }, { name: "缴费记录", id: "32" }
      ],
      //跨页选中相关参数
      multipleSelection: [],
      multipleSelectionAll: [], // 所有选中的数据包含跨页数据
      idKey: "mid",
      float: [],
      activeIndex: "",
      tableData_hy: [],
      tableData_hy_scan: [],
      tableData_jf: [],
      tableData_jfpz: [],
      fileList: [], //上传附件
      project_data: {
        jiaqileixing: "",
        remark: "",
        xmPrice: "",
      },
      scan_status: 1,
      project_status: 1,
      jf_status: 1,
      jf_name: "",
      rules: {
        annual: [{ required: true, message: "请输入年度", trigger: "blur" }],
        jiaqileixing: [
          { required: true, message: "请输入项目名称", trigger: "change" },
        ],
        liaison: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" },
        ],
        xmPrice: [
          { required: true, message: "请输入项目标准价格", trigger: "blur" },
        ],
        mname: [
          {
            validator: validatePass,
            // message: "请输入单位名称",
            trigger: "blur",
          },
          { required: true, message: "请输入单位名称", trigger: "blur" },
        ],
        duty: [{ required: true, message: "请输入职务岗务", trigger: "blur" }],
        telephone: [
          { required: true, message: "请输入电话", trigger: "change" },
        ],
        intime: [
          { required: true, message: "请选择入会日期", trigger: "blur" },
        ],
        mtype: [
          { required: true, message: "请选择下拉框信息", trigger: "blur" },
        ],
        paystatus: [
          { required: true, message: "请选择缴纳情况", trigger: "blur" },
        ],
        // intime: [
        //   { required: true, message: "请输入入会日期", trigger: "change" }
        // ],
        // endtime: [
        //   { required: true, message: "请输入会费到期日期", trigger: "change" }
        // ],
        xhduty: [
          { required: true, message: "请输入协会职务", trigger: "blur" },
        ],
        fulldata: [
          { required: true, message: "请选择材料齐全情况", trigger: "blur" },
        ],
        taxno: [
          {
            required: true,
            message: "请输入统一社会信用代码",
            trigger: "blur",
          },
        ],
        bankcard: [
          { required: true, message: "请输入银行卡号", trigger: "blur" },
        ],
        ofbank: [{ required: true, message: "请输入开户行", trigger: "blur" }],
        invProject: [
          { required: true, message: "请输入选择参与项目", trigger: "blur" },
        ],
      },
      xiangqing_project: "",
      vip_mid: "",
      huifei_form: {
        //会员单位名称
        mname: "",
        //应缴纳金额
        shouldpay: "",
        //联系人
        liaison: "",
        //单位地址
        addr: "",
        //单位类型
        mtype: "",
        //附件
        annex: "",
        //实际缴纳
        inpay: "",
        //银行卡号
        bankcard: "",
        //职务
        duty: "",
        //会费缴费状态
        paystatus: "",
        email: "",
        //缴费日期
        paytime: "",
        //会费到期时间
        endtime: "",
        //税号
        taxno: "",
        //银行卡号
        bankcard: "",
        // endtime: "2019-10-23T10:44:10.053Z",
        //传真
        fax: "",
        //开户行
        ofbank: "",
        mtype: "",
        annual: "",
        //材料是否齐全
        // fulldata: "",
        // //入会时间
        // // intime: "",
        // mail: "",
        // mid: "",
        // //备注
        // remark: "",
        // telephone: "",
        // //协会服务
        // xhduty: ""
      },
      //缴费记录：会费数据
      content1_hf: "",
      dialogTableVisible_3: false,
      hf_title: "",
      content3_v: "",
      tableData_hf: [],
      huifei_xaingqing: false,
      huifei_status: "",
      vip_form_endtime: "",
      fileListId: "",
      fileListId1: "",
    };
  },
  methods: {
    hf_delete(value) {
      let data = new FormData();
      data.append("id", value);
      this.$confirm("确认删除信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.$http.post("/vc/d", data).then((res) => {
          this.jiaofei_huifei();
        });
      });
    },
    //会员申请审批窗口确定
    vipsq_agree1() {
      let data = new FormData();
      data.append("mtype", this.vip_sp.shenpitype);
      data.append("mid", this.vipxq_mid);
      data.append("applyflag", 0);
      data.append("intime", this.vip_sp.shenpidata);
      data.append("reason", this.vip_sp.shenpiyijian);
      this.$refs.vip_sp.validate((valid) => {
        if (valid) {
          if (
            this.vip_sp.shenpiyijian == null ||
            this.vip_sp.shenpiyijian == ""
          ) {
            this.vip_sp.shenpiyijian = "同意";
          }
          this.$http.post("/vc/au", data).then((res) => {
            this.$refs.vip_sp.resetFields();
            this.dialogTableVisible_vipspxx = false;
            this.dialogvisible_vipshenqing = false;
            this.vipxq_mid = "";
            this.vip_xq.mtype = "";
            this.$message({
              type: "success",
              message: "审批成功",
            });
            this.vip_shenqingdata();
            this.huiyuan_data();
          });
        }
      });
    },
    //会员申请审批窗口关闭
    vipxq_close1() {
      this.$refs.vip_sp.resetFields();
      this.dialogTableVisible_vipspxx = false;
    },
    //会员申请审批同意或拒绝
    vipsq_agree(type) {
      if (type == 0) {
        this.dialogTableVisible_vipspxx = true;
        this.vip_sptishi = "同意入会申请";
      }
      if (type == 2) {
        this.$prompt("请输入拒绝原因", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }).then(({ value }) => {
          if (value == null || value == "") {
            value = "拒绝";
          }
          let data = new FormData();
          data.append("mid", this.vipxq_mid);
          data.append("reason", value);
          data.append("applyflag", type);
          this.$http.post("/vc/au", data).then(() => {
            this.vipxq_mid = "";
            this.dialogTableVisible_vipspxx = false;
            this.dialogvisible_vipshenqing = false;
            this.vip_xq.mtype = "";
            this.$message({
              type: "success",
              message: "审批成功",
            });
            this.vip_shenqingdata();
          });
        });
      }
    },
    //会员申请详情弹窗关闭
    vipxq_close() {
      this.$refs.vip_xq.resetFields();
      this.dialogvisible_vipshenqing = false;
      this.$refs.vip_file.fileList = [];
      this.$refs.vip_file1.fileList = [];
      this.vip_xq.mtype = "";
    },
    //会员申请的审批按钮
    vipshenqing_sp(value, num) {
      console.log(value, "会员申请单条数据");
      this.vip_xq = JSON.parse(JSON.stringify(value));
      if (value.mtype === 0) {
        this.vip_xq.mtype = "相关行业单位";
      } else if (value.mtype === 1) {
        this.vip_xq.mtype = "远洋渔业企业";
      }
      console.log(value.mtype);
      console.log(this.vip_xq.mtype);
      let t = value.unitNature;
      switch (t) {
        case 0:
          this.vip_xq.unitNature = "国企";
          break;
        case 1:
          this.vip_xq.unitNature = "集体";
          break;
        case 2:
          this.vip_xq.unitNature = "私活";
          break;
        case 3:
          this.vip_xq.unitNature = "合资";
          break;
        case 4:
          this.vip_xq.unitNature = "股份";
          break;
        case 5:
          this.vip_xq.unitNature = "外企";
          break;
        case 6:
          this.vip_xq.unitNature = "社团";
          break;
        case 7:
          this.vip_xq.unitNature = "政府";
          break;
        case 8:
          this.vip_xq.unitNature = "事业";
          break;
        case 9:
          this.vip_xq.unitNature = "科研院校";
          break;
        default:
          break;
      }
      this.vipxq_mid = value.mid;
      this.dialogvisible_vipshenqing = true;
      this.Upload_showdisable = false;
      console.log(value.applyflag);
      if (num == 1) {
        this.show_spbutton = false;
      } else if (num == 0) {
        value.applyflag == 1
          ? (this.show_spbutton = true)
          : (this.show_spbutton = false);
      }
      console.log(this.show_spbutton);
      let comProfile = value.comProfile;
      let fid = value.fid;
      if (fid != null) {
        this.fileshow = true;
        let data = new FormData();
        data.append("fid", fid);
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
          this.$refs.vip_file.fileList = this.fileList;
        });
      }
      if (comProfile != null) {
        this.fileshow = true;
        let data = new FormData();
        data.append("fid", comProfile);
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
          this.$refs.vip_file1.fileList = this.fileList;
        });
      }
    },
    //会员申请审批页面
    vip_shenqingdata() {
      let data = new FormData();
      this.$http.post("/vc/vl", data).then((res) => {
        this.vip_shenqingform = res.data;
        console.log(res.data);
      });
    },
    gethuifei_endtime() {
      let data = new FormData();
      data.append("id", this.vip_mid);
      data.append("endTime", this.vip_form_endtime);
      this.$http.post("vc/cvs", data).then((res) => {
        res.data = String(res.data);
        this.colorStatus = res.data;
        this.$forceUpdate();
      });
    },
    jiaofei_form_getprice(value) {
      console.log(value);
      let data = new FormData();
      data.append("id", value);
      this.$http.post("/vc/gp", data).then((res) => {
        this.jiaofei_form.shouldpay = res.data;
        this.$forceUpdate();
      });
    },
    chaxun_kahao(num) {
      console.log(this.huifei_form.mname, "vlaue");
      let data = new FormData();
      if (num == 0) {
        data.append("mname", this.huifei_form.mname);
        this.$http.post("/vc/gcn", data).then((res) => {
          console.log(res.data);
          this.huifei_form.bankcard = res.data.bankcard;
          this.huifei_form.ofbank = res.data.ofbank;
          this.huifei_form.taxno = res.data.taxno;
          console.log(this.huifei_form);
        });
      } else if (num == 1) {
        data.append("mname", this.jiaofei_form.mname);
        this.$http.post("/vc/gcn", data).then((res) => {
          this.jiaofei_form.bankcard = res.data.bankcard;
          this.jiaofei_form.ofbank = res.data.ofbank;
          this.jiaofei_form.taxno = res.data.taxno;
          console.log(this.jiaofei_form);
        });
      }
      this.$forceUpdate();
    },
    //单位查询
    chaxun_danwei() {
      let data = new FormData();
      this.$http.post("/vc/gvm", data).then((res) => {
        this.states = res.data;
        this.list = this.states.map((item) => {
          return { value: item, label: item };
        });
        console.log(this.list);
      });
    },
    //查找关键词
    remotemethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options = this.list.filter((item) => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
    //关闭dialog时的事件
    dialogTableVisible_1close() {},
    //会费详情的弹窗确定
    xaingqing_cancel() {
      this.dialogTableVisible_3 = false;
      this.$refs.huifei_form.resetFields();
      this.clear_f(this.huifei_form);
    },
    //会费详情/修改按钮
    hf_handleEdit(value, num) {
      if (num == 0) {
        this.huifei_xaingqing = true;
        this.hf_title = "会费详情";
      } else if (num == 1) {
        this.huifei_xaingqing = false;
        this.hf_title = "会费修改";
      }
      this.huifei_status = 2;
      this.huifei_form = JSON.parse(JSON.stringify(value));
      this.dialogTableVisible_3 = true;
    },
    //会费弹窗确认按钮
    huifei_submit(formName) {
      this.huifei_xaingqing = false;
      let data = new FormData();
      for (let key in this.huifei_form) {
        if (this.huifei_form[key] != "" && this.huifei_form[key] != null) {
          data.append(key, this.huifei_form[key]);
        }
      }
      console.log(this.huifei_form, "sadasdasd");
      data.append("mid", this.huifei_form.mid);
      data.append("status", 0);
      data.append("dtype", 1);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("确认信息填写无误", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info",
          }).then(() => {
            if (this.huifei_status == 1) {
              data.delete("mid");
              this.$http.post("/vc/a", data).then((res) => {
                this.dialogTableVisible_3 = false;
                this.clear_f(this.huifei_form);
                this.jiaofei_huifei();
                this.$message({
                  message: "添加成功",
                  type: "success",
                });
              });
            } else if (this.huifei_status == 2) {
              if (this.huifei_form.intime != null)
                data.set("intime", new Date(this.huifei_form.intime));
              if (this.huifei_form.endtime != null)
                data.set("endtime", new Date(this.huifei_form.endtime));
              if (this.huifei_form.paytime != null)
                data.set("paytime", new Date(this.huifei_form.paytime));
              if (this.huifei_form.createTime != null)
                data.set("createTime", new Date(this.huifei_form.createTime));
              this.$http.post("/vc/up", data).then((res) => {
                this.dialogTableVisible_3 = false;
                this.clear_f(this.huifei_form);
                this.jiaofei_huifei();
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
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
    //会费弹窗关闭按钮
    huifei_return(type) {
      this.$refs.huifei_form.resetFields();
      this.dialogTableVisible_3 = false;
      this.clear_f(this.huifei_form);
    },
    //会费添加
    hf_add() {
      this.huifei_status = 1;
      this.hf_title = "会费记录添加";
      this.huifei_xaingqing = false;
      this.dialogTableVisible_3 = true;
    },
    // 详情页面关闭
    xiangqing_close() {
      this.$refs.jiaofei_form.resetFields();
      this.jiaofei_form.mname = this.jf_name;
      this.isActive = true;
      this.file_name = "";
      this.dialogTableVisible_2 = false;
    },
    // 会员表头搜索
    handleclick() {},
    vip_search() {
      let data = new FormData();
      let mname = this.content1_v;
      let mtype = this.search_type;
      let time = [];
      if (this.search_starttime != "") {
        time.push(this.search_starttime);
      }
      if (this.search_endtime != "") {
        time.push(this.search_endtime);
      }
      data.append("mname", mname);
      data.append("mtype", mtype);
      data.append("time", time);
      this.$http.post("/vc/gau", data).then((res) => {
        this.tableData_hy = res.data;
      });
    },
    //会员状态确定
    vip_colorStatus_confirm() {
      let a = this.colorStatus;
      let mid = this.vip_mid;
      let data = new FormData();
      data.append("mid", mid);
      data.append("colorStatus", a);
      this.$confirm("此操作将修改此会员单位的状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/vc/cwc", data)
            .then((res) => {
              this.$message({
                type: "success",
                message: "修改成功!",
              });
              this.vip_form_endtime = "";
              this.colorStatus = "";
              this.vip_mid = "";
              this.dialogTableVisible_statuschange = false;
              this.huiyuan_data();
            })
            .catch((res) => {
              this.$message({
                type: "error",
                message: "修改失败",
              });
            });
        })
        .catch((res) => {
          this.$message({
            type: "info",
            message: "已取消",
          });
          this.vip_form_endtime = "";
          this.colorStatus = "";
          this.vip_mid = "";
          this.dialogTableVisible_statuschange = false;
        });
    },
    //会员状态取消
    vip_colorStatus_info() {
      this.vip_form_endtime = "";
      this.colorStatus = "";
      this.vip_mid = "";
      this.dialogTableVisible_statuschange = false;
    },
    //会员状态改变
    huiyuan_statuschange(type) {
      this.dialogTableVisible_statuschange = true;
      this.vip_form_endtime = type.endtime;
      this.colorStatus = type.colorStatus;
      this.vip_mid = type.mid;
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
    sortChange(column, prop, order) {
      //console.log(column + "-" + column.prop + "-" + column.order);
      let data = new FormData();
      if (column.order == "descending") data.append("ets", 0);
      if (column.order == "ascending") data.append("ets", 1);
      this.$http.post("/vc/gau", data).then((res) => {
        this.tableData_hy = res.data;
        //console.log(res);
      });
    },
    sortChange3(column, prop, order) {
      console.log(column + "-" + column.prop + "-" + column.order);
      let data = new FormData();
      if (column.order == "descending") data.append("ets", 0);
      if (column.order == "ascending") data.append("ets", 1);
      data.append("status", 0);
      if (this.jf_name == "") {
        this.$http({
          method: "post",
          url: "/vc/glv",
          data: data,
        }).then((res) => {
          //console.log(res);
          this.tableData_hf = res.data;
        });
      } else {
        data.append("vname", this.hf_name);
        this.$http.post("/vc/gpr", data).then((res) => {
          this.tableData_hf = res.data;
        });
      }
    },
    sortChange2(column, prop, order) {
      console.log(column + "-" + column.prop + "-" + column.order);
      let data = new FormData();
      if (column.order == "descending") data.append("ets", 0);
      if (column.order == "ascending") data.append("ets", 1);
      data.append("status", 1);
      if (this.jf_name == "") {
        this.$http({
          method: "post",
          url: "/vc/glv",
          data: data,
        }).then((res) => {
          //console.log(res);
          this.tableData_jf = res.data;
        });
      } else {
        data.append("vname", this.jf_name);
        this.$http.post("/vc/gpr", data).then((res) => {
          this.tableData_jf = res.data;
        });
      }
    },
    project_filters(type) {
      let data = new FormData();
      data.append("m", this.jf_name);
      data.append("p", this.content1_user);
      data.append("ps", this.content1_jf);
      data.append("status", 1);
      this.$http.post("/vc/glv", data).then((res) => {
        this.tableData_jf = res.data;
      });
    },
    jiaofei_filters(type) {
      if (type == 0) {
        let data = new FormData();
        data.append("p", this.content1_hf);
        data.append("m", this.content3_v);
        data.append("status", 0);
        this.$http.post("/vc/glv", data).then((res) => {
          this.tableData_hf = res.data;
        });
      } else if (type == 1) {
        let data = new FormData();
        data.append("m", this.jf_name);
        data.append("p", this.content1_user);
        data.append("ps", this.content1_jf);
        data.append("status", 1);
        this.$http.post("/vc/glv", data).then((res) => {
          this.tableData_jf = res.data;
        });
      }
    },
    filterTag(value, row) {
      return row.paystatus === value;
    },
    filterproject(value, row) {
      return row.mtype === value;
    },
    search_huiyuan() {
      let data = new FormData();
      data.append("mname", this.content4_v);
      // data.append('l',this.content1_v)
      this.$http.post("/vc/gau", data).then((res) => {
        this.tableData_hy = res.data;
        //console.log(res);
      });
    },
    project_s(value) {
      let message = "";
      if (
        this.project_option != "" &&
        this.project_option != null &&
        this.project_option != {}
      ) {
        this.project_option.forEach((item) => {
          // //console.log(item);
          if (Number(value) == Number(item.sid)) message = item.jiaqileixing;
        });
      }

      return message;
    },
    danwei_f(value) {
      if (value == 1) return "远洋渔业企业";
      if (value == 0) return "相关行业单位";
    },
    danwei_s() {
      if (this.jf_status == 2) return true;
    },
    jf_delete(type) {
      let data = new FormData();
      data.append("id", type);
      this.$confirm("确认删除信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.$http.post("/vc/d", data).then((res) => {
          this.jf_fresh();
        });
      });
    },
    jiaofei_shenqing() {
      // let data = new FormData();
      // this.$http.post("/vc/iem", data).then(res => {
      //   console.log(res.data);
      // });
      this.chaxun_danwei();
      this.xiangqing_project = false;
      this.jf_status = 1;
      // this.clear_f(this.jiaofei_form)
      this.jf_title = "缴费记录添加";
      this.dialogTableVisible_2 = true;
    },
    //会员参与项目配置修改
    xiugai_peizhi(c, num) {
      this.$nextTick(() => {
        this.project_data = JSON.parse(JSON.stringify(num));
      });
      // this.xiugai_get(num)
      this.project_status = 2;
      this.project_title = "项目配置修改";
      this.dialogTableVisible_paizhi = true;
    },
    //会员参与项目配置删除
    handleEdit_peizhi(num) {
      let data = new FormData();
      data.append("rid", num.sid);
      this.$confirm("确认删除该信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.$http.post("/vc/dp", data).then((res) => {
          if (res.data == -1) {
            this.$alert("此项目有企业正在参与", "提示", {
              confirmButtonText: "确定",
            });
          } else {
            this.project_name();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
        });
      });
    },
    project_shenqing() {
      (this.project_title = "项目配置添加"), (this.file_name = "");
      this.dialogTableVisible_paizhi = true;
      this.project_status = 1;
    },
    daoru() {},
    daochu() {
      let a = this.multipleSelection;
      let rids = [];
      for (let key in a) {
        rids.push(a[key].mid);
      }
      // if (rids == "") {
      //   alert("请选择数据导出");
      //   return false;
      // }
      let data = new FormData();
      data.append("ids", rids);
      if (rids == "") {
        this.$confirm("确认导出数据", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
        }).then(() => {
          this.$http({
            method: "post",
            url: "/vc/ev",
            responseType: "blob",
            data: data,
          }).then((res) => {
            //console.log(res);
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
              //console.log(fileName, "fileName");
            }
            this.download(res, fileName);
          });
        });
      } else {
        this.$http({
          method: "post",
          url: "/vc/ev",
          responseType: "blob",
          data: data,
        }).then((res) => {
          //console.log(res);
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
            //console.log(fileName, "fileName");
          }
          this.download(res, fileName);
        });
      }
    },
    download(data, fileName) {
      fileName = decodeURIComponent(fileName);
      //console.log(data);
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
    clickRow(row) {
      this.$refs.tableData_hy.toggleRowSelection(row);
      return { "background-color": "rgba(185, 221, 249, 0.75)" };
      return false;
    },
    clickRow_jf(row) {
      this.$refs.tableData_jf.toggleRowSelection(row);
      return { "background-color": "rgba(185, 221, 249, 0.75)" };
      return false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    huiyuan_handleDelete(type) {
      var data = new FormData();
      data.append("id", type);
      this.$confirm("确认删除信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.$http({
          method: "post",
          url: "/vc/d",
          data: data,
        }).then((res) => {
          this.huiyuan_data();
        });
      });
    },
    huiyuan_get(type, nu, a) {
      var data = new FormData();
      data.append("mid", type);
      this.$http({
        method: "post",
        url: "/vc/gu",
        data: data,
      }).then((res) => {
        console.log(res.data, "dasdasdas");
        console.log(JSON.stringify(res.data));
        // console.log(res.data.invProject.split(",")[0]);
        // console.log(res.data.invProject.length);
        // debugger
        var invProject = [];
        this.vip_form = res.data;
        console.log(this.vip_form, "asdasdasdasdasd");
        if (
          res.data.invProject != null &&
          res.data.invProject != undefined &&
          res.data.invProject != "" &&
          res.data.invProject.length != 0
        ) {
          console.log(
            res.data.invProject,
            typeof res.data.invProject,
            "参与项目"
          );
          res.data.invProject = res.data.invProject.split(",");
          for (var k = 0; k < res.data.invProject.length; k++) {
            //将每一项转为Number类型以后 增加到定义数组中
            // alert(2)
            console.log(res.data.invProject[k], "参与项目的每一项");
            // k++
            invProject.push(parseInt(res.data.invProject[k]));
          }
          res.data.invProject = invProject;
        }
        if (res.data.intime != null)
          this.vip_form.intime = new Date(res.data.intime);
        if (res.data.endtime != null)
          this.vip_form.endtime = new Date(res.data.endtime);
        if (
          res.data.outTime == null ||
          res.data.outTime == "" ||
          res.data.outTime < 0
        ) {
          this.show_outTime = false;
        } else {
          this.show_outTime = true;
        }
        console.log(this.show_outTime, "dddddddddd");
        //console.log(this.vip_form.endtime);
        // if (res.data.xhduty != null)
        //   this.vip_form.xhduty = Number(res.data.xhduty);
        console.log(this.vip_form.invProject, "vip");
      });
      this.huiyuan_getwenjian(nu);
      console.log(a, "简介");
      this.huiyuan_getjianjie(a);
    },
    huiyuan_getwenjian(nu) {
      var data = new FormData();
      console.log(nu, "文件fid");
      data.append("fid", nu);

      this.$http.post("/ac/gbf", data).then((res) => {
        this.fileList_1 = [];
        this.$refs.newUpload.fileListId = "";
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
            this.fileList_1.push({
              uid: res.data[i].fid,
              raw: {
                fid: res.data[i].fid,
              },
              name: res.data[i].fname,
              url: "http://fas.intertion.cn:9111/group1/" + res.data[i].fpath,
            });
          } else if (res.data[i].fname.indexOf("txt") != -1) {
            this.fileList_1.push({
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
            this.fileList_1.push({
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
            this.fileList_1.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../../assets/image/ex.jpg"),
            });
          } else if (res.data[i].fname.indexOf("pdf") != -1) {
            this.fileList_1.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../../assets/image/pdf.jpg"),
            });
          } else {
            this.fileList_1.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../../assets/image/file.jpg"),
            });
          }
        console.log(this.fileList_1);
        this.$refs.newUpload.fileList = this.fileList_1;
        console.log(this.$refs.newUpload.fileListId);
        console.log(res.data, "图片数组1");
      });
    },
    huiyuan_getjianjie(nu) {
      var data = new FormData();
      console.log(nu, "简介fid");
      data.append("fid", nu);
      this.$http.post("/ac/gbf", data).then((res) => {
        this.fileList_2 = [];
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
            this.fileList_2.push({
              uid: res.data[i].fid,
              raw: {
                fid: res.data[i].fid,
              },
              name: res.data[i].fname,
              url: "http://fas.intertion.cn:9111/group1/" + res.data[i].fpath,
            });
          } else if (res.data[i].fname.indexOf("txt") != -1) {
            this.fileList_2.push({
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
            this.fileList_2.push({
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
            this.fileList_2.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../../assets/image/ex.jpg"),
            });
          } else if (res.data[i].fname.indexOf("pdf") != -1) {
            this.fileList_2.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../../assets/image/pdf.jpg"),
            });
          } else {
            this.fileList_2.push({
              uid: res.data[i].fid,
              name: res.data[i].fname,
              raw: {
                fid: res.data[i].fid,
              },
              url: require("../../assets/image/file.jpg"),
            });
          }
        console.log(this.fileList_2);
        this.$refs.newUpload1.fileList = this.fileList_2;
        console.log(res.data, "图片数组");
      });
    },
    handleReload() {
      this.reload(); // 在想要刷新页面的时候调用reload方法
    },
    jf_handleEdit(h, name, scope, num) {
      //console.log(name, "name---------");
      // this.jf_name=name
      if (num == 0) {
        this.xiangqing_project = true;
      } else if (num == 1) {
        this.xiangqing_project = false;
      }
      this.jf_status = 2;
      this.jf_title = "缴费记录修改";
      //console.log(scope, "行内元素");
      // let data = new FormData();
      // data.append("vname", name);
      // this.$http.post("/vc/gpr", data).then(res => {
      //   this.jiaofei_form = res.data[0];
      //   this.jiaofei_form.mtype = Number(res.data[0].mtype);
      // });
      this.jiaofei_form = JSON.parse(JSON.stringify(scope));
      // this.jiaofei_form.mtype = Number(scope.mtype);
      this.dialogTableVisible_2 = true;
    },
    //下载表
    downform() {
      // let t=sessionStorage.getItem("token")
      var data = new FormData();
      data.append("fid", this.fid);
      this.$http({
        url: "/fmc/dpf",
        method: "post",
        data: data,
        responseType: "blob",
      }).then((res) => {
        //console.log(res.headers["Content-Disposition"], "res---------");
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
          //console.log(fileName, "fileName");
        }
        this.download(res, fileName);
      });
      // .catch(error => {});
    },
    //下载
    download(data, fileName) {
      fileName = decodeURIComponent(fileName);
      //console.log(fileName);
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
    },
    huiyuan_handleSacn(h, type, num, nu, e) {
      this.scan_status = num;
      console.log(this.scan_status, "name---------", h, type, num, nu, e);
      //huiyuan_handleSacn(scope.row.mname,scope.row.mid,2)
      //修改情况
      if (num == 2) {
        // alert("修改")

        this.Upload_showdisable = true;
        this.huiyuandanwei_mid = type;
        this.change_name = true;
        this.huiyuan_get(type, nu, e);
        this.title_scan = "会员修改";
        this.dialogTableVisible_1 = true;
        // this.huiyuan_handleEdit();
        this.huiyuan_status = true;
        this.vip_form.mid = type;
        this.vip_form_show = false;
        //缴费记录情况
      } else if (num == 1) {
        //获取指定信息数据
        // let a = JSON.parse(JSON.stringify(this.tableData_hy));
        // for (var item of a) {
        //   //console.log(item, "2222");
        //   if (type == item.mid) {
        //直接赋值时候 导向存在问题
        this.vip_form_show = false;
        this.jiaofei_form.mname = h;
        this.jiaofei_form.taxno = e.row.taxno;
        this.jiaofei_form.bankcard = e.row.bankcard;
        this.jiaofei_form.ofbank = e.row.ofbank;
        // this.project_option = [e.row.invProject];
        //缴费单位名称中间值
        this.jf_name = h;
        //   }
        // }
        //console.log(this.jiaofei_form, "获取的缴费信息");

        // this.jiaofei_form=this.tableData_hy[Object.keys(this.tableData_hy)[nu]]
        this.handleSelect(32);
        //获取指定会员缴费信息
        let data = new FormData();
        data.append("vname", h);
        data.append("project", e.row.invProject);
        this.$http.post("/vc/gpr", data).then((res) => {
          this.tableData_jf = res.data;
        });
      } else if (num == 3) {
        //详细信息
        this.Upload_showdisable = false;
        this.huiyuan_get(type, nu, e);
        this.title_scan = "会员详细信息";
        this.dialogTableVisible_1 = true;
        this.huiyuan_status = true;
        this.vip_form.mid = type;
        this.vip_form_show = true;
      }
    },
    huiyuan_handleEdit() {
      this.dialogTableVisible_1 = true;
      this.huiyuan_status = true;
    },
    //项目名称配置列表
    project_name() {
      let data = new FormData();
      this.$http.post("/vc/pl", data).then((res) => {
        if (res.data != -1002 && res.data != null && res.data != "")
          this.tableData_jfpz = res.data;
        if (res.data != -1002 && res.data != null && res.data != "") {
          this.project_option = res.data;
          this.project_option.forEach((item) => {
            let f = {};
            f.text = item.jiaqileixing;
            f.value = item.sid;
            this.project_select.push(f);
          });

          var arr = this.project_select;
          var result = [];
          var obj2 = {};
          for (var i = 0; i < arr.length; i++) {
            if (!obj2[arr[i].value]) {
              result.push(arr[i]);
              obj2[arr[i].value] = true;
            }
          }
          this.project_select = result;
          // this.vip_form.depll = result;
          //console.log(result,"打印数据")
        }

        //console.log(res);
      });
    },

    //会员信息表格加载
    huiyuan_data() {
      let data = new FormData();
      data.append("ets", 1);
      this.$http({
        method: "post",
        url: "/vc/gau",
        data: data,
      }).then((res) => {
        //console.log(res.data);
        this.tableData_hy = res.data;
      });
      // b = [];
      // b = JSON.parse(sessionStorage.getItem("roletype"));
      // console.log(b);
      let b = sessionStorage.getItem("roletype");
      console.log(b, "asdasdasdasdads");

      let c = b.indexOf("3"); //是超管或者会员管理员显示 导入
      let d = b.indexOf("28");

      if (c != -1 || d != -1) {
        this.showdaoru = false;
      } else {
        this.showdaoru = true;
      }
      console.log(this.showdaoru);
    },
    jiaofei_data() {
      var data = new FormData();
      data.append("status", 1);
      this.$http({
        method: "post",
        url: "/vc/glv",
        data: data,
      }).then((res) => {
        //console.log(res);
        this.tableData_jf = res.data;
      });
    },
    jiaofei_huifei() {
      let data = new FormData();
      data.append("status", 0);
      this.$http.post("/vc/glv", data).then((res) => {
        this.tableData_hf = res.data;
      });
    },
    guanbi_huiyuan(done) {
      this.huiyuan_return();
    },
    guanbi_jiaofei(done) {
      this.jiaofei_return();
    },
    huiyuan_queren_chakan() {
      this.$refs.vip_form.resetFields();
      this.reload();
    },
    huiyuan_queren(formName) {
      //console.log(typeof this.vip_form.intime);
      //修改提交
      if (this.scan_status == 2) {
        //console.log(this.vip_form);
        let data = new FormData();
        for (let key in this.vip_form) {
          if (this.vip_form[key] != "" && this.vip_form[key] != null)
            data.append(key, this.vip_form[key]);
        }
        //文件id的添加
        this.fileListId = "";
        for (let i of this.$refs.newUpload.fileList) {
          this.fileListId += Number(i.raw.fid) + ",";
        }
        this.fileListId1 = "";
        for (let i of this.$refs.newUpload1.fileList) {
          this.fileListId1 += Number(i.raw.fid) + ",";
        }
        console.log(this.fileListId, this.fileListId1, "asdasdasdasd");
        data.delete("createTime");
        data.set("paytime", new Date(this.vip_form.paytime));
        data.set("fid", this.fileListId);
        data.set("comProfile", this.fileListId1);
        data.set("unitNature", this.vip_form.unitNature);
        if (this.fid != "" && this.fid != null) data.append("annex", this.fid);
        data.append("dtype", 0);
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm("确认信息填写无误", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "info",
            }).then(() => {
              this.$http({
                method: "post",
                url: "/vc/up",
                data: data,
              }).then((res) => {
                this.$message({
                  message: "提交成功",
                  type: "success",
                });
                this.$refs.vip_form.resetFields();
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
        this.fileListId = "";
        for (let i of this.$refs.newUpload.fileList) {
          this.fileListId += Number(i.raw.fid) + ",";
        }
        this.fileListId1 = "";
        for (let i of this.$refs.newUpload1.fileList) {
          this.fileListId1 += Number(i.raw.fid) + ",";
        }
        console.log(this.fileListId, this.fileListId1, "asdasdasdasd");
        //添加提交
        let data = new FormData();
        data.append("dtype", 0);
        data.append("fid", this.fileListId);
        data.append("comProfile", this.fileListId1);
        data.set("unitNature", this.vip_form.unitNature);
        console.log(data, "data");
        for (let key in this.vip_form) {
          if (this.vip_form[key] != "" && this.vip_form[key] != null)
            data.append(key, this.vip_form[key]);
        }
        if (this.fid != "" && this.fid != null) data.append("annex", this.fid);
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm("确认信息填写无误", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "info",
            }).then(() => {
              this.$http.post("/vc/a", data).then((res) => {
                console.log(res);
                if (res.data == true) {
                  this.$refs.vip_form.resetFields();
                  this.$message({
                    message: "修改成功",
                    type: "success",
                  });
                  this.reload();
                } else if (res.data == -1) {
                  this.$alert("此项目已存在,请重新选择项目名称", "提示", {
                    confirmButtonText: "确定",
                  });
                }
              });
            });
          } else {
            this.$alert("信息填写不规范或不完整", "提示", {
              confirmButtonText: "确定",
            });
          }
        });
      }
    },
    jf_fresh() {
      let data = new FormData();
      data.append("vname", this.jf_name);
      //console.log(this.jf_name, "本公司缴费状态");
      //查询具体公司
      if (this.jf_name == "") {
        this.jiaofei_data();
      } else {
        this.$http.post("/vc/gpr", data).then((res) => {
          this.tableData_jf = res.data;
          this.jiaofei_form.mname = res.data[0].mname;
        });
      }
    },
    jiaofei_queren(formName) {
      var data = new FormData();
      for (let key in this.jiaofei_form) {
        if (this.jiaofei_form[key] != "" && this.jiaofei_form[key] != null) {
          data.append(key, this.jiaofei_form[key]);
        }
      }
      data.append("status", 1);
      data.append("dtype", 1);
      console.log(this.jf_status, "shuzi");
      this.$refs.jiaofei_form.validate((valid) => {
        if (valid) {
          this.$confirm("确认信息填写无误", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info",
          }).then(() => {
            //提交操作
            if (this.jf_status == 1) {
              data.delete("mid");
              this.$http({
                method: "post",
                url: "/vc/a",
                data: data,
              }).then((res) => {
                this.dialogTableVisible_2 = false;
                this.clear_f(this.jiaofei_form);
                this.jf_fresh();
                this.huiyuan_data();
                this.$message({
                  message: "添加成功",
                  type: "success",
                });
              });
            } else if (this.jf_status == 2) {
              if (this.jiaofei_form.intime != null)
                data.set("intime", new Date(this.jiaofei_form.intime));
              if (this.jiaofei_form.endtime != null)
                data.set("endtime", new Date(this.jiaofei_form.endtime));
              if (this.jiaofei_form.paytime != null)
                data.set("paytime", new Date(this.jiaofei_form.paytime));
              if (this.jiaofei_form.createTime != null)
                data.set("createTime", new Date(this.jiaofei_form.createTime));
              //修改操作
              this.$http({
                method: "post",
                url: "/vc/up",
                data: data,
              }).then((res) => {
                this.dialogTableVisible_2 = false;
                this.clear_f(this.jiaofei_form);
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.huiyuan_data();
                this.jf_fresh();
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
    project_return(formName) {
      this.$refs[formName].resetFields();
      this.clear_f(this.project_data);
      // for(var item  in this.project_data){
      //   this.project_data[item]=""
      // }
      this.file_name = "";
      this.dialogTableVisible_paizhi = false;
    },
    //项目配置确认
    project_quren(formName) {
      let data = new FormData();
      for (let key in this.project_data) {
        if (this.project_data[key] != "" && this.project_data[key] != null) {
          data.append(key, this.project_data[key]);
        }
      }
      //添加项目配置
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.project_status == 1) {
            this.$http({
              method: "post",
              url: "/vc/ap",
              data: data,
            }).then((res) => {
              this.dialogTableVisible_paizhi = false;
              this.$refs.project_data.resetFields();
              this.project_name();
              //console.log(res);
            });
            // 修改项目配置
          } else if (this.project_status == 2) {
            this.$http({
              method: "post",
              url: "/vc/upn",
              data: data,
            }).then((res) => {
              this.dialogTableVisible_paizhi = false;
              this.$refs.project_data.resetFields();
              this.project_name();
              //console.log(res);
            });
          }
        } else {
          // alert("信息填写不规范或不完整");
          this.$alert("信息填写不规范或不完整", "提示", {
            confirmButtonText: "确定",
          });
          return false;
        }
      });
    },
    //导入功能
    //附件上传
    upload_fu(e) {
      //获取选定的文件
      let tFiles = e.target.files;
      let len = tFiles.length;
      //console.log(tFiles, "文件类型");
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
        //开始上传文件 新建一个formData
        let param = new FormData();
        //传值token
        // param.append("t", sessionStorage.getItem("Token"));
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
          url: "/vc/iv",
          method: "post",
          data: param,
          config,
        }).then((res) => {
          alert("导入成功");
          this.reload();
          // for(var key in res.data ){
          //   this.fid=res.data[key].fid
          // }
          //console.log(this.fid);
          //特殊需求部分 页面状态
          this.isActive = false;
        });
      }
    },
    //附件上传
    upload(e) {
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
        //传值token
        // param.append("t", sessionStorage.getItem("Token"));
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
          for (var key in res.data) {
            this.fid = res.data[key].fid;
          }
          //console.log(this.fid);
          //特殊需求部分 页面状态
          this.isActive = false;
        });
      }
    },
    huiyuan_return() {
      // this.clear_f(this.$refs.vip_form);
      this.$refs.vip_form.resetFields();
      this.$refs.newUpload.fileList = [];
      this.$refs.newUpload1.fileList = [];
      this.vip_form.invProject = null;
      this.vip_form.mid = null;
      console.log(this.vip_form, "表格内容");
      this.isActive = true;
      this.file_name = "";
      (this.dialogTableVisible_1 = false), (this.huiyuan_status = false);
    },
    jiaofei_return() {
      this.clear_f(this.jiaofei_form);
      //  this.$refs.newUpload.fileList = [];
      this.$refs.jiaofei_form.resetFields();
      this.jiaofei_form.mname = this.jf_name;
      this.isActive = true;
      this.file_name = "";

      this.dialogTableVisible_2 = false;
      // this.reload()
    },
    //project项目确认返回

    huiyuan_shenqing() {
      this.Upload_showdisable = true;
      this.huiyuandanwei_mid = "";
      this.change_name = false;
      this.title_scan = "会员添加";
      this.vip_form.mid = "";
      this.dialogTableVisible_1 = true;
      this.huiyuan_status = true;
    },
    //缴费细节弹窗
    openDetails_2(row) {
      this.dialogTableVisible_2 = true;

      return false;
    },
    //会员单位细节弹窗
    openDetails(row) {
      this.dialogTableVisible_1 = true;
      return false;
    },
    handleSelect(key, keyPath) {
      //console.log(key, keyPath);
      this.activeIndex = key;
      //console.log(this.activeIndex, "activeIndex");
      //console.log(key == this.activeIndex);
    },
    handleEdit(index, row) {
      //console.log(index, row);
    },
  },
  created() {
    this.duty_option = JSON.parse(sessionStorage.getItem("duty_name"));
    //console.log(typeof this.duty_option, "获取的数组");
  },
  filters: {
    zhiwei: function (value) {
      let duty_name = JSON.parse(sessionStorage.getItem("duty_name"));
      if (value == null || value == "") return "暂无";
      // //console.log(value,"传入数值");
      if (value != "" && value != null) {
        for (var item of duty_name) {
          if (item.did == value) {
            // //console.log(item.did,"true----------++++++++++++");
            return item.dname;
          }
        }
      }
    },
  },
  mounted() {
    // alert(t)
    let a = JSON.parse(sessionStorage.getItem("a"));
    for (let item of a) {
      if (item == "31") this.menu.push({ name: "会员单位", id: "31" });
      if (item == "32") this.menu.push({ name: "缴费记录", id: "32" });
      if (item == "33") this.menu.push({ name: "项目配置", id: "33" });
      if (item == "34") this.menu.push({ name: "会员申请", id: "34" });
    }
    //console.log(this.menu, "menu");
    this.huiyuan_data();
    this.jiaofei_data();
    this.project_name();
    this.jiaofei_huifei();
    this.vip_shenqingdata();
    let float = sessionStorage.getItem("float");
    this.float = JSON.parse(float);
    this.activeIndex = this.float.menu_index;
    // //console.log(this.float,'this.float');
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.formVipAdd {
  min-width: 700px;
}
.formVipAdd /deep/ .el-form-item {
  width: 49%;
  display: inline-block;
  justify-content: start;
  margin-top: 10px;
}
.vip_spcss /deep/ .el-form-item__error {
  margin-left: 37px;
}
.vip_xq {
  box-shadow: 0px 3px 15px 0px #e2ecf6;
  border-bottom: 1px solid #e2ecf6;
}
.vip_xq >>> .el-dialog {
  min-width: 750px;
}
.vip_xq >>> .el-dialog__body {
  padding: 30px 38px 30px 20px;
}
.vip_xq span {
  display: inline-block;
  text-align: left;
  width: 100%;
  border: 1px solid #dcdfe6;
  padding: 0 15px;
  line-height: 40px;
  height: 40px;
  box-sizing: border-box;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
body .el-table::before {
  z-index: inherit;
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
.el-table {
  color: #070707;
  height: 64vh;
  min-width: 1000px;
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
.Member {
  background-color: #f5f5f5;
}
.menu,
.content {
  background: #fff;
}
.menu {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}
.huiyuan_button {
  /* padding-top: 5px; */
  width: 97px;
  height: 36px;
}
.table_top {
  display: flex;
  /* justify-content: space-between; */
  justify-content: left;
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
.file {
  width: 100px;
  text-align: center;
  position: relative;
  display: inline-block;
  background: #66b1ff;
  border: 1px solid #99d3f5;
  border-radius: 4px;
  padding: 6px 12px;
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
  padding: 6px 12px;
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
.upload_button {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.colorStatus_black {
  color: black;
}
.colorStatus_yellow {
  color: rgba(193, 174, 68, 1);
}
.colorStatus_red {
  color: #f56c6c;
}
</style>
<style >
.el-table__body tr.current-row > td {
  background-color: #c3e0ff !important;
  /* color: #f19944; */ /* 设置文字颜色，可以选择不设置 */
}
</style>
