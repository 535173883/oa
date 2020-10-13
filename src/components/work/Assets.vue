<template>
  <!-- 固定资产 -->
  <div class="Assets">
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
          <el-menu-item v-for="(item,index) of menu" :key="index" :index="item.id">
            <span>{{item.name}}</span>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
    <!-- 固定资产 -->
    <div class="content" v-show="activeIndex=='22'">
      <div class="table_top">
        <span>
          <span>资产名称 ：</span>
          <input type="text" placeholder="搜索资产名称" v-model="content1_v" style="width:150px" />
        </span>
        <span>
          <span>资产类型：</span>
          <el-select
            v-model="zichanatype"
            placeholder="请选择"
            style="width:150px;"
            @change="user_filters()"
            clearable
          >
            <el-option
              v-for="item in options_1"
              :key="item.sid"
              :label="item.jiaqileixing"
              :value="item.jiaqileixing"
              value-format="timestamp"
            ></el-option>
          </el-select>
        </span>
        <span style="margin-left:20px">
          <span style="line-height: 31px;">状态 ：</span>
          <el-select
            v-model="content1_user"
            @change="user_filters(content1_user)"
            placeholder="使用情况"
            style="width:120px;margin-right:20px;"
            clearable
          >
            <el-option label="待分配" value="1"></el-option>
            <el-option label="在用" value="2"></el-option>
            <el-option label="已折旧" value="4"></el-option>
          </el-select>
        </span>
        <!-- <span style="margin-left:20px">
            <span style="line-height: 31px;">使用人员/部门 ：</span>
            <el-input style="width:120px;margin-right:20px;" v-model="search_peiple" clearable></el-input>
            <el-button
              style="margin-left:20px;margin-right:20px"
              icon="el-icon-search"
              type="primary"
              @click="search_guding_people"
            ></el-button>
        </span>-->

        <el-button
          type="primary"
          @click="guding_shenqing()"
          style="width: 97px;height: 36px;"
          v-has="221"
        >添加</el-button>
        <el-button
          type="primary"
          @click="guding_daochu()"
          style="width: 97px;height: 36px;"
          v-has="222"
        >导出</el-button>
      </div>
      <el-table
        :data="tableData_gd.filter(data => !content1_v || data.aname.toLowerCase().includes(content1_v.toLowerCase())).slice((this.currentPage1-1)*this.pageSize,this.currentPage1*this.pageSize)"
        style="width: 95.8%;margin:0 2.1%;height:500px;overflow:auto"
        align="center"
        height="430"
        :model="tableData_gd"
        ref="tableData_gd"
        border
        row-key="aid"
        @selection-change="handleSelectionChange"
        @row-click="clickRow_guding"
        highlight-current-row
        header-cell-class-name="t_h"
      >
        <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
        <el-table-column label="资产名称" align="center" prop="aname">
          <template slot-scope="scope">
            <span
              :class="scope.row.wordColor == 1 ? 'colorStatus_red' : 'colorStatus_black'"
            >{{ scope.row.aname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资产编号" prop="ano" align="center">
          <template slot-scope="scope">
            <span
              :class="scope.row.wordColor == 1 ? 'colorStatus_red' : 'colorStatus_black'"
            >{{ scope.row.ano }}</span>
          </template>
        </el-table-column>

        <el-table-column label="型号/规格" prop="amodel" align="center" width="120">
          <template slot-scope="scope">
            <span
              :class="scope.row.wordColor == 1 ? 'colorStatus_red' : 'colorStatus_black'"
            >{{ scope.row.amodel }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="产品序列号" prop="anorms" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span
              :class="scope.row.wordColor == 1 ? 'colorStatus_red' : 'colorStatus_black'"
              style="text-decoration:underline;cursor:pointer"
            >{{ scope.row.anorms }}</span>
          </template>
        </el-table-column>-->
        <el-table-column label="资产类型" prop="atype" align="center">
          <template slot-scope="scope">
            <span
              :class="scope.row.wordColor == 1 ? 'colorStatus_red' : 'colorStatus_black'"
            >{{ scope.row.atype }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="购入时间" prop="intime" align="center" width="125">
          <template slot-scope="scope">
            <span
              :class="scope.row.wordColor == 1 ? 'colorStatus_red' : 'colorStatus_black'"
            >{{ scope.row.intime | time_t }}</span>
          </template>
        </el-table-column>-->
        <el-table-column label="价格(元)" prop="price" align="center">
          <template slot-scope="scope">
            <span
              :class="scope.row.wordColor == 1 ? 'colorStatus_red' : 'colorStatus_black'"
            >{{ scope.row.price }}</span>
          </template>
        </el-table-column>

        <el-table-column label="领用时间" prop="usetime" align="center">
          <template slot-scope="scope">
            <span
              :class="scope.row.wordColor == 1 ? 'colorStatus_red' : 'colorStatus_black'"
            >{{ scope.row.usetime | time_t }}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用人员" prop="uname" align="center">
          <template slot-scope="scope">
            <span
              :class="scope.row.wordColor == 1 ? 'colorStatus_red' : 'colorStatus_black'"
            >{{ scope.row.uname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用部门" prop="useDep" align="center">
          <template slot-scope="scope">
            <span
              :class="scope.row.wordColor == 1 ? 'colorStatus_red' : 'colorStatus_black'"
            >{{ scope.row.useDep }}</span>
          </template>
        </el-table-column>
        <el-table-column label="折旧时间" prop="zjTime" align="center">
          <template slot-scope="scope">
            <span
              :class="scope.row.wordColor == 1 ? 'colorStatus_red' : 'colorStatus_black'"
            >{{ scope.row.zjTime | time_t }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="canuse" align="center">
          <template slot-scope="scope">
            <span
              :class="scope.row.wordColor == 1 ? 'colorStatus_red' : 'colorStatus_black'"
            >{{ use_s(scope.row.canuse) }}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column label="凭证" prop="proof" align="center">
          <template slot-scope="scope">
            <span
              :class="scope.row.wordColor == 1 ? 'colorStatus_red' : 'colorStatus_black'"
            >{{ scope.row.proof }}</span>
          </template>
        </el-table-column>

        <el-table-column label="备注" prop="remark" align="center">
          <template slot-scope="scope">
            <span
              :class="scope.row.wordColor == 1 ? 'colorStatus_red' : 'colorStatus_black'"
            >{{ scope.row.remark }}</span>
          </template>
        </el-table-column>-->

        <el-table-column label="操作" align="center" width="280">
          <template slot-scope="scope">
            <div class="operation">
              <span
                style="color:#3399FF"
                @click="guding_handleScan(scope.$index, scope.row.aid,scope.row,1)"
              >详情</span>
              <span
                style="color:#3399FF"
                v-if="scope.row.canuse==3?false:true"
                @click="guding_handleScan(scope.$index, scope.row.aid,scope.row,0)"
                v-has="213"
              >修改</span>
              <span
                style="color:#3399FF"
                v-if="scope.row.canuse == 1"
                @click="user_f(scope.row.aid,scope.row)"
              >分配</span>
              <span style="color:#3399FF" @click="user_jilu(scope.row.aid)" v-has="225">使用记录</span>
              <span
                style="color:#3399FF"
                v-if="scope.row.wordColor == 1 && scope.row.canuse != 4  && scope.row.canuse != 3"
                @click="guding_handleinto_1(scope.row.aid)"
              >折旧</span>
              <!-- <span style="color:#3399FF"
              @click="handleEdit(scope.$index, scope.row)">申请</span>-->

              <el-button
                type="text"
                @click="user_return(scope.row.wid,scope.row.uname,scope.row.aid)"
                v-show="scope.row.canuse==2 || scope.row.uname != ''&&scope.row.uname != null ||scope.row.useDep != '' && scope.row.useDep != null"
                v-has="223"
              >归还</el-button>
              <!-- <span
                style="color:#FF5454"
                @click="guding_handleinto_2(scope.row)"
                v-if="scope.row.isCwb == 1"
              >状态</span>-->
              <!-- <span
                style="color:#3399FF"
                v-if="scope.row.hisPrice &&  scope.row.isCwb == 1"
                @click="guding_handleinto_2(scope.$index, scope.row.hisPrice,scope.row.price)"
                v-has="213"
              >残值录入记录</span>-->
              <span
                style="color:#FF5454"
                v-if="scope.row.canuse == 4"
                @click="chuzhi_wupin(scope.row.aid)"
                v-has="224"
              >处置</span>
              <span
                style="color:#FF5454"
                @click="guding_delete(scope.row.aid)"
                v-if="scope.row.canuse !==2"
                v-has="214"
              >删除</span>
              <!-- -->
              <!-- :disabled="(scope.row.downtime==null)?false:true "  -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <span class="demonstration">每页10条</span>
        <el-pagination
          :current-page.sync="currentPage1"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="tableData_gd.filter(data => !content1_v || data.aname.toLowerCase().includes(content1_v.toLowerCase())).length"
        ></el-pagination>
      </div>
    </div>
    <!-- 入库登记-->
    <div class="content" v-show="activeIndex=='21'">
      <div class="table_top">
        <span style="line-height: 30px;">资产类型：</span>
        <!-- <input type="text" placeholder="搜索资产类型" v-model="content2_v" style="width:150px" /> -->
        <el-select v-model="content2_v" placeholder="请选择" style="width:150px;" clearable>
          <el-option
            v-for="item in options_1"
            :key="item.sid"
            :label="item.jiaqileixing"
            :value="item.jiaqileixing"
            value-format="timestamp"
          ></el-option>
        </el-select>
        <span style="width:20px"></span>
        <span style="line-height: 30px;">资产名称：</span>
        <el-input
          placeholder="搜索名称"
          style="width:150px;height:30px"
          clearable
          v-model="search_zichan"
        ></el-input>
        <el-button
          style="margin-left:20px;margin-right:20px"
          icon="el-icon-search"
          type="primary"
          @click="search_caigou"
        ></el-button>
        <span style="width:20px"></span>
        <!-- <el-button icon="el-icon-search" type="primary" @click="search_caigou"></el-button> -->
        <el-button type="primary" @click="caigou_shenqing(0)" style="width: 97px;height: 40px;">添加</el-button>
      </div>
      <el-table
        :data="tableData_cg.filter(data => !content2_v || data.cgType.toLowerCase().includes(content2_v.toLowerCase())).slice((this.currentPage2-1)*this.pageSize,this.currentPage2*this.pageSize)"
        style="width: 95.8%;margin:0 2.1%;height:500px;overflow:auto"
        :model="tableData_cg"
        height="430"
        ref="tableData_cg"
        align="center"
        border
        header-cell-class-name="t_h"
      >
        <el-table-column label="采购人" prop="cgBy" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.cgBy }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资产类型" align="center" prop="cgType">
          <template slot-scope="scope">
            <span>{{ scope.row.cgType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资产名称" align="center" prop="name">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="型号/规格" align="center" prop="size">
          <template slot-scope="scope">
            <span>{{ scope.row.size }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="产品序列号" align="center" prop="produce_num" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer">{{ scope.row.produceNum }}</span>
          </template>
        </el-table-column>-->

        <el-table-column label="价格" align="center" prop="price">
          <template slot-scope="scope">
            <span>{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单位" align="center" prop="unit">
          <template slot-scope="scope">
            <span>{{ scope.row.unit}}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="number" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="事由" prop="cause" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer">{{ scope.row.cause }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <span
                style="color:#3399FF"
                @click="pingzhengchaxun(scope.$index, scope.row,1,1,scope.row.fid)"
              >修改</span>
              <span style="color:#FF5454" @click="peizhi_delete(scope.row.id)">删除</span>
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
          :total="tableData_cg.filter(data =>!content2_v || data.cgType.toLowerCase().includes(content2_v.toLowerCase())).length"
        ></el-pagination>
      </div>
    </div>
    <!-- 使用记录 -->
    <div class="content" v-show="activeIndex=='23'">
      <div class="table_top">
        <span style="line-height: 31px;">资产名称：</span>
        <input type="text" placeholder="搜索资产名称" v-model="content3_v" style="width:150px" />
        <span>
          <span style="line-height: 31px;">状态搜索 ：</span>
          <el-select
            v-model="content1_user1"
            @change="status_filters(content1_user1)"
            placeholder="使用状态"
            style="width:120px;margin-left:20px;"
            clearable
          >
            <el-option label="已归还" value="1"></el-option>
            <el-option label="未归还" value="0"></el-option>
          </el-select>
        </span>
        <el-button
          style="width: 97px;height: 36px;margin-left:50px"
          type="danger"
          @click="use_clear()"
          v-has="231"
        >清理记录</el-button>
        <!-- <el-button type="primary" @click="use_shenqing()" style="width: 97px;height: 36px;">添加</el-button> -->
      </div>
      <el-table
        :data="tableData_sy.filter(data => !content3_v || data.reamrk4.toLowerCase().includes(content3_v.toLowerCase())).slice((this.currentPage3-1)*this.pageSize,this.currentPage3*this.pageSize)"
        style="width: 95.8%;margin:0 2.1%;height:500px;overflow:auto"
        align="center"
        height="430"
        border
        :model="tableData_sy"
        ref="tableData_sy"
        row-key="wid"
        @selection-change="handleSelectionChange"
        header-cell-class-name="t_h"
        @row-click="clickRow"
        highlight-current-row
      >
        <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
        <el-table-column label="资产名称" align="center" prop="reamrk4">
          <template slot-scope="scope">
            <span>{{ scope.row.reamrk4 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资产编号" align="center" prop="reamrk5">
          <template slot-scope="scope">
            <span>{{ scope.row.reamrk5 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用人" align="center" prop="aname">
          <template slot-scope="scope">
            <span>{{ scope.row.uname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用部门" align="center" prop="reamrk3">
          <template slot-scope="scope">
            <span>{{ scope.row.reamrk3 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用地点" align="center" prop="ano">
          <template slot-scope="scope">
            <span>{{ scope.row.leaveaddr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="领用时间" align="center" prop="uptime" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer">{{ scope.row.uptime | time_f }}</span>
          </template>
        </el-table-column>
        <el-table-column label="归还时间" align="center" prop="downtime" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer">{{ scope.row.downtime | time_f }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="downtime">
          <template slot-scope="scope">
            <span
              :style="(scope.row.downtime==null)?'color:red':'color:green'"
            >{{use_current(scope.row.downtime)}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <el-button
                type="text"
                @click="user_return(scope.row.wid,scope.row.uname,scope.row.aid)"
                :disabled="(scope.row.downtime==null)?false:true"
              >归还</el-button>
            </div>
          </template>
        </el-table-column>-->
      </el-table>
      <!--分页-->
      <div class="block">
        <span class="demonstration">每页10条</span>
        <el-pagination
          :current-page.sync="currentPage3"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="tableData_sy.filter(data => !content3_v || data.reamrk4.toLowerCase().includes(content3_v.toLowerCase())).length"
        ></el-pagination>
      </div>
    </div>
    <!-- 处置记录 -->
    <div class="content" v-show="activeIndex=='24'">
      <div class="table_top">
        <span style="line-height: 30px;">资产名称：</span>
        <input style="width:150px" type="text" placeholder="搜索资产名称" v-model="content5_v" />
        <span style="line-height: 30px;">资产类型：</span>
        <el-select
          v-model="zichanatype1"
          placeholder="请选择"
          style="width:150px;"
          @change="user_filters1()"
          clearable
        >
          <el-option
            v-for="item in options_1"
            :key="item.sid"
            :label="item.jiaqileixing"
            :value="item.jiaqileixing"
            value-format="timestamp"
          ></el-option>
        </el-select>
        <span style="width:20px"></span>
        <el-button type="primary" v-has="243" @click="qinglijilu_daochu()">导出</el-button>
      </div>
      <el-table
        :data="tableData_ql.filter(data => !content5_v || data.aname.toLowerCase().includes(content5_v.toLowerCase())).slice((this.currentPage5-1)*this.pageSize,this.currentPage5*this.pageSize)"
        style="width: 95.8%;margin:0 2.1%;height:500px;overflow:auto"
        align="center"
        ref="tableData_ql"
        :model="tableData_ql"
        row-key="aid"
        border
        @selection-change="handleSelectionChange"
        header-cell-class-name="t_h"
        height="430"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="资产名称" align="center" prop="aname">
          <template slot-scope="scope">
            <span>{{ scope.row.aname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资产编号" align="center" prop="ano">
          <template slot-scope="scope">
            <span>{{ scope.row.ano}}</span>
          </template>
        </el-table-column>
        <el-table-column label="资产类型" align="center" prop="atype">
          <template slot-scope="scope">
            <span>{{ scope.row.atype }}</span>
          </template>
        </el-table-column>
        <el-table-column label="型号/规格" align="center" prop="amodel">
          <template slot-scope="scope">
            <span>{{ scope.row.amodel }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产品序列号" align="center" prop="anorms" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer">{{ scope.row.anorms }}</span>
          </template>
        </el-table-column>
        <el-table-column label="残值/元" align="center" prop="remainValue">
          <template slot-scope="scope">
            <span>{{ scope.row.remainValue }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="经办人" align="center" prop="uname">
          <template slot-scope="scope">
            <span>{{ scope.row.uname }}</span>
          </template>
        </el-table-column>-->
        <el-table-column label="处置去向" align="center" prop="clearDir">
          <template slot-scope="scope">
            <span>{{ scope.row.clearDir }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处置时间" align="center" prop="clearTime">
          <template slot-scope="scope">
            <span>{{ scope.row.clearTime | time_t}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="处置收入凭证" align="center" prop="proof">
          <template slot-scope="scope">
            <span>{{ scope.row.proof }}</span>
          </template>
        </el-table-column>-->
        <el-table-column label="备注" align="center" prop="clearRemark" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer">{{ scope.row.clearRemark}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <span
                style="color:#3399FF"
                @click="handleEdit(scope.row.aid,scope.row)"
                v-has="241"
              >修改</span>
              <span style="color:#FF5454" @click="qingli_delete(scope.row.aid)" v-has="242">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <span class="demonstration">每页10条</span>
        <el-pagination
          :current-page.sync="currentPage5"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="tableData_ql.filter(data =>!content5_v || data.aname.toLowerCase().includes(content5_v.toLowerCase())).length"
        ></el-pagination>
      </div>
    </div>
    <!-- 资产类型配置 -->
    <div class="content" v-show="activeIndex=='25'">
      <div class="table_top">
        <span style="line-height: 30px;">资产类型：</span>
        <input style="width:150px" type="text" placeholder="搜索资产类别" v-model="content4_v" />
        <el-button type="primary" @click="peizhi_add()">添加</el-button>
      </div>
      <el-table
        :data="tableData_pz.filter(data => !content4_v || data.jiaqileixing.toLowerCase().includes(content4_v.toLowerCase())).slice((this.currentPage4-1)*this.pageSize,this.currentPage4*this.pageSize)"
        style="width: 95.8%;margin:0 2.1%;height:500px;overflow:auto"
        align="center"
        height="430"
        border
        header-cell-class-name="t_h"
      >
        <el-table-column label="资产类型" align="center" prop="jiaqileixing">
          <template slot-scope="scope">
            <span>{{ scope.row.jiaqileixing }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资产类型编号" align="center" prop="unit">
          <template slot-scope="scope">
            <span>{{ scope.row.unit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="仓库管理员" align="center">
          <template slot-scope="scope">
            <span>{{ username_filters(scope.row.sendno) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="物品调度员" align="center">
          <template slot-scope="scope">
            <span>{{ username_filters(scope.row.recvno) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer">{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <span style="color:#3399FF" @click="xiugai_peizhi(scope.row.sid)">修改</span>
              <span style="color:#FF5454" @click="delete_peizhi(scope.row.sid)">删除</span>
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
          :total="tableData_pz.filter(data => !content4_v || data.jiaqileixing.toLowerCase().includes(content4_v.toLowerCase())).length"
        ></el-pagination>
      </div>
    </div>
    <!-- 固定资产添加弹窗 -->
    <el-dialog
      :title="guding_title"
      :visible.sync="dialogTableVisible_1"
      width="40%"
      :close-on-click-modal="false"
      @close="guding_xiangqingclose"
    >
      <el-form
        label-width="100px"
        :model="guding_form"
        ref="guding_form"
        :disabled="!gudingxaingqing"
        :rules="rules"
      >
        <el-form-item label="资产名称：" prop="aname">
          <el-input v-model="guding_form.aname"></el-input>
        </el-form-item>
        <!-- <el-form-item label="资产编号：" prop="ano">
          <el-input v-model="guding_form.ano"></el-input>
        </el-form-item>-->
        <el-form-item label="资产类型：" prop="atype">
          <el-select v-model="guding_form.atype" placeholder="请选择" style="width:100%" filterable>
            <el-option
              v-for="item in options_1"
              :key="item.sid"
              :label="item.jiaqileixing"
              :value="item.jiaqileixing"
              value-format="timestamp"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="型号：" prop="amodel">
          <el-input v-model="guding_form.amodel"></el-input>
        </el-form-item>
        <el-form-item label="产品序列号：" prop="anorms">
          <el-input v-model="guding_form.anorms"></el-input>
        </el-form-item>
        <el-form-item label="购入时间：" prop="intime">
          <el-date-picker
            v-model="guding_form.intime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="8:00:00"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="价格(元)：" prop="price">
          <el-input v-model="guding_form.price"></el-input>
        </el-form-item>
        <el-form-item label="凭证：" prop="proof">
          <el-input v-model="guding_form.proof"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="guding_form.remark"></el-input>
        </el-form-item>
        <el-form-item label="附件：" style="text-align: left;" prop="mid">
          <newUpload ref="gudingfujian" :Upload_showdisable="Upload_showdisable"></newUpload>
        </el-form-item>
        <!-- Upload_showdisable -->
      </el-form>
      <div v-if="gudingxaingqing" slot="footer" class="dialog-footer">
        <el-button class="return" @click="guding_return('guding_form')" style="width: 120px;">取消</el-button>
        <el-button
          type="primary"
          class="fill"
          @click="guding_queren('guding_form')"
          style="width: 120px;"
        >确定</el-button>
      </div>
      <div v-if="!gudingxaingqing" slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          class="fill"
          @click="guding_xiangqingclose('guding_form')"
          style="width: 120px;"
        >确定</el-button>
      </div>
    </el-dialog>
    <!--使用操作 -->
    <el-dialog
      title="使用信息"
      :visible.sync="dialogFormVisible"
      width="30%"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form :model="use_data" ref="use_data" :rules="rules" label-width="100px">
        <el-form-item label="使用人：" prop="aid">
          <el-select
            v-model="use_data.aid"
            filterable
            placeholder="请选择"
            @change="change_dep"
            style="width:100%"
          >
            <el-option
              v-for="item in respon"
              :key="item.uid"
              :label="item.username"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用部门：" prop="reamrk3">
          <el-input
            v-model="use_data.reamrk3"
            style="width:100%"
            placeholder="请输入"
            @focus="change_user"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品名称：" prop="reamrk4">
          <el-input v-model="use_data.reamrk4" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="资产编号：" prop="reamrk5">
          <el-input v-model="use_data.reamrk5" style="width:100%"></el-input>
        </el-form-item>

        <el-form-item label="领用时间：" prop="uptime">
          <el-date-picker
            v-model="use_data.uptime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="8:00:00"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="使用地点：" prop="leaveaddr">
          <el-input v-model="use_data.leaveaddr" style="width:100%"></el-input>
        </el-form-item>
        <!-- <el-form-item label="备注：" prop="reason">
          <textarea v-model="use_data.reason" style="width:100%" cols="30" rows="10"></textarea>
        </el-form-item>-->
      </el-form>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="use_cancel()" style="width: 120px;">取 消</el-button>
        <el-button type="primary" @click="submit('use_data')" style="width: 120px;">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 使用申请弹窗 -->
    <el-dialog
      title="使用审核"
      :visible.sync="dialogVisible"
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <!-- <span>使用申请</span> -->
      <el-form label-width="100px" :model="use_audit" ref="use_audit">
        <el-form-item label="审核意见：" :label-width="formLabelWidth" prop="advise">
          <el-select v-model="use_audit.advise" style="width:80% ">
            <el-option label="已通过" value="0"></el-option>
            <el-option label="未通过" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注：" :label-width="formLabelWidth" prop="remark">
          <textarea style="width:100%;height:150px" v-model="use_audit.remark" name="beizhu"></textarea>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" style="width: 120px;">取 消</el-button>
        <el-button type="primary" @click="use_submit()" style="width: 120px;">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 登记入库弹窗 -->
    <el-dialog
      :title="caigou_name"
      :visible.sync="dialogFormVisible_3"
      width="40%"
      :close-on-click-modal="false"
      @close="dialogFormVisible_3close"
    >
      <el-form :model="caigou_form" label-width="100px" ref="caigou_form" :rules="rules">
        <el-form-item label="采购人：" :label-width="formLabelWidth" prop="cgBy">
          <el-input v-model="caigou_form.cgBy" autocomplete="off" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label=" 资产类型：" :label-width="formLabelWidth" prop="cgType">
          <el-select v-model="caigou_form.cgType" placeholder="请选择" style="width:100%" filterable>
            <el-option
              v-for="item in caigou_type"
              :key="item.sid"
              :label="item.jiaqileixing"
              :value="item.jiaqileixing"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资产名称：" :label-width="formLabelWidth" prop="name">
          <el-input v-model="caigou_form.name" autocomplete="off" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="规格/型号：" :label-width="formLabelWidth" prop="size">
          <el-input v-model="caigou_form.size" autocomplete="off" style="width:100%"></el-input>
        </el-form-item>
        <el-popover
          ref="popover"
          placement="left"
          title="注意"
          width="200"
          trigger="focus"
          content="请确定数量是否正确"
        ></el-popover>
        <!-- <el-form-item label="产品序列号：" :label-width="formLabelWidth" prop="produceNum">
          <el-input v-model="caigou_form.produceNum" autocomplete="off" style="width:100%"></el-input>
        </el-form-item>-->
        <el-form-item label="单位：" :label-width="formLabelWidth" prop="unit">
          <el-input v-model="caigou_form.unit" autocomplete="off" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="价格/元：" :label-width="formLabelWidth" prop="price">
          <el-input v-model="caigou_form.price" autocomplete="off" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="数量：" :label-width="formLabelWidth" prop="number" v-popover:popover>
          <el-input v-model="caigou_form.number" autocomplete="off" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="购入事由：" :label-width="formLabelWidth" prop="cause">
          <el-input v-model="caigou_form.cause" autocomplete="off" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="备注：" :label-width="formLabelWidth" prop="remark">
          <!-- <el-input v-model="caigou_form.remarks" autocomplete="off" style="width:80%"></el-input> -->
          <textarea v-model="caigou_form.remark" cols="10" rows="5" style="width:100%"></textarea>
        </el-form-item>
        <!-- <div class="upload_button">
          <div> 
            <span>上传凭证附件：</span>
            <a href="javascript:;" @click="downform()">{{file_name}}</a>
          </div>
          <div>
            <a href="javascript:;" :class="[isActive?'file':'file_1']">
              <input type="file" id="myFile" @change="upload($event)" />上传附件
            </a>
          </div>
        </div>-->
        <el-form-item
          label="上传附件："
          :label-width="formLabelWidth"
          prop="mid"
          style="text-align: left;"
        >
          <newUpload ref="newUpload" key="randomkey" :Upload_showdisable="Upload_showdisable"></newUpload>
        </el-form-item>
        <!-- <mupload></mupload> -->
        <!-- submit_caigou('caigou_form') -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="caigou_cancel('caigou_form')" style="width: 120px;">取 消</el-button>
        <el-button type="primary" @click="submit_caigou('caigou_form')" style="width: 120px;">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 是否将添加的采购记录添加到固定资产      弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible_8"
      width="30%"
      center
      :before-close="cghandleClose"
      :show-close="false"
      modal
    >
      <span style="font-size:20x;">是否将此条采购记录添加到固定资产</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="submit_caigoun()" type="primary">不添加</el-button>
        <el-button type="primary" @click="submit_caigouy()" style="margin-left:40px">添加</el-button>
      </span>
    </el-dialog>

    <!-- 资产类型配置添加弹窗 -->
    <el-dialog
      title="固定资产类型"
      :visible.sync="dialogFormVisible_4"
      width="30%"
      :close-on-click-modal="false"
      @close="peizhi_cancel"
    >
      <el-form :model="peizhi_form" ref="peizhi_form" :rules="rules1" label-width="123px">
        <el-form-item label="资产类型：" prop="jiaqileixing">
          <el-input v-model="peizhi_form.jiaqileixing" autocomplete="off" style="width:90%"></el-input>
        </el-form-item>
        <el-form-item label="资产类型编号：" prop="unit">
          <el-input v-model="peizhi_form.unit" style="width:90%"></el-input>
        </el-form-item>
        <el-form-item label="仓库管理员：" prop="sendno">
          <el-select v-model="peizhi_form.sendno" placeholder="请选择" style="width:90%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.username"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物品调度员：" :label-width="formLabelWidth" prop="recvno">
          <el-select v-model="peizhi_form.recvno" placeholder="请选择" style="width:90%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.username"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:" :label-width="formLabelWidth" prop="remark">
          <textarea v-model="peizhi_form.remark" name id cols="30" rows="10" style="width:100%"></textarea>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="peizhi_cancel('peizhi_form')" style="width: 120px;">取 消</el-button>
        <el-button type="primary" @click="submit_peizhi('peizhi_form')" style="width: 120px;">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 清理记录修改弹窗 -->
    <el-dialog
      :title="qinglijilu_title"
      :visible.sync="dialogformvisible_9"
      width="40%"
      :close-on-click-modal="false"
      @close="qinglijilu_cancel"
    >
      <el-form :model="qinglijilu_form" ref="qinglijilu_form" :rules="rules" label-width="200px">
        <el-form-item label="处置去向：" :label-width="formLabelWidth" prop="clearDir">
          <el-input v-model="qinglijilu_form.clearDir" autocomplete="off" style="width:100%"></el-input>
        </el-form-item>
        <div style="margin: 40px;"></div>
        <el-form-item label="残值/元：" :label-width="formLabelWidth">
          <el-input style="width:100%" v-model="qinglijilu_form.remainValue"></el-input>
        </el-form-item>
        <el-form-item label="备注：" :label-width="formLabelWidth" prop="clearRemark">
          <textarea
            v-model="qinglijilu_form.clearRemark"
            name
            id
            cols="30"
            rows="10"
            style="width:100%"
          ></textarea>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="qinglijilu_cancel('qinglijilu_form')" style="width: 120px;">取 消</el-button>
        <el-button
          type="primary"
          @click="submit_qinglijilu('qinglijilu_form')"
          style="width: 120px;"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 状态改变 -->
    <el-dialog title="状态改变" width="20%" :visible.sync="dialogformvisible_10">
      <div style="display:flxed">
        <el-select
          v-model="content1_user"
          placeholder="使用情况"
          style="width:120px;margin-right:20px;"
          clearable
        >
          <el-option label="待分配" value="1"></el-option>
          <el-option label="在用" value="2"></el-option>
          <el-option label="已折旧" value="4"></el-option>
          <el-option label="已处置" value="5"></el-option>
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close_10()" style="width: 120px;">取 消</el-button>
        <el-button type="primary" @click="sumbit_pricevalue()" style="width: 120px;">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 物品处置弹窗 -->
    <el-dialog
      title="物品处置"
      :visible.sync="dialogformvisible_11"
      width="30%"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form :model="qinglijilu_form" ref="qinglijilu_form" :rules="rules" label-width="200px">
        <el-form-item label="清理去向：" :label-width="formLabelWidth" prop="clearDir">
          <el-input v-model="qinglijilu_form.clearDir" autocomplete="off" style="width:100%"></el-input>
        </el-form-item>
        <div style="margin: 20px;"></div>
        <el-form-item label="残值/元：" :label-width="formLabelWidth" prop="clearDir">
          <el-input style="width:100%" v-model="qinglijilu_form.remainValue"></el-input>
        </el-form-item>
        <el-form-item label="备注：" :label-width="formLabelWidth" prop="clearRemark">
          <textarea
            v-model="qinglijilu_form.clearRemark"
            name
            id
            cols="30"
            rows="10"
            style="width:100%"
          ></textarea>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="qinglijilu_cancel1('qinglijilu_form')" style="width: 120px;">取 消</el-button>
        <el-button
          type="primary"
          @click="submit_qinglijilu1('qinglijilu_form')"
          style="width: 120px;"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import newUpload from "./newUpload.vue";
export default {
  inject: ["reload"],
  name: "Assets",
  components: { newUpload },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value == "" && this.use_data.aid == "") {
        callback(new Error("使用人及使用部门至少选择输入一项"));
      } else {
        callback();
      }
    };
    return {
      Upload_showdisable: true,
      search_peiple: "",
      search_zichan: "",
      zichanatype: "",
      price_value_0: "",
      pricevalue_aid: "",
      fileList: [],
      qinglijilu_title: "清理记录修改",
      lei: 0,
      youneed: "",
      state: "",
      timeout: null,
      caigou_name: "",
      writeMessageShow: false,
      peizhi_form: {
        jiaqileixing: "",
        sendno: "",
        recvno: "",
        remark: "",
        unit: "",
      },
      guding_title: "固定资产申请",
      use_audit: {
        advise: "",
        remark: "",
      },
      // 清理记录表格内容
      qinglijilu_form: {
        clearDir: "",
        clearRemark: "",
        remainValue: "",
      },
      dialogVisible: false,
      dialogVisible_8: false,
      dialogFormVisible_4: false,
      dialogformvisible_10: false,
      dialogformvisible_11: false,
      content1_user: "",
      content1_v: "",
      content2_v: "",
      content3_v: "",
      content4_v: "",
      content5_v: "",
      currentPage1: 1, //当前页1
      currentPage2: 1, //当前页2
      currentPage3: 1, //当前页2
      currentPage4: 1, //当前页2
      currentPage5: 1,

      pageSize: 10, //每页条数
      fid: [],
      caigou_form: {
        //  wtype:"",
        // reason:"",
        //  qjtime:"",
        //  agent1:"",
        //  agent2:"",
        //  agent3:"",
      },
      file_name: [],
      isActive: true,
      dialogTableVisible_1: false,
      guding_status: false,
      guding_s: 0,
      dialogFormVisible_3: false,
      dialogformvisible_9: false,
      menu: [],
      float: [],
      activeIndex: "",
      tableData_gd: [],
      use_data: {
        reamrk3: "",
        useDep: "",
        aid: "",
        reamrk4: "",
        reamrk5: "",
        uptime: "",
        leaveaddr: "",
        reason: "",
      },
      guding_form: {
        aname: "",
        ano: "",
        atype: "",
        amodel: "",
        anorms: "",
        intime: "",
        price: "",
        proof: "",
        remark: "",
      },
      caigou_form: {
        cause: "",
        cgBy: "",
        cgType: "",
        name: "",
        size: "",
        price: "",

        number: "",
        unit: "",
        remark: "",
      },
      tableData_cg: [],
      tableData_sy: [],
      tableData_ql: [
        //   //接受的数据
        //   name: "张三",
        //   bh: "XXXXXXXX",
        //   lb: "电脑",
        //   xh: "XXXXX",
        //   gg: "XXXXX",
        //   jb: "XXXXX",
        //   qx: "XXXXXXXX",
        //   time: "1995-08-12",
        //   pz: "XXXXX",
        //   bz: "XXXXX"
        // },
        // {
        //   name: "赵四",
        //   bh: "XXXXXXXX",
        //   lb: "电脑",
        //   xh: "XXXXX",
        //   gg: "XXXXX",
        //   jb: "XXXXX",
        //   qx: "XXXXXXXX",
        //   time: "1995-08-12",
        //   pz: "XXXXX",
        //   bz: "XXXXX"
        // },
        // {
        //   name: "王五",
        //   bh: "XXXXXXXX",
        //   lb: "电脑",
        //   xh: "XXXXX",
        //   gg: "XXXXX",
        //   jb: "XXXXX",
        //   qx: "XXXXXXXX",
        //   time: "1995-08-12",
        //   pz: "XXXXX",
        //   bz: "XXXXX"
        //
      ],
      xid: "",
      tableData_pz: [],
      rules1: {
        jiaqileixing: [
          { required: true, message: "请输入资产类型", trigger: "blur" },
        ],
        unit: [
          { required: true, message: "请输入资产类型编号", trigger: "blur" },
          {
            required: true,
            pattern: /^[a-zA-Z]+$/,
            message: "类型编号必须是全字母",
            trigger: "blur",
          },
        ],
      },
      rules: {
        reamrk3: [{ validator: validatePass, trigger: "blur" }],
        reamrk5: [
          { required: true, message: "请输入资产编号", trigger: "blur" },
        ],
        clearDir: [
          { required: true, message: "请输入处置去向", trigger: "change" },
        ],
        c: [
          { required: true, message: "请输入固定资产类型", trigger: "change" },
        ],
        // w: [
        //   { required: true, message: "请输入仓库管理员", trigger: "change" }
        // ],
        // i: [
        //   { required: true, message: "请输入物品调度员", trigger: "change" }
        // ],
        reamrk4: [
          { required: true, message: "请输入产品名称", trigger: "change" },
        ],
        uptime: [
          { required: true, message: "请输入使用时间", trigger: "change" },
        ],
        leaveaddr: [
          { required: false, message: "请输入使用地点", trigger: "change" },
        ],
        // 采购申请数据
        cause: [
          { required: false, message: "请输入申请事由", trigger: "change" },
        ],
        cgBy: [{ required: true, message: "请输入申请人", trigger: "change" }],
        cgType: [{ required: true, message: "请输入类型", trigger: "change" }],
        name: [{ required: true, message: "请输入名称", trigger: "change" }],
        size: [{ required: true, message: "请输入规格", trigger: "change" }],
        number: [{ required: true, message: "请输入数量", trigger: "change" }],
        unit: [{ required: true, message: "请输入单位", trigger: "change" }],
        price: [{ required: true, message: "请输入价格", trigger: "change" }],
        // remark: [{ required: false, trigger: "change" }],
        aname: [
          { required: true, message: "请输入资产名称", trigger: "change" },
        ],
        ano: [{ required: true, message: "请输入资产编号", trigger: "blur" }],
        atype: [
          { required: true, message: "请输入资产类型", trigger: "change" },
        ],
        // amodel: [{ required: true, message: "请输入型号", trigger: "change" }],
        amount: [{ required: true, message: "请输入数量", trigger: "change" }],
        // anorms: [{ required: true, message: "请输入规格", trigger: "change" }],
        intime: [
          { required: true, message: "请输入购入时间", trigger: "change" },
        ],
        // price: [
        //   { required: true, message: "请输入价格(元)", trigger: "change" }
        // ],
        //  proof: [{ required: true, message: "请输入凭证", trigger: "blur" }],
        // manager: [
        //   { required: true, message: "请输入管理者", trigger: "change" }
        // ],
        // updatetime: [
        //   { required: true, message: "请输入更新时间", trigger: "change" }
        // ],
        // dispatcher: [
        //   { required: true, message: "请输入调度者", trigger: "change" }
        // ],
        // dispatcher: [
        //   { required: true, message: "请输入调度者", trigger: "change" }
        // ]
      },
      content1_user: "",
      content1_user1: "",
      gdpeiuzhi_status: 1,
      caigou_type: [],
      multipleSelection: "",
      options: [],
      dialogFormVisible: false,
      formLabelWidth: "120px",
      options_1: [],
      options_2: [],
      respon: [],
      isActive: true,
      multipleSelection1: "",
      xiugai_s: 0,
      caigou_ststus: 0,
      caigou_value: 0,
      qinglijilu_ststus: 0,
      tid: "",
      arr1: "",
      price_value: "",
      oldprice_value: "",
      chuzhi_aid: "",
      zichanatype1: "",
      gudingxaingqing: false,
      // xid:"",
      fileListId: "",
    };
  },
  methods: {
    guding_xiangqingclose(formName) {
      this.$refs.guding_form.resetFields();
      this.clear_f(this.guding_form);
      console.log(this.guding_form);
      this.guding_status = false;
      this.$refs.gudingfujian.fileList = [];
      this.dialogTableVisible_1 = false;
    },
    user_filters1() {
      let data = new FormData();
      data.append("type", this.zichanatype1);
      data.append("m", this.content5_v);
      this.$http.post("/ac/acrl", data).then((res) => {
        this.tableData_ql = res.data;
      });
    },
    search_guding_people() {
      let data = new FormData();
      data.append("perOrDep", this.search_peiple);
      data.append("m", this.content1_v);
      data.append("type", this.zichanatype);
      data.append("c", this.content1_user);
      this.$http.post("/ac/af", data).then((res) => {
        this.tableData_gd = res.data;
      });
    },
    search_caigou() {
      let data = new FormData();
      data.append("m", this.search_zichan);
      data.append("type", this.content2_v);
      this.$http.post("/ac/purl", data).then((res) => {
        this.tableData_cg = res.data;
      });
    },
    change_user() {
      this.use_data.aid = "";
    },
    change_dep() {
      this.use_data.reamrk3 = "";
    },
    user_jilu(value) {
      let data = new FormData();
      data.append("aid", value);
      this.$http.post("/ac/aul", data).then((res) => {
        console.log(res.data, "清理记录");
        this.tableData_sy = res.data;
        this.handleSelect("23");
      });
    },
    // 清理记录表格内容
    // qinglijilu_form: {
    //   clearDir: "",
    //   clearRemark: "",
    //   remainValue: ""
    // },
    dialogFormVisible_3close() {
      this.$nextTick(() => {
        this.$refs.caigou_form.resetFields();
        this.$refs.newUpload.fileList = [];
      });
    },
    //处置确认
    submit_qinglijilu1(formName) {
      let data = new FormData();
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("确认消息填写无误", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info",
          })
            .then(() => {
              data.append("clearDir", this.qinglijilu_form.clearDir);
              data.append("clearRemark ", this.qinglijilu_form.clearRemark);
              data.append("remainValue", this.qinglijilu_form.remainValue);
              data.append("aid", this.chuzhi_aid);
              this.$http
                .post("ac/das", data)
                .then((res) => {
                  if (res.data == -1) {
                    this.$alert("请在此物品归还后再进行处置", "提示", {
                      confirmButtonText: "确定",
                    });
                  } else {
                    this.qinglijilu_form.clearDir = "";
                    this.qinglijilu_form.clearRemark = "";
                    this.qinglijilu_form.remainValue = "";
                    this.$refs.qinglijilu_form.resetFields();
                    this.dialogformvisible_11 = false;
                    this.$message({
                      showClose: true,
                      message: "物品已处置",
                      type: "success",
                    });
                    this.guding_data();
                    this.qingli_data();
                  }
                })
                .catch((res) => {
                  this.$message({
                    showClose: true,
                    message: "处置失败",
                    type: "error",
                  });
                });
            })
            .catch((res) => {});
        }
      });
    },
    //处置取消
    qinglijilu_cancel1() {
      this.$refs.qinglijilu_form.resetFields();
      this.qinglijilu_form.clearDir = "";
      this.qinglijilu_form.clearRemark = "";
      this.qinglijilu_form.remainValue = "";
      this.dialogformvisible_11 = false;
    },
    //固定资产处置
    chuzhi_wupin(value) {
      this.chuzhi_aid = value;
      this.dialogformvisible_11 = true;
    },
    //固定资产折旧
    guding_handleinto_1(value) {
      let data = new FormData();
      data.append("aid", value);
      this.$http.post("/ac/cs", data).then((res) => {
        this.$confirm("是否折旧此物品", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$message({
              type: "success",
              message: "已折旧!",
            });
            this.guding_data();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      });
    },
    guding_handleinto_2(type) {
      this.pricevalue_aid = type.aid;
      this.dialogformvisible_10 = true;
    },
    close_10() {
      this.dialogformvisible_10 = false;
      this.pricevalue_aid = "";
    },
    sumbit_pricevalue() {
      let data = new FormData();
      data.append("canuse", this.content1_user);
      data.append("aid", this.pricevalue_aid);
      this.$http.post("/ac/cs", data).then((res) => {
        this.pricevalue_aid = "";
        this.dialogformvisible_10 = false;
        this.guding_data();
        this.$message({
          message: "修改成功",
          type: "success",
        });
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //固定资产清理
    // //type : scope.row.aid   use_s : scope.row.canuse
    // user_abandon1(type, use_s) {
    //   let data = new FormData();
    //   data.append("aid", type);
    //   data.append("canuse", 3);
    //   console.log(data, "dddddddd");
    //   if (confirm("确认清理") == true) {
    //     this.$http.post("/ac/uum", data).then(res => {
    //       alert("已清理该资产");
    //       this.guding_data();
    //       this.qingli_data();
    //       console.log(res);
    //     });
    //   }
    // },
    //固定资产清理
    user_abandon(type, use_s) {
      this.qinglijilu_title = "清理去向及备注";
      let data = new FormData();
      data.append("aid", type);

      let a = JSON.parse(JSON.stringify(this.tableData_gd));
      for (var item of a) {
        this.qinglijilu_form.aid = item.aid;
        this.guding_form.aid = type;
        console.log(item, "2222");
      }
      // console.log(a);
      this.qinglijilu_ststus = 0;
      this.dialogformvisible_9 = true;
    },
    //清理记录导出功能函数
    qinglijilu_daochu() {
      let a = this.multipleSelection;
      let rids = [];
      for (let key in a) {
        rids.push(a[key].aid);
      }
      let data = new FormData();
      data.append("rid", rids);
      if (rids == "") {
        this.$confirm("确认导出所有数据", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
        })
          .then(() => {
            this.$http({
              url: "/ac/ecr",
              method: "post",
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
              console.log(res);
              console.log(fileName, "文件名");
            });
          })
          .catch((res) => {});
      } else {
        this.$http({
          url: "/ac/ecr",
          method: "post",
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
          console.log(res);
          console.log(fileName, "文件名");
        });
      }
    },
    // 清理记录修改弹窗取消按钮
    qinglijilu_cancel() {
      this.qinglijilu_form.clearDir = "";
      this.qinglijilu_form.clearRemark = "";
      this.qinglijilu_form.remainValue = "";
      this.clear_f(this.qinglijilu_form);
      this.dialogformvisible_9 = false;
    },
    //// 清理记录修改和固定资产修改弹窗确定按钮
    submit_qinglijilu(formName) {
      console.log(this.caigou_form);
      let data = new FormData();

      this.$refs[formName].validate((valid) => {
        //验证表格是否对应
        if (valid) {
          this.$confirm("确认消息填写无误", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info",
          })
            .then(() => {
              if (this.qinglijilu_ststus == 0) {
                for (let key in this.qinglijilu_form) {
                }
                data.append("clearDir", this.qinglijilu_form.clearDir);
                data.append("clearRemark", this.qinglijilu_form.clearRemark);
                data.append("remainValue", this.qinglijilu_form.remainValue);
                data.append("aid", this.guding_form.aid);
                data.append("canuse", 3);
                this.$http.post("/ac/uum", data).then((res) => {
                  alert("已清理该资产");
                  this.clear_f(this.qinglijilu_form);
                  this.guding_data();
                  this.qingli_data();
                  console.log(res);
                  this.dialogformvisible_9 = false;
                });
                //修改
              } else if (
                //清理
                this.qinglijilu_ststus == 1
              ) {
                data.append("clearDir", this.qinglijilu_form.clearDir);
                data.append("clearRemark", this.qinglijilu_form.clearRemark);
                data.append("remainValue", this.qinglijilu_form.remainValue);
                data.append("aid", this.caigou_form.aid);
                this.$http.post("/ac/ecrl", data).then((res) => {
                  console.log(res);
                  this.dialogformvisible_9 = false;
                  this.clear_f(this.qinglijilu_form);
                  this.$message({
                    type: "success",
                    message: "已修改!",
                  });
                  this.qingli_data();
                });
              }
            })
            .catch((res) => {});
        } else {
          alert("信息填写不规范或不完整");
          return false;
        }
      });
    },
    project_filters(type) {
      let data = new FormData();
      data.append("", type);
      this.$http.post("", data).then((res) => {
        console.log(res);
      });
    },
    filterTag(value, row) {
      console.log(value, "筛选后的value");
      return row.canuse === value;
    },
    filterTag_user(value, row) {
      if (value === null) {
        return row.downtime === value;
      } else {
        return row.downtime !== null;
      }
    },
    user_filters(type) {
      let data = new FormData();
      data.append("type", this.zichanatype);
      data.append("c", this.content1_user);
      data.append("m", this.content1_v);
      this.$http.post("/ac/af", data).then((res) => {
        this.tableData_gd = res.data;
      });
    },
    status_filters(type) {
      console.log(type, "使用状态");
      let data = new FormData();
      if (type != null) data.append("r", type);
      this.$http.post("/ac/aul", data).then((res) => {
        if (res.data != -1002) this.tableData_sy = res.data;
        console.log(res);
      });
    },

    user_abandonclear(type) {
      let data = new FormData();
      data.append("aid", type);
      data.append("uname", "");
      this.$http.post("/ac/uum", data).then((res) => {
        console.log(res);
      });
    },
    username_filters(type) {
      let user = JSON.parse(sessionStorage.getItem("user_name"));
      for (var item of user) {
        // console.log(item.uid,"uid循环");
        if (Number(item.uid) == Number(type)) {
          // console.log("true----------++++++++++++");
          return item.username;
        }
      }
    },
    fresh_1(type) {
      console.log(type);
      // this.handleSelect("type")
    },
    use_s(type) {
      switch (type) {
        case 0:
          return "采购中";
        case 1:
          return "待分配";
        case 2:
          return "在用";
        case 3:
          return "已处置";
        case 4:
          return "已折旧";
      }
    },
    //项目配置删除
    delete_peizhi(num) {
      let data = new FormData();
      data.append("rid", num);
      this.$confirm("确认删除该信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          this.$http.post("/vc/dp", data).then((res) => {
            this.peizhi();
            console.log(res);
          });
        })
        .catch((res) => {});
    },
    //配置修改
    xiugai_peizhi(num) {
      this.xiugai_s = 1;
      let a = JSON.parse(JSON.stringify(this.tableData_pz));
      for (var item of a) {
        console.log(item, "2222");
        if (num == item.sid) {
          //直接赋值时候 导向存在问题
          this.peizhi_form = item;
        }
      }
      this.dialogFormVisible_4 = true;
    },
    //多文件上传
    upload_excel(e) {
      //获取选定的文件
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
        //FormData私有类对象，访问不到，可以通过get判断值是否传进去
        let config = {
          //添加请求头
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
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
          console.log(typeof String(res.data[0].fid), "iddddddddd");
          obj1.id = res.data[0].fid;
          // this.$set(obj1,"id",res.data[0].fid)
          this.file_name.unshift(obj1);
          this.user.fid = this.user.fid + "," + String(res.data[0].fid);
          // console.log(this.user.fid.split(",") ,"this.user.fid.split(",") ");
          // console.log(this.user.fid.split(",") ).unshift((res.data[0].fid),"this.user.fid.split(",") ).unshift(res.data[0].fid");
          // (this.user.fid.split(",") ).unshift(res.data[0].fid)
          console.log(this.user.fid, "上传的fid库");
          //特殊需求部分 页面状态
        });
      }
    },
    user_return(num, uname, aid) {
      let data = new FormData();
      data.append("wid", num);
      this.$confirm("确认归还", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          this.$http.post("/ac/ra", data).then((res) => {
            // this.user_abandonclear(aid)
            this.shiyong_data();
            //归还操作后固定资产界面的状态刷新
            this.guding_data();
            console.log(res);
          });
        })
        .catch((res) => {});
    },
    // handleEdit_xiugai(index, scope) {
    //   this.gdpeiuzhi_status = 0;
    //   this.peizhi_form = this.tableData_pz[
    //     Object.keys(this.tableData_pz)[index]
    //   ];
    //   console.log(this.peizhi_form, "this.peizhi_form");
    //   this.dialogFormVisible_4 = true;
    //   // this.$refs.peizhi_form.resetFields()
    // },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSelectionChange(val) {
      this.multipleSelection1 = val;
    },
    clickRow(row) {
      this.$refs.tableData_sy.toggleRowSelection(row);
    },
    clickRow_guding(row) {
      this.$refs.tableData_gd.toggleRowSelection(row);
    },
    use_clear() {
      var a = this.multipleSelection;
      var rids = [];
      for (var i = 0; i < a.length; i++) {
        rids.push(a[i].wid);
      }
      if (rids == "") {
        alert("请选择使用记录进行清理");
        return false;
      }
      let data = new FormData();
      data.append("id", rids);
      this.$confirm("确认清理该数据", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          this.$http.post("/ac/cr", data).then((res) => {
            this.shiyong_data();
            console.log(res);
          });
        })
        .catch((res) => {});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    pingzhengchaxun(c, num, nn, lei, y) {
      let data = new FormData();
      data.append("fid", y);
      this.$http.post("/ac/gbf", data).then((res) => {
        this.fileList = [];
        // for (var i = 0; i < res.data.length; i++) {
        //   this.fileList.push({
        //     uid: res.data[i].fid,
        //     name: res.data[i].fname,
        //     url: "http://fas.intertion.cn:9111/group1/" + res.data[i].fpath,
        //   });
        // }
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
        this.$refs.newUpload.fileList = this.fileList;

        console.log(res.data, "图片数组");
      });
      this.lei = lei;
      this.caigou_ststus = lei;
      this.caigou_name = "登记入库修改";
      console.log(this.tableData_cg, "内容", num);
      let a = JSON.parse(JSON.stringify(num));
      this.caigou_form = a;
      this.fid = Number(a.reamrk5);
      for (var item of this.tableData_cg) {
        console.log(item, "修改获取的数据11111");
        if (num.wid == item.wid) this.caigou_form = item;
      }
      this.caigou_form = this.tableData_cg[c];
      console.log(c, num, nn);
      this.dialogFormVisible_3 = true;
      this.fid = this.tableData_cg[c].reamrk5;
      //  this.downform_name(this.fid);
      // this.downform();
    },
    //  清理记录的删除按钮功能
    qingli_delete(type) {
      let data = new FormData();
      data.append("aid", type);
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          this.$http.post("/ac/dcrl", data).then((res) => {
            this.qingli_data();
            console.log(res);
          });
        })
        .catch((res) => {});
    },
    //采购记录删除
    peizhi_delete(type) {
      let data = new FormData();
      data.append("id", type);
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          this.$http.post("/ac/dpur", data).then((res) => {
            this.caigou_data();
            console.log(res);
          });
        })
        .catch((res) => {});
    },
    writeMessageFun(ev) {
      if (!this.$refs.msk.contains(ev.target)) {
        this.writeMessageShow = false;
      }
    },

    submit_peizhi(formName) {
      let data = new FormData();
      for (let key in this.peizhi_form) {
        if (this.peizhi_form[key] != "" && this.peizhi_form[key] != null)
          data.append(key, this.peizhi_form[key]);
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("确认消息填写无误", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info",
          })
            .then(() => {
              //新增加提交
              if (this.xiugai_s == 0) {
                this.$http.post("/ac/as", data).then((res) => {
                  console.log(res);
                  this.dialogFormVisible_4 = false;
                  this.clear_f(this.peizhi_form);
                  // this.reload()
                  this.peizhi();
                });
              } else if (this.xiugai_s == 1) {
                this.$http.post("/vc/upn", data).then((res) => {
                  console.log(res);
                  this.dialogFormVisible_4 = false;
                  this.clear_f(this.peizhi_form);
                  // this.reload()
                  this.peizhi();
                });
              }

              //修改提交
            })
            .catch((res) => {});
        } else {
          // alert("信息填写不规范或不完整");
          this.$alert("信息填写不规范或不完整", "提示", {
            confirmButtonText: "确定",
          });
          return false;
        }
      });
    },
    peizhi_cancel(type) {
      this.clear_f(this.peizhi_form);
      this.dialogFormVisible_4 = false;
      console.log(this.peizhi_form);
    },
    peizhi_add() {
      this.xiugai_s = 0;
      this.dialogFormVisible_4 = true;
    },
    // 固定资产删除
    guding_delete(type) {
      let data = new FormData();
      data.append("aid", type);
      this.$confirm("确认删除信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          this.$http.post("/ac/da", data).then((res) => {
            this.guding_data();
            console.log(res);
          });
        })
        .catch((res) => {});
    },
    caigou_cancel(formName) {
      this.clear_f(this.caigou_form);
      this.$refs.caigou_form.resetFields();
      this.dialogFormVisible_3 = false;
      this.file_name = [];
      this.caigou_data();
      this.$refs.newUpload.fileList = [];
      this.reload();
    },
    use_submit() {
      var data = new FormData();
      data.append("s", this.use_audit.advise);
      data.append("r", this.use_audit.remark);
      data.append("rid", this.xid);
      data.append("as", 3);
      this.$http({
        method: "post",
        url: "/job/at",
        data: data,
      }).then((res) => {
        this.shiyong_data();
        this.dialogVisible = false;
        this.$refs.use_audit.resetFields();
      });
    },
    use_handleshenhe(type) {
      console.log(typeof type);

      this.xid = type.toString();
      console.log(typeof this.xid);

      this.dialogVisible = true;
    },
    use_current(type) {
      if (type == null) {
        return "未归还";
      } else {
        return "已归还";
      }
    },
    handleReload() {
      this.reload(); // 在想要刷新页面的时候调用reload方法
    },
    use_form(type) {
      if (type == 1) {
        return true;
      } else {
        return false;
      }
    },
    user_f(type, row) {
      this.xid = type;
      this.use_data.reamrk5 = row.ano;
      this.use_data.reamrk4 = row.aname;
      //  this.handleSelect(22);
      this.use_shenqing();
    },
    downform_name(type) {
      if (type == "" || type == null) {
        return false;
      }
      var data = new FormData();
      data.append("fid", type);
      this.$http({
        url: "/ac/gpur",
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
        let obj1 = {};
        this.$set(obj1, "name", fileName);
        this.$set(obj1, "id", id);
        this.file_name.push(obj1);
        // this.download(res,fileName)
      });
    },
    downform() {
      // let t=sessionStorage.getItem("token")
      var data = new FormData();
      data.append("fid", this.fid);
      this.$http({
        url: "/ac/gpur",
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
        this.download(res, fileName);
      });
      // .catch(error => {});
    },
    cghandleClose() {
      //this.$refs.caigou_form.resetFields();
      this.dialogVisible_8 = false;
    },
    caigou_shenqing(n) {
      this.lei = n;
      this.caigou_ststus = n;
      console.log(this.caigou_form);
      this.caigou_name = "入库登记";
      this.dialogFormVisible_3 = true;
      // this.guding_status = true;
    },
    //是否将添加的采购记录添加到固定资产   不添加
    submit_caigoun() {
      // this.caigou_ststus = 1;
      this.submint_caigouinto1();
    },

    //-- 是否将添加的采购记录添加到固定资产      添加
    submit_caigouy() {
      //this.caigou_ststus = 0;

      this.submit_caigouinto2();

      // this.submit_caigouinto();
    },

    //提交采购记录提交函数
    //函数一
    //添加记录  不保存到固定资产中
    submint_caigouinto1(formName) {
      var data = new FormData();
      for (var key in this.caigou_form) {
        if (this.caigou_form[key] != "" && this.caigou_form[key] != null)
          console.log(key, this.caigou_form[key], this.caigou_form, "元数据");
        data.append(key, this.caigou_form[key]);
      }
      this.fileListId = "";
      for (let i of this.$refs.newUpload.fileList) {
        this.fileListId += i.raw.fid + ",";
      }
      data.set("fid", this.fileListId);
      data.delete("createTime");
      data.delete("cgTime");
      if (this.caigou_ststus == 0 && this.lei == 0) {
        this.$http({
          method: "post",
          url: "/ac/pur ",
          data: data,
        }).then((res) => {
          this.$refs.caigou_form.resetFields();
          this.caigou_data();

          console.log(res.data, "13213132132131");
          this.youneed = res.data;
          this.dialogFormVisible_3 = false;
          sessionStorage.removeItem("xid");
          this.reload();
        });
        //修改记录  不保存到固定资产
      } else if (this.caigou_ststus == 1 && this.lei == 1) {
        for (var key in this.caigou_form) {
          if (this.caigou_form[key] != "" && this.caigou_form[key] != null)
            console.log(key, this.caigou_form[key], this.caigou_form, "元数据");
          data.set(key, this.caigou_form[key]);
        }
        // return;
        this.fileListId = "";
        for (let i of this.$refs.newUpload.fileList) {
          this.fileListId += i.raw.fid + ",";
        }
        data.set("fid", this.fileListId);
        data.delete("createTime");
        data.delete("cgTime");
        data.append("need", this.youneed);

        // let aaa = formdata.getAll(data);
        // data.append("fid", this.$refs.newUpload.fileListId);

        // console.log(data.getAll(fid), "data的内容");
        this.$http({
          method: "post",
          url: "/ac/epur",
          data: data,
        }).then((res) => {
          if (res.data == "a") {
            this.$alert("修改的数量必须大于固定资产在用数量", "提示", {
              confirmButtonText: "确定",
            });
          } else {
            this.caigou_data();
            console.log(res.data, "13213132132131");
            console.log(this.tableData_cg, "采购数据");
            this.dialogFormVisible_3 = false;
            sessionStorage.removeItem("xid");
            this.$message({
              message: "保存成功",
              type: "success",
            });
            this.$refs.caigou_form.resetFields();
            this.dialogVisible_8 = false;
            this.dialogFormVisible_3 = false;
            this.reload();
          }
        });
      }
    },
    //函数二  采购记录通过修改是否保存到固定资产和采购记录通过添加是否保存到固定资产
    submit_caigouinto2(formName) {
      var data = new FormData();

      // console.log(data.get("reamrk5"));
      // return;
      // data.append("fid", sessionStorage.getItem("xid"));
      // console.log(data,"采购提交")
      //申请
      //采购记录通过添加保存到固定资产
      console.log(this.caigou_ststus, this.lei == 0);
      if (this.caigou_ststus == 0 && this.lei == 0) {
        for (var key in this.caigou_form) {
          if (this.caigou_form[key] != "" && this.caigou_form[key] != null)
            data.append(key, this.caigou_form[key]);
        }
        this.fileListId = "";
        for (let i of this.$refs.newUpload.fileList) {
          this.fileListId += i.raw.fid + ",";
        }
        data.set("fid", this.fileListId);
        data.delete("createTime");
        data.delete("cgTime");
        this.caigoushengqing(data, "/ac/pur", "/ac/apta");
        //采购记录通过修改保存到固定资产
      } else if (this.caigou_ststus == 1 && this.lei == 1) {
        for (var key in this.caigou_form) {
          if (this.caigou_form[key] != "" && this.caigou_form[key] != null)
            data.append(key, this.caigou_form[key]);
        }
        this.fileListId = "";
        for (let i of this.$refs.newUpload.fileList) {
          this.fileListId += i.raw.fid + ",";
        }
        data.set("fid", this.fileListId);
        data.delete("createTime");
        data.delete("cgTime");
        this.caigoushengqing1(data, "/ac/epur", "/ac/apta");
      }
    },
    caigoushengqing1(datas, e, n) {
      this.$http({
        method: "post",
        url: e,
        data: datas,
      }).then((res) => {
        if (res.data == "a") {
          this.$alert("修改的数量必须大于固定资产在用数量", "提示", {
            confirmButtonText: "确定",
          });
        } else {
          datas.append("ne", res.data);
          this.$http({
            method: "post",
            url: n,
            data: datas,
          }).then((res) => {
            this.$refs.caigou_form.resetFields();
            this.caigou_data();
            this.guding_data();
            sessionStorage.removeItem("xid");
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.dialogVisible_8 = false;
            this.dialogFormVisible_3 = false;
            this.reload();
          });
        }
      });
    },
    caigoushengqing(datas, e, n) {
      this.$http({
        method: "post",
        url: e,
        data: datas,
      }).then((res) => {
        if (res.data == -1) {
          this.$alert("修改的数量必须大于固定资产在用数量", "提示", {
            confirmButtonText: "确定",
          });
        } else {
          datas.append("need", res.data);
          this.$http({
            method: "post",
            url: n,
            data: datas,
          }).then((res) => {
            this.$refs.caigou_form.resetFields();
            this.caigou_data();
            this.guding_data();
            sessionStorage.removeItem("xid");
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.dialogVisible_8 = false;
            this.dialogFormVisible_3 = false;
            this.reload();
          });
        }
      });
    },
    // 采购确认弹窗
    submit_caigou(formName) {
      // data.append("fid", sessionStorage.getItem("xid"));
      // console.log(data,"采购提交")
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible_8 = true;
        } else {
          //alert("信息填写不规范或不完整");
          this.$alert("信息填写不规范或不完整", "提示", {
            confirmButtonText: "确定",
          });
          return false;
        }
      });
    },
    // peizhi(t) {
    //   let data = new FormData();
    //   this.$http.post("/fmc/dpf", data).then(res => {
    //     console.log(res.headers["Content-Disposition"], "res---------");
    //     if (res.headers["content-disposition"]) {
    //       var fileName = res.headers["content-disposition"]
    //         .split(";")[1]
    //         .split("fileName=")[1];
    //       var fileNameUnicode = res.headers["content-disposition"].split(
    //         "filename*="
    //       )[1];
    //       if (fileNameUnicode) {
    //         //当存在 filename* 时，取filename* 并进行解码（为了解决中文乱码问题）
    //         fileName = decodeURIComponent(fileNameUnicode.split("''")[1]);
    //       }
    //       console.log(fileName, "fileName");
    //     }
    //     this.download(res, fileName);
    //   });
    //   // .catch(error => {});
    // },
    //下载
    download(data, fileName) {
      // var myDate = new Date();
      // var mytime = myDate.toLocaleString();
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
    },
    use_cancel() {
      // debugger
      this.$refs.use_data.resetFields();
      this.dialogFormVisible = false;
    },
    submit(formName) {
      console.log(this.user);
      let data = new FormData();
      for (let key in this.use_data) {
        if (this.use_data[key]) data.append(key, this.use_data[key]);
      }
      data.append("wtype", this.xid);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("确认消息填写无误", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info",
          })
            .then(() => {
              this.$http({
                url: "/ac/ua",
                method: "post",
                data: data,
              }).then((res) => {
                if (res.data == -1) {
                  // alert("资产编号已存在");
                  this.$alert("资产编号已存在", "提示", {
                    confirmButtonText: "确定",
                  });
                  this.use_data.reamrk5 = "";
                  return false;
                } else console.log(res);
                this.$refs.use_data.resetFields();
                this.dialogFormVisible = false;
                this.shiyong_data();
                this.guding_data();
              });
            })
            .catch((res) => {});
        } else {
          this.$alert("信息填写不规范或不完整", "提示", {
            confirmButtonText: "确定",
          });
          // document.documentElement.scrollTop = document.body.scrollTop = 0;
          return false;
        }
      });
    },
    use_shenqing() {
      this.dialogFormVisible = true;
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
        this.file_name = this.file_name + "," + tFiles[i].name;
        //开始上传文件 新建一个formData
        let param = new FormData();
        //传值token
        // param.append("t", sessionStorage.getItem("Token"));
        //通过append向form对象添加数据 ！！！图片数据
        param.append("f", tFiles[i]);
        //FormData私有类对象，访问不到，可以通过get判断值是否传进去我的,
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
            this.fid.push(res.data[key].fid);
          }
          console.log(this.fid);
          //特殊需求部分 页面状态
          this.isActive = false;
        });
      }
    },
    //用户页面加载
    load(t) {
      var data = new FormData();
      // data.append("t", t);
      this.$http.post("/uc/gau", data).then((res) => {
        console.log(res);
        if (res.data != -1002 && res.data != null)
          this.options = JSON.parse(JSON.stringify(res.data));
        if (res.data != -1002 && res.data != null)
          this.respon = JSON.parse(JSON.stringify(res.data));
        // console.log(this.options, "this.options213213123123");
      });
    },
    close_dialogTableVisible_1() {
      this.$refs.guding_form.resetFields();
      this.$refs.guding_form.clear_f();
      this.$refs.gudingfujian.fileList = [];
    },
    guding_return(formName) {
      this.$refs[formName].resetFields();
      this.clear_f(this.guding_form);
      console.log(this.guding_form);
      this.guding_status = false;
      this.$refs.gudingfujian.fileList = [];
      this.dialogTableVisible_1 = false;
    },
    guding_queren(formName) {
      let data = new FormData();
      for (let key in this.guding_form) {
        if (this.guding_form[key] != "" && this.guding_form[key] != null)
          data.append(key, this.guding_form[key]);
      }
      data.delete("useLimit");
      this.fileListId = "";
      for (let i of this.$refs.gudingfujian.fileList) {
        this.fileListId += i.raw.fid + ",";
      }
      data.set("fid", this.fileListId);
      // let data = new FormData();
      //提交部分
      // if()data.append("annex", this.fid);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("确认消息填写无误", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info",
          })
            .then(() => {
              if (this.guding_s == 0) {
                data.set("intime", new Date(this.guding_form.intime));
                data.delete("createTime");
                data.delete("usetime");
                data.delete("uname");
                this.$http.post("/ac/ca", data).then((res) => {
                  if (res.data == true) {
                    console.log("提交成功");
                    this.dialogTableVisible_1 = false;
                    this.$refs.gudingfujian.fileList = [];
                    this.guding_data();
                    this.$refs[formName].resetFields();
                    this.$message({
                      message: "提交成功",
                      type: "success",
                    });
                  } else if (res.data == -1) {
                    // alert("编号已存在");
                    this.$alert("编号已存在", "提示", {
                      confirmButtonText: "确定",
                    });
                    this.guding_form.ano = "";
                    return false;
                  }
                });
                //修改部分
              } else if (this.guding_s == 1) {
                data.set("intime", new Date(this.guding_form.intime));
                data.delete("createTime");
                data.delete("usetime");
                this.$http.post("/ac/uum", data).then((res) => {
                  if (res.data == true) {
                    console.log("提交成功");
                    this.dialogTableVisible_1 = false;
                    this.$refs.gudingfujian.fileList = [];
                    this.guding_data();
                    this.$refs[formName].resetFields();
                    this.$message({
                      message: "修改成功",
                      type: "success",
                    });
                  } else if (res.data == -1) {
                    //  alert("编号已存在");
                    this.$alert("编号已存在", "提示", {
                      confirmButtonText: "确定",
                    });
                    this.guding_form.ano = "";
                    return false;
                  }
                });
              }
            })
            .catch((res) => {});
        } else {
          this.$alert("信息填写不规范或不完整", "提示", {
            confirmButtonText: "确定",
          });
        }
      });
    },
    guding_shenqing() {
      this.guding_s = 0;
      this.Upload_showdisable = true;
      this.gudingxaingqing = true;
      this.guding_title = "固定资产添加";
      this.dialogTableVisible_1 = true;
      this.guding_status = true;
    },
    guding_daochu() {
      let a = this.multipleSelection;
      let rids = [];
      for (let key in a) {
        rids.push(a[key].aid);
      }
      // if (rids == "") {
      //   alert("请选择数据导出");
      //   return false;
      // }
      let data = new FormData();
      data.append("rid", rids);
      if (rids == "") {
        this.$confirm("确认导出所有数据", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
        })
          .then(() => {
            this.$http({
              url: "/ac/ear",
              method: "post",
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
              console.log(res);
              console.log(fileName, "文件名");
            });
          })
          .catch((res) => {});
      } else {
        this.$http({
          url: "/ac/ear",
          method: "post",
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
          console.log(res);
          console.log(fileName, "文件名");
        });
      }
    },

    // shiyong_data(){
    //   this.$http({
    //     method: "post",
    //     url: "/ac/af",
    //     data: {},
    //     transformRequest: function(obj) {
    //       var str = [];
    //       for (var p in obj) {
    //         str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    //       }
    //       return str.join("&");
    //     }
    //   }).then(res => {
    //     console.log(res.data)
    //     this. options_1=res.data

    //   });
    // },
    peizhi() {
      var data = new FormData();

      this.$http.post("/ac/al", data).then((res) => {
        if (res.data != -1002 && res.data != null) {
          this.tableData_pz = res.data;
        }
        if (res.data != -1002 && res.data != null) {
          this.caigou_type = res.data;
        }
        if (res.data != -1002 && res.data != null) {
          this.options_1 = res.data;
        }
      });
    },
    //固定资产页面数据加载
    guding_data() {
      var data = new FormData();
      // data.append("c","")
      this.$http({
        method: "post",
        url: "/ac/af",
        data: data,
      }).then((res) => {
        console.log(res.data, "固定资产");
        if (res.data != -1002 && res.data != null) this.tableData_gd = res.data;
        for (var i in res.data) {
          if (res.data[i].usetime < 0) {
            this.tableData_gd[i].usetime = null;
          }
        }
      });
    },
    //固定资产修改按钮
    guding_handleScan(h, id, value, num) {
      let data = new FormData();
      data.set("fid", value.fid);
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
        this.$refs.gudingfujian.fileList = this.fileList;
      });
      if (num == 0) {
        //修改状态改变
        this.Upload_showdisable = true;
        this.guding_s = 1;
        this.guding_title = "固定资产修改";
        this.guding_status = true;
        this.guding_sdat(id);
        this.dialogTableVisible_1 = true;
        this.gudingxaingqing = true;
      } else if (num == 1) {
        this.Upload_showdisable = false;
        this.guding_form = JSON.parse(JSON.stringify(value));
        this.guding_title = "固定资产详情";
        this.dialogTableVisible_1 = true;
        this.gudingxaingqing = false;
      }
    },
    guding_sdat(type) {
      let data = new FormData();
      data.append("id", type);
      this.$http.post("/ac/gu", data).then((res) => {
        this.guding_form = JSON.parse(JSON.stringify(res.data));
        // this.guding_form.atype=Number(res.data.atype);
        console.log(this.guding_form, "asdasd a");
      });
    },
    //固定资产页面数据加载
    // guding_data(){
    //   this.$http.post("/ac/gau").then(res => {
    //     this.tableData_gd=res.data
    //   })
    // },
    //采购审批 数据展示
    caigou_data() {
      let data = new FormData();
      // data.append("t",t)
      // data.append("as", 2);
      this.$http.post("/ac/purl", data).then((res) => {
        if (res.data != -1002) {
          this.tableData_cg = res.data;
          console.log(this.tableData_cg, "采购数据");
        }
      });
    },
    qingli_data() {
      let data = new FormData();
      // data.append("t",t)
      // data.append("as", 2);
      this.$http.post("/ac/acrl", data).then((res) => {
        if (res.data != -1002) {
          this.tableData_ql = res.data;
          console.log(this.tableData_ql, "清理记录");
        }
      });
    },
    //使用审批首页
    shiyong_data(t) {
      let data = new FormData();
      data.append("as", 3);
      this.$http.post("/ac/aul", data).then((res) => {
        if (res.data != -1002 && res.data != null) this.tableData_sy = res.data;
        console.log(res, "使用审批");
      });
    },
    // //固定资产配置首页
    // peizhi(t) {
    //   var data=new FormData();
    //   this.$http.post("/ac/al",data).then(res => {
    //     console.log(res);

    //     // if(res.data) this.tableData_pz = res.data;
    //   });
    // },
    //固定资产类型
    guding_zichan() {
      var data = new FormData();
      this.$http.post("/ac/cf", data).then((res) => {
        console.log(res);
        this.options_2 = res.data;
      });
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      if (key !== "23") {
        this.shiyong_data();
      }
      this.activeIndex = key;
      console.log(this.activeIndex, "activeIndex");

      console.log(key == this.activeIndex);
    },
    //清理记录的修改
    handleEdit(num, value) {
      let b = JSON.parse(JSON.stringify(this.tableData_ql));
      this.qinglijilu_ststus = 1;
      for (var item of b) {
        console.log(item, "11111");
        if (num == item.aid) {
          this.caigou_form = item;
        }
      }
      console.log(item.aid);
      this.qinglijilu_form = JSON.parse(JSON.stringify(value));
      this.dialogformvisible_9 = true;
      // let id = row.sid;
      // let data = new FormData();
      // data.append("rid", id);
      // this.$http.post("/ac/ecrl", data).then(res => {
      //   console.log(res);
      // });
      //console.log(num);
    },
  },
  created() {
    this.peizhi();
  },
  mounted() {
    let a = JSON.parse(sessionStorage.getItem("a"));
    console.log(a, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    for (let item of a) {
      if (item == "21") this.menu.push({ name: "入库登记", id: "21" });
      if (item == "22") this.menu.push({ name: "固定资产", id: "22" });
      if (item == "23") this.menu.push({ name: "领用信息", id: "23" });
      if (item == "25") this.menu.push({ name: "资产类型配置", id: "25" });
      if (item == "24") this.menu.push({ name: "处置记录", id: "24" });

      // if (item == "21") this.menu.push({ name: "使用记录", id: "21" });
      // if (item == "22") this.menu.push({ name: "采购记录", id: "22" });
      // if (item == "23") this.menu.push({ name: "固定资产", id: "23" });
      // if (item == "25") this.menu.push({ name: "固定资产类型", id: "25" });
    }
    console.log(this.menu, "menu");

    this.load();
    this.guding_data();
    this.peizhi();
    this.caigou_data();
    this.shiyong_data();
    this.qingli_data();
    //请求默认地址
    let float = sessionStorage.getItem("float");
    this.float = JSON.parse(float);
    this.activeIndex = this.float.menu_index;
    console.log(this.float, "this.float");
    // console.log(this.tid, "tid");
    // this.handleSelect(this.menu[0].id);
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name !== "information") {
        vm.handleSelect(vm.menu[0].id);
      }
    });
  },
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
body .el-table::before {
  z-index: inherit;
}
.el-table {
  /* color: #070707; */
  z-index: 100;
}
.el-menu,
.el-table--border {
  border: 0;
}
.el-table /deep/ .t_h {
  background-color: #f5f5f5 !important;
  /* color: #070707; */
}
.el-table /deep/ .el-table__row .operation span {
  cursor: pointer;
  border-right: 1px solid #e5e5e5;
  padding: 0 2px;
}
.el-table /deep/ .el-table__row .operation span:last-child {
  border: 0;
}
.Assets {
  background-color: #f5f5f5;
  /* color: grey */
}
.Assets_night {
  background-color: #242635;
  color: grey;
}
.Assets_night >>> .el-menu {
  background: #242635;
}
.Assets_night >>> .el-menu-item {
  color: grey;
}
.Assets_night >>> .content {
  background: #242635;
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
.upload_button {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.colorStatus_red {
  color: #e6a23c;
}
.colorStatus_black {
  color: black;
}
</style>
<style >
.el-table__body tr.current-row > td {
  background-color: #c3e0ff !important;
  /* color: #f19944; */ /* 设置文字颜色，可以选择不设置 */
}
</style>
