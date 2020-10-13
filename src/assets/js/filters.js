let ownstatus_f = value => {
  switch (value) {
    case 0:
      return "未通过";
    case 1:
      return "已通过";
    // case 2:
    //   return '已拒绝'
    case 4:
      return "待审核";
    case null:
      return "待审核";
    default:
      return "异常";
  }
};
let pamduan_zt = value => {
  switch (value) {
    case 1:
      return "审核中"
      break;
    case 0:
      return "已通过"
      break;
    case 2:
      return "不通过"
      break;
  }
}
let ownstatus_f2 = value => {
  switch (value) {
    case 0:
      return "未通过";
    case 1:
      return "已通过";
    // case 2:
    //   return '已拒绝'
    case 4:
      return "待审核";
    case null:
      return "待审核";
    default:
      return "异常";
  }
};
let ownstatus_f3 = value => {
  switch (value) {
    case 0:
      return "未确认";
    case 1:
      return "已确认";
    // case
    //   return '已拒绝'
    case 4:
      return "待审核";
    case null:
      return "审核中";
    default:
      return "异常";
  }
};
let ownstatus_f4 = value => {
  switch (value) {
    case 0:
      return "未确认";
    case 1:
      return "审核中";
    // case
    //   return '已拒绝'
    case 2:
      return "通过";
    case 3:
      return "未通过";
  }
};
let user = JSON.parse(sessionStorage.getItem("user_name"));
// console.log(user,"username-----------------------");
let username_f = value => {
  console.log("开始了-------------");
  if (value == null || value == "") return "暂无";
  if (user != "" && user != null) {
    for (var item of user) {
      // console.log(item.uid,"uid循环");
      if (Number(item.uid) == Number(value)) {
        // console.log("true----------++++++++++++");
        return item.username;
      }
    }
  }
  // console.log(value,"传入的id");
};
let duty_name = JSON.parse(sessionStorage.getItem("duty_name"));
// console.log(duty_name,"duty_name----------------");
let duty_f = value => {
  if (value == null || value == "") return "暂无";
  // console.log(value,"传入数值");
  if (user != "" && user != null) {
    for (var item of duty_name) {
      if (item.did == value) {
        // console.log(item.did,"true----------++++++++++++");
        return item.dname;
      }
    }
  }
};

let qjtime_f = value => {
  value = parseInt(value);
  let divide = value / 24;
  if (divide < 1) {
    return value + "小时";
  } else {
    let date = parseInt(divide);
    let hour = value % 24;
    if (hour == 0) {
      return date + "天";
    } else {
      return date + "天" + hour + "小时";
    }
  }
};
let wtype_f = value => {
  // let vac = JSON.parse(sessionStorage.getItem("vacation"));
  // for (var item of vac) {
  //   if (Number(value) == Number(item.sid)) return item.jiaqileixing;
  // }
  switch(value) {
    case 0: 
    return  "出差"
    case 1:
      return '请假'
    default:
      return '加班'
  }
};
let change = t => {
  if (t < 10) {
    return "0" + t;
  } else {
    return t;
  }
};
let peizhi = JSON.parse(sessionStorage.getItem("peizhi_3"));
// console.log(peizhi,"配置信息");
let peizhi_f = value => {
  if (value == null || value == "") return "暂无";
  // console.log(value,"sid----------++++++++++++");
  if (peizhi != "" && peizhi != null) {
    for (var item of peizhi) {
      if (Number(value) == Number(item.sid)) {
        return item.jiaqileixing;
      } else {
        return "暂无";
      }
    }
  }
};

let time_f = value => {
  if (value == null || value == "") {
    return "";
  } else {
    let date = new Date(value); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + "-",
      M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-",
      D = change(date.getDate()) + "/",
      h = change(date.getHours()) + ":",
      m = change(date.getMinutes());
    let time = Y + M + D + h + m;
    // console.log(time,'time')
    return time;
  }
};

let time_y = value => {
  if (value == null || value == "") {
    return "";
  } else {
    let date = new Date(value); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear()

    let time = Y
    // console.log(time,'time')
    return time;
  }
};

let danwei_t = value => {
  switch (Number(value)) {
    case 0:
      return "中远渔协";
      break;
    case 1:
      return "中远渔协(秘)";
      break;
    case 2:
      return "中远渔协(财)";
      break;
    case 3:
      return "中远渔人字";
      break;
    case 4:
      return "中远渔";
      break;
    case 5:
      return "中远渔（财)";
      break;
    default:
      return "异常";
  }
};
let file_t = value => {
  let a = value.split(".")[0];
  return a;
};
let file_w = value => {
  let a = value.split(".")[1];
  if (a == "files") return "文件夹";
  else {
    return a;
  }
};
let time_t = value => {
  if (value == null || value == "") {
    return "";
  } else {
    let date = new Date(value); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + "-",
      M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-",
      D = change(date.getDate());
    let time = Y + M + D;
    // console.log(time,'time')
    return time;
  }
};
let time_o = value => {
  if (value == null || value == "") {
    return " ";
  } else {
    let date = new Date(value); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + "年",
      M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "月",
      D = change(date.getDate()) + "日";
    let time = Y + M + D;
    // console.log(time,'time')
    return time;
  }
};
let nianyueri = value => {
  if (value == null) {
    return "年-月-日";
  } else {
    let date = new Date(value);
    return date;
  }
};
let allTsutomu_f = value => {
  if (value) return "是";
  else return "否";
};
let status_f = value => {
  if (value == 1) {
    return "同意";
  } else if (value == 2) {
    return "拒绝";
  } else {
    return "审核";
  }
};

export {
  ownstatus_f,
  ownstatus_f2,
  ownstatus_f3,
  ownstatus_f4,
  qjtime_f,
  wtype_f,
  time_f,
  time_t,
  allTsutomu_f,
  status_f,
  username_f,
  duty_f,
  peizhi_f,
  danwei_t,
  nianyueri,
  file_t,
  file_w,
  time_o,
  time_y,
  pamduan_zt
};
