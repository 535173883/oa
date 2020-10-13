import Vue from "vue";
import Router from "vue-router";
import Root from "@/Root";
import Login from "@/Login";

import Work from "@/components/Work";
import Attendance from "@/components/work/Attendance";
import Assets from "@/components/work/Assets";
import Member from "@/components/work/Member";
import Official from "@/components/work/Official";
import Files from "@/components/work/Files";
import Leave from "@/components/work/Leave";
import OnBusiness from "@/components/work/OnBusiness";
import User from "@/components/work/User";
import Apply from "@/components/work/Apply";
import Overtime from "@/components/work/Overtime";
import Reimburse from "@/components/work/Reimburse";
import Message from "@/components/Message";
import Address from "@/components/Address";
import Manage from "@/components/Manage";
import Personal from "@/components/Personal";
import information from "@/components/work/information";
import Recepiton from "@/components/work/Recepiton";
import Administration from "@/components/work/Administration";

Vue.use(Router);
const router = new Router({
  routes: [
    { path: "/", name: "Login", component: Login },
    { path: "/login", name: "Login", component: Login },
    {
      path: "/root",
      component: Root,
      //配置子路由
      children: [
        { path: "/work", name: "Work", component: Work }, //工作
        { path: "/attendance", name: "Attendance", component: Attendance }, //考勤管理
        { path: "/assets", name: "Assets", component: Assets }, //固定资产
        { path: "/member", name: "Member", component: Member }, //会员单位
        { path: "/official", name: "Official", component: Official }, //公文管理
        { path: "/files", name: "Files", component: Files }, //文件管理
        { path: "/leave", name: "Leave", component: Leave }, //请假
        { path: "/onbusiness", name: "OnBusiness", component: OnBusiness }, //出差
        { path: "/user", name: "User", component: User }, //用户管理
        { path: "/overtime", name: "overtime", component: Overtime }, //用户管理
        { path: "/apply", name: "Apply", component: Apply }, //资费报销
        { path: "/reimburse", name: "Reimburse", component: Reimburse }, //报销
        { path: "/recepiton", name: "Recepiton", component: Recepiton }, //公文接待
        { path: "/Administration", name: "Administration", component: Administration }, //人事管理
        { path: "/message", name: "Message", component: Message }, //消息
        { path: "/address", name: "Address", component: Address }, //通讯录
        { path: "/manage", name: "Manage", component: Manage }, //权限管理
        { path: "/personal", name: "Personal", component: Personal }, //个人信息
        { path: "/information", name: "information", component: information } //未读消息
      ]
    }
  ]
});
// 全局路由守卫
router.beforeEach((to, from, next) => {
  console.log(to, "to");
  // to: Route: 即将要进入的目标 路由对象
  // from: Route: 当前导航正要离开的路由
  // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
  const nextRoute = [
    "Work",
    "Attendance",
    "Assets",
    "Member",
    "Official",
    "Files",
    "Leave",
    "OnBusiness",
    "User",
    "Apply",
    "Message",
    "Address",
    "Manage"
  ];
  let isLogin = false;
  //修改11
  if (to.name == "Login" && to.query.data) {
    let data = JSON.parse(to.query.data);

    console.log(data, "data");
    sessionStorage.setItem("token", data.t);
    sessionStorage.setItem("a", JSON.stringify(data.a));
    router.push("/work");
    // isLogin=true;
  }
  if (sessionStorage.getItem("token")) isLogin = true;
  // 未登录状态；当路由到nextRoute指定页时，跳转至login
  if (nextRoute.indexOf(to.name) >= 0) {
    console.log(isLogin, "isLogin");
    if (!isLogin) {
      console.log("未登录，到其他页面");
      router.push("/login");
    } else {
      next();
    }
  } else {
    next();
  }
});
export default router;
