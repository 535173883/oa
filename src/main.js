import Vue from "vue";
import Vuex from "vuex";
import App from "./App";
import Tree from "@/components/tree";
// import Dateform from "@/components/dateform";
import Mupload from "@/components/work/mupload";
import router from "./router";
import ElementUI from "element-ui";
import moment from "moment";
import "element-ui/lib/theme-chalk/index.css";

import "@/assets/iconfont/iconfont.css";
Vue.config.productionTip = false;
//axios发起请求
import axios from "axios";
axios.defaults.baseURL = "http://192.168.4.108:8892/";
//axios.defaults.baseURL = 'http://192.168.4.191:8892/';
Vue.prototype.$http = axios;
Vue.prototype.sytem = "http://192.168.4.108:8892/";
//Vue.prototype.sytem = 'http://192.168.4.191:8892/';
Vue.use(Vuex);
// axios.interceptors.response.use(
//   function (response) { // ①10010 token过期（30天） ②10011 token无效
//     console.log(response,'response')
//     if (response === -1002) {
//       console.log('token已过期--------------------------')
//         // Storage.localRemove('token') // 删除已经失效或过期的token（不删除也可以，因为登录后覆盖）
//         // router.replace({
//         //     path: '/login' // 到登录页重新获取token
//         // })
//     }
//     return response
//   },
//   function (error) {
//     console.log(error,'error')
//     return Promise.reject(error)
//   }
// )
//使用store
const store = new Vuex.Store({
  state: {
    table_data: {}
  },
  mutations: {}
});
//全局清除表单方法（临时）
Vue.prototype.clear_f = function(value) {
  for (var item in value) {
    value[item] = "";
  }
};
//axios拦截器 增加token
axios.interceptors.request.use(
  function(config) {
    let token = sessionStorage.getItem("token");
    console.log("config=", config);
    let data = config.data;
    //  console.log(data.get('t'), "main.js的data")
    if (
      data !== undefined &&
      !data.has("t") &&
      token != null &&
      token != undefined
    )
      data.append("t", token);
    return config;
  },
  function(err) {
    return Promise.reject(err);
  }
);
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
//token失效拦截器
axios.interceptors.response.use(
  response => {
    // console.log(response,'response')
    // console.log(response.data,'response.data')
    if (response.data === "-1001") {
      alert("22222222");
      //token失效判断
      sessionStorage.clear();
      this.$router.push("/");
    } else if (response.data == "-1002") {
      console.log("无访问权限");
    } else if (response.data == "-1003") {
      console.log("无访问权限");
      // sessionStorage.clear();
      // this.$router.push('/')
    }
    return response;
  },

  error => {
    if (error.response) {
      if (error.response.data.code == 401) {
        alert("222222222222222");
      }
    }
    console.log(error.message, "error.message");
    // console.log(error.response.data,'error.message')
    console.log(error, "error");
    return Promise.reject(error);
  }
);

//定义全局过滤器
import * as filters from "./assets/js/filters";
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.prototype.$filters = filters;
Vue.component("tree", Tree);
// Vue.component('dateform',Dateform)
Vue.component("mupload", Mupload);
Vue.use(ElementUI);
// Vue.use(Vuex)

/* eslint-disable no-new */
/** 自定义指令v-has,对按钮权限的控制 **/
Vue.directive("has", {
  bind: function(el) {
    // 每当指令绑定到元素上的时候，会立即执行这个bind函数，只执行一次
    // console.log('绑定时调用')
  },
  updated: function(el) {
    // 当VNode更新的时候，会执行updated，可能会触发多次
    // console.log('更新时调用')
  },
  inserted(el, binding) {
    // inserted 表示元素插入到DOM中的时候，会执行inserted函数，只执行一次
    // console.log(el,'---el')
    // console.log(binding,'---binding')
    // console.log('插入时调用')
    // 获取按钮权限
    if (!Vue.prototype.$_has(binding.value)) {
      //移除不匹配的按钮
      el.parentNode.removeChild(el);
    }
  }
});
Vue.prototype.$_has = function(value) {
  let isExist = false;
  // 从浏览器缓存中获取权限数组
  var a = JSON.parse(sessionStorage.getItem("a"));
  //菜单栏里的权限不能使用v-has设置，否则刷新后会出现bug。页面上的按钮可以使用v-has设置权限
  // let a=["1", "11", "12", "13",  "14", "141", "142", "143",  "2", "21", "211", "212", "213", "214", "22", "23", "24", "241", "242", "243", "25", "251", "252", "253", "3", "31", "311", "312", "313",  "32", "321", "322", "4", "41", "42", "421", "422","43","431","432" , "5", "6", "61", "62", "7", "71", "72", "8", "913", "922", "81", "811", "812", "813", "82", "822", "821", "823", "824", "9", "91", "911", "912", "92", "921","1000","1001"]
  if (a === undefined || a == null) {
    return false;
  } else {
    a.forEach(ele => {
      //匹配缓存中的数据中有没有匹配的值
      if (ele == value) {
        // 若在按钮中定义的权限字段能在后端返回的权限数组中能找到，则该按钮可显示
        isExist = true;
      }
    });
  }
  return isExist;
};
//import store from './store'//引入store

// function duty(value){
//   console.log(value,"23");
//   let duty_1=sessionStorage.getItem("duty_1")
//   console.log(duty_1,"来个回显");
//   for(var item in duty_1){
//     if(value==item.did){
//       console.log(item.dname,"来个回显");
//       return item.dname
//     }
//   }
// }
// Vue.filter("Duty", function(value) {
//   return duty(value);
// });
new Vue({
  el: "#app",
  router,
  store: store, //使用store
  components: { App },
  template: "<App/>"
});
// let duty_1=sessionStorage.getItem("duty_1")
// console.log(duty_1,"2132121");

//定义一个部门、职位过滤器
