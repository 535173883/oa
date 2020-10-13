import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
var nighh =""
console.log(sessionStorage.getItem("night"),"js中的黑夜属性值");
if(sessionStorage.getItem("night")==""){
    nighh=true
}else {
    nighh=sessionStorage.getItem("night")
}
console.log(nighh,"js中的黑夜属性值");
// const store = new Vuex.Store();
const state={
    //要设置的全局访问的state对象
    night: nighh
  };

const getters = {   
    //实时监听state值的变化(最新状态)
    isNight(state) {  
    //方法名随意,主要是来承载变化的showFooter的值
       return state.night
    },
    // getChangedNum(){  //方法名随意,主要是用来承载变化的changableNum的值
    //    return state.changebleNum
    // }
};  
//改变state的值
const mutations = {
    hide(state) {   
//自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
        state.night = false;
        // sessionStorage.setItem("night",state.night)
    },
    show(state){
        state.night = true;
        // sessionStorage.setItem("night",state.night)
    }
    // hide(state) {  //同上
    //     state.showFooter = false;
    // },
    // newNum(state,sum){ //同上，这里面的参数除了state之外还传了需要增加的值sum
    //    state.changableNum+=sum;
    // }
};
const store = new Vuex.Store({
      state,
      getters,
      mutations
   });
export default store;